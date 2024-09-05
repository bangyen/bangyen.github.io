import CircleRoundedIcon from '@mui/icons-material/CircleRounded';
import RemoveRoundedIcon from '@mui/icons-material/RemoveRounded';
import GitHubIcon from '@mui/icons-material/GitHub';
import MenuRoundedIcon from   '@mui/icons-material/MenuRounded';
import AddRoundedIcon from    '@mui/icons-material/AddRounded';
import Grid from       '@mui/material/Grid2';

import {
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
                    <Typography
                        variant='body2'
                        sx={{padding: 0.5}}>
                    {text.replace('_', ' ')}
                    </Typography>
                </MenuItem>
            )}
        </div>
    );
}


function getCircles(num, size) {
    const left   = size / 3;
    const right  = left * 2;
    const height = size / 5;
    const speed  = size / 400;
    const offset = height / 2;

    return (
        <Box sx={{overflow: 'hidden'}}>
            {[...Array(num).keys()].map(n =>
                <CircleRoundedIcon sx={{
                    offsetPath: `path("      \
                        M0,        0         \
                        C${left},  ${height} \
                        ${right}, -${height} \
                        ${size},   0         \
                    ")`,
                    animation: `
                        ${speed}s
                        linear
                        ${n / 10}s
                        infinite
                        alternate
                        ball
                    `,
                    position:  'fixed',
                    bottom:    offset,
                    left:      -50,
                    '@keyframes ball': {
                        '0%':   {offsetDistance:   '0%'},
                        '100%': {offsetDistance: '100%'}
                    },
                }}/>
            )}
        </Box>
    );
}


export default function Home() {
    const [anchor, setAnchor] = React.useState(null);
    const [number, setNumber] = React.useState(5);
    const { width } = useSize();
    const size  = width + 100;

    document.title = 'Home | Bangyen';
    const open = Boolean(anchor);

    const handleClick = event => {
        setAnchor(event.currentTarget);
    };

    const handleClose = () => {
        setAnchor(null);
    };

    return (
        <div>
            {getCircles(number, size)}
            <IconButton
                    id='basic-button'
                    sx={{position: 'fixed', top: 20, left: 20}}
                    aria-controls={open ? 'basic-menu' : undefined}
                    aria-expanded={open ? 'true' : undefined}
                    aria-haspopup='true'
                    onClick={handleClick}>
                <MenuRoundedIcon />
            </IconButton>
            <IconButton
                    sx={{position: 'fixed', top: 70, left: 20}}
                    onClick={() => {setNumber(number + 1)}}>
                <AddRoundedIcon />
            </IconButton>
            <IconButton
                    sx={{position: 'fixed', top: 120, left: 20}}
                    onClick={() => {setNumber(number - 1)}}>
                <RemoveRoundedIcon />
            </IconButton>
            <IconButton
                    href='https://github.com/bangyen'
                    sx={{position: 'fixed', top: 170, left: 20}}>
                <GitHubIcon />
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
                    <Typography sx={{fontFamily: 'monospace'}} variant='h2'>
                        {'Hey, my name is '}
                        <Box display='inline' fontWeight='bold'>
                            Bangyen
                        </Box>
                        .
                    </Typography>
                </Grid>
            </Grid>
        </div>
    );
}

