import React, { useState, useEffect } from 'react';
import { getTeam, removeFromTeam } from '../services/teamService';
import 'aos/dist/aos.css';
import AOS from 'aos';

const PokemonTeam = () => {
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [removeStatus, setRemoveStatus] = useState({ id: null, message: '', isError: false });

  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true
    });
    
    fetchTeam();
  }, []);
  
  const fetchTeam = async () => {
    try {
      setLoading(true);
      const data = await getTeam();
      setTeam(data);
      setError(null);
    } catch (error) {
      console.error('Error fetching team:', error);
      setError('Failed to load your team. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleRemoveFromTeam = async (id, name) => {
    try {
      setRemoveStatus({ id, message: 'Removing...', isError: false });
      
      console.log(`Removing Pokémon: ${name} (ID: ${id})`);
      
      // Pass the ID directly to the service
      await removeFromTeam(id);
      
      // Update local state
      setTeam(team.filter(pokemon => pokemon.id !== id));
      
      // Show success message briefly
      setRemoveStatus({ 
        id, 
        message: `${name.charAt(0).toUpperCase() + name.slice(1)} removed from team!`, 
        isError: false 
      });
      
      // Clear message after 3 seconds
      setTimeout(() => {
        setRemoveStatus({ id: null, message: '', isError: false });
      }, 3000);
    } catch (error) {
      console.error('Remove error:', error);
      setRemoveStatus({ 
        id, 
        message: error.message || 'Failed to remove from team', 
        isError: true 
      });
      
      // Clear error after 3 seconds
      setTimeout(() => {
        setRemoveStatus({ id: null, message: '', isError: false });
      }, 3000);
    }
  };
  
  const getTypeColor = (type) => {
    const typeColors = {
      normal: '#A8A878',
      fire: '#F08030',
      water: '#6890F0',
      electric: '#F8D030',
      grass: '#78C850',
      ice: '#98D8D8',
      fighting: '#C03028',
      poison: '#A040A0',
      ground: '#E0C068',
      flying: '#A890F0',
      psychic: '#F85888',
      bug: '#A8B820',
      rock: '#B8A038',
      ghost: '#705898',
      dragon: '#7038F8',
      dark: '#705848',
      steel: '#B8B8D0',
      fairy: '#EE99AC'
    };
    
    return typeColors[type] || '#777777';
  };
  
  const capitalize = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FF5350]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 p-4 rounded-lg text-red-700 text-center">
        {error}
      </div>
    );
  }

  return (
    <div className="mt-6">
      
      {team.length === 0 ? (
        <div className="bg-white rounded-xl shadow p-8 text-center">
          <img 
            src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png" 
            alt="Empty Pokeball" 
            className="w-24 h-24 mx-auto mb-4 opacity-40"
          />
          <h3 className="text-xl font-semibold mb-2 text-gray-600">Your team is empty!</h3>
          <p className="text-gray-500 mb-4">Go to the Pokédex and add some Pokémon to your team.</p>
          <a 
            href="/pokedex" 
            className="inline-block px-4 py-2 bg-[#FF5350] text-white rounded-full font-medium hover:bg-[#E03028] transition-colors"
          >
            Explore Pokédex
          </a>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-20 gap-8 mt-20">
          {team.map((pokemon, index) => (
            <div 
              key={pokemon.id}
              className="bg-white rounded-xl shadow-lg overflow-visible relative pt-12 transition-all hover:shadow-xl"
              data-aos="fade-down"
              data-aos-delay={index * 100}
            >
              {/* Image container */}
              <div className="absolute -top-14 left-0 right-0 h-32 flex justify-center items-center z-10">
                <img 
                  src={pokemon.image} 
                  alt={pokemon.name} 
                  className="h-full object-contain animate-float"
                  style={{ 
                    filter: 'drop-shadow(0 4px 3px rgba(0, 0, 0, 0.1))',
                    imageRendering: 'auto'
                  }}
                />
              </div>
              
              {/* Background glow */}
              <div 
                className="absolute -top-12 left-1/2 transform -translate-x-1/2 w-24 h-24 rounded-full opacity-70 z-0"
                style={{ 
                  background: `radial-gradient(circle, ${getTypeColor(pokemon.types[0])}, transparent 70%)`,
                  filter: 'blur(8px)'
                }}
              ></div>
              
              {/* Card content */}
              <div className="rounded-xl overflow-hidden">
                {/* <div 
                  className="h-8 w-full"
                  style={{ 
                    background: `linear-gradient(to bottom right, ${getTypeColor(pokemon.types[0])}, ${pokemon.types[1] ? getTypeColor(pokemon.types[1]) : getTypeColor(pokemon.types[0])}40)`
                  }}
                ></div> */}
                
                <div className="p-4">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-bold capitalize">{capitalize(pokemon.name)}</h3>
                    <span className="text-sm text-gray-500 font-medium">#{pokemon.id.toString().padStart(3, '0')}</span>
                  </div>
                  
                  <div className="flex gap-1 mb-3">
                    {pokemon.types.map(type => (
                      <span 
                        key={type} 
                        className="px-2 py-0.5 rounded-full text-xs font-medium text-white capitalize"
                        style={{ backgroundColor: getTypeColor(type) }}
                      >
                        {type}
                      </span>
                    ))}
                  </div>
                  
                  {/* Stats in a compact format */}
                  <div className="grid grid-cols-2 gap-2 mb-4 text-sm">
                    <div className="flex items-center">
                      <span className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-2">
                        <span className="font-semibold text-green-600">HP</span>
                      </span>
                      <span>{pokemon.stats.hp}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center mr-2">
                        <span className="font-semibold text-red-600">ATK</span>
                      </span>
                      <span>{pokemon.stats.attack}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-2">
                        <span className="font-semibold text-blue-600">DEF</span>
                      </span>
                      <span>{pokemon.stats.defense}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center mr-2">
                        <span className="font-semibold text-yellow-600">SPD</span>
                      </span>
                      <span>{pokemon.stats.speed}</span>
                    </div>
                  </div>
                  
                  {/* Remove button */}
                  <div className="flex justify-center">
                  <button 
  onClick={() => handleRemoveFromTeam(pokemon.id, pokemon.name)}
  disabled={removeStatus.id === pokemon.id && removeStatus.message === 'Removing...'}
  className={`px-4 py-1.5 rounded-full text-sm text-white font-medium transition-all ${
    removeStatus.id === pokemon.id && removeStatus.message === 'Removing...'
      ? 'bg-gray-400 cursor-not-allowed'
      : 'bg-[#FF5350] hover:bg-[#E03028]'
  }`}
>
  {removeStatus.id === pokemon.id && removeStatus.message === 'Removing...' 
    ? 'Removing...' 
    : 'Remove from Team'}
</button>
                  </div>
                  
                  {/* Status message */}
                  {removeStatus.id === pokemon.id && removeStatus.message && removeStatus.message !== 'Removing...' && (
                    <div className={`text-center text-xs mt-2 ${removeStatus.isError ? 'text-red-500' : 'text-green-500'}`}>
                      {removeStatus.message}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
          
          {/* Empty slots */}
          {Array.from({ length: Math.max(0, 6 - team.length) }).map((_, index) => (
            <div 
              key={`empty-${index}`}
              className="bg-white rounded-xl shadow border-2 border-dashed border-gray-200 flex flex-col items-center justify-center p-8 h-72"
              data-aos="fade-down"
              data-aos-delay={(team.length + index) * 100}
            >
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                <img 
                  src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png" 
                  alt="Empty Pokeball" 
                  className="w-10 h-10 opacity-40"
                />
              </div>
              <p className="text-gray-400 text-center">Empty slot</p>
              <p className="text-xs text-gray-300 mt-1">Add more Pokémon to your team</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PokemonTeam;