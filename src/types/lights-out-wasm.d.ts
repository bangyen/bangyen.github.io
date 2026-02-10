/**
 * Type declarations for lights-out-wasm module.
 * This is a stub declaration for the WASM module built from wasm/lights-out-wasm.
 * The actual module needs to be built with: wasm-pack build ./wasm/lights-out-wasm --target web
 */

export default function init(
    input?: BufferSource | WebAssembly.Instance
): Promise<void>;

export function invert_matrix(
    matrix: BigUint64Array,
    size: number
): BigUint64Array;
