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
            loading:true,
            reload:true,
            title:null,
        }
        this.timer=null;
        this.d=true;
        this.id=this.props.match.params.id.split("-");

    }
    componentDidMount () {
        this.scroller=new BScroll(this.refs.scroll,{
            scrollY:true,
            click:true,
            probeType:3,
        });
        switch (this.id[1]){
            case "1":
                this.setState({title:"集成平台重启"});
                break;
            case "2":
                this.setState({title:"服务重启"});
                break;
        }


        this.getData();
    }
    getData = () => {
        this.setState({loading:true,reload:false});
        fetch(`${baseRestartUrl}list?modularId=${this.id[0]}&token=${getCookie("token")}&restartSign=${this.id[1]}`,{
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
                        this.getDatatimer=setTimeout(()=>{
                            clearTimeout(this.getDatatimer);
                            this.getData();
                        },50000)
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
    restart = (id,flag,text,index) => {
        if(flag!==0){
            return false;
        }
        let data=this.state.data;
        data[index].flag=1;
        this.setState({data});
        fetch(baseRestartUrl+"restart?id="+id,{
            // method:"post",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        })
    }
    checkedLog = (id) => {
        this.props.history.push( '/fileList/'+id,null);
    }
    render () {
        let {data,loading,reload,title} = this.state;
        return (
            <section className="restart">
                <Header title={title}/>
                <section className="container" ref="scroll">
                    <section>
                        {
                            data.map((item,index)=>(
                                <ul key={index}>
                                    <li>{item.ip}</li>
                                    <li>{item.text}</li>
                                    <li>
                                        <Button type="warning" loading={item.flag!==0} onClick={this.restart.bind(this,item.id,item.flag,item.text,index)}>{item.flag!==0?"系统重启中，请等待":"系统重启,约需 120s"}</Button>
                                        <Button type="primary" onClick={this.checkedLog.bind(this,item.id)}>重启日志查询</Button>
                                    </li>
                                </ul>
                            ))
                        }
                    </section>
                </section>
                {
                    reload && loading && <Loading text={"加载中，请等待......"} fullscreen={true}/>
                }
            </section>
        )
    }
}