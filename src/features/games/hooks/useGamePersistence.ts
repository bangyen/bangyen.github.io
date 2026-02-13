import { useEffect, useRef } from 'react';

interface PersistenceOptions<T> {
    storageKey: string;
    rows: number;
    cols: number;
    state: T;
    onRestore: (savedState: T) => void;
    serialize?: (state: T) => unknown;
    deserialize?: (saved: unknown) => T;
    enabled?: boolean;
    saveDebounceMs?: number;
}

/**
 * Hook to handle game state persistence in localStorage.
 * Uses refs for callbacks to avoid unnecessary re-runs when callers pass inline functions.
 * Debounces saves to prevent lag during rapid state changes (e.g. dragging).
 */
export function useGamePersistence<T>({
    storageKey,
    rows,
    cols,
    state,
    onRestore,
    serialize,
    deserialize,
    enabled = true,
    saveDebounceMs = 300,
}: PersistenceOptions<T>) {
    const key = `${storageKey}-${String(rows)}x${String(cols)}`;

    const onRestoreRef = useRef(onRestore);
    const deserializeRef = useRef(deserialize);
    const serializeRef = useRef(serialize);

    useEffect(() => {
        onRestoreRef.current = onRestore;
        deserializeRef.current = deserialize;
        serializeRef.current = serialize;
    });

    // Restore on mount or dimension change
    useEffect(() => {
        if (!enabled) return;

        const saved = localStorage.getItem(key);
        if (saved) {
            try {
                const parsed: unknown = JSON.parse(saved);
                const _deserialize =
                    deserializeRef.current ?? ((s: unknown) => s as T);
                onRestoreRef.current(_deserialize(parsed));
            } catch {
                localStorage.removeItem(key);
            }
        }
    }, [key, enabled]);

    // Save with debounce
    useEffect(() => {
        if (!enabled) return;

        const timeout = setTimeout(() => {
            const _serialize = serializeRef.current ?? ((s: T) => s as unknown);
            const toSave = _serialize(state);
            localStorage.setItem(key, JSON.stringify(toSave));
        }, saveDebounceMs);

        return () => {
            clearTimeout(timeout);
        };
    }, [key, state, enabled, saveDebounceMs]);
}
