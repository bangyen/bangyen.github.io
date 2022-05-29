import {Link} from 'react-router-dom';
import React from 'react';

const style = {
    padding: '0.65em 1.6em',
    maxWidth: 'none'
};

function dropdown(name, size, options) {
    return <div className='dropdown'>
        <button className='custom'
            style={style}>
            {name}
        </button>
        <div className='dropdown-content'
            style={{ minWidth: size + 'px' }}>
            {options.map(k =>
                <Link to={'/' + k.toLowerCase()}>
                    {k.replace('_', ' ')}
                </Link>
            )}
        </div>
    </div>;
}

export default function Home() {
    document.title = 'Home | Bangyen';

    return (
        <header className='app select'>
            <div style={{
                    position: 'absolute',
                    top: '1vh'
                }}>
                {dropdown('Interpreters', 113,
                    ['Back', 'Stun_Step', 'Suffolk', 'WII2D'])}
                {dropdown('Miscellaneous', 129.5,
                    ['Snake', 'Snowman', 'Videos'])}
                <form action='https://github.com/bangyen'
                        style={{display: 'inline-block'}}>
                    <input type='submit'
                        value='GitHub'
                        className='custom'
                        style={style} />
                </form>
            </div>
            <h1 className='logo'>
                Bangyen
            </h1>
        </header>
    );
}