import React from 'react';

import { RESEARCH_STYLES } from '../constants';
import { ViewType } from '../types';

import { Button, Box } from '@/components/mui';
import {
    COLORS,
    SPACING,
    TYPOGRAPHY,
    SHADOWS,
    ANIMATIONS,
} from '@/config/theme';

interface ResearchViewSelectorProps<T> {
    viewTypes: ViewType<T>[];
    currentViewType: string;
    onViewTypeChange: (value: string) => void;
}

const ResearchViewSelector = <T,>({
    viewTypes,
    currentViewType,
    onViewTypeChange,
}: ResearchViewSelectorProps<T>) => {
    if (viewTypes.length <= 1) return null;

    return (
        <Box
            sx={{
                marginBottom: 3,
                width: '100%',
                boxSizing: 'border-box',
            }}
        >
            <Box
                sx={{
                    display: 'grid',
                    gridTemplateColumns: {
                        xs: 'repeat(2, minmax(0, 1fr))',
                        md: `repeat(${Math.min(viewTypes.length, 4).toString()}, 1fr)`,
                    },
                    gap: 1.5,
                    width: '100%',
                    margin: 0,
                }}
            >
                {viewTypes.map(viewType => {
                    const IconComponent = viewType.icon;
                    return (
                        <Button
                            key={viewType.key}
                            variant="outlined"
                            size="small"
                            startIcon={<IconComponent />}
                            onClick={() => {
                                onViewTypeChange(viewType.key);
                            }}
                            sx={{
                                width: '100%',
                                color:
                                    currentViewType === viewType.key
                                        ? 'inherit' // MUI Button will handle the color inheritance
                                        : COLORS.text.secondary,
                                backgroundColor:
                                    currentViewType === viewType.key
                                        ? COLORS.primary.main
                                        : COLORS.surface.elevated,
                                '&.MuiButton-root': {
                                    color:
                                        currentViewType === viewType.key
                                            ? COLORS.text.primary
                                            : COLORS.text.secondary,
                                },
                                borderColor: COLORS.border.subtle,
                                borderWidth: '1px',
                                borderStyle: 'solid',
                                borderRadius: SPACING.borderRadius.lg,
                                minHeight: RESEARCH_STYLES.LAYOUT.BUTTON_HEIGHT,
                                padding:
                                    RESEARCH_STYLES.LAYOUT.INNER_PADDING_SM,
                                fontSize: RESEARCH_STYLES.LAYOUT.FONT_SIZE_SM,
                                fontWeight: TYPOGRAPHY.fontWeight.medium,
                                transition: ANIMATIONS.transitions.standard,
                                '&:hover': {
                                    backgroundColor:
                                        currentViewType === viewType.key
                                            ? COLORS.primary.dark
                                            : COLORS.interactive.hover,
                                    transform: 'translateY(-1px)',
                                    boxShadow: SHADOWS.sm,
                                },
                            }}
                        >
                            {viewType.label}
                        </Button>
                    );
                })}
            </Box>
        </Box>
    );
};

export default ResearchViewSelector;
