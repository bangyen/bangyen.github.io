import { useState, useRef, useEffect } from 'react';
import { Size, RefObject, getContainer } from './useSize';

export function useContainer(container: RefObject<HTMLElement> | null): Size {
    const initialSize = getContainer(container);
    const [size, setSize] = useState<Size>(initialSize);
    const prevSizeRef = useRef<Size>(initialSize);

    useEffect(() => {
        const newSize = getContainer(container);
        // Only update if values actually changed
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
                // Only update if values actually changed
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
