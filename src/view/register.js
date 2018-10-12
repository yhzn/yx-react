import React, { Component } from 'react';
import {SelectHospital} from '../component/select';
import {Button,Loading,MessageBox} from "element-react";
import {getCodeTime} from "../tool/tool";
import "whatwg-fetch";
export class Register extends Component {
    constructor (props) {
        super(props);
        this.state= {
            value: "",
            getCodeFlag: true,
            registerMethod: true,
            registerSuccess:false,
            codeBtnText: "获取验证码",
            user:"",
            phone: "",
            code:"",
            hospital:"",
            newPassWord:"",
            surePassWord:"",
            errUser:"",
            errPhone:"",
            errCode:"",
            errNewPassWord:"",
            errSurePassWord:"",
            errHospital:"",
            loading:false
        }
    }
    componentDidMount () {
        if(this.props.match.params.id=="1"){
            this.setState({
                registerMethod:true,
            })
        }else{
            this.setState({
                registerMethod:false,
            })
        }
    }
    getData = (url,parameter) => {
        this.state.loading=true;
        fetch(url,{
            method:"post",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: JSON.stringify(parameter)
        })
        .then((response) => {
            this.setState({loading:false});
            if(response.status==200){

                return response.json()
            }
        })
        .then((data) => {
            switch (data.code){
                case "303":
                    this.setState({errPhone:"用户以注册"});
                    break;
                case "301":
                    this.setState({errCode:"验证码错误，请获取新验证码"});
                    break;
                case "0":
                    this.setState({registerSuccess:true});
                    break;
                default :
                    MessageBox.alert("登录失败，请重新注册");
                    break;
            }
        })
        .catch((err) => {
            this.setState({loading:false});
            MessageBox.alert("注册失败，请重新注册")
        })
    }
    selectChange = (value) =>{
        this.setState({hospital:value});
        this.setState({errHospital:""});
    }
    getCode = () => {
        let url="/zhaohuimimayanzhengma";
        let parameter={
            phoneNum:this.state.phone
        }
        getCodeTime(this,url,parameter);
    }
    getValue = (v,e) => {
        if(this.state.registerMethod) {
            if (v === "user") {
                this.setState({errUser:""});
                if(!e.target.value.trim()){
                    this.setState({errUser:"用户名不能为空"});
                    return false;
                }
                if(!/^[\u4E00-\u9FA5a-zA-Z0-9_]/.test(e.target.value.trim())){
                  this.setState({errUser:"用户名为中文、字母、数字、下划线"})
                  this.setState({user:""})

                }else{
                    this.setState({user:e.target.value.trim()})
                }
            }

        }
        if (v === "phone") {
            this.setState({errPhone:""});
            if(!e.target.value.trim()){
                this.setState({errPhone:"手机号不能为空"});
                return false;
            }
            if(!/^((13[0-9])|(14[5|7])|(15([0-3]|[5-9]))|(18[0,5-9]))\d{8}$/.test(e.target.value.trim())){
                this.setState({errPhone:"手机号格式不正确"})
                this.setState({phone:""})

            }else{
                this.setState({phone:e.target.value.trim()})

            }
        }
        if(v==="code"){
            this.setState({errCode:""});
            if(!e.target.value.trim()){
                this.setState({errCode:"验证码不能为空"});
                return false;
            }
            this.setState({code:e.target.value.trim()})
        }
        if(!this.state.registerMethod){
            if(v==="newPassWord"){
                this.setState({errNewPassWord:""});
                if(!e.target.value.trim()){
                    this.setState({errNewPassWord:"密码不能为空"});
                    return false;
                }
                if(!/^[a-zA-Z0-9_]\w{5,17}$/.test(e.target.value.trim())){
                    this.setState({errNewPassWord:"密码为6-18位的字母、数字、下划线"})
                    this.setState({newPassWord:""})
                }else{
                    this.setState({newPassWord:e.target.value.trim()})

                }
            }
            if(v==="surePassWord"){
                this.setState({errSurePassWord:""});
                if(!e.target.value.trim()){
                    this.setState({errSurePassWord:"请确认新密码"});
                    return false;
                }
                if(!this.state.newPassWord===this.state.surePassWord){
                    this.setState({errSurePassWord:"两次密码不一致"})
                    this.setState({surePassWord:""})
                }else{
                    this.setState({surePassWord:e.target.value.trim()})
                }
            }
        }

    }
    submit = () => {
        this.setState({errPhone:""});
        this.setState({errCode:""});
        let flag=true;
        let url="/yonghuzhuce";
        let parameter={}
        if(this.state.registerMethod) {
            this.setState({errUser:""});
            this.setState({errCode:""});
            if(!this.state.hospital.trim()){
                this.setState({errHospital:"请选择院区"});
                flag=false;
            }
            if(!this.state.user.trim()){
                this.setState({errUser:"用户名不能为空"});
                flag=false;
            }
            if(!this.state.phone.trim()){
                this.setState({errPhone:"手机号不能为空"});
                flag=false;
            }
            if(!this.state.code.trim()){
                this.setState({errCode:"验证码不能为空"});
                flag=false;
            }
            parameter={
                id:this.state.hospital,
                user:this.state.user,
                phoneNum:this.state.phone,
                code:this.state.code
            }
        }else{
            this.setState({errNewPassWord:""});
            this.setState({errSurePassWord:""});
            if(!this.state.phone.trim()){
                this.setState({errPhone:"手机号不能为空"});
                flag=false;
            }
            if(!this.state.code.trim()){
                this.setState({errCode:"验证码不能为空"});
                flag=false;
            }
            if(!this.state.newPassWord.trim()){
                this.setState({errNewPassWord:"密码不能为空"});
                flag=false;
            }
            if(!this.state.surePassWord.trim()){
                this.setState({errSurePassWord:"请确认新密码"});
                flag=false;
            }
            url="/zhaohuimima";
            parameter={
                phoneNum:this.state.phone,
                code:this.state.code,
                password:this.state.password
            }
        }
        if(!flag){
            return false;
        }
        this.getData(url,parameter);
    }
    goBack = () => {
        this.props.history.goBack();
    }
    render () {
        return (
                <section className="register">
                    {
                        this.state.registerSuccess?
                            <section>
                                <section className="success">
                                    <p>
                                        注册信息已提交，审批需要两天左右，请耐心等待
                                    </p>
                                </section>
                                <Button type="success" size="large" onClick={this.goBack}>返回</Button>
                            </section>
                            :
                            <section>
                                <header>
                                    <i className="el-icon-arrow-left" onClick={this.goBack}></i>
                                    <h3>{this.state.registerMethod?"新用户注册":"找回密码"}</h3>
                                </header>
                                <ul>
                                    {
                                        this.state.registerMethod?
                                            <li className="select">
                                                <SelectHospital onSelectChange={this.selectChange} />
                                                <p className="err">{this.state.errHospital}</p>
                                            </li>
                                            :null
                                    }
                                    {
                                        this.state.registerMethod?
                                            <li>
                                                <label><input type="text" placeholder="姓名" onBlur={this.getValue.bind(this,"user")}/></label>
                                                <p className="err">{this.state.errUser}</p>
                                            </li>
                                            :null
                                    }
                                    <li>
                                        <label><input type="text" placeholder="手机号" onBlur={this.getValue.bind(this,"phone")}/></label>
                                        <p className="err">{this.state.errPhone}</p>

                                    </li>
                                    <li className="code">
                                        <input type="text" placeholder="验证码" onBlur={this.getValue.bind(this,"code")}/>
                                        <p className={`get-code ${this.state.getCodeFlag?"":"active"}`} onClick={this.getCode}>{this.state.codeBtnText}</p>
                                        <p className="err">{this.state.errCode}</p>

                                    </li>
                                    {
                                        this.state.registerMethod? null:
                                            <li>
                                                <label><input type="password" placeholder="请输入新密码" onBlur={this.getValue.bind(this,"newPassWord")}/></label>
                                                <p className="err">{this.state.errNewPassWord}</p>
                                            </li>
                                    }
                                    {
                                        this.state.registerMethod? null:
                                            <li>
                                                <label><input type="password" placeholder="请确认新密码" onBlur={this.getValue.bind(this,"surePassWord")}/></label>
                                                <p className="err">{this.state.errSurePassWord}</p>
                                            </li>
                                    }
                                    <li><Button type="info"  onClick={this.submit}>{this.state.registerMethod?"发送":"确认"}</Button></li>
                                </ul>
                            </section>
                    }
                    {   this.state.loading?
                        <Loading fullscreen={true} text="登陆中......"></Loading>:null
                    }
                </section>
        )
    }
}