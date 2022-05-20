import ReactDOM from 'react-dom';
import React from 'react';
import {
    HashRouter as Router,
    Switch,
    Route
} from "react-router-dom";

import Back from './Components/Interpreters/Back';
import Suffolk from './Components/Interpreters/Suffolk';
import StunStep from './Components/Interpreters/StunStep';
import WII2D from './Components/Interpreters/WII2D';

import Snake from './Components/Snake';
import Home from './Components/Home';
import Error from './Components/Error';

import './index.css';
import './Grid.css';
import './Button.css';

function App() {
    return (
        <Router basename='/'>
            <div>
                <Switch>
                    <Route exact path="/back">
                        <Back />
                    </Route>
                    <Route exact path="/stun_step">
                        <StunStep />
                    </Route>
                    <Route exact path="/suffolk">
                        <Suffolk />
                    </Route>
                    <Route exact path="/WII2D">
                        <WII2D />
                    </Route>
                    <Route exact path="/snake">
                        <Snake />
                    </Route>
                    <Route exact path="/">
                        <Home />
                    </Route>
                    <Route >
                        <Error />
                    </Route>
                </Switch>
            </div>
        </Router>
    );
}

ReactDOM.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
    document.getElementById('root')
);
