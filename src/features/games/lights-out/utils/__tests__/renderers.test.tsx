import { describe, it, expect, vi } from 'vitest';

import type { Getters } from '../../types';
import { getFrontProps, getBackProps, getCellVisualProps } from '../renderers';

describe('renderers', () => {
    const mockGetters: Getters = {
        getColor: vi
            .fn()
            .mockReturnValue({ front: 'red', back: 'blue', isLit: false }),
        getBorder: vi.fn().mockReturnValue({ border: '1px solid black' }),
        getFiller: vi.fn().mockReturnValue('black'),
    };

    describe('getFrontProps', () => {
        it('should return props for front of cell', () => {
            const getDragProps = vi
                .fn()
                .mockReturnValue({ 'data-testid': 'drag' });
            const factory = getFrontProps(getDragProps, mockGetters);
            const props = factory(0, 0) as Record<string, unknown>;

            expect(props['data-testid']).toBe('drag');
            expect(props['backgroundColor']).toBe('red');
            expect(props['color']).toBe('red');
            expect(props['style']).toEqual({ border: '1px solid black' });
            expect(props['aria-label']).toBe(
                'Light at row 1, column 1, currently unlit',
            );
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

    describe('getCellVisualProps', () => {
        it('should return visual-only props without drag handlers', () => {
            const factory = getCellVisualProps(mockGetters);
            const props = factory(0, 0) as Record<string, unknown>;

            expect(props['backgroundColor']).toBe('red');
            expect(props['color']).toBe('red');
            expect(props['aria-label']).toBe(
                'Light at row 1, column 1, currently unlit',
            );
            expect(props['onMouseDown']).toBeUndefined();
            expect(props['onMouseEnter']).toBeUndefined();
            expect(props['onTouchStart']).toBeUndefined();
        });
    });
});
