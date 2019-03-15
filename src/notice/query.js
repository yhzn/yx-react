import React, { Component } from 'react';
import {Header} from "../component/header";
import {Input,Button,Tabs,Dialog,Table,MessageBox} from "element-react"
import BScroll from "better-scroll";
import {baseOUrl} from "../tool/tool";

export class NoticeQuery extends Component {
    constructor (props) {
        super(props);
        this.state={
           value:"",
            columns:[
                {
                    label: "工号",
                    prop: "jobNum",
                    width: 100
                },
                {
                    label: "姓名",
                    prop: "doctorName",
                },
            ],
            tableData:[
                {
                    "doctorName": "徐海燕",
                    "jobNum": "1001"
                },
                {
                    "doctorName": "顾生虹",
                    "jobNum": "5001"
                }
            ],
            dialogVisible:false,
            operationWaitData:[],
            operationBeenData:[],
            btnLoading:false,
        }
    }
    componentDidMount () {
        this.scroll=new BScroll(this.refs.scroll,{
            scrollY:true,
            click:true,
            probeType:3,
        })
    }
    search = () => {
        if(this.state.value.trim()===""){
            MessageBox.alert("请输入医生工号或姓名");
            return false;
        }
        this.getDoctorList(this.state.value);
    }
    onRowClick = (row) => {
        this.operationBeen(row.jobNum);
        this.operationWait(row.jobNum);
        this.setState({dialogVisible:false});
    }
    operationBeen = (parameter) => {
        fetch(`${baseOUrl}OperatingPreview/operated?id=${parameter}`,{
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        })
            .then((response) => {
                if(response.status===200){
                    return response.json()
                }
            })
            .then((data) => {
                switch (data.code){
                    case 0:
                        this.setState({operationWaitData:data.data});
                        break;
                    default :
                        MessageBox.alert(data.msg,"提示");
                        break;
                }
            })
            .catch(()=>{
                MessageBox.alert("数据加载异常","提示");
            });
    }
    operationWait = (parameter) => {
        fetch(`${baseOUrl}OperatingPreview/operating?id=${parameter}`,{
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        })
            .then((response) => {
                if(response.status===200){
                    return response.json()
                }
            })
            .then((data) => {
                switch (data.code){
                    case 0:
                        this.setState({operationWaitData:data.data});
                        break;
                    default :
                        MessageBox.alert(data.msg,"提示");
                        break;
                }
            })
            .catch(()=>{
                MessageBox.alert("数据加载异常","提示");
            });
    }
    getDoctorList = (parameter) => {
        this.setState({btnLoading:true});
        fetch(`${baseOUrl}OperatingPreview/doctor?name=${parameter}`,{
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        })
            .then((response) => {
                this.setState({btnLoading:false});
                if(response.status===200){
                    return response.json()
                }
            })
            .then((data) => {
                switch (data.code){
                    case 0:
                        this.setState({dialogVisible:true,tableData:data.data});
                        break;
                    default :
                        MessageBox.alert(data.msg,"提示");
                        break;
                }
            }).catch(()=>{
                this.setState({btnLoading:false});
                MessageBox.alert("数据加载异常","提示");
            });
    }
    render () {
        let {dialogVisible,columns,tableData,operationWaitData,operationBeenData,btnLoading} = this.state;
        return (
            <section className="notice-query">
                <Header title="手术预告（本部）"/>
                <section className="search-bar">
                    <Input placeholder="请输入医生姓名或工号"
                           onChange={(value) => {this.setState({value:value.trim()})}}
                           append={
                               <Button type="primary" icon="search" loading={btnLoading} onClick={this.search}>搜索</Button>
                           }
                    />
                </section>
                <section className="container" ref="scroll">
                    <section>
                        <Tabs>
                            <Tabs.Pane label="未手术" name="1">
                                {
                                    operationBeenData.map((item,index)=>(
                                        <ul key={index}>
                                            <li>
                                                <p>{item.brxm}</p>
                                                <p>住院号：{item.zyhm}</p>
                                            </li>
                                            <li>
                                                房间：{item.ssfj}
                                            </li>
                                            <li>
                                                科室：{item.ksmc}
                                            </li>
                                            <li>
                                                床号：{item.brch}
                                            </li>
                                            <li>
                                                手术名称：{item.ssmc}
                                            </li>
                                            <li>
                                                手术医生：{item.ssys}
                                            </li>
                                            <li>
                                                助手：{item.ssyz}
                                            </li>
                                        </ul>
                                    ))
                                }

                            </Tabs.Pane>
                            <Tabs.Pane label="已手术" name="2">
                                {
                                    operationWaitData.map((item,index)=>(
                                        <ul key={index}>
                                            <li>
                                                <p>{item.brxm}</p>
                                                <p>住院号：{item.zyhm}</p>
                                            </li>
                                            <li>
                                                房间：{item.ssfj}
                                            </li>
                                            <li>
                                                科室：{item.ksmc}
                                            </li>
                                            <li>
                                                床号：{item.brch}
                                            </li>
                                            <li>
                                                手术名称：{item.ssmc}
                                            </li>
                                            <li>
                                                手术医生：{item.ssys}
                                            </li>
                                            <li>
                                                助手：{item.ssyz}
                                            </li>
                                        </ul>
                                    ))
                                }
                            </Tabs.Pane>
                        </Tabs>
                    </section>
                </section>
                <Dialog
                    title="请选择医生"
                    size="large"
                    visible={dialogVisible}
                    onCancel={ () => this.setState({ dialogVisible: false }) }
                >
                    <Dialog.Body>
                        {dialogVisible && (
                            <Table
                                style={{width: '100%'}}
                                stripe={true}
                                onRowClick={this.onRowClick.bind(this)}
                                columns={columns}
                                data={tableData} />
                        )}
                    </Dialog.Body>
                </Dialog>
            </section>
        )
    }
}