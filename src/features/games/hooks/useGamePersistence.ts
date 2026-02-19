import { useEffect, useRef } from 'react';

import { useDebouncedEffect, useStableCallback } from '@/hooks';

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
 * Uses `useStableCallback` for callbacks to avoid unnecessary re-runs
 * when callers pass inline functions.
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

    const stableOnRestore = useStableCallback(onRestore);
    const stableSerialize = useStableCallback(
        serialize ?? ((s: T) => s as unknown),
    );
    const stableDeserialize = useStableCallback(
        deserialize ?? ((s: unknown) => s as T),
    );

    // Restore on mount or dimension change
    const lastRestoredKey = useRef<string | null>(null);
    useEffect(() => {
        if (!enabled || lastRestoredKey.current === key) return;

        const saved = localStorage.getItem(key);
        if (saved) {
            try {
                const parsed: unknown = JSON.parse(saved);
                stableOnRestore(stableDeserialize(parsed));
                lastRestoredKey.current = key;
            } catch {
                localStorage.removeItem(key);
            }
        } else {
            // Even if nothing was found, we mark it as "restored" so we don't
            // wipe out future in-memory updates if the hook is re-enabled.
            lastRestoredKey.current = key;
        }
    }, [key, enabled, stableOnRestore, stableDeserialize]);

    // Save with debounce
    useDebouncedEffect(
        () => {
            if (!enabled) return;
            const toSave = stableSerialize(state);
            localStorage.setItem(key, JSON.stringify(toSave));
        },
        saveDebounceMs,
        [key, state, enabled, stableSerialize],
    );
}
