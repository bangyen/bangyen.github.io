import type { ComponentType } from 'react';
import { lazy } from 'react';

/**
 * Convenience wrapper around `React.lazy` for modules that use named exports.
 *
 * Every lazy import of a named export requires the same
 * `.then(m => ({ default: m.Name }))` boilerplate.  This helper eliminates
 * that repetition and keeps the call-site to a single line.
 *
 * The returned component preserves the original prop types when the module
 * export extends `ComponentType<P>`.
 *
 * @param factory - Dynamic import call, e.g. `() => import('./Foo')`
 * @param name    - The named export to extract from the module
 * @returns A lazy React component suitable for use in `<Suspense>`
 *
 * @example
 * ```ts
 * const Home = lazyNamed(() => import('./pages/Home'), 'Home');
 * ```
 */
export function lazyNamed<
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    M extends Record<string, ComponentType<any>>,
    K extends keyof M,
>(factory: () => Promise<M>, name: K): React.LazyExoticComponent<M[K]> {
    return lazy(() =>
        factory().then(m => ({
            default: m[name],
        })),
    );
}
