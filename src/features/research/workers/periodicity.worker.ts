import { getMatrix } from '../../games/lights-out/matrices';
import {
    findPattern,
    getMinimalPolynomial,
    factorPoly,
    polyToString,
    toSuperscript,
    getPolynomial,
    polyMod,
} from '../../../utils/math/gf2/polynomialUtils';

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

        const fz = getPolynomial(pattern.z_seq);
        const fz1 = getPolynomial(pattern.z_seq + 1);

        const modZ = polyMod(fz, M);
        const modZ1 = polyMod(fz1 ^ 1n, M);

        const result = {
            pattern,
            minimalPoly: polyToString(M),
            factorization: factors
                .map(
                    f =>
                        `(${polyToString(f.factor)})${
                            f.exponent > 1 ? toSuperscript(f.exponent) : ''
                        }`
                )
                .join(' · '),
            proof: {
                eq1: `f${toSuperscript(pattern.z_seq)}(x) mod M(x)`,
                res1: polyToString(modZ),
                eq2: `(f${toSuperscript(pattern.z_seq + 1)}(x) + 1) mod M(x)`,
                res2: polyToString(modZ1),
            },
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
