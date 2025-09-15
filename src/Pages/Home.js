import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import Grid from '@mui/material/Grid2';

import { TooltipButton } from '../helpers';
import { names } from '../Interpreters';
import { useWindow } from '../hooks';
import { pages } from './';

import {
    MenuRounded,
    GitHub,
    DarkMode,
    LightMode
} from '@mui/icons-material';

import {
    Typography,
    Divider,
    Box,
    Menu,
    MenuItem,
    AppBar,
    Toolbar,
    IconButton,
    Card,
    CardContent,
    CardActions,
    Button
} from '@mui/material';

import { useTheme } from '@mui/material/styles';
import { ColorModeContext } from '../ThemeContext';

function dropdown(options, handleClose) {
    return (
        <Box>
            {Object.keys(options).map(text => (
                <MenuItem
                    key={text}
                    component={Link}
                    to={options[text]}
                    onClick={handleClose}>
                    <Typography variant='body2'>
                        {text.replace('_', ' ')}
                    </Typography>
                </MenuItem>
            ))}
        </Box>
    );
}

function Header() {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleOpen = (event) => setAnchorEl(event.currentTarget);
    const handleClose = () => setAnchorEl(null);
    const theme = useTheme();
    const colorMode = useContext(ColorModeContext);

    return (
        <>
            <AppBar position='static' color='transparent' elevation={0}>
                <Toolbar>
                    <IconButton
                        id='navigation-menu-button'
                        size='large'
                        edge='start'
                        color='inherit'
                        aria-label='open navigation menu'
                        onClick={handleOpen}>
                        <MenuRounded />
                    </IconButton>
                    <Typography variant='h6' sx={{ flexGrow: 1 }}>
                        Bangyen
                    </Typography>
                    <TooltipButton
                        href='https://github.com/bangyen'
                        title='GitHub'
                        aria-label='GitHub'
                        Icon={GitHub} />
                    <TooltipButton
                        title='Toggle light/dark mode'
                        aria-label='toggle color mode'
                        Icon={theme.palette.mode === 'dark' ? LightMode : DarkMode}
                        onClick={colorMode.toggleColorMode} />
                </Toolbar>
            </AppBar>
            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{ 'aria-labelledby': 'navigation-menu-button' }}>
                {dropdown(pages, handleClose)}
                <Divider />
                {dropdown(names, handleClose)}
            </Menu>
        </>
    );
}

function WaveBox({
        index,
        count,
        height,
        width
    }) {
    const theme = useTheme();
    const duration = 1;
    const delay = 5 * index / count;

    height = `${height}rem`;
    width = `${width}rem`;

    const animation = `wave ${duration}s ${delay}s ease-in-out infinite alternate`;

    const keyframes = {
        '0%': { transform: 'translateY(0)' },
        '100%': { transform: 'translateY(-2rem)' }
    };

    return (
        <Box
            height={height}
            width={width}
            borderRadius={0.5}
            sx={{
                animation,
                backgroundColor: theme.palette.primary.light,
                '@keyframes wave': keyframes
            }}
        />
    );
}

export default function Home() {
    const theme = useTheme();
    const { width } = useWindow();
    const date = Date.now();

    const count = 125;
    const boxHeight = 1.5;
    const boxWidth = width / (16 * count);

    useEffect(() => {
        document.title = 'Home | Bangyen';
    }, []);

    const projects = [
        {
            title: 'Lights Out',
            description: 'Puzzle game built with React.',
            link: pages.Lights_Out,
        },
        {
            title: 'Snake',
            description: 'Classic Snake game built with React.',
            link: pages.Snake,
        },
    ];

    return (
        <Box
            sx={{
                minHeight: '100vh',
                position: 'relative',
                background: `linear-gradient(135deg, ${theme.palette.primary.dark}, ${theme.palette.background.default})`,
                pb: 10,
            }}
        >
            <Header />
            <Box
                display='flex'
                flexDirection='column'
                alignItems='center'
                justifyContent='center'
                minHeight='40vh'
                textAlign='center'
                mt={4}
            >
                <Typography
                    component='h1'
                    sx={{
                        typography: {
                            xs: 'h6',
                            sm: 'h4',
                            md: 'h3',
                            lg: 'h2',
                            xl: 'h1',
                        },
                    }}
                >
                    Hey, my name is&nbsp;
                    <strong>Bangyen</strong>.
                </Typography>
            </Box>
            <Grid container spacing={2} justifyContent='center' padding={2}>
                {projects.map((project) => (
                    <Grid key={project.title} size={{ xs: 12, sm: 6, md: 4 }}>
                        <Card sx={{ height: '100%' }}>
                            <CardContent>
                                <Typography variant='h6' component='h3'>
                                    {project.title}
                                </Typography>
                                <Typography variant='body2' color='text.secondary'>
                                    {project.description}
                                </Typography>
                            </CardContent>
                            <CardActions>
                                <Button size='small' component={Link} to={project.link}>
                                    Explore
                                </Button>
                            </CardActions>
                        </Card>
                    </Grid>
                ))}
            </Grid>
            <Box
                left='50%'
                bottom='0'
                width='100%'
                display='flex'
                position='absolute'
                sx={{ transform: 'translateX(-50%)', opacity: 0.3 }}
            >
                {[...Array(count)].map((_, index) => (
                    <WaveBox
                        index={index}
                        count={count}
                        key={date + index}
                        height={boxHeight}
                        width={boxWidth}
                    />
                ))}
            </Box>
        </Box>
    );
}

