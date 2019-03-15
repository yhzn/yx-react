import React, { Component } from 'react';
import {Header} from "../component/header";
import {Link} from 'react-router-dom';
import {baseQrUrl, baseKQrl, getUrlParam, getCookie, delCookie} from "../tool/tool";
import {MessageBox,loading} from "element-react";
import qs from "qs";
import {scanInfoData} from "../data/data";

export class Information extends Component {
    constructor (props) {
        super(props);
        this.state={
            data:{},
            loading:true
        }
    }
    componentDidMount () {
        if(scanInfoData.flag){
            this.setState({data:scanInfoData.data})
        }else if(getCookie("scanToken")){
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
                        scanInfoData.data=data.msg;
                        this.setState({data:data.msg})
                    }else{
                        MessageBox.msgbox({
                            title: "提示",
                            message: data.msg,
                            showCancelButton: false
                        }).then(action => {
                            delCookie("scanToken");
                            window.location.href=`${baseKQrl}/#/scansign?qrcode=${getUrlParam("qrcode")}&nId=${getUrlParam("nId")}`

                        })
                    }
                })
                .catch(()=>{
                    this.setState({loading:false})
                    MessageBox.msgbox({
                        title: "提示",
                        message: "数据加载异常",
                        showCancelButton: false
                    }).then(action => {
                        delCookie("scanToken");
                        window.location.href=`${baseKQrl}/#/scansign?qrcode=${getUrlParam("qrcode")}&nId=${getUrlParam("nId")}`
                    })
                })
        }else{
            window.location.href=`${baseKQrl}/#/scansign?qrcode=${getUrlParam("qrcode")}&nId=${getUrlParam("nId")}`
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
                            <li>签到状态：
                                {
                                    data.sStyle==="qd"?
                                        "签到"
                                        :
                                        data.sStyle==="qt"?
                                        "签退"
                                        :
                                        "未签到"
                                }
                            </li>
                            <li>签到时间：{data.qdTime}</li>
                            <li>签退时间：{data.qtTime}</li>
                        </ul>
                    </section>
                    <p><Link to="/HisInfo">查看会议考勤历史记录</Link></p>
                </section>
            </section>
        )
    }
}