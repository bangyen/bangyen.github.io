/**
 * User-facing UI text constants for the home feature.
 * Centralises copy so labels are easy to update and could
 * serve as a foundation for future i18n support.
 */

export const HOME_TEXT = {
    hero: {
        greeting: "Hello, I'm",
        ctaLabel: 'View Work',
    },
    featuredWork: {
        sectionTitle: 'Featured Work',
        categories: {
            engineering: 'Engineering',
            research: 'Research',
        },
    },
    techStack: {
        sectionTitle: 'Tech Stack',
    },
    connect: {
        heading: "Let's Connect",
        description:
            'Open to opportunities in backend development, ML engineering, and research collaboration.',
        githubButton: 'View GitHub',
        projectsButton: 'Available for Projects',
    },
} as const;
