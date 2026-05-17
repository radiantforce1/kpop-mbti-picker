const fs = require("fs");
const path = require("path");

const idolData = require("../src/idolData.json");

const TARGET_GROUPS = [
  { name: "BLACKPINK",    slug: "blackpink",    agency: "YG Entertainment",       debut: 2016 },
  { name: "aespa",        slug: "aespa",        agency: "SM Entertainment",       debut: 2020 },
  { name: "TWICE",        slug: "twice",        agency: "JYP Entertainment",      debut: 2015 },
  { name: "ITZY",         slug: "itzy",         agency: "JYP Entertainment",      debut: 2019 },
  { name: "ILLIT",        slug: "illit",        agency: "BELIFT LAB",             debut: 2024 },
  { name: "IVE",          slug: "ive",          agency: "Starship Entertainment", debut: 2021 },
  { name: "LE SSERAFIM",  slug: "le-sserafim",  agency: "HYBE Labels",            debut: 2022 },
  { name: "Newjeans",     slug: "newjeans",     agency: "ADOR",                   debut: 2022 },
  { name: "I-DLE",        slug: "i-dle",        agency: "Cube Entertainment",     debut: 2018 },
  { name: "Red Velvet",   slug: "red-velvet",   agency: "SM Entertainment",       debut: 2014 },
  { name: "MAMAMOO",      slug: "mamamoo",      agency: "RBW",                    debut: 2014 },
  { name: "NMIXX",        slug: "nmixx",        agency: "JYP Entertainment",      debut: 2022 },
  { name: "BTS",          slug: "bts",          agency: "Big Hit Music",          debut: 2013 },
  { name: "Stray Kids",   slug: "stray-kids",   agency: "JYP Entertainment",      debut: 2018 },
  { name: "ATEEZ",        slug: "ateez",        agency: "KQ Entertainment",       debut: 2018 },
  { name: "SEVENTEEN",    slug: "seventeen",    agency: "Pledis Entertainment",   debut: 2015 },
  { name: "EXO",          slug: "exo",          agency: "SM Entertainment",       debut: 2012 },
  { name: "TXT",          slug: "txt",          agency: "Big Hit Music",          debut: 2019 },
  { name: "ENHYPEN",      slug: "enhypen",      agency: "BELIFT LAB",             debut: 2020 },
  { name: "GOT7",         slug: "got7",         agency: "JYPE",                   debut: 2014 },
  { name: "MONSTA X",     slug: "monsta-x",     agency: "Starship Entertainment", debut: 2015 },
  { name: "SHINee",       slug: "shinee",       agency: "SM Entertainment",       debut: 2008 },
  { name: "NCT",          slug: "nct",          agency: "SM Entertainment",       debut: 2016 },
];

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

const MBTI_DESCRIPTIONS = {
  INTJ: "INTJs are strategic, independent thinkers with a natural drive for improvement. They combine deep analytical thinking with a clear vision for the future — quiet, but always three steps ahead.",
  INTP: "INTPs are inventive logicians who love exploring ideas and uncovering patterns. Curious and analytical, they think deeply before speaking, and their unique insights often surprise even themselves.",
  ENTJ: "ENTJs are born leaders — confident, decisive, and always thinking big. They have a talent for rallying others around a vision and turning ambitious goals into reality.",
  ENTP: "ENTPs are quick-witted and endlessly curious, thriving on intellectual debate and creative challenges. They love exploring possibilities and rarely back down from a provocative idea.",
  INFJ: "INFJs are rare, deeply empathetic idealists driven by a strong sense of purpose. Creative and private, they form deep connections and are fiercely loyal — often described as old souls.",
  INFP: "INFPs are imaginative, values-driven dreamers who lead with their heart. They feel deeply and care passionately about authenticity, seeking meaning in everything they do.",
  ENFJ: "ENFJs are warm, charismatic leaders who genuinely care about people. Naturally inspiring, they have a gift for bringing out the best in others and championing causes they believe in.",
  ENFP: "ENFPs are enthusiastic free spirits who light up every room they enter. Imaginative and empathetic, they see potential everywhere and approach life with infectious energy.",
  ISTJ: "ISTJs are reliable, methodical, and deeply responsible. They take their commitments seriously and bring consistency and integrity to everything they do — the backbone of any group.",
  ISFJ: "ISFJs are warm, dedicated, and incredibly attentive to the needs of others. They show love through action and are often the quiet glue that holds everything together.",
  ESTJ: "ESTJs are organized, results-driven, and direct. They bring structure and clarity to any situation, setting high standards and following through with discipline.",
  ESFJ: "ESFJs are sociable, caring, and highly attuned to the feelings of others. They thrive on connection and work hard to make the people around them feel supported and valued.",
  ISTP: "ISTPs are cool, resourceful problem-solvers who prefer doing over talking. They have a natural talent for understanding how things work and staying calm under pressure.",
  ISFP: "ISFPs are gentle, creative souls who live in the present. They express themselves through art and action, bringing a quiet warmth and authenticity to everything they create.",
  ESTP: "ESTPs are energetic, bold, and always ready to act. They have a natural gift for reading a room and thrive in fast-paced, dynamic environments.",
  ESFP: "ESFPs are spontaneous, fun-loving entertainers who bring joy wherever they go. They live in the moment and have a magnetic energy that draws people in.",
};

const PAIRS = [["I","E"], ["N","S"], ["F","T"], ["J","P"]];

function computeBreakdown(members) {
  const valid = members.filter(
    ({ Personality }) => Personality && Personality.length === 4 && !Personality.includes("-")
  );
  if (valid.length === 0) return null;

  const counts = [{}, {}, {}, {}];
  valid.forEach(({ Personality }) => {
    for (let i = 0; i < 4; i++) {
      const l = Personality[i];
      counts[i][l] = (counts[i][l] || 0) + 1;
    }
  });

  const consensus = counts.map((count, i) => {
    const [a, b] = PAIRS[i];
    return (count[a] || 0) >= (count[b] || 0) ? a : b;
  }).join("");

  const splits = PAIRS.map(([a, b], i) => {
    const cA = counts[i][a] || 0;
    const cB = counts[i][b] || 0;
    const win = cA >= cB ? a : b;
    const alt = win === a ? b : a;
    const winPct = Math.round((counts[i][win] || 0) / valid.length * 100);
    return { win, alt, winPct, altPct: 100 - winPct };
  });

  return { consensus, splits };
}

const CSS = `
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Segoe UI', sans-serif; background: linear-gradient(135deg, #fce4ec 0%, #f3e5f5 50%, #ede7f6 100%); min-height: 100vh; color: #3d2c4e; padding: 24px 16px 48px; }
    .site-header { text-align: center; margin-bottom: 20px; }
    .site-name { font-size: 2rem; font-weight: 800; background: linear-gradient(90deg, #e91e8c, #9c27b0); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; text-decoration: none; letter-spacing: -0.5px; }
    .site-name:hover { opacity: 0.85; }
    .breadcrumb { text-align: center; font-size: 0.85rem; font-weight: 700; color: #b39ddb; margin-bottom: 24px; }
    .breadcrumb a { color: #e91e8c; text-decoration: none; }
    .card { background: white; border-radius: 24px; padding: 28px; max-width: 640px; margin: 0 auto 20px; box-shadow: 0 4px 24px rgba(156,39,176,0.12); }
    .group-hero { text-align: center; }
    .group-label { font-size: 0.75rem; font-weight: 700; color: #9c27b0; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px; }
    .group-name { font-size: 2.4rem; font-weight: 900; background: linear-gradient(90deg, #e91e8c, #9c27b0); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; margin-bottom: 6px; }
    .group-meta { font-size: 0.85rem; color: #9c6aaa; margin-bottom: 24px; }
    .consensus-label { font-size: 0.75rem; font-weight: 700; color: #9c27b0; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px; }
    .consensus-mbti { font-size: 3rem; font-weight: 900; background: linear-gradient(90deg, #e91e8c, #9c27b0); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; letter-spacing: 6px; margin-bottom: 4px; }
    .consensus-name { font-size: 0.95rem; color: #7c5c8a; font-style: italic; margin-bottom: 20px; }
    .cta-btn { display: inline-block; background: linear-gradient(90deg, #e91e8c, #9c27b0); color: white; border-radius: 14px; padding: 14px 32px; font-size: 1rem; font-weight: 700; text-decoration: none; box-shadow: 0 4px 14px rgba(233,30,140,0.35); }
    .section-label { font-size: 0.85rem; font-weight: 700; color: #9c27b0; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 16px; }
    .split-row { display: flex; align-items: center; gap: 8px; margin-bottom: 12px; }
    .split-letter-win { font-weight: 800; font-size: 1rem; color: #e91e8c; width: 20px; text-align: center; }
    .split-letter-alt { font-weight: 800; font-size: 1rem; color: #bbb; width: 20px; text-align: center; }
    .split-pct-win { font-size: 0.8rem; font-weight: 700; color: #9c27b0; width: 34px; text-align: right; }
    .split-pct-alt { font-size: 0.8rem; font-weight: 700; color: #bbb; width: 34px; }
    .split-track { flex: 1; height: 12px; background: #e0e0e0; border-radius: 100px; overflow: hidden; position: relative; }
    .split-fill { position: absolute; left: 0; top: 0; height: 100%; background: linear-gradient(90deg, #e91e8c, #9c27b0); border-radius: 100px; }
    .members-grid { display: flex; flex-direction: column; gap: 10px; }
    .member-row { display: flex; align-items: center; justify-content: space-between; background: #fdf4ff; border: 1.5px solid #f3e5f5; border-radius: 14px; padding: 12px 16px; }
    .member-name { font-size: 0.95rem; font-weight: 700; color: #3d2c4e; }
    .member-right { display: flex; align-items: center; gap: 10px; }
    .member-mbti-name { font-size: 0.8rem; color: #9c6aaa; font-style: italic; }
    .member-badge { background: linear-gradient(90deg, #e91e8c, #9c27b0); color: white; font-size: 0.78rem; font-weight: 700; border-radius: 100px; padding: 4px 12px; }
    .description-text { font-size: 0.9rem; color: #4a3358; line-height: 1.7; background: linear-gradient(135deg, #fce4ec, #f3e5f5); border: 1.5px solid #f48fb1; border-radius: 16px; padding: 18px 20px; }
    .back-link { display: block; text-align: center; margin: 0 auto 20px; max-width: 640px; font-size: 0.85rem; color: #e91e8c; text-decoration: none; font-weight: 600; }
`;

function generateGroupPage(group, members, breakdown) {
  const picksVal = members.map(m => m["Name (Group)"]).join(",");
  const picksUrl = `/?picks=${encodeURIComponent(picksVal)}`;
  const consensus = breakdown ? breakdown.consensus : null;
  const typeName = consensus ? (MBTI_NAMES[consensus] || "") : "";
  const description = consensus ? (MBTI_DESCRIPTIONS[consensus] || "") : "";

  const splitBars = breakdown
    ? breakdown.splits.map(({ win, alt, winPct, altPct }) => `
    <div class="split-row">
      <div class="split-letter-win">${win}</div>
      <div class="split-pct-win">${winPct}%</div>
      <div class="split-track"><div class="split-fill" style="width:${winPct}%"></div></div>
      <div class="split-pct-alt">${altPct}%</div>
      <div class="split-letter-alt">${alt}</div>
    </div>`).join("")
    : "<p style='color:#bbb;font-size:0.85rem'>Not enough MBTI data</p>";

  const memberRows = members.map(m => {
    const shortName = m["Name (Group)"].replace(/ \([^)]+\)$/, "");
    const mbti = m.Personality;
    const mTypeName = MBTI_NAMES[mbti] || "";
    return `
    <div class="member-row">
      <div class="member-name">${shortName}</div>
      <div class="member-right">
        ${mTypeName ? `<div class="member-mbti-name">${mTypeName}</div>` : ""}
        ${mbti ? `<div class="member-badge">${mbti}</div>` : ""}
      </div>
    </div>`;
  }).join("");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${group.name} MBTI Personalities | Kpop MBTI Picker</title>
  <meta name="description" content="Discover the MBTI personality types of all ${group.name} members.${consensus ? ` Group consensus: ${consensus} (${typeName}).` : ""} Pick your favorites on Kpop MBTI Picker." />
  <link rel="canonical" href="https://kpopmbtipicker.com/groups/${group.slug}" />
  <meta property="og:title" content="${group.name} MBTI Personalities | Kpop MBTI Picker" />
  <meta property="og:description" content="See every ${group.name} member's MBTI type and add them to your personality picker!" />
  <meta property="og:url" content="https://kpopmbtipicker.com/groups/${group.slug}" />
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="Kpop MBTI Picker" />
  <meta name="twitter:card" content="summary" />
  <style>${CSS}</style>
</head>
<body>

  <div class="site-header">
    <a href="/" class="site-name">✦ Kpop MBTI Picker ✦</a>
  </div>

  <div class="breadcrumb">
    <a href="/">Home</a> › <a href="/groups/">Groups</a> › ${group.name}
  </div>

  <div class="card group-hero">
    <div class="group-label">Group Profile</div>
    <div class="group-name">${group.name}</div>
    <div class="group-meta">${members.length} members · ${group.agency} · Debuted ${group.debut}</div>
    ${consensus ? `
    <div class="consensus-label">Group Consensus MBTI</div>
    <div class="consensus-mbti">${consensus}</div>
    <div class="consensus-name">${typeName}</div>` : ""}
    <a href="${picksUrl}" class="cta-btn">✨ Add ${group.name} to my picker</a>
  </div>

  ${description ? `
  <div class="card">
    <div class="section-label">About ${consensus} — ${typeName}</div>
    <div class="description-text">${description}</div>
  </div>` : ""}

  ${breakdown ? `
  <div class="card">
    <div class="section-label">MBTI Breakdown</div>
    ${splitBars}
  </div>` : ""}

  <div class="card">
    <div class="section-label">Members</div>
    <div class="members-grid">${memberRows}
    </div>
  </div>

  <a href="/" class="back-link">← Back to Kpop MBTI Picker</a>

</body>
</html>`;
}

function generateGroupsIndex(groups) {
  const groupCards = groups.map(({ group, members, breakdown }) => {
    const consensus = breakdown ? breakdown.consensus : null;
    const typeName = consensus ? (MBTI_NAMES[consensus] || "") : "";
    return `
    <a href="/groups/${group.slug}/" class="group-card">
      <div class="gc-name">${group.name}</div>
      <div class="gc-meta">${members.length} members · ${group.debut}</div>
      ${consensus ? `<div class="gc-mbti">${consensus}</div><div class="gc-type">${typeName}</div>` : `<div class="gc-type">—</div>`}
    </a>`;
  }).join("");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Kpop Group MBTI Profiles | Kpop MBTI Picker</title>
  <meta name="description" content="Browse MBTI personality profiles for the biggest Kpop groups — BLACKPINK, BTS, TWICE, aespa, Stray Kids, SEVENTEEN, and more." />
  <link rel="canonical" href="https://kpopmbtipicker.com/groups" />
  <meta property="og:title" content="Kpop Group MBTI Profiles | Kpop MBTI Picker" />
  <meta property="og:description" content="Browse MBTI personality profiles for the biggest Kpop groups." />
  <meta property="og:url" content="https://kpopmbtipicker.com/groups" />
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="Kpop MBTI Picker" />
  <meta name="twitter:card" content="summary" />
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Segoe UI', sans-serif; background: linear-gradient(135deg, #fce4ec 0%, #f3e5f5 50%, #ede7f6 100%); min-height: 100vh; color: #3d2c4e; padding: 24px 16px 48px; }
    .site-header { text-align: center; margin-bottom: 20px; }
    .site-name { font-size: 2rem; font-weight: 800; background: linear-gradient(90deg, #e91e8c, #9c27b0); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; text-decoration: none; letter-spacing: -0.5px; }
    .site-name:hover { opacity: 0.85; }
    .breadcrumb { text-align: center; font-size: 0.85rem; font-weight: 700; color: #b39ddb; margin-bottom: 24px; }
    .breadcrumb a { color: #e91e8c; text-decoration: none; }
    .page-title { text-align: center; font-size: 1.8rem; font-weight: 900; background: linear-gradient(90deg, #e91e8c, #9c27b0); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; margin-bottom: 8px; }
    .page-sub { text-align: center; font-size: 0.9rem; color: #9c6aaa; margin-bottom: 28px; }
    .groups-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 14px; max-width: 680px; margin: 0 auto 32px; }
    .group-card { background: white; border-radius: 20px; padding: 20px 22px; text-decoration: none; box-shadow: 0 4px 20px rgba(156,39,176,0.10); display: block; transition: transform 0.15s, box-shadow 0.15s; }
    .group-card:hover { transform: translateY(-2px); box-shadow: 0 6px 28px rgba(156,39,176,0.18); }
    .gc-name { font-size: 1.15rem; font-weight: 800; color: #3d2c4e; margin-bottom: 2px; }
    .gc-meta { font-size: 0.78rem; color: #b39ddb; margin-bottom: 10px; }
    .gc-mbti { font-size: 1.5rem; font-weight: 900; background: linear-gradient(90deg, #e91e8c, #9c27b0); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; letter-spacing: 3px; }
    .gc-type { font-size: 0.8rem; color: #9c6aaa; font-style: italic; }
    .back-link { display: block; text-align: center; margin: 0 auto; max-width: 640px; font-size: 0.85rem; color: #e91e8c; text-decoration: none; font-weight: 600; }
  </style>
</head>
<body>
  <div class="site-header">
    <a href="/" class="site-name">✦ Kpop MBTI Picker ✦</a>
  </div>
  <div class="breadcrumb">
    <a href="/">Home</a> › Groups
  </div>
  <div class="page-title">Group Profiles</div>
  <div class="page-sub">Browse MBTI personalities for your favourite Kpop groups</div>
  <div class="groups-grid">${groupCards}
  </div>
  <a href="/" class="back-link">← Back to Kpop MBTI Picker</a>
</body>
</html>`;
}

// --- Main ---
const results = [];

TARGET_GROUPS.forEach(group => {
  const members = idolData.filter(idol =>
    idol["Name (Group)"].endsWith(`(${group.name})`)
  );

  if (members.length === 0) {
    console.log(`⚠️  No members found for ${group.name}`);
    return;
  }

  const breakdown = computeBreakdown(members);
  const html = generateGroupPage(group, members, breakdown);

  const outDir = path.join(__dirname, "..", "public", "groups", group.slug);
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, "index.html"), html, "utf8");

  results.push({ group, members, breakdown });
  console.log(`✅ ${group.name} → /groups/${group.slug}  (${members.length} members, consensus: ${breakdown ? breakdown.consensus : "N/A"})`);
});

// Groups index
const indexHtml = generateGroupsIndex(results);
const indexDir = path.join(__dirname, "..", "public", "groups");
fs.mkdirSync(indexDir, { recursive: true });
fs.writeFileSync(path.join(indexDir, "index.html"), indexHtml, "utf8");
console.log(`✅ Groups index → /groups`);