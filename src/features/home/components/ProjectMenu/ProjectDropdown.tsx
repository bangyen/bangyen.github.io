import React from 'react';
import { Link } from 'react-router-dom';
import { Box, MenuItem, Typography } from '../../../../components/mui';
import { COLORS } from '../../../../config/theme';
import { PROJECT_CATEGORIES } from '../data';

export function ProjectDropdown(): React.ReactElement {
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
