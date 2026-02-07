export function createWorker(): Worker {
    return new Worker(new URL('./workers/solverWorker.ts', import.meta.url), {
        type: 'module',
    });
}
