import { Button, Box } from '@mui/material';
import React from 'react';

import {
    selectorContainerSx,
    getGridSx,
    getButtonSx,
} from './ResearchViewSelector.styles';
import { useListNavigation } from '../hooks/useListNavigation';
import type { ViewType } from '../types';

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
