import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import VocabularyList from './pages/VocabularyList';
import StudyMode from './pages/StudyMode';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import { VocabularyProvider } from './context/VocabularyContext';
import './App.css';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('vocaboard-theme');
    if (savedTheme === 'dark') {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
    if (!darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('vocaboard-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('vocaboard-theme', 'light');
    }
  };

  return (
    <VocabularyProvider>
      <Router>
        <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300`}>
          <Header 
            onMenuClick={() => setSidebarOpen(!sidebarOpen)}
            darkMode={darkMode}
            onThemeToggle={toggleTheme}
          />
          
          <div className="flex">
            <AnimatePresence>
              {sidebarOpen && (
                <motion.div
                  initial={{ x: -280 }}
                  animate={{ x: 0 }}
                  exit={{ x: -280 }}
                  transition={{ type: "spring", damping: 25, stiffness: 200 }}
                  className="fixed inset-y-0 left-0 z-50 w-70 bg-white dark:bg-gray-800 shadow-xl lg:relative lg:translate-x-0"
                >
                  <Sidebar onClose={() => setSidebarOpen(false)} />
                </motion.div>
              )}
            </AnimatePresence>

            <main className="flex-1 p-4 lg:p-6 pt-20">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/vocabulary" element={<VocabularyList />} />
                <Route path="/study" element={<StudyMode />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/settings" element={<Settings />} />
              </Routes>
            </main>
          </div>

          {sidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}
        </div>
      </Router>
    </VocabularyProvider>
  );
}

export default App;