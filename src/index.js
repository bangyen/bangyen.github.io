import ReactDOM from 'react-dom';
import React from 'react';
import Grid from './Grid';
import Home from './Home';
import './index.css';
import './Grid.css';
import {
    BrowserRouter as Router,
    Switch,
    Route
} from "react-router-dom";

function App() {
    return (
        <Router>
            <div>
                <Switch>
                    <Route path="/back">
                        <Grid />
                    </Route>
                    <Route path="/">
                        <Home />
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
