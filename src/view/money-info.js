import React, { Component } from 'react';
import {Header} from "../component/header";
import {Tabs, Button, Pagination, MessageBox,Loading} from 'element-react'
import BScroll from 'better-scroll';
import {baseUrl, getCookie} from "../tool/tool";
import {InputMark} from "../component/input-mark";

export class MoneyInfo extends Component {
    constructor (props) {
        super(props);
        this.state={
            solved:[],
            unSolved:[],
            count:0,
            loading:false,
            alreadyCurrentPage:1,
            alreadyTotalPage:1,
            waitCurrentPage:1,
            waitTotalPage:1,
            currentPage:1,
            totalPage:1
        };
        this.tabName="1";
        this.tabFlag=true;
        this.scrollFlag=true;
    }
    componentDidMount () {
        this.timer=setTimeout(()=>{
            clearTimeout(this.timer);
            this.solved=new BScroll(this.refs.solved,{
                scrollY:true,
                click:true,
                probeType:3,
            })
            this.unSolved=new BScroll(this.refs.unSolved,{
                scrollY:true,
                click:true,
                probeType:3,
            })
        },200)
        this.getData();
    }
    getData = (page=1) => {
        this.setState({loading:true});
        let p= this.tabFlag? `alreadyCurrentPage=${page}&waitCurrentPage=${this.state.waitCurrentPage}`:`alreadyCurrentPage=${this.state.alreadyCurrentPage}&waitCurrentPage=${page}`;
        fetch(`${baseUrl}system/selfHelp/handle?${p}`)
            .then((response) => {
                this.setState({loading:false});
                if(response.status===200){
                    return response.json()
                }
            })
            .then((data)=>{
                if(data.code===0){
                    this.setState({
                        solved:data.data.alreadyHandles,
                        unSolved:data.data.waitHandles,
                        count:data.data.count,
                        alreadyCurrentPage:data.data.alreadyCurrentPage,
                        alreadyTotalPage:data.data.alreadyTotalPage,
                        waitCurrentPage:data.data.waitCurrentPage,
                        waitTotalPage:data.data.waitTotalPage,
                        currentPage:this.tabFlag?data.data.alreadyCurrentPage:data.data.waitCurrentPage,
                        totalPage:this.tabFlag?data.data.alreadyTotalPage:data.data.waitTotalPage
                    })
                }else{
                    MessageBox.alert(data.msg,"提示");
                }

            })
            .catch((err)=>{
                this.setState({loading:false});
                MessageBox.alert("数据加载异常","提示");
            })

    }
    scrollRefresh = (tab) => {
        this.tabFlag=tab.props.name==="1";
            this.setState({
                currentPage:this.tabFlag?this.state.alreadyCurrentPage:this.state.waitCurrentPage,
                totalPage:this.tabFlag?this.state.alreadyTotalPage:this.state.waitTotalPage
            })
        if(this.tabName!==tab.props.name && this.scrollFlag){
            this.scrollFlag=false;
            this.unSolved.refresh();
        }
        // this.unSolved.refresh();
        // this.solved.refresh();

    }
    setInputData = (item,e) => {
        item.remarks=e.target.value;
        this.setState({unSolved:this.state.unSolved,solved:this.state.solved});
    }
    modify = (item) => {
        this.handleData(item);
    }
    handle = (item) => {
        this.handleData(item);
    }
    handleData = (item) =>{
        this.setState({loading:true});
        fetch(`${baseUrl}system/selfHelp/handleComplete?id=${item.id}&handleRemarks=${item.handleRemarks}`,{
            headers:{
                Token:getCookie("token")
            }

        })
            .then((response) => {
                if(response.status===200){
                    return response.json()
                }
            })
            .then((data)=>{
                if(data.code===0){
                    this.getData(this.tabFlag? this.state.alreadyCurrentPage:this.state.waitCurrentPage);
                }else{
                    this.setState({loading:false});
                }
                MessageBox.alert(data.msg,"提示");
            })
            .catch((err)=>{
                this.setState({loading:false});
                MessageBox.alert("数据加载异常","提示");
            })
    }
    setInput = (item) =>{
        this.setState({getInputData:true,key:item,value:item.handleRemarks})
    }
    getInput = (key,value,b) => {
        key.handleRemarks=value;
        this.setState({unSolved:this.state.unSolved,solved:this.state.solved,getInputData:b})
    }
    render () {
        let {unSolved,solved,count,currentPage,totalPage,getInputData,value,key,loading} = this.state;
        return (
            <section>
                <Header title="吞钱处理"/>
                <Tabs activeName="1" className="money-info container" onTabClick={ this.scrollRefresh }>
                    <Tabs.Pane label="已处理" name="1" className="tab">
                        <section className="scroll-container" ref="solved">
                            {
                                solved.length!==0?
                                    <section className="pass">
                                        {
                                            solved.map((item,index)=>(
                                                <ul className="active" key={index}>
                                                    <li>姓名：{item.patientName}</li>
                                                    <li>手机号：{item.patientPhone}</li>
                                                    <li>身份证号：{item.patientIdCard}</li>
                                                    <li>吞钱机器号：{item.machineId}</li>
                                                    <li>类型：{item.rechargeType}</li>
                                                    <li>金额：{item.amountOfMoney}</li>
                                                    <li>日期：{item.swallowTime}</li>
                                                    <li>患者备注：{item.remarks}</li>
                                                    <li  onClick={this.setInput.bind(this,item)}>备注：{item.handleRemarks}</li>
                                                    {/*<li className="remark">*/}
                                                        {/*<span>备注：</span>*/}
                                                        {/*<textarea*/}
                                                            {/*onChange={this.setInputData.bind(this,item)}*/}
                                                            {/*value={item.remarks}*/}
                                                        {/*/>*/}
                                                    {/*</li>*/}
                                                    <li>
                                                        <Button type="info" loading={item.loading} onClick={this.modify.bind(this,item)}>
                                                            修改处理
                                                        </Button>
                                                    </li>
                                                </ul>
                                            ))
                                        }
                                    </section>
                                    :
                                    <section className="empty">
                                        <p>无处理内容</p>
                                    </section>
                            }
                        </section>
                    </Tabs.Pane>
                    <Tabs.Pane label={<div className="wait">待处理{count>0 && <p>{count}</p>}</div>} name="2">
                        <section  className="scroll-container" ref="unSolved">
                            {
                                unSolved.length!==0?
                                    <section>
                                        {
                                            unSolved.map((item,index)=>(
                                                <ul className="active" key={index}>
                                                    <li>姓名：{item.patientName}</li>
                                                    <li>手机号：{item.patientPhone}</li>
                                                    <li>身份证号：{item.patientIdCard}</li>
                                                    <li>吞钱机器号：{item.machineId}</li>
                                                    <li>类型：{item.rechargeType}</li>
                                                    <li>金额：{item.amountOfMoney}</li>
                                                    <li>日期：{item.swallowTime}</li>
                                                    <li>患者备注：{item.remarks}</li>
                                                    <li  onClick={this.setInput.bind(this,item)}>备注：{item.handleRemarks}</li>
                                                    {/*<li className="remark">*/}
                                                        {/*<span>备注：</span>*/}
                                                        {/*<textarea*/}
                                                            {/*onChange={this.setInputData.bind(this,item)}*/}
                                                            {/*value={item.remarks}*/}
                                                        {/*/>*/}
                                                    {/*</li>*/}
                                                    <li>
                                                        <Button type="danger" loading={item.loading} onClick={this.handle.bind(this,item)}>
                                                            立即处理
                                                        </Button>
                                                    </li>
                                                </ul>
                                            ))
                                        }
                                    </section>
                                    :
                                    <section className="empty">
                                        <p>暂无待处理内容</p>
                                    </section>
                            }

                        </section>

                    </Tabs.Pane>
                </Tabs>
                {
                    <section className="money-info-page">
                        <Pagination
                            layout="prev, pager, next"
                            currentPage={currentPage}
                            pageCount={totalPage}
                            onCurrentChange={this.getData.bind(this)}
                        />
                    </section>
                }
                {

                    getInputData &&
                    <InputMark
                        onGetInput={this.getInput}
                        placeholder="请输入处理备注信息"
                        value={value}
                        k={key}
                        textarea="textarea"
                    />
                }
                {
                    loading && <Loading text="数据加载中......" fullscreen={true}/>
                }
            </section>
        )
    }

}