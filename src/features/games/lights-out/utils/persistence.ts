import type { BoardState } from '../types';

import { isRecord } from '@/utils/gameUtils';

/**
 * Type guard that validates whether an `unknown` value from localStorage
 * has the shape of a Lights Out `BoardState`.  Prevents unsafe `as`
 * casts from crashing the game when stored data is corrupt or stale.
 */
export function isBoardState(value: unknown): value is BoardState {
    if (!isRecord(value)) return false;

    return (
        Array.isArray(value['grid']) &&
        typeof value['score'] === 'number' &&
        typeof value['rows'] === 'number' &&
        typeof value['cols'] === 'number' &&
        typeof value['initialized'] === 'boolean'
    );
}
