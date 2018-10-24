import React, { Component } from 'react';
import 'element-react';
import 'element-theme-default';
import './App.css';
import {Home} from './view/home';
import {Login} from "./view/login";
import {Auth} from "./view/auth";
import {HashRouter as Router,Route,Switch} from 'react-router-dom'
import {Register} from "./view/register";
// import createHistory from 'history/createHashHistory'
// const history = createHistory();
class App extends Component {
  render() {
    return (
            <Router>
                <div  className="flex-container">
                    <Switch>
                        <Route  exact path="/" component={Login}/>
                        <Route  path="/register/:id" component={Register}/>
                        <Route  path="/home" component={Home}/>
                        <Route  path="/auth" component={Auth}/>
                    </Switch>
                </div>
            </Router>
    );
  }
}

export default App;
