import axios from 'axios';

const API_URL = 'https://poke-api-ytta.onrender.com';
export const getTeam = async () => {
  try {
    const response = await axios.get(`${API_URL}/teamPokemons`);
    return response.data;
  } catch (error) {
    console.error('Error fetching team:', error);
    throw error;
  }
};

export const addToTeam = async (pokemon) => {
  try {
    const team = await getTeam();
    if (team.length >= 6) {
      throw new Error('Team is full! Remove a Pokémon before adding a new one.');
    }
    if (team.some(p => p.pokemonId === pokemon.id)) {
      throw new Error(`${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)} is already in your team!`);
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
    
    // Add to the team with explicit error handling
    try {
      const response = await axios.post(`${API_URL}/teamPokemons`, teamPokemon);
      return response.data;
    } catch (postError) {
      throw new Error(`Failed to save to team: ${postError.message}`);
    }
  } catch (error) {
    throw error;
  }
};

export const removeFromTeam = async (teamId) => {
  try {
    // Get the team
    const team = await getTeam();
    
    // Find the entry using the team entry ID directly
    const teamEntry = team.find(p => p.id === teamId);
    
    if (!teamEntry) {
      throw new Error(`Pokémon not found in team`);
    }
    
    // Delete using the team entry ID
    await axios.delete(`${API_URL}/teamPokemons/${teamEntry.id}`);
    return true;
  } catch (error) {
    console.error('Error removing from team:', error);
    throw error;
  }
};