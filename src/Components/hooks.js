import { useState, useEffect } from 'react';

function getWindow() {
    const {
        innerWidth: width,
        innerHeight: height
    } = window;

    return {width, height};
}

export function useWindow() {
    const [size, setSize]
        = useState(getWindow());

    useEffect(() => {
        function handleResize() {
            setSize(getWindow());
        }

        window.addEventListener(
            'resize', handleResize
        );

        return () => window.removeEventListener(
            'resize', handleResize
        );
    }, []);

    return size;
}

export function useTimer(delay) {
    const [repeat, setRepeat] = useState(null);
    const [speed, setSpeed]   = useState(delay);

    useEffect(() => {
        let timer;

        if (repeat)
            timer = setInterval(
                repeat, speed);

        return () =>
            clearInterval(timer);
    }, [repeat, speed]);

    return {setRepeat, setSpeed};
}

export function useKeys() {
    const [handler, setHandler]
        = useState(() => {});

    useEffect(() => {
        document.addEventListener(
            'keydown', handler);

        return () =>
            document.removeEventListener(
                'keydown', handler);
    }, [handler]);

    return setHandler;
}
