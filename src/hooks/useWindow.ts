import { Size, useSize, getWindow } from './useSize';

export function useWindow(): Size {
    const { size } = useSize(getWindow);

    return size;
}
