'use client';
import { useContext, useState, useEffect, createContext } from 'react';
import { jsx } from 'react/jsx-runtime';

const ColorSchemeContext = /*#__PURE__*/createContext({
  colorScheme: 'light',
  setColorScheme: () => {
    throw new Error('ColorSchemeContext was not initialized.');
  }
});
const ColorSchemeProvider = ({
  children
}) => {
  const value = useColorSchemeState();
  return /*#__PURE__*/jsx(ColorSchemeContext.Provider, {
    value: value,
    children: children
  });
};
function useRootColorScheme() {
  return useContext(ColorSchemeContext);
}
const STORAGE_KEY = 'keystatic-root-color-scheme';

/** @private only for initializing the provider */
function useColorSchemeState() {
  let storedPreference = useStoredColorScheme();
  let [colorScheme, setStoredValue] = useState(storedPreference);
  let setColorScheme = colorScheme => {
    localStorage.setItem(STORAGE_KEY, colorScheme);
    setStoredValue(colorScheme);
  };

  // fix for renamed value: "system" --> "auto"
  // remove after a month or so: ~2023-10-01
  useEffect(() => {
    // @ts-expect-error
    if (colorScheme === 'system') {
      setColorScheme('auto');
    }
  }, [colorScheme]);
  return {
    colorScheme,
    setColorScheme
  };
}
const useStoredColorScheme = typeof window === 'undefined' ? function useStoredColorScheme() {
  return 'auto';
} : function useStoredColorScheme() {
  return useLocalStorageValue(STORAGE_KEY);
};
function useLocalStorageValue(key) {
  let [value, setValue] = useState(() => localStorage[key]);
  useEffect(() => {
    const handler = () => {
      setValue(localStorage[key]);
    };
    window.addEventListener('storage', handler);
    return () => {
      window.removeEventListener('storage', handler);
    };
  }, [key]);
  return value;
}

export { ColorSchemeProvider, useRootColorScheme };
