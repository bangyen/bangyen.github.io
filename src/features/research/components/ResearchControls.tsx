import {
    Box,
    Button,
    Grid,
    Typography,
    ToggleButton,
    ToggleButtonGroup,
} from '@mui/material';
import React from 'react';

import { RESEARCH_STYLES } from '../config/constants';
import type { Control } from '../types';
import {
    styles,
    getIconStyles,
    getToggleButtonGroupStyles,
} from './ResearchControls.styles';
import { useListNavigation } from '../hooks/useListNavigation';

import { Refresh } from '@/components/icons';

interface ControlToggleGroupProps {
    control: Control;
}

function ControlToggleGroup({ control }: ControlToggleGroupProps) {
    const { getItemProps } = useListNavigation({
        count: control.options.length,
        containerRole: 'group',
    });

    return (
        <ToggleButtonGroup
            value={control.value}
            exclusive
            onChange={(_e, newValue) => {
                if (newValue !== null) {
                    control.onChange(newValue as number);
                }
            }}
            size="small"
            aria-label={control.label}
            sx={getToggleButtonGroupStyles(control)}
        >
            {control.options.map((option, index) => (
                <ToggleButton
                    key={option.value}
                    value={option.value}
                    aria-label={`${control.label}: ${option.label}`}
                    {...getItemProps(index, option.value === control.value)}
                >
                    {option.label}
                </ToggleButton>
            ))}
        </ToggleButtonGroup>
    );
}

export interface ResearchControlsProps {
    controls: Control[];
    onReset?: () => void;
    resetLabel?: string;
}

/**
 * Renders parameter toggle buttons and an optional reset button.
 *
 * Memoised because the control configs are typically stable between
 * renders and the component should not re-render when unrelated
 * parent state (e.g. chart data) changes.
 */
export const ResearchControls = React.memo(function ResearchControls({
    controls,
    onReset,
    resetLabel = 'Reset',
}: ResearchControlsProps) {
    if (controls.length === 0) return null;

    return (
        <Box sx={styles.rootContainer}>
            {onReset && (
                <Box sx={styles.resetButtonContainer}>
                    <Button
                        variant="outlined"
                        size="small"
                        startIcon={<Refresh />}
                        onClick={onReset}
                        sx={styles.resetButton}
                    >
                        {resetLabel}
                    </Button>
                </Box>
            )}

            <Grid container spacing={RESEARCH_STYLES.LAYOUT.CONTROLS_SPACING}>
                {controls.map((control, index) => (
                    <Grid key={control.label || index} size={{ xs: 12, md: 4 }}>
                        <Box sx={styles.controlCard}>
                            <Box sx={styles.iconLabelContainer}>
                                {control.icon && (
                                    <control.icon
                                        sx={getIconStyles(control.color)}
                                    />
                                )}
                                <Typography variant="body2" sx={styles.label}>
                                    {control.label}
                                </Typography>
                            </Box>
                            <ControlToggleGroup control={control} />
                        </Box>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
});
