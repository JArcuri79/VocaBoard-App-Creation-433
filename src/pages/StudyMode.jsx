import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useVocabulary } from '../context/VocabularyContext';

const { FiPlay, FiCheck, FiX, FiRotateCcw, FiTarget } = FiIcons;

const StudyMode = () => {
  const { state, dispatch } = useVocabulary();
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [showDefinition, setShowDefinition] = useState(false);
  const [sessionStats, setSessionStats] = useState({
    correct: 0,
    incorrect: 0,
    total: 0
  });
  const [studyWords, setStudyWords] = useState([]);
  const [sessionStarted, setSessionStarted] = useState(false);

  useEffect(() => {
    // Filter words that need review (not mastered or low accuracy)
    const wordsToStudy = state.words.filter(word => 
      !word.mastered || (word.reviewCount > 0 && (word.correctCount / word.reviewCount) < 0.8)
    );
    setStudyWords(wordsToStudy.sort(() => Math.random() - 0.5)); // Shuffle
  }, [state.words]);

  const currentWord = studyWords[currentWordIndex];

  const startSession = () => {
    setSessionStarted(true);
    setCurrentWordIndex(0);
    setShowDefinition(false);
    setSessionStats({ correct: 0, incorrect: 0, total: 0 });
  };

  const handleAnswer = (isCorrect) => {
    const newStats = {
      ...sessionStats,
      total: sessionStats.total + 1,
      [isCorrect ? 'correct' : 'incorrect']: sessionStats[isCorrect ? 'correct' : 'incorrect'] + 1
    };
    setSessionStats(newStats);

    // Update word statistics
    dispatch({
      type: 'UPDATE_WORD',
      payload: {
        id: currentWord.id,
        updates: {
          reviewCount: currentWord.reviewCount + 1,
          correctCount: currentWord.correctCount + (isCorrect ? 1 : 0),
          mastered: isCorrect && (currentWord.correctCount + 1) >= 3 // Master after 3 correct answers
        }
      }
    });

    // Move to next word or finish session
    if (currentWordIndex < studyWords.length - 1) {
      setTimeout(() => {
        setCurrentWordIndex(currentWordIndex + 1);
        setShowDefinition(false);
      }, 1000);
    } else {
      setTimeout(() => {
        setSessionStarted(false);
        dispatch({
          type: 'RECORD_STUDY_SESSION',
          payload: {
            date: new Date().toISOString(),
            wordsStudied: studyWords.length,
            accuracy: Math.round((newStats.correct / newStats.total) * 100)
          }
        });
      }, 1000);
    }
  };

  const resetSession = () => {
    setSessionStarted(false);
    setCurrentWordIndex(0);
    setShowDefinition(false);
    setSessionStats({ correct: 0, incorrect: 0, total: 0 });
  };

  if (studyWords.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <SafeIcon icon={FiTarget} className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Great job!</h2>
          <p className="text-gray-600 dark:text-gray-400">You've mastered all your vocabulary words. Add more words to continue studying.</p>
        </motion.div>
      </div>
    );
  }

  if (!sessionStarted) {
    return (
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Study Mode</h1>
          <p className="text-gray-600 dark:text-gray-400">Ready to test your vocabulary knowledge?</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8 text-center max-w-md mx-auto"
        >
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <SafeIcon icon={FiPlay} className="w-8 h-8 text-white" />
          </div>
          
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Start Study Session</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            You have <span className="font-semibold text-blue-600 dark:text-blue-400">{studyWords.length} words</span> to review
          </p>
          
          <button
            onClick={startSession}
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Start Session
          </button>
        </motion.div>

        {sessionStats.total > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 max-w-md mx-auto"
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Last Session Results</h3>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{sessionStats.total}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">{sessionStats.correct}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Correct</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-red-600 dark:text-red-400">{sessionStats.incorrect}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Incorrect</p>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Study Session</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Question {currentWordIndex + 1} of {studyWords.length}
          </p>
        </div>
        
        <button
          onClick={resetSession}
          className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
        >
          <SafeIcon icon={FiRotateCcw} className="w-5 h-5" />
        </button>
      </motion.div>

      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
        <motion.div
          className="bg-blue-600 h-2 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${((currentWordIndex + 1) / studyWords.length) * 100}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      <motion.div
        key={currentWordIndex}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8 text-center max-w-2xl mx-auto"
      >
        <div className="mb-8">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {currentWord?.word}
          </h2>
          
          <AnimatePresence>
            {showDefinition ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                <p className="text-lg text-gray-700 dark:text-gray-300">
                  {currentWord?.definition}
                </p>
                {currentWord?.example && (
                  <p className="text-gray-600 dark:text-gray-400 italic">
                    "{currentWord.example}"
                  </p>
                )}
                
                <div className="flex justify-center space-x-4 mt-8">
                  <button
                    onClick={() => handleAnswer(false)}
                    className="flex items-center px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    <SafeIcon icon={FiX} className="w-5 h-5 mr-2" />
                    I didn't know this
                  </button>
                  <button
                    onClick={() => handleAnswer(true)}
                    className="flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <SafeIcon icon={FiCheck} className="w-5 h-5 mr-2" />
                    I knew this
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <p className="text-gray-600 dark:text-gray-400 mb-8">
                  Do you remember the definition of this word?
                </p>
                <button
                  onClick={() => setShowDefinition(true)}
                  className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Show Definition
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex justify-center space-x-6 text-sm text-gray-500 dark:text-gray-400">
          <span>Correct: {sessionStats.correct}</span>
          <span>Incorrect: {sessionStats.incorrect}</span>
          <span>Total: {sessionStats.total}</span>
        </div>
      </motion.div>
    </div>
  );
};

export default StudyMode;