/**
 * High-level matrix operations and solvers for Lights Out
 */

/**
 * Returns the adjacency matrix for a 1D line of lights.
 * Used as a base for building the 2D grid matrix.
 */
/**
 * Generates the adjacency matrix for a 1D line of $n$ lights.
 * In a 1D grid, each light $i$ affects itself and its neighbors $(i-1, i+1)$.
 * This matrix is the basis for constructing 2D grid operators in GF(2).
 *
 * @param cols - Number of columns (lights) in the 1D line
 * @returns Adjacency matrix as an array of bitmask rows (bigint[])
 */
export function getMatrix(cols: number): bigint[] {
    if (cols === 1) return [1n];
    const first = 7n << BigInt(cols - 2);
    const matrix = [first];

    for (let k = 1; k < cols; k++) {
        const prev = matrix[k - 1];
        if (prev !== undefined) {
            const next = prev >> 1n;
            matrix.push(next);
        }
    }

    const firstVal = matrix[0];
    if (firstVal !== undefined) matrix[0] = firstVal - (1n << BigInt(cols));
    return matrix;
}
