import React, {Fragment, Component} from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import NavBar from './components/layout/NavBar'
import VideoCall from './components/layout/VideoCall'
import './App.css';

class App extends Component {
  render()
  {
    return (
      <Router>
      <Fragment>
        <NavBar />
        <Switch>
          <Route exact path="/doctor" component={VideoCall}/>
          <Route exact path="/patient" component={VideoCall}/>
        </Switch>
      </Fragment>
      </Router>
    );
  }
}

export default App;