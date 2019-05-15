import React, { Component } from 'react';
import {MessageBox, Select} from "element-react";
import {getCookie,baseQrUrl,baseKQrl} from "../tool/tool";
import QRCode from 'qrcodejs2'
export class IpadCode extends Component {
    constructor (props) {
        super(props);
        this.state={
            options: [],
            value: '',
            list:{},
            timerCount:5,
            parameter:null,
        }
    }
    componentDidMount () {
        this.qrCode=new QRCode(
            this.refs.canvas,
            {
                text: '',
                width: 280,
                height: 280,
            }
        )
        let hasCookie = getCookie("scanToken");
        if(hasCookie) {
            fetch(`${baseQrUrl}display/getlist`,
                {
                    headers: {
                        Token: hasCookie
                    }
                })
                .then((response) => {
                    this.setState({loading: false});
                    if (response.status === 200) {
                        return response.json()
                    }
                })
                .then((data) => {
                    if(data.code===0){
                        this.setState({options:data.data.meetingInfos})

                    }else{
                        MessageBox.alert(data.msg,"提示")
                    }
                })
                .catch((err) => {
                    MessageBox.alert("会议列表加载失败","提示")
                })
        }

    }
    selectChange = (value) => {
        this.qrCode.clear(); // 清除代码
        this.nId=value;
        this.setState({timerCount:5});
        this.refreshCode();
        this.setState({list:this.state.options.filter((item)=>{return item.nId===value})[0]})
    }
    refreshCode = () => {
        clearTimeout(this.timer);
        fetch(`${baseQrUrl}vail/getcode`)
            .then((response) => {
                this.setState({loading: false});
                if (response.status === 200) {
                    return response.json()
                }
            })
            .then((data) => {
                this.setState({parameter:false})
                if(data.code===0){
                    this.setState({parameter:true})
                    if(this.state.timerCount===5){
                        this.qrCode.clear(); // 清除代码
                        // this.qrCode.makeCode(`${baseKQrl}/#/information?qrcode=${data.msg}&nId=${this.nId}`);http%3A%2F%2Fhospital.natapp1.cc%2Fwechat%2Fauthorize

                        //this.qrCode.makeCode(`https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx6db38443cc90435b&redirect_uri=http://hospital.natapp1.cc/wechat/authorize&response_type=code&scope=snsapi_userinfo&state=${baseKQrl}/#/information?qrcode=${data.msg}_nId=${this.nId}#wechat_redirect`);
                          this.qrCode.makeCode(`https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx6db38443cc90435b&redirect_uri=http://192.168.17.166/wechat/authorize&response_type=code&scope=snsapi_userinfo&state=${baseKQrl}/%23/information?qrcode=${data.msg}_nId=${this.nId}#wechat_redirect`);
                    }
                    this.timer=setTimeout(()=>{
                        this.state.timerCount--;
                        this.setState({timerCount:this.state.timerCount});
                        if(this.state.timerCount<0){
                            // 生成另外一个二维码
                            this.setState({timerCount:5});
                        }
                        this.refreshCode();

                    },1000);
                }else {
                    MessageBox.alert(data.msg, "提示");
                }
            })
            .catch(()=>{
                this.setState({parameter:false});
                MessageBox.alert("数据加载异常","提示");
            })
    }
    render () {
        let {options,value,list,timerCount,parameter} = this.state;
        return (
            <section className="ipad-code">
                <section className="head">
                    <i className="el-icon-arrow-left back" onClick={()=>{this.props.history.goBack()}}/>
                    <Select value={value} placeholder="请选择会议名称" onChange={this.selectChange}>
                        {options.map((el,index)=> {
                                return <Select.Option
                                    key={index}
                                    label={`${el.sMeetingname}(${el.sMeetingaddress})`}
                                    value={el.nId}
                                />
                            })
                        }
                    </Select>
                </section>
                <section className="main">
                    <h3>会议考勤扫码系统</h3>
                    <section className="code" ref="canvas" />
                    <p>
                        { parameter && `二维码 ${timerCount} 秒后刷新`}
                    </p>
                    <section className="table">
                        <table>
                            <tbody>
                            <tr>
                                <td>会议名称：</td>
                                <td>{list.sMeetingname}</td>
                                <td>开始时间：</td>
                                <td>{list.tStarttime}</td>
                            </tr>
                            <tr>
                                <td>会议地点：</td>
                                <td>{list.sMeetingaddress}</td>
                                <td>结束时间：</td>
                                <td>{list.tEndtime}</td>
                            </tr>
                            </tbody>
                        </table>
                    </section>
                </section>

                <footer>
                    上海延华智能科技（集团）股份有限公司
                </footer>
            </section>
        )
    }
}