import { ThemeProvider, createTheme } from '@mui/material/styles';
import CircleIcon from '@mui/icons-material/Circle';
import MenuIcon from '@mui/icons-material/Menu';
import Grid from '@mui/material/Grid2';
import {
    CssBaseline,
    Typography,
    IconButton,
    Divider,
    Box,
    Menu,
    MenuItem
} from '@mui/material';

import { Link } from 'react-router-dom';
import React from 'react';

import { names } from './Interpreters';
import { pages } from './';

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
    },
    typography: {
        fontFamily: 'Helvetica',
    },
});


function getSize() {
    const {
        innerWidth:  width,
        innerHeight: height
    } = window;

    return {width, height};
}


function useSize() {
    const [size, setSize]
        = React.useState(getSize());

    React.useEffect(() => {
        function handleResize() {
            setSize(getSize());
        }

        window.addEventListener(
            'resize', handleResize
        );

        return () => window.removeEventListener(
            'resize', handleResize
        );
    }, []);

    return size;
}


function dropdown(name, options) {
    return (
        <div>
            {Object.keys(options).map(text =>
                <MenuItem
                        key={text}
                        component={Link}
                        sx={{justifyContent: 'center'}}
                        to={text.toLowerCase()}>
                    <Typography variant='body2' sx={{padding: 0.5}}>
                    {text.replace('_', ' ')}
                    </Typography>
                </MenuItem>
            )}
        </div>
    );
}


export default function Home() {
    const [anchor, setAnchor] = React.useState(null);
    const { width } = useSize();
    const size  = width + 100;
    const left  = size / 3;
    const right = left * 2;

    document.title = 'Home | Bangyen';
    const open = Boolean(anchor);

    const handleClick = event => {
        setAnchor(event.currentTarget);
    };

    const handleClose = () => {
        setAnchor(null);
    };

    return (
        <ThemeProvider theme={darkTheme}>
            <CssBaseline />
            <Box sx={{overflow: 'hidden'}}>
                <CircleIcon sx={{
                    offsetPath: `path("M0,0 C${left},300 ${right},-300 ${size},0")`,
                    animation: '3s linear 0s infinite alternate ball',
                    position:  'fixed',
                    bottom:    100,
                    left:      -50,
                    '@keyframes ball': {
                        '0%':   {offsetDistance:   '0%'},
                        '100%': {offsetDistance: '100%'},
                        // '0%':   {transform: 'translateX(-2vw)'},
                        // '100%': {transform: 'translateX(102vw)'}
                    },
                }}/>
            </Box>
            <IconButton
                    id='basic-button'
                    sx={{position: 'fixed', top: 20, left: 20}}
                    aria-controls={open ? 'basic-menu' : undefined}
                    aria-expanded={open ? 'true' : undefined}
                    aria-haspopup='true'
                    onClick={handleClick}>
                <MenuIcon />
            </IconButton>
            <Menu
                    id='basic-menu'
                    open={open}
                    anchorEl={anchor}
                    onClose={handleClose}
                    MenuListProps={{
                        sx: {width: 140},
                        'aria-labelledby': 'basic-button',
                    }}>
                {dropdown('Interpreters', names)}
                <Divider variant='middle' />
                {dropdown('Miscellaneous', pages)}
            </Menu>
            <Grid   container
                    spacing={2}
                    direction='column'
                    alignItems='center'
                    justifyContent='center'
                    sx={{minHeight: '100vh'}}>
                <Grid
                        display='flex'
                        direction='row'
                        alignItems='center'
                        justifyContent='center'
                        size={{xs: 4, sm: 6, md: 10}}>
                    <Typography variant='h1'>
                        <Box display={{xs: 'none', md: 'block'}}>
                            {'Hey, my name is '}
                        </Box>
                        <Box display='inline' fontWeight='bold'>
                            Bangyen
                        </Box>
                        .
                    </Typography>
                </Grid>
            </Grid>
        </ThemeProvider>
    );
}

