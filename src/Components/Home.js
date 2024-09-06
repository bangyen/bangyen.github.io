import Grid from       '@mui/material/Grid2';

import {
    CircleRounded,
    MenuRounded,
    HomeRounded,
    GitHub
} from '@mui/icons-material';

import {
    Typography,
    IconButton,
    Divider,
    Box,
    Menu,
    MenuItem
} from '@mui/material';

import { Link } from 'react-router-dom';
import React, { useState, useEffect } from 'react';

import { names } from './Interpreters';
import { useSize } from './helpers2';
import { CustomButton } from './Interpreters/Editor';
import { pages } from './';

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
                <CircleRounded sx={{
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

function MenuButton({children}) {
    const [anchor, setAnchor] = useState(null);
    const handleClick = clickHandler(setAnchor);
    const handleClose = closeHandler(setAnchor);
    const open        = Boolean(anchor);

    const define = (value) => {
        return open ? value : undefined;
    };

    return (
        <Box>
            <CustomButton
                title='Menu'
                id='basic-button'
                Icon={MenuRounded}
                aria-controls={define('basic-menu')}
                aria-expanded={define('true')}
                aria-haspopup='true'
                onClick={handleClick} />
            <Menu
                id='basic-menu'
                open={open}
                anchorEl={anchor}
                onClose={handleClose}
                MenuListProps={{
                    sx: {width: 140},
                    'aria-labelledby': 'basic-button'
                }}>
                {children}
            </Menu>
        </Box>
    );
}

export default function Home() {
    const { width } = useSize();
    const size      = width + 100;
    const number    = 5;

    useEffect(() => {
        document.title
            = 'Home | Bangyen';
    }, []);

    return (
        <Grid container
            height="100vh">
            <Grid container
                direction="column"
                margin={2}
                spacing={2}>
                <MenuButton>
                    {dropdown('Interpreters', names)}
                    <Divider variant='middle' />
                    {dropdown('Miscellaneous', pages)}
                </MenuButton>
                <CustomButton
                    href='https://github.com/bangyen'
                    title='GitHub'
                    Icon={GitHub} />
            </Grid>
            <Grid
                size="grow"
                display='flex'
                marginRight={8}
                justifyContent='center'
                alignItems='center'>
                <Typography sx={{
                        typography: {
                            xs: 'h5',
                            sm: 'h4',
                            md: 'h3'
                        }
                    }}>
                    {'Hey, my name is '}
                    <Box display='inline'
                        fontWeight='bold'>
                        Bangyen
                    </Box>
                    .
                </Typography>
                {getCircles(number, size)}
            </Grid>
        </Grid>
    );
}

