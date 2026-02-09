/**
 * Disjoint Set Union (DSU) / Union-Find data structure.
 * Useful for connectivity and cycle detection in grid-based games.
 */
export class DSU {
    private parent: number[];

    constructor(n: number) {
        this.parent = Array.from({ length: n }, (_, i) => i);
    }

    /**
     * Finds the root of the set containing element i with path compression.
     */
    find(i: number): number {
        const p = this.parent[i];
        if (p === undefined) {
            throw new Error(`DSU: Index ${String(i)} out of bounds`);
        }
        if (p !== i) {
            this.parent[i] = this.find(p);
        }
        const root = this.parent[i];
        if (root === undefined) {
            throw new Error(`DSU: Parent of ${String(i)} became undefined`);
        }
        return root;
    }

    /**
     * Unites the sets containing elements i and j.
     * @returns true if the sets were separate, false if they were already united.
     */
    union(i: number, j: number): boolean {
        const rootI = this.find(i);
        const rootJ = this.find(j);
        if (rootI !== rootJ) {
            this.parent[rootI] = rootJ;
            return true;
        }
        return false;
    }

    /**
     * Checks if elements i and j are in the same set.
     */
    connected(i: number, j: number): boolean {
        return this.find(i) === this.find(j);
    }
}
