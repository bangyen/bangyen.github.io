import { describe, it, expect, vi } from 'vitest';

import { Getters } from '../../../components/Board';
import { getFrontProps, getBackProps, getExampleProps } from '../renderers';

describe('renderers', () => {
    const mockGetters: Getters = {
        getColor: vi.fn().mockReturnValue({ front: 'red', back: 'blue' }),
        getBorder: vi.fn().mockReturnValue({ border: '1px solid black' }),
        getFiller: vi.fn().mockReturnValue('black'),
    };

    describe('getFrontProps', () => {
        it('should return props for front of cell', () => {
            const getDragProps = vi
                .fn()
                .mockReturnValue({ 'data-testid': 'drag' });
            const factory = getFrontProps(getDragProps, mockGetters);
            const props = factory(0, 0) as any;

            expect(props['data-testid']).toBe('drag');
            expect(props.backgroundColor).toBe('red');
            expect(props.color).toBe('red');
            expect(props.style).toEqual({ border: '1px solid black' });
            expect(props['aria-label']).toBe('Cell at row 1, column 1');
            expect(getDragProps).toHaveBeenCalledWith('0,0');
        });
    });

    describe('getBackProps', () => {
        it('should return props for back of cell', () => {
            const factory = getBackProps(mockGetters);
            const props = factory(0, 0);

            expect(props.backgroundColor).toBe('black');
            expect(props.transition).toBeDefined();
        });
    });

    describe('getExampleProps', () => {
        it('should return props for example cell without drag handlers', () => {
            const factory = getExampleProps(mockGetters);
            const props = factory(0, 0);

            expect(props.backgroundColor).toBe('red');
            expect(props.onMouseDown).toBeUndefined();
            expect(props.onMouseEnter).toBeUndefined();
            expect(props.onTouchStart).toBeUndefined();
        });
    });
});
