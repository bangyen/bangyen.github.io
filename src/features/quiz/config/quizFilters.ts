import { FilterFunction } from '../types/quiz';

/**
 * Filter for CCTLD language selection.
 * Filters by English, Non-English, or specific languages.
 */
export const filterByLanguage: FilterFunction = (items, settings) => {
    if (!settings.filterLanguage || settings.filterLanguage === 'All') {
        return items;
    }

    if (settings.filterLanguage === 'Non-English') {
        return items.filter(
            item => item.type === 'cctld' && item.language !== 'English'
        );
    }

    return items.filter(
        item =>
            item.type === 'cctld' && item.language === settings.filterLanguage
    );
};

/**
 * Filter for telephone code zones.
 * Supports comma-separated zone prefixes (e.g., "1,44,61").
 */
export const filterByZone: FilterFunction = (items, settings) => {
    if (!settings.filterZone || settings.filterZone === 'All') {
        return items;
    }

    const zones = settings.filterZone.split(',');
    return items.filter(
        item =>
            item.type === 'telephone' &&
            zones.some((z: string) => item.code.startsWith(`+${z}`))
    );
};

/**
 * Filter for vehicle registration conventions.
 * Filters by Vienna Convention compliance (1968 or 1949).
 */
export const filterByConvention: FilterFunction = (items, settings) => {
    if (!settings.filterConvention || settings.filterConvention === 'All') {
        return items;
    }

    return items.filter(
        item =>
            item.type === 'vehicle' &&
            item.conventions?.includes(Number(settings.filterConvention))
    );
};

/**
 * Filter for driving side switches.
 * Handles both 'guessing' mode and 'toCountry' mode logic.
 */
export const filterBySwitch: FilterFunction = (items, settings) => {
    // In 'toCountry' mode, always show only switched countries
    if (settings.mode === 'toCountry') {
        return items.filter(
            item => item.type === 'driving_side' && item.switched
        );
    }

    // In other modes, respect the filterSwitch setting
    if (!settings.filterSwitch || settings.filterSwitch === 'All') {
        return items;
    }

    return items.filter(item =>
        item.type === 'driving_side'
            ? settings.filterSwitch === 'Switched'
                ? item.switched
                : !item.switched
            : false
    );
};

/**
 * Filter for driving side (Left/Right).
 * Only applies in 'toCountry' mode.
 */
export const filterBySide: FilterFunction = (items, settings) => {
    if (
        !settings.filterSide ||
        settings.filterSide === 'All' ||
        settings.mode !== 'toCountry'
    ) {
        return items;
    }

    return items.filter(
        item =>
            item.type === 'driving_side' && item.side === settings.filterSide
    );
};

/**
 * Filter by starting letter(s).
 * Supports multiple formats:
 * - Single letter: "a"
 * - Multiple letters (space-separated): "a b c"
 * - Multiple letters (comma-separated): "a,b,c"
 * - Multiple characters: "abc" (treated as individual letters)
 */
export const filterByLetter: FilterFunction = (items, settings) => {
    if (
        typeof settings.filterLetter !== 'string' ||
        settings.filterLetter === ''
    ) {
        return items;
    }

    let letters = settings.filterLetter
        .toLowerCase()
        .split(',')
        .map((l: string) => l.trim())
        .filter((l: string) => l);

    // If no commas, try space-separated
    if (letters.length <= 1 && !settings.filterLetter.includes(',')) {
        const spaceSplit = settings.filterLetter
            .toLowerCase()
            .split(/\s+/)
            .filter((l: string) => l);

        if (spaceSplit.length > 1) {
            letters = spaceSplit;
        } else {
            // Split into individual characters
            letters = settings.filterLetter
                .toLowerCase()
                .split('')
                .filter((l: string) => l.trim());
        }
    }

    if (letters.length === 0) {
        return items;
    }

    return items.filter(item => {
        let text = '';

        // Use discriminated union type field for type-safe access
        switch (item.type) {
            case 'cctld':
                text =
                    settings.mode === 'toCountry'
                        ? item.code.toLowerCase().replace('.', '')
                        : item.country.toLowerCase();
                break;
            case 'driving_side':
                text = item.country.toLowerCase();
                break;
            case 'telephone':
                text = item.country.toLowerCase();
                break;
            case 'vehicle':
                text =
                    settings.mode === 'toCountry'
                        ? item.code.toLowerCase()
                        : item.country.toLowerCase();
                break;
        }

        return letters.some((l: string) => text.startsWith(l));
    });
};

/**
 * Applies random selection and limiting based on maxQuestions setting.
 * This should be applied last after all other filters.
 */
export const applyQuestionLimit: FilterFunction = (items, settings) => {
    if (settings.maxQuestions === 'All') {
        return items;
    }

    return [...items]
        .sort(() => Math.random() - 0.5)
        .slice(0, settings.maxQuestions);
};
