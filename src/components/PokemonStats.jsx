import React from 'react';

const PokemonStats = ({ stats }) => {
  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-3">Base Stats</h3>
      <div className="grid grid-cols-4 gap-4 justify-items-center">
        {/* HP Stat */}
        <div className="flex flex-col items-center">
          <div className="relative">
            <div 
              className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-xs"
              style={{ 
                background: `conic-gradient(#4ade80 ${Math.min(100, (stats.hp / 255) * 100)}%, #e5e7eb ${Math.min(100, (stats.hp / 255) * 100)}% 100%)`,
              }}
            >
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                <span className="text-[11px] font-semibold text-gray-700">HP</span>
              </div>
            </div>
          </div>
          <span className="text-xs font-medium mt-1">{stats.hp}</span>
        </div>
        
        {/* Attack Stat */}
        <div className="flex flex-col items-center">
          <div className="relative">
            <div 
              className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-xs"
              style={{ 
                background: `conic-gradient(#f87171 ${Math.min(100, (stats.attack / 255) * 100)}%, #e5e7eb ${Math.min(100, (stats.attack / 255) * 100)}% 100%)`,
              }}
            >
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                <span className="text-[11px] font-semibold text-gray-700">ATK</span>
              </div>
            </div>
          </div>
          <span className="text-xs font-medium mt-1">{stats.attack}</span>
        </div>
        
        {/* Defense Stat */}
        <div className="flex flex-col items-center">
          <div className="relative">
            <div 
              className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-xs"
              style={{ 
                background: `conic-gradient(#60a5fa ${Math.min(100, (stats.defense / 255) * 100)}%, #e5e7eb ${Math.min(100, (stats.defense / 255) * 100)}% 100%)`,
              }}
            >
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                <span className="text-[11px] font-semibold text-gray-700">DEF</span>
              </div>
            </div>
          </div>
          <span className="text-xs font-medium mt-1">{stats.defense}</span>
        </div>
        
        {/* Speed Stat */}
        <div className="flex flex-col items-center">
          <div className="relative">
            <div 
              className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-xs"
              style={{ 
                background: `conic-gradient(#fbbf24 ${Math.min(100, (stats.speed / 255) * 100)}%, #e5e7eb ${Math.min(100, (stats.speed / 255) * 100)}% 100%)`,
              }}
            >
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                <span className="text-[11px] font-semibold text-gray-700">SPD</span>
              </div>
            </div>
          </div>
          <span className="text-xs font-medium mt-1">{stats.speed}</span>
        </div>
      </div>
    </div>
  );
};

export default PokemonStats;