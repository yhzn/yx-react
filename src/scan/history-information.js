import React, { Component } from 'react';
import {MessageBox,Loading} from 'element-react'
import {Header} from "../component/header";
import {DataRange} from "../component/data-range";
import BScroll from 'better-scroll';
import moment from 'moment'
import {baseQrUrl, getCookie,getUrlParam} from "../tool/tool";
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
            endTime:new Date(),
            startTime:new Date(new Date().getTime()-7*24*3600*1000)
        }

        this.openId=this.props.match.params.id;

    }
    componentDidMount () {
        scanInfoData.flag=true;
        this.scroll=new BScroll(this.refs.scroll,{
            scrollY:true,
            click:true,
            probeType:3,
        })
        if(this.openId!=="null" && this.openId){
            this.getData(`${baseQrUrl}vail/signListByOpenId`,{
              startDate:moment(this.state.startTime).format('YYYY-MM-DD'),
              endDate:moment(this.state.endTime).format('YYYY-MM-DD'),
              openId:this.openId
            })
        }else{
            this.getData(`${baseQrUrl}vail/signList`,{
              startDate:moment(this.state.startTime).format('YYYY-MM-DD'),
              endDate:moment(this.state.endTime).format('YYYY-MM-DD')
            },getCookie("scanToken"))
        }
    }
    getDateRange = (startTime,endTime) => {
        if(this.openId){
            this.getData(`${baseQrUrl}vail/signListByOpenId`,{
              startDate:moment(startTime).format('YYYY-MM-DD'),
              endDate:moment(endTime).format('YYYY-MM-DD'),
              openId:this.openId

            })
        }else{
            this.getData(`${baseQrUrl}vail/signList`,{
              startDate:moment(startTime).format('YYYY-MM-DD'),
              endDate:moment(endTime).format('YYYY-MM-DD')
            },getCookie("scanToken"))
        }
        this.setState({
            endTime,
            startTime
        })
    }
    getData = (url,parameter,t="") => {
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
        let {data,userName,userId,loading,startTime,endTime}=this.state;
        return (
            <section>
                <Header title="会议考勤信息查询" />
                <section className="his-info container" ref="scroll">
                    <section>
                        <DataRange
                            onGetDateRange={this.getDateRange}
                            startTime={startTime}
                            endTime={endTime}
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
                                    <li>会议名称：{item.meetName}</li>
                                    <li>签到时间：{item.signInDateTime}</li>
                                    <li>签退时间：{item.signOutDateTime}</li>
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