import React, { Component } from 'react';
import {Header} from "../component/header";
import {MessageBox,Loading,DatePicker,Input,Button} from "element-react";
import BScroll from 'better-scroll';
import {basePrUrl,getCookie} from "../tool/tool";
import {ghsfData,scroll} from "../data/data";
import "whatwg-fetch";
import moment from 'moment'
import qs from "qs";

export class Ghsf extends Component {
    constructor (props){
        super(props);
        this.state={
            startTime:new Date(new Date().getTime()-24*7*3600*1000),
            endTime:new Date(),
            value:"",
            data:[],
            loading:false,

        }
        this.id=this.props.match.params.id;
        this.scroll=null;

    }
    componentDidMount () {

        if(!!ghsfData.value){
            this.setState({loading:true});

            this.setState({
                endTime:ghsfData.endTime,
                value:ghsfData.value,
                data:ghsfData.data
            })
            // this.timer=setTimeout(()=>{
            //     if(!!this.refs.scroll){
            //         console.log(this.scrolls)
            //         this.scrolls.refresh();
            //     }
            //     clearTimeout(this.timer)
            // },600)
        }
        let startY=scroll.startY;
        this.timer=setTimeout(()=>{
            this.setState({loading:false});
            clearTimeout(this.timer);
            new BScroll(this.refs.scroll,{
                scrollY:true,
                click:true,
                startY,
                probeType:3,
            }).on("scroll",(pos)=>{
                scroll.startY=parseInt(pos.y);
            });
        },200);

    }
    getData = (startTime,endTime,cardNum) => {
        fetch(`${basePrUrl}registrationCharge/list`,{
            method:"post",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Token":getCookie("token")
            },
            body: qs.stringify({
                moduleId:this.id,
                cardNum,
                startDate:moment(startTime).format("YYYY-MM-DD"),
                endDate:moment(endTime).format("YYYY-MM-DD")
            })
        })
            .then((response) => {
                this.setState({loading:false});
                if(response.status===200){

                    return response.json()
                }
            })
            .then((data) => {
                if(data.code===0){
                    if(data.msg.length===0){
                        MessageBox.alert("未查询到时间段内的数据","提示");
                        return false;
                    }
                    ghsfData.data=data.msg;
                    this.setState({data:data.msg});

                }else{
                    MessageBox.alert(data.msg,"提示");
                }
            })
            .catch((err) => {
                this.setState({loading:false});
                MessageBox.alert("数据加载失败","提示");
            })


    }
    foldPanel = (item) => {
        if(item.toggle===undefined){
            item.toggle=true;
        }else{
            item.toggle=!item.toggle
        }
        this.setState({data:this.state.data});
    }
    search = () => {
        if(this.state.value.trim()===""){
            MessageBox.alert("请输入卡号","提示");
            return false;
        }
        ghsfData.endTime=this.state.endTime;
        ghsfData.value=this.state.value.trim();
        this.getData(this.state.startTime,this.state.endTime,this.state.value.trim());
    }
    go = (id,serialNum) => {
        this.props.history.push( `/ghsfsub/${id}-${this.id}-${serialNum}`,null);
    }
    render () {
        let {startTime,endTime,value,data,loading} = this.state;
        return (
            <section>
               <Header  title="挂号收费查询"/>
                    <section className="gh container" ref="scroll">
                        <section className="bg">
                            <section className="search-bar">
                                <section className="select-time">
                                    <DatePicker
                                        value={startTime}
                                        placeholder="选择日期"
                                        isDisabled={true}
                                    />
                                    <span className="line">--</span>
                                    <DatePicker
                                        value={endTime}
                                        placeholder="选择日期"
                                        isReadOnly={true}
                                        onChange={date=>{
                                            if(!!date){
                                                this.setState({
                                                    startTime:new Date(date.getTime()-24*7*3600*1000),
                                                    endTime: date
                                                })
                                            }
                                        }}
                                        disabledDate={time=>time.getTime() > Date.now()}
                                    />
                                </section>
                                <section className="search">
                                    <Input
                                        placeholder="请输入卡号"
                                        value={value}
                                        onFocus={() => {this.setState({value:""})}}
                                        onChange={(value)=>{this.setState({value:value.toUpperCase()})}}
                                        append={
                                            <Button type="primary" icon="search" onClick={this.search}>搜索</Button>
                                        }
                                    />
                                </section>

                            </section>
                            <section>
                                {
                                    data.map((items,index)=>(
                                        <section className="list" key={index}>
                                            <section className="title">
                                                <span>{items.patientName}</span>
                                                <span>{items.cardNum}</span>
                                            </section>
                                            <section>
                                                {
                                                    items.costList.map((item,i) => (
                                                            <ul key={i}>
                                                                <li>类别：{item.type==="1"?"挂号":"收费"}</li>
                                                                <li>
                                                                    挂号时间（收费时间）：{item.dateTime}
                                                                </li>
                                                                <li>流水号：{item.serialNum}</li>
                                                                <li>总金额：{item.costAmount}</li>
                                                                <li>现金支付：{item.cashPay}</li>
                                                                <li>POS机支付：{item.posPay}</li>
                                                                <li>银医支付 ：{item.bankHospitalPay}</li>
                                                                <li>其他（医保支付）：{item.otherPay}</li>
                                                                <li>移动支付：{item.mobilePay}</li>
                                                                <li>减免：{item.remission}</li>
                                                                <li><Button type="danger" onClick={this.go.bind(this,item.type,item.serialNum)}>明细详情</Button></li>
                                                            </ul>

                                                    ))
                                                }
                                            </section>

                                        </section>

                                    ))
                                }

                            </section>
                        </section>
                    </section>
                {
                    loading && <Loading text="数据加载中......" fullscreen={true}/>
                }
            </section>
        )
    }
}