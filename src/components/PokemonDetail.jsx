import React, { useState, useEffect, useCallback } from 'react';
import PokemonStats from './PokemonStats';
import AddPokemonButton from './AddPokemonButton';

// Here's the actual component
const PokemonDetail = ({ 
  pokemon, 
  isLoading, 
  viewAngle, 
  setViewAngle, 
  getTypeColor, 
  capitalize,
  mirrorImage = false,
  hideAddButton = false,
  hideId = false,
  preventRefresh = false
}) => {
  const [addStatus, setAddStatus] = useState({ message: '', isError: false });

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 animate-pulse h-full flex flex-col gap-6">
        <div className="w-full">
          <div className="h-32 rounded-xl bg-gray-200 mb-4"></div>
          <div className="flex gap-2 justify-center mb-4">
            <div className="h-6 w-16 bg-gray-200 rounded-full"></div>
            <div className="h-6 w-16 bg-gray-200 rounded-full"></div>
          </div>
        </div>
        <div className="w-full">
          <div className="flex justify-between items-center mb-4">
            <div className="h-8 w-32 bg-gray-200 rounded"></div>
            <div className="h-8 w-12 bg-gray-200 rounded"></div>
          </div>
          <div className="space-y-4">
            <div className="h-4 w-full bg-gray-200 rounded"></div>
            <div className="h-4 w-full bg-gray-200 rounded"></div>
            <div className="h-4 w-full bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  

  return (
    <div className="flex flex-col">
      {/* Pokemon Image hovering above the card */}
      <div className="absolute -top-12 left-0 right-0 h-40 flex justify-center items-center z-10">
  {pokemon.animatedSprite && viewAngle === 'front' ? (
    <img 
      src={pokemon.animatedSprite} 
      alt={pokemon.name} 
      className={`h-full object-contain animate-float ${mirrorImage ? '-scale-x-100' : ''}`}
      style={{ 
        imageRendering: 'pixelated', 
        maxHeight: '130%',
        filter: 'drop-shadow(0 4px 3px rgba(0, 0, 0, 0.1))'
      }}
    />
  ) : (
    <img 
      src={viewAngle === 'front' ? pokemon.image : (pokemon.backImage || pokemon.image)} 
      alt={pokemon.name} 
      className={`h-full object-contain animate-float ${mirrorImage ? '-scale-x-100' : ''}`}
      style={{ 
        filter: 'drop-shadow(0 4px 3px rgba(0, 0, 0, 0.1))'
      }}
    />
  )}
</div>
      
      {/* Background glow effect behind the image */}
      <div 
        className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-32 h-32 rounded-full opacity-70 z-0"
        style={{ 
          background: `radial-gradient(circle, ${getTypeColor(pokemon.types[0])}, transparent 70%)`,
          filter: 'blur(8px)'
        }}
      ></div>
      
      {/* Card content */}
      <div className="bg-white rounded-xl overflow-hidden shadow-lg">
        <div 
          className="h-8 w-full"
          style={{ 
            background: `linear-gradient(to bottom right, ${getTypeColor(pokemon.types[0])}, ${pokemon.types[1] ? getTypeColor(pokemon.types[1]) : getTypeColor(pokemon.types[0])}40)`
          }}
        ></div>
        
        <div className="p-6">
          {/* Rotation controls */}
          {pokemon.backImage && (
            <div className="flex gap-2 justify-center mb-3">
              <button 
                className={`px-2 py-1 text-xs font-medium rounded transition-colors ${
                  viewAngle === 'front' 
                    ? 'bg-[#FF5350] text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
                onClick={() => setViewAngle('front')}
              >
                Front View
              </button>
              <button 
                className={`px-2 py-1 text-xs font-medium rounded transition-colors ${
                  viewAngle === 'back' 
                    ? 'bg-[#FF5350] text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
                onClick={() => setViewAngle('back')}
              >
                Back View
              </button>
            </div>
          )}


          {/* Status message */}
          {addStatus.message && (
            <div className={`text-center text-sm mb-4 ${addStatus.isError ? 'text-red-500' : 'text-green-500'}`}>
              {addStatus.message}
            </div>
          )}

          <div className="flex gap-2 justify-center mb-4">
            {pokemon.types.map(type => (
              <span 
                key={type} 
                className="px-3 py-1 rounded-full text-sm font-medium text-white capitalize transition-all hover:shadow-md hover:scale-105"
                style={{ backgroundColor: getTypeColor(type) }}
              >
                {type}
              </span>
            ))}
          </div>
          
          <div className={`flex items-center mb-4 ${hideId ? 'justify-center' : 'justify-between'}`}>
  <h2 className="text-2xl md:text-3xl font-bold capitalize">
    {capitalize(pokemon.name)}
  </h2>
  {!hideId && (
    <span className="text-xl text-gray-500 font-bold">
      {typeof pokemon.id === 'number'
        ? `#${pokemon.id.toString().padStart(3, '0')}`
        : ''}
    </span>
  )}
</div>
          
          {/* Stats display */}
          <PokemonStats stats={pokemon.stats} />
          
          <div className="grid grid-cols-2 gap-4 mb-6">
  <div>
    <h3 className="text-lg font-semibold mb-2">Abilities</h3>
    <ul className="list-disc pl-5">
      {pokemon.abilities.map(ability => (
        <li key={ability} className="capitalize hover:text-[#FF5350] transition-colors">
          {ability.replace('-', ' ')}
        </li>
      ))}
    </ul>
  </div>
  
  <div>
    <h3 className="text-lg font-semibold mb-2">Physical</h3>
    <div className="space-y-1">
      <p><span className="font-medium">Height:</span> {pokemon.height}m</p>
      <p><span className="font-medium">Weight:</span> {pokemon.weight}kg</p>
    </div>
  </div>
</div>

{/* Add to Team Button  */}
{!hideAddButton && (
        <div className="flex justify-center mt-4">
          <AddPokemonButton pokemon={pokemon} />
        </div>
      )}
        </div>
      </div>
    </div>
  );
};

export default PokemonDetail;