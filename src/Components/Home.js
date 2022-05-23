import {Link} from 'react-router-dom';
import React from 'react';

export default function Home() {
    document.title = 'Home | Bangyen';
    const style = {
        padding: '0.65em 1.6em',
        maxWidth: 150
    };

    return (
        <header className='app select'>
            <div style={{
                    position: 'absolute',
                    top: '1vh'
                }}>
                <div className='dropdown'>
                    <button className='custom'
                            style={style}>
                        Interpreters
                    </button>
                    <div className='dropdown-content'>
                        <Link to='/back'>
                            Back
                        </Link>
                        <Link to='/stun_step'>
                            Stun Step
                        </Link>
                        <Link to='/suffolk'>
                            Suffolk
                        </Link>
                        <Link to='/WII2D'>
                            WII2D
                        </Link>
                    </div>
                </div>
                <Link to='/videos'>
                    <button className='custom'
                            type='button'
                            style={style}>
                        Videos
                    </button>
                </Link>
                <Link to='/snake'>
                    <button className='custom'
                            type='button'
                            style={style}>
                        Snake
                    </button>
                </Link>
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