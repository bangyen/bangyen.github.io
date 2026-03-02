# Slant Puzzle Engine

This directory implements the logic for generating, solving, and validating "Slant" (also known as Gokigen Naname) logic puzzles.

## Core Logic Overview

The game is played on a grid of cells. Each cell contains a diagonal line (either `/` or `\`). Some grid intersections (nodes) have numbers indicating how many lines must connect to them. The goal is to fill the grid without forming any cycles.

### 1. Constraint Propagation (`analysisSolver.ts`)

The solver uses a queue-based constraint propagation algorithm to infer cell states:

- **Node Satisfaction**: If a node has a number $N$, and $N$ lines are already connected, all remaining empty neighbors must be oriented away from the node.
- **Node Requirement**: If a node has a number $N$, and there are $k$ empty neighbors such that $N - (\text{# current connections}) = k$, then all $k$ neighbors must be oriented towards the node.
- **Conflict Detection**: If a node's constraints become impossible (too many or too few connections possible), it is marked as a conflict.

### 2. Cycle Detection (`cycleDetection.ts`)

Topological consistency is maintained using a **Disjoint Set Union (DSU)** data structure.

- As lines are added, the solver tracks the connectivity of grid nodes.
- If adding a line would connect two nodes that are already in the same component, a cycle is detected and the move is invalidated or flagged.

### 3. Procedural Generation (`generation.ts`)

The generator creates valid boards by:

1.  Starting with an empty grid.
2.  Randomly placing lines while checking that they don't create immediate cycles.
3.  Calculating the required node numbers for the finished grid.
4.  Optionally removing node numbers while ensuring the puzzle remains uniquely solvable (using the `analysisSolver`).

## Developer Quick Start

- **Modifying the Rules**: Check `validation.ts` for the high-level logic that determines if a board is "complete" and "correct".
- **Performance**: Puzzle generation is performed in `workers/generation.worker.ts` to keep the UI responsive.
- **State Representation**: Cell states use numeric constants (`EMPTY = 0`, `BACKWARD = 1`, `FORWARD = 2`). These are defined in `types/index.ts`.
