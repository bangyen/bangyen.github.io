import { Box } from '@mui/material';
import React from 'react';

import {
    CloseRounded,
    ContentCopyRounded,
    DeleteRounded,
} from '@/components/icons';
import { TooltipButton } from '@/components/ui/TooltipButton';
import { COLORS, LAYOUT } from '@/config/theme';

interface GhostControlsProps {
    onCopy?: () => void;
    onClear?: () => void;
    onClose?: () => void;
}

export const GhostControls: React.FC<GhostControlsProps> = ({
    onCopy,
    onClear,
    onClose,
}) => {
    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                gap: 2,
                position: 'absolute',
                bottom: -90,
                left: 0,
                right: 0,
                pointerEvents: 'auto',
                zIndex: LAYOUT.zIndex.base + 5,
                paddingBottom: 2,
            }}
        >
            <TooltipButton
                title="Copy Board"
                Icon={ContentCopyRounded}
                onClick={onCopy}
                sx={{
                    backgroundColor: COLORS.interactive.selected,
                    color: COLORS.primary.main,
                    '&:hover': {
                        backgroundColor: COLORS.interactive.focus,
                    },
                }}
            />
            <TooltipButton
                title="Clear Calculator"
                Icon={DeleteRounded}
                onClick={onClear}
                sx={{
                    backgroundColor: 'rgba(255, 68, 68, 0.1)',
                    color: COLORS.data.red,
                    '&:hover': {
                        backgroundColor: 'rgba(255, 68, 68, 0.2)',
                    },
                }}
            />
            <TooltipButton
                title="Close Calculator"
                Icon={CloseRounded}
                onClick={onClose}
                sx={{
                    backgroundColor: 'rgba(255, 193, 7, 0.1)',
                    color: COLORS.data.amber,
                    '&:hover': {
                        backgroundColor: 'rgba(255, 193, 7, 0.2)',
                    },
                }}
            />
        </Box>
    );
};
