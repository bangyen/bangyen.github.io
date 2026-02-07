import React from 'react';
import { Box, SxProps, Theme } from '@mui/material';
import { EmojiEventsRounded } from '../../../components/icons';

interface GameBoardProps {
    children: React.ReactNode;
    showTrophy: boolean;
    onReset: () => void;
    size: number;
    iconSizeRatio?: number;
    primaryColor: string;
    secondaryColor: string;
    useSecondaryTrophy?: boolean;
    sx?: SxProps<Theme>;
}

export function GameBoard({
    children,
    showTrophy,
    onReset,
    size,
    iconSizeRatio = 1.0,
    primaryColor,
    secondaryColor,
    useSecondaryTrophy = false,
    sx,
}: GameBoardProps) {
    return (
        <Box
            sx={[
                {
                    position: 'relative',
                    width: 'fit-content',
                },
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                ...(Array.isArray(sx) ? sx : [sx]),
            ]}
        >
            {children}
            <Box
                onClick={onReset}
                sx={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    opacity: showTrophy ? 1 : 0,
                    transform: showTrophy ? 'scale(1)' : 'scale(0.5)',
                    visibility: showTrophy ? 'visible' : 'hidden',
                    transition: 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
                    cursor: 'pointer',
                    zIndex: 10,
                    backgroundColor: 'transparent',
                }}
            >
                <EmojiEventsRounded
                    sx={{
                        fontSize: `${(size * iconSizeRatio).toString()}rem`,
                        color: useSecondaryTrophy
                            ? secondaryColor
                            : primaryColor,
                        filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.1))',
                    }}
                />
            </Box>
        </Box>
    );
}
