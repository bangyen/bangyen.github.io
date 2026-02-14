import type { CellState } from '../types';
import { generatePuzzle } from '../utils/generation';

/**
 * Messages exchanged between the main thread and the generation worker.
 *
 * The worker offloads the expensive `generatePuzzle` call so the UI stays
 * responsive while a new puzzle is being created.
 */
export type GenerationMessage =
    | {
          type: 'GENERATE';
          payload: {
              rows: number;
              cols: number;
          };
      }
    | {
          type: 'RESULT';
          payload: {
              rows: number;
              cols: number;
              numbers: (number | null)[][];
              solution: CellState[][];
          };
      };

globalThis.onmessage = (e: MessageEvent<GenerationMessage>) => {
    if (e.data.type === 'GENERATE') {
        const { rows, cols } = e.data.payload;
        const { numbers, solution } = generatePuzzle(rows, cols);

        self.postMessage({
            type: 'RESULT',
            payload: { rows, cols, numbers, solution },
        });
    }
};
