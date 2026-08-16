import React from 'react';
import { 
  Grid2X2, 
  Swords, 
  Puzzle, 
  History, 
  Trophy, 
  BrainCircuit, 
  Car, 
  Coffee,
  Users
} from 'lucide-react';

const CATEGORIES = [
  { name: 'All', icon: Grid2X2 },
  { name: 'Action', icon: Swords },
  { name: 'Multiplayer', icon: Users },
  { name: 'Puzzle', icon: Puzzle },
  { name: 'Retro', icon: History },
  { name: 'Strategy', icon: BrainCircuit },
  { name: 'Driving', icon: Car },
  { name: 'Sports', icon: Trophy },
  { name: 'Casual', icon: Coffee },
];

export const CategoryBar = ({
  selectedCategory,
  showFavoritesOnly,
  onSelectCategory,
  categoryCounts,
}) => {
  return (
    <div className="w-full bg-zinc-900/60 border-b border-zinc-800/60 py-3 px-4 overflow-x-auto scrollbar-none">
      <div className="max-w-7xl mx-auto flex items-center gap-2 min-w-max">
        {CATEGORIES.map(({ name, icon: Icon }) => {
          const isSelected = !showFavoritesOnly && selectedCategory === name;
          const count = categoryCounts[name] || 0;

          return (
            <button
              key={name}
              id={`cat-filter-${name.toLowerCase()}`}
              onClick={() => onSelectCategory(name)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 border transition-all ${
                isSelected
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 border-indigo-400 text-white shadow-lg shadow-indigo-600/25 scale-[1.02]'
                  : 'bg-zinc-950/80 border-zinc-800/80 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/80 hover:border-zinc-700'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-zinc-400'}`} />
              <span>{name}</span>
              <span
                className={`px-1.5 py-0.2 text-[10px] rounded-full font-mono font-bold ${
                  isSelected 
                    ? 'bg-white/20 text-white' 
                    : 'bg-zinc-800 text-zinc-400'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
