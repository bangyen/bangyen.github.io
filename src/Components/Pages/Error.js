import {home} from '../oldHelpers';
import React from 'react';

export default function Error() {
    document.title = 'Page Not Found | Bangyen';
    return (
        <header className='app'>
            <center style={{
                    fontSize: '5vh',
                    paddingBottom: '2vh'}}>
                <code>
                    This page isn't available.
                </code>
            </center>
            <div>
                {home(400)}
            </div>
        </header>
    );
}