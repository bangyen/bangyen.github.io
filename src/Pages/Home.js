import Grid from '@mui/material/Grid2';

import {
    MenuRounded,
    GitHub
} from '@mui/icons-material';

import {
    Typography,
    Divider,
    Box,
    Menu,
    MenuItem
} from '@mui/material';

import { Link } from 'react-router-dom';
import React, { useState, useEffect } from 'react';

import { names } from '../Interpreters';
import { TooltipButton } from '../helpers';
import { useWindow } from '../hooks';
import { pages } from './';

function dropdown(name, options) {
    return (
        <Box>
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
            <TooltipButton
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

function WaveBox({
        index,
        count,
        height,
        width
    }) {
    const duration = 150 / count;
    const delay    = (index % count)
        / count * 5;

    height = `${height}rem`;
    width  = `${width}rem`;

    const animation = `
        wave
        ${duration}s
        ${delay}s
        ease-in-out
        infinite
        alternate
    `;

    const keyframes = {
        '0%': {transform:
            'translateY(0)'},
        '100%': {transform:
            'translateY(-5rem)'}
    };

    return (
        <Box
            height={height}
            width={width}
            backgroundColor='white'
            sx={{
                animation,
                '@keyframes wave':
                    keyframes
            }}>
        </Box>
    );
}

export default function Home() {
    const { width } = useWindow();
    const date      = Date.now();
    const boxHeight = 1.5;
    const boxWidth  = 0.5;
    
    const count     = Math.ceil(
        width / (16 * boxWidth));

    useEffect(() => {
        document.title
            = 'Home | Bangyen';
    }, []);

    return (
        <Grid
            container
            height="100vh">
            <Grid
                container
                direction="column"
                margin={2}
                spacing={2}>
                <MenuButton>
                    {dropdown('Interpreters', names)}
                    <Divider variant='middle' />
                    {dropdown('Miscellaneous', pages)}
                </MenuButton>
                <TooltipButton
                    href='https://github.com/bangyen'
                    title='GitHub'
                    Icon={GitHub} />
            </Grid>
            <Grid
                size="grow"
                display='flex'
                flexDirection='column'>
                <Grid
                    flex={1}
                    display='flex'
                    marginRight={8}
                    justifyContent='center'
                    alignItems='center'>
                    <Typography sx={{
                            typography: {
                                xs: 'body1',
                            sm: 'h5',
                            md: 'h4',
                                lg: 'h3',
                                xl: 'h2'
                            }
                        }}>
                        Hey, my name is&nbsp;
                        <strong>
                            Bangyen
                        </strong>
                        .
                    </Typography>
                </Grid>
                <Grid
                    left='50%'
                    bottom='10%'
                    width='100%'
                    display='flex'
                    position='absolute'
                    sx={{
                        transform:
                            'translateX(-50%)'
                    }}>
                    {[...Array(count)]
                        .map((_, index) => (
                            <WaveBox
                                index={index}
                                count={count}
                                key={date + index}
                                height={boxHeight}
                                width={boxWidth} />
                    ))}
                </Grid>
            </Grid>
        </Grid>
    );
}

