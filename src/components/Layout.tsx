import React from 'react';
import Header from './Header';
import { useTheme } from '../context/ThemeContext';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { theme } = useTheme();
  
  return (
    <div className={`min-h-screen flex flex-col ${theme === 'dark' ? 'dark' : ''}`}>
      <Header />
      <main className="flex-1 container mx-auto px-4 py-6 md:px-6">
        {children}
      </main>
      <footer className="py-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>SmartSpend &copy; {new Date().getFullYear()} - Track your expenses wisely</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;