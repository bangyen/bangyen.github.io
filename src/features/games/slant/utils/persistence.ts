import { STORAGE_KEYS } from '../constants';
import type { SlantState } from '../types';

/**
 * Serialised form of `SlantState` where the `Set` fields have been
 * converted to plain arrays for JSON storage.
 */
interface SavedSlantState extends Omit<
    SlantState,
    'errorNodes' | 'cycleCells' | 'satisfiedNodes'
> {
    errorNodes: string[];
    cycleCells: string[];
    satisfiedNodes: string[];
}

/**
 * Builds the localStorage key for a given grid size, matching the
 * pattern used by `useGamePersistence`.
 */
function buildPersistKey(rows: number, cols: number): string {
    return `${STORAGE_KEYS.STATE}-${String(rows)}x${String(cols)}`;
}

/**
 * Converts a `SlantState` to a JSON-safe representation by replacing
 * `Set` fields with arrays.  This is the single source of truth for
 * serialisation so every call site (persistence hook, stale-result
 * caching, etc.) produces the same shape.
 */
export function serializeSlantState(state: SlantState): SavedSlantState {
    return {
        ...state,
        errorNodes: [...state.errorNodes],
        cycleCells: [...state.cycleCells],
        satisfiedNodes: [...state.satisfiedNodes],
    };
}

/**
 * Type guard that validates whether an `unknown` value from localStorage
 * has the shape of a `SavedSlantState`.  Prevents unsafe `as` casts
 * from crashing the game when stored data is corrupt or stale.
 */
export function isSavedSlantState(value: unknown): value is SavedSlantState {
    if (typeof value !== 'object' || value === null) return false;

    const obj = value as Record<string, unknown>;

    return (
        Array.isArray(obj['grid']) &&
        Array.isArray(obj['numbers']) &&
        Array.isArray(obj['solution']) &&
        typeof obj['rows'] === 'number' &&
        typeof obj['cols'] === 'number' &&
        typeof obj['solved'] === 'boolean' &&
        Array.isArray(obj['errorNodes']) &&
        Array.isArray(obj['cycleCells']) &&
        Array.isArray(obj['satisfiedNodes'])
    );
}

/**
 * Reconstructs a live `SlantState` from a validated `SavedSlantState`,
 * converting serialised arrays back into `Set` instances.
 */
export function deserializeSlantState(saved: SavedSlantState): SlantState {
    return {
        ...saved,
        errorNodes: new Set(saved.errorNodes),
        cycleCells: new Set(saved.cycleCells),
        satisfiedNodes: new Set(saved.satisfiedNodes),
    } as SlantState;
}

/**
 * Persists a `SlantState` to localStorage for the given grid size.
 * Used to cache stale worker results so they are available instantly
 * when the user returns to that size.
 */
export function persistSlantState(
    state: SlantState,
    rows: number,
    cols: number,
): void {
    const key = buildPersistKey(rows, cols);
    try {
        localStorage.setItem(key, JSON.stringify(serializeSlantState(state)));
    } catch {
        // Quota exceeded or other storage error; silently ignore.
    }
}

/**
 * Checks whether an unsolved puzzle is saved for the given grid size.
 * Returns `true` when a valid, unsolved state exists -- meaning the
 * caller can skip requesting a new puzzle from the worker.
 */
export function hasSavedUnsolvedPuzzle(rows: number, cols: number): boolean {
    const key = buildPersistKey(rows, cols);
    const saved = localStorage.getItem(key);
    if (!saved) return false;

    try {
        const parsed: unknown = JSON.parse(saved);
        if (typeof parsed !== 'object' || parsed === null) return false;
        const obj = parsed as Record<string, unknown>;
        return obj['solved'] === false;
    } catch {
        return false;
    }
}
