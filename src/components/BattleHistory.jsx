import { useEffect, useState } from "react";

const typeColors = {
  grass: "#78C850",
  poison: "#A040A0",
  water: "#6890F0",
  fire: "#F08030",
  bug: "#A8B820",
  flying: "#A890F0",
  normal: "#A8A878",
  electric: "#F8D030",
  ground: "#E0C068",
  fairy: "#EE99AC",
  fighting: "#C03028",
  psychic: "#F85888",
  rock: "#B8A038",
  steel: "#B8B8D0",
  ice: "#98D8D8",
  ghost: "#705898",
  dragon: "#7038F8",
  dark: "#705848"
};

function TypeBadge({ type }) {
  return (
    <span
      style={{
        background: typeColors[type] || "#ccc",
        color: "#fff",
        borderRadius: "0.5rem",
        padding: "2px 8px",
        fontSize: "0.75rem",
        marginRight: 4,
        marginBottom: 2,
        display: "inline-block"
      }}
    >
      {type}
    </span>
  );
}

export default function BattleHistory() {
  const [history, setHistory] = useState([]);
  const [visible, setVisible] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3001/battleHistory")
      .then(res => res.json())
      .then(data => {
        const reversed = data.reverse();
        setHistory(reversed);
        // Cascade reveal
        reversed.forEach((_, idx) => {
          setTimeout(() => {
            setVisible(v => [...v, idx]);
          }, idx * 180); // adjust speed here
        });
      });
  }, []);

  return (
    <div className="p-4 max-w-[1040px] mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">Battle History</h2>
      <div className="flex gap-6 overflow-x-auto pb-4 battle-scrollbar">
        {history.length === 0 && (
          <div className="text-gray-500 text-center w-full">No battles yet.</div>
        )}
        {history.map((battle, idx) => (
          <div
            key={battle.id}
            className={`min-w-[320px] bg-white rounded-xl shadow p-4 flex flex-col items-center border-2 transition-all duration-700
              ${battle.result === "win"
                ? "border-green-400"
                : battle.result === "lose"
                ? "border-red-400"
                : "border-gray-300"}
              ${visible.includes(idx)
                ? "opacity-100 translate-y-0"
                : "opacity-0 -translate-y-8"}
            `}
            style={{ transitionDelay: `${idx * 80}ms` }}
          >
            <div className="flex items-center gap-4 mb-2">
              <div className="flex flex-col items-center">
                <img src={battle.heroImage} alt={battle.heroName} className="h-16 w-16" />
                <div className="capitalize font-semibold">{battle.heroName}</div>
                <div>
                  {battle.heroTypes.map(type => (
                    <TypeBadge key={type} type={type} />
                  ))}
                </div>
              </div>
              <span className="text-2xl font-bold text-gray-400">VS</span>
              <div className="flex flex-col items-center">
                <img src={battle.opponentImage} alt={battle.opponentName} className="h-16 w-16" />
                <div className="capitalize font-semibold">{battle.opponentName}</div>
                <div>
                  {battle.opponentTypes.map(type => (
                    <TypeBadge key={type} type={type} />
                  ))}
                </div>
              </div>
            </div>
            <div
              className={`mt-2 px-3 py-1 rounded-full text-sm font-bold ${
                battle.result === "win"
                  ? "bg-green-100 text-green-700"
                  : battle.result === "lose"
                  ? "bg-red-100 text-red-700"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              {battle.result === "win"
                ? "WIN"
                : battle.result === "lose"
                ? "LOSE"
                : "DRAW"}
            </div>
            <div className="mt-1 text-xs text-gray-400">
              {new Date(battle.date).toLocaleString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}