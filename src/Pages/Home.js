import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Grid from '@mui/material/Grid2';

import { TooltipButton } from '../helpers';
import { names } from '../Interpreters';
import { pages } from './';

import {
    MenuRounded,
    GitHub,
    Code,
    Cloud,
    Psychology,
    Work,
    LocationOn,
    OpenInNew,
} from '@mui/icons-material';

import {
    Typography,
    Divider,
    Box,
    Menu,
    MenuItem,
    Chip,
    Fade,
} from '@mui/material';

function dropdown(name, options) {
    const padHeight = '1rem';
    const padWidth = '1.5rem';

    return (
        <Box>
            {Object.keys(options).map(text => (
                <MenuItem
                    sx={{
                        paddingBottom: padHeight,
                        paddingTop: padHeight,
                        paddingLeft: padWidth,
                        paddingRight: padWidth,
                        borderRadius: 2,
                        margin: '4px 8px',
                        transition: 'all 0.2s ease-in-out',
                        '&:hover': {
                            backgroundColor: 'rgba(255, 255, 255, 0.1)',
                            transform: 'translateX(4px)',
                        },
                    }}
                    key={text}
                    component={Link}
                    to={text.toLowerCase()}
                >
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {text.replace('_', ' ')}
                    </Typography>
                </MenuItem>
            ))}
        </Box>
    );
}

function clickHandler(setAnchor) {
    return event => {
        setAnchor(event.currentTarget);
    };
}

function closeHandler(setAnchor) {
    return () => {
        setAnchor(null);
    };
}

function MenuButton({ children }) {
    const [anchor, setAnchor] = useState(null);
    const handleClick = clickHandler(setAnchor);
    const handleClose = closeHandler(setAnchor);
    const open = Boolean(anchor);

    const define = value => {
        return open ? value : undefined;
    };

    return (
        <Box>
            <TooltipButton
                title="Menu"
                id="basic-button"
                Icon={MenuRounded}
                aria-controls={define('basic-menu')}
                aria-expanded={define('true')}
                aria-haspopup="true"
                onClick={handleClick}
            />
            <Menu
                id="basic-menu"
                open={open}
                anchorEl={anchor}
                sx={{
                    marginLeft: 1,
                    marginTop: 1,
                    '& .MuiPaper-root': {
                        borderRadius: 3,
                        backdropFilter: 'blur(20px)',
                        backgroundColor: 'rgba(26, 26, 26, 0.9)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                    },
                }}
                onClose={handleClose}
                MenuListProps={{
                    'aria-labelledby': 'basic-button',
                    sx: { padding: 1 },
                }}
            >
                {children}
            </Menu>
        </Box>
    );
}

export default function Home() {
    useEffect(() => {
        document.title = 'Bangyen Pham - Backend Developer & AI/ML Engineer';
    }, []);

    return (
        <Grid
            container
            height="100vh"
            flexDirection="column"
            sx={{ position: 'relative', overflow: 'hidden' }}
        >
            {/* Background Elements */}
            <Box
                sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background:
                        'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0f0f0f 100%)',
                    zIndex: -2,
                }}
            />

            {/* Navigation */}
            <Grid
                container
                direction="row"
                margin={3}
                spacing={2}
                sx={{ zIndex: 1 }}
            >
                <MenuButton>
                    {dropdown('Miscellaneous', pages)}
                    <Divider
                        variant="middle"
                        sx={{
                            margin: '8px 0',
                            backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        }}
                    />
                    {dropdown('Interpreters', names)}
                </MenuButton>
                <TooltipButton
                    href="https://github.com/bangyen"
                    title="GitHub"
                    Icon={GitHub}
                />
            </Grid>

            {/* Hero Section */}
            <Grid
                flex={1}
                display="flex"
                justifyContent="center"
                alignItems="center"
                flexDirection="column"
                sx={{ zIndex: 1 }}
            >
                <Fade in timeout={1000}>
                    <Box
                        sx={{
                            textAlign: 'center',
                            maxWidth: '800px',
                            padding: '0 2rem',
                        }}
                    >
                        <Typography
                            variant="h1"
                            sx={{
                                background:
                                    'linear-gradient(135deg, #ffffff, #808080)',
                                backgroundClip: 'text',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                fontWeight: 700,
                                marginBottom: 2,
                                fontSize: {
                                    xs: '2.5rem',
                                    sm: '3.5rem',
                                    md: '4rem',
                                },
                            }}
                        >
                            Hey, I&apos;m Bangyen
                        </Typography>

                        <Typography
                            variant="h5"
                            sx={{
                                color: 'text.secondary',
                                marginBottom: 2,
                                fontWeight: 400,
                                fontSize: { xs: '1.1rem', sm: '1.3rem' },
                            }}
                        >
                            Backend Developer & AI/ML Engineer
                        </Typography>

                        <Typography
                            variant="h6"
                            sx={{
                                color: 'text.secondary',
                                marginBottom: 4,
                                fontWeight: 300,
                                fontSize: { xs: '0.9rem', sm: '1rem' },
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: 1,
                            }}
                        >
                            <LocationOn fontSize="small" />
                            Chicago, IL
                        </Typography>

                        {/* Technical Skills */}
                        <Box
                            sx={{
                                display: 'grid',
                                gridTemplateColumns: {
                                    xs: '1fr',
                                    sm: 'repeat(2, 1fr)',
                                    md: 'repeat(3, 1fr)',
                                },
                                gap: 2,
                                justifyContent: 'center',
                                marginBottom: 4,
                                maxWidth: '600px',
                                margin: '0 auto 2rem auto',
                            }}
                        >
                            <Chip
                                icon={<Code />}
                                label="Python"
                                variant="outlined"
                                size="large"
                                sx={{
                                    borderColor: 'rgba(255, 255, 255, 0.3)',
                                    color: 'primary.light',
                                    padding: '12px 16px',
                                    height: '48px',
                                    fontSize: '1rem',
                                    '&:hover': {
                                        backgroundColor:
                                            'rgba(255, 255, 255, 0.1)',
                                    },
                                    '& .MuiChip-icon': {
                                        marginLeft: '12px',
                                        marginRight: '8px',
                                    },
                                }}
                            />
                            <Chip
                                icon={<Psychology />}
                                label="PyTorch"
                                variant="outlined"
                                size="large"
                                sx={{
                                    borderColor: 'rgba(255, 255, 255, 0.3)',
                                    color: 'primary.light',
                                    padding: '12px 16px',
                                    height: '48px',
                                    fontSize: '1rem',
                                    '&:hover': {
                                        backgroundColor:
                                            'rgba(255, 255, 255, 0.1)',
                                    },
                                    '& .MuiChip-icon': {
                                        marginLeft: '12px',
                                        marginRight: '8px',
                                    },
                                }}
                            />
                            <Chip
                                icon={<Cloud />}
                                label="AWS/GCP"
                                variant="outlined"
                                size="large"
                                sx={{
                                    borderColor: 'rgba(255, 255, 255, 0.3)',
                                    color: 'primary.light',
                                    padding: '12px 16px',
                                    height: '48px',
                                    fontSize: '1rem',
                                    '&:hover': {
                                        backgroundColor:
                                            'rgba(255, 255, 255, 0.1)',
                                    },
                                    '& .MuiChip-icon': {
                                        marginLeft: '12px',
                                        marginRight: '8px',
                                    },
                                }}
                            />
                            <Chip
                                icon={<Work />}
                                label="Docker"
                                variant="outlined"
                                size="large"
                                sx={{
                                    borderColor: 'rgba(255, 255, 255, 0.3)',
                                    color: 'primary.light',
                                    padding: '12px 16px',
                                    height: '48px',
                                    fontSize: '1rem',
                                    '&:hover': {
                                        backgroundColor:
                                            'rgba(255, 255, 255, 0.1)',
                                    },
                                    '& .MuiChip-icon': {
                                        marginLeft: '12px',
                                        marginRight: '8px',
                                    },
                                }}
                            />
                            <Chip
                                icon={<Code />}
                                label="C/C++"
                                variant="outlined"
                                size="large"
                                sx={{
                                    borderColor: 'rgba(255, 255, 255, 0.3)',
                                    color: 'primary.light',
                                    padding: '12px 16px',
                                    height: '48px',
                                    fontSize: '1rem',
                                    '&:hover': {
                                        backgroundColor:
                                            'rgba(255, 255, 255, 0.1)',
                                    },
                                    '& .MuiChip-icon': {
                                        marginLeft: '12px',
                                        marginRight: '8px',
                                    },
                                }}
                            />
                            <Chip
                                icon={<Psychology />}
                                label="TensorFlow"
                                variant="outlined"
                                size="large"
                                sx={{
                                    borderColor: 'rgba(255, 255, 255, 0.3)',
                                    color: 'primary.light',
                                    padding: '12px 16px',
                                    height: '48px',
                                    fontSize: '1rem',
                                    '&:hover': {
                                        backgroundColor:
                                            'rgba(255, 255, 255, 0.1)',
                                    },
                                    '& .MuiChip-icon': {
                                        marginLeft: '12px',
                                        marginRight: '8px',
                                    },
                                }}
                            />
                        </Box>

                        {/* Professional Highlights */}
                        <Box
                            sx={{
                                marginTop: 6,
                                maxWidth: '900px',
                                textAlign: 'left',
                            }}
                        >
                            <Typography
                                variant="h6"
                                sx={{
                                    color: 'primary.light',
                                    marginBottom: 3,
                                    textAlign: 'center',
                                    fontWeight: 600,
                                }}
                            >
                                Research Publications
                            </Typography>

                            <Box
                                sx={{
                                    display: 'grid',
                                    gridTemplateColumns: {
                                        xs: '1fr',
                                        md: '1fr 1fr',
                                    },
                                    gap: 3,
                                }}
                            >
                                <Box
                                    component="a"
                                    href="https://ieeexplore.ieee.org/document/10319968"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    sx={{
                                        padding: 2,
                                        backgroundColor:
                                            'rgba(128, 128, 128, 0.05)',
                                        borderRadius: 2,
                                        border: '1px solid rgba(128, 128, 128, 0.2)',
                                        textDecoration: 'none',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s ease-in-out',
                                        '&:hover': {
                                            backgroundColor:
                                                'rgba(128, 128, 128, 0.1)',
                                            transform: 'translateY(-2px)',
                                        },
                                    }}
                                >
                                    <Typography
                                        variant="subtitle2"
                                        sx={{
                                            color: 'secondary.light',
                                            fontWeight: 600,
                                            marginBottom: 1,
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 1,
                                        }}
                                    >
                                        Generalized Collective Algorithms for
                                        the Exascale Era
                                        <OpenInNew fontSize="small" />
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        sx={{ color: 'text.secondary' }}
                                    >
                                        Introduced novel framework for exascale
                                        collective algorithms, reducing
                                        communication overhead by 30% and
                                        latency by 20%
                                    </Typography>
                                </Box>

                                <Box
                                    component="a"
                                    href="https://ieeexplore.ieee.org/document/10793131"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    sx={{
                                        padding: 2,
                                        backgroundColor:
                                            'rgba(128, 128, 128, 0.05)',
                                        borderRadius: 2,
                                        border: '1px solid rgba(128, 128, 128, 0.2)',
                                        textDecoration: 'none',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s ease-in-out',
                                        '&:hover': {
                                            backgroundColor:
                                                'rgba(128, 128, 128, 0.1)',
                                            transform: 'translateY(-2px)',
                                        },
                                    }}
                                >
                                    <Typography
                                        variant="subtitle2"
                                        sx={{
                                            color: 'secondary.light',
                                            fontWeight: 600,
                                            marginBottom: 1,
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 1,
                                        }}
                                    >
                                        Revisiting Computation for Research:
                                        Practices and Trends
                                        <OpenInNew fontSize="small" />
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        sx={{ color: 'text.secondary' }}
                                    >
                                        Interviewed 138 researchers across
                                        multiple institutions using thematic
                                        analysis to uncover evolving
                                        computational research practices
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>

                        {/* Projects Section */}
                        <Box
                            sx={{
                                marginTop: 6,
                                maxWidth: '900px',
                                textAlign: 'left',
                            }}
                        >
                            <Typography
                                variant="h6"
                                sx={{
                                    color: 'primary.light',
                                    marginBottom: 3,
                                    textAlign: 'center',
                                    fontWeight: 600,
                                }}
                            >
                                Featured Projects
                            </Typography>

                            <Box
                                sx={{
                                    display: 'grid',
                                    gridTemplateColumns: {
                                        xs: '1fr',
                                        md: '1fr 1fr',
                                    },
                                    gap: 3,
                                }}
                            >
                                <Box
                                    component="a"
                                    href="https://github.com/bangyen/zsharp"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    sx={{
                                        padding: 2,
                                        backgroundColor:
                                            'rgba(128, 128, 128, 0.05)',
                                        borderRadius: 2,
                                        border: '1px solid rgba(128, 128, 128, 0.2)',
                                        textDecoration: 'none',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s ease-in-out',
                                        '&:hover': {
                                            backgroundColor:
                                                'rgba(128, 128, 128, 0.1)',
                                            transform: 'translateY(-2px)',
                                        },
                                    }}
                                >
                                    <Typography
                                        variant="subtitle2"
                                        sx={{
                                            color: 'secondary.light',
                                            fontWeight: 600,
                                            marginBottom: 1,
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 1,
                                        }}
                                    >
                                        ZSharp — Sharpness-Aware Minimization
                                        <GitHub fontSize="small" />
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        sx={{ color: 'text.secondary' }}
                                    >
                                        Developed PyTorch implementation with
                                        Apple Silicon optimization, delivering
                                        +5.2% accuracy over SGD and 4.4×
                                        training speedup
                                    </Typography>
                                </Box>

                                <Box
                                    component="a"
                                    href="https://github.com/bangyen/muon"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    sx={{
                                        padding: 2,
                                        backgroundColor:
                                            'rgba(128, 128, 128, 0.05)',
                                        borderRadius: 2,
                                        border: '1px solid rgba(128, 128, 128, 0.2)',
                                        textDecoration: 'none',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s ease-in-out',
                                        '&:hover': {
                                            backgroundColor:
                                                'rgba(128, 128, 128, 0.1)',
                                            transform: 'translateY(-2px)',
                                        },
                                    }}
                                >
                                    <Typography
                                        variant="subtitle2"
                                        sx={{
                                            color: 'secondary.light',
                                            fontWeight: 600,
                                            marginBottom: 1,
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 1,
                                        }}
                                    >
                                        Muon Optimizer — Accelerating Grokking
                                        <GitHub fontSize="small" />
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        sx={{ color: 'text.secondary' }}
                                    >
                                        Implemented and validated the Muon
                                        Optimizer paper, confirming 33% faster
                                        grokking vs AdamW on benchmark tasks
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                </Fade>
            </Grid>

            {/* Clean background without animation */}
        </Grid>
    );
}
