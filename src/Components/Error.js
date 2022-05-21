import {home} from './helper';
import React from 'react';

export default function Error() {
    document.title = 'Page Not Found | Bangyen';
    return (
        <header className='App-header'>
            <code style={{padding: '10px'}}>
                This page isn't available.
            </code>
            {home()}
        </header>
    );
}