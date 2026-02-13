import { useState, useEffect, useRef } from 'react';

import { useMediaQuery } from '@/components/mui';

/**
 * Represents dimensions of a DOM element or window.
 */
export interface Size {
    /** Width in pixels */
    width: number;
    /** Height in pixels */
    height: number;
}

/**
 * Generic ref object type for DOM elements.
 */
export interface RefObject<T> {
    /** Current element reference, or null if not yet mounted */
    current: T | null;
}

/**
 * Gets the current window dimensions.
 * @returns Object with width and height of the browser window
 */
export function getWindow(): Size {
    const { innerWidth: width, innerHeight: height } = globalThis;
    return { width, height };
}

/**
 * Gets the dimensions of a container element.
 * @param container - Ref object pointing to an HTML element
 * @returns Object with width and height of the container, or {0, 0} if container is null
 */
export function getContainer(container: RefObject<HTMLElement> | null): Size {
    if (!container?.current) return { width: 0, height: 0 };
    const { offsetHeight: height, offsetWidth: width } = container.current;
    return { width, height };
}

/**
 * Generic hook for tracking size changes with window resize events.
 * @param getSize - Function that returns current size
 * @returns Object with current size and setter function
 */
export function useSize(getSize: () => Size) {
    const [size, setSize] = useState<Size>(getSize());

    useEffect(() => {
        function handleResize() {
            setSize(getSize());
        }
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [getSize]);

    return { size, setSize };
}

/**
 * Hook to track browser window dimensions.
 * Automatically updates on window resize.
 * @returns Current window size
 */
export function useWindow(): Size {
    const { size } = useSize(getWindow);
    return size;
}

/**
 * Hook to check if viewport matches a mobile breakpoint.
 * @param size - MUI breakpoint size (e.g., 'sm', 'md', 'lg')
 * @returns True if viewport is below the specified breakpoint
 */
export function useMobile(size: string): boolean {
    return useMediaQuery((theme: unknown) => {
        const muiTheme = theme as {
            breakpoints: { down: (size: string) => string };
        };
        return muiTheme.breakpoints.down(size);
    });
}

/**
 * Hook to track container element dimensions.
 * Automatically updates on window resize and container changes.
 * @param container - Ref object pointing to the container element
 * @returns Current container size
 */
export function useContainer(container: RefObject<HTMLElement> | null): Size {
    const initialSize = getContainer(container);
    const [size, setSize] = useState<Size>(initialSize);
    const prevSizeRef = useRef<Size>(initialSize);

    useEffect(() => {
        const newSize = getContainer(container);
        if (
            newSize.width !== prevSizeRef.current.width ||
            newSize.height !== prevSizeRef.current.height
        ) {
            prevSizeRef.current = newSize;
            setSize(newSize);
        }
    }, [container]);

    useEffect(() => {
        function handleResize() {
            const newSize = getContainer(container);
            setSize(prevSize => {
                if (
                    newSize.width !== prevSize.width ||
                    newSize.height !== prevSize.height
                ) {
                    return newSize;
                }
                return prevSize;
            });
        }

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [container]);

    return size;
}
