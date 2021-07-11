import React from 'react';
import {Link} from "react-router-dom";

export default function Home() {
    return (
        <header className='App-header'>
            <h1>Bangyen</h1>
            <div>
                <Link to='/back'>
                    <button className='custom'
                            type='button'>
                        Interpreter
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
