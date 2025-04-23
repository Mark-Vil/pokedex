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
  const [allPokemon, setAllPokemon] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [viewAngle, setViewAngle] = useState('front');

  const [search, setSearch] = useState('');
  const [type, setType] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  // Fetch all Pokémon (limit to 151 for demo)
  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: 'ease-out',
      once: true,
      mirror: false
    });

    const fetchAllPokemon = async () => {
      try {
        setLoading(true);
        const response = await axios.get('https://pokeapi.co/api/v2/pokemon?limit=151');
        const details = await Promise.all(
          response.data.results.map(async (pokemon) => {
            const detailResponse = await axios.get(pokemon.url);
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
          })
        );
        setAllPokemon(details);
        setSelectedPokemon(details[0]);
      } catch (error) {
        setError("Failed to load Pokémon. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchAllPokemon();

    const styleElement = document.createElement('style');
    styleElement.innerHTML = floatKeyframes;
    document.head.appendChild(styleElement);

    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  // Build type options from allPokemon
  const typeOptions = Array.from(
    new Set(allPokemon.flatMap(p => p.types))
  ).sort();

  // Filtered Pokémon list
  const filteredPokemon = allPokemon.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchesType = !type || p.types.includes(type);
    return matchesSearch && matchesType;
  });

  // Pagination
  const totalPages = Math.ceil(filteredPokemon.length / itemsPerPage);
  const paginatedPokemon = filteredPokemon.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Reset to first page when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [search, type]);

  useEffect(() => {
    if (!loading && allPokemon.length > 0) {
      setTimeout(() => {
        if (AOS) {
          AOS.refresh();
        }
      }, 100);
    }
  }, [loading, allPokemon]);

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
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-10 gap-y-20 mt-25">
            {paginatedPokemon.map((p, index) => (
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
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            goToNextPage={goToNextPage}
            goToPrevPage={goToPrevPage}
            goToPage={goToPage}
          />
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