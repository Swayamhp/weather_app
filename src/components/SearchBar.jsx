import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Search, X } from 'lucide-react';
import { weatherAPI } from '../services/weatherApi';

const SearchBar = ({ onCitySelect }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0, width: 0 });

  useEffect(() => {
    const searchCities = async () => {
      if (query.length > 2) {
        const cities = await weatherAPI.searchCities(query);
        setResults(cities);
        setIsOpen(true);
      } else {
        setResults([]);
        setIsOpen(false);
      }
    };
    const timeoutId = setTimeout(searchCities, 300);
    return () => clearTimeout(timeoutId);
  }, [query]);

  const handleSelect = (city) => {
    setQuery('');
    setIsOpen(false);
    onCitySelect(city.name);
  };

  const inputRef = React.useRef(null);

  useEffect(() => {
    if (inputRef.current) {
      const rect = inputRef.current.getBoundingClientRect();
      setDropdownPos({
        top: rect.bottom + window.scrollY + 8,
        left: rect.left + window.scrollX,
        width: rect.width,
      });
    }
  }, [query]);

  const dropdown = isOpen && results.length > 0 && (
    <div
      className="
        absolute z-[99999]
        bg-gradient-to-br from-[#0f172a]/95 via-[#1e293b]/95 to-[#0b1120]/95
        backdrop-blur-2xl border border-slate-700/70
        rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.5)]
        overflow-hidden
        animate-fadeIn
      "
      style={{
        position: 'absolute',
        top: dropdownPos.top,
        left: dropdownPos.left,
        width: dropdownPos.width,
      }}
    >
      {results.map((city, index) => (
        <button
          key={index}
          onClick={() => handleSelect(city)}
          className="
            w-full text-left px-5 py-3
            text-slate-200 hover:text-white hover:bg-blue-600/30
            border-b border-slate-700/40 last:border-none
            transition-all duration-200
          "
        >
          <div className="font-semibold text-base">{city.name}</div>
          <div className="text-sm text-slate-400">{city.country}</div>
        </button>
      ))}
    </div>
  );

  return (
    <>
      <div className="relative w-full max-w-xl mx-auto">
        <div className="relative" ref={inputRef}>
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            size={20}
          />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for a city..."
            className="
              w-full pl-11 pr-10 py-3 rounded-2xl
              bg-gradient-to-br from-slate-800/80 via-slate-900/90 to-slate-950/90
              text-slate-200 placeholder-slate-500
              border border-slate-700/70 shadow-[0_0_15px_rgba(59,130,246,0.1)]
              focus:outline-none focus:ring-2 focus:ring-blue-500/70
              transition-all duration-300
            "
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors"
            >
              <X size={20} />
            </button>
          )}
        </div>
      </div>

      {ReactDOM.createPortal(dropdown, document.body)}
    </>
  );
};

export default SearchBar;
