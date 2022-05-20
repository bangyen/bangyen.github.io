import React from 'react';
import { Link } from "react-router-dom";

export default function Error() {
    document.title = 'Page Not Found | Bangyen';
    return (
        <header className='App-header'>
            <code style={{padding: '10px'}}>
                This page isn't available.
            </code>
            <Link to='/' style={{ marginBottom: '20px' }}>
                <button className='custom'
                        type='button'>
                    🏠&#xfe0e;
                </button>
            </Link>
        </header>
    );
}