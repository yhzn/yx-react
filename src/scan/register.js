import React, { Component } from 'react';
import {Button,Input,Loading,MessageBox} from "element-react"
import {validate} from "../tool/validator";
import {getCodeTime,baseQrUrl} from "../tool/tool";
import "whatwg-fetch"
import qs from "qs";

export class ScanRegister extends Component {
    constructor (props) {
        super(props);
        this.state={
            ver:{
                user:{
                    required:true,
                    input:'user',
                    name:'姓名'
                },
                jobNum:{
                    required:true,    // 是否校验数据格式
                    input:'jobNum',
                    name:'工号'
                },
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
                },
                password:{
                    required:true,
                    password:true,
                    input:'password',
                    name:'密码'

                },
                verPassword:{
                    required:true,
                    input:'verPassword',
                    name:'确认密码'
                }
            },
            registerMethod:true,
            getInputData:false,
            placeholder:"",
            user:"",
            jobNum:"",
            phone:"",
            code:"",
            password:"",
            verPassword:"",
            registerSuccess:false,
            setInputData:"",
            codeBtnText:"获取验证码",
            getCodeFlag:true,
            errPhone:"", // 使用函数 getCodeTime
            loading:false
        }
        this.setValue="";
    }
    componentDidMount () {
        switch (this.props.match.params.id) {
            case "1":
                this.setState({registerMethod:false});
                break;
            case "2":
                break;
            default :
                this.props.history.goBack();
        }
    }
    setInput = (placeholder,setValue) => {
        this.setValue=setValue;
        this.setState({
            getInputData:true,
            placeholder,
            setInputData:this.state[setValue]
        })
    }
    getInput = (e) => {
        this.setState({
            getInputData:false,
            [this.setValue]:e.target.value.trim(),
            setInputData:""
        })
    }
    reg = (url,parameter) => {
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
                        this.setState({registerSuccess:true});
                        break;
                    default :
                        MessageBox.alert(data.msg,"提示");
                        break;
                }
            })
            .catch((err) => {
                this.setState({loading:false});
                MessageBox.alert("注册失败，请重新注册");
            })
    }
    getCode = () => {
        if(this.state.registerMethod){
            // 用户注册
            getCodeTime(this,`${baseQrUrl}verifyCode/sendCodeByRegister`,{phoneNumber:this.state.phone,userId:this.state.jobNum},false);

        }else{
            // 找回密码
            getCodeTime(this,`${baseQrUrl}verifyCode/sendCodeByChangePassword`,{phoneNumber:this.state.phone},false);
        }
    }
    submit = () => {
        let parameter={};
        let url="";
        if(!this.state.registerMethod){
            // 找回密码不对姓名工号验证
            this.state.ver.user.required=false;
            this.state.ver.jobNum.required=false;
            this.setState({ver:this.state.ver});
        }
        if(validate({ctx:this,key:'ver',rules:this.state.ver})){
            if(this.state.password!==this.state.verPassword){
                this.state.ver.verPassword.tips="两次密码输入不一致";
                this.setState({ver:this.state.ver});
                return false;
            }
            if(this.state.registerMethod){
                // 用户注册
                url=`${baseQrUrl}account/register`;
                parameter={
                    username:this.state.user,
                    userNo:this.state.jobNum,
                    phoneNum:this.state.phone,
                    code:this.state.code,
                    password:this.state.password
                }
            }else{
                // 找回密码
                url=`${baseQrUrl}account/changepassword`;
                parameter={
                    phoneNum:this.state.phone,
                    code:this.state.code,
                    password:this.state.password
                }
            }
            this.reg(url,parameter);
        }
    }
    render () {
        let {registerMethod,getInputData,placeholder,user,jobNum,phone,code,password,verPassword,setInputData,ver,registerSuccess,codeBtnText,getCodeFlag,loading} = this.state;
        return (
            <section className="scan-register">
                <header>
                    <i className="el-icon-arrow-left" onClick={()=>{this.props.history.goBack()}} />
                    <h3>{registerMethod?"新用户注册":"找回密码"}</h3>
                </header>
                {
                    registerSuccess?
                        <section>
                            <section className="success">
                                <p>
                                    {
                                        registerMethod?"注册成功":"申请成功"
                                    }
                                </p>
                            </section>
                            <section className="btn">
                                <Button type="info" onClick={()=>{this.props.history.goBack()}}>返回</Button>
                            </section>
                        </section>
                        :
                        <section className="container">
                            <ul>
                                {
                                    registerMethod &&
                                    <li>
                                        <input
                                            type="text"
                                            placeholder="请输入姓名"
                                            name="user"
                                            value={user}
                                            onChange={()=>{}}
                                            onFocus={this.setInput.bind(this,"请输入姓名","user")}
                                        />
                                    </li>
                                }
                                {
                                    registerMethod &&
                                    <p>{ver.user.tips}</p>
                                }
                                {
                                    registerMethod &&
                                    <li>
                                        <input
                                            type="text"
                                            placeholder="请输入工号"
                                            name="jobNum"
                                            value={jobNum}
                                            onChange={()=>{}}
                                            onFocus={this.setInput.bind(this,"请输入工号","jobNum")}
                                        />
                                    </li>
                                }
                                {
                                    registerMethod &&
                                    <p>{ver.jobNum.tips}</p>
                                }
                                <li>
                                    <input
                                        type="text"
                                        placeholder="请输入手机号"
                                        name="phone"
                                        value={phone}
                                        onChange={()=>{}}
                                        onFocus={this.setInput.bind(this,"请输入手机号","phone")}
                                    />
                                </li>
                                <p>{ver.phone.tips}</p>
                                <li className="code">
                                    <input
                                        type="text"
                                        placeholder="请输入验证码"
                                        name="code"
                                        value={code}
                                        onChange={()=>{}}
                                        onFocus={this.setInput.bind(this,"请输入验证码","code")}
                                    />
                                    <p className={getCodeFlag?"":"active"} onClick={this.getCode}>{codeBtnText}</p>
                                </li>
                                <p>{ver.code.tips}</p>
                                <li>
                                    <input
                                        type="password"
                                        placeholder="请输入密码"
                                        name="password"
                                        value={password}
                                        onChange={()=>{}}
                                        onFocus={this.setInput.bind(this,"请输入密码","password")}
                                    />
                                </li>
                                <p>{ver.password.tips}</p>
                                <li>
                                    <input
                                        type="password"
                                        placeholder="请输入确认密码"
                                        name="verPassword"
                                        value={verPassword}
                                        onChange={()=>{}}
                                        onFocus={this.setInput.bind(this,"请输入确认密码","verPassword")}
                                    />
                                </li>
                                <p>{ver.verPassword.tips}</p>
                            </ul>
                            <section className="btn">
                                <Button  type="info" onClick={this.submit}>{registerMethod?"注册":"确认"}</Button>
                            </section>
                        </section>

                }
                {
                    getInputData &&
                    <section className="input-mark">
                        <section onKeyUp={(e)=>{
                            if(e.keyCode===13){
                                this.setState({
                                    getInputData:false,
                                    [this.setValue]:e.target.value.trim(),
                                    setInputData:""
                                })
                            }
                        }}>
                            <Input
                                placeholder={placeholder}
                                autoFocus={true}
                                onBlur={this.getInput}
                                value={setInputData}
                                onChange={(value) => {
                                    this.setState({setInputData:value.trim()})
                                }}
                                append={<Button onClick={this.getInput}>确定</Button>}
                            />
                        </section>
                    </section>
                }
                {
                    loading && <Loading text="加载中......" fullscreen={true}/>
                }
            </section>
        )
    }
}