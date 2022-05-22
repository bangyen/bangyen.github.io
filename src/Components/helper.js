import {Link} from 'react-router-dom';

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
                height: calc(mode, 10.5),
                maxWidth:  max ? min(6) : '',
                maxHeight: max ? min(4) : ''
            }}>
        <div style={{
                fontSize: max ?
                    `min(${calc(mode, 40)},
                    ${min(1)})` : '',
                lineHeight: '1em'
            }}>
            {sym}
        </div>
    </button>;
}

export function home(max) {
    return <Link to='/'>
        {button('🏠\ufe0e', 'Home', null, max)}
    </Link>;
}

export function resize(str) {
    const arr = str.split('\n')
        .map(val => val.length);
    let col = Math.max(...arr);
    let row = arr.length;

    return [row, col];
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