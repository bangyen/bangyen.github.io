use wasm_bindgen::prelude::*;
use serde::{Serialize, Deserialize};
use rand::seq::SliceRandom;
use rand::SeedableRng;
use rand::rngs::SmallRng;
use std::collections::HashSet;

#[wasm_bindgen]
#[derive(Copy, Clone, Debug, PartialEq, Eq, Serialize, Deserialize)]
pub enum CellState {
    Empty = 0,
    Forward = 1,
    Backward = 2,
}

#[derive(Serialize, Deserialize)]
pub struct Puzzle {
    pub numbers: Vec<Vec<Option<u8>>>,
    pub solution: Vec<Vec<CellState>>,
}

struct Dsu {
    parent: Vec<usize>,
}

impl Dsu {
    fn new(n: usize) -> Self {
        Self {
            parent: (0..n).collect(),
        }
    }

    fn find(&mut self, i: usize) -> usize {
        if self.parent[i] == i {
            i
        } else {
            self.parent[i] = self.find(self.parent[i]);
            self.parent[i]
        }
    }

    fn union(&mut self, i: usize, j: usize) -> bool {
        let root_i = self.find(i);
        let root_j = self.find(j);
        if root_i != root_j {
            self.parent[root_i] = root_j;
            true
        } else {
            false
        }
    }

    fn connected(&mut self, i: usize, j: usize) -> bool {
        self.find(i) == self.find(j)
    }
}

fn get_node_index(r: usize, c: usize, cols: usize) -> usize {
    r * (cols + 1) + c
}

#[wasm_bindgen]
pub fn find_cycles_wasm(grid_flat: &[u8], rows: usize, cols: usize) -> Vec<String> {
    let mut adj = vec![Vec::new(); (rows + 1) * (cols + 1)];
    let mut grid = vec![vec![CellState::Empty; cols]; rows];
    
    for r in 0..rows {
        for c in 0..cols {
            let state = match grid_flat[r * cols + c] {
                1 => CellState::Forward,
                2 => CellState::Backward,
                _ => CellState::Empty,
            };
            grid[r][c] = state;
            
            if state == CellState::Empty { continue; }
            
            let (u, v) = if state == CellState::Forward {
                (get_node_index(r, c + 1, cols), get_node_index(r + 1, c, cols))
            } else {
                (get_node_index(r, c, cols), get_node_index(r + 1, c + 1, cols))
            };
            
            adj[u].push((v, r, c));
            adj[v].push((u, r, c));
        }
    }

    let mut cycle_cells = HashSet::new();
    let mut visited = vec![false; (rows + 1) * (cols + 1)];
    let mut on_stack = vec![false; (rows + 1) * (cols + 1)];
    let mut edge_stack = Vec::new();

    fn dfs(
        u: usize, 
        prev_node: isize, 
        adj: &Vec<Vec<(usize, usize, usize)>>, 
        visited: &mut Vec<bool>, 
        on_stack: &mut Vec<bool>, 
        edge_stack: &mut Vec<(usize, usize, usize, usize)>,
        cycle_cells: &mut HashSet<String>
    ) {
        visited[u] = true;
        on_stack[u] = true;

        for &(v, r, c) in &adj[u] {
            if v as isize == prev_node { continue; }

            if on_stack[v] {
                cycle_cells.insert(format!("{},{}", r, c));
                for i in (0..edge_stack.len()).rev() {
                    let edge = edge_stack[i];
                    cycle_cells.insert(format!("{},{}", edge.0, edge.1));
                    if edge.2 == v || edge.3 == v { break; }
                }
            } else if !visited[v] {
                edge_stack.push((r, c, u, v));
                dfs(v, u as isize, adj, visited, on_stack, edge_stack, cycle_cells);
                edge_stack.pop();
            }
        }

        on_stack[u] = false;
    }

    for i in 0..((rows + 1) * (cols + 1)) {
        if !visited[i] {
            dfs(i, -1, &adj, &mut visited, &mut on_stack, &mut edge_stack, &mut cycle_cells);
        }
    }

    cycle_cells.into_iter().collect()
}

fn calculate_numbers(grid: &Vec<Vec<CellState>>, rows: usize, cols: usize) -> Vec<Vec<u8>> {
    let mut numbers = vec![vec![0; cols + 1]; rows + 1];
    for r in 0..rows {
        for c in 0..cols {
            match grid[r][c] {
                CellState::Forward => {
                    numbers[r][c + 1] += 1;
                    numbers[r + 1][c] += 1;
                }
                CellState::Backward => {
                    numbers[r][c] += 1;
                    numbers[r + 1][c + 1] += 1;
                }
                CellState::Empty => {}
            }
        }
    }
    numbers
}

fn check_deductive_solvability(
    masked_numbers: &Vec<Vec<Option<u8>>>,
    rows: usize,
    cols: usize
) -> bool {
    let mut grid = vec![vec![CellState::Empty; cols]; rows];
    let mut dsu = Dsu::new((rows + 1) * (cols + 1));
    let mut changed = true;

    while changed {
        changed = false;

        for r in 0..=rows {
            for c in 0..=cols {
                let target = match masked_numbers[r][c] {
                    Some(t) => t as usize,
                    None => continue,
                };

                let mut touching = Vec::new();
                if r > 0 && c > 0 { touching.push((r - 1, c - 1, CellState::Backward)); }
                if r > 0 && c < cols { touching.push((r - 1, c, CellState::Forward)); }
                if r < rows && c > 0 { touching.push((r, c - 1, CellState::Forward)); }
                if r < rows && c < cols { touching.push((r, c, CellState::Backward)); }

                let mut confirmed_in = 0;
                let mut unknown = Vec::new();

                for &(gr, gc, pt) in &touching {
                    let current = grid[gr][gc];
                    if current == CellState::Empty {
                        unknown.push((gr, gc, pt));
                    } else if current == pt {
                        confirmed_in += 1;
                    }
                }

                if confirmed_in == target && !unknown.is_empty() {
                    for (gr, gc, pt) in unknown {
                        if grid[gr][gc] == CellState::Empty {
                            let val = if pt == CellState::Forward { CellState::Backward } else { CellState::Forward };
                            grid[gr][gc] = val;
                            changed = true;
                            let (u, v) = if val == CellState::Forward {
                                (get_node_index(gr, gc + 1, cols), get_node_index(gr + 1, gc, cols))
                            } else {
                                (get_node_index(gr, gc, cols), get_node_index(gr + 1, gc + 1, cols))
                            };
                            if dsu.connected(u, v) { return false; }
                            dsu.union(u, v);
                        }
                    }
                } else if confirmed_in + unknown.len() == target && !unknown.is_empty() {
                    for (gr, gc, pt) in unknown {
                        if grid[gr][gc] == CellState::Empty {
                            grid[gr][gc] = pt;
                            changed = true;
                            let (u, v) = if pt == CellState::Forward {
                                (get_node_index(gr, gc + 1, cols), get_node_index(gr + 1, gc, cols))
                            } else {
                                (get_node_index(gr, gc, cols), get_node_index(gr + 1, gc + 1, cols))
                            };
                            if dsu.connected(u, v) { return false; }
                            dsu.union(u, v);
                        }
                    }
                }
            }
        }

        if changed { continue; }

        for r in 0..rows {
            for c in 0..cols {
                if grid[r][c] != CellState::Empty { continue; }

                let u_f = get_node_index(r, c + 1, cols);
                let v_f = get_node_index(r + 1, c, cols);
                let is_cycle_forward = dsu.connected(u_f, v_f);

                let u_b = get_node_index(r, c, cols);
                let v_b = get_node_index(r + 1, c + 1, cols);
                let is_cycle_backward = dsu.connected(u_b, v_b);

                if is_cycle_forward && is_cycle_backward { return false; }

                if is_cycle_forward {
                    grid[r][c] = CellState::Backward;
                    changed = true;
                    dsu.union(u_b, v_b);
                } else if is_cycle_backward {
                    grid[r][c] = CellState::Forward;
                    changed = true;
                    dsu.union(u_f, v_f);
                }
            }
        }
    }

    for r in 0..rows {
        for c in 0..cols {
            if grid[r][c] == CellState::Empty { return false; }
        }
    }

    let final_numbers = calculate_numbers(&grid, rows, cols);
    for r in 0..=rows {
        for c in 0..=cols {
            if let Some(target) = masked_numbers[r][c] {
                if final_numbers[r][c] != target { return false; }
            }
        }
    }

    true
}

#[wasm_bindgen]
pub fn generate_puzzle_wasm(rows: usize, cols: usize, seed: u64, hint_density: f32) -> JsValue {
    let mut rng = SmallRng::seed_from_u64(seed);
    let mut final_grid = vec![vec![CellState::Empty; cols]; rows];
    let mut success = false;

    for _attempt in 0..50 {
        let mut grid = vec![vec![CellState::Empty; cols]; rows];
        let mut dsu = Dsu::new((rows + 1) * (cols + 1));
        let mut cells: Vec<(usize, usize)> = Vec::new();
        for r in 0..rows {
            for c in 0..cols {
                cells.push((r, c));
            }
        }
        cells.shuffle(&mut rng);

        let mut stuck = false;
        for (r, c) in cells {
            let u_f = get_node_index(r, c + 1, cols);
            let v_f = get_node_index(r + 1, c, cols);
            let cycle_f = dsu.connected(u_f, v_f);

            let u_b = get_node_index(r, c, cols);
            let v_b = get_node_index(r + 1, c + 1, cols);
            let cycle_b = dsu.connected(u_b, v_b);

            if cycle_f && cycle_b {
                stuck = true;
                break;
            }

            if cycle_f {
                grid[r][c] = CellState::Backward;
                dsu.union(u_b, v_b);
            } else if cycle_b {
                grid[r][c] = CellState::Forward;
                dsu.union(u_f, v_f);
            } else {
                if rng.gen_bool(0.5) {
                    grid[r][c] = CellState::Forward;
                    dsu.union(u_f, v_f);
                } else {
                    grid[r][c] = CellState::Backward;
                    dsu.union(u_b, v_b);
                }
            }
        }

        if !stuck {
            final_grid = grid;
            success = true;
            break;
        }
    }

    if !success {
        for r in 0..rows {
            for c in 0..cols {
                final_grid[r][c] = if r % 2 == 0 { CellState::Forward } else { CellState::Backward };
            }
        }
    }

    let full_numbers = calculate_numbers(&final_grid, rows, cols);
    let mut masked_numbers: Vec<Vec<Option<u8>>> = full_numbers.iter()
        .map(|row| row.iter().map(|&n| Some(n)).collect())
        .collect();

    let mut coords = Vec::new();
    for r in 0..=rows {
        for c in 0..=cols {
            coords.push((r, c));
        }
    }
    coords.shuffle(&mut rng);

    let target_hint_count = (rows as f32 + 1.0) * (cols as f32 + 1.0) * hint_density;
    let mut current_hint_count = (rows + 1) * (cols + 1);

    for (r, c) in coords {
        if current_hint_count as f32 <= target_hint_count { continue; }
        let original = masked_numbers[r][c];
        masked_numbers[r][c] = None;
        if check_deductive_solvability(&masked_numbers, rows, cols) {
            current_hint_count -= 1;
        } else {
            masked_numbers[r][c] = original;
        }
    }

    let result = Puzzle {
        numbers: masked_numbers,
        solution: final_grid,
    };

    serde_wasm_bindgen::to_value(&result).unwrap()
}

use rand::Rng;
