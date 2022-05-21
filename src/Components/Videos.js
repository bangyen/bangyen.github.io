import {Link} from 'react-router-dom';
import {button} from './helper';
import React from "react";

function getVideo(embedId, name) {
    return <div>
        <iframe
            width="853"
            height="480"
            src={`https://www.youtube.com/embed/${embedId}`}
            frameBorder="0"
            allowFullScreen
            title={name}
        />
    </div>;
}

export default class Videos extends React.Component {
    constructor(props: Props) {
        super(props);

        this.id = [
            ['Project Glow DC 2022', 'uoaCbzWmDVk'],
            ['Chicago', 'Ay6w4Fsk8Ec'],
            ['Washington, DC', 'xM4Ttema4cg'],
            ['Firefly 2021', 'nnwVZDGj-SU']
        ];

        this.change
            = this.change.bind(this);
        this.state = {num: 0};
    }

    componentDidMount() {
        document.title = 'Videos | Bangyen';
    }

    change(val) {
        const len = this.id.length;
        const {num} = this.state;
        val = num + val + len;

        return () => {
            this.setState({
                num: val % len
            });
        };
    }

    render() {
        const {num} = this.state;
        const [name, id] = this.id[num];

        return (
            <header className='App-header'>
                <h1>
                    <code>
                        {name}
                    </code>
                </h1>
                {getVideo(id, name)}
                <div>
                    {button('\xa0❮\xa0',
                        this.change(-1))}
                    <Link to='/'>
                        <button className='custom'
                                type='button'>
                            🏠&#xfe0e;
                        </button>
                    </Link>
                    {button('\xa0❯\xa0',
                        this.change(1))}
                </div>
            </header>
        );
    }
}