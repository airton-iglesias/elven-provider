import AsyncStorage from '@react-native-async-storage/async-storage';

export const StorageService = {
  setItem: async (key: string, value: any, handleErrorCallback?: Function) => {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('AsyncStorage setItem error: ', error);
      handleErrorCallback?.(error);
    }
  },
  getItem: async (key: string, handleErrorCallback?: Function) => {
    try {
      const value = await AsyncStorage.getItem(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error('AsyncStorage getItem error: ', error);
      handleErrorCallback?.(error);
    }
  },
};