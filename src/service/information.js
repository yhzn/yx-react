import React, { Component } from 'react';
import {Header} from "../component/header";
import {InputMark} from "../component/input-mark";
import {Button, MessageBox} from 'element-react'
import {validate} from "../tool/validator";
import {baseUrl} from "../tool/tool";
let v={
    ownerUserCard:{
        // required:true,
        // cardId:true,
        input:'userCard',
        name:'身份证号',
    },
    ownerMobile:{
        required:true,
        mobile:true,    // 是否校验数据格式
        input:'phone',
        name:'手机号码'
    },
    ownerMachineNum:{
        // required:true,
        input:'machineNum',
        name:'机器编号'
    },
    ownerRmb:{
        // required:true,
        RMB:true,
        input:'money',
        name:'金额'

    },
    ownerCategory:{
        // required:true,
        input:'name',
        // input:'category',
        name:'缴费类型'
    }

}
export class ServiceInfo extends Component {
    constructor (props) {
        super(props);
        this.state={
            category: '',
            key:"",
            value:"",
            getInputData:false,
            textarea:false,
            userName:"",
            userCard:"",
            phone:"",
            machineNum:"",
            money:"",
            remark:"",
            v
        }
    }
    componentDidMount () {
        this.getUserInfo();
    }
    getUserInfo = () => {
        fetch(`${baseUrl}system/selfHelp/getPatientInformation?cardNo=P02042214&machine=EC24`)
            .then((response) => {
                this.setState({loading:false});
                if(response.status===200){
                    return response.json()
                }
            })
            .then((data)=>{
                if(data.code===0){
                    this.setState({
                        userName:data.data.patientName,
                        userCard:data.data.idCard,
                        machineNum:data.data.machine,
                        category:data.data.busType,
                        money:data.data.money,
                    });

                }else{
                    MessageBox.alert(data.msg,"提示");
                }
            })
            .catch((err)=>{
                this.setState({loading:false});
                MessageBox.alert("数据加载异常","提示");
            })

    }
    setInput = (value,placeholder,text) =>{
        if(value==="money" && this.state.money === 0){
            return false;
        }
        this.setState({getInputData:true,placeholder,key:value,value:this.state[value],textarea:text})
    }
    getInput = (key,value,b) => {

        this.setState({[key]:value,getInputData:b,textarea:false})
    }
    submit = () => {
        if(!validate({ctx:this,key:'v',rules:v})){
            return false;
        }
        this.submitData();
    }
    submitData = () => {
        fetch(`${baseUrl}system/selfHelp/swallowMoney`,
            {
                method:"post",
                headers: {
                    // "Content-Type": "application/x-www-form-urlencoded"
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    patientName:this.state.userName,
                    patientIdCard:this.state.userCard,
                    patientPhone:this.state.phone,
                    machineId:this.state.machineNum,
                    rechargeType:this.state.category,
                    amountOfMoney:this.state.money,
                    remarks:this.state.remark,
                })

            })
            .then((response) => {
                this.setState({loading:false});
                if(response.status===200){
                    return response.json()
                }
            })
            .then((data)=>{
                    MessageBox.alert(data.msg,"提示");

            })
            .catch((err)=>{
                this.setState({loading:false});
                MessageBox.alert("数据加载异常","提示");
            })
    }
    render () {
        let {category,getInputData,placeholder,userCard,machineNum,phone,money,key,value,remark,textarea,v,userName}=this.state;
        return (
            <section>
                <Header title="吞钱留信息"/>
                <section className="service-info container">
                    <ul>
                        <li>{userName}</li>
                        <li>
                            <label>身份证号：<input type="text" name="userCard" value={userCard} placeholder="请输入身份证号" readOnly/></label>
                            <p>{v.ownerUserCard.tips}</p>
                        </li>
                        <li onClick={this.setInput.bind(this,"phone","请输入手机号码")}>
                            <label>手机号码：<input type="text" name="phone" value={phone} placeholder="请输入手机号码" readOnly/></label>
                            <p>{v.ownerMobile.tips}</p>
                        </li>
                        <li>
                            <label>吞钱机器号：<input type="text" name="machineNum" value={machineNum} placeholder="请输入吞钱机器号" readOnly/></label>
                            <p>{v.ownerMachineNum.tips}</p>
                        </li>
                        <li>类型：{category}
                            {/*<Select value={category} placeholder="请选择现金或银行卡" name="name" onChange={(value)=>{this.setState({category:value})}}>*/}
                                {/*{*/}
                                     {/*options.map(el => {*/}
                                        {/*return <Select.Option key={el.value} label={el.label} value={el.value} />*/}
                                     {/*})*/}
                                {/*}*/}
                            {/*</Select>*/}
                            <p>{v.ownerCategory.tips}</p>
                        </li>
                        <li onClick={this.setInput.bind(this,"money","请输入金额")}>
                            <label>金额：<input type="text" name="money" value={money} placeholder="请输入金额" readOnly/>元</label>
                            <p>{v.ownerRmb.tips}</p>
                        </li>
                        <li className="cleanfix" onClick={this.setInput.bind(this,"remark","请输入所需备注内容","textarea")}>
                            <section>备注：</section>
                            <section>{remark}</section></li>
                        <li>
                            <Button type="warning" disabled={true}>补充值</Button>
                            <Button type="info" onClick={this.submit}>提 交</Button>
                        </li>
                    </ul>
                </section>
                {
                    getInputData &&
                    <InputMark
                        onGetInput={this.getInput}
                        placeholder={placeholder}
                        value={value}
                        k={key}
                        textarea={textarea}/>
                }
            </section>
        )
    }

}