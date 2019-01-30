import React, { Component } from 'react';
import {Header} from "../component/header";
import {MessageBox,Loading,Table} from "element-react";
import BScroll from 'better-scroll';
import {basePrUrl,getCookie} from "../tool/tool";
import "whatwg-fetch";
import qs from "qs";
export class GhsfSub extends Component {
    constructor (props) {
        super(props)
        this.state={
            data:[],
            columns: [
                {
                    label: "项目ID",
                    prop: "projectId",
                    align: 'center'
                },
                {
                    label: "项目名称",
                    prop: "projectName",
                    align: 'center'
                },
                {
                    label: "金额（元）",
                    prop: "cost",
                    align: 'center'
                }
            ],
            tableData:[],
            loading:true,
            togglePage:true,
        };
        let parameter=this.props.match.params.id.split("-");
        this.id=parameter[1];
        this.type=parameter[0];
        this.serialNum=parameter[2];
    }
    componentDidMount () {
        let url,pra={
            serialNum:this.serialNum,
            moduleId:this.id,
        }
        switch (this.type) {
            case "1":
                url=`${basePrUrl}registrationCharge/registrationCostDetail`;
                break;
            case "2":
                url=`${basePrUrl}/registrationCharge/chargeDetail`;
                this.setState({togglePage:false});
                break;
        }
        this.getData(url,pra);
        this.scroll=new BScroll(this.refs.scroll,{
            scrollY:true,
            click:true,
            probeType:3,
        })

    }
    getData = (url,pra) => {
        fetch(url,{
            method:"post",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Token":getCookie("token")
            },
            body: qs.stringify(pra)
        })
            .then((response) => {
                this.setState({loading:false});
                if(response.status===200){
                    return response.json()
                }
            })
            .then((data) => {
                if(data.code===0){
                    this.setState({
                        data:data.msg,
                        tableData:data.msg.invoiceInfos?data.msg.invoiceInfos:[]
                    })
                    this.scrollRefresh();
                }else{
                    MessageBox.alert(data.msg,"提示");
                }
            })
            .catch((err) => {
                this.setState({loading:false});
                MessageBox.alert("数据加载失败","提示")
            })
    }
    scrollRefresh = () => {
        this.timer=setTimeout(()=>{
            if(!!this.refs.scroll){
                this.scroll.refresh();
            }
            clearTimeout(this.timer)
        },600)
    }
    render () {
        let {data,togglePage,columns,tableData,loading} = this.state;
        return (
            <section>
               <Header title="挂号收费查询"/>
                <section className="gh-sub container" ref="scroll">
                   <section className="bg">
                       <section className="title">收费明细详情</section>
                       <ul>
                           <li>卡号：{data.cardNum}</li>
                           <li>病人姓名：{data.patientName}</li>
                           <li>挂号时间：{data.dateTime}</li>
                           <li>流水号：{data.serialNum}</li>
                           {togglePage && <li>科室名称：{data.departmentName}</li>}
                           {togglePage && <li>挂号费：{data.registrationCost}</li>}
                           {togglePage && <li>诊疗费：{data.treatmentCost}</li>}
                           {togglePage && <li>专家费：{data.expertsCost}</li>}
                           {/*<li>医生工号：{data.operatorNum}</li>*/}
                           <li>现金支付：{data.cashPay}</li>
                           <li>POS机支付：{data.posPay}</li>
                           <li>银医支付：{data.posPay}</li>
                           <li>其他（医保支付）：{data.otherPay}</li>
                           <li>移动支付：{data.mobilePay}</li>
                           {togglePage && <li>支付类型：{data.payType}</li>}
                           {!togglePage && <li>移动支付类型：{data.mobilePayType}</li>}
                           <li>{togglePage?'减免':'药品减免'}：{data.remission}</li>
                           {togglePage && <li className={data.refundMark===1 && "mark"}>退号：{data.refundMark===1?"已退号":"未退号"}</li>}
                           <li>操作工号：{data.operatorNum}</li>
                           <li>费别：{data.property}</li>
                           <li>医保中心流水号：{data.medicalCenterSerialNum}</li>
                           <li>支付金额：{data.costAmount}</li>
                       </ul>
                       {!togglePage && <section className="title title-2">项目明细详情</section>}
                       {!togglePage && <Table
                           columns={columns}
                           data={tableData}
                       />}
                   </section>
                </section>
                {
                    loading && <Loading text="数据加载中......" fullscreen={true}/>
                }
            </section>
        )
    }
}