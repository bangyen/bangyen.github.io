/** Creates a Web Worker for the analysis-mode constraint solver. */
export function createWorker(): Worker {
    return new Worker(new URL('../workers/solverWorker.ts', import.meta.url), {
        type: 'module',
    });
}

/** Creates a Web Worker for off-thread puzzle generation. */
export function createGenerationWorker(): Worker {
    return new Worker(
        new URL('../workers/generationWorker.ts', import.meta.url),
        { type: 'module' },
    );
}
