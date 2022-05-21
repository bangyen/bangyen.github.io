import {Link} from 'react-router-dom';
import React from 'react';

export default class Home extends React.Component {
    constructor(props: Props) {
        super(props);

        const size = this.getSize();
        this.state = {size};

        this.updateSize
            = this.updateSize.bind(this);
    }

    componentDidMount() {
        document.title = 'Home | Bangyen';
        window.addEventListener(
            'resize', this.updateSize);
    }

    componentWillUnmount() {
        clearInterval(this.timerID);
        window.removeEventListener(
            'resize', this.updateSize);
    }

    getSize() {
        let x = window.innerHeight;
        let y = window.innerWidth;
        const scale = 2;

        x /= scale;
        y /= 0.6 * 7 * scale;

        return Math.min(x, y);
    }

    updateSize() {
        const size = this.getSize();
        this.setState({size});
    }

    render() {
        return (
            <header className='App-header select'>
                <h1 className='logo'
                        style={{
                            fontFamily: 'AloeVera',
                            fontSize: `${this.state.size}px`
                        }} >
                    Bangyen
                </h1>
                <div>
                    <div className='dropdown'>
                        <button className='custom'>
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
}