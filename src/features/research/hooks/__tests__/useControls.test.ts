import { renderHook, act } from '@testing-library/react';

import type { ControlConfig } from '../../types';
import { useControls } from '../useControls';

const configs: ControlConfig[] = [
    {
        key: 'alpha',
        label: 'Alpha',
        defaultValue: 10,
        options: [
            { value: 5, label: '5' },
            { value: 10, label: '10' },
            { value: 15, label: '15' },
        ],
    },
    {
        key: 'beta',
        label: 'Beta',
        color: '#ff0000',
        defaultValue: 2,
        options: [
            { value: 1, label: '1' },
            { value: 2, label: '2' },
            { value: 3, label: '3' },
        ],
    },
];

describe('useControls', () => {
    test('initialises values from config defaults', () => {
        const { result } = renderHook(() => useControls(configs));

        expect(result.current.values).toEqual({ alpha: 10, beta: 2 });
    });

    test('generates a Control for every config entry', () => {
        const { result } = renderHook(() => useControls(configs));
        const { controls } = result.current;

        expect(controls).toHaveLength(2);
        expect(controls[0]!.label).toBe('Alpha');
        expect(controls[0]!.value).toBe(10);
        expect(controls[0]!.options).toEqual(configs[0]!.options);
        expect(controls[1]!.label).toBe('Beta');
        expect(controls[1]!.color).toBe('#ff0000');
    });

    test('onChange updates the targeted value', () => {
        const { result } = renderHook(() => useControls(configs));

        act(() => {
            result.current.controls[0]!.onChange(15);
        });

        expect(result.current.values).toEqual({ alpha: 15, beta: 2 });
        expect(result.current.controls[0]!.value).toBe(15);
        // other control stays unchanged
        expect(result.current.controls[1]!.value).toBe(2);
    });

    test('reset restores all values to defaults', () => {
        const { result } = renderHook(() => useControls(configs));

        act(() => {
            result.current.controls[0]!.onChange(5);
            result.current.controls[1]!.onChange(3);
        });

        expect(result.current.values).toEqual({ alpha: 5, beta: 3 });

        act(() => {
            result.current.reset();
        });

        expect(result.current.values).toEqual({ alpha: 10, beta: 2 });
    });
});
