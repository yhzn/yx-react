import React, { Component } from 'react';

export class Header extends Component {
    render () {
        return (
            <div className="header">
                <div className="left el padding-left-10">
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