import React from 'react';
import { TimerProvider } from './context/TimerContext';
import AppNavigator from './navigation/AppNavigator';

export default function App() {
  return (
    <TimerProvider>
      <AppNavigator />
    </TimerProvider>
  );
}
