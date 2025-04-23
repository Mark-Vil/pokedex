import React from "react";

const PokemonSearchBar = ({
  search,
  setSearch,
  type,
  setType,
  typeOptions,
  hideTypeSelection = false  // Add this prop with default value
}) => (
  <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-6">
    <input
      type="text"
      placeholder="Search Pokémon by name..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      className={`shadow-lg rounded-lg h-15 border border-gray-200 px-3 py-2 w-full bg-white placeholder-[#807b78] focus:outline-none focus:border-transparent ${hideTypeSelection ? "md:col-span-6" : "md:col-span-4"}`}
      style={{ backgroundColor: "#fff" }}
    />
    {!hideTypeSelection && (
      <select
        value={type}
        onChange={(e) => setType(e.target.value)}
        className={`shadow-lg rounded-lg border border-gray-200 px-3 py-2 w-full bg-white md:col-span-2 focus:outline-none focus:border-transparent ${
          type === "" ? "text-[#807b78]" : "text-black"
        }`}
        style={{ backgroundColor: "#fff" }}
      >
        <option value="" className="text-[#807b78]">
          All Types
        </option>
        {typeOptions.map((t) => (
          <option key={t} value={t} className="text-black">
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </option>
        ))}
      </select>
    )}
  </div>
);

export default PokemonSearchBar;