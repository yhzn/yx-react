import React, { Component } from 'react';
import {Header} from "../component/header";
import BScroll from 'better-scroll';
import {MessageBox,Button,Loading} from "element-react";
import {baseRestartUrl,getCookie} from "../tool/tool";
import "whatwg-fetch";
export class Restart extends Component {
    constructor (props) {
        super(props);
        this.state={
            data:[],
            countDown:null,
            loading:false
        }
        this.timer=null;
        this.d=true;
    }
    componentDidMount () {
        this.scroller=new BScroll(this.refs.scroll,{
            scrollY:true,
            click:true,
            probeType:3,
        });
        this.getData();
    }
    getData = () => {
        this.setState({loading:true});
        fetch(`${baseRestartUrl}list?modularId=${this.props.match.params.id}&token=${getCookie("token")}`,{
            // method:"post",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        })
            .then((response)=>{
                if (response.status >= 200 && response.status < 300) {
                    return response;
                }
                const error = new Error(response.statusText);
                error.response = response;
                throw error;
            })
            .then((response) => {
                this.setState({loading:false});
                if(response.status===200){
                    return response.json()
                }
            })
            .then((data) => {
                if(data.code===1){
                    MessageBox.msgbox({
                        title: '消息',
                        message: '无操作权限',
                        showCancelButton: false
                    }).then(action => {
                       this.props.history.goBack();
                    })
                }else{
                    this.setState({data:data.msg});
                        this.timer=setTimeout(()=>{
                            if(!!this.refs.scroll){
                                this.scroller.refresh()
                             }
                             clearTimeout(this.timer);
                        },100);


                }
            })
            .catch((err) => {
                this.setState({loading:false});
                MessageBox.msgbox({
                    title: '消息',
                    message: '数据加载失败',
                    showCancelButton: false
                }).then(action => {
                    this.props.history.goBack();
                })

            })
    }
    restart = (id) => {
        this.setState({loading:true});
        fetch(baseRestartUrl+"restart?id="+id,{
            // method:"post",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        })
            .then((response)=>{
                this.setState({loading:false});
                if (response.status >= 200 && response.status < 300) {
                    return response;
                }
                MessageBox.alert(response.statusText, '提示');
                const error = new Error(response.statusText);
                error.response = response;
                throw error;
        })
            .then((response) => {
                if(response.status===200){
                    return response.json()
                }
            })
            .then((data) => {
                if(data.code===0){
                    MessageBox.alert('系统重启成功', '提示');
                }else{
                    MessageBox.alert(data.msg, '提示');
                }
            })
            .catch((err) => {
                this.setState({loading:false});
                MessageBox.alert('系统重启失败', '提示');
            })
    }
    checkedLog = (id) => {
        this.props.history.push( '/fileList/'+id,null);
    }
    render () {
        let {data,loading} = this.state;
        return (
            <section className="restart">
                <Header title="集成平台重启"/>
                <section className="container" ref="scroll">
                    <section>
                        {
                            data.map((item,index)=>(
                                <ul key={index}>
                                    <li>{item.ip}</li>
                                    <li>{item.text}</li>
                                    <li>
                                        <Button type="warning" onClick={this.restart.bind(this,item.id)}>系统重启</Button>
                                        <Button type="primary" onClick={this.checkedLog.bind(this,item.id)}>重启日志查询</Button>
                                    </li>
                                </ul>
                            ))
                        }
                    </section>
                </section>
                {
                    loading && <Loading text={"加载中，请等待......"} fullscreen={true}/>
                }
            </section>
        )
    }
}