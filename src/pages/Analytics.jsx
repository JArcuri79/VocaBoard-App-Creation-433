import React from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useVocabulary } from '../context/VocabularyContext';

const { FiTrendingUp, FiTarget, FiBook, FiCalendar } = FiIcons;

const Analytics = () => {
  const { state } = useVocabulary();
  const { words, stats, studySessions } = state;

  const categoryStats = words.reduce((acc, word) => {
    acc[word.category] = (acc[word.category] || 0) + 1;
    return acc;
  }, {});

  const difficultyStats = words.reduce((acc, word) => {
    acc[word.difficulty] = (acc[word.difficulty] || 0) + 1;
    return acc;
  }, {});

  const masteryRate = words.length > 0 ? Math.round((stats.masteredWords / stats.totalWords) * 100) : 0;
  const averageAccuracy = words.length > 0 ? 
    Math.round(words.reduce((acc, word) => {
      return acc + (word.reviewCount > 0 ? (word.correctCount / word.reviewCount) * 100 : 0);
    }, 0) / words.length) : 0;

  const recentSessions = studySessions.slice(-7).reverse();

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Analytics</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Track your vocabulary learning progress</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            title: 'Mastery Rate',
            value: `${masteryRate}%`,
            icon: FiTarget,
            color: 'from-green-500 to-emerald-500',
            change: '+5% this week'
          },
          {
            title: 'Average Accuracy',
            value: `${averageAccuracy}%`,
            icon: FiTrendingUp,
            color: 'from-blue-500 to-cyan-500',
            change: '+2% this week'
          },
          {
            title: 'Total Reviews',
            value: words.reduce((acc, word) => acc + word.reviewCount, 0),
            icon: FiBook,
            color: 'from-purple-500 to-pink-500',
            change: '+24 this week'
          },
          {
            title: 'Study Streak',
            value: `${stats.studyStreak} days`,
            icon: FiCalendar,
            color: 'from-orange-500 to-red-500',
            change: 'Keep it up!'
          }
        ].map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stat.value}</p>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">{stat.change}</p>
              </div>
              <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-lg flex items-center justify-center`}>
                <SafeIcon icon={stat.icon} className="w-6 h-6 text-white" />
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
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Words by Category</h3>
          <div className="space-y-4">
            {Object.entries(categoryStats).map(([category, count]) => (
              <div key={category} className="flex items-center justify-between">
                <span className="text-gray-700 dark:text-gray-300">{category}</span>
                <div className="flex items-center space-x-3">
                  <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${(count / words.length) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white w-8">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Difficulty Distribution</h3>
          <div className="space-y-4">
            {Object.entries(difficultyStats).map(([difficulty, count]) => {
              const colors = {
                Easy: 'bg-green-600',
                Medium: 'bg-yellow-600',
                Hard: 'bg-red-600'
              };
              return (
                <div key={difficulty} className="flex items-center justify-between">
                  <span className="text-gray-700 dark:text-gray-300">{difficulty}</span>
                  <div className="flex items-center space-x-3">
                    <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className={`${colors[difficulty]} h-2 rounded-full`}
                        style={{ width: `${(count / words.length) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white w-8">{count}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Recent Study Sessions</h3>
        {recentSessions.length > 0 ? (
          <div className="space-y-4">
            {recentSessions.map((session, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {new Date(session.date).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {session.wordsStudied} words studied
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900 dark:text-white">{session.accuracy}%</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">accuracy</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <SafeIcon icon={FiBook} className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">No study sessions yet. Start studying to see your progress!</p>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Analytics;