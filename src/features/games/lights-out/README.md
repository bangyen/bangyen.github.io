# Lights Out Calculator Math

This directory implements the logic for solving and analyzing "Lights Out" grids.

### Algorithm Overview

The solver models the Lights Out game using Linear Algebra over the field $\mathbb{F}_2$ (where $1+1=0$).
Instead of performing Gaussian elimination on a large $(mn) \times (mn)$ matrix (which would be computationally expensive for large grids), this implementation uses **Light Chasing** logic combined with **Fibonacci Polynomials**.

1.  **Light Chasing**: By efficiently chasing lights from the top row to the bottom, the problem of solving the grid is reduced to determining the correct moves for the first row.
2.  **Row Transfer Matrix**: The effect of the first row on the configuration of the $(m+1)$-th row (after chasing) is determined by a linear recurrence relation. The transformation matrix satisfies the recurrence of Fibonacci polynomials.
3.  **Solving**: To solve a configuration, we construct the matrix $A = F_{m+1}(T)$, where $T$ is the transition matrix for a single row (tridiagonal matrix with $1$s on the diagonal and super/sub-diagonals). The solution for the first row is then found by solving a linear system involving $A$.

This efficiency allows the calculator to handle arbitrary grid sizes (e.g., $100 \times 100$) nearly instantly.

### Identity Matrix Property

For certain grid dimensions ($m \times n$), the "Calculator" operation behaves as an Identity Matrix over the field $\mathbb{F}_2$. This means that the output pattern matches the input pattern exactly.

### General Formula

For an $m \times n$ grid ($m$ rows, $n$ columns), the calculator output equals the input if and only if:

$$F_{n+1}(x) \pmod{F_{m+1}(x+1) + 1} = 0$$

Or strictly: **$F_{n+1}(x)$ divides $F_{m+1}(x+1) + 1$ over $\mathbb{F}_2[x]$.**

### Mathematical Derivation

Let $A_n$ be the adjacency matrix of the path graph $P_n$ with vertices $1, \dots, n$.
The matrix used in the code (`getMatrix(cols)`) corresponds to $L_n = A_n + I_n$ (over $\mathbb{F}_2$).

The "weights" computed by `getPolynomial` correspond to the Fibonacci polynomials $F_k(x)$.
The calculator logic effectively computes $C = (F_{m+1}(L_n))^{-1}$.
For the calculator to acts as the identity matrix ($C = I_n$), we must have:
$$ F*{m+1}(L_n) = I_n $$
$$ F*{m+1}(A*n + I_n) + I_n = 0 \quad (\text{since } -1 \equiv 1) $$
$$ Q(A_n) = 0, \quad \text{where } Q(x) = F*{m+1}(x+1) + 1 $$

By the Cayley-Hamilton theorem, $Q(A_n) = 0$ if and only if the characteristic polynomial of $A_n$ divides $Q(x)$.
It is a known result that the characteristic polynomial of $A_n$ over $\mathbb{F}_2$ is exactly $F_{n+1}(x)$.

Therefore, the condition is equivalent to:
$$ F*{n+1}(x) \mid (F*{m+1}(x+1) + 1) $$

### Observed Results

This condition holds for the following verified grid sizes (among others):

- **12 rows x 8 columns** (The original observed case)
- **Even rows x 1 or 2 columns**: Always holds.
- **22 rows x 7 cols**
- **24 rows x 5 cols**
- **30 rows x 5 cols**

Generally, solutions for $n \ge 2$ appear to require $m$ to be even.

## Verification

To empirically verify these findings, you can run the provided verification script. This script iterates through grid dimensions and checks if the Identity Matrix property holds.

```bash
npx tsx src/features/games/lights-out/scripts/verify_identity.ts [max_size]
```

Example (search up to 50x50):

```bash
npx tsx src/features/games/lights-out/scripts/verify_identity.ts 50
```

## References

1.  [Stack Exchange: Solving a large n x n Lights Out Board](https://math.stackexchange.com/questions/2237467)
2.  [Wikipedia: Fibonacci Polynomials](https://en.wikipedia.org/wiki/Fibonacci_polynomials)
3.  [Bit Twiddling Hacks (Brian Kernighan's Algorithm)](https://graphics.stanford.edu/~seander/bithacks.html#CountBitsSetKernighan)
