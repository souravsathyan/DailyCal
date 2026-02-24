import { createMMKV } from 'react-native-mmkv';
import { StateStorage } from 'zustand/middleware';

// Create a single shared MMKV instance for the whole app
const storage = createMMKV({
  id: 'dailycal-global-storage',
});

// Export it as a compliant Zustand persister
export const zustandStorage: StateStorage = {
  setItem: (name, value) => {
    return storage.set(name, value);
  },
  getItem: (name) => {
    const value = storage.getString(name);
    return value ?? null;
  },
  removeItem: (name) => {
    return storage.remove(name);
  },
};
