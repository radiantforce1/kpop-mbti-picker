import React, { useState, useEffect } from "react";
import idolData from "./idolData.json";

export default function KpopMbtiPicker() {
  const [idols, setIdols] = useState([]);
  const [selectedIdols, setSelectedIdols] = useState([]);
  const [result, setResult] = useState(null);
  const [letterPercentages, setLetterPercentages] = useState({});
  const [otherLetterPercentages, setOtherLetterPercentages] = useState({});
  const [similarIdols, setSimilarIdols] = useState([]);
  const [search, setSearch] = useState("");
  const [showOptions, setShowOptions] = useState(false);

  useEffect(() => {
    setIdols(idolData);
  }, []);

  const handleSelect = (idolName) => {
    if (selectedIdols.length < 10) {
      const idol = idols.find((i) => i["Name (Group)"] === idolName);
      setSelectedIdols([...selectedIdols, idol]);
    }
    setSearch("");
    setShowOptions(false);
  };

  const handleRemove = (idolName) => {
    setSelectedIdols(selectedIdols.filter((idol) => idol["Name (Group)"] !== idolName));
  };

  const calculateMbti = () => {
    const letterCounts = [{}, {}, {}, {}];
    let totalIdols = selectedIdols.length;
    
    selectedIdols.forEach(({ Personality }) => {
      if (Personality && Personality.length === 4) {
        for (let i = 0; i < 4; i++) {
          const letter = Personality[i];
          letterCounts[i][letter] = (letterCounts[i][letter] || 0) + 1;
        }
      }
    });
    
    const consensusMbti = letterCounts.map((count) =>
      Object.keys(count).reduce((a, b) => (count[a] >= count[b] ? a : b))
    ).join("");
    
    setResult(consensusMbti);
    
    const percentageBreakdown = {};
    const otherBreakdown = {};
    letterCounts.forEach((count, index) => {
      const consensusLetter = consensusMbti[index];
      percentageBreakdown[consensusLetter] = ((count[consensusLetter] / totalIdols) * 100).toFixed(0) + "%";
      
      Object.keys(count).forEach((letter) => {
        if (letter !== consensusLetter) {
          otherBreakdown[letter] = ((count[letter] / totalIdols) * 100).toFixed(0) + "%";
        }
      });
    });
    setLetterPercentages(percentageBreakdown);
    setOtherLetterPercentages(otherBreakdown);
    
    const matchingIdols = idols.filter((idol) => idol.Personality === consensusMbti);
    const shuffledIdols = matchingIdols.sort(() => 0.5 - Math.random()).slice(0, 20);
    setSimilarIdols(shuffledIdols);
  };

  const resetSelection = () => {
    setSelectedIdols([]);
    setResult(null);
    setLetterPercentages({});
    setOtherLetterPercentages({});
    setSimilarIdols([]);
    setSearch("");
  };

  return (
    <div className="p-4 max-w-2xl mx-auto flex flex-col items-center text-center">
      <h1 className="text-xl font-bold mb-2">K-Pop Idol MBTI Consensus</h1>
      <p className="text-sm text-gray-600 mb-2">Please select up to 10 idols.<br/>p.s. odd numbers work better to break potential ties</p>
      <div className="relative w-full">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onFocus={() => setShowOptions(true)}
          placeholder="Search idols..."
          className="border p-2 rounded w-full"
        />
        {showOptions && (
          <ul className="absolute w-full border bg-white max-h-40 overflow-y-auto">
            {idols
              .filter((idol) => 
                idol["Name (Group)"]
                  .toLowerCase()
                  .split(" ")
                  .some((word) => word.includes(search.toLowerCase()))
              )
              .map((idol) => (
                <li
                  key={idol["Name (Group)"]}
                  className="p-2 hover:bg-gray-200 cursor-pointer"
                  onClick={() => handleSelect(idol["Name (Group)"])}
                >
                  {idol["Name (Group)"]}
                </li>
              ))}
          </ul>
        )}
      </div>
      <div className="mt-2 w-full">
        {selectedIdols.map((idol) => (
          <div key={idol["Name (Group)"]} className="p-2 mb-1 border rounded flex justify-between items-center w-full">
            <span>{idol["Name (Group)"]} - {idol.Personality}</span>
            <button className="bg-red-500 text-white px-3 py-1 rounded flex-shrink-0" onClick={() => handleRemove(idol["Name (Group)"])}>
              Remove
            </button>
          </div>
        ))}
      </div>
      <div className="mt-2 flex gap-2">
        <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={calculateMbti}>
          Get Consensus MBTI
        </button>
        <button className="bg-gray-500 text-white px-4 py-2 rounded" onClick={resetSelection}>
          Reset
        </button>
      </div>
      {result && (
        <div className="mt-4 p-4 border rounded bg-gray-100 w-full">
          <h2 className="text-lg font-semibold">Consensus MBTI:</h2>
          <p className="text-2xl font-bold">{result}</p>
          <h3 className="text-md font-semibold mt-2">MBTI Breakdown:</h3>
          <ul>
            {result.split('').map((letter) => (
              <li key={letter} className="text-sm">{letter} - {letterPercentages[letter]}</li>
            ))}
          </ul>
          <h3 className="text-md font-semibold mt-2">MBTI Others:</h3>
          <ul>
            {Object.keys(otherLetterPercentages).map((letter) => (
              <li key={letter} className="text-sm">{letter} - {otherLetterPercentages[letter]}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
