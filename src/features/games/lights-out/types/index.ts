import { GridSize, CellIndex } from '@/utils/types';

export interface BoardState {
    grid: number[];
    score: number;
    rows: GridSize;
    cols: GridSize;
    initialized: boolean;
}

export type BoardAction =
    | { type: 'adjacent'; row: CellIndex; col: CellIndex }
    | { type: 'multi_adjacent'; moves: { row: CellIndex; col: CellIndex }[] }
    | { type: 'random' | 'randomize' }
    | {
          type: 'resize';
          rows?: number;
          cols?: number;
          newRows?: number;
          newCols?: number;
      }
    | { type: 'reset' }
    | { type: 'new' | 'next' }
    | { type: 'restore' | 'hydrate'; state: BoardState };
