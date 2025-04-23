import React, { useState, useEffect } from 'react';
import { addToTeam, getTeam } from '../services/teamService';

const AddPokemonButton = ({ pokemon }) => {
  const [isInTeam, setIsInTeam] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [message, setMessage] = useState('');
  

  useEffect(() => {
    getTeam().then(team => {
      const isInTeam = team.some(p => p.pokemonId === pokemon.id);
      setIsInTeam(isInTeam);
    });
  }, [pokemon.id]);
  
  const handleAddToTeam = async (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
  
      if (e.nativeEvent) {
        e.nativeEvent.stopImmediatePropagation();
      }
    }
  
    if (isAdding) return;
    setIsAdding(true);
  
    const team = await getTeam();
    if (team.length >= 6) {
      setMessage('Team is full (max 6 Pokémon)');
      setIsAdding(false);
      setTimeout(() => setMessage(''), 3000);
      return;
    }
    
    const teamPokemon = {
      id: `team_${Date.now()}`,
      pokemonId: pokemon.id,
      name: pokemon.name,
      image: pokemon.image,
      backImage: pokemon.backImage,
      types: pokemon.types,
      stats: pokemon.stats,
      height: pokemon.height,
      weight: pokemon.weight,
      abilities: pokemon.abilities,
      animatedSprite: pokemon.animatedSprite
    };
    
    fetch('http://localhost:3001/teamPokemons', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(teamPokemon),
    })
    .then(response => response.json())
    .then(data => {
      setIsInTeam(true);
      setTimeout(() => setMessage(''), 3000);
    })
    .catch(error => {
      console.error('Error adding to team:', error);
      setMessage('Failed to add to team');
      setTimeout(() => setMessage(''), 3000);
    })
    .finally(() => {
      setIsAdding(false);
    });
  };
  
  return (
    <div>
      {message && (
        <div className="mb-2 text-center text-sm font-medium text-green-600">
          {message}
        </div>
      )}
      
      {!isInTeam ? (
        <button
          type="button"
          disabled={isAdding}
          onClick={handleAddToTeam}
          className="px-4 py-2 bg-red-500 text-white rounded-full w-full"
        >
          {isAdding ? 'Adding...' : 'Add to Team'}
        </button>
      ) : (
        <div className="px-4 py-2 bg-green-100 text-green-700 rounded-full text-center">
          In Team
        </div>
      )}
    </div>
  );
};

export default AddPokemonButton;