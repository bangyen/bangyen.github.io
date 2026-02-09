use wasm_bindgen::prelude::*;

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
