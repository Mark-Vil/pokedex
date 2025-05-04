import { useState, useEffect } from 'react';
import axios from 'axios';
import AOS from 'aos';
import 'aos/dist/aos.css'; 
import PokemonCard from './PokemonCard';
import PokemonDetail from './PokemonDetail';
import Pagination from './Pagination';
import PokemonSearchBar from './PokemonSearchBar';

const floatKeyframes = `
@keyframes float {
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
}
.animate-float {
  animation: float 3s ease-in-out infinite;
}
.aos-animation-disabled [data-aos] {
  opacity: 1 !important;
  transform: none !important;
  visibility: visible !important;
  pointer-events: auto !important;
  transition: none !important;
  animation: none !important;
}
.aos-animation-disabled [data-aos] * {
  transition: none !important;
  animation: none !important;
  transform: none !important;
}
`;

const PokemonList = () => {
  const [pokemonData, setPokemonData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [viewAngle, setViewAngle] = useState('front');

  const [search, setSearch] = useState('');
  const [type, setType] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [typeOptions, setTypeOptions] = useState([]);
  const itemsPerPage = 12;
  const [searchTimeout, setSearchTimeout] = useState(null);

  // Initialize AOS
  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: 'ease-out',
      once: true,
      mirror: false
    });

    // Add float keyframes
    const styleElement = document.createElement('style');
    styleElement.innerHTML = floatKeyframes;
    document.head.appendChild(styleElement);

    // Fetch type options once on load
    fetchTypeOptions();

    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  // Fetch all available types
  const fetchTypeOptions = async () => {
    try {
      const response = await axios.get('https://pokeapi.co/api/v2/type');
      const types = response.data.results
        .map(type => type.name)
        .filter(name => !['unknown', 'shadow'].includes(name))
        .sort();
      setTypeOptions(types);
    } catch (error) {
      console.error("Failed to fetch type options:", error);
    }
  };

  // Fetch Pokemon with search and filter
  useEffect(() => {
    // Clear any existing timeout to prevent multiple rapid API calls
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

   
    const timeout = setTimeout(() => {
      fetchPokemon();
    }, 500);

    setSearchTimeout(timeout);

    return () => {
      if (searchTimeout) clearTimeout(searchTimeout);
    };
  }, [search, type, currentPage]);

  const fetchPokemon = async () => {
    setLoading(true);
    
    try {
      let fetchedPokemon = [];
      
      if (search) {
        // Search by name
        try {
          const searchResponse = await axios.get(`https://pokeapi.co/api/v2/pokemon/${search.toLowerCase()}`);
          const pokemonDetails = await fetchPokemonDetails(searchResponse.data.url || `https://pokeapi.co/api/v2/pokemon/${searchResponse.data.id}`);
          if (pokemonDetails && (!type || pokemonDetails.types.includes(type))) {
            fetchedPokemon = [pokemonDetails];
          }
          setTotalCount(fetchedPokemon.length);
        } catch (searchError) {
          // If direct search fails, try to get all and filter
          const allResponse = await axios.get(`https://pokeapi.co/api/v2/pokemon?limit=100&offset=${(currentPage - 1) * 100}`);
          const filteredResults = allResponse.data.results.filter(
            p => p.name.includes(search.toLowerCase())
          );
          
          // Get count for pagination
          setTotalCount(filteredResults.length);
          
          // Get details for current page
          const pageResults = filteredResults.slice(0, itemsPerPage);
          const detailPromises = pageResults.map(p => fetchPokemonDetails(p.url));
          fetchedPokemon = await Promise.all(detailPromises);
          
          // Apply type filter if needed
          if (type) {
            fetchedPokemon = fetchedPokemon.filter(p => p.types.includes(type));
          }
        }
      } else if (type) {
        // Search by type
        const typeResponse = await axios.get(`https://pokeapi.co/api/v2/type/${type}`);
        const pokemonOfType = typeResponse.data.pokemon;
        setTotalCount(pokemonOfType.length);
        
        // Get details for current page only
        const offset = (currentPage - 1) * itemsPerPage;
        const pageItems = pokemonOfType.slice(offset, offset + itemsPerPage);
        const detailPromises = pageItems.map(p => fetchPokemonDetails(p.pokemon.url));
        fetchedPokemon = await Promise.all(detailPromises);
      } else {
        // No filters - get paginated list
        const offset = (currentPage - 1) * itemsPerPage;
        const response = await axios.get(`https://pokeapi.co/api/v2/pokemon?limit=${itemsPerPage}&offset=${offset}`);
        setTotalCount(response.data.count);
        
        const detailPromises = response.data.results.map(pokemon => 
          fetchPokemonDetails(pokemon.url)
        );
        fetchedPokemon = await Promise.all(detailPromises);
      }
      
      setPokemonData(fetchedPokemon.filter(Boolean));
      
      // Set initial selected Pokemon if none is selected
      if (!selectedPokemon && fetchedPokemon.length > 0) {
        setSelectedPokemon(fetchedPokemon[0]);
      }
      
    } catch (error) {
      console.error("Failed to fetch Pokémon:", error);
      setError("Failed to load Pokémon. Please try again later.");
      setPokemonData([]);
    } finally {
      setLoading(false);
      setTimeout(() => {
        if (AOS) AOS.refresh();
      }, 100);
    }
  };

  // Helper function to fetch a single Pokemon's details
  const fetchPokemonDetails = async (url) => {
    try {
      const detailResponse = await axios.get(url);
      return {
        id: detailResponse.data.id,
        name: detailResponse.data.name,
        image: detailResponse.data.sprites.other['official-artwork'].front_default || 
              detailResponse.data.sprites.front_default,
        backImage: detailResponse.data.sprites.back_default,
        types: detailResponse.data.types.map(type => type.type.name),
        stats: {
          hp: detailResponse.data.stats.find(stat => stat.stat.name === 'hp').base_stat,
          attack: detailResponse.data.stats.find(stat => stat.stat.name === 'attack').base_stat,
          defense: detailResponse.data.stats.find(stat => stat.stat.name === 'defense').base_stat,
          speed: detailResponse.data.stats.find(stat => stat.stat.name === 'speed').base_stat
        },
        height: detailResponse.data.height / 10,
        weight: detailResponse.data.weight / 10, 
        abilities: detailResponse.data.abilities.map(ability => ability.ability.name),
        animatedSprite: detailResponse.data.sprites.versions?.['generation-v']?.['black-white']?.animated?.front_default
      };
    } catch (error) {
      console.error(`Failed to fetch details for a Pokémon:`, error);
      return null;
    }
  };

  // Calculate total pages
  const totalPages = Math.ceil(totalCount / itemsPerPage);

  // Reset to first page when search or type filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [search, type]);

  // Page navigation handlers
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
      window.scrollTo(0, 0);
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
      window.scrollTo(0, 0);
    }
  };

  const goToPage = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  // Handle Pokemon selection with loading state
  const handlePokemonSelect = (p) => {
    if (selectedPokemon?.id === p.id) return;

    if (AOS && AOS.refresh) {
      document.body.classList.add('aos-animation-disabled');
    }
    setIsLoadingDetails(true);
    setSelectedPokemon(p);
    setViewAngle('front');
    setTimeout(() => {
      setIsLoadingDetails(false);
      setTimeout(() => {
        if (AOS && AOS.refresh) {
          document.body.classList.remove('aos-animation-disabled');
          AOS.refresh();
        }
      }, 300);
    }, 400);
  };

  const capitalize = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
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

  if (loading && pokemonData.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FF5350]"></div>
      </div>
    );
  }

  return (
    <div className="mt-6">
      <h2 className="text-2xl font-bold mb-4">Pokémon Catalog</h2>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:flex-1 lg:flex-grow">
          {/* Search and filter bar */}
          <PokemonSearchBar
            search={search}
            setSearch={setSearch}
            type={type}
            setType={setType}
            typeOptions={typeOptions}
          />
          
          {error ? (
            <div className="bg-red-100 p-4 rounded-lg text-red-700 text-center mb-6">
              {error}
            </div>
          ) : loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FF5350]"></div>
            </div>
          ) : pokemonData.length === 0 ? (
            <div className="text-center p-8 bg-gray-50 rounded-lg">
              <p className="text-lg">No Pokémon found matching your search criteria.</p>
              <p className="mt-2 text-gray-600">Try a different name or filter.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-10 gap-y-20 mt-25">
              {pokemonData.map((p, index) => (
                <PokemonCard 
                  key={p.id}
                  pokemon={p}
                  isSelected={selectedPokemon?.id === p.id}
                  onSelect={handlePokemonSelect}
                  index={index}
                  getTypeColor={getTypeColor}
                  capitalize={capitalize}
                />
              ))}
            </div>
          )}
          
          {!loading && pokemonData.length > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              goToNextPage={goToNextPage}
              goToPrevPage={goToPrevPage}
              goToPage={goToPage}
            />
          )}
        </div>
        {selectedPokemon && (
          <div className="w-full md:w-[300px] pt-20 relative mt-10">
            <PokemonDetail
              pokemon={selectedPokemon}
              isLoading={isLoadingDetails}
              viewAngle={viewAngle}
              setViewAngle={setViewAngle}
              getTypeColor={getTypeColor}
              capitalize={capitalize}
              preventRefresh={true}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default PokemonList;