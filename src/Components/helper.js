export function button(sym, func) {
    return <button className='custom'
                type='button'
                onClick={func}>
            {sym}
        </button>;
}

export function find(arr, ind) {
    let len = arr.length;
    let quo = Math.floor(ind / len);

    return arr[quo];
}

export function emptyArray(size) {
    let arr = Array(size).fill(' ');
    return arr.map(x => [...arr]);
}