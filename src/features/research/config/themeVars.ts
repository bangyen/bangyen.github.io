/**
 * Research-specific CSS custom properties.
 *
 * These are glass / border / accent variables consumed exclusively by
 * research pages.  They live here so the core MUI theme file stays
 * focused on application-wide design tokens.
 */
export function getResearchCssVars(
    mode: 'light' | 'dark',
): Record<string, string> {
    const dark = mode === 'dark';

    return {
        // Glass intensity scale
        '--glass-very-subtle': dark
            ? 'rgba(255, 255, 255, 0.01)'
            : 'rgba(0, 0, 0, 0.02)',
        '--glass-subtle': dark
            ? 'rgba(255, 255, 255, 0.02)'
            : 'rgba(0, 0, 0, 0.04)',
        '--glass-transparent': dark
            ? 'rgba(255, 255, 255, 0.03)'
            : 'rgba(0, 0, 0, 0.06)',
        '--glass-slight': dark
            ? 'rgba(255, 255, 255, 0.05)'
            : 'rgba(0, 0, 0, 0.08)',
        '--glass-medium': dark
            ? 'rgba(255, 255, 255, 0.1)'
            : 'rgba(0, 0, 0, 0.12)',
        '--glass-strong': dark
            ? 'rgba(255, 255, 255, 0.2)'
            : 'rgba(0, 0, 0, 0.16)',
        '--glass-dark': dark ? 'rgba(0, 0, 0, 0.2)' : 'rgba(0, 0, 0, 0.05)',

        // Borders
        '--research-border-subtle': dark
            ? 'rgba(255, 255, 255, 0.05)'
            : 'rgba(0, 0, 0, 0.08)',
        '--research-border-very-subtle': dark
            ? 'rgba(255, 255, 255, 0.03)'
            : 'rgba(0, 0, 0, 0.04)',

        // Data-specific mode-aware highlights
        '--research-cyan-bg': dark
            ? 'rgba(0, 184, 212, 0.1)'
            : 'rgba(0, 184, 212, 0.08)',
        '--research-cyan-border': dark
            ? 'rgba(0, 184, 212, 0.2)'
            : 'rgba(0, 184, 212, 0.15)',
        '--research-green-bg': dark
            ? 'rgba(0, 200, 83, 0.1)'
            : 'rgba(0, 200, 83, 0.08)',
        '--research-green-border': dark
            ? 'rgba(0, 200, 83, 0.2)'
            : 'rgba(0, 200, 83, 0.15)',
        '--research-amber-bg': dark
            ? 'rgba(255, 193, 7, 0.1)'
            : 'rgba(255, 193, 7, 0.08)',
        '--research-amber-border': dark
            ? 'rgba(255, 193, 7, 0.2)'
            : 'rgba(255, 193, 7, 0.15)',
    };
}
