import React from "react";

const PokemonCard = ({
  pokemon,
  isSelected,
  onSelect,
  index,
  getTypeColor,
  capitalize,
}) => {

  const cascadeDelay = index * 150;

  return (
    <div
      key={pokemon.id}
      className={`bg-white rounded-xl shadow-lg overflow-visible cursor-pointer transition-all duration-300 relative pt-12
        ${
          isSelected
            ? "ring-2 ring-[#FF5350] transform scale-105 shadow-xl"
            : "hover:shadow-xl hover:-translate-y-1"
        }`}
      onClick={() => onSelect(pokemon)}
      data-aos={isSelected ? "" : "fade-down"}
      data-aos-once="true"
      data-aos-delay={cascadeDelay}
      data-aos-anchor-placement="top-bottom"
    >
      {/* Image container positioned to overflow out of the card */}
      <div
        className="absolute -top-14 left-0 right-0 h-32 flex justify-center items-center z-10"
        data-aos={isSelected ? "" : "zoom-in"}
        data-aos-once="true"
        data-aos-delay={cascadeDelay + 50}
      >
        <img
          src={pokemon.image}
          alt={pokemon.name}
          className={`h-20 object-contain transition-all duration-300 transform drop-shadow-lg
            ${
              isSelected
                ? "animate-float"
                : "hover:scale-110 hover:-translate-y-1"
            }`}
          style={{
            filter: "drop-shadow(0 4px 3px rgba(0, 0, 0, 0.1))",
            imageRendering: "auto",
          }}
        />
      </div>

      {/* Background glow effect behind the image */}
      <div
        className="absolute -top-12 left-1/2 transform -translate-x-1/2 w-24 h-24 rounded-full opacity-70 z-0"
        style={{
          background: `radial-gradient(circle, ${getTypeColor(
            pokemon.types[0]
          )}, transparent 70%)`,
          filter: "blur(8px)",
        }}
      ></div>

      {/* Card content with extra padding at top */}
      <div className="rounded-xl overflow-hidden">
        <div className="p-3">
          <div
            className="flex justify-between items-center"
            data-aos={isSelected ? "" : "fade-right"}
            data-aos-delay={cascadeDelay + 75}
            data-aos-once="true"
          >
            <h3 className="text-sm font-bold capitalize">
              {capitalize(pokemon.name)}
            </h3>
            <span className="text-xs text-gray-500 font-medium">
              #{pokemon.id.toString().padStart(3, "0")}
            </span>
          </div>
          <div
            className="flex gap-1 mt-1 justify-center"
            data-aos={isSelected ? "" : "fade-down"}
            data-aos-delay={cascadeDelay + 95}
            data-aos-once="true"
          >
            {pokemon.types.map((type) => (
              <span
                key={type}
                className="px-2 py-0.5 rounded-full text-xs font-medium text-white capitalize transition-all hover:shadow-md hover:scale-105"
                style={{ backgroundColor: getTypeColor(type) }}
              >
                {type}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PokemonCard;
