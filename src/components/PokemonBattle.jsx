import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PokemonSearchBar from './PokemonSearchBar';
import Pagination from './Pagination';
import PokemonDetail from './PokemonDetail';
import AOS from 'aos';
import 'aos/dist/aos.css';

const placeholderImg = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/0.png";
const TABS = { TEAM: 'Team', GLOBAL: 'Global' };

const PokemonBattle = () => {
  const [step, setStep] = useState(1);
  const [team, setTeam] = useState([]);
  const [hero, setHero] = useState(null);
  const [opponent, setOpponent] = useState(null);
  const [tab, setTab] = useState(TABS.TEAM);

  // For global search/pagination
  const [search, setSearch] = useState('');
  const [allPokemon, setAllPokemon] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  const [battleResult, setBattleResult] = useState(null);
const [battleStarted, setBattleStarted] = useState(false);

const [battleLoading, setBattleLoading] = useState(false);

  useEffect(() => {
    axios.get('http://localhost:3001/teamPokemons').then(res => setTeam(res.data));
  }, []);

  useEffect(() => {
    if (step === 2 && tab === TABS.GLOBAL && allPokemon.length === 0) {
      axios.get('https://pokeapi.co/api/v2/pokemon?limit=151')
        .then(async res => {
          const details = await Promise.all(
            res.data.results.map(async (pokemon) => {
              const detail = await axios.get(pokemon.url);
              return {
                id: detail.data.id,
                name: detail.data.name,
                image: detail.data.sprites.other['official-artwork'].front_default || detail.data.sprites.front_default,
                backImage: detail.data.sprites.back_default,
                types: detail.data.types.map(type => type.type.name),
                stats: {
                  hp: detail.data.stats.find(stat => stat.stat.name === 'hp').base_stat,
                  attack: detail.data.stats.find(stat => stat.stat.name === 'attack').base_stat,
                  defense: detail.data.stats.find(stat => stat.stat.name === 'defense').base_stat,
                  speed: detail.data.stats.find(stat => stat.stat.name === 'speed').base_stat
                },
                height: detail.data.height / 10,
                weight: detail.data.weight / 10,
                abilities: detail.data.abilities.map(ability => ability.ability.name),
                animatedSprite: detail.data.sprites.versions?.['generation-v']?.['black-white']?.animated?.front_default
              };
            })
          );
          setAllPokemon(details);
        });
    }
  }, [step, tab, allPokemon.length]);

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

  const simulateBattle = () => {
    setBattleLoading(true);
    setTimeout(() => {
      if (!hero || !opponent) return;
  
      const heroStats = hero.stats;
      const opponentStats = opponent.stats;
  
      let heroWins = 0;
      let opponentWins = 0;
      const statNames = ['hp', 'attack', 'defense', 'speed'];
      const statLabels = { hp: 'HP', attack: 'Attack', defense: 'Defense', speed: 'Speed' };
      const statResults = [];
  
      statNames.forEach(stat => {
        const heroStat = heroStats[stat];
        const opponentStat = opponentStats[stat];
        let winner = null;
        if (heroStat > opponentStat) {
          heroWins++;
          winner = 'hero';
        } else if (heroStat < opponentStat) {
          opponentWins++;
          winner = 'opponent';
        }
        statResults.push({
          stat: statLabels[stat],
          hero: heroStat,
          opponent: opponentStat,
          winner,
        });
      });
  
      let winner = null;
      if (heroWins > opponentWins) winner = 'hero';
      else if (opponentWins > heroWins) winner = 'opponent';
      else winner = 'draw';
  
      setBattleResult({ statResults, winner });
      setBattleLoading(false);
      setBattleStarted(true);
  
      // Save to battleHistory in json-server
      const battleRecord = {
        id: Date.now(),
        heroId: hero.pokemonId || hero.id,
        opponentId: opponent.pokemonId || opponent.id,
        heroName: hero.name,
        opponentName: opponent.name,
        heroImage: hero.image,
        opponentImage: opponent.image,
        heroTypes: hero.types,
        opponentTypes: opponent.types,
        winner,
        result: winner === 'hero' ? 'win' : winner === 'opponent' ? 'lose' : 'draw',
        date: new Date().toISOString()
      };
      // POST to json-server (adjust port if needed)
      fetch('http://localhost:3001/battleHistory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(battleRecord)
      });
    }, 1800);
  };

  useEffect(() => {
    AOS.init({ duration: 600, once: true });
  }, []);


  return (
    <div className="max-w-[1040px] mx-auto p-6 rounded-lg mt-8 ">

      <h2 className="text-2xl font-bold mb-8 text-center">Pokémon Battle</h2>
      <div className="flex flex-col md:flex-row items-center justify-center">
       {/* Hero Card */}
<div className="w-full md:w-[300px] pt-20 relative mt-10 md:order-first">
  {hero ? (
    <PokemonDetail
      pokemon={hero}
      isLoading={false}
      viewAngle="front"
      setViewAngle={() => {}}
      getTypeColor={getTypeColor}
      capitalize={capitalize}
      preventRefresh={true}
      mirrorImage={true}
      hideAddButton={true}
      hideId={true}
    />
  ) : (
    <div className="w-40 h-40 flex items-center justify-center bg-gray-100 rounded-xl shadow mb-4">
      <img src={placeholderImg} alt="Select your hero" className="h-24 opacity-40" />
    </div>
  )}
  {!hero && (
    <div className="text-center font-semibold text-lg"></div>
  )}
</div>

        {/* Center Area: Step logic */}
        <div className="flex-1 flex flex-col items-center">
        {battleLoading ? (

    // Show loading animation
    <div className="flex flex-col items-center min-w-[300px] py-12">
      <div className="animate-bounce text-5xl mb-4">⚡</div>
      <div className="text-2xl font-bold text-[#FF5350] mb-2">Battle Loading...</div>
      <div className="text-lg text-gray-500">
        {hero && opponent
          ? `${capitalize(hero.name)} vs ${capitalize(opponent.name)}!`
          : "The Pokémon are facing off!"}
      </div>
    </div>
    
  ) : !battleStarted ? (
          step === 1 ? (
            <>
              <div className="mb-4 text-center font-bold text-xl mt-20">Select Your Hero</div>
              {team.length === 0 ? (
                <div className="text-gray-500">Your team is empty. Add Pokémon to your team first!</div>
              ) : (
                <div className="grid grid-cols-3 gap-4">
                  {team.map(p => (
                    <button
                      key={p.id}
                      className={`flex flex-col items-center border-2 rounded-lg p-2 transition-all hover:border-[#FF5350] ${hero?.id === p.id ? 'border-[#FF5350] bg-red-50' : 'border-gray-200 bg-white'}`}
                      onClick={() => setHero(p)}
                    >
                      <img src={p.image} alt={p.name} className="h-16 mb-2" />
                      <span className="capitalize">{p.name}</span>
                    </button>
                  ))}
                </div>
              )}
              <button
                className="mt-6 px-6 py-2 bg-[#FF5350] text-white rounded-lg font-bold disabled:opacity-50"
                disabled={!hero}
                onClick={() => setStep(2)}
              >
                Select
              </button>
            </>
          

        ) : step === 2 ? (
            <>
              <div className="mb-4 text-center font-bold text-xl">Select Opponent</div>
              <div className="flex justify-center mb-6">
                <button
                  className={`px-4 py-2 rounded-l ${tab === TABS.TEAM ? 'bg-[#FF5350] text-white' : 'bg-gray-200'}`}
                  onClick={() => setTab(TABS.TEAM)}
                >
                  Team
                </button>
                <button
                  className={`px-4 py-2 rounded-r ${tab === TABS.GLOBAL ? 'bg-[#FF5350] text-white' : 'bg-gray-200'}`}
                  onClick={() => setTab(TABS.GLOBAL)}
                >
                  Global
                </button>
              </div>
              {tab === TABS.TEAM && (
  <>
    <div className="grid grid-cols-2 gap-x-12 gap-y-4 justify-items-center">
      {team.map(p => {
        const isHero = p.pokemonId === hero.pokemonId;
        return (
          <button
            key={p.id}
            disabled={isHero}
            className={`flex flex-col items-center border-2 rounded-lg p-2 transition-all h-40 w-full min-w-[120px] ${
              opponent?.id === p.id
                ? 'border-[#FF5350] bg-red-50'
                : isHero
                  ? 'border-gray-300 bg-gray-100 opacity-60 cursor-not-allowed'
                  : 'border-gray-200 bg-white hover:border-[#FF5350]'
            }`}
            onClick={() => !isHero && setOpponent(p)}
            title={isHero ? "This is your selected hero" : ""}
          >
            <img src={p.image} alt={p.name} className="h-16 mb-2" />
            <span className="capitalize">{p.name}</span>
            {isHero && (
              <span className="text-xs text-gray-500 mt-1">(Your Hero)</span>
            )}
          </button>
        );
      })}
    </div>
<button
  className="mt-6 px-6 py-2 bg-[#FF5350] text-white rounded-lg font-bold disabled:opacity-50"
  disabled={!opponent}
  onClick={simulateBattle}
>
  Select
</button>
  </>
)}
{tab === TABS.GLOBAL && (
  <>
    <PokemonSearchBar
      search={search}
      setSearch={setSearch}
      type=""
      setType={() => {}}
      typeOptions={[]}
      hideTypeSelection={true}
    />
    <div className="grid grid-cols-3 gap-4">
      {allPokemon
        .filter(p => p.name.toLowerCase().includes(search.toLowerCase()))
        .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
        .map(p => {
          const isHero = p.id === hero.pokemonId;
          return (
            <button
              key={p.id}
              disabled={isHero}
              className={`flex flex-col items-center border-2 rounded-lg p-2 transition-all ${
                opponent?.id === p.id
                  ? 'border-[#FF5350] bg-red-50'
                  : isHero
                    ? 'border-gray-300 bg-gray-100 opacity-60 cursor-not-allowed'
                    : 'border-gray-200 bg-white hover:border-[#FF5350]'
              }`}
              onClick={() => !isHero && setOpponent(p)}
              title={isHero ? "This is your selected hero" : ""}
            >
              <img src={p.image} alt={p.name} className="h-16 mb-2" />
              <span className="capitalize">{p.name}</span>
              {isHero && (
                <span className="text-xs text-gray-500 mt-1">(Your Hero)</span>
              )}
            </button>
          );
        })}
    </div>
<button
  className="mt-6 px-6 py-2 bg-[#FF5350] text-white rounded-lg font-bold disabled:opacity-50"
  disabled={!opponent}
  onClick={simulateBattle}
>
  Select
</button>
    <div className="mt-8">
  <Pagination
    currentPage={currentPage}
    totalPages={Math.ceil(
      allPokemon
        .filter(p => p.id !== (hero.id || hero.pokemonId))
        .filter(p => p.name.toLowerCase().includes(search.toLowerCase()))
        .length / itemsPerPage
    )}
    goToNextPage={() => setCurrentPage(p => p + 1)}
    goToPrevPage={() => setCurrentPage(p => p - 1)}
    goToPage={setCurrentPage}
  />
</div>
  </>
)}
            </>
            ) : null
        ) : (
              <div className="flex flex-col items-center min-w-[300px] mb-6 mt-">
                <h3 className="text-2xl font-bold mb-4 text-center">Battle Result</h3>
                <table className="mb-6 w-full max-w-md text-center ">
  <thead>
    <tr>
      <th className="py-2">Stat</th>
      <th className="py-2">{hero ? capitalize(hero.name) : "Hero"}</th>
      <th className="py-2">{opponent ? capitalize(opponent.name) : "Opponent"}</th>
      <th className="py-2">Winner</th>
    </tr>
  </thead>
  <tbody>
    {battleResult.statResults.map((res, idx) => (
      <tr
        key={idx}
        data-aos="fade-down"
        data-aos-delay={idx * 120}
      >
        <td className="py-1">{res.stat}</td>
        <td className="py-1">{res.hero}</td>
        <td className="py-1">{res.opponent}</td>
        <td className="py-1 font-bold">
          {res.winner === 'hero'
            ? <span className="text-green-600">{hero ? capitalize(hero.name) : "Hero"}</span>
            : res.winner === 'opponent'
              ? <span className="text-red-600">{opponent ? capitalize(opponent.name) : "Opponent"}</span>
              : <span className="text-gray-500">Draw</span>
          }
        </td>
      </tr>
    ))}
  </tbody>
</table>
                <div className="text-xl font-bold mb-4">
                  {battleResult.winner === 'hero' && hero && (
                    <span className="text-green-600">{capitalize(hero.name)} Wins!</span>
                  )}
                  {battleResult.winner === 'opponent' && opponent && (
                    <span className="text-red-600">{capitalize(opponent.name)} Wins!</span>
                  )}
                  {battleResult.winner === 'draw' && (
                    <span className="text-gray-600">It's a Draw!</span>
                  )}
                </div>
                <button
                  className="px-6 py-2 bg-[#FF5350] text-white rounded-lg font-bold"
                  onClick={() => {
                    setBattleStarted(false);
                    setBattleResult(null);
                    setStep(1);
                    setHero(null);
                    setOpponent(null);
                  }}
                >
                  Battle Again
                </button>
              </div>
            )}
        </div>

        {/* Opponent Card */}
<div className="w-full md:w-[300px] pt-20 relative mt-10 md:order-last  md:items-end">
  {opponent ? (
    <PokemonDetail
      pokemon={opponent}
      isLoading={false}
      viewAngle="front"
      setViewAngle={() => {}}
      getTypeColor={getTypeColor}
      capitalize={capitalize}
      preventRefresh={true}
      hideAddButton={true}
      hideId={true}
    />
  ) : (
    <div className="w-40 h-40 flex items-center justify-center bg-gray-100 rounded-xl shadow mb-4 ml-auto">
      <img src={placeholderImg} alt="Select your opponent" className="h-24 opacity-40" />
    </div>
  )}
  {!opponent && (
    <div className="text-center font-semibold text-lg"></div>
  )}
</div>
      </div>
    </div>
  );
};

export default PokemonBattle;