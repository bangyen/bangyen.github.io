import React from 'react';
import {withRouter, Link} from 'react-router-dom';

class Home extends React.Component {
    constructor(props: Props) {
        super(props);

        this.state = {
            select: false,
            value: 'back'
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        document.title = 'Home';
    }

    handleChange(event) {
        this.setState({value: event.target.value});
    }

    handleSubmit(event) {
        this.props
            .history
            .push(`/${this.state.value}`);
    }

    render() {
        let select;

        if (this.state.select)
            select = (
                <form onSubmit={this.handleSubmit}>
                    <label>
                        <select
                                value={this.state.value}
                                onChange={this.handleChange}>
                            <option value="back">Back</option>
                            <option value="stun_step">Stun Step</option>
                            <option value="suffolk">Suffolk</option>
                        </select>
                    </label>
                    <input type="submit" value="Submit" />
                </form>);
        else
            select = (null);

        return (
            <header className='App-header'>
                <h1 className='logo'>
                    Bangyen
                </h1>
                <div>
                    <button className='custom'
                            type='button'
                            onClick={() => this.setState({
                                select: true})}>
                        Interpreter
                    </button>
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
                <div>
                    {select}
                </div>
            </header>
        );
    }
}

export default withRouter(Home);