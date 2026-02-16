/**
 * Declarative CSS custom-property definition.
 *
 * Each entry maps a CSS variable name to its light- and dark-mode values,
 * keeping the definitions data-driven so that feature-specific vars
 * (research, slant analysis, etc.) follow a single pattern.
 */
export interface CssVarDefinition {
    /** CSS custom property name including the leading `--`. */
    name: string;
    /** Value used when the app is in light mode. */
    light: string;
    /** Value used when the app is in dark mode. */
    dark: string;
}

/**
 * Converts an array of declarative CSS variable definitions into a
 * `Record<string, string>` suitable for spreading into MUI's
 * `:root` style overrides.
 *
 * Centralises the light/dark branching so that individual feature
 * configs only need to declare `{ name, light, dark }` tuples.
 *
 * @param definitions - Declarative variable definitions
 * @param mode - Current colour-scheme mode
 * @returns A flat object keyed by CSS variable name
 */
export function buildCssVars(
    definitions: readonly CssVarDefinition[],
    mode: 'light' | 'dark',
): Record<string, string> {
    const dark = mode === 'dark';
    const result: Record<string, string> = {};
    for (const { name, light, dark: darkVal } of definitions) {
        result[name] = dark ? darkVal : light;
    }
    return result;
}
