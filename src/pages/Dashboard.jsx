import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useVocabulary } from '../context/VocabularyContext';

const { FiBook, FiTarget, FiTrendingUp, FiCalendar, FiPlay, FiPlus } = FiIcons;

const Dashboard = () => {
  const { state } = useVocabulary();
  const { stats, words } = state;

  const statCards = [
    {
      title: 'Total Words',
      value: stats.totalWords,
      icon: FiBook,
      color: 'from-blue-500 to-cyan-500',
      change: '+12 this week'
    },
    {
      title: 'Mastered',
      value: stats.masteredWords,
      icon: FiTarget,
      color: 'from-green-500 to-emerald-500',
      change: '+3 this week'
    },
    {
      title: 'Study Streak',
      value: `${stats.studyStreak} days`,
      icon: FiTrendingUp,
      color: 'from-purple-500 to-pink-500',
      change: 'Keep it up!'
    },
    {
      title: 'Today Studied',
      value: stats.todayStudied,
      icon: FiCalendar,
      color: 'from-orange-500 to-red-500',
      change: 'Great progress'
    }
  ];

  const recentWords = words.slice(-3).reverse();

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Welcome back!</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Ready to expand your vocabulary today?</p>
        </div>
        
        <div className="flex space-x-3 mt-4 sm:mt-0">
          <Link
            to="/vocabulary"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <SafeIcon icon={FiPlus} className="w-4 h-4 mr-2" />
            Add Word
          </Link>
          <Link
            to="/study"
            className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <SafeIcon icon={FiPlay} className="w-4 h-4 mr-2" />
            Study Now
          </Link>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
          >
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{card.title}</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{card.value}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">{card.change}</p>
                </div>
                <div className={`w-12 h-12 bg-gradient-to-r ${card.color} rounded-lg flex items-center justify-center`}>
                  <SafeIcon icon={card.icon} className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700"
        >
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Words</h3>
            <div className="space-y-4">
              {recentWords.map((word) => (
                <div key={word.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">{word.word}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{word.definition}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    word.mastered 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                      : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                  }`}>
                    {word.mastered ? 'Mastered' : 'Learning'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700"
        >
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Link
                to="/study"
                className="flex items-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors group"
              >
                <SafeIcon icon={FiPlay} className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-3" />
                <span className="text-blue-600 dark:text-blue-400 font-medium">Start Study Session</span>
              </Link>
              
              <Link
                to="/vocabulary"
                className="flex items-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/40 transition-colors group"
              >
                <SafeIcon icon={FiPlus} className="w-5 h-5 text-green-600 dark:text-green-400 mr-3" />
                <span className="text-green-600 dark:text-green-400 font-medium">Add New Word</span>
              </Link>
              
              <Link
                to="/analytics"
                className="flex items-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/40 transition-colors group"
              >
                <SafeIcon icon={FiTrendingUp} className="w-5 h-5 text-purple-600 dark:text-purple-400 mr-3" />
                <span className="text-purple-600 dark:text-purple-400 font-medium">View Progress</span>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;