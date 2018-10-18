import $ from "jquery";
import React, { Component } from 'react';
import {Header} from "../component/header";
import {MessageBox,Loading} from "element-react";
import BScroll from 'better-scroll';
import {getCookie,delCookie,baseUrl} from "../tool/tool";
import "whatwg-fetch";
// import qs from "qs";
export class Home extends Component {
    constructor (props){
        super(props);
        this.state={
            elementList:null,
            loading:false,
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
    router=(url,auth)=>{
        if(!auth){
            MessageBox.alert("无操作权限");
            return false;
        }
        window.location.href=url;
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
                    if(response.status==200){
                        return response.json()
                    }
                })
                .then((data)=>{
                    if(data.code==0){
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

        // let hasCookie=getCookie("token");
        // if(hasCookie){
        //     this.setState({loading:true});
        //     let _this=this;
        //     $.ajax({
        //         url:baseUrl+"system/modules",
        //         headers:{
        //             Token:hasCookie
        //         },
        //         success:function (data) {
        //             _this.setState({loading:false});
        //             if(data.code==0){
        //                 _this.setState({data:data.msg});
        //                 _this.setState({elementList:_this.sysList()});
        //                 _this.timer=setTimeout(()=>{
        //                     new BScroll(_this.refs.scroll,{
        //                         scrollY:true,
        //                         click:true,
        //                         probeType:3,
        //                     }).on('scroll',(pos)=>{
        //                     })
        //                     clearTimeout(_this.timer)
        //
        //                 },100)
        //
        //             }else{
        //                 MessageBox.msgbox({
        //                     title: '消息',
        //                     message: '用户验证失效，请重新登陆',
        //                     showCancelButton: false
        //                 }).then(action => {
        //                     delCookie("token");
        //                     _this.props.history.push( '/',null);
        //                 })
        //             }
        //         },
        //         error:function(err){
        //             _this.setState({loading:false});
        //             MessageBox.msgbox({
        //                 title: '消息',
        //                 message: '用户验证失效，请重新登陆',
        //                 showCancelButton: false
        //             }).then(action => {
        //                 delCookie("token");
        //                 _this.props.history.push( '/',null);
        //             })
        //         }
        //     })
        // }else{
        //     this.props.history.push( '/',null);
        //
        // }
    }
    goBack = () => {
        this.props.history.goBack();
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
                <Header goBack={this.goBack} hosiptal={this.state.data.hospital}/>
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
