import { useState, useEffect, useRef, useMemo } from "react";
import html2canvas from "html2canvas";
import idolData from "./idolData.json";

const mbtiInfo = {
  INTJ: { name: "The Architect", description: "INTJs are strategic, independent thinkers with a relentless drive to turn ideas into reality. They hold themselves and others to high standards and are always thinking several steps ahead. Private and confident, they are natural planners who value competence above all else." },
  INTP: { name: "The Thinker", description: "INTPs are analytical, inventive minds who love exploring abstract ideas and theories. Endlessly curious, they prefer to understand the world deeply rather than follow convention. Quiet and flexible, they thrive when given the freedom to think and innovate." },
  ENTJ: { name: "The Commander", description: "ENTJs are bold, decisive leaders who thrive on turning vision into action. Ambitious and strategic, they are natural at organising people toward a goal. They speak their mind, set high standards, and inspire those around them through sheer confidence and drive." },
  ENTP: { name: "The Debater", description: "ENTPs are quick-witted and love a good intellectual challenge. They enjoy playing devil's advocate and are drawn to big ideas and lively debate. Energetic and inventive, they rarely take things at face value and are always looking for a new angle." },
  INFJ: { name: "The Advocate", description: "INFJs are rare, deeply empathetic idealists driven by a strong sense of purpose. Creative and private, they form deep connections and are fiercely loyal to those they care about. Often described as old souls, INFJs balance a rich inner world with a genuine desire to help others." },
  INFP: { name: "The Mediator", description: "INFPs are gentle, imaginative souls guided by strong personal values and a deep empathy for others. They see the best in people and are driven by a desire to make the world more meaningful. Quietly passionate, they express themselves through creativity and compassion." },
  ENFJ: { name: "The Protagonist", description: "ENFJs are charismatic, warm-hearted leaders who naturally inspire and uplift those around them. Deeply attuned to others' emotions, they are driven by a desire to help people reach their potential. Organised and empathetic, they lead with both heart and vision." },
  ENFP: { name: "The Campaigner", description: "ENFPs are enthusiastic, creative free spirits who see life as full of possibility. They connect deeply with people and are endlessly curious about the world around them. Warm and spontaneous, they bring energy and imagination to everything they do." },
  ISTJ: { name: "The Logistician", description: "ISTJs are dependable, detail-oriented individuals who take their responsibilities seriously. They value tradition, loyalty, and hard work, and can always be counted on to follow through. Quiet and methodical, they build stability through consistency and integrity." },
  ISFJ: { name: "The Defender", description: "ISFJs are warm, caring protectors who are deeply committed to the people and causes they believe in. Practical and observant, they go out of their way to show they care. Humble and hardworking, they are the quiet backbone of any group." },
  ESTJ: { name: "The Executive", description: "ESTJs are organised, decisive, and passionate about bringing order to their world. They value tradition, clear expectations, and follow-through. Natural administrators, they take charge with confidence and ensure that things get done properly and on time." },
  ESFJ: { name: "The Consul", description: "ESFJs are warm, sociable, and deeply caring about the happiness of those around them. They thrive on connection and put enormous effort into maintaining harmony in their relationships. Loyal and attentive, they step up to help without being asked." },
  ISTP: { name: "The Virtuoso", description: "ISTPs are practical, observant problem-solvers who love figuring out how things work. Cool and independent, they prefer action over theory and thrive in hands-on situations. They are calm in a crisis and bring quiet confidence to everything they do." },
  ISFP: { name: "The Adventurer", description: "ISFPs are gentle, spontaneous creatives who live fully in the present moment. Deeply in tune with beauty and aesthetics, they express themselves through art, music, and personal style. Kind and open-minded, they prefer to show love through actions rather than words." },
  ESTP: { name: "The Entrepreneur", description: "ESTPs are bold, energetic doers who thrive on excitement and live in the moment. Sharp and perceptive, they are quick to spot opportunities and act on them. Sociable and direct, they love a challenge and bring infectious energy to every room they enter." },
  ESFP: { name: "The Entertainer", description: "ESFPs are vivacious, fun-loving performers who light up every room they enter. They live for connection, excitement, and the joy of the present moment. Spontaneous and generous, they have a natural gift for making people feel included and valued." },
};

const s = {
  page: { minHeight: "100vh", background: "linear-gradient(135deg, #fce4ec 0%, #f3e5f5 50%, #ede7f6 100%)", padding: "24px 16px 48px", fontFamily: "'Segoe UI', sans-serif", color: "#3d2c4e" },
  header: { textAlign: "center", marginBottom: "28px" },
  h1: { fontSize: "2rem", fontWeight: 800, background: "linear-gradient(90deg, #e91e8c, #9c27b0)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", letterSpacing: "-0.5px", margin: 0 },
  tagline: { fontSize: "0.9rem", color: "#7c5c8a", marginTop: "4px" },
  howItWorks: { display: "flex", justifyContent: "center", alignItems: "center", gap: "8px", marginBottom: "28px", flexWrap: "wrap" },
  step: { background: "white", borderRadius: "16px", padding: "12px 20px", display: "flex", alignItems: "center", gap: "10px", boxShadow: "0 2px 12px rgba(156,39,176,0.1)", fontSize: "0.88rem", fontWeight: 600, color: "#6a3d7a" },
  stepArrow: { color: "#ce93d8", fontSize: "1.4rem", flexShrink: 0 },
  card: { background: "white", borderRadius: "24px", padding: "28px", maxWidth: "640px", margin: "0 auto 20px", boxShadow: "0 4px 24px rgba(156,39,176,0.12)" },
  sectionLabel: { fontSize: "0.85rem", fontWeight: 700, color: "#9c27b0", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "8px" },
  searchBar: { display: "flex", alignItems: "center", background: "#fce4ec", border: "2px solid #f48fb1", borderRadius: "14px", padding: "10px 16px", gap: "10px" },
  searchInput: { border: "none", background: "transparent", fontSize: "1rem", color: "#3d2c4e", flex: 1, outline: "none" },
  counter: { fontSize: "0.8rem", color: "#9c27b0", textAlign: "right", marginTop: "6px" },
  dropdown: { background: "white", border: "1.5px solid #f48fb1", borderRadius: "12px", marginTop: "6px", overflow: "hidden", boxShadow: "0 4px 16px rgba(156,39,176,0.12)", maxHeight: "180px", overflowY: "auto", position: "absolute", width: "100%", zIndex: 10 },
  dropdownItem: { padding: "10px 16px", fontSize: "0.92rem", cursor: "pointer", color: "#3d2c4e", borderBottom: "1px solid #fce4ec", display: "flex", justifyContent: "space-between", alignItems: "center" },
  dropdownItemHover: { background: "linear-gradient(90deg, #f48fb1, #ce93d8)", color: "white" },
  mbtiTag: { fontSize: "0.75rem", background: "#f3e5f5", borderRadius: "6px", padding: "1px 7px", color: "#9c27b0", fontWeight: 700 },
  mbtiTagActive: { fontSize: "0.75rem", background: "rgba(255,255,255,0.3)", borderRadius: "6px", padding: "1px 7px", color: "white", fontWeight: 700 },
  selectedSection: { marginTop: "20px" },
  chipsWrap: { display: "flex", flexWrap: "wrap", gap: "8px" },
  chip: { display: "flex", alignItems: "center", gap: "8px", background: "#fce4ec", border: "1.5px solid #f48fb1", borderRadius: "100px", padding: "6px 12px 6px 14px", fontSize: "0.85rem", fontWeight: 600, color: "#3d2c4e" },
  badge: { background: "linear-gradient(90deg, #e91e8c, #9c27b0)", color: "white", fontSize: "0.72rem", fontWeight: 700, borderRadius: "100px", padding: "2px 8px" },
  removeBtn: { background: "none", border: "none", cursor: "pointer", color: "#3d2c4e", fontSize: "1rem", lineHeight: 1, padding: 0 },
  btnRow: { display: "flex", gap: "12px", marginTop: "22px", justifyContent: "center" },
  btnPrimary: { background: "linear-gradient(90deg, #e91e8c, #9c27b0)", color: "white", border: "none", borderRadius: "14px", padding: "12px 28px", fontSize: "1rem", fontWeight: 700, cursor: "pointer", boxShadow: "0 4px 14px rgba(233,30,140,0.35)" },
  btnSecondary: { background: "white", color: "#9c27b0", border: "2px solid #ce93d8", borderRadius: "14px", padding: "12px 22px", fontSize: "1rem", fontWeight: 700, cursor: "pointer" },
  adSlot: { maxWidth: "640px", margin: "0 auto", minHeight: "0px" },
  resultCard: { background: "white", borderRadius: "24px", padding: "28px", maxWidth: "640px", margin: "0 auto 20px", boxShadow: "0 4px 24px rgba(156,39,176,0.12)" },
  resultHeader: { textAlign: "center", marginBottom: "24px" },
  resultLabel: { fontSize: "0.85rem", fontWeight: 700, color: "#9c27b0", textTransform: "uppercase", letterSpacing: "0.5px" },
  resultMbti: { fontSize: "3.5rem", fontWeight: 900, background: "linear-gradient(90deg, #e91e8c, #9c27b0)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", letterSpacing: "6px", margin: "6px 0" },
  resultName: { fontSize: "1rem", color: "#7c5c8a", fontStyle: "italic" },
  blurb: { background: "linear-gradient(135deg, #fce4ec, #f3e5f5)", border: "1.5px solid #f48fb1", borderRadius: "16px", padding: "18px 20px", marginBottom: "24px", fontSize: "0.88rem", color: "#4a3358", lineHeight: 1.65 },
  breakdownSection: { marginBottom: "24px" },
  splitRow: { display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" },
  splitLetterWin: { fontWeight: 800, fontSize: "1rem", color: "#e91e8c", width: "20px", textAlign: "center" },
  splitLetterAlt: { fontWeight: 800, fontSize: "1rem", color: "#bbb", width: "20px", textAlign: "center" },
  splitPctWin: { fontSize: "0.8rem", fontWeight: 700, color: "#9c27b0", width: "34px", textAlign: "right" },
  splitPctAlt: { fontSize: "0.8rem", fontWeight: 700, color: "#bbb", width: "34px", textAlign: "left" },
  splitTrack: { flex: 1, height: "12px", background: "#e0e0e0", borderRadius: "100px", overflow: "hidden", position: "relative" },
  splitFill: { position: "absolute", left: 0, top: 0, height: "100%", background: "linear-gradient(90deg, #e91e8c, #9c27b0)", borderRadius: "100px" },
  shareSection: { marginBottom: "24px", paddingBottom: "24px", borderBottom: "1.5px solid #f3e5f5" },
  shareButtons: { display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "center" },
  shareBtn: { display: "flex", alignItems: "center", justifyContent: "center", width: "44px", height: "44px", borderRadius: "50%", cursor: "pointer", border: "none", textDecoration: "none", transition: "opacity 0.15s" },
  matchingHeader: { display: "flex", alignItems: "baseline", gap: "8px", marginBottom: "12px", flexWrap: "wrap" },
  matchingTitle: { fontSize: "0.85rem", fontWeight: 700, color: "#9c27b0", textTransform: "uppercase", letterSpacing: "0.5px" },
  matchingSubtitle: { fontSize: "0.78rem", color: "#b39ddb", fontStyle: "italic" },
  idolGrid: { display: "flex", flexWrap: "wrap", gap: "8px" },
  idolTag: { background: "#f3e5f5", border: "1.5px solid #ce93d8", borderRadius: "100px", padding: "5px 14px", fontSize: "0.82rem", fontWeight: 600, color: "#6a3d7a" },
  errorMsg: { color: "#e91e8c", fontWeight: 600, fontSize: "0.88rem", marginBottom: "8px", textAlign: "center" },
  navPill: { display: "inline-flex", alignItems: "center", gap: "5px", fontSize: "0.8rem", fontWeight: 700, color: "#9c27b0", textDecoration: "none", background: "white", border: "1.5px solid #e1bee7", borderRadius: "100px", padding: "5px 14px", boxShadow: "0 2px 8px rgba(156,39,176,0.1)" },
  pageTitle: { fontSize: "1.8rem", fontWeight: 800, color: "#3d2c4e", marginTop: "20px", marginBottom: "4px" },
  footer: { textAlign: "center", maxWidth: "640px", margin: "0 auto", fontSize: "0.9rem", color: "#9c6aaa", lineHeight: 1.8 },
  footerDivider: { border: "none", borderTop: "1px solid #e1bee7", margin: "20px 0 14px" },
  footerLink: { color: "#e91e8c", textDecoration: "none" },
};

const mbtiPairs = [["E","I"],["N","S"],["F","T"],["J","P"]];

export default function KpopMbtiPicker() {
  const [idols, setIdols] = useState([]);
  const [selectedIdols, setSelectedIdols] = useState([]);
  const [result, setResult] = useState(null);
  const [letterPercentages, setLetterPercentages] = useState({});
  const [otherLetterPercentages, setOtherLetterPercentages] = useState({});
  const [similarIdols, setSimilarIdols] = useState([]);
  const [totalMatches, setTotalMatches] = useState(0);
  const [search, setSearch] = useState("");
  const searchRef = useRef(null);
  const [showOptions, setShowOptions] = useState(false);
  const [maxReachedMessage, setMaxReachedMessage] = useState("");
  const [hoveredItem, setHoveredItem] = useState(null);
  const [copied, setCopied] = useState(false);
  const [generatingImage, setGeneratingImage] = useState(false);
  const shareCardRef = useRef(null);
  const [groupSearch, setGroupSearch] = useState("");
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [showGroupOptions, setShowGroupOptions] = useState(false);
  const initialPicksRef = useRef(new URLSearchParams(window.location.search).get("picks"));

  useEffect(() => { setIdols(idolData); }, []);

  // Pre-load picks from URL on startup — read from ref so URL sync doesn't clear it first
  useEffect(() => {
    if (idols.length === 0 || !initialPicksRef.current) return;
    const names = initialPicksRef.current.split(",").map(n => n.trim());
    const found = names.map(name => idols.find(i => i["Name (Group)"] === name)).filter(Boolean);
    if (found.length > 0) {
      const picks = found.slice(0, 10);
      setSelectedIdols(picks);
      calculateMbti(picks);
    }
    initialPicksRef.current = null;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idols]);

  // Sync picks to URL
  useEffect(() => {
    const params = new URLSearchParams();
    if (selectedIdols.length > 0) params.set("picks", selectedIdols.map(i => i["Name (Group)"]).join(","));
    const newUrl = selectedIdols.length > 0 ? `${window.location.pathname}?${params.toString()}` : window.location.pathname;
    window.history.replaceState({}, "", newUrl);
  }, [selectedIdols]);

  // Extract unique group names
  const groupNames = useMemo(() => {
    const groups = new Set();
    idols.forEach(idol => {
      const match = idol["Name (Group)"].match(/\(([^)]+)\)/);
      if (match) groups.add(match[1]);
    });
    return [...groups].sort();
  }, [idols]);

  const filteredGroups = groupNames.filter(g => g.toLowerCase().includes(groupSearch.toLowerCase()));

  const groupBreakdown = useMemo(() => {
    if (!selectedGroup) return null;
    const members = idols.filter(idol => idol["Name (Group)"].includes(`(${selectedGroup})`));
    const valid = members.filter(({ Personality }) => Personality && Personality.length === 4 && !Personality.includes("-"));
    const total = valid.length;
    if (total === 0) return { members, consensus: null, letterPct: {}, otherPct: {}, total: members.length };
    const letterCounts = [{}, {}, {}, {}];
    valid.forEach(({ Personality }) => {
      for (let i = 0; i < 4; i++) {
        const l = Personality[i];
        letterCounts[i][l] = (letterCounts[i][l] || 0) + 1;
      }
    });
    const consensus = letterCounts.map(count => Object.keys(count).reduce((a, b) => count[a] >= count[b] ? a : b)).join("");
    const letterPct = {};
    const otherPct = {};
    letterCounts.forEach((count, i) => {
      const win = consensus[i];
      letterPct[win] = ((count[win] / total) * 100).toFixed(0);
      Object.keys(count).forEach(l => {
        if (l !== win) otherPct[l] = ((count[l] / total) * 100).toFixed(0);
      });
    });
    return { members, consensus, letterPct, otherPct, total: members.length };
  }, [selectedGroup, idols]);

  const generateImage = async (download = true) => {
    if (!shareCardRef.current) return;
    setGeneratingImage(true);
    try {
      const canvas = await html2canvas(shareCardRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: null,
      });
      canvas.toBlob(async (blob) => {
        if (download) {
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `kpop-mbti-${result}.png`;
          a.click();
          URL.revokeObjectURL(url);
        } else if (navigator.share) {
          const file = new File([blob], `kpop-mbti-${result}.png`, { type: "image/png" });
          await navigator.share({ files: [file], title: "Kpop MBTI Picker", text: `My K-pop MBTI consensus is ${result} — ${info?.name}!` });
        }
        setGeneratingImage(false);
      }, "image/png");
    } catch (e) {
      setGeneratingImage(false);
    }
  };

  const handleSelect = (idolName) => {
    if (selectedIdols.length >= 10) {
      setMaxReachedMessage("You've reached the maximum of 10 idols. Remove one to add another.");
      return;
    }
    if (selectedIdols.some((idol) => idol["Name (Group)"] === idolName)) return;
    const idol = idols.find((i) => i["Name (Group)"] === idolName);
    setSearch("");
    setSelectedIdols((prev) => {
      const next = [...prev, idol];
      if (next.length >= 10) setMaxReachedMessage("You've reached the maximum of 10 idols. Remove one to add another.");
      else setMaxReachedMessage("");
      return next;
    });
  };

  const closeDropdown = () => {
    setShowOptions(false);
    setSearch("");
  };

  const handleRemove = (idolName) => {
    setSelectedIdols((prev) => {
      const next = prev.filter((idol) => idol["Name (Group)"] !== idolName);
      if (next.length < 10) setMaxReachedMessage("");
      return next;
    });
  };

  const calculateMbti = (idolsToUse = selectedIdols) => {
    const letterCounts = [{}, {}, {}, {}];
    const total = idolsToUse.length;
    idolsToUse.forEach(({ Personality }) => {
      if (Personality && Personality.length === 4) {
        for (let i = 0; i < 4; i++) {
          const l = Personality[i];
          letterCounts[i][l] = (letterCounts[i][l] || 0) + 1;
        }
      }
    });
    const consensus = letterCounts.map((count) =>
      Object.keys(count).reduce((a, b) => (count[a] >= count[b] ? a : b))
    ).join("");
    setResult(consensus);
    const pct = {};
    const other = {};
    letterCounts.forEach((count, i) => {
      const win = consensus[i];
      pct[win] = ((count[win] / total) * 100).toFixed(0);
      Object.keys(count).forEach((l) => {
        if (l !== win) other[l] = ((count[l] / total) * 100).toFixed(0);
      });
    });
    setLetterPercentages(pct);
    setOtherLetterPercentages(other);
    const matches = idols.filter((idol) => idol.Personality === consensus);
    setTotalMatches(matches.length);
    setSimilarIdols(matches.sort(() => 0.5 - Math.random()).slice(0, 20));
  };

  const resetSelection = () => {
    setSelectedIdols([]);
    setResult(null);
    setLetterPercentages({});
    setOtherLetterPercentages({});
    setSimilarIdols([]);
    setTotalMatches(0);
    setSearch("");
    setMaxReachedMessage("");
  };

  const filteredIdols = idols.filter((idol) =>
    idol["Name (Group)"].toLowerCase().includes(search.toLowerCase())
  );

  const info = result ? mbtiInfo[result] : null;

  return (
    <div style={s.page}>

      {/* HEADER */}
      <div style={s.header}>
        <h1 style={s.h1}>✦ Kpop Tools ✦</h1>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", marginTop: "10px", flexWrap: "wrap" }}>
          <a href="/" style={s.navPill}>✨ Kpop MBTI Picker</a>
          <a href="/bulk-cropper" style={s.navPill}>✂️ Kpop Photocard Cropper</a>
        </div>
        <div style={s.pageTitle}>✨ Kpop MBTI Picker</div>
        <p style={s.tagline}>Pick your faves. Discover your MBTI vibe.</p>
      </div>

      {/* HOW IT WORKS */}
      <div style={s.howItWorks}>
        <div style={s.step}><span>🎤</span> Pick up to 10 idols</div>
        <span style={s.stepArrow}>›</span>
        <div style={s.step}><span>✨</span> Calculate MBTI</div>
        <span style={s.stepArrow}>›</span>
        <div style={s.step}><span>💜</span> Discover matches</div>
      </div>

      {/* SEARCH CARD */}
      <div style={s.card}>
        <div style={s.sectionLabel}>Search Idols</div>

        {maxReachedMessage && <p style={s.errorMsg}>{maxReachedMessage}</p>}

        <div style={{ position: "relative" }}>
          <div style={s.searchBar}>
            <span style={{ color: "#e91e8c" }}>🔍</span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onFocus={() => setShowOptions(true)}
              onBlur={() => setTimeout(() => setShowOptions(false), 150)}
              onKeyDown={(e) => e.key === "Escape" && closeDropdown()}
              placeholder="Search by idol name or group..."
              ref={searchRef}
              style={{ ...s.searchInput, opacity: selectedIdols.length >= 10 ? 0.5 : 1 }}
              disabled={selectedIdols.length >= 10}
            />
            {search && (
              <button
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => { setSearch(""); searchRef.current?.focus(); }}
                style={{ background: "none", border: "none", cursor: "pointer", color: "#3d2c4e", fontSize: "1.1rem", lineHeight: 1, padding: 0 }}
              >
                ✕
              </button>
            )}
          </div>
          <div style={s.counter}>{selectedIdols.length} / 10 idols selected</div>

          {showOptions && search && (
            <ul style={{ ...s.dropdown, listStyle: "none", margin: 0, padding: 0 }}>
              {filteredIdols.slice(0, 50).map((idol) => {
                const isSelected = selectedIdols.some((s) => s["Name (Group)"] === idol["Name (Group)"]);
                const isHovered = hoveredItem === idol["Name (Group)"];
                return (
                  <li
                    key={idol["Name (Group)"]}
                    style={isSelected
                      ? { ...s.dropdownItem, background: "#fdf4ff" }
                      : isHovered
                        ? { ...s.dropdownItem, ...s.dropdownItemHover }
                        : s.dropdownItem}
                    onMouseEnter={() => setHoveredItem(idol["Name (Group)"])}
                    onMouseLeave={() => setHoveredItem(null)}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => isSelected ? handleRemove(idol["Name (Group)"]) : handleSelect(idol["Name (Group)"])}
                  >
                    <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <span style={{ width: "16px", color: "#9c27b0", fontWeight: 700, fontSize: "0.9rem" }}>
                        {isSelected ? "✓" : ""}
                      </span>
                      {idol["Name (Group)"]}
                    </span>
                    <span style={isHovered && !isSelected ? s.mbtiTagActive : s.mbtiTag}>
                      {idol.Personality}
                    </span>
                  </li>
                );
              })}
              <li
                onMouseDown={(e) => e.preventDefault()}
                onClick={closeDropdown}
                style={{ padding: "10px 16px", textAlign: "center", fontSize: "0.8rem", fontWeight: 700, color: "#9c27b0", cursor: "pointer", borderTop: "1.5px solid #fce4ec", background: "#fdf4ff" }}
              >
                ✕ Done
              </li>
            </ul>
          )}
        </div>

        {/* SELECTED IDOLS */}
        {selectedIdols.length > 0 && (
          <div style={s.selectedSection}>
            <div style={s.sectionLabel}>Your Picks</div>
            <div style={s.chipsWrap}>
              {selectedIdols.map((idol) => (
                <div key={idol["Name (Group)"]} style={s.chip}>
                  {idol["Name (Group)"]}
                  <span style={s.badge}>{idol.Personality}</span>
                  <button style={s.removeBtn} onClick={() => handleRemove(idol["Name (Group)"])}>✕</button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div style={s.btnRow}>
          <button style={s.btnPrimary} onClick={() => calculateMbti()} disabled={selectedIdols.length === 0}>
            ✨ Get Consensus MBTI
          </button>
          <button style={s.btnSecondary} onClick={resetSelection}>Reset</button>
        </div>
      </div>

      {/* AD SLOT — between search and results */}
      <div style={s.adSlot}>
        {/* Google AdSense ad unit will go here */}
      </div>

      {/* RESULTS CARD */}
      {result && (
        <div style={s.resultCard}>

          {/* MBTI result */}
          <div style={s.resultHeader}>
            <div style={s.resultLabel}>Your Consensus MBTI is</div>
            <div style={s.resultMbti}>{result}</div>
            {info && <div style={s.resultName}>{info.name}</div>}
          </div>

          {/* Personality description */}
          {info && <div style={s.blurb}>{info.description}</div>}

          {/* Share section */}
          <div style={s.shareSection}>
            <div style={{ ...s.sectionLabel, marginBottom: "12px" }}>Share your result 💜</div>
            <div style={s.shareButtons}>
              <a href={`https://wa.me/?text=My%20K-pop%20MBTI%20consensus%20is%20${result}%20%E2%80%94%20${info?.name}!%20Find%20yours%20at%20${encodeURIComponent(window.location.href)}`} target="_blank" rel="noreferrer" style={{ ...s.shareBtn, background: "#25D366" }} title="Share on WhatsApp">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              </a>
              <a href={`https://twitter.com/intent/tweet?text=My%20K-pop%20MBTI%20consensus%20is%20${result}%20%E2%80%94%20${info?.name}!%20Find%20yours%20at%20${encodeURIComponent(window.location.href)}`} target="_blank" rel="noreferrer" style={{ ...s.shareBtn, background: "#000" }} title="Share on X">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.259 5.631 5.905-5.631zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
              <a href={`https://threads.net/intent/post?text=My%20K-pop%20MBTI%20consensus%20is%20${result}%20%E2%80%94%20${info?.name}!%20Find%20yours%20at%20${encodeURIComponent(window.location.href)}`} target="_blank" rel="noreferrer" style={{ ...s.shareBtn, background: "#000" }} title="Share on Threads">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.472 12.01v-.017c.03-3.579.879-6.43 2.525-8.482C5.845 1.205 8.6.024 12.18 0h.014c2.746.02 5.043.725 6.826 2.098 1.677 1.29 2.858 3.13 3.509 5.467l-2.04.569c-1.104-3.96-3.898-5.984-8.304-6.015-2.91.022-5.11.936-6.54 2.717C4.307 6.504 3.616 8.914 3.589 12c.027 3.086.718 5.496 2.057 7.164 1.43 1.783 3.631 2.698 6.54 2.717 2.623-.02 4.358-.631 5.8-2.045 1.647-1.613 1.618-3.593 1.09-4.798-.347-.79-.974-1.448-1.821-1.922-.281 1.626-.87 2.916-1.86 3.803-1.05.938-2.436 1.364-4.241 1.341-1.379-.02-2.577-.468-3.365-1.261-.902-.909-1.207-2.163-.829-3.43.49-1.637 1.849-2.625 3.65-2.625.502 0 1.01.044 1.513.131a21.87 21.87 0 011.311.281c-.069-.42-.127-.81-.175-1.168-.3-2.253.216-3.83 1.536-4.688 1.255-.816 3.046-.77 5.17.133l-.791 1.864c-1.446-.614-2.572-.67-3.27-.22-.674.438-.932 1.454-.71 3.09.098.738.237 1.51.413 2.294 1.024.437 1.876 1.065 2.512 1.85 1.088 1.352 1.43 3.162.916 5.044-.58 2.11-2.003 3.642-4.098 4.447-1.334.511-2.884.763-4.636.763z"/></svg>
              </a>
              <button onClick={() => { navigator.clipboard.writeText(window.location.href).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); }); }} style={{ ...s.shareBtn, background: copied ? "#ce93d8" : "#f3e5f5", border: "1.5px solid #ce93d8" }} title="Copy link with picks">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={copied ? "white" : "#9c27b0"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg>
              </button>
              {navigator.share && (
                <button onClick={() => navigator.share({ title: "Kpop MBTI Picker", text: `My K-pop MBTI consensus is ${result} — ${info?.name}!`, url: window.location.href })} style={{ ...s.shareBtn, background: "linear-gradient(90deg, #e91e8c, #9c27b0)" }} title="Share">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
                </button>
              )}
              <div style={{ display: "flex", gap: "8px", marginLeft: "auto" }}>
                <button onClick={() => generateImage(true)} disabled={generatingImage} style={{ ...s.btnPrimary, fontSize: "0.82rem", padding: "0 14px", height: "44px" }}>
                  {generatingImage ? "Generating..." : "⬇ Save Image 🖼️"}
                </button>
                {navigator.share && (
                  <button onClick={() => generateImage(false)} disabled={generatingImage} style={{ ...s.btnSecondary, fontSize: "0.82rem", padding: "0 14px", height: "44px" }}>
                    Share Image 🖼️
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Breakdown bars */}
          <div style={s.breakdownSection}>
            <div style={s.sectionLabel}>MBTI Breakdown</div>
            {mbtiPairs.map(([a, b]) => {
              const winLetter = result.includes(a) ? a : b;
              const altLetter = winLetter === a ? b : a;
              const winPct = parseInt(letterPercentages[winLetter] || otherLetterPercentages[winLetter] || 0);
              const altPct = parseInt(otherLetterPercentages[altLetter] || letterPercentages[altLetter] || 0);
              return (
                <div key={a + b} style={s.splitRow}>
                  <div style={s.splitLetterWin}>{winLetter}</div>
                  <div style={s.splitPctWin}>{winPct}%</div>
                  <div style={s.splitTrack}><div style={{ ...s.splitFill, width: `${winPct}%` }} /></div>
                  <div style={s.splitPctAlt}>{altPct}%</div>
                  <div style={s.splitLetterAlt}>{altLetter}</div>
                </div>
              );
            })}
          </div>


          {/* Matching idols */}
          {similarIdols.length > 0 && (
            <>
              <div style={s.matchingHeader}>
                <div style={s.matchingTitle}>Idols who are also {result}</div>
                <div style={s.matchingSubtitle}>{totalMatches} idols share this type — showing {similarIdols.length}</div>
              </div>
              <div style={s.idolGrid}>
                {similarIdols.map((idol) => (
                  <span key={idol["Name (Group)"]} style={s.idolTag}>{idol["Name (Group)"]}</span>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* HIDDEN SHARE CARD — captured by html2canvas */}
      {result && (
        <div ref={shareCardRef} style={{
          position: "fixed", top: "-9999px", left: "-9999px",
          width: "540px", height: "540px",
          background: "linear-gradient(135deg, #fce4ec 0%, #f3e5f5 50%, #ede7f6 100%)",
          fontFamily: "'Segoe UI', sans-serif",
          display: "flex", flexDirection: "column",
          padding: "28px", boxSizing: "border-box",
        }}>

          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: "24px" }}>
            <div style={{ fontSize: "18px", fontWeight: 800, color: "#9c27b0", letterSpacing: "2px", textTransform: "uppercase" }}>✦ Kpop MBTI Picker ✦</div>
            <div style={{ fontSize: "12px", fontWeight: 600, color: "#ce93d8", marginTop: "3px", letterSpacing: "0.5px" }}>kpopmbtipicker.com</div>
          </div>

          {/* Two columns */}
          <div style={{ display: "flex", gap: "14px", flex: 1, overflow: "hidden" }}>

            {/* LEFT — My Picks */}
            <div style={{ width: "200px", flexShrink: 0, background: "white", borderRadius: "14px", padding: "12px", display: "flex", flexDirection: "column", overflow: "hidden", alignSelf: "flex-start" }}>
              <div style={{ fontSize: "9px", fontWeight: 700, color: "#9c27b0", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "8px" }}>My Picks</div>
              <div style={{ display: "flex", flexDirection: "column", gap: "5px", overflow: "hidden" }}>
                {selectedIdols.map((idol) => (
                  <div key={idol["Name (Group)"]} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "#fce4ec", borderRadius: "8px", padding: "4px 8px" }}>
                    <span style={{ fontSize: "9px", fontWeight: 600, color: "#3d2c4e", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{idol["Name (Group)"]}</span>
                    <span style={{ background: "#e91e8c", color: "white", borderRadius: "6px", width: "30px", textAlign: "center", fontSize: "8px", fontWeight: 700, flexShrink: 0, marginLeft: "4px" }}>{idol.Personality}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT — Result, summary, bars */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "10px", overflow: "hidden" }}>

              {/* MBTI result */}
              <div style={{ background: "white", borderRadius: "14px", padding: "10px 12px", textAlign: "center" }}>
                <div style={{ fontSize: "9px", fontWeight: 700, color: "#9c27b0", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "2px" }}>Consensus MBTI</div>
                <div style={{ fontSize: "48px", fontWeight: 900, color: "#e91e8c", letterSpacing: "4px", lineHeight: 1 }}>{result}</div>
                <div style={{ fontSize: "12px", color: "#7c5c8a", fontStyle: "italic", marginTop: "2px" }}>{info?.name}</div>
              </div>

              {/* MBTI summary */}
              {info && (
                <div style={{ background: "white", borderRadius: "14px", padding: "10px 12px", fontSize: "9px", color: "#4a3358", lineHeight: 1.6, overflow: "hidden" }}>
                  {info.description}
                </div>
              )}

              {/* Breakdown bars */}
              <div style={{ background: "white", borderRadius: "14px", padding: "10px 12px" }}>
                {mbtiPairs.map(([a, b]) => {
                  const winLetter = result.includes(a) ? a : b;
                  const altLetter = winLetter === a ? b : a;
                  const winPct = parseInt(letterPercentages[winLetter] || otherLetterPercentages[winLetter] || 0);
                  const altPct = parseInt(otherLetterPercentages[altLetter] || letterPercentages[altLetter] || 0);
                  return (
                    <div key={a + b} style={{ display: "flex", alignItems: "center", gap: "5px", marginBottom: "6px" }}>
                      <div style={{ fontWeight: 800, fontSize: "10px", color: "#e91e8c", width: "12px", textAlign: "center" }}>{winLetter}</div>
                      <div style={{ fontWeight: 700, fontSize: "9px", color: "#9c27b0", width: "24px", textAlign: "right" }}>{winPct}%</div>
                      <div style={{ flex: 1, height: "7px", background: "#e0e0e0", borderRadius: "100px", overflow: "hidden", position: "relative" }}>
                        <div style={{ position: "absolute", left: 0, top: 0, height: "100%", width: `${winPct}%`, background: "linear-gradient(90deg, #e91e8c, #9c27b0)", borderRadius: "100px" }} />
                      </div>
                      <div style={{ fontWeight: 700, fontSize: "9px", color: "#bbb", width: "24px" }}>{altPct}%</div>
                      <div style={{ fontWeight: 800, fontSize: "10px", color: "#bbb", width: "12px", textAlign: "center" }}>{altLetter}</div>
                    </div>
                  );
                })}
              </div>

            </div>
          </div>
        </div>
      )}

      {/* GROUP MBTI BREAKDOWN CARD */}
      <div style={s.card}>
        <div style={s.sectionLabel}>Group MBTI Breakdown</div>
        <p style={{ fontSize: "0.85rem", color: "#7c5c8a", marginTop: 0, marginBottom: "12px" }}>Search a group to see their MBTI spread.</p>
        <div style={{ position: "relative" }}>
          <div style={s.searchBar}>
            <span style={{ color: "#e91e8c" }}>🎤</span>
            <input
              type="text"
              value={groupSearch}
              onChange={(e) => { setGroupSearch(e.target.value); setSelectedGroup(null); setShowGroupOptions(true); }}
              onKeyDown={(e) => { if (e.key === "Enter" && filteredGroups.length === 1) { setSelectedGroup(filteredGroups[0]); setGroupSearch(filteredGroups[0]); setShowGroupOptions(false); } }}
              onFocus={() => setShowGroupOptions(true)}
              onBlur={() => setTimeout(() => setShowGroupOptions(false), 150)}
              placeholder="Search group name..."
              style={s.searchInput}
            />
            {groupSearch && (
              <button onClick={() => { setGroupSearch(""); setSelectedGroup(null); }} style={{ background: "none", border: "none", cursor: "pointer", color: "#3d2c4e", fontSize: "1.1rem", lineHeight: 1, padding: 0 }}>✕</button>
            )}
          </div>
          {showGroupOptions && groupSearch && filteredGroups.length > 0 && (
            <ul style={{ ...s.dropdown, listStyle: "none", margin: 0, padding: 0 }}>
              {filteredGroups.slice(0, 30).map(group => (
                <li
                  key={group}
                  style={s.dropdownItem}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => { setSelectedGroup(group); setGroupSearch(group); setShowGroupOptions(false); }}
                >
                  {group}
                </li>
              ))}
            </ul>
          )}
        </div>

        {groupBreakdown && (
          <div style={{ marginTop: "20px" }}>
            {/* Consensus MBTI */}
            {groupBreakdown.consensus && (
              <>
                <div style={{ textAlign: "center", marginBottom: "20px" }}>
                  <div style={s.resultLabel}>{selectedGroup} Consensus MBTI</div>
                  <div style={s.resultMbti}>{groupBreakdown.consensus}</div>
                  {mbtiInfo[groupBreakdown.consensus] && (
                    <div style={s.resultName}>{mbtiInfo[groupBreakdown.consensus].name}</div>
                  )}
                </div>

                {/* Split bars */}
                <div style={{ ...s.breakdownSection, marginBottom: "20px" }}>
                  <div style={s.sectionLabel}>MBTI Breakdown</div>
                  {mbtiPairs.map(([a, b]) => {
                    const winLetter = groupBreakdown.consensus.includes(a) ? a : b;
                    const altLetter = winLetter === a ? b : a;
                    const winPct = parseInt(groupBreakdown.letterPct[winLetter] || groupBreakdown.otherPct[winLetter] || 0);
                    const altPct = parseInt(groupBreakdown.otherPct[altLetter] || groupBreakdown.letterPct[altLetter] || 0);
                    return (
                      <div key={a + b} style={s.splitRow}>
                        <div style={s.splitLetterWin}>{winLetter}</div>
                        <div style={s.splitPctWin}>{winPct}%</div>
                        <div style={s.splitTrack}><div style={{ ...s.splitFill, width: `${winPct}%` }} /></div>
                        <div style={s.splitPctAlt}>{altPct}%</div>
                        <div style={s.splitLetterAlt}>{altLetter}</div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}

            {/* Members */}
            <div style={{ ...s.sectionLabel, marginBottom: "8px" }}>{selectedGroup} Members ({groupBreakdown.total})</div>
            <div style={s.chipsWrap}>
              {groupBreakdown.members.map(idol => (
                <div key={idol["Name (Group)"]} style={s.chip}>
                  {idol["Name (Group)"].replace(` (${selectedGroup})`, "")}
                  <span style={s.badge}>{idol.Personality}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* FOOTER */}
      <div style={{ maxWidth: "640px", margin: "0 auto" }}>
        <hr style={s.footerDivider} />
        <footer style={s.footer}>
          Want an idol added or amended? Fill in this{" "}
          <a href="https://forms.gle/ni6CkCGZPktyCiML8" style={s.footerLink}>form</a> and I'll update the data.<br />
          Enjoyed this? Share it with your fellow fans! 💜 Or{" "}
          <a href="https://buymeacoffee.com/radiantforce" target="_blank" rel="noopener noreferrer" style={s.footerLink}>gift a photocard 🎴</a> to keep my Yuna and Karina collection growing!<br />
          Outreach &amp; feedback:{" "}
          <a href="mailto:kpopmbtipicker@gmail.com" style={s.footerLink}>kpopmbtipicker@gmail.com</a><br /><br />
          <em>Disclaimer: MBTI data is compiled from official and non-official sources and may not be fully accurate.</em>
          <br />
          <span style={{ fontSize: "0.75rem", color: "#c9a0dc" }}>A project by radiantforce</span>
        </footer>
      </div>

    </div>
  );
}
