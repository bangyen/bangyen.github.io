import { useMediaQuery } from './components/mui';

import { useState, useEffect, useRef, useCallback } from 'react';

function getWindow() {
    const { innerWidth: width, innerHeight: height } = window;

    return { width, height };
}

function getContainer(container) {
    if (!container || !container.current) return getWindow();

    const { offsetHeight: height, offsetWidth: width } = container.current;

    return { width, height };
}

function useSize(getSize) {
    const [size, setSize] = useState(getSize());

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

export function useContainer(container) {
    const wrapper = () => getContainer(container);

    const { size, setSize } = useSize(wrapper);

    useEffect(() => {
        const newSize = getContainer(container);

        setSize(newSize);
    }, [container, setSize]);

    return size;
}

export function useWindow() {
    const { size } = useSize(getWindow);

    return size;
}

export function useMobile(size) {
    return useMediaQuery(theme => theme.breakpoints.down(size));
}

// Global timer reference to handle React StrictMode multiple instances
let globalTimer = null;
let globalRepeat = null;
let globalSpeed = 200;

export function useTimer(delay) {
    const repeat = useRef(null);
    const speed = useRef(delay);

    const create = useCallback(({ repeat: newRepeat, speed: newSpeed }) => {
        // Clear any existing timer first
        if (globalTimer !== null) {
            clearInterval(globalTimer);
        }

        globalRepeat = newRepeat || globalRepeat;
        globalSpeed = newSpeed || globalSpeed;
        repeat.current = globalRepeat;
        speed.current = globalSpeed;

        globalTimer = setInterval(globalRepeat, globalSpeed);
    }, []);

    const clear = useCallback(() => {
        if (globalTimer !== null) {
            clearInterval(globalTimer);
            globalTimer = null;
        }
    }, []);

    useEffect(() => {
        return () => {
            if (globalTimer !== null) {
                clearInterval(globalTimer);
                globalTimer = null;
            }
        };
    }, []);

    return { create, clear };
}

export function useKeys() {
    const oldHandler = useRef(null);

    const create = useCallback(handler => {
        oldHandler.current = handler;

        document.addEventListener('keydown', handler);
    }, []);

    const clear = useCallback(handler => {
        handler ||= oldHandler.current;

        document.removeEventListener('keydown', handler);
    }, []);

    useEffect(() => {
        return () =>
            document.removeEventListener('keydown', oldHandler.current);
    }, []);

    return { create, clear };
}

export function useCache(getState) {
    const cache = useRef([]);
    const index = useRef(0);
    const processingRef = useRef(false);

    return useCallback(
        ({ type, payload }) => {
            const states = cache.current;

            switch (type) {
                case 'next':
                    // Prevent double processing in React StrictMode
                    if (processingRef.current) {
                        return { ...states[index.current] };
                    }

                    processingRef.current = true;

                    const curr = index.current;

                    if (curr + 1 === states.length) {
                        const state = states[curr];
                        const next = getState(state);

                        if (next === state) {
                            // No change, stay at current position
                        } else {
                            // Add new state and move to it
                            states.push(next);
                            index.current++;
                        }
                    } else {
                        index.current++;
                    }

                    const result = { ...states[index.current] };

                    // Reset processing flag after a short delay
                    setTimeout(() => {
                        processingRef.current = false;
                    }, 0);

                    return result;
                case 'prev':
                    // Prevent double processing in React StrictMode
                    if (processingRef.current) {
                        return { ...states[index.current] };
                    }

                    processingRef.current = true;

                    if (index.current) index.current--;

                    const prevResult = { ...states[index.current] };

                    // Reset processing flag after a short delay
                    setTimeout(() => {
                        processingRef.current = false;
                    }, 0);

                    return prevResult;
                case 'clear':
                    cache.current = [{ ...payload }];
                    index.current = 0;

                    break;
                default:
                    break;
            }

            return payload;
        },
        [getState]
    );
}
