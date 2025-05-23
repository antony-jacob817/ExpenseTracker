import React from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { ExpenseProvider } from './context/ExpenseContext';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <ThemeProvider>
      <ExpenseProvider>
        <Layout>
          <Dashboard />
        </Layout>
      </ExpenseProvider>
    </ThemeProvider>
  );
}

export default App;