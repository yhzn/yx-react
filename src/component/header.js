import React, { Component } from 'react';
import {delCookie} from '../tool/tool'
import {withRouter} from 'react-router-dom'
import {SelectHospital} from '../component/select';
class HeaderC extends Component {
    goBack = () => {
        if(this.props.del){
            delCookie("token");
            this.props.history.push( '/',null);

        }else{
            this.props.history.goBack();
        }
    }
    selectChange = (value) => {
        this.props.onSelectChange(value);
    }
    render () {
        return (
            <div className="header">
                <div className="left el padding-left-10" onClick={this.goBack}>
                    <i className="el-icon-arrow-left" />
                </div>
                <div className="center el">
                    <h3>
                        {this.props.title}
                    </h3>
                </div>
                <div className="right el padding-right-10">
                    <div>
                        <SelectHospital onSelectChange={this.selectChange} value={this.props.value} options={this.props.options}/>
                    </div>
                </div>
            </div>
        )
    }
}
export let Header = withRouter(HeaderC);
