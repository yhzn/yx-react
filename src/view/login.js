import React, { Component } from 'react';
import wx from '../image/wx.png'
import {getCodeTime,getCookie,setCookie,delCookie} from "../tool/tool";
import {Link} from 'react-router-dom'
import {Button,Loading,MessageBox} from "element-react"
import "whatwg-fetch"
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
            loading:false
        }
    }
    componentDidMount () {
        if(getCookie("token")){
            this.props.history.push( '/home',null);
        }
    }
    getData = (url,parameter) => {
        fetch(url,{
            method:"post",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: JSON.stringify(parameter)
        })
        .then(response => {
            this.setState({loading:false});
            if(response.status==200){
                return response.json()
            }
        })
        .then((data) => {
            console.log(data.arr)
            switch (data.code){
                case "201":
                    this.setState({errPhone:"用户名不存在"});
                    break;
                case "202":
                    this.setState({errPassword:"密码错误"});
                    break;
                case "301":
                    this.setState({errCode:"验证码失效，请获取新验证码"});
                    break;
                case "0":
                    MessageBox.alert("登录成功");
                    setCookie("token",JSON.stringify(data.msg),10);
                    this.props.history.push( '/home',null);
                    break;
                default :
                    MessageBox.alert("登录失败，请重新登录");
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
            phone:"",
            code:"",
            password:"",
            errPhone:"",
            errCode:"",
            errPassword:""
        })
    }
    getCode = () =>{
        let url="/dengluyanzhengma";
        let parameter={
            phoneNum:this.state.phone
        }
        getCodeTime(this,url,parameter);
    }
    getValue = (v,e) =>{
        if(v==="phone"){
            this.setState({errPhone:""});
            this.setState({phone:e.target.value.trim()});
            if(!/^((13[0-9])|(14[5|7])|(15([0-3]|[5-9]))|(18[0,5-9]))\d{8}$/.test(e.target.value.trim())){
                this.setState({errPhone:"手机号格式不正确"})
            }
        }
        if(v==="password"){
            this.setState({errPassword:""});
            this.setState({password:e.target.value.trim()});
            if(!/^[a-zA-Z0-9_]\w{5,17}$/.test(e.target.value.trim())){
                this.setState({errPassword:"密码为6-18位的字母、数字、下划线"})
            }
        }
        if(v==="code"){
            this.setState({errCode:""});
            this.setState({code:e.target.value.trim()});
        }
    }
    submit = () =>{
        // setCookie("token","123",10)
        // console.log(getCookie("token"))
        // localStorage.setItem(`myCat`, `Tom`);
        // console.log(localStorage.getItem(`myCat`));
        // console.log(localStorage.getItem(`myerwtat`));
        let flag=true;
        let url="./mimadenglu";
        let parameter={};
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
        }else{
            this.setState({errCode:""});
            if(!this.state.code.trim()){
                this.setState({errCode:"验证码不能为空"});
                flag=false;
            }
            url="yanzhenmadenglu";
            parameter={
                phoneNum:this.state.phone,
                code:this.state.code
            }
        }
        if(!flag){
            return false;
        }
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
                                    <input onChange={this.getValue.bind(this,"password")} type="password" value={this.state.password}/>
                                    <p className="err">{this.state.errPassword}</p>
                                </li>
                                :
                                <li className="code">
                                    <input onChange={this.getValue.bind(this,"code")} type="text" value={this.state.code}/>
                                    <p className={`get-code ${this.state.getCodeFlag?'':'active'}`} onClick={this.getCode}>{this.state.codeBtnText}</p>
                                    <p className="err">{this.state.errCode}</p>
                                </li>
                        }
                        <li className="sign"><Button type="info" onClick={this.submit}>登录</Button></li>
                        <li>
                            <p><Link to="/register/2">{this.state.loginMethod?`忘记密码?`:''}</Link></p>
                            <p><Link to="/register/1">手机注册</Link></p>
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
                {this.state.loading?
                    <Loading fullscreen={true} text="登陆中......" loading={false}></Loading>:null}
            </div>
        )
    }
}