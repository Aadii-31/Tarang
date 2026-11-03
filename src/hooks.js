import { useEffect, useState } from "react";

/** useState that persists to Local Storage. */
export function useLocalStorage(key, initial) {
  const [value, setValue] = useState(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : initial;
    } catch {
      return initial;
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* storage full or blocked: keep working in memory */
    }
  }, [key, value]);
  return [value, setValue];
}

/** Ticks every second and returns the time left until `iso`. */
export function useCountdown(iso) {
  const left = () => Math.max(0, Math.floor((new Date(iso) - Date.now()) / 1000));
  const [s, setS] = useState(left);
  useEffect(() => {
    setS(left());
    const t = setInterval(() => setS(left()), 1000);
    return () => clearInterval(t);
  }, [iso]);
  return { days: Math.floor(s / 86400), hours: Math.floor((s % 86400) / 3600), mins: Math.floor((s % 3600) / 60), secs: s % 60, done: s === 0 };
}
