import { useLayoutEffect } from "https://esm.sh/preact/hooks";

export function useStoredState(prefix, onChange) {
  const eventName = `${prefix}storedstate`;

  const getKey = (key) => `${prefix}:${key}`;

  const save = (key, value) => {
    localStorage.setItem(getKey(key), value);
    dispatchEvent(new CustomEvent(eventName));
  };

  const read = (key) => {
    return localStorage.getItem(getKey(key));
  };

  useLayoutEffect(() => {
    addEventListener(eventName, onChange);
    return () => removeEventListener(eventName, onChange);
  }, []);

  return { save, read };
}
