/**
 * Normalizes a string for comparison.
 * Removes accents, clears "st." to "saint", removes leading "the",
 * and strips non-alphanumeric characters (keeps dots).
 */
export const normalize = (str: string) => {
    return str
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Remove accents/diacritics
        .replace(/\bst\.(?=\s|$)/g, 'saint')
        .replace(/^the\s+/g, '')
        .replace(/[^\w\s\.]/g, '') // Keep dots for .codes
        .trim();
};

/**
 * Checks if the user input matches the expected string using smart matching rules.
 */
export const isSmartMatch = (
    input: string,
    expected: string,
    aliases: Record<string, string[]> = {}
) => {
    const ni = normalize(input);
    const ne = normalize(expected);

    // 1. Exact normalized match
    if (ni === ne) return true;

    // 2. Predefined Aliases
    if (aliases[ne]?.map(a => normalize(a)).includes(ni)) return true;

    // 3. Parentheses handling: "Cocos (Keeling) Islands" -> "Cocos Islands"
    const withoutParens = normalize(
        expected.replace(/\s*\(.*?\)\s*/g, ' ').replace(/\s+/g, ' ')
    );
    if (ni === withoutParens) return true;

    // Also check first part before parens
    const firstPartParens = normalize(expected.split('(')[0]);
    if (ni === firstPartParens) return true;

    // 4. "And" handling: Match the first part before "and"
    if (ne.includes(' and ')) {
        const firstPart = normalize(expected.split(' and ')[0]);
        if (ni === firstPart) return true;
    }

    return false;
};
