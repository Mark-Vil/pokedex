import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import pokemonIcon from "../assets/icons/pokemon_logo_icon.webp";

const Navbar = ({ className }) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav
      className={`h-20 bg-white shadow-lg rounded-lg border border-gray-200 flex items-center relative pb-0 ${
        className || ""
      }`}
    >
      <div className="w-[1000px] mx-auto px-4">
        <div className="flex items-center h-full pb-0">
          {/* Mobile Pokemon Icon - Only visible when menu is not open */}
          <div className="md:hidden flex items-center">
            {!isOpen && (
              <Link to="/" className="flex items-center">
                <img
                  src={pokemonIcon}
                  alt="Pokemon Icon"
                  className="h-10 w-auto"
                />
              </Link>
            )}
          </div>

          {/* Primary Nav - Desktop */}
          <div className="hidden md:flex w-full justify-between items-center relative pb-1">
            <Link
              to="/pokedex"
              className={`nav-link group py-2 px-3 transition duration-300 flex items-center font-bold tracking-wide relative
              ${
                isActive("/pokedex")
                  ? "text-[#FF5350]"
                  : "text-[#807B78] hover:text-[#FF5350]"
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 mr-2 transition duration-300 group-hover:fill-[#FF5350]"
                viewBox="0 0 20 20"
                fill={isActive("/pokedex") ? "#FF5350" : "#807B78"}
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM10 4a6 6 0 100 12 6 6 0 000-12z"
                  clipRule="evenodd"
                />
                <path
                  fillRule="evenodd"
                  d="M10 14a4 4 0 100-8 4 4 0 000 8z"
                  fill="white"
                  clipRule="evenodd"
                />
                <path
                  fillRule="evenodd"
                  d="M10 12a2 2 0 100-4 2 2 0 000 4z"
                  fill={isActive("/pokedex") ? "#FF5350" : "#807B78"}
                  clipRule="evenodd"
                />
              </svg>
              Pokédex
              {/* Absolute positioned underline at the bottom */}
              <div
                className={`absolute bottom-[-21px] left-0 w-full h-[3px] transition-all duration-300 
              ${
                isActive("/pokedex")
                  ? "bg-[#FF5350]"
                  : "bg-transparent group-hover:bg-[#FF5350]"
              }`}
              ></div>
            </Link>

            <Link
              to="/team"
              className={`nav-link group py-2 px-3 transition duration-300 flex items-center font-bold tracking-wide relative
              ${
                isActive("/team")
                  ? "text-[#FF5350]"
                  : "text-[#807B78] hover:text-[#FF5350]"
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 mr-2 transition duration-300 group-hover:fill-[#FF5350]"
                viewBox="0 0 20 20"
                fill={isActive("/team") ? "#FF5350" : "#807B78"}
              >
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
              </svg>
              Team
              <div
                className={`absolute bottom-[-21px] left-0 w-full h-[3px] transition-all duration-300 
              ${
                isActive("/team")
                  ? "bg-[#FF5350]"
                  : "bg-transparent group-hover:bg-[#FF5350]"
              }`}
              ></div>
            </Link>

            {/* Apply the same pattern to other links */}
            <Link
              to="/history"
              className={`nav-link group py-2 px-3 transition duration-300 flex items-center font-bold tracking-wide relative
              ${
                isActive("/history")
                  ? "text-[#FF5350]"
                  : "text-[#807B78] hover:text-[#FF5350]"
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 mr-2 transition duration-300 group-hover:fill-[#FF5350]"
                viewBox="0 0 20 20"
                fill={isActive("/history") ? "#FF5350" : "#807B78"}
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                  clipRule="evenodd"
                />
              </svg>
              History
              <div
                className={`absolute bottom-[-21px] left-0 w-full h-[3px] transition-all duration-300 
              ${
                isActive("/history")
                  ? "bg-[#FF5350]"
                  : "bg-transparent group-hover:bg-[#FF5350]"
              }`}
              ></div>
            </Link>

            <Link
              to="/battle"
              className={`nav-link group py-2 px-3 transition duration-300 flex items-center font-bold tracking-wide relative
              ${
                isActive("/battle")
                  ? "text-[#FF5350]"
                  : "text-[#807B78] hover:text-[#FF5350]"
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 mr-2 transition duration-300 group-hover:fill-[#FF5350]"
                viewBox="0 0 20 20"
                fill={isActive("/battle") ? "#FF5350" : "#807B78"}
              >
                <path
                  fillRule="evenodd"
                  d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"
                  clipRule="evenodd"
                />
              </svg>
              Battle
              <div
                className={`absolute bottom-[-21px] left-0 w-full h-[3px] transition-all duration-300 
              ${
                isActive("/battle")
                  ? "bg-[#FF5350]"
                  : "bg-transparent group-hover:bg-[#FF5350]"
              }`}
              ></div>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex w-full justify-end items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="mobile-menu-button p-2 focus:outline-none focus:bg-gray-100 rounded transition-transform duration-300 ease-in-out"
            >
              <svg
                className="h-6 w-6 text-gray-700"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden fixed top-0 left-0 h-full w-64 bg-white shadow-lg border-r border-gray-200 z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="px-2 py-4">
          <Link
            to="/pokedex"
            className={`block py-2 px-4 font-bold tracking-wide flex items-center
              ${
                isActive("/pokedex")
                  ? "text-[#FF5350]"
                  : "text-[#807B78] hover:text-[#FF5350]"
              }`}
            onClick={() => setIsOpen(false)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 mr-2"
              viewBox="0 0 20 20"
              fill={isActive("/pokedex") ? "#FF5350" : "#807B78"}
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM10 4a6 6 0 100 12 6 6 0 000-12z"
                clipRule="evenodd"
              />
              <path
                fillRule="evenodd"
                d="M10 14a4 4 0 100-8 4 4 0 000 8z"
                fill="white"
                clipRule="evenodd"
              />
              <path
                fillRule="evenodd"
                d="M10 12a2 2 0 100-4 2 2 0 000 4z"
                fill={isActive("/pokedex") ? "#FF5350" : "#807B78"}
                clipRule="evenodd"
              />
            </svg>
            Pokédex
          </Link>

          <Link
            to="/team"
            className={`block py-2 px-4 font-bold tracking-wide flex items-center
              ${
                isActive("/team")
                  ? "text-[#FF5350]"
                  : "text-[#807B78] hover:text-[#FF5350]"
              }`}
            onClick={() => setIsOpen(false)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 mr-2"
              viewBox="0 0 20 20"
              fill={isActive("/team") ? "#FF5350" : "#807B78"}
            >
              <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
            </svg>
            Team
          </Link>

          <Link
            to="/history"
            className={`block py-2 px-4 font-bold tracking-wide flex items-center
              ${
                isActive("/history")
                  ? "text-[#FF5350]"
                  : "text-[#807B78] hover:text-[#FF5350]"
              }`}
            onClick={() => setIsOpen(false)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 mr-2"
              viewBox="0 0 20 20"
              fill={isActive("/history") ? "#FF5350" : "#807B78"}
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                clipRule="evenodd"
              />
            </svg>
            History
          </Link>

          <Link
            to="/battle"
            className={`block py-2 px-4 font-bold tracking-wide flex items-center
              ${
                isActive("/battle")
                  ? "text-[#FF5350]"
                  : "text-[#807B78] hover:text-[#FF5350]"
              }`}
            onClick={() => setIsOpen(false)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 mr-2"
              viewBox="0 0 20 20"
              fill={isActive("/battle") ? "#FF5350" : "#807B78"}
            >
              <path
                fillRule="evenodd"
                d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"
                clipRule="evenodd"
              />
            </svg>
            Battle
          </Link>
        </div>
      </div>

      {/* Overlay to close the menu when clicking outside */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-opacity-30 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </nav>
  );
};

export default Navbar;
