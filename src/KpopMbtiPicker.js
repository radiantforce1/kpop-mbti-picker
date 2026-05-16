import { useState, useEffect, useRef } from "react";
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
  tagline: { fontSize: "0.95rem", color: "#7c5c8a", marginTop: "6px" },
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
  removeBtn: { background: "none", border: "none", cursor: "pointer", color: "#ce93d8", fontSize: "1rem", lineHeight: 1, padding: 0 },
  btnRow: { display: "flex", gap: "12px", marginTop: "22px", justifyContent: "center" },
  btnPrimary: { background: "linear-gradient(90deg, #e91e8c, #9c27b0)", color: "white", border: "none", borderRadius: "14px", padding: "12px 28px", fontSize: "1rem", fontWeight: 700, cursor: "pointer", boxShadow: "0 4px 14px rgba(233,30,140,0.35)" },
  btnSecondary: { background: "white", color: "#9c27b0", border: "2px solid #ce93d8", borderRadius: "14px", padding: "12px 22px", fontSize: "1rem", fontWeight: 700, cursor: "pointer" },
  adSlot: { maxWidth: "640px", margin: "0 auto 20px", minHeight: "90px" },
  resultCard: { background: "white", borderRadius: "24px", padding: "28px", maxWidth: "640px", margin: "0 auto 20px", boxShadow: "0 4px 24px rgba(156,39,176,0.12)" },
  resultHeader: { textAlign: "center", marginBottom: "24px" },
  resultLabel: { fontSize: "0.85rem", fontWeight: 700, color: "#9c27b0", textTransform: "uppercase", letterSpacing: "0.5px" },
  resultMbti: { fontSize: "3.5rem", fontWeight: 900, background: "linear-gradient(90deg, #e91e8c, #9c27b0)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", letterSpacing: "6px", margin: "6px 0" },
  resultName: { fontSize: "1rem", color: "#7c5c8a", fontStyle: "italic" },
  blurb: { background: "linear-gradient(135deg, #fce4ec, #f3e5f5)", border: "1.5px solid #f48fb1", borderRadius: "16px", padding: "18px 20px", marginBottom: "24px", fontSize: "0.88rem", color: "#4a3358", lineHeight: 1.65 },
  breakdownSection: { marginBottom: "24px" },
  barRow: { display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" },
  barLetter: { fontWeight: 800, fontSize: "0.95rem", width: "18px", color: "#e91e8c" },
  barLetterAlt: { fontWeight: 800, fontSize: "0.95rem", width: "18px", color: "#bbb" },
  barTrack: { flex: 1, background: "#fce4ec", borderRadius: "100px", height: "10px", overflow: "hidden" },
  barFill: { height: "100%", borderRadius: "100px", background: "linear-gradient(90deg, #f48fb1, #9c27b0)" },
  barFillAlt: { height: "100%", borderRadius: "100px", background: "linear-gradient(90deg, #e0e0e0, #bdbdbd)" },
  barPct: { fontSize: "0.8rem", fontWeight: 700, color: "#7c5c8a", width: "38px", textAlign: "right" },
  barPctAlt: { fontSize: "0.8rem", fontWeight: 700, color: "#bbb", width: "38px", textAlign: "right" },
  matchingHeader: { display: "flex", alignItems: "baseline", gap: "8px", marginBottom: "12px", flexWrap: "wrap" },
  matchingTitle: { fontSize: "0.85rem", fontWeight: 700, color: "#9c27b0", textTransform: "uppercase", letterSpacing: "0.5px" },
  matchingSubtitle: { fontSize: "0.78rem", color: "#b39ddb", fontStyle: "italic" },
  idolGrid: { display: "flex", flexWrap: "wrap", gap: "8px" },
  idolTag: { background: "#f3e5f5", border: "1.5px solid #ce93d8", borderRadius: "100px", padding: "5px 14px", fontSize: "0.82rem", fontWeight: 600, color: "#6a3d7a" },
  errorMsg: { color: "#e91e8c", fontWeight: 600, fontSize: "0.88rem", marginBottom: "8px", textAlign: "center" },
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

  useEffect(() => { setIdols(idolData); }, []);

  const handleSelect = (idolName) => {
    if (selectedIdols.length >= 10) {
      setMaxReachedMessage("You've reached the maximum of 10 idols. Remove one to add another.");
      return;
    }
    if (selectedIdols.some((idol) => idol["Name (Group)"] === idolName)) return;
    const idol = idols.find((i) => i["Name (Group)"] === idolName);
    setSelectedIdols((prev) => {
      const next = [...prev, idol];
      if (next.length >= 10) setMaxReachedMessage("You've reached the maximum of 10 idols. Remove one to add another.");
      else setMaxReachedMessage("");
      return next;
    });
    setSearch("");
    setShowOptions(false);
    setTimeout(() => searchRef.current?.focus(), 200);
  };

  const handleRemove = (idolName) => {
    setSelectedIdols((prev) => {
      const next = prev.filter((idol) => idol["Name (Group)"] !== idolName);
      if (next.length < 10) setMaxReachedMessage("");
      return next;
    });
  };

  const calculateMbti = () => {
    const letterCounts = [{}, {}, {}, {}];
    const total = selectedIdols.length;
    selectedIdols.forEach(({ Personality }) => {
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

  const filteredIdols = idols.filter(
    (idol) =>
      idol["Name (Group)"].toLowerCase().includes(search.toLowerCase()) &&
      !selectedIdols.some((s) => s["Name (Group)"] === idol["Name (Group)"])
  );

  const info = result ? mbtiInfo[result] : null;

  return (
    <div style={s.page}>

      {/* HEADER */}
      <div style={s.header}>
        <h1 style={s.h1}>✦ Kpop MBTI Picker ✦</h1>
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
              placeholder="Search by idol name or group..."
              ref={searchRef}
              style={{ ...s.searchInput, opacity: selectedIdols.length >= 10 ? 0.5 : 1 }}
              disabled={selectedIdols.length >= 10}
            />
          </div>
          <div style={s.counter}>{selectedIdols.length} / 10 idols selected</div>

          {showOptions && search && (
            <ul style={{ ...s.dropdown, listStyle: "none", margin: 0, padding: 0 }}>
              {filteredIdols.slice(0, 50).map((idol) => (
                <li
                  key={idol["Name (Group)"]}
                  style={hoveredItem === idol["Name (Group)"]
                    ? { ...s.dropdownItem, ...s.dropdownItemHover }
                    : s.dropdownItem}
                  onMouseEnter={() => setHoveredItem(idol["Name (Group)"])}
                  onMouseLeave={() => setHoveredItem(null)}
                  onClick={() => handleSelect(idol["Name (Group)"])}
                >
                  <span>{idol["Name (Group)"]}</span>
                  <span style={hoveredItem === idol["Name (Group)"] ? s.mbtiTagActive : s.mbtiTag}>
                    {idol.Personality}
                  </span>
                </li>
              ))}
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
          <button style={s.btnPrimary} onClick={calculateMbti} disabled={selectedIdols.length === 0}>
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

          {/* Breakdown bars */}
          <div style={s.breakdownSection}>
            <div style={s.sectionLabel}>MBTI Breakdown</div>
            {mbtiPairs.map(([a, b]) => {
              const winLetter = result.includes(a) ? a : b;
              const altLetter = winLetter === a ? b : a;
              const winPct = parseInt(letterPercentages[winLetter] || otherLetterPercentages[winLetter] || 0);
              const altPct = parseInt(otherLetterPercentages[altLetter] || letterPercentages[altLetter] || 0);
              return (
                <div key={a + b} style={{ marginBottom: "10px" }}>
                  <div style={s.barRow}>
                    <div style={s.barLetter}>{winLetter}</div>
                    <div style={s.barTrack}><div style={{ ...s.barFill, width: `${winPct}%` }} /></div>
                    <div style={s.barPct}>{winPct}%</div>
                  </div>
                  <div style={s.barRow}>
                    <div style={s.barLetterAlt}>{altLetter}</div>
                    <div style={s.barTrack}><div style={{ ...s.barFillAlt, width: `${altPct}%` }} /></div>
                    <div style={s.barPctAlt}>{altPct}%</div>
                  </div>
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

      {/* FOOTER */}
      <div style={{ maxWidth: "640px", margin: "0 auto" }}>
        <hr style={s.footerDivider} />
        <footer style={s.footer}>
          Want an idol added or amended? Fill in this{" "}
          <a href="https://forms.gle/ni6CkCGZPktyCiML8" style={s.footerLink}>form</a> and I'll update the data.<br />
          Enjoyed this? Share it with your fellow fans! 💜<br />
          Outreach &amp; feedback:{" "}
          <a href="mailto:kpopmbtipicker@gmail.com" style={s.footerLink}>kpopmbtipicker@gmail.com</a><br /><br />
          <em>Disclaimer: MBTI data is compiled from official and non-official sources and may not be fully accurate.</em>
        </footer>
      </div>

    </div>
  );
}
