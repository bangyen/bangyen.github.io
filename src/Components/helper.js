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

export function button(sym, title, func, max = false) {
    const min  = (n) => `max(${n * 1.1}vh, ${n * 10}px)`;
    const calc = (m, n) => `calc(${m} / ${n})`;
    const mode = getDim()
        ? 'var(--stack)'
        : 'var(--table-size)';

    return <button className='custom'
            type='button'
            onClick={func}
            title={title}
            style={{
                width: calc(mode, 7),
                height: calc(mode, 7 * 1.5),
                maxWidth:  max ? min(6) : '',
                maxHeight: max ? min(4) : ''
            }}>
        <div style={{
                lineHeight: '1em'
            }}>
            {React.createElement(sym, {size:
                `min(calc(${mode} / 22), 24.5px)`})}
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
            textAlign: 'center'
        }}>
        {button(BsCaretUp, 'Up',
            move('w'), true)}
        <div>
            {button(BsCaretLeft, 'Left',
                move('a'), true)}
            {button(BsArrowsAngleContract, 'Collapse',
                () => this.setState({ dir: false }),
                true
            )}
            {button(BsCaretRight, 'Right',
                move('d'), true)}
        </div>
        {button(BsCaretDown, 'Down',
            move('s'), true)}
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