import { useState, useEffect, useRef, useCallback } from 'react';

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
    const oldRepeat = useRef(() => {});
    const oldSpeed  = useRef(delay);
    const timer     = useRef(null);

    const create  = useCallback(
        ({repeat, speed}) => {
            repeat ||= oldRepeat.current;
            speed  ||= oldSpeed.current;

            timer.current
                = setInterval(
                    repeat, speed);
        }, []);

    const destroy = useCallback(() => {
        clearInterval(timer.current);
    }, []);

    useEffect(() => {
        return () => clearInterval(timer.current);
    }, []);

    return {create, destroy};
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
