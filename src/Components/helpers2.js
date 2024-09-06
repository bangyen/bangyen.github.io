import { useState, useEffect } from "react";

export function getSize() {
    const {
        innerWidth: width,
        innerHeight: height
    } = window;

    return {width, height};
}

export function useSize() {
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
    }, []);

    return size;
}