'use client';
import { c } from './react-compiler-runtime-19061925.js';
import { useContext, useState, useEffect, createContext } from 'react';
import { jsx } from 'react/jsx-runtime';

const ColorSchemeContext = /*#__PURE__*/createContext({
  colorScheme: 'light',
  setColorScheme: () => {
    throw new Error('ColorSchemeContext was not initialized.');
  }
});
const ColorSchemeProvider = t0 => {
  const $ = c(3);
  const {
    children
  } = t0;
  const value = useColorSchemeState();
  let t1;
  if ($[0] !== value || $[1] !== children) {
    t1 = /*#__PURE__*/jsx(ColorSchemeContext.Provider, {
      value: value,
      children: children
    });
    $[0] = value;
    $[1] = children;
    $[2] = t1;
  } else {
    t1 = $[2];
  }
  return t1;
};
function useRootColorScheme() {
  return useContext(ColorSchemeContext);
}
const STORAGE_KEY = 'keystatic-root-color-scheme';

/** @private only for initializing the provider */
function useColorSchemeState() {
  const $ = c(6);
  const storedPreference = useStoredColorScheme();
  const [colorScheme, setStoredValue] = useState(storedPreference);
  let t0;
  if ($[0] === Symbol.for("react.memo_cache_sentinel")) {
    t0 = colorScheme_0 => {
      localStorage.setItem(STORAGE_KEY, colorScheme_0);
      setStoredValue(colorScheme_0);
    };
    $[0] = t0;
  } else {
    t0 = $[0];
  }
  const setColorScheme = t0;
  let t1;
  let t2;
  if ($[1] !== colorScheme) {
    t1 = () => {
      if (colorScheme === "system") {
        setColorScheme("auto");
      }
    };
    t2 = [colorScheme];
    $[1] = colorScheme;
    $[2] = t1;
    $[3] = t2;
  } else {
    t1 = $[2];
    t2 = $[3];
  }
  useEffect(t1, t2);
  let t3;
  if ($[4] !== colorScheme) {
    t3 = {
      colorScheme,
      setColorScheme
    };
    $[4] = colorScheme;
    $[5] = t3;
  } else {
    t3 = $[5];
  }
  return t3;
}
const useStoredColorScheme = typeof window === 'undefined' ? function useStoredColorScheme() {
  return 'auto';
} : function useStoredColorScheme() {
  return useLocalStorageValue(STORAGE_KEY);
};
function useLocalStorageValue(key) {
  const $ = c(5);
  let t0;
  if ($[0] !== key) {
    t0 = () => localStorage[key];
    $[0] = key;
    $[1] = t0;
  } else {
    t0 = $[1];
  }
  const [value, setValue] = useState(t0);
  let t1;
  let t2;
  if ($[2] !== key) {
    t1 = () => {
      const handler = () => {
        setValue(localStorage[key]);
      };
      window.addEventListener("storage", handler);
      return () => {
        window.removeEventListener("storage", handler);
      };
    };
    t2 = [key];
    $[2] = key;
    $[3] = t1;
    $[4] = t2;
  } else {
    t1 = $[3];
    t2 = $[4];
  }
  useEffect(t1, t2);
  return value;
}

export { ColorSchemeProvider, useRootColorScheme };
