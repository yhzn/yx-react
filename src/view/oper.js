import React, { Component } from 'react';
import {Header} from "../component/header";
import BScroll from "better-scroll";
import {MessageBox,Loading} from "element-react";
import {baseUrl, getCookie} from "../tool/tool";
import qs from "qs";

export class Oper extends Component {
    constructor (props) {
        super(props);
        this.state={
            data:[],
            jumpToFlag:false,
            loading:true
        }
        this.perId=this.props.match.params.id
    }
    componentDidMount () {
        this.scroller=new BScroll(this.refs.scroll,{
            scrollY:true,
            click:true,
            probeType:3,
        });
        this.setState({loading:true});
        this.getData(this.perId)
    }
    getData = (id) => {
        this.setState({loading:true});
        fetch(`${baseUrl}system/subModules?id=${id}`,{
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Token": getCookie("token")
            }
        })
            .then((response)=>{
                this.setState({loading:false});
                if (response.status >= 200 && response.status < 300) {
                    return response;
                }
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
                    this.setState({data:data.msg});
                    this.timer=setTimeout(()=>{
                        if(!!this.refs.scroll){
                            this.scroller.refresh()
                        }
                        clearTimeout(this.timer);
                    },100);
                }else{
                    MessageBox.alert(data.msg,"提示")
                }
            })
            .catch((err) => {
                this.setState({loading:false});
                MessageBox.alert("数据加载失败","提示")
            })
    }
    jumpTo = (id,url,auth,applyAuth) => {
        // if(!auth){
        //     if(this.state.jumpToFlag){
        //         return false;
        //     }
        //     this.setState({jumpToFlag:true});
        //     MessageBox.confirm(applyAuth?"授权申请已提交，请耐心等待":"无操作权限，如需操作请申请授权",'提示',{
        //         showCancelButton: false,
        //         type: 'warning',
        //         confirmButtonText:applyAuth?"确定":"授权申请",
        //         confirmButtonClass:applyAuth?null:"applyBtn"
        //     }).then(action => {
        //         this.setState({jumpToFlag:false});
        //         if(!applyAuth){
        //             this.getAuth(id);
        //         }
        //     }).catch(()=>{
        //         this.setState({jumpToFlag:false});
        //     });
        //     return false;
        // }
        if(!!url){
            this.props.history.push(`${url}/${id}`,null);
        }
    }
    getAuth = (id) => {
        this.setState({loading:true});
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
                    this.getData(this.perId);
                    return false;
                }
                MessageBox.alert(data.msg);

            })
            .catch(()=>{
                MessageBox.alert("操作失败")
            })
    }
    render () {
        let {data,loading} = this.state;
        return (
            <section className="oper">
              <Header title="运维处理" />
                <section className="container" ref="scroll">
                    <ul>
                        {
                            data.map((item,index) => (
                                <li className={item.auth?"":"active"} onClick={this.jumpTo.bind(this,item.id,item.href,item.auth,item.applyAuth)} key={index}>
                                    <p>{item.icon}</p>
                                    <p>{item.text}</p>
                                </li>
                            ))
                        }
                    </ul>
                </section>
                {
                    loading && <Loading text="加载中......" fullscreen={true}/>
                }
            </section>
        )
    }
}