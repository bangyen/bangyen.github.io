import { useMediaQuery } from '@mui/material';
import type { Breakpoint, Theme } from '@mui/material/styles';
import { useState, useEffect } from 'react';

/**
 * Represents dimensions of a DOM element or window.
 */
interface Size {
    /** Width in pixels */
    width: number;
    /** Height in pixels */
    height: number;
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
export function useMobile(size: Breakpoint): boolean {
    return useMediaQuery((theme: Theme) => theme.breakpoints.down(size));
}
