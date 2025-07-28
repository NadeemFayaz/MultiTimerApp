import React, { createContext, useReducer, useEffect } from 'react';
import { loadTimers, saveTimers, loadHistory, saveHistory } from '../storage/storage';

export const TimerContext = createContext();

const initialState = {
  timers: [], // { id, name, duration, remaining, category, status, halfwayAlertShown }
  history: [], // { name, completedAt }
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'LOAD_TIMERS':
      return { ...state, timers: action.payload };
    case 'LOAD_HISTORY':
      return { ...state, history: action.payload };
    case 'ADD_TIMER':
      return { ...state, timers: [...state.timers, action.payload] };
    case 'START_TIMER':
      return {
        ...state,
        timers: state.timers.map(t =>
          t.id === action.id ? { ...t, status: 'running' } : t
        ),
      };
    case 'PAUSE_TIMER':
      return {
        ...state,
        timers: state.timers.map(t =>
          t.id === action.id ? { ...t, status: 'paused' } : t
        ),
      };
    case 'RESET_TIMER':
      return {
        ...state,
        timers: state.timers.map(t =>
          t.id === action.id
            ? { ...t, remaining: t.duration, status: 'paused', halfwayAlertShown: false }
            : t
        ),
      };
    case 'TICK':
      return {
        ...state,
        timers: state.timers.map(t =>
          t.id === action.id
            ? {
                ...t,
                remaining: Math.max(t.remaining - 1, 0),
              }
            : t
        ),
      };
    case 'COMPLETE_TIMER':
      return {
        ...state,
        timers: state.timers.map(t =>
          t.id === action.id ? { ...t, status: 'completed' } : t
        ),
        history: [
          ...state.history,
          { name: action.name, completedAt: new Date().toISOString() },
        ],
      };
    case 'HALFWAY_ALERT_SHOWN':
      return {
        ...state,
        timers: state.timers.map(t =>
          t.id === action.id ? { ...t, halfwayAlertShown: true } : t
        ),
      };
    default:
      return state;
  }
};

export const TimerProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Load from AsyncStorage on first render
  useEffect(() => {
    const loadData = async () => {
      const timers = await loadTimers();
      const history = await loadHistory();
      dispatch({ type: 'LOAD_TIMERS', payload: timers });
      dispatch({ type: 'LOAD_HISTORY', payload: history });
    };
    loadData();
  }, []);

  // Save changes
  useEffect(() => {
    saveTimers(state.timers);
  }, [state.timers]);

  useEffect(() => {
    saveHistory(state.history);
  }, [state.history]);

  return (
    <TimerContext.Provider value={{ state, dispatch }}>
      {children}
    </TimerContext.Provider>
  );
};
