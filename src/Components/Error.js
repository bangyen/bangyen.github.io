import React from 'react';

export default function Error() {
    document.title = 'Page Not Found | Bangyen';
    const size = '1.1vh';

    return (
        <header className='App-header'>
            <center style={{
                    fontSize: '5vh',
                    paddingBottom: '3vh'}}>
                <code>
                    This page isn't available.
                </code>
            </center>
            <button className='custom'
                    type='button'
                    title='Home'
                    style={{
                        width: `calc(${size} * 6)`,
                        height: `calc(${size} * 4)`
                    }}>
                <div style={{
                        fontSize: size,
                        lineHeight: '1em'
                    }}>
                    🏠&#xfe0e;
                </div>
            </button>
        </header>
    );
}