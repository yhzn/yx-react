import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import {validate} from "../tool/validator";
import {Button,Loading,MessageBox} from "element-react";
import {baseQrUrl,baseKQrl,setCookie,getUrlParam,getCookie} from "../tool/tool";
import {scanInfoData} from "../data/data";
import qs from "qs";
export class ScanSign extends Component {
    constructor (props) {
        super(props);
        this.state={
            phone:"",
            password:"",
            ver:{
                phone:{
                    required:true,
                    mobile:true,
                    input:'phone',
                    name:'手机号'
                },
                password:{
                    required:true,
                    input:'password',
                    name:'密码'
                }
            },
            loading:false
        }
    }
    componentDidMount () {
        scanInfoData.flag=false;
        let getUser=JSON.parse(getCookie("scanUser"));
        if(getUser){
            this.setState({
                phone:getUser.phoneNum,
                password:getUser.password
            })
        }
        let urlParam=getUrlParam("code");
        if(!!urlParam){
            this.getData(`${baseQrUrl}account/getUserAccessToken/wxCode`,{code:urlParam});
        }
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
                    return response.json();
                }
            })
            .then((data) => {
                switch (data.code){
                    case 0:
                        setCookie("scanToken",JSON.stringify(data.msg),10);
                        if(!getUrlParam("qrcode")||!getUrlParam("nId")){
                            MessageBox.alert("登录成功，请返回微信，扫码签到");
                            return false;
                        }
                        window.location.href=`${baseKQrl}/#/information?qrcode=${getUrlParam("qrcode")}&nId=${getUrlParam("nId")}&openId=${getUrlParam("openId")}`
                        break;
                    default :
                        MessageBox.alert(data.msg,"提示");
                        break;
                }

            })
            .catch((err) => {
                this.setState({loading:false});
                MessageBox.alert("登录异常");
            })
    }
    submit = () => {
        if(validate({ctx:this,key:'ver',rules:this.state.ver})){
            setCookie("scanUser",JSON.stringify({
                phoneNum:this.state.phone,
                password:this.state.password
            }),10);
            this.postData(`${baseQrUrl}account/getUserAccessToken/password`,{
                phoneNum:this.state.phone,
                password:this.state.password
            })
        }
    }
    render () {
        let {ver,phone,password,loading} = this.state;
        return (
            <section className="scan-sign">
                <h1>会议考勤扫码系统</h1>
                <ul>
                   <li>
                       <input
                           type="text"
                           name="phone"
                           placeholder="请输入手机号"
                           value={phone}
                           onChange={(e)=>{this.setState({phone:e.target.value.trim()})}}
                       />
                       <p>{ver.phone.tips}</p>
                   </li>
                   <li>
                       <input
                           type="password"
                           name="password"
                           placeholder="初始密码为工号"
                           value={password}
                           onChange={(e)=>{this.setState({password:e.target.value.trim()})}}
                       />
                       <p>{ver.password.tips}</p>
                   </li>
                   <li><Button type="info" onClick={this.submit}>登录</Button></li>
                </ul>
                <section className="tool">
                    <p><Link to="/ScanRegister/1">忘记密码?</Link></p>
                    <p><Link to="/ScanRegister/2">手机注册</Link></p>
                </section>
                {
                    loading && <Loading text="登录中......"/>
                }
            </section>
        )
    }

}

