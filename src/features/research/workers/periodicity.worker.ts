import {
    findPattern,
    getMatrix,
    getMinimalPolynomial,
    factorPoly,
    polyToString,
    toSuperscript,
} from '../../games/lights-out/matrices';

// Define the shape of the message we expect to receive
interface WorkerMessage {
    n: number;
}

self.onmessage = (e: MessageEvent<WorkerMessage>) => {
    const { n } = e.data;

    try {
        const pattern = findPattern(n);
        const A = getMatrix(n);
        const M = getMinimalPolynomial(A);
        const factors = factorPoly(M);

        const result = {
            pattern,
            minimalPoly: polyToString(M),
            factorization: factors
                .map(
                    f =>
                        `(${polyToString(f.factor)})${f.exponent > 1 ? toSuperscript(f.exponent) : ''}`
                )
                .join(' · '),
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
