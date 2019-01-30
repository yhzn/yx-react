import React, { Component } from 'react';
import {Header} from "../component/header";
import {baseQrUrl, getUrlParam,getCookie} from "../tool/tool";
import {MessageBox,loading} from "element-react";
import qs from "qs";

export class Information extends Component {
    constructor (props) {
        super(props);
        this.state={
            data:{},
            loading:true
        }
    }
    componentDidMount () {
        if(getCookie("scanToken")){
            this.setState({loading:true})
            fetch(`${baseQrUrl}vail/sign`,{
                method:"post",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    Token:getCookie("scanToken")
                },
                body: qs.stringify({
                    nid:getUrlParam("nId"),
                    code:getUrlParam("qrcode")
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
                        console.log(data.msg)
                        this.setState({data:data.msg})

                    }else{
                        MessageBox.alert(data.msg,"提示")
                    }
                })
                .catch(()=>{
                    this.setState({loading:false})
                    MessageBox.alert("数据加载异常","提示")
                })
        }else{
            window.location.href=`http://yiliao.chinaforwards.com:8006/#/scansign?qrcode=${getUrlParam("qrcode")}&nId=${getUrlParam("nId")}`
        }
    }
    render () {
        let {data} = this.state;
        return (
            <section>
                <Header title="会议考勤信息"/>
                <section className="information container">
                    <section>
                        <h3>{data.sRecorderName}</h3>
                        <ul>
                            <li>会议名称：{data.sMeetingname}</li>
                            <li>会议地点：{data.sMeetingaddress}</li>
                            <li>开始时间：{data.tStarttime}</li>
                            <li>结束时间：{data.tEndtime}</li>
                            <li>签到状态：{data.sStyle}</li>
                        </ul>
                    </section>
                </section>
            </section>
        )
    }
}