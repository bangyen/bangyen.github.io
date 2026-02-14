/**
 * Slant ghost-mode (calculator) CSS custom properties.
 *
 * These variables are consumed only by the Slant ghost overlay
 * components.  Extracting them keeps the core MUI theme file
 * focused on application-wide design tokens.
 */
export function getSlantGhostCssVars(
    mode: 'light' | 'dark',
): Record<string, string> {
    const dark = mode === 'dark';

    return {
        '--slant-ghost-border': dark
            ? 'rgba(255, 255, 255, 0.1)'
            : 'rgba(0, 0, 0, 0.1)',
        '--slant-ghost-bg-subtle': dark
            ? 'rgba(255, 255, 255, 0.02)'
            : 'rgba(0, 0, 0, 0.02)',
        '--slant-ghost-bg-hover': dark
            ? 'rgba(255, 255, 255, 0.1)'
            : 'rgba(0, 0, 0, 0.05)',
        '--slant-ghost-dashed-border': dark
            ? 'rgba(255, 255, 255, 0.2)'
            : 'rgba(0, 0, 0, 0.15)',
        '--slant-ghost-hint-bg': dark
            ? 'hsl(217, 50%, 8%)'
            : 'hsl(217, 30%, 94%)',
        '--slant-ghost-hint-border': dark
            ? 'rgba(255, 255, 255, 0.3)'
            : 'rgba(0, 0, 0, 0.1)',
        '--slant-ghost-hint-text': dark ? '#fff' : 'hsl(217, 91%, 30%)',
    };
}
