import { useState, useCallback } from 'react';

import type { Control, ControlConfig } from '../types';

/**
 * Manages a set of numeric controls from a static config array,
 * eliminating per-page boilerplate for useState + onChange + reset
 * wiring that every control-driven research demo would otherwise repeat.
 */
export function useControls(configs: ControlConfig[]): {
    values: Record<string, number>;
    controls: Control[];
    reset: () => void;
} {
    const [values, setValues] = useState<Record<string, number>>(() =>
        Object.fromEntries(configs.map(c => [c.key, c.defaultValue])),
    );

    const controls: Control[] = configs.map(config => ({
        label: config.label,
        icon: config.icon,
        color: config.color,
        hoverColor: config.hoverColor,
        value: values[config.key] ?? config.defaultValue,
        onChange: (v: number) => {
            setValues(prev => ({ ...prev, [config.key]: v }));
        },
        options: config.options,
    }));

    const reset = useCallback(() => {
        setValues(
            Object.fromEntries(configs.map(c => [c.key, c.defaultValue])),
        );
    }, [configs]);

    return { values, controls, reset };
}
