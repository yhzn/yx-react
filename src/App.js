import React, { Component } from 'react';
import 'element-react';
import 'element-theme-default';
import './App.css';
import {Home} from './view/home';
import {Login} from "./view/login";
import {HashRouter as Router,Route} from 'react-router-dom'
import {Register} from "./view/register";
import createHistory from 'history/createHashHistory'
const history = createHistory();
class App extends Component {
  render() {
    return (
            <Router>
                <div  className="flex-container">
                <Route  exact path="/" component={Login}/>
                <Route  path="/register/:id" component={Register}/>
                <Route  path="/home" component={Home}/>
                </div>
            </Router>
    );
  }
}

export default App;
