import React, { createContext, useContext, useReducer, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HealthContext = createContext();

// Initial state
const initialState = {
  user: {
    name: 'User',
    dailyGoals: {
      water: 2000, // ml
      steps: 10000,
      sleep: 8, // hours
    },
    preferences: {
      notifications: true,
      theme: 'light',
      units: 'metric'
    }
  },
  waterEntries: [],
  stepEntries: [],
  sleepEntries: [],
  medications: [],
  medicationLogs: []
};

// Action types
const ACTIONS = {
  SET_USER: 'SET_USER',
  ADD_WATER_ENTRY: 'ADD_WATER_ENTRY',
  ADD_STEP_ENTRY: 'ADD_STEP_ENTRY',
  ADD_SLEEP_ENTRY: 'ADD_SLEEP_ENTRY',
  ADD_MEDICATION: 'ADD_MEDICATION',
  UPDATE_MEDICATION: 'UPDATE_MEDICATION',
  DELETE_MEDICATION: 'DELETE_MEDICATION',
  LOG_MEDICATION: 'LOG_MEDICATION',
  LOAD_DATA: 'LOAD_DATA'
};

// Reducer function
function healthReducer(state, action) {
  switch (action.type) {
    case ACTIONS.SET_USER:
      return { ...state, user: { ...state.user, ...action.payload } };
    
    case ACTIONS.ADD_WATER_ENTRY:
      return {
        ...state,
        waterEntries: [...state.waterEntries, action.payload]
      };
    
    case ACTIONS.ADD_STEP_ENTRY:
      return {
        ...state,
        stepEntries: [...state.stepEntries, action.payload]
      };
    
    case ACTIONS.ADD_SLEEP_ENTRY:
      return {
        ...state,
        sleepEntries: [...state.sleepEntries, action.payload]
      };
    
    case ACTIONS.ADD_MEDICATION:
      return {
        ...state,
        medications: [...state.medications, action.payload]
      };
    
    case ACTIONS.UPDATE_MEDICATION:
      return {
        ...state,
        medications: state.medications.map(med =>
          med.id === action.payload.id ? { ...med, ...action.payload } : med
        )
      };
    
    case ACTIONS.DELETE_MEDICATION:
      return {
        ...state,
        medications: state.medications.filter(med => med.id !== action.payload)
      };
    
    case ACTIONS.LOG_MEDICATION:
      return {
        ...state,
        medicationLogs: [...state.medicationLogs, action.payload]
      };
    
    case ACTIONS.LOAD_DATA:
      return { ...state, ...action.payload };
    
    default:
      return state;
  }
}

// Helper functions
const generateId = () => Date.now().toString(36) + Math.random().toString(36).substr(2);
const getTodayString = () => new Date().toISOString().split('T')[0];

export function HealthProvider({ children }) {
  const [state, dispatch] = useReducer(healthReducer, initialState);

  // Load data from AsyncStorage on mount
  useEffect(() => {
    loadData();
  }, []);

  // Save data to AsyncStorage whenever state changes
  useEffect(() => {
    saveData();
  }, [state]);

  const loadData = async () => {
    try {
      const savedData = await AsyncStorage.getItem('myhealth-data');
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        dispatch({ type: ACTIONS.LOAD_DATA, payload: parsedData });
      }
    } catch (error) {
      console.error('Error loading saved data:', error);
    }
  };

  const saveData = async () => {
    try {
      await AsyncStorage.setItem('myhealth-data', JSON.stringify(state));
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  // Action creators
  const actions = {
    setUser: (userData) => {
      dispatch({ type: ACTIONS.SET_USER, payload: userData });
    },

    addWaterEntry: (amount) => {
      const entry = {
        id: generateId(),
        amount,
        timestamp: new Date(),
        date: getTodayString()
      };
      dispatch({ type: ACTIONS.ADD_WATER_ENTRY, payload: entry });
    },

    addStepEntry: (steps) => {
      const entry = {
        id: generateId(),
        steps,
        distance: (steps * 0.0008).toFixed(2), // Rough calculation
        calories: Math.round(steps * 0.04),
        date: getTodayString()
      };
      dispatch({ type: ACTIONS.ADD_STEP_ENTRY, payload: entry });
    },

    addSleepEntry: (bedtime, wakeTime, quality) => {
      const duration = (new Date(wakeTime) - new Date(bedtime)) / (1000 * 60 * 60);
      const entry = {
        id: generateId(),
        bedtime: new Date(bedtime),
        wakeTime: new Date(wakeTime),
        duration: Math.max(0, duration),
        quality,
        date: getTodayString()
      };
      dispatch({ type: ACTIONS.ADD_SLEEP_ENTRY, payload: entry });
    },

    addMedication: (medicationData) => {
      const medication = {
        id: generateId(),
        ...medicationData,
        isActive: true,
        createdAt: new Date()
      };
      dispatch({ type: ACTIONS.ADD_MEDICATION, payload: medication });
    },

    updateMedication: (id, updates) => {
      dispatch({ type: ACTIONS.UPDATE_MEDICATION, payload: { id, ...updates } });
    },

    deleteMedication: (id) => {
      dispatch({ type: ACTIONS.DELETE_MEDICATION, payload: id });
    },

    logMedication: (medicationId, taken = true) => {
      const log = {
        id: generateId(),
        medicationId,
        takenAt: new Date(),
        skipped: !taken,
        date: getTodayString()
      };
      dispatch({ type: ACTIONS.LOG_MEDICATION, payload: log });
    }
  };

  // Computed values
  const computed = {
    getTodayWater: () => {
      const today = getTodayString();
      return state.waterEntries
        .filter(entry => entry.date === today)
        .reduce((total, entry) => total + entry.amount, 0);
    },

    getTodaySteps: () => {
      const today = getTodayString();
      const todayEntry = state.stepEntries.find(entry => entry.date === today);
      return todayEntry ? todayEntry.steps : 0;
    },

    getLastSleep: () => {
      return state.sleepEntries[state.sleepEntries.length - 1] || null;
    },

    getTodayMedications: () => {
      const today = getTodayString();
      const takenMeds = state.medicationLogs
        .filter(log => log.date === today && !log.skipped)
        .map(log => log.medicationId);
      
      return state.medications.filter(med => med.isActive).map(med => ({
        ...med,
        taken: takenMeds.includes(med.id)
      }));
    },

    getWeeklyData: (type) => {
      const days = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateString = date.toISOString().split('T')[0];
        days.push(dateString);
      }

      return days.map(date => {
        let value = 0;
        switch (type) {
          case 'water':
            value = state.waterEntries
              .filter(entry => entry.date === date)
              .reduce((total, entry) => total + entry.amount, 0);
            break;
          case 'steps':
            const stepEntry = state.stepEntries.find(entry => entry.date === date);
            value = stepEntry ? stepEntry.steps : 0;
            break;
          case 'sleep':
            const sleepEntry = state.sleepEntries.find(entry => entry.date === date);
            value = sleepEntry ? sleepEntry.duration : 0;
            break;
          default:
            break;
        }
        return { 
          date, 
          value, 
          day: new Date(date).toLocaleDateString('en', { weekday: 'short' }) 
        };
      });
    }
  };

  const value = {
    state,
    actions,
    computed
  };

  return (
    <HealthContext.Provider value={value}>
      {children}
    </HealthContext.Provider>
  );
}

export function useHealth() {
  const context = useContext(HealthContext);
  if (!context) {
    throw new Error('useHealth must be used within a HealthProvider');
  }
  return context;
}

