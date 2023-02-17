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
            <b>
                <code style={{
                    fontSize: '3vh'
                }}>
                    About Me
                </code>
            </b>
            <center style={{
                    fontSize: '2vh',
                    width: '40%',
                    paddingTop: '2vh',
                    paddingBottom: '2vh'
                }}>
                <code>
                    I am a first-year PhD student working
                        with <a href="http://pdinda.org/">Peter Dinda</a> in
                        the Prescience Lab at Northwestern University.
                    I have a B.A. in Mathematics and Economics from the University of Virginia.
                    I study HPC optimizations, specifically the use of machine learning to autotune MPI collective operations.
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
                fontSize: '2vh',
                paddingBottom: '5vh'
                }}>
                <code>
                    <ul style={{textAlign: 'left'}}>
                        <li><a href="https://ieeexplore.ieee.org/document/9923793">RipTide: A Programmable, Energy-Minimal Dataflow Compiler and Architecture (G. Gobieski et al.)</a></li>
                        <li><a href="https://dl.acm.org/doi/10.1145/349299.349342">ABCD: eliminating array bounds checks on demand (Rastislav Bodik, Rajiv Gupta, and Vivek Sarkar)</a></li>
                        <li><a href="https://dl.acm.org/doi/10.1145/1379022.1375609">Register allocation by puzzle solving (Fernando Magno Quintao Pereira and Jens Palsberg)</a></li>
                    </ul>
                </code>
            </center>
        </header>
    );
}