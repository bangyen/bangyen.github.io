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

export function getDim() {
    const width  = window.innerWidth;
    const height = window.innerHeight;
    return height > 1.25 * width;
}

export function button(sym, title, func) {
    const mode = getDim()
        ? 'var(--stack)'
        : 'var(--table-size)';
    const calc = n =>
        `max(${mode} / ${n}, 225px / ${n})`;

    return <button className='custom'
            type='button'
            onClick={func}
            title={title}
            style={{
                width: calc(7),
                height: calc(7 * 1.5)
            }}>
        <div className='center'>
            {React.createElement(sym,
                {size: calc(22)})}
        </div>
    </button>;
}

export function home(max) {
    return <Link to='/'>
        {button(BsHouse, 'Home',
            null, max)}
    </Link>;
}

export function arrows(move) {
    return <div style={{
            textAlign: 'center',
        }}>
        <div className='center'>
        {button(BsCaretUp, 'Up',
            move('w'), true)}
        </div>
        <div className='center'>
            {button(BsCaretLeft, 'Left',
                move('a'), true)}
            {button(BsArrowsAngleContract, 'Collapse',
                () => this.setState({ dir: false }),
                true
            )}
            {button(BsCaretRight, 'Right',
                move('d'), true)}
        </div>
        <div className='center'>
        {button(BsCaretDown, 'Down',
            move('s'), true)}
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