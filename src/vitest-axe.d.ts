import type { AxeMatchers } from 'vitest-axe';

declare global {
    namespace Vi {
        // eslint-disable-next-line @typescript-eslint/no-empty-object-type
        interface Assertion extends AxeMatchers {}
        // eslint-disable-next-line @typescript-eslint/no-empty-object-type
        interface AsymmetricMatchersContaining extends AxeMatchers {}
    }
}

export {};
