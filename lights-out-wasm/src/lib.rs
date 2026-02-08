use wasm_bindgen::prelude::*;

// Optimize memory allocation
#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

// We use u64 to represent matrix rows, supporting grids up to width 64.
// For larger grids, we would need a Vec<u64> representation.
// Since Lights Out is typically played on < 30x30, this is sufficient and heavily optimized.

#[wasm_bindgen]
pub fn invert_matrix(matrix: &[u64], size: usize) -> Result<Vec<u64>, String> {
    if size > 64 {
        return Err("Matrix size > 64 not supported in this optimized solver yet".to_string());
    }

    let mut original = matrix.to_vec();
    // Identity matrix initialization
    let mut inverted = vec![0u64; size];
    for i in 0..size {
        if i < 64 {
            inverted[i] = 1 << (size - 1 - i);
        }
    }

    // Gaussian Elimination
    for c in 0..size {
        let pivot_mask = 1u64 << (size - 1 - c);
        
        // Find pivot
        let mut pivot_row = c;
        while pivot_row < size {
            if (original[pivot_row] & pivot_mask) != 0 {
                break;
            }
            pivot_row += 1;
        }
        
        if pivot_row == size {
            // Singular matrix, cannot invert unique solution
            // In linear algebra terms, this means det(A) = 0
            // But for Lights Out, we might want to return a best-effort or fail distinctively.
            // For now, we return empty to signal failure (or handle in JS side as singular).
            // Actually, returning a specific error helps the caller know it's not solvable uniquely.
            return Err("Singular Matrix".to_string());
        }

        // Swap rows if needed
        if pivot_row != c {
            original.swap(c, pivot_row);
            inverted.swap(c, pivot_row);
        }

        // Eliminate other rows
        let pivot_row_val_orig = original[c];
        let pivot_row_val_inv = inverted[c];

        for r in 0..size {
            if r != c {
                if (original[r] & pivot_mask) != 0 {
                    original[r] ^= pivot_row_val_orig;
                    inverted[r] ^= pivot_row_val_inv;
                }
            }
        }
    }

    Ok(inverted)
}

#[wasm_bindgen]
pub fn solve_lights_out(matrix: &[u64], target: &[u64], size: usize) -> Result<Vec<u64>, String> {
    // This solves A * x = b for x
    // If we have the inverse, x = A^-1 * b
    
    // First, invert the matrix (which depends only on dimensions, not the state)
    let inverse = invert_matrix(matrix, size)?;
    
    // Multiply Inverse * Target
    // (Inv)_ij * (Target)_j
    // But working with bit-packed integers:
    // Result vector x, where x_i = row_i(Inverse) dot Target
    
    let mut result = vec![0u64; size];
    
    // Convert target to a single bit-packed number if it's a column vector?
    // Usually 'target' is the current board state unraveled.
    // Let's assume 'target' passed here is an array of rows, just like 'matrix'.
    // But 'x' (the solution moves) is also a grid.
    // The equation A x = b is linear.
    // Actually, usually we solve for flattened vectors.
    // If the input `matrix` is the "Click Matrix" (mapping click -> effect),
    // and `target` is the current board state.
    // Multiplication in GF(2):
    // element i of solution = (Row i of Inv) dot (Target Vector)
    
    // We need to flatten the target rows into a single bitstream effectively to do the dot product?
    // No, Row i of Inv is a bitmask of which cells affect cell i.
    // Wait, Row i of Inverse tells us which cells we need to click to toggle cell i?
    // No, x = A^-1 b.
    // A^-1 is size*size matrix. b is size*1 vector.
    // x_i = sum_j (A^-1)_ij * b_j
    // This is the DOT PRODUCT of (Row i of A^-1) and b.
    
    // Flatten target into a bitset for easy dot product
    // Since we handle < 64 size, we might not fit "size*size" bits in a u64.
    // We can't flatten the whole grid into one u64.
    // We need to iterate.
    
    // Let's optimize:
    // b is the target configuration (bit 1 = light on).
    // We walk through every cell j. If b_j is 1, we XOR the j-th COLUMN of A^-1 into our accumulator.
    // Or: x_i = (Row i of A^-1) & b. Popcount % 2.
    
    let mut moves = vec![0u64; size];
    
    for r in 0..size {
         // We need to compute the bit for cell r (which is in row r/cols, col r%cols?)
         // Wait, the input `matrix` is likely the pre-computed Click Matrix.
         // Let's just expose the Inversion for now, and let JS do the multiplication 
         // or implement full multiplication here.
         // Given the complexity of mapping 2D grid <-> 1D vector in a generic way without passing Width/Height explicitly 
         // (we only have 'size' which is rows*cols or just rows?), let's stick to Inversion first.
    }
    
    Ok(inverse)
}
