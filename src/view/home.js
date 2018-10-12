import React, { Component } from 'react';
import {Header} from "../component/header";
import {MessageBox,Loading} from "element-react";
import BScroll from 'better-scroll';
import {getCookie,delCookie} from "../tool/tool";
import "whatwg-fetch";
export class Home extends Component {
    constructor (props){
        super(props);
        this.state={
            elementList:null,
            loading:false,
            data:{
                user:"小明",
                userImg:"https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=773579743,2271149885&fm=26&gp=0.jpg",
                hospital:"东方",
                system:[
                {
                    href:'',
                    auth:true,
                    icon:'icon-xitongjiaoseyingyong',
                    text:'总值班系统'
                },
                {
                    href:'',
                    auth:true,
                    icon:'icon-xitongguanli-',
                    text:'服务器监控'
                },
                {
                    href:'',
                    auth:false,
                    icon:'icon-caozuoxitong',
                    text:'危急值管理'
                },
                {
                    href:'',
                    auth:false,
                    icon:'icon-apixitongrizhi',
                    text:'病例管理'
                },
                {
                    href:'',
                    auth:false,
                    icon:'icon-drgspingtairuanjianxitong37',
                    text:'委员会投票'
                },
                {
                    href:'',
                    auth:false,
                    icon:'icon-xitongguanli',
                    text:'系统设置'
                },
                {
                    href:'',
                    auth:false,
                    icon:'icon-xitongpeizhi',
                    text:'自动巡检'
                },
                {
                    href:'',
                    auth:false,
                    icon:'icon-navicon-xtpz',
                    text:'运维处理'
                }
            ]
            }
        }
    }
    componentDidMount () {
        let hasCookie=getCookie("token");
        if(hasCookie){
            this.setState({loading:true});
            fetch("/httpzhuye?"+hasCookie)
                .then((response) => {
                    this.setState({loading:false});
                    if(response.status==200){
                        return response.json()
                    }
                })
                .then((data)=>{
                    if(data.code=="0"){
                        this.setState({data:data});
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
        }

    }
    router=(url,auth)=>{
        if(!auth){
            MessageBox.alert("无操作权限");
            return false;
        }
        window.location.href=url;
    }
    getData = () => {

    }
    sysList () {
        const liElement=this.state.data.system.map((item,index)=>(
            <li key={index} className={item.auth?"":"active"} onClick={this.router.bind(this,item.href,item.auth)}>
                <i className={`icon iconfont ${item.icon}`}> </i>
                <p>{item.text}</p>
            </li>)
        );
        return liElement;
    }
    render() {
        return (
            <div>
                <Header hosiptal={this.state.data.hospital}/>
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
