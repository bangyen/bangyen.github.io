import type { CellState } from '../types';
import type { CellInfo, Conflict } from '../utils/ghostSolver';
import { solveGhostConstraints } from '../utils/ghostSolver';

export type { CellSource, CellInfo, Conflict } from '../utils/ghostSolver';

export type SolverMessage =
    | {
          type: 'SOLVE';
          payload: {
              rows: number;
              cols: number;
              numbers: (number | null)[][];
              userMoves: Map<string, CellState>;
          };
      }
    | {
          type: 'RESULT';
          payload: {
              gridState: Map<string, CellInfo>;
              conflicts: Conflict[];
              cycleCells: Set<string>;
          };
      };

globalThis.onmessage = (e: MessageEvent<SolverMessage>) => {
    if (e.data.type === 'SOLVE') {
        const { rows, cols, numbers, userMoves } = e.data.payload;
        const result = solveGhostConstraints(rows, cols, numbers, userMoves);
        self.postMessage({ type: 'RESULT', payload: result });
    }
};
