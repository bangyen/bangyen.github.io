import { useState, useEffect, useRef } from 'react';
import { useMediaQuery } from '../components/mui';

export interface Size {
    width: number;
    height: number;
}

export interface RefObject<T> {
    current: T | null;
}

export function getWindow(): Size {
    const { innerWidth: width, innerHeight: height } = window;
    return { width, height };
}

export function getContainer(container: RefObject<HTMLElement> | null): Size {
    if (!container || !container.current) return { width: 0, height: 0 };
    const { offsetHeight: height, offsetWidth: width } = container.current;
    return { width, height };
}

export function useSize(getSize: () => Size) {
    const [size, setSize] = useState<Size>(getSize());
    const { addEventListener: addEvent, removeEventListener: removeEvent } =
        window;

    useEffect(() => {
        function handleResize() {
            setSize(getSize());
        }
        addEvent('resize', handleResize);
        return () => removeEvent('resize', handleResize);
    }, [getSize, addEvent, removeEvent]);

    return { size, setSize };
}

export function useWindow(): Size {
    const { size } = useSize(getWindow);
    return size;
}

export function useMobile(size: string): boolean {
    return useMediaQuery((theme: unknown) => {
        const muiTheme = theme as {
            breakpoints: { down: (size: string) => string };
        };
        return muiTheme.breakpoints.down(size);
    });
}

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
        return () => window.removeEventListener('resize', handleResize);
    }, [container]);

    return size;
}
