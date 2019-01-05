import React, { Component } from 'react';
import 'element-react';
import 'element-theme-default';
import './App.css';
import {Home} from './view/home';
import {Login} from "./view/login";
import {Auth} from "./view/auth";
import {HashRouter as Router,Route,Switch} from 'react-router-dom'
import {Register} from "./view/register";
import {Restart} from "./view/restart"
import {FileList} from "./view/fileList";
import {Validate} from "./view/v";
import {Oper} from "./view/oper";
import {Print} from "./view/print";
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
                        <Route  path="/auth/:id" component={Auth}/>
                        <Route  path="/restart/:id" component={Restart}/>
                        <Route  path="/filelist/:id" component={FileList}/>
                        <Route  path="/v" component={Validate}/>
                        <Route path="/oper/:id" component={Oper}/>
                        <Route path="/print/:id" component={Print}/>
                    </Switch>
                </div>
            </Router>
    );
  }
}

export default App;
