import React, { Component } from 'react';
import {delCookie} from '../tool/tool'
export class Header extends Component {
    constructor (props){
        super(props);
    }
    goBack = () => {
        delCookie("token");
        this.props.goBack();
    }
    render () {
        return (
            <div className="header">
                <div className="left el padding-left-10" onClick={this.goBack}>
                    <i className="el-icon-arrow-left"></i>
                </div>
                <div className="center el">
                    <h3>
                        医信平台
                    </h3>
                </div>
                <div className="right el padding-right-10">
                    <div>
                       <p>{this.props.hosiptal}<i className="el-icon-arrow-down margin-left-10"></i></p>
                    </div>
                </div>
            </div>
        )
    }
}
export class LoginHeader extends Component {
    render () {
        return (
            <div>

            </div>
        )
    }
}