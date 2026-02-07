import { useEffect } from 'react';

interface PersistenceOptions<T> {
    storageKey: string;
    rows: number;
    cols: number;
    state: T;
    onRestore: (savedState: T) => void;
    serialize?: (state: T) => unknown;
    deserialize?: (saved: unknown) => T;
    enabled?: boolean;
}

export function useGamePersistence<T>({
    storageKey,
    rows,
    cols,
    state,
    onRestore,
    serialize,
    deserialize,
    enabled = true,
}: PersistenceOptions<T>) {
    const key = `${storageKey}-${String(rows)}x${String(cols)}`;

    // Restore on mount or dimension change
    useEffect(() => {
        if (!enabled) return;

        const _deserialize = deserialize ?? ((s: unknown) => s as T);

        const saved = localStorage.getItem(key);
        if (saved) {
            try {
                const parsed: unknown = JSON.parse(saved);
                onRestore(_deserialize(parsed));
            } catch (_e) {
                localStorage.removeItem(key);
            }
        }
    }, [key, enabled, deserialize, onRestore]);

    // Save on state change
    useEffect(() => {
        if (!enabled) return;

        const _serialize = serialize ?? ((s: T) => s as unknown);

        const toSave = _serialize(state);
        localStorage.setItem(key, JSON.stringify(toSave));
    }, [key, state, enabled, serialize]);
}
