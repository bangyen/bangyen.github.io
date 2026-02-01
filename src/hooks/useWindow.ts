import { useState, useEffect } from 'react';

interface WindowSize {
    height: number;
    width: number;
}

export function useWindow(): WindowSize {
    const [windowSize, setWindowSize] = useState<WindowSize>({
        height: window.innerHeight,
        width: window.innerWidth,
    });

    useEffect(() => {
        const handleResize = () => {
            setWindowSize({
                height: window.innerHeight,
                width: window.innerWidth,
            });
        };

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return windowSize;
}
