export function button(sym, func) {
    return <button className='custom'
                type='button'
                onClick={func}>
            {sym}
        </button>;
}

export function emptyArray(size) {
    const arr = Array(size).fill(' ');
    return arr.map(x => [...arr]);
}

export function find(arr, ind) {
    const len = arr.length;
    const quo = Math.floor(ind / len);

    return arr[quo];
}

export function get(arr, ind) {
    const row = find(arr, ind);
    return row[ind % arr.length];
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