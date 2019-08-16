import React from 'react';
import {
    HashRouter as Router, //explore ways of using browser router instead
    Route,
} from "react-router-dom";
import Landing from './Landing.jsx';
import RedditPage from './RedditPage.jsx';

class App extends React.Component {
    render() {
        return (
            <Router>
                <Route exact path="/" component={Landing} />
                <Route path="/reddit" component={RedditPage} />
            </Router>
        )
    }
}

export default App;
