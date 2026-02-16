/**
 * Merges caller overrides into a defaults object, dropping `undefined`
 * values so the spread doesn't clobber existing defaults.
 *
 * Useful when a config interface has many optional fields with sensible
 * defaults and callers only override a handful of them.
 *
 * @template T - The full config object type
 * @param defaults - Complete defaults object
 * @param overrides - Partial overrides (undefined values are ignored)
 * @returns Merged config with overrides applied on top of defaults
 */
export function mergeDefaults<T extends Record<string, unknown>>(
    defaults: T,
    overrides: Partial<T>,
): T {
    const cleaned = Object.fromEntries(
        Object.entries(overrides).filter(([, v]) => v !== undefined),
    );
    return { ...defaults, ...cleaned } as T;
}
