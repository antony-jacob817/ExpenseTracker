import React from 'react';
import { HandCoins } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const Header: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-10 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm transition-colors duration-300">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <HandCoins className="h-7 w-7 text-blue-500" />
          <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
            Smart<span className="text-blue-500">Spend</span>
          </h1>
        </div>

        {/* Toggle switch */}
        <label className="relative inline-flex items-center cursor-pointer w-12 h-6">
  <input
    type="checkbox"
    className="sr-only peer"
    checked={theme === 'dark'}
    onChange={toggleTheme}
  />
  <div className="w-full h-full bg-gray-300 rounded-full peer-checked:bg-blue-500 dark:bg-gray-600 transition-colors"></div>
  <div className="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full flex items-center justify-center text-xs transition-transform duration-300 transform peer-checked:translate-x-6 shadow">
    {theme === 'dark' ? '🌙' : '🌞'}
  </div>
</label>

      </div>
    </header>
  );
};

export default Header;
