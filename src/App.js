import React, { Component } from 'react';
import 'element-react';
import {HashRouter as Router,Route,Switch} from 'react-router-dom'
import 'element-theme-default';
import './App.css';
import {Home} from './view/home';
import {Login} from "./view/login";
import {Auth} from "./view/auth";
import {Register} from "./view/register";
import {Restart} from "./view/restart"
import {FileList} from "./view/fileList";
import {Validate} from "./view/v";
import {Oper} from "./view/oper";
import {Print} from "./view/print";
import {Ghsf} from "./view/ghsf";
import {GhsfSub} from "./view/ghsf-sub";
import {ScanSign} from "./scan/sign";
import {ScanRegister} from "./scan/register";
import {Information} from "./scan/information";
import {IpadSign} from "./scan/ipad-sign";
import {IpadCode} from "./scan/ipad-code";
import {NoticeScreen} from "./notice/screen";
import {NoticeQuery} from "./notice/query";
import {HisInfo} from "./scan/history-information";
// import createHistory from 'history/createHashHistory'
// const history = createHistory();
class App extends Component {
  render() {
    return (
            <Router>
                <div className="flex-container">
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
                        <Route path="/ghsf/:id" component={Ghsf}/>
                        <Route path="/ghsfsub/:id" component={GhsfSub}/>
                        <Route path="/ScanSign" component={ScanSign}/>
                        <Route path="/ScanRegister/:id" component={ScanRegister}/>
                        <Route path="/Information" component={Information}/>
                        <Route path="/IpadSign" component={IpadSign}/>
                        <Route path="/IpadCode" component={IpadCode}/>
                        <Route path="/NoticeScreen" component={NoticeScreen}/>
                        <Route path="/NoticeQuery" component={NoticeQuery}/>
                        <Route path="/HisInfo/:id" component={HisInfo}/>
                    </Switch>
                </div>
            </Router>
    );
  }
}

export default App;
