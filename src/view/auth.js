import React, { Component } from 'react';
import {Header} from "../component/header";
import {MessageBox,Button,Loading} from "element-react";
import BScroll from 'better-scroll';
import {baseUrl,getCookie} from "../tool/tool";
import "whatwg-fetch";
import qs from "qs";

export class Auth extends Component {
    constructor ( props ) {
        super(props);
        this.state={
            toggleTab:true,
            solveMsg:[],
            queueMsg:[],
            waitNum:0,
            loading:false,
            hasCookie:getCookie("token")
        }
    }
    componentDidMount () {
        this.timer=setTimeout(()=>{
            new BScroll(this.refs.scroll,{
                scrollY:true,
                click:true,
                probeType:3,
            }).on('scroll',(pos)=>{
            })
            clearTimeout(this.timer)

        },100)
        this.getSolveData();
        this.getQueueData();

    }
    toggleTab = (boolean) => {
        if(boolean){
            this.setState({toggleTab:true});
        }else{
            this.setState({toggleTab:false});
        }
    }
    goBack = () =>{
        this.props.history.goBack();
    }
    sureAuth = (id,pass) => {
        if(this.state.loading){
            return false;
        }
        this.setState({loading:true});
        fetch(baseUrl+"system/authorization/check",{
            method:"post",
            headers:{
                "Content-Type": "application/x-www-form-urlencoded",
                Token:this.state.hasCookie
            },
            body:qs.stringify({
                id:id,
                pass:pass
            })
        })
        .then((response)=>{
            this.setState({loading:false});
            if(response.status===200){
                return response.json()
            }
        })
        .then((data)=>{
            if(data.code===0){
                this.getSolveData();
                this.getQueueData();
                switch (pass){
                    case 0:
                        MessageBox.alert("处理完成");
                        break;
                    case 1:
                        MessageBox.alert("该人以添加操作权限");
                        break;
                    case 2:
                        MessageBox.alert("该人员操作权限以取消");
                        break;
                    default :
                        MessageBox.alert(data.msg);
                        break;
                }
            }else{

                MessageBox.alert(data.msg);
            }
        })
        .catch((err)=>{
            this.setState({loading:false});
            MessageBox.alert("操作失败");
        })
    }
    getQueueData = () => {
        // baseUrl+"system/authorization/preprocess"
        // this.setState({loading:true});
        fetch(baseUrl+"system/authorization/preprocess",{
            headers:{
                Token:this.state.hasCookie
            }
        })
        .then((response)=>{
            // this.setState({loading:false});
            if(response.status===200){
                return response.json()
            }
        })
        .then((data)=>{
            if(data.code===0){
                this.setState({queueMsg:data.msg.preprocess,waitNum:data.msg.num});
                this.qTimer=setTimeout(()=>{
                     this.timer.refresh();
                     clearTimeout(this.qTimer);
                },600);
            }
            else{
                MessageBox.alert(data.msg);

            }
        })
        .catch(()=>{
            // this.setState({loading:false});
            MessageBox.alert("数据获取失败");
        })
    }

    getSolveData = () => {
        // this.setState({loading:true});
        // baseUrl+"system/auth/processed"
        fetch(baseUrl+"system/authorization/processed",{
             headers:{
                 Token:this.state.hasCookie
             }
         })
         .then((response)=>{
             // this.setState({loading:false});
             if(response.status===200){
                 return response.json()
             }
         })
         .then((data)=>{
             if(data.code===0){
                 this.setState({solveMsg:data.msg.processed})
                 this.sTimer=setTimeout(()=>{
                     this.timer.refresh();
                     clearTimeout(this.sTimer);
                 },600);
             }else{
                 MessageBox.alert(data.msg);
             }
         })
         .catch(()=>{
             // this.setState({loading:false});
             MessageBox.alert("数据获取失败");
         })
    }
    render () {
        let {toggleTab,solveMsg,queueMsg,waitNum} = this.state;
        return (
            <section className="auth">
                <Header goBack={this.goBack} title="医信平台"/>
                <section className="tab">
                    <section className={toggleTab?"active":""} onClick={this.toggleTab.bind(this,true)}>以处理</section>
                    <section className={toggleTab?"":"active"} onClick={this.toggleTab.bind(this,false)}>待处理{waitNum!==0?<span>{waitNum}</span>:null} </section>
                </section>
                <section className="auth-container" ref="scroll">
                    {toggleTab?
                        <section className="scroll">
                            {   solveMsg.length!==0?
                                solveMsg.map((item,index)=>(
                                    <section className="auth-list" key={index}>
                                        <section className={`auth-list-container ${item.state?"pass":""}`} >
                                            <section>
                                                <p><sup>{item.date.split("-")[2]}</sup><span>/</span><sub>{item.date.split("-")[1]}</sub></p>
                                                <p>{item.date.split("-")[0]}年</p>
                                            </section>
                                            <section>
                                                <p>{item.user}</p>
                                                <p>{item.phoneNum}</p>
                                                <p>{item.describe}</p>
                                            </section>
                                        </section>
                                        {
                                            item.state?
                                                <Button type="info" onClick={this.sureAuth.bind(this,item.id,2)}>取消授权</Button>
                                                :
                                                <Button type="danger" onClick={this.sureAuth.bind(this,item.id,1)}>确认授权</Button>
                                        }
                                    </section>
                                ))
                                :
                                <section className="no-data">
                                    <p>无处理事项......</p>
                                </section>
                            }
                        </section>
                        :
                        <section className="scroll">
                            {   queueMsg.length!==0?
                                queueMsg.map((item,index)=>(
                                    <section className="auth-list wait-list" key={index}>
                                        <section>
                                            <p>{item.user}</p>
                                            <p>{item.phoneNum}</p>
                                            <p>{item.describe}</p>
                                        </section>
                                        <section>
                                            <Button onClick={this.sureAuth.bind(this,item.id,0)}>暂不授权</Button>
                                            <Button type="danger" onClick={this.sureAuth.bind(this,item.id,1)}>确认授权</Button>
                                        </section>
                                    </section>
                                ))
                                :
                                <section className="no-data">
                                    <p>无处理事项......</p>
                                </section>
                            }
                        </section>
                    }

                </section>
                {
                    this.state.loading?
                        <Loading fullscreen={true} text="操作处理中......"></Loading>:null
                }
            </section>
        )
    }
}