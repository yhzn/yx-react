import React, { Component } from 'react';
import wx from '../image/wx.png'
import {getCodeTime,getCookie,setCookie,baseUrl,getUrlParam} from "../tool/tool";
import {Link} from 'react-router-dom'
import {Button,Loading,MessageBox} from "element-react"
import "whatwg-fetch"
import qs from "qs";
export class Login extends Component {
    constructor (props){
        super(props);
        this.state={
            loginMethod:true,
            getCodeFlag:true,
            phone:"",
            code:"",
            password:"",
            errPhone:"",
            errCode:"",
            errPassword:"",
            loading:false,
            user:!!getUrlParam("mobile")
        }
    }
    componentDidMount () {
        console.log(!this.state.user)
        let urlParam=getUrlParam("code");
        let getUserMsg=getCookie("userMsg");
        if(!!urlParam){
            this.getData(`${baseUrl}account/getUserAccessToken/wxCode`,{code:urlParam});
        }else if(getCookie("token")){
            this.props.history.push( '/home',null);
        }
        if(getUserMsg){
            this.setState({phone:JSON.parse(getUserMsg).phone,password:JSON.parse(getUserMsg).password})
        };

    }
    getData = (url,parameter) => {
        this.setState({loading:true});
        fetch(url,{
            method:"post",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: qs.stringify(parameter)
        })
        .then(response => {
            this.setState({loading:false});
            if(response.status===200){
                return response.json()
            }
        })
        .then((data) => {
            switch (data.code){
                case 201:
                    this.setState({errPhone:"用户名不存在"});
                    break;
                case 202:
                    this.setState({errPassword:"密码错误"});
                    break;
                case 301:
                    this.setState({errCode:"验证码失效，请获取新验证码"});
                    break;
                case 0:
                    let userMsg={
                        phone:this.state.phone,
                        password:this.state.password
                    }
                    setCookie("userMsg",JSON.stringify(userMsg),10);
                    setCookie("token",JSON.stringify(data.msg),10);
                    !this.state.user?this.props.history.push( '/home',null):this.props.history.push('/servicehome',null);
                    break;
                default :
                    MessageBox.alert(data.msg,'提示');
                    break;

            }
        })
        .catch((err) => {
            this.setState({loading:false});
            MessageBox.alert("登录失败，请重新登录");
        })

    }
    toggleLoginMethod = () =>{
        this.setState({
            loginMethod:!this.state.loginMethod,
            codeBtnText:"获取验证码",
            code:"",
            errPhone:"",
            errCode:"",
            errPassword:"",
            loginFlag:true
        })
    }
    getCode = () =>{
        let url=baseUrl+"verifyCode/sendCode_login";
        if(this.state.user){
            url=baseUrl+"verifyCode/sendCode_patientLogin"
        }
        let parameter={
            phoneNum:this.state.phone
        }
        getCodeTime(this,url,parameter);
    }
    getValue = (v,e) =>{
        if(v==="phone"){
            this.setState({errPhone:""});
            this.setState({phone:e.target.value.trim()});
            if(!/^1[34578]\d{9}$/.test(e.target.value.trim())){
                this.setState({errPhone:"手机号格式不正确"});
                return false;
            }
        }
        if(v==="password"){
            this.setState({errPassword:""});
            this.setState({password:e.target.value.trim()});
            if(!e.target.value.trim()){
                this.setState({errPassword:"密码或工号不能为空"});
            }
            if(this.state.user && !/^[a-zA-Z0-9_]\w{5,17}$/.test(e.target.value.trim())){
                this.setState({errPassword:"密码为6-18位的字母、数字、下划线"});
            }
        }
        if(v==="code"){
            this.setState({errCode:""});
            this.setState({code:e.target.value.trim()});
        }
    }
    submit = () =>{
        let userMsg={
            phone:this.state.phone,
            password:this.state.password
        }
        // console.log(getCookie("token"))
        // localStorage.setItem(`myCat`, `Tom`);
        // console.log(localStorage.getItem(`mt`));
        // console.log(localStorage.getItem(`myerwtat`));
        let flag=true;
        let url=baseUrl+"account/getUserAccessToken/password";
        let parameter={};
        if(!!this.state.errPhone||!!this.state.errPassword||!!this.state.errCode){
            return false;
        }
        this.setState({errPhone:""});
        if(!this.state.phone.trim()){
            this.setState({errPhone:"手机号不能为空"});
            flag=false;
        }
        if(this.state.loginMethod){
            this.setState({errPassword:""});
            if(!this.state.password.trim()){
                this.setState({errPassword:"密码不能为空"});
                flag=false;
            }
            parameter={
                phoneNum:this.state.phone,
                password:this.state.password
            }

            if(this.state.user){
                url=`${baseUrl}system/patientLogin/getPatientAccessToken/password`;
                parameter={
                    patientPhone:this.state.phone,
                    password:this.state.password
                }

            }
        }else{
            this.setState({errCode:""});
            if(!this.state.code.trim()){
                this.setState({errCode:"验证码不能为空"});
                flag=false;
            }

            url=baseUrl+"account/getUserAccessToken/verificationCode";
            parameter={
                phoneNum:this.state.phone,
                code:this.state.code
            }
            if(this.state.user){
                url=`${baseUrl}system/patientLogin/getPatientAccessToken/verificationCode`;
                parameter={
                    patientPhone:this.state.phone,
                    code:this.state.code
                }

            }
        }
        if(!flag){
            return false;
        }
        setCookie("userMsg",JSON.stringify(userMsg),10);
        this.getData(url,parameter);
    }
    render(){
        return (
            <div className="login">
                <div className="logo">
                    <p onClick={this.toggleLoginMethod}>
                        {
                            this.state.loginMethod?`短信登录`:`密码登录`
                        }
                    </p>
                </div>
                <div className="msg">
                    <ul>
                        <li className="user">
                            <input type="text" placeholder="请输入手机号" onChange={this.getValue.bind(this,"phone")} value={this.state.phone}/>
                            <p className="err">{this.state.errPhone}</p>
                        </li>
                        {
                            this.state.loginMethod?
                                <li className="password">
                                    <input placeholder={this.state.user?"请输入密码":"请输入密码或工号"} onChange={this.getValue.bind(this,"password")} type="password" value={this.state.password}/>
                                    <p className="err">{this.state.errPassword}</p>
                                </li>
                                :
                                <li className="code">
                                    <input placeholder="请输入验证码" onChange={this.getValue.bind(this,"code")} type="text" value={this.state.code}/>
                                    <p className={`get-code ${this.state.getCodeFlag?'':'active'}`} onClick={this.getCode}>{this.state.codeBtnText}</p>
                                    <p className="err">{this.state.errCode}</p>
                                </li>
                        }
                        <li className="sign"><Button type="info" onClick={this.submit}>登录</Button></li>
                        <li>
                            <p>
                                <Link to={this.state.user?`/register/2?mobile=${this.state.user}`:`/register/2`}>
                                    {this.state.loginMethod?`忘记密码?`:''}
                                </Link>
                            </p>
                            <p>
                                <Link to={this.state.user?`/register/1?mobile=${this.state.user}`:`/register/1`}>
                                    手机注册
                                </Link>
                            </p>
                        </li>
                    </ul>
                </div>
                <div className="other">
                    <span>第三方账号自动登录</span>
                </div>
                <ul className="acc">
                     <li>
                         <img src={wx} alt=""/>
                     </li>
                </ul>
                {
                    this.state.loading && <Loading fullscreen={true} text="登陆中......" loading={true} />
                }
            </div>
        )
    }
}