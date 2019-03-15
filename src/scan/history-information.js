import React, { Component } from 'react';
import {MessageBox,Loading} from 'element-react'
import {Header} from "../component/header";
import {DataRange} from "../component/data-range";
import BScroll from 'better-scroll';
import moment from 'moment'
import {baseQrUrl, getCookie} from "../tool/tool";
import {scanInfoData} from "../data/data";
import qs from "qs";
export class HisInfo extends Component {
    constructor (props) {
        super(props);
        this.state={
            data:[],
            userName:"",
            userId:"",
            loading:true,
        }
        this.endTime=new Date();
        this.startTime=new Date(this.endTime.getTime()-7*24*3600*1000);

    }
    componentDidMount () {
        scanInfoData.flag=true;
        this.scroll=new BScroll(this.refs.scroll,{
            scrollY:true,
            click:true,
            probeType:3,
        })
        this.getData(moment(this.startTime).format('YYYY-MM-DD'),moment(this.endTime).format('YYYY-MM-DD'))
    }
    getDateRange = (startTime,endTime) => {
        this.getData(moment(startTime).format('YYYY-MM-DD'),moment(endTime).format('YYYY-MM-DD'))
    }
    getData = (startDate,endDate) => {
        fetch(`${baseQrUrl}vail/signList`,{
            method:"post",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                Token:getCookie("scanToken")
            },
            body: qs.stringify({
                startDate,
                endDate
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
                    this.setState({
                        userName:data.data.userName,
                        userId:data.data.userId,
                        data:data.data.infoList
                    })
                }else{
                    MessageBox.msgbox({
                        title: "提示",
                        message: data.msg,
                        showCancelButton: false
                    }).then(action => {
                        this.props.history.goBack();
                    })
                }
            })
            .catch(()=>{
                this.setState({loading:false});
                MessageBox.msgbox({
                    title: "提示",
                    message: "数据加载异常",
                    showCancelButton: false
                }).then(action => {
                    this.props.history.goBack();
                })
            })
    }
    render () {
        let {data,userName,userId,loading}=this.state;
        return (
            <section>
                <Header title="会议考勤信息查询" />
                <section className="his-info container" ref="scroll">
                    <section>
                        <DataRange
                            onGetDateRange={this.getDateRange}
                            startTime={this.startTime}
                            ndTime={this.endTime}
                        />
                        {
                            data.length===0?
                                <p className="n">
                                    无数据
                                </p>
                                :
                                <section className="user">
                                    <p>
                                        {userName}
                                    </p>
                                    <p>
                                        工号:{userId}
                                    </p>
                                </section>
                        }
                        {
                                data.map((item,index) => (
                                <ul key={index}>
                                    <li>会议名称：{item.sMeetingname}</li>
                                    <li>签到时间：{item.qdTime}</li>
                                    <li>签退时间：{item.qtTime}</li>
                                </ul>

                            ))
                        }

                    </section>
                    {
                        loading && <Loading text="数据加载中......" fullscreen={true}/>
                    }
                </section>
            </section>
        )
    }
}