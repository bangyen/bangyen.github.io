/**
 * Normalizes a string for comparison.
 *
 * Normalization steps:
 * 1. Convert to lowercase
 * 2. Decompose characters and remove accents/diacritics
 * 3. Replace "st." abbreviation with "saint"
 * 4. Remove leading "the "
 * 5. Strip non-alphanumeric characters except dots (needed for .codes)
 * 6. Trim whitespace
 *
 * @param str - The string to normalize
 * @returns The normalized string
 */
export const normalize = (str: string): string => {
    return str
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Remove accents/diacritics
        .replace(/\bst\.(?=\s|$)/g, 'saint')
        .replace(/^the\s+/g, '')
        .replace(/[^\w\s.]/g, '') // Keep dots for .codes
        .trim();
};

/**
 * Checks if the user input matches the expected string using smart matching rules.
 *
 * Matching rules:
 * 1. Exact normalized match
 * 2. Predefined Aliases (e.g., "US" for "United States")
 * 3. Parentheses handling (matches either full name or name without stuff in parens)
 * 4. "And" handling (matches the first part before "and")
 *
 * @param input - The user's input string
 * @param expected - The correct answer string
 * @param aliases - Optional dictionary of aliases for different items
 * @returns True if the input is considered a match
 */
export const isSmartMatch = (
    input: string,
    expected: string,
    aliases: Record<string, string[]> = {}
): boolean => {
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
    const firstPartParens = normalize(expected.split('(')[0] ?? '');
    if (ni === firstPartParens) return true;

    // 4. "And" handling: Match the first part before "and"
    if (ne.includes(' and ')) {
        const firstPart = normalize(expected.split(' and ')[0] ?? '');
        if (ni === firstPart) return true;
    }

    return false;
};
