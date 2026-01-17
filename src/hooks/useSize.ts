import { useState, useEffect } from 'react';

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
