import { useState, useEffect, useRef, useCallback } from 'react';

function getWindow() {
    const {
        innerWidth: width,
        innerHeight: height
    } = window;

    return {width, height};
}

function containerHandler(container) {
    container ||= {};

    return () => {
        const {current} = container;

        if (current) {
            return {
                width: current.offsetWidth,
                height: current.offsetHeight
            };
        }

        return getWindow();
    };
}

function useSize(getSize) {
    const [size, setSize]
        = useState(getSize());

    useEffect(() => {
        function handleResize() {
            setSize(getSize());
        }

        window.addEventListener(
            'resize', handleResize
        );

        return () => window.removeEventListener(
            'resize', handleResize
        );
    }, [getSize]);

    return {size, setSize};
}

export function useContainer(container) {
    const getContainer
        = containerHandler(container);

    const {size, setSize}
        = useSize(getContainer);

    useEffect(() => {
        setSize(getContainer());
    }, [container]);

    return size;
}

export function useWindow() {
    const {size}
        = useSize(getWindow);

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
