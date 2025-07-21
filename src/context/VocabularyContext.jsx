import React, { createContext, useContext, useReducer, useEffect } from 'react';

const VocabularyContext = createContext();

const initialState = {
  words: [],
  studySessions: [],
  stats: {
    totalWords: 0,
    masteredWords: 0,
    studyStreak: 0,
    todayStudied: 0
  }
};

const vocabularyReducer = (state, action) => {
  switch (action.type) {
    case 'LOAD_DATA':
      return { ...state, ...action.payload };
    
    case 'ADD_WORD':
      const newWord = {
        id: Date.now(),
        word: action.payload.word,
        definition: action.payload.definition,
        example: action.payload.example,
        category: action.payload.category,
        difficulty: action.payload.difficulty,
        dateAdded: new Date().toISOString(),
        mastered: false,
        reviewCount: 0,
        correctCount: 0
      };
      return {
        ...state,
        words: [...state.words, newWord],
        stats: {
          ...state.stats,
          totalWords: state.stats.totalWords + 1
        }
      };
    
    case 'UPDATE_WORD':
      return {
        ...state,
        words: state.words.map(word =>
          word.id === action.payload.id ? { ...word, ...action.payload.updates } : word
        )
      };
    
    case 'DELETE_WORD':
      return {
        ...state,
        words: state.words.filter(word => word.id !== action.payload.id),
        stats: {
          ...state.stats,
          totalWords: state.stats.totalWords - 1
        }
      };
    
    case 'RECORD_STUDY_SESSION':
      return {
        ...state,
        studySessions: [...state.studySessions, action.payload],
        stats: {
          ...state.stats,
          todayStudied: state.stats.todayStudied + 1
        }
      };
    
    default:
      return state;
  }
};

export const VocabularyProvider = ({ children }) => {
  const [state, dispatch] = useReducer(vocabularyReducer, initialState);

  useEffect(() => {
    // Load data from localStorage
    const savedData = localStorage.getItem('vocaboard-data');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        dispatch({ type: 'LOAD_DATA', payload: parsedData });
      } catch (error) {
        console.error('Error loading saved data:', error);
      }
    } else {
      // Initialize with sample data
      const sampleData = {
        words: [
          {
            id: 1,
            word: "Serendipity",
            definition: "The occurrence of events by chance in a happy way",
            example: "Meeting my best friend was pure serendipity.",
            category: "General",
            difficulty: "Medium",
            dateAdded: new Date().toISOString(),
            mastered: false,
            reviewCount: 3,
            correctCount: 2
          },
          {
            id: 2,
            word: "Ephemeral",
            definition: "Lasting for a very short time",
            example: "The beauty of cherry blossoms is ephemeral.",
            category: "Academic",
            difficulty: "Hard",
            dateAdded: new Date().toISOString(),
            mastered: true,
            reviewCount: 5,
            correctCount: 5
          }
        ],
        stats: {
          totalWords: 2,
          masteredWords: 1,
          studyStreak: 3,
          todayStudied: 5
        }
      };
      dispatch({ type: 'LOAD_DATA', payload: sampleData });
    }
  }, []);

  useEffect(() => {
    // Save data to localStorage whenever state changes
    localStorage.setItem('vocaboard-data', JSON.stringify(state));
  }, [state]);

  return (
    <VocabularyContext.Provider value={{ state, dispatch }}>
      {children}
    </VocabularyContext.Provider>
  );
};

export const useVocabulary = () => {
  const context = useContext(VocabularyContext);
  if (!context) {
    throw new Error('useVocabulary must be used within a VocabularyProvider');
  }
  return context;
};