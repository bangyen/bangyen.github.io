import {Link} from 'react-router-dom';

export default function Buttons(props) {
    let {run, set, arr} = props;

    return (<div>
        <button className='custom'
                type='button'
                onClick={run('run')}>
            ▶
        </button>
        <button className='custom'
                type='button'
                onClick={run('back')}>
            &nbsp;❮&nbsp;
        </button>
        <button className='custom'
                type='button'
                onClick={run('fore')}>
            &nbsp;❯&nbsp;
        </button>
        <button className='custom'
                type='button'
                onClick={() => set({
                    pointer: null,
                    tape: [],
                    cell: 0
                    })}>
            ✖
        </button>
        <br />
        <button className='custom'
                type='button'
                onClick={() => {
                    let num = arr.length + 1;

                    arr.forEach(x => x.push(' '));
                    arr.push(Array(num).fill(' '));
                    set({size: num, grid: arr});
                }}>
            ➕&#xfe0e;
        </button>
        <button className='custom'
                type='button'
                onClick={() => {
                    let num = arr.length - 1;
                    if (!num) return;

                    arr.pop();
                    arr.forEach(x => x.pop());
                    set({size: num, grid: arr});
                }}>
            ➖&#xfe0e;
        </button>
        <button className='custom'
                type='button'
                onClick={() => {
                    navigator.clipboard.writeText(
                        arr.map(x => x.join(''))
                           .join('\n')
                )}}>
            📥&#xfe0e;
        </button>
        <Link to='/'>
            <button className='custom'
                    type='button'>
                🏠&#xfe0e;
            </button>
        </Link>
    </div>);
}