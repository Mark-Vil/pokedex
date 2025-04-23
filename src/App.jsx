import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import PokemonList from './components/PokemonList'
import TeamPage from './pages/TeamPage'
import PokemonBattle from './components/PokemonBattle'; 
import BattleHistory from './components/BattleHistory';
import './App.css'

function App() {
  // Create a shared component for both root and /pokedex routes
  const PokemonListView = () => (
    <div className="p-4 max-w-[1040px] mx-auto">
      <p className="mb-6 text-gray-600">Explore comprehensive information about all Pokémon species.</p>
      <PokemonList />
    </div>
  );

  return (
    <Router>
      <div className="navbar-wrapper w-full">
        <div className="navbar-container">
          <Navbar className="navbar-floating" />
        </div>
      </div>
      <div className="App">
        <Routes>
          <Route path="/" element={<PokemonListView />} />
          <Route path="/pokedex" element={<PokemonListView />} />
          <Route path="/team" element={<TeamPage />} />
          <Route path="/history" element={<BattleHistory />} />
          <Route path="/battle" element={<PokemonBattle />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App