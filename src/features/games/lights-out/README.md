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

For certain grid dimensions ($m \times n$), the solver transformation behaves as an Identity Matrix over the field $\mathbb{F}_2$. This means that if the grid is reduced to a state where only the top row is active (the 'input'), the solution pattern required to clear the grid (the 'output') is identical to that input pattern.

### General Formula

For an $m \times n$ grid ($m$ rows, $n$ columns), the calculator output equals the input if and only if:

$$F_{n+1}(x) \pmod{F_{m+1}(x+1) + 1} = 0$$

Or strictly: $F_{n+1}(x)$ **divides** $F_{m+1}(x+1) + 1$ **over** $\mathbb{F}_2[x]$.

### Mathematical Derivation

Let $A_n$ be the adjacency matrix of the path graph $P_n$ with vertices $1, \dots, n$.
The matrix used in the code (`getMatrix(cols)`) corresponds to $L_n = A_n + I_n$ (over $\mathbb{F}_2$).

The "weights" computed by `getPolynomial` correspond to the Fibonacci polynomials $F_k(x)$.
The calculator logic effectively computes $C = (F_{m+1}(L_n))^{-1}$.
For the calculator to act as the identity matrix ($C = I_n$), we must have:

$$F_{m+1}(L_n) = I_n$$
$$F_{m+1}(A_n + I_n) + I_n = 0 \quad (\text{since } -1 \equiv 1)$$
$$Q(A_n) = 0, \quad \text{where } Q(x) = F_{m+1}(x+1) + 1$$

By the Cayley-Hamilton theorem, $Q(A_n) = 0$ if and only if the characteristic polynomial of $A_n$ divides $Q(x)$.
It is a known result that the characteristic polynomial of $A_n$ over $\mathbb{F}_2$ is exactly $F\_{n+1}(x)$.

Therefore, the condition is equivalent to:

$$F_{n+1}(x) \mid (F_{m+1}(x+1) + 1)$$

### Key Observations

1.  **Directionality (Non-Symmetry)**: Unlike general grid solvability (which is symmetric), the **Identity Matrix property is non-symmetric**. A grid that acts as the identity in one orientation may not do so when transposed.
    - **Example**: A $4 \text{ (rows)} \times 1 \text{ (col)}$ grid is an identity grid, but a $1 \times 4$ grid is not.
    - **Example**: The $12 \times 8$ grid is an identity grid, but its transpose ($8 \times 12$) is not.
2.  **Evenness Constraint**: For all verified column widths $n \ge 2$, the identity property only holds for **even row counts** ($m$).
3.  **Periodicity Growth (Prime vs. Composite)**: The period $z$ depends heavily on the factorization of $n+1$.
    - **Composite**: If $n+1$ is composite, the period is typically small (e.g., $n=39 \to z=240$).
    - **Prime**: If $p = n+1$ is a prime number (where $p \equiv \pm 1 \pmod{10}$), the period grows exponentially according to the formula:
      $$z = 2 \cdot (2^{\frac{n+1}{2}} - 1)$$
      _Example:_ For $n=40$ ($n+1=41$), the period jumps to $z \approx 2.1 \times 10^6$.

### Empirically Verified Grid Dimensions

The following patterns describe the grid heights ($m$) that satisfy the identity property for a given width ($n$), expressed as $m \pmod z \in R_n$ where $z$ is the period and $R_n$ is the set of valid remainders.

> [!NOTE]
> These periodicity patterns are **empirically derived** and have been verified for grid heights up to **$m = 600$**. While they appear robust, they should be considered experimental observations until formally proven.

| Columns ($n$) | Periodicity ($m \pmod z$)            |
| :------------ | :----------------------------------- |
| **1**         | $m \pmod 3 \in \{0, 1\}$             |
| **2**         | $m \pmod 2 \in \{0\}$                |
| **3**         | $m \pmod {12} \in \{0, 10\}$         |
| **4**         | $m \pmod {10} \in \{0, 8\}$          |
| **5**         | $m \pmod {24} \in \{0, 6, 16, 22\}$  |
| **6**         | $m \pmod {18} \in \{0, 16\}$         |
| **7**         | $m \pmod {24} \in \{0, 22\}$         |
| **8**         | $m \pmod {14} \in \{0, 12\}$         |
| **9**         | $m \pmod {60} \in \{0, 18, 40, 58\}$ |
| **10**        | $m \pmod {62} \in \{0, 60\}$         |

## Verification

We provide two scripts to verify these findings:

### 1. Basic Verification

Iterates through grid dimensions and checks if the Identity Matrix property holds. This is useful for exploring individual grid sizes.

```bash
npx tsx src/features/games/lights-out/scripts/verify_identity.ts [max_size]
```

### 2. Periodicity Pattern Discovery

Dynamically discovers and verifies periodicity patterns for any column width. Uses **Matrix Binary Exponentiation** for efficient verification across large ranges.

```bash
# Discover patterns for n=1..10 (default)
npx tsx src/features/games/lights-out/scripts/verify_periodicity.ts

# Discover patterns for specific n values
npx tsx src/features/games/lights-out/scripts/verify_periodicity.ts 5
npx tsx src/features/games/lights-out/scripts/verify_periodicity.ts 1-20

# Discover and verify patterns up to m=1000
npx tsx src/features/games/lights-out/scripts/verify_periodicity.ts 1-10 1000
```

Example (search up to 50x50):

```bash
npx tsx src/features/games/lights-out/scripts/verify_identity.ts 50
```

## References

1.  [Stack Exchange: Solving a large n x n Lights Out Board](https://math.stackexchange.com/questions/2237467)
2.  [Wikipedia: Fibonacci Polynomials](https://en.wikipedia.org/wiki/Fibonacci_polynomials)
3.  [Bit Twiddling Hacks (Brian Kernighan's Algorithm)](https://graphics.stanford.edu/~seander/bithacks.html#CountBitsSetKernighan)
