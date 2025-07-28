import AsyncStorage from '@react-native-async-storage/async-storage';

export const saveTimers = async (timers) => {
  await AsyncStorage.setItem('timers', JSON.stringify(timers));
};

export const loadTimers = async () => {
  const timers = await AsyncStorage.getItem('timers');
  return timers ? JSON.parse(timers) : [];
};

export const saveHistory = async (history) => {
  await AsyncStorage.setItem('history', JSON.stringify(history));
};

export const loadHistory = async () => {
  const history = await AsyncStorage.getItem('history');
  return history ? JSON.parse(history) : [];
};
