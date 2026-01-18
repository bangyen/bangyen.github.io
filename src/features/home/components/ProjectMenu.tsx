import React, { useState } from 'react';
import { Box, Menu } from '../../../components/mui';
import { TooltipButton } from '../../../components/ui/Controls';
import { ViewModuleRounded } from '../../../components/icons';
import { COLORS, SHADOWS } from '../../../config/theme';
import { ProjectDropdown } from './ProjectMenu/ProjectDropdown';

function clickHandler(setAnchor: (anchor: HTMLElement | null) => void) {
    return (event: React.MouseEvent<HTMLElement>) => {
        setAnchor(event.currentTarget);
    };
}

function closeHandler(setAnchor: (anchor: null) => void) {
    return () => {
        setAnchor(null);
    };
}

export function MenuButton(): React.ReactElement {
    const [anchor, setAnchor] = useState<HTMLElement | null>(null);
    const handleClick = clickHandler(setAnchor);
    const handleClose = closeHandler(setAnchor);
    const open = Boolean(anchor);

    const define = (value: string | undefined) => {
        return open ? value : undefined;
    };

    return (
        <Box>
            <TooltipButton
                title="Projects Menu"
                id="projects-menu-button"
                Icon={ViewModuleRounded}
                aria-controls={define('projects-menu')}
                aria-expanded={define('true')}
                aria-haspopup="true"
                onClick={handleClick}
                sx={{
                    '&:hover': {
                        backgroundColor: COLORS.interactive.hover,
                        transform: 'scale(1.05)',
                    },
                }}
            />
            <Menu
                id="projects-menu"
                open={open}
                anchorEl={anchor}
                disableAutoFocusItem={true}
                BackdropProps={{
                    sx: {
                        backgroundColor: 'transparent',
                        backdropFilter: 'none',
                    },
                }}
                sx={{
                    marginLeft: 1,
                    marginTop: 1,
                    '& .MuiPaper-root': {
                        width: 'auto',
                        maxWidth: '300px',
                        height: 'auto !important',
                        backgroundColor: COLORS.surface.glass,
                        backdropFilter: 'blur(8px)',
                        border: `1px solid ${COLORS.border.subtle}`,
                        borderRadius: '16px',
                        padding: 0,
                        boxShadow: SHADOWS.lg,
                        transition: 'all 140ms cubic-bezier(0.2, 0.8, 0.2, 1)',
                        transform: open
                            ? 'translateY(0) scale(1)'
                            : 'translateY(8px) scale(0.98)',
                        opacity: open ? 1 : 0,
                    },
                }}
                onClose={handleClose}
                MenuListProps={{
                    'aria-labelledby': 'projects-menu-button',
                    sx: {
                        padding: 0,
                        height: 'auto',
                    },
                }}
                transformOrigin={{ horizontal: 'left', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
            >
                <ProjectDropdown />
            </Menu>
        </Box>
    );
}
