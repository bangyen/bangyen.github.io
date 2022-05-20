import {Link} from 'react-router-dom';
import React from 'react';

export default function Home() {
    document.title = 'Home';

    return (
        <header className='App-header select'>
            <h1 className='logo'>
                Bangyen
            </h1>
            <div>
                <div class='dropdown'>
                    <button class='custom'>
                        Interpreters
                    </button>
                    <div class='dropdown-content'>
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
                            type='button'>
                        Videos
                    </button>
                </Link>
                <Link to='/snake'>
                    <button className='custom'
                            type='button'>
                        Snake
                    </button>
                </Link>
                <form action='https://github.com/bangyen'
                        style={{display: 'inline-block'}}>
                    <input type='submit'
                        value='GitHub'
                        className='custom' />
                </form>
            </div>
        </header>
    );
}