import React, { Component } from 'react';
import {SelectHospital} from '../component/select';
import {Button,Loading,MessageBox} from "element-react";
import {getCodeTime,baseUrl,getUrlParam} from "../tool/tool";
import {validate} from "../tool/validator";
import {InputMark} from "../component/input-mark";
import qs from 'qs';
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
            errHospital:"",
            loading:false,
            options: [],
            card:"",
            cardId:"",
            mobile:!!getUrlParam("mobile"),
            v:{
                hospital:{
                    input:'name',
                    name:'院区',
                },
                cardId:{
                    required:true,
                    cardId:true,
                    input:'cardId',
                    name:'身份证号',
                },
                card:{
                    required:true,
                    input:'card',
                    name:'卡号',
                },
                user:{
                    required:true,
                    input:'user',
                    name:'用户名'
                },
                phone:{
                    required:true,
                    mobile:true,    // 是否校验数据格式
                    input:'phone',
                    name:'手机号码'
                },
                code:{
                    required:true,
                    input:'code',
                    name:'验证码'
                },
                newPassWord:{
                    required:true,
                    password:true,
                    input:'newPassWord',
                    name:'密码'

                },
                surePassWord:{
                    required: ()=> {
                        return !(this.state.newPassWord!=="" && this.state.surePassWord!=="");
                    },
                    tipsText: ()=> {
                        return "两次密码输入不一致，请确认新密码！"
                    },
                    customizeTip: ()=> {
                        return (this.state.newPassWord!==this.state.surePassWord && this.state.surePassWord!=="");
                    },
                    input:'surePassWord',
                    name:'确认密码'
                }

            }

        };
        this.scrollFlag=true;
        this.mobile=getUrlParam("mobile");
    }
    componentDidMount () {
        if(this.props.match.params.id==="1"){
            if(!this.state.mobile){
                this.setState({
                    v:{
                        hospital:{
                            required:true,
                            input:'name',
                            name:'院区',
                        },
                        user:{
                            required:true,
                            input:'user',
                            name:'用户名'
                        },
                        phone:{
                            required:true,
                            mobile:true,    // 是否校验数据格式
                            input:'phone',
                            name:'手机号码'
                        },
                        code:{
                            required:true,
                            input:'code',
                            name:'验证码'
                        },
                        newPassWord:{
                            required:true,
                            password:true,
                            input:'newPassWord',
                            name:'密码'

                        },
                        surePassWord:{
                            required: ()=> {
                                return !(this.state.newPassWord!=="" && this.state.surePassWord!=="");
                            },
                            tipsText: ()=> {
                                return "两次密码输入不一致，请确认新密码！"
                            },
                            customizeTip: ()=> {
                                return (this.state.newPassWord!==this.state.surePassWord && this.state.surePassWord!=="");
                            },
                            input:'surePassWord',
                            name:'确认密码'
                        }

                    }
                })
                fetch(baseUrl+"hospital/getList")
                    .then((response) => {
                        this.setState({loading:false});
                        if(response.status===200){
                            if(response.headers.get('content-type').indexOf("text/html")===0){
                                return [];
                            }else{
                                return response.json();
                            }
                        }
                    })
                    .then((data) => {
                        this.setState({options:data});
                    })
            }
            this.setState({
                registerMethod:true,
            })
        }else{
            this.setState({
                registerMethod:false,
                v:{
                    phone:{
                        required:true,
                        mobile:true,    // 是否校验数据格式
                        input:'phone',
                        name:'手机号码'
                    },
                    code:{
                        required:true,
                        input:'code',
                        name:'验证码'
                    },
                    newPassWord:{
                        required:true,
                        password:true,
                        input:'newPassWord',
                        name:'密码'

                    },
                    surePassWord:{
                        required: () => {
                            return !(this.state.newPassWord!=="" && this.state.surePassWord!=="");
                        },
                        tipsText: () => { // 自定义提示
                            return "两次密码输入不一致，请确认新密码！"
                        },
                        customizeTip: ()=> { // 是否需要自定义提示
                            return (this.state.newPassWord!==this.state.surePassWord && this.state.surePassWord!=="");
                        },
                        input:'surePassWord',
                        name:'确认密码'
                    }

                }
            })
        }
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
                    // this.goBack();
                    break;
                default :
                    MessageBox.alert(data.msg,"提示");
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
    }
    getCode = () => {
        let url=baseUrl+"verifyCode/sendCode_register";
        if(this.state.registerMethod && this.state.mobile){
            url=baseUrl+"verifyCode/sendCode_patientRegister";
        }
        if(!this.state.registerMethod && !this.state.mobile){
            url=baseUrl+"verifyCode/sendCode_changepassword";
        }
        if(!this.state.registerMethod && this.state.mobile){
            url=baseUrl+"verifyCode/sendCode_patient_change_password"
        }
        let parameter={
            phoneNum:this.state.phone
        }
        getCodeTime(this,url,parameter);
    }
    submit = () => {
        if(!validate({ctx:this,key:'v',rules:this.state.v})){
            return false;
        }
        let url=baseUrl+"account/register";
        let parameter={}
        if(this.state.registerMethod) {
            if(!this.state.mobile){
                parameter={
                    id:this.state.hospital,
                    user:this.state.user,
                    phoneNum:this.state.phone,
                    code:this.state.code,
                    password:this.state.newPassWord
                }

            }else{
                url=baseUrl+"system/patientRegister/register";
                parameter={
                    patientName:this.state.user,
                    patientIdCard:this.state.cardId,
                    patientPhone:this.state.phone,
                    password:this.state.newPassWord,
                    code:this.state.code,
                    card:this.state.card
                }
            }

        }else{
            if(!this.state.mobile){
                url=baseUrl+"account/changepassword";
            }else{
                url=baseUrl+"system/patientRegister/updatePassword"
            }
            parameter={
                phoneNum:this.state.phone,
                code:this.state.code,
                password:this.state.newPassWord
            }

        }
        this.getData(url,parameter);
    }
    goBack = () => {
        this.props.history.goBack();
    }
    scrollTop = (start,end,f=-1) => {
        let speed=5;
        let height=start;
        this.timer=setInterval(()=>{
            if(f<0){
                height+=(f*speed);
                this.refs.register.style.marginTop=height+"px";
                if(f*height>=end){
                    clearInterval(this.timer);
                }
            }else{
                height-=speed;
                this.refs.register.style.marginTop=-1*height+"px";
                if(height<=0){
                    this.refs.register.style.marginTop="0px";
                    clearInterval(this.timer);
                }
            }

        },60/1000)
    }
    toTop = (e) => {
        if(this.setTimeO){
            clearTimeout(this.setTimeO);
        }
        if(this.scrollFlag){
            this.scrollFlag=false;
            this.scrollTop(0,(this.refs.register.offsetHeight/2)-50);
        }

    }
    setInput = (value,placeholder,text) =>{
        this.setState({getInputData:true,placeholder,key:value,value:this.state[value],textarea:text})
    }
    getInput = (key,value,b) => {
        this.setState({[key]:value,getInputData:b,textarea:false})
    }
    render () {
        let {registerSuccess,registerMethod,options,hospital,user,getInputData,getCodeFlag,codeBtnText,code,newPassWord,surePassWord,phone,placeholder,value,key,textarea,v,errCode,errPhone,loading,mobile,card,cardId} = this.state;
        return (
                <section className="register" ref="register">
                    {
                        registerSuccess?
                            <section>
                                <section className="success">
                                    <p>
                                        注册成功
                                    </p>
                                </section>
                                <Button type="success" size="large" onClick={this.goBack}>返回</Button>
                            </section>
                            :
                            <section>
                                <header>
                                    <i className="el-icon-arrow-left" onClick={this.goBack} />
                                    <h3>{registerMethod?"新用户注册":"找回密码"}</h3>
                                </header>
                                <ul>
                                    {
                                        registerMethod && mobile &&
                                        <li  onClick={this.setInput.bind(this,"card","请输入卡号")}>
                                            <label><input type="text" name="card" placeholder="卡号" value={card} readOnly/></label>
                                            <p className="err">{v.card.tips}</p>
                                        </li>
                                    }
                                    {
                                        registerMethod && mobile &&
                                        <li  onClick={this.setInput.bind(this,"cardId","请输入身份证号")}>
                                            <label><input type="text" name="cardId" placeholder="身份证号" value={cardId} readOnly/></label>
                                            <p className="err">{v.cardId.tips}</p>
                                        </li>
                                    }
                                    {
                                        registerMethod && !mobile &&
                                            <li className="select">
                                                <SelectHospital onSelectChange={this.selectChange} value={hospital} options={options}/>
                                                <p className="err">{v.hospital.tips}</p>
                                            </li>

                                    }
                                    {
                                        registerMethod &&
                                            <li  onClick={this.setInput.bind(this,"user","请输入姓名")}>
                                                <label><input type="text" name="user" placeholder="姓名" value={user} readOnly/></label>
                                                <p className="err">{v.user.tips}</p>
                                            </li>

                                    }
                                    <li onClick={this.setInput.bind(this,"phone","请输入手机号")}>
                                        <label><input type="text" name="phone" placeholder="手机号" value={phone} readOnly/></label>
                                        <p className="err">{v.phone.tips||errPhone}</p>
                                    </li>
                                    <li className="code">
                                        <input type="text" name="code" placeholder="验证码" value={code}  onClick={this.setInput.bind(this,"code","请输入验证码")} readOnly/>
                                        <p className={`get-code ${getCodeFlag?"":"active"}`} onClick={this.getCode}>{codeBtnText}</p>
                                        <p className="err">{v.code.tips||errCode}</p>

                                    </li>

                                    <li onClick={this.setInput.bind(this,"newPassWord","请输入新密码")}>
                                        <label><input type="password" name="newPassWord" placeholder="请输入新密码" value={newPassWord} readOnly/></label>
                                        <p className="err">{v.newPassWord.tips}</p>
                                    </li>
                                    <li onClick={this.setInput.bind(this,"surePassWord","请确认新密码")}>
                                        <label><input type="password" name="surePassWord" placeholder="请确认新密码" value={surePassWord} readOnly /></label>
                                        <p className="err">{v.surePassWord.tips}</p>
                                    </li>

                                    <li>
                                        <Button type="info"  onClick={this.submit}>{registerMethod?"发送":"确认"}</Button>
                                    </li>
                                </ul>
                            </section>
                    }
                    {
                        getInputData &&
                        <InputMark onGetInput={this.getInput} placeholder={placeholder} value={value} k={key} textarea={textarea}/>
                    }
                    {
                        loading &&
                        <Loading fullscreen={true} text="登陆中......" />
                    }
                </section>
        )
    }
}