import React, { Component } from 'react';
import {Button,Loading,MessageBox} from "element-react";
import {validate} from "../tool/validator";
import {getCodeTime, baseQrUrl, setCookie, getUrlParam, getCookie} from "../tool/tool";
import "whatwg-fetch";
import qs from "qs";

export class IpadSign extends Component {
    constructor (props) {
        super(props);
        this.state={
            codeBtnText:"获取验证码",
            phone:"",
            code:"",
            getCodeFlag:true,
            ver:{
                phone:{
                    required:true,
                    mobile:true,
                    input:'phone',
                    name:'手机号'
                },
                code:{
                    required:true,
                    input:'code',
                    name:'验证码'
                }
            },
            loading:false,
        }
    }
    componentDidMount () {
        let getUser=JSON.parse(getCookie("ipadUser"));
        if(getUser){
            this.setState({
                phone:getUser.phoneNum,
            })
        }
        let urlParam=getUrlParam("code");
        if(!!urlParam){
            this.getData(`${baseQrUrl}account/getUserAccessToken/wxCode`,{code:urlParam});
        }
    }
    getCode = () => {
        getCodeTime(this,`${baseQrUrl}verifyCode/sendCode_login`,{phoneNum:this.state.phone},false)
    }
    postData = (url,parameter) => {
        this.setState({loading:true});
        fetch(url,{
            method:"post",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: qs.stringify(parameter)
        })
            .then((response) => {
                this.setState({loading:false});
                if(response.status===200){

                    return response.json()
                }
            })
            .then((data) => {
                switch (data.code){
                    case 0:
                        setCookie("scanToken",JSON.stringify(data.msg),10);
                        this.props.history.push( '/ipadcode',null);
                        break;
                    default :
                        MessageBox.alert(data.msg,"提示");
                        break;
                }

            })
            .catch((err) => {
                this.setState({loading:false});
                MessageBox.alert("登录失败，请重新登录");
            })
    }
    submit = () => {
        if(validate({ctx:this,key:'ver',rules:this.state.ver})){
            setCookie("ipadUser",JSON.stringify({
                phoneNum:this.state.phone,
            }),10);
            this.postData(`${baseQrUrl}account/getUserAccessToken/verificationCode`,{
                 phoneNum:this.state.phone,
                 code:this.state.code
             })
        }
    }
    render () {
        let {codeBtnText,phone,code,getCodeFlag,ver} = this.state;
        return (
            <section className="ipad-code">
                <section className="ipad-sign">
                    <section className="sign-input">
                        <h3>会议考勤扫码系统</h3>
                        <ul>
                            <li><input
                                type="text"
                                placeholder="手机号"
                                name="phone"
                                value={phone}
                                onChange={(e)=>{this.setState({phone:e.target.value.trim()})}}
                            />
                            </li>
                            <p>{ver.phone.tips}</p>
                            <li className="code">
                                <input
                                    type="text"
                                    placeholder="验证码"
                                    name="code"
                                    value={code}
                                    onChange={(e)=>{this.setState({code:e.target.value.trim()})}}
                                />
                                <p className={getCodeFlag?"":"active"} onClick={this.getCode}>{codeBtnText}</p>
                            </li>
                            <p>{ver.code.tips}</p>
                            <li>
                                <Button type="info" onClick={this.submit}>登录</Button>
                            </li>
                        </ul>
                    </section>
                </section>
            </section>
        )
    }
}