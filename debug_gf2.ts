import * as gf2 from './src/utils/math/gf2/gf2Operations';

const input = [1, 0, 0, 0, 0];
const rows = 5;
const cols = 5;

const result = gf2.calculateSolutionVector(input, rows, cols);
console.log('Input:', input);
console.log('Result:', result);

// Debug internal state
const matrix = gf2.getMatrix(cols);
const weights = gf2.getPolynomial(rows + 1);
const product = gf2.evalPolynomial(matrix, weights);
const solution = gf2.getSolutionMatrix(product);

console.log('Matrix A (with loops):', matrix.map((r: bigint) => r.toString(2)));
console.log('Weights (P_4):', weights.toString(2));
console.log('Product M = P_4(A):', product.map((r: bigint) => r.toString(2)));
console.log('Solution Matrix S:', solution?.map((r: bigint) => r.toString(2)));
