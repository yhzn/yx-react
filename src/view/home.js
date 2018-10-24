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
            elementList:null,
            loading:false,
            jumpToFlag:false,
            data:{
                user:"",
                userImg:"",
                hospital:"",
                system:[]
            }
        }
    }
    componentDidMount () {
        this.getData();

    }
    jumpTo=(id,url,auth,index)=>{
        if(this.state.jumpToFlag){
           return false;
        }
        this.setState({jumpToFlag:true});
        if(!auth){
            let applyAuth=this.state.data.system[index].applyAuth;
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
            });
            return false;
        }
        if(this.state.data.system[index].text==="系统设置"){
            this.props.history.push( '/auth',null);
            return false;
        }
        window.location.href=url;
    }
    getAuth = (id) => {
        fetch(baseUrl+"system/authorization/apply",{
            method:"post",
            headers:{
                "Content-Type": "application/x-www-form-urlencoded",
                Token:getCookie("token")
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
                this.getData();
                MessageBox.alert(data.msg)
            }else{
                MessageBox.alert(data.msg)
            }
        })
        .catch(()=>{
            MessageBox.alert("操作失败")
        })
    }
    getData = () => {
        let hasCookie=getCookie("token");
        if(hasCookie){
            this.setState({loading:true});
            fetch(baseUrl+"system/modules",
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
                        this.setState({elementList:this.sysList()});
                        this.timer=setTimeout(()=>{
                            new BScroll(this.refs.scroll,{
                                scrollY:true,
                                click:true,
                                probeType:3,
                            }).on('scroll',(pos)=>{
                            })
                            clearTimeout(this.timer)

                        },100)

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
        }else{
            this.props.history.push( '/',null);

        }
    }
    goBack = () => {
        this.props.history.goBack();
    }
    sysList () {
        const liElement=this.state.data.system.map((item,index)=>(
            <li key={index} className={item.auth?"":"active"} onClick={this.jumpTo.bind(this,item.id,item.href,item.auth,index)}>
                <i className={`icon iconfont ${item.icon}`}> </i>
                <p>{item.text}</p>
                {item.num?<p className="warn">{item.num}</p>:null}
            </li>)
        );
        return liElement;
    }
    render() {
        return (
            <div>
                <Header goBack={this.goBack} hosiptal={this.state.data.hospital} title="医信平台"/>
                <div className="home container" ref="scroll">
                    <div>
                        <div className="login-state">
                            <div className="user">
                                <div><img src={this.state.data.userImg} alt=""/></div>
                            </div>
                            <p>{this.state.data.user}</p>
                            <p>你好，你已成功登陆该平台</p>
                        </div>
                        <ul className="sys-list cleanfix">
                            {this.state.elementList}
                        </ul>
                        {
                            this.state.loading?
                                <Loading fullscreen={true} text="数据加载中......"></Loading>:null
                        }
                    </div>
                </div>
            </div>
        );
    }
}
