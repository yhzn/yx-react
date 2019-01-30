import React, { Component } from 'react';
import {Header} from "../component/header";
import {MessageBox,Loading} from "element-react";
import BScroll from 'better-scroll';


import {getCookie,delCookie,baseUrl} from "../tool/tool";
import "whatwg-fetch";
import qs from "qs";
export class Home extends Component {
    constructor (props){
        super(props);
        this.state={
            loading:false,
            jumpToFlag:false,
            data:[],
            dataHis:{
                user:"",
                userImg:"",
                options:[]
            },
            options:[
                {value:1,text:"东方医院南院东方医院南院东方医院南院"},
                {value:2,text:"xi"}
            ],
            value:""
        }
        this.hisId=null;
    }
    componentDidMount () {
        this.scroll=new BScroll(this.refs.scroll,{
            scrollY:true,
            click:true,
            probeType:3,
        })
        this.getHisData();

    }
    jumpTo=(id,url,auth,applyAuth,state)=>{

        if(!auth){
            if(state===0){
                MessageBox.alert("该模块待开发，请期待","提示");
                return false;
            }
            if(state===2){
                MessageBox.alert("该模块无权限操作且不予授权申请","提示");
                return false;
            }
            if(this.state.jumpToFlag){
                return false;
            }
            this.setState({jumpToFlag:true});
            MessageBox.confirm(applyAuth?"授权申请已提交，请耐心等待":"无操作权限，如需操作请申请授权",'提示',{
                showCancelButton: false,
                type: 'warning',
                confirmButtonText:applyAuth?"确定":"授权申请",
                confirmButtonClass:applyAuth?null:"applyBtn"
            }).then(action => {
                this.setState({jumpToFlag:false});
                if(!applyAuth){
                   this.getAuth(id);
                }
            }).catch(()=>{
                this.setState({jumpToFlag:false});
            });
            return false;
        }
        if(!!url){
            if(url.indexOf("http")===0){
                window.location.href=url;
            }else{
                this.props.history.push(`${url}/${id}`,null);
            }
        }

    }
    getAuth = (id) => {
        fetch(baseUrl+"system/authorization/apply",{
            method:"post",
            headers:{
                "Content-Type": "application/x-www-form-urlencoded",
                "Token":getCookie("token")
            },
            body:qs.stringify({
                id:id
            })
        })
        .then((response) => {
            this.setState({loading:false});
            if(response.status===200){
                return response.json()
            }
        })
        .then((data)=>{
            if(data.code===0){
                this.getData(this.hisId);
            }
            MessageBox.alert(data.msg);

        })
        .catch(()=>{
            MessageBox.alert("操作失败")
        })
    }

    getHisData = () => {
        let hasCookie = getCookie("token");
        if (hasCookie) {
            this.setState({loading: true});
            fetch(baseUrl + "account/getInfo", {
                headers: {
                    Token: hasCookie
                }
            })
                .then((response) => {
                    if (response.status === 200) {
                        return response.json()
                    }else{
                        MessageBox.msgbox({
                            title: '消息',
                            message: '用户验证失效，请重新登陆',
                            showCancelButton: false
                        }).then(action => {
                            delCookie("token");
                            this.props.history.push( '/',null);
                        })

                    }
                })
                .then((data) => {
                    if (data.code === 0) {
                        this.setState({dataHis: data.msg,value:data.msg.options[0].value});
                        this.hisId=data.msg.options[0].value;
                        return this.hisId;
                    } else {
                        this.setState({loading: false});
                        MessageBox.msgbox({
                            title: '消息',
                            message: '用户验证失效，请重新登陆',
                            showCancelButton: false
                        }).then(action => {
                            delCookie("token");
                            this.props.history.push( '/',null);
                        })

                    }
                })
                .then((id) => {
                    this.getData(id)
                })
                .catch((err) => {
                    this.setState({loading: false});
                    MessageBox.msgbox({
                        title: '消息',
                        message: '用户验证失效，请重新登陆',
                        showCancelButton: false
                    }).then(action => {
                        delCookie("token");
                        this.props.history.push( '/',null);
                    })

                })

        }else{
            this.props.history.push( '/',null);
        }
    }
    getData = (id) => {
        this.setState({loading: true});
        let hasCookie = getCookie("token");
        if(hasCookie){
            fetch(baseUrl+"system/modules?id="+id,
                {
                    headers:{
                        Token:hasCookie
                    }
                })
                .then((response) => {
                    this.setState({loading:false});
                    if(response.status===200){
                        return response.json()
                    }
                })
                .then((data)=>{
                    if(data.code===0){
                        this.setState({data:data.msg});
                        this.timer=setTimeout(()=>{
                            if(!!this.refs.scroll){
                                this.scroll.refresh();
                            }
                            clearTimeout(this.timer)
                        },600)
                    }else{
                        MessageBox.msgbox({
                            title: '消息',
                            message: '用户验证失效，请重新登陆',
                            showCancelButton: false
                        }).then(action => {
                            delCookie("token");
                            this.props.history.push( '/',null);
                        })
                    }
                })
                .catch((err)=>{
                    this.setState({loading:false});
                    MessageBox.msgbox({
                        title: '消息',
                        message: '用户验证失效，请重新登陆',
                        showCancelButton: false
                    }).then(action => {
                        delCookie("token");
                        this.props.history.push( '/',null);
                    })
                })
        }
    }
    selectChange = (value) => {
        this.hisId=value;
        this.getData(value);
    }
    render() {
        return (
            <div className="home-fix">
                <Header title="医信平台" value={this.state.value} options={this.state.dataHis.options} del={true} onSelectChange={this.selectChange}/>
                <div className="home container" ref="scroll">
                    <div>
                        <div className="login-state">
                            <div className="user">
                                <div><img src={this.state.dataHis.userImg} alt=""/></div>
                            </div>
                            <p>{this.state.dataHis.user}</p>
                            <p>你好，你已成功登陆该平台</p>
                        </div>
                        <ul className="sys-list cleanfix">
                            {
                                this.state.data.map((item,index)=>(
                                    <li key={index} className={item.auth?"":"active"} onClick={this.jumpTo.bind(this,item.id,item.href,item.auth,item.applyAuth,item.state)}>
                                        <i className={`icon iconfont ${item.icon}`}> </i>
                                        <p>{item.text}</p>
                                        {item.num?<p className="warn">{item.num}</p>:null}
                                    </li>))
                            }
                        </ul>
                        {
                            this.state.loading && <Loading fullscreen={true} text="数据加载中......" />
                        }
                    </div>
                </div>
            </div>
        );
    }
}
