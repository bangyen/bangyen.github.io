import type { BoardState } from '../types';

/**
 * Type guard that validates whether an `unknown` value from localStorage
 * has the shape of a Lights Out `BoardState`.  Prevents unsafe `as`
 * casts from crashing the game when stored data is corrupt or stale.
 */
export function isBoardState(value: unknown): value is BoardState {
    if (typeof value !== 'object' || value === null) return false;

    const obj = value as Record<string, unknown>;

    return (
        Array.isArray(obj['grid']) &&
        typeof obj['score'] === 'number' &&
        typeof obj['rows'] === 'number' &&
        typeof obj['cols'] === 'number' &&
        typeof obj['initialized'] === 'boolean'
    );
}
