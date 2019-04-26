import React, { Component } from 'react';
import {Header} from "../component/header";
import {Select, Tabs, Button, Table, MessageBox,Loading,Message} from 'element-react'
import BScroll from 'better-scroll'
// import {baseUrl} from "../tool/tool";
import {DataRange} from "../component/data-range";
import moment from 'moment'
// let baseUrl="http://192.168.17.170:8088/qr/"
let baseUrl="http://192.168.17.166:8088/qr/"

export class InfoHistory extends Component {
    constructor (props) {
        super(props);
        this.state={
            selectOption: [],
            selectValue: '',
            showHis:true,
            startTime:null,
            endTime:null,
            t:true,
            columns: [
                {
                    label: "姓名",
                    prop: "sRecorderName",
                    align:"center",
                    headerAlign:"center"
                },
                {
                    label: "工号",
                    prop: "sRecorder",
                    align:"center",
                    headerAlign:"center"

                },
                {
                    label: "时间",
                    prop: "tChecktime",
                    align:"center",
                    headerAlign:"center",
                    width:180
                }
            ],
            data: {
                cd:[],
                qq:[],
                zs:[]
            },
            loading:false,
            expLoading:false
        }
    }
    componentDidMount () {
        this.getList(moment().subtract(6,'days').format('YYYY-MM-DD'),moment().format("YYYY-MM-DD"))

    }
    getPra = (pra) => {
       this.meetingId=pra;
       this.setState({showHis:false});
       if(pra!==""){
           this.getData(pra);
           this.refreshScroll();
       }
    }
    getHistoryRecord = (pra) => {
        this.meetingId=pra;
        this.setState({selectValue:pra,showHis:false});
        this.getData(pra);
        this.refreshScroll();
    }
    getData = (id) => {
        this.setState({loading:true});
        fetch(`${baseUrl}display/getSignList?id=${id}`)
            .then((response) => {
                this.setState({loading:false});
                if(response.status===200){
                    return response.json()
                }
            })
            .then((data)=>{
                if(data.code===0){
                   this.setState({data:data.data})
                }else{
                    MessageBox.alert(data.msg,"提示");
                }

            })
            .catch((err)=>{
                this.setState({loading:false});
                MessageBox.alert("数据加载异常","提示");
            })
    }
    refreshScroll = () => {
        if(this.state.showHis){
            setTimeout(()=>{
                new BScroll(this.refs.leftScroll);
                new BScroll(this.refs.midScroll);
                new BScroll(this.refs.rightScroll);
            },200)
        }
    }
    getTime = (start,end) => {
        this.setState({startTime:start,endTime:end,t:false});
        this.getList(moment(start).format("YYYY-MM-DD"),moment(end).format("YYYY-MM-DD"))

    }
    getList = (start,end) => {
        this.setState({loading:true});
        fetch(`${baseUrl}display/getMeetingList?startDate=${start}&endDate=${end}`)
            .then((response) => {
                this.setState({loading:false});
                if(response.status===200){
                    return response.json()
                }
            })
            .then((data)=>{
                if(data.code===0){
                    Message({
                        message: '数据加载完成，请选择会议名称',
                        duration:1000,
                        type: 'success'
                    });
                    this.setState({selectOption:data.data});
                }else{
                    MessageBox.alert(data.msg,"提示");
                }

            })
            .catch((err)=>{
                this.setState({loading:false});
                MessageBox.alert("数据加载异常","提示");
            })
    }
    exp = () => {
        window.location.href=`${baseUrl}display/exportSignPerson?id=${this.meetingId}`
    }
    render () {
        let {selectOption,selectValue,showHis,columns,data,startTime,endTime,t,loading,expLoading}=this.state;
        return (
            <section className="info-history">
               <Header title="会议考勤信息查询" />
                <section className="date-range">
                    <DataRange startTime={startTime} endTime={endTime} onGetDateRange={this.getTime}/>
                </section>
                <section className="select">
                    <Select
                        value={selectValue}
                        filterable={true}
                        placeholder="请选择会议名称"
                        clearable={true}
                        onChange={this.getPra.bind(this)}
                    >
                        {
                            selectOption.map(el => {
                                return <Select.Option key={el.nId} label={`${el.tStarttime} ${el.sMeetingname}`} value={el.nId} />
                            })
                        }
                    </Select>
                </section>
                {
                    showHis?
                        <section className="history">
                            {t && <p>近期会议记录</p>}
                            <ul>
                                {
                                    selectOption.length===0?
                                        <p>该时间段内无会议记录</p>
                                        :
                                    selectOption.map((item,index)=>(
                                        <li key={index} onClick={this.getHistoryRecord.bind(this,item.nId)}>
                                            {`${item.tStarttime} ${item.sMeetingname}`}
                                        </li>
                                    ))
                                }
                            </ul>
                        </section>
                        :
                        <section>
                            <Tabs activeName="1">
                                <Tabs.Pane label="缺勤" name="1" className="scroll">
                                    <section className="scroll" ref="leftScroll">
                                        <section>
                                            <Table
                                                columns={columns}
                                                data={data.qq}
                                            />
                                        </section>
                                    </section>
                                </Tabs.Pane>
                                <Tabs.Pane label="迟到" name="2" className="scroll">
                                    <section className="scroll" ref="midScroll">
                                        <section>
                                            <Table
                                                columns={columns}
                                                data={data.cd}
                                            />
                                        </section>
                                    </section>
                                </Tabs.Pane>
                                <Tabs.Pane label="准时" name="3" className="scroll">
                                    <section className="scroll" ref="rightScroll">
                                        <section>
                                            <Table
                                                columns={columns}
                                                data={data.zs}
                                            />
                                        </section>
                                    </section>
                                </Tabs.Pane>
                            </Tabs>
                            <section className="btn">
                                <Button type="info" loading={expLoading} onClick={this.exp}>导 出</Button>
                            </section>
                        </section>
                }
                {
                    loading && <Loading text="数据加载中" fullscreen={true}/>
                }
            </section>
        )
    }
}