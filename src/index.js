import ReactDOM from 'react-dom';
import React from 'react';
import Snake from './Components/Snake';
import Grid from './Components/Grid';
import Home from './Components/Home';
import Error from './Components/Error';
import './index.css';
import './Grid.css';
import {
    HashRouter as Router,
    Switch,
    Route
} from "react-router-dom";

function App() {
    return (
        <Router basename='/'>
            <div>
                <Switch>
                    <Route exact path="/back">
                        <Grid />
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
