import {Link} from 'react-router-dom';
import {button} from './helper';
import React from "react";

const YoutubeEmbed = ({embedId, name}) => (
    <div className="video-responsive">
        <iframe
            width="853"
            height="480"
            src={`https://www.youtube.com/embed/${embedId}`}
            frameBorder="0"
            allow={`
                accelerometer;
                autoplay;
                clipboard-write;
                encrypted-media;
                gyroscope;
                picture-in-picture
            `}
            allowFullScreen
            title={name}
        />
    </div>
);

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

    change(val) {
        let len = this.id.length;
        let {num} = this.state;
        val = num + val + len;

        return () => {
            this.setState({
                num: val % len
            });
        };
    }

    render() {
        let {num} = this.state;
        let [name, id] = this.id[num];

        return (
            <header className='App-header'>
                <h1>
                    <code>
                        {name}
                    </code>
                </h1>
                <YoutubeEmbed
                    embedId={id}
                    name={name} />
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