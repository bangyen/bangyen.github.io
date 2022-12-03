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
                    fontSize: '2vh',
                    width: '40%'
                }}>
                <code>
                    I am a first-year PhD student working
                        with <a href="https://users.cs.northwestern.edu/~simonec">Simone Campanoni</a> in
                        the Arcana Lab at Northwestern University.
                    I have a B.A. in Mathematics and Economics from the University of Virginia.
                    I study compilers, specifically looking into new abstractions and representations.
                </code>
            </center>
            <b>
                <code style={{
                        fontSize: '3vh'
                    }}>
                    Contact Info
                </code>
            </b>
            <center>
                <code style={{
                        fontSize: '2vh'
                    }}>
                    <ul style={{ textAlign: 'left' }}>
                        <li>bangyen (at) northwestern (dot) edu</li>
                        <li>Seeley G. Mudd Library, Room 3308</li>
                    </ul>
                </code>
            </center>
            <b>
                <code style={{
                        fontSize: '3vh'
                    }}>
                    Favorite Papers
                </code>
            </b>
            <center style={{
                    fontSize: '2vh'
                }}>
                <code>
                    <ul style={{textAlign: 'left'}}>
                        <li>G. Gobieski et al., "RipTide: A Programmable, Energy-Minimal Dataflow Compiler and Architecture"</li>
                        <li>Rastislav Bodik, Rajiv Gupta, and Vivek Sarkar, "ABCD: eliminating array bounds checks on demand"</li>
                        <li>Fernando Magno Quintao Pereira and Jens Palsberg, "Register allocation by puzzle solving"</li>
                    </ul>
                </code>
            </center>
            <img
                src={require('./photo.png')}
                alt=""
                style={{
                    width: 736 / 4,
                    height: 1078 / 4,
                    paddingTop: '2vh',
                    paddingBottom: '2vh'
                }} />
        </header>
    );
}