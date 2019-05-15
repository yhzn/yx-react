import React, { Component } from 'react';
import 'element-react';
import {HashRouter as Router,Route,Switch} from 'react-router-dom'
import 'element-theme-default';
import './App.css';
import {Home} from './view/home';
import {Login} from "./view/login";
import {Auth} from "./view/auth";
import {Register} from "./view/register";
import {Restart} from "./view/restart";
import {FileList} from "./view/fileList";
import {Validate} from "./view/v";
import {Oper} from "./view/oper";
import {Print} from "./view/print";
import {Ghsf} from "./view/ghsf";
import {GhsfSub} from "./view/ghsf-sub";
import {MoneyInfo} from "./view/money-info";
import {ScanSign} from "./scan/sign";
import {ScanRegister} from "./scan/register";
import {Information} from "./scan/information";
import {IpadSign} from "./scan/ipad-sign";
import {IpadCode} from "./scan/ipad-code";
import {NoticeScreen} from "./notice/screen";
import {NoticeQuery} from "./notice/query";
import {HisInfo} from "./scan/history-information";
import {ServiceHome} from "./service/home";
import {ServiceInfo} from "./service/information";
import {InfoHistory} from "./scan/info-history";
// import createHistory from 'history/createHashHistory'
// const history = createHistory();
class App extends Component {
  render() {
    return (
            <Router>
                <div className="flex-container">
                    <Switch>
                        <Route exact path="/" component={IpadSign}/>
                        <Route path="/ScanSign" component={ScanSign}/>
                        <Route path="/ScanRegister/:id" component={ScanRegister}/>
                        <Route path="/Information" component={Information}/>
                        <Route path="/IpadCode" component={IpadCode}/>
                        <Route path="/HisInfo/:id" component={HisInfo}/>
                        <Route path="/InfoHistory" component={InfoHistory}/>
                    </Switch>
                </div>
            </Router>
    );
  }
}

export default App;
