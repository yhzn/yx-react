import React, { Component } from 'react';
import {Header} from "../component/header";
import {MessageBox,Button,Loading,Pagination} from "element-react";
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
            currentPage:1,
            totalPage:1,
            solveMsgPage:1,
            solveMsgTotalPage:1,
            queueMsgPage:1,
            queueMsgTotalPage:1,
            hasCookie:getCookie("token")
        }
    }
    componentDidMount () {
        this.scroll=new BScroll(this.refs.scroll,{
            scrollY:true,
            click:true,
            probeType:3,
        });
        this.scroll.on("scroll",(pos)=>{
            // console.log(1)
        });
        this.getSolveData(this.state.solveMsgPage);
        this.getQueueData(this.state.queueMsgPage);
    }

    toggleTab = (boolean) => {
        if(boolean){
            this.setState({
                toggleTab:true,
                currentPage:this.state.solveMsgPage,
                totalPage:this.state.solveMsgTotalPage
            });
        }else{
            this.setState({
                toggleTab:false,
                currentPage:this.state.queueMsgPage,
                totalPage:this.state.queueMsgTotalPage
            });
        }
    }
    sureAuth = (id,pass,user,msg) => {
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
                this.getSolveData(this.state.solveMsgPage);
                this.getQueueData(this.state.queueMsgPage);
                switch (pass){
                    case 0:
                        MessageBox.alert(`"${user}"${msg}的权限未审核通过，如需重新授权，请在“已处理”进行确认授权`);
                        break;
                    case 1:
                        MessageBox.alert(`"${user}"${msg}已审核通过`);
                        break;
                    case 2:
                        MessageBox.alert(`"${user}"${msg}的权限已取消`);
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
    getQueueData = (page) => {
        fetch(baseUrl+"system/authorization/preprocess?page="+page,{
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
                this.setState({
                    queueMsg:data.msg.preprocess,
                    waitNum:data.msg.num,
                    queueMsgPage:page,
                    queueMsgTotalPage:data.msg.totalPage,
                });
                this.qTimer=setTimeout(()=>{
                    if(!!this.refs.scroll){
                        this.scroll.refresh();
                    }
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
    getSolveData = (page) => {
        // this.setState({loading:true});
        // baseUrl+"system/authorization/processed"
        fetch(baseUrl+"system/authorization/processed?page="+page,{
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
                 this.setState({
                     solveMsg:data.msg.processed,
                     solveMsgPage:page,
                     solveMsgTotalPage:data.msg.totalPage,
                 });
                 this.sTimer=setTimeout(()=>{
                     if(!!this.refs.scroll){
                         this.scroll.refresh();
                     }
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
    getPageData = (page) => {
        if(this.state.toggleTab){
            this.getSolveData(page);
        }else{
            this.getQueueData(page);
        }
    }

    render () {
        let {toggleTab,solveMsg,queueMsg,waitNum,currentPage,totalPage} = this.state;
        return (
            <section className="auth">
                <Header title="医信平台"/>
                <section className="tab">
                    <section className={toggleTab?"active":""} onClick={this.toggleTab.bind(this,true)}>已处理</section>
                    <section className={toggleTab?"":"active"} onClick={this.toggleTab.bind(this,false)}>
                        待处理{waitNum!==0?<span>{waitNum}</span>:null}
                    </section>
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
                                                <Button type="info" onClick={this.sureAuth.bind(this,item.id,2,item.user,item.describe)}>取消授权</Button>
                                                :
                                                <Button type="danger" onClick={this.sureAuth.bind(this,item.id,1,item.user,item.describe)}>确认授权</Button>
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
                                            <Button onClick={this.sureAuth.bind(this,item.id,0,item.user,item.describe)}>暂不授权</Button>
                                            <Button type="danger" onClick={this.sureAuth.bind(this,item.id,1,item.user,item.describe)}>确认授权</Button>
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
                {totalPage>1?
                    <section className="page">
                        <Pagination layout="prev, pager, next" currentPage={currentPage} pageSize={1} total={totalPage} onCurrentChange={this.getPageData}/>
                    </section>
                    :
                    null
                }
                {
                    this.state.loading?
                        <Loading fullscreen={true} text="操作处理中......" />:null
                }
            </section>
        )
    }
}