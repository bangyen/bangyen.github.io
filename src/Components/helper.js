import {BsHouse} from 'react-icons/bs';
import {Link} from 'react-router-dom';
import React from 'react';
import {
    BsCaretUp,
    BsCaretDown,
    BsCaretLeft,
    BsCaretRight,
    BsArrowsAngleContract
} from 'react-icons/bs';

import Tooltip from '@mui/material/Tooltip';
import Grid    from '@mui/material/Grid2';
import {
    Typography,
    IconButton
} from '@mui/material';

export function CustomButton(props) {
    return (
        <Tooltip title={props.title}>
            <IconButton
                    {...props}
                size='large'>
                <props.icon fontSize='inherit' />
            </IconButton>
        </Tooltip>
    );
}

export function Monospace(props) {
    return (
        <Typography
                {...props}
                variant='h4'
                fontFamily='monospace'>
            {props.text}
        </Typography>
    );
}

export function Scrollable(props) {
    return (
        <Grid container
                spacing={4}
                overflow="auto"
                flexWrap="nowrap"
                alignItems="center">
            {props.children}
        </Grid>
    );
}

export function getDim() {
    const width  = window.innerWidth;
    const height = window.innerHeight;
    return height > 1.25 * width;
}

export function button(sym, title, func, max) {
    const mode = getDim()
        ? 'min(40vh, 70vw)'
        : 'min(70vh, 40vw)';
    let calc, font;

    if (max) {
        calc = n =>
            `min(${mode} / ${n},
            ${max}px / ${n})`;
        font = `clamp(12px, ${mode} / 20,
            ${max / 20}px)`;
    } else {
        calc = n =>
            `calc(${mode} / ${n})`;
        font = `clamp(12px,
            ${mode} / 20, 25px)`;
    }

    return <button className='custom'
            type='button'
            onClick={func}
            title={title}
            style={{
                width: calc(6),
                height: calc(6 * 1.5)
            }}>
        <div className='center'>
            {React.createElement(sym,
                {size: font})}
        </div>
    </button>;
}

export function home(max) {
    return <Link to='/'>
        {button(BsHouse, 'Home',
            null, max)}
    </Link>;
}

export function arrows(move, max) {
    return <div style={{
            textAlign: 'center',
        }}>
        <div className='center'>
        {button(BsCaretUp, 'Up',
            move('w'), max)}
        </div>
        <div className='center'>
            {button(BsCaretLeft, 'Left',
                move('a'), max)}
            {button(BsArrowsAngleContract, 'Collapse',
                () => this.setState({ dir: false }), max
            )}
            {button(BsCaretRight, 'Right',
                move('d'), max)}
        </div>
        <div className='center'>
        {button(BsCaretDown, 'Down',
            move('s'), max)}
        </div>
    </div>;
}

export function move(obj) {
    const {
        pos, vel, old,
        size = old,
        wrap = true
    } = obj;

    let [quo, mod] = vel;
    quo += Math.floor(pos / old);
    mod += pos % old;

    if (wrap) {
        quo = (quo + size) % size;
        mod = (mod + size) % size;
    } else {
        quo = bind(quo, size);
        mod = bind(mod, size);
    }

    return quo * size + mod;
}

function bind(num, lim) {
    if (num >= lim)
        num = lim - 1;
    else if (num < 0)
        num = 0;

    return num;
}