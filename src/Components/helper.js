export function button(sym, func) {
    return <button className='custom'
                type='button'
                onClick={func}>
            {sym}
        </button>;
}

export function emptyArray(size) {
    let arr = Array(size).fill(' ');
    return arr.map(x => [...arr]);
}

export function pairEquals(x, y) {
    if (x === null || y === null)
        return x === y;

    return x[0] === y[0]
        && x[1] === y[1];
}

export function includes(arr, pair) {
    return arr.some(p =>
        pairEquals(p, pair));
}
