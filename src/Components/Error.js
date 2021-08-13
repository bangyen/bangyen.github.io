import React from 'react';
import { Link } from "react-router-dom";

export default function Error() {
    document.title = '404';
    return (
        <header className='App-header'>
            <h1>404 Error</h1>
            <Link to='/' style={{ marginBottom: '20px' }}>
                <button className='custom'
                            type='button'>
                        ??&#xfe0e;
                    </button>
            </Link>
        </header>
    );
}