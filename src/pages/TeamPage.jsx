import React from 'react';
import PokemonTeam from '../components/PokemonTeam';

const TeamPage = () => {
  return (
    <div className="p-4 max-w-[1040px] mx-auto">
      <h1 className="text-3xl font-bold mb-2">My Pokémon Team</h1>
      
      <PokemonTeam />
    </div>
  );
};

export default TeamPage;