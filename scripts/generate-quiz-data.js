const fs = require("fs");
const path = require("path");
const idolData = require("../src/idolData.json");

const PAIRS = [["I","E"], ["N","S"], ["F","T"], ["J","P"]];

const MBTI_NAMES = {
  INTJ: "The Architect",    INTP: "The Logician",
  ENTJ: "The Commander",    ENTP: "The Debater",
  INFJ: "The Advocate",     INFP: "The Mediator",
  ENFJ: "The Protagonist",  ENFP: "The Campaigner",
  ISTJ: "The Logistician",  ISFJ: "The Defender",
  ESTJ: "The Executive",    ESFJ: "The Consul",
  ISTP: "The Virtuoso",     ISFP: "The Adventurer",
  ESTP: "The Entrepreneur", ESFP: "The Entertainer",
};

function extractGroup(nameGroup) {
  const idx = nameGroup.lastIndexOf("(");
  if (idx === -1) return null;
  return nameGroup.slice(idx + 1, -1);
}

function extractName(nameGroup) {
  const idx = nameGroup.lastIndexOf("(");
  if (idx === -1) return nameGroup;
  return nameGroup.slice(0, idx).trim();
}

const groupMap = {};
idolData.forEach(idol => {
  const group = extractGroup(idol["Name (Group)"]);
  if (!group) return;
  const mbti = idol["Personality"];
  if (!mbti || mbti.length !== 4 || mbti.includes("-")) return;
  if (!groupMap[group]) groupMap[group] = [];
  groupMap[group].push({ name: extractName(idol["Name (Group)"]), mbti });
});

// Include former group members in their former groups' consensus
idolData.forEach(idol => {
  if (!idol["Former Groups"] || !idol["Former Groups"].length) return;
  const mbti = idol["Personality"];
  if (!mbti || mbti.length !== 4 || mbti.includes("-")) return;
  const name = extractName(idol["Name (Group)"]);
  idol["Former Groups"].forEach(formerGroup => {
    if (!groupMap[formerGroup]) return;
    if (!groupMap[formerGroup].some(m => m.name === name)) {
      groupMap[formerGroup].push({ name, mbti });
    }
  });
});

function computeDifficulty(members) {
  const n = members.length;

  // Dimension tightness: how close each split is to 50/50 (0=easy, 1=hard)
  const counts = [{}, {}, {}, {}];
  members.forEach(({ mbti }) => {
    for (let i = 0; i < 4; i++) {
      const l = mbti[i];
      counts[i][l] = (counts[i][l] || 0) + 1;
    }
  });
  const tightnessScore = PAIRS.reduce((sum, [a], i) => {
    const cA = counts[i][a] || 0;
    const winPct = Math.max(cA, n - cA) / n * 100;
    return sum + (100 - winPct) / 50;
  }, 0) / 4;

  // MBTI variety: unique types relative to member count (0=easy, 1=hard)
  const uniqueTypes = new Set(members.map(m => m.mbti)).size;
  const varietyScore = n > 1 ? (uniqueTypes - 1) / (n - 1) : 0;

  // Member count: soft scale, maxes at 12+ members
  const memberScore = Math.min(n - 2, 10) / 10;

  return 0.45 * tightnessScore + 0.45 * varietyScore + 0.1 * memberScore;
}

function computeBreakdown(members) {
  const counts = [{}, {}, {}, {}];
  members.forEach(({ mbti }) => {
    for (let i = 0; i < 4; i++) {
      const l = mbti[i];
      counts[i][l] = (counts[i][l] || 0) + 1;
    }
  });
  const consensus = counts.map((count, i) => {
    const [a, b] = PAIRS[i];
    return (count[a] || 0) >= (count[b] || 0) ? a : b;
  }).join("");
  const splits = PAIRS.map(([a, b], i) => {
    const total = members.length;
    const cA = counts[i][a] || 0;
    const cB = counts[i][b] || 0;
    const win = cA >= cB ? a : b;
    const alt = win === a ? b : a;
    const winCount = counts[i][win] || 0;
    const altCount = counts[i][alt] || 0;
    const winPct = Math.round(winCount / total * 100);
    return { win, alt, winPct, altPct: 100 - winPct, winCount, altCount };
  });
  return { consensus, splits };
}

const LABELS = ['Easy', 'Medium', 'Hard', 'Very Hard', 'Expert'];

// First pass: compute raw scores for all groups
const scored = [];
Object.entries(groupMap).forEach(([group, members]) => {
  if (members.length < 2) return;
  scored.push({ group, score: computeDifficulty(members) });
});

// Percentile thresholds for even distribution: 20/40/60/80
const sortedScores = scored.map(s => s.score).sort((a, b) => a - b);
const pct = p => sortedScores[Math.floor(sortedScores.length * p)];
const thresholds = [pct(0.2), pct(0.4), pct(0.6), pct(0.8)];

function starsFromScore(score) {
  if (score < thresholds[0]) return 1;
  if (score < thresholds[1]) return 2;
  if (score < thresholds[2]) return 3;
  if (score < thresholds[3]) return 4;
  return 5;
}

const scoreMap = Object.fromEntries(scored.map(s => [s.group, s.score]));

const output = {};
Object.entries(groupMap).forEach(([group, members]) => {
  if (members.length < 2) return;
  const breakdown = computeBreakdown(members);
  const score = scoreMap[group];
  const stars = starsFromScore(score);
  output[group] = {
    display: group,
    consensus: breakdown.consensus,
    consensusName: MBTI_NAMES[breakdown.consensus] || "",
    splits: breakdown.splits,
    difficulty: { stars, label: LABELS[stars - 1] },
    members,
  };
});

const outPath = path.join(__dirname, "..", "public", "quiz-data.json");
fs.writeFileSync(outPath, JSON.stringify(output), "utf8");
console.log(`✅ Quiz data: ${Object.keys(output).length} groups → public/quiz-data.json`);
