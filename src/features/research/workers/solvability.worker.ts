import {
    getMatrix,
    getKernelBasis,
    getImageMapping,
    getMinWeightSolution,
} from '../../../utils/math/gf2';
import {
    getPolynomial,
    evalPolynomial,
} from '../../../utils/math/gf2/polynomialUtils';

// Define the shape of the message we expect to receive
interface WorkerMessage {
    n: number;
}

self.onmessage = (e: MessageEvent<WorkerMessage>) => {
    const { n: size } = e.data;

    try {
        const rows = size;
        const cols = size;
        const A = getMatrix(cols);
        const Pn = getPolynomial(rows + 1);
        const matrix = evalPolynomial(A, Pn);
        const kernel = getKernelBasis(matrix, cols);
        const nullity = kernel.length;
        const rank = cols - nullity;
        const totalCells = rows * cols;
        const gridRank = totalCells - nullity;

        const formatLarge = (n: number) => {
            if (n < 50) {
                const val = 1n << BigInt(n);
                return val.toLocaleString();
            }
            return `2^${n.toString()}`;
        };

        const imageBasis = getImageMapping(matrix, cols);
        const rankTotal = imageBasis.length;
        const useFullSubspace = rankTotal <= 6 && rankTotal > 0; // Show all if <= 64 states

        const mapping: { state: string; toggle: string }[] = [];

        if (useFullSubspace) {
            const count = 1 << rankTotal;
            for (let i = 1; i < count; i++) {
                let combinedState = 0n;
                for (let j = 0; j < rankTotal; j++) {
                    if ((i >> j) & 1) {
                        const basis = imageBasis[j];
                        if (basis) {
                            combinedState ^= basis.state;
                        }
                    }
                }
                const minToggle = getMinWeightSolution(
                    matrix,
                    combinedState,
                    cols
                );
                mapping.push({
                    state: combinedState.toString(2).padStart(cols, '0'),
                    toggle: minToggle.toString(2).padStart(cols, '0'),
                });
            }
            // Sort by state for consistency
            mapping.sort((a, b) => a.state.localeCompare(b.state));
        } else {
            imageBasis.forEach(m => {
                const minToggle = getMinWeightSolution(matrix, m.state, cols);
                mapping.push({
                    state: m.state.toString(2).padStart(cols, '0'),
                    toggle: minToggle.toString(2).padStart(cols, '0'),
                });
            });
        }

        const result = {
            rank,
            nullity,
            gridRank,
            solvablePercent: ((1 / Math.pow(2, nullity)) * 100).toFixed(
                nullity === 0 ? 0 : 2
            ),
            quietPatterns: kernel.map(k => k.toString(2).padStart(cols, '0')),
            totalStates: formatLarge(totalCells),
            reachableStates: formatLarge(gridRank),
            imageMapping: mapping,
            isFullSubspace: useFullSubspace,
        };

        self.postMessage({ success: true, result });
    } catch (err) {
        self.postMessage({
            success: false,
            error:
                err instanceof Error
                    ? err.message
                    : 'Unknown error occurred in worker',
        });
    }
};

export {};
