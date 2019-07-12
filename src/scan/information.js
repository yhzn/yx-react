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
        }else if(getUrlParam("openId")!=="null"&&getUrlParam("openId")){
            this.getData(`${baseQrUrl}vail/signByOpenId`,{
                nid:getUrlParam("nId"),
                code:getUrlParam("qrcode"),
                openId:getUrlParam("openId")
            });
        }else if(getUrlParam("nId")==="null"||!getUrlParam("nId")||getUrlParam("qrcode")==="null"||!getUrlParam("qrcode")){
            this.setState({data:{}});

        }else if(getCookie("scanToken")){
            this.getData(`${baseQrUrl}vail/sign`,{
                nid:getUrlParam("nId"),
                code:getUrlParam("qrcode")
            },getCookie("scanToken"))
        }else{
            window.location.href=`${baseKQrl}/#/scansign?qrcode=${getUrlParam("qrcode")}&nId=${getUrlParam("nId")}&openId=${getUrlParam("openId")}`
        }
    }
    getData = (url,parameter,t="") =>{
        this.setState({loading:true})
        fetch(url,{
            method:"post",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                Token:t
            },
            body: qs.stringify(parameter)
        })
            .then((response) => {
                this.setState({loading:false});
                if(response.status===200){

                    return response.json()
                }
            })
            .then((data)=>{
                if(data.code===0){
                    scanInfoData.data=data.data;
                    this.setState({data:data.data})
                }else{
                    MessageBox.msgbox({
                        title: "提示",
                        message: data.msg,
                        showCancelButton: false
                    }).then(action => {
                        delCookie("scanToken");
                        window.location.href=`${baseKQrl}/#/scansign?qrcode=${getUrlParam("qrcode")}&nId=${getUrlParam("nId")}&openId=${getUrlParam("openId")}`

                    })
                }
            })
            .catch((err)=>{
                this.setState({loading:false});
                    MessageBox.msgbox({
                        title: "提示",
                        message: "数据加载异常",
                        showCancelButton: false
                    }).then(action => {
                        delCookie("scanToken");
                        window.location.href=`${baseKQrl}/#/scansign?qrcode=${getUrlParam("qrcode")}&nId=${getUrlParam("nId")}&openId=${getUrlParam("openId")}`
                    })
            })
    }
    render () {
        let {data} = this.state;
        return (
            <section>
                <Header title="会议考勤信息"/>
                <section className="information container">
                    {
                        <section>
                            <h3>{data.personnelName}</h3>
                            <ul>
                                <li>会议名称：{data.meetName}</li>
                                <li>会议地点：{data.meetAddress}</li>
                                <li>开始时间：{data.meetStartDateTime}</li>
                                <li>结束时间：{data.meetEndDateTime}</li>
                                <li>签到状态：{data.checkResult}</li>
                                <li>签到时间：{data.signInDateTime}</li>
                                <li>签退时间：{data.signOutDateTime}</li>
                            </ul>
                        </section>
                    }
                    <p>
                        <Link to={`/HisInfo/${getUrlParam("openId")}`}>查看个人会议考勤记录</Link>
                    </p>
                    <p>
                        <Link to={`/infohistory`}>查看全部会议考勤记录</Link>
                    </p>
                </section>
            </section>
        )
    }
}