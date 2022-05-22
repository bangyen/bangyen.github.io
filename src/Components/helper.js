import {Link} from 'react-router-dom';

export function button(sym, func, title) {
    return <button className='custom'
                type='button'
                onClick={func}
                title={title}>
            <div style={{
                    fontSize: 'min(1.5vh, 1.5vw)',
                    lineHeight: '1em'
                }}>
                {sym}
            </div>
        </button>;
}

export function home() {
    return <Link to='/'>
        <button className='custom'
                type='button'
                title='Home'>
            <div style={{
                    fontSize: 'min(1.5vh, 1.5vw)',
                    lineHeight: '1em'
                }}>
                🏠&#xfe0e;
            </div>
        </button>
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