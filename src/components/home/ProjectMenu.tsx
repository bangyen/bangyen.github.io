import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Box, Menu, MenuItem, Typography } from '../mui';
import { TooltipButton } from '../common/Controls';
import { ViewModuleRounded, ArrowForward } from '../icons';
import { COLORS, SHADOWS } from '../../config/theme';
import { PROJECT_CATEGORIES } from './data';

function ProjectDropdown(): React.ReactElement {
    return (
        <Box sx={{ padding: '16px 16px 0 16px' }}>
            {Object.entries(PROJECT_CATEGORIES).map(
                ([categoryKey, category]) => {
                    const IconComponent = category.icon;
                    return (
                        <Box key={categoryKey} sx={{ marginBottom: 2 }}>
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1,
                                    padding: '8px 0 4px 0',
                                    marginBottom: 0.5,
                                    position: 'relative',
                                    '&::after': {
                                        content: '""',
                                        position: 'absolute',
                                        bottom: 0,
                                        left: 0,
                                        right: 0,
                                        height: '1px',
                                        backgroundColor:
                                            COLORS.interactive.disabled,
                                    },
                                }}
                            >
                                <IconComponent
                                    sx={{
                                        color: COLORS.primary.main,
                                        fontSize: '14px',
                                        opacity: 0.7,
                                    }}
                                />
                                <Typography
                                    sx={{
                                        color: COLORS.text.secondary,
                                        fontSize: '10px',
                                        fontWeight: 500,
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.14em',
                                        fontFamily:
                                            'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
                                    }}
                                >
                                    {category.title}
                                </Typography>
                            </Box>

                            {Object.entries(category.projects).map(
                                ([projectName, project]) => (
                                    <MenuItem
                                        key={projectName}
                                        component={Link}
                                        to={project.path}
                                        sx={{
                                            padding: '10px 12px',
                                            borderRadius: '8px',
                                            margin: '0',
                                            minHeight: '40px',
                                            transition: 'all 120ms ease',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'flex-start',
                                            gap: '6px',
                                            '&:hover': {
                                                backgroundColor:
                                                    COLORS.interactive.hover,
                                                transform: 'translateY(-1px)',
                                            },
                                            '&:active': {
                                                backgroundColor:
                                                    COLORS.interactive.selected,
                                            },
                                            '&:focus-visible': {
                                                outline: 'none',
                                                ring: `1px solid ${COLORS.interactive.focus}`,
                                                ringOffset: '0',
                                            },
                                        }}
                                    >
                                        <Typography
                                            sx={{
                                                fontWeight: 600,
                                                fontSize: '15px',
                                                lineHeight: 1.6,
                                                color: COLORS.text.primary,
                                            }}
                                        >
                                            {projectName.replace('_', ' ')}
                                        </Typography>
                                        <Typography
                                            sx={{
                                                color: COLORS.text.secondary,
                                                fontSize: '12px',
                                                lineHeight: 1.4,
                                            }}
                                        >
                                            {project.description}
                                        </Typography>
                                    </MenuItem>
                                )
                            )}
                        </Box>
                    );
                }
            )}
        </Box>
    );
}

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
