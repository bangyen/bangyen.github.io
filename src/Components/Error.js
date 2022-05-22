import {home} from './helper';
import React from 'react';

export default function Error() {
    document.title = 'Page Not Found | Bangyen';
    return (
        <header className='App-header'>
            <center style={{
                    fontSize: '5vh',
                    paddingBottom: '2vh'}}>
                <code>
                    This page isn't available.
                </code>
            </center>
            {home()}
        </header>
    );
}