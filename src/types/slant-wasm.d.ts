/**
 * Type declarations for slant-wasm module.
 * This is a stub declaration for the WASM module built from wasm/slant-wasm.
 * The actual module needs to be built with: wasm-pack build ./wasm/slant-wasm --target web
 */

export default function init(
    input?: BufferSource | WebAssembly.Instance,
): Promise<void>;

export function generate_puzzle_wasm(
    rows: number,
    cols: number,
    seed: bigint,
    hint_density: number,
): {
    numbers: (number | null)[][];
    solution: number[][];
};

export function find_cycles_wasm(
    grid: Uint8Array,
    rows: number,
    cols: number,
): string[];
