import { useState, useEffect, useCallback } from 'react';

/**
 * Options for customising how values are stored and retrieved.
 */
interface UseLocalStorageOptions<T> {
    /**
     * Convert the value to a string for storage.
     * Defaults to `JSON.stringify`.
     */
    serialize?: (value: T) => string;
    /**
     * Parse a raw localStorage string back into `T`.
     * Return `undefined` to fall back to `defaultValue`.
     * Defaults to `JSON.parse`.
     */
    deserialize?: (raw: string) => T | undefined;
}

/**
 * Synchronises a piece of React state with `localStorage`.
 *
 * Reads the stored value on first render (via a lazy initialiser so it
 * never causes an extra render) and writes it back whenever it changes.
 * Custom `serialize` / `deserialize` functions let callers store
 * non-JSON values or add validation.
 *
 * @template T - The type of the stored value
 * @param key - The localStorage key
 * @param defaultValue - Value used when nothing is stored or deserialisation fails
 * @param options - Optional custom serialiser / deserialiser
 * @returns A `[value, setValue]` tuple, matching the `useState` API
 *
 * @example
 * ```tsx
 * const [size, setSize] = useLocalStorage<number>('grid-size', 5);
 * ```
 */
export function useLocalStorage<T>(
    key: string,
    defaultValue: T,
    options: UseLocalStorageOptions<T> = {},
): [T, React.Dispatch<React.SetStateAction<T>>] {
    const {
        serialize = (v: T) => JSON.stringify(v),
        deserialize = (raw: string) => JSON.parse(raw) as T,
    } = options;

    const [value, setValue] = useState<T>(() => {
        try {
            const raw = localStorage.getItem(key);
            if (raw === null) return defaultValue;
            const parsed = deserialize(raw);
            return parsed === undefined ? defaultValue : parsed;
        } catch {
            return defaultValue;
        }
    });

    useEffect(() => {
        try {
            localStorage.setItem(key, serialize(value));
        } catch {
            // Quota exceeded or other storage error; silently ignore.
        }
    }, [key, value, serialize]);

    const set = useCallback<React.Dispatch<React.SetStateAction<T>>>(action => {
        setValue(action);
    }, []);

    return [value, set];
}
