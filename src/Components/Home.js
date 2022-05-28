import {Link} from 'react-router-dom';
import React from 'react';

export default function Home() {
    document.title = 'Home | Bangyen';
    const style = {
        padding: '0.65em 1.6em',
        maxWidth: 'none'
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
                    <div className='dropdown-content'
                            style={{minWidth: '113px'}}>
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
                <div className='dropdown'>
                    <button className='custom'
                        style={style}>
                        Miscellaneous
                    </button>
                    <div className='dropdown-content'
                            style={{minWidth: '129.5px'}}>
                        <Link to='/snake'>
                            Snake
                        </Link>
                        <Link to='/snowman'>
                            Snowman
                        </Link>
                        <Link to='/videos'>
                            Videos
                        </Link>
                    </div>
                </div>
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