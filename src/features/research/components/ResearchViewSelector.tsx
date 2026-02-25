import { Button, Box } from '@mui/material';
import type { SxProps, Theme } from '@mui/material';
import React from 'react';

import { RESEARCH_STYLES } from '../config/constants';
import { useListNavigation } from '../hooks/useListNavigation';
import type { ViewType } from '../types';

import {
    COLORS,
    SPACING,
    TYPOGRAPHY,
    SHADOWS,
    ANIMATIONS,
} from '@/config/theme';

/** Outer wrapper that adds bottom margin and constrains width. */
const selectorContainerSx: SxProps<Theme> = {
    marginBottom: 3,
    width: '100%',
    boxSizing: 'border-box',
};

/**
 * Returns the grid container styles.
 *
 * @param columnCount - Number of view types to display (capped at 4).
 */
const getGridSx = (columnCount: number): SxProps<Theme> => ({
    display: 'grid',
    gridTemplateColumns: {
        xs: 'repeat(2, minmax(0, 1fr))',
        md: `repeat(${Math.min(columnCount, 4).toString()}, 1fr)`,
    },
    gap: 1.5,
    width: '100%',
    margin: 0,
});

/**
 * Returns the toggle-button styles, varying colour and background
 * depending on whether the button represents the active view.
 */
const getButtonSx = (isActive: boolean): SxProps<Theme> => ({
    width: '100%',
    color: isActive ? 'inherit' : COLORS.text.secondary,
    backgroundColor: isActive ? COLORS.primary.main : COLORS.surface.elevated,
    '&.MuiButton-root': {
        color: isActive ? COLORS.text.primary : COLORS.text.secondary,
    },
    borderColor: COLORS.border.subtle,
    borderWidth: '1px',
    borderStyle: 'solid',
    borderRadius: SPACING.borderRadius.lg,
    minHeight: RESEARCH_STYLES.LAYOUT.BUTTON_HEIGHT,
    padding: RESEARCH_STYLES.LAYOUT.INNER_PADDING_SM,
    fontSize: RESEARCH_STYLES.LAYOUT.FONT_SIZE_SM,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
    transition: ANIMATIONS.transitions.standard,
    '&:hover': {
        backgroundColor: isActive
            ? COLORS.primary.dark
            : COLORS.interactive.hover,
        transform: 'translateY(-1px)',
        boxShadow: SHADOWS.sm,
    },
});

export interface ResearchViewSelectorProps<T> {
    viewTypes: ViewType<T>[];
    currentViewType: string;
    onViewTypeChange: (value: string) => void;
}

/**
 * Memoised view-type toggle bar for research pages. Prevents
 * unnecessary re-renders when only chart data changes in the
 * parent `ResearchDemo`, since `viewTypes`, `currentViewType`,
 * and `onViewTypeChange` are typically stable between those updates.
 */
const ResearchViewSelectorInner = <T,>({
    viewTypes,
    currentViewType,
    onViewTypeChange,
}: ResearchViewSelectorProps<T>) => {
    const { getItemProps } = useListNavigation({ count: viewTypes.length });

    if (viewTypes.length <= 1) return null;

    return (
        <Box sx={selectorContainerSx}>
            <Box
                role="toolbar"
                aria-label="View type"
                sx={getGridSx(viewTypes.length)}
            >
                {viewTypes.map((viewType, index) => {
                    const IconComponent = viewType.icon;
                    const isActive = currentViewType === viewType.key;
                    return (
                        <Button
                            key={viewType.key}
                            variant="outlined"
                            size="small"
                            startIcon={<IconComponent />}
                            onClick={() => {
                                onViewTypeChange(viewType.key);
                            }}
                            aria-label={`View ${viewType.label}`}
                            aria-pressed={isActive}
                            sx={getButtonSx(isActive)}
                            {...getItemProps(index, isActive)}
                        >
                            {viewType.label}
                        </Button>
                    );
                })}
            </Box>
        </Box>
    );
};

export const ResearchViewSelector = React.memo(
    ResearchViewSelectorInner,
) as typeof ResearchViewSelectorInner;
