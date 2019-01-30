import React, { Component } from 'react';
import {Header} from "../component/header";
import {Input, Button, MessageBox,Loading} from "element-react"
import {getCookie,basePrUrl} from "../tool/tool";
import qs from "qs"
export class Print extends Component {
    constructor (props) {
        super(props);
        this.state={
            toggle:false,
            errMsg:null,
            value:"",
            loading:false,
            data:{},
            reset:true
        }
        this.id=this.props.match.params.id
    }
    search = () => {
        let fpNum=this.state.value.trim();
        if(fpNum===""){
            this.setState({errMsg:"请输入发票号码"});
            return false;
        }
        if(!Number(fpNum)){
            this.setState({errMsg:"输入的发票号码只能为数字"});
            return false;
        }
        this.setState({toggle:false,loading:true,reset:true});
        fetch(`${basePrUrl}reset/find`,{
            method:"post",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Token": getCookie("token")
            },
            body:qs.stringify({
                moduleId:this.id,
                fphm:fpNum
            })
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
                    if(data.msg.length!==0){
                        this.setState({toggle:true,data:data.msg[0]});
                        this.fphm=data.msg[0].fphm;
                    }else{
                        this.setState({errMsg:"查询不到该发票信息，请确认信息是否正确！"});
                    }
                }else{
                    this.setState({errMsg:data.msg});
                }
            })
            .catch((err) => {
                this.setState({loading:false});
                this.setState({errMsg:"数据加载失败"});
            })
    }
    reset = () => {
        this.setState({loading:true});
        fetch(`${basePrUrl}reset/reset`,{
            method:"post",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Token": getCookie("token")
            },
            body:qs.stringify({
                moduleId:this.id,
                fphm:this.fphm
            })
        })
            .then((response) => {
                    this.setState({loading:false});
                    if(response.status===200){
                        return response.json()
                    }
                })
                .then((data) => {
                    if(data.code===0) {
                        this.setState({reset: false});
                    }
                    MessageBox.alert(`发票号为“${this.fphm}”${data.msg}`,"提示");
                })
                .catch((err) => {
                    this.setState({loading:false});
                    MessageBox.alert("发票重置失败","提示");
                })

    }
    render () {
        let {value,toggle,errMsg,loading,data,reset} = this.state;
        return (
            <section className="print">
                <Header title="发票补打重置" />
                <section className="search">
                    <Input
                        placeholder="请输入发票号码"
                        value={value}
                        onFocus={() => {this.setState({value:""})}}
                        onChange={(value)=>{this.setState({value})}}
                        append={
                            <Button type="primary" icon="search" onClick={this.search}>搜索</Button>
                        }
                    />
                </section>
                {
                    toggle?
                        <section>
                            <ul>
                                <li><p>姓&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;名：</p><p>{data.brxm}</p></li>
                                <li><p>卡&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;号：</p><p>{data.mzhm}</p></li>
                                <li><p>发票号码：</p><p>{data.fphm}</p></li>
                                <li><p>打印时间：</p><p>{data.dysj}</p></li>
                                <li><p>类&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;型：</p><p>{data.lx}</p></li>
                            </ul>
                            {
                                reset &&
                                <section className="reset">
                                    <Button type="danger" onClick={this.reset}>重置</Button>
                                </section>
                            }
                        </section>
                        :
                        <section className="err">
                            {errMsg}
                        </section>
                }
                {
                    loading && <Loading text="加载中......" fullscreen={true}/>
                }
            </section>
        )
    }
}