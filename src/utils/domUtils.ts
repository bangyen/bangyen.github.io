/**
 * Lightweight DOM helpers shared across the application.
 * Centralises imperative DOM calls so components stay declarative
 * and the behaviour can be tested or swapped in one place.
 */

/**
 * Smoothly scrolls the first element matching `selector` into view.
 *
 * No-ops silently when the selector matches nothing, so callers
 * don't need a guard.
 *
 * @param selector - CSS selector passed to `document.querySelector`.
 */
export function scrollToElement(selector: string): void {
    document.querySelector(selector)?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
        inline: 'nearest',
    });
}
