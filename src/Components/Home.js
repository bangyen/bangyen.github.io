import { Link } from 'react-router-dom';
import React from 'react';

import { names } from './Interpreters';
import { pages } from './';

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
            {Object.keys(options).map(k =>
                <Link to={k.toLowerCase()}
                        key={k}>
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
                {dropdown('Interpreters', 113, names)}
                {dropdown('Miscellaneous', 129.5, pages)}
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
            <center style={{
                    fontSize: '2.5vh',
                    width: '45%',
                    paddingBottom: '5vh'
                }}>
                <code>
                    I am a first-year PhD student working
                        with <a href="https://users.cs.northwestern.edu/~simonec">Simone Campanoni</a> in
                        the Arcana Lab at Northwestern University.
                    I have a B.A. in Mathematics and Economics from the University of Virginia.
                    I study compilers, specifically looking into new abstractions and representations.
                    <div style={{height: '2.5vh'}}></div>
                    <a href="mailto:bangyen@northwestern.edu">bangyen@northwestern.edu</a>
                </code>
            </center>
        </header>
    );
}