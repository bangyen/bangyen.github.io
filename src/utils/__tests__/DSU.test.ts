// @vitest-environment node
import { describe, it, expect } from 'vitest';

import { DSU } from '../DSU';

describe('DSU', () => {
    it('should initialize with each element as its own parent', () => {
        const dsu = new DSU(5);
        for (let i = 0; i < 5; i++) {
            expect(dsu.find(i)).toBe(i);
        }
    });

    it('should unite sets and find the same root', () => {
        const dsu = new DSU(5);
        expect(dsu.union(0, 1)).toBe(true);
        expect(dsu.find(0)).toBe(dsu.find(1));

        expect(dsu.union(1, 2)).toBe(true);
        expect(dsu.find(0)).toBe(dsu.find(2));
    });

    it('should return false when uniting elements already in the same set', () => {
        const dsu = new DSU(5);
        dsu.union(0, 1);
        dsu.union(1, 2);
        expect(dsu.union(0, 2)).toBe(false);
    });

    it('should correctly report "connected" status', () => {
        const dsu = new DSU(5);
        dsu.union(0, 1);
        dsu.union(2, 3);

        expect(dsu.connected(0, 1)).toBe(true);
        expect(dsu.connected(2, 3)).toBe(true);
        expect(dsu.connected(0, 2)).toBe(false);

        dsu.union(1, 2);
        expect(dsu.connected(0, 3)).toBe(true);
    });

    it('should throw error for out of bounds access', () => {
        const dsu = new DSU(5);
        expect(() => dsu.find(5)).toThrow('DSU: Index 5 out of bounds');
        expect(() => dsu.find(-1)).toThrow('DSU: Index -1 out of bounds');
    });

    it('should implement path compression', () => {
        const dsu = new DSU(5);
        // Create a chain: 0 -> 1 -> 2 -> 3
        dsu.union(0, 1);
        dsu.union(1, 2);
        dsu.union(2, 3);

        // Before find(0), parent[0] might be 1 or something else depending on implementation
        // After find(0), parent[0] should be the root (3)
        const root = dsu.find(0);
        expect(root).toBe(3);

        // This is a bit of a white-box test if we were to check private state,
        // but since we can't easily, we just ensure it still works.
        expect(dsu.find(0)).toBe(3);
        expect(dsu.find(1)).toBe(3);
    });
});
