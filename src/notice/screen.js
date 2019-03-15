import React, { Component } from 'react';
import {Select} from 'element-react'
import "whatwg-fetch"
export class NoticeScreen extends Component{
    constructor (props) {
        super(props);
        this.state={
            data:[],
            y:null,
            h:null,
            w:null,
            options: [{
                value: '1',
                label: '仅显示首台'
            }, {
                value: '2',
                label: '显示所有'
            }],
            value: '2'
        }
        this.listNum=0;   // 每页展示条数
        this.page=0;      // 展示页面
        this.totalPage=1; //
        this.data=[];     // 数据
        this.initHeight=true; // 初始化容器高度
        this.tdHeight=51;
        this.dataTemp=[];
        this.refreshTime=10; // 翻页刷新时间
        this.getServerCount=100;
        this.parameter="2";
    }
    componentDidMount () {
        let _this=this;
        let screenSelect=localStorage.getItem("screenSelect");
        if(!!screenSelect){
            this.setState({value:screenSelect})
        }
        this.setDate();
        this.animation();
        window.onresize=function(){
            _this.page=0;
            _this.initHeight=true;
        }
    }
    componentWillUnmount () {
        clearTimeout(this.timer);
    }
    animation = () =>{
        clearTimeout(this.timer);
        this.timer=setTimeout(()=>{
            this.setDate();
            this.refreshHeight();
            this.getData();
            this.pageTurning();
            this.animation();
        },this.refreshTime*1000);
    }
    setDate = () => {
        let getDate=new Date();
        let weekArray = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
        let w = weekArray[getDate.getDay()];
        let year=getDate.getFullYear();
        let month=getDate.getMonth()+1 <10 ?"0"+(getDate.getMonth()+1):getDate.getMonth()+1;
        let date=getDate.getDate()<10 ? "0" + getDate.getDate():getDate.getDate();
        let hours=getDate.getHours()<10 ? "0"+getDate.getHours():getDate.getHours();
        let minutes=getDate.getMinutes()<10 ? "0"+getDate.getMinutes():getDate.getMinutes();
        let y=`${year}/${month}/${date}`;
        let h=`${hours}:${minutes}`;
        this.setState({y,w,h});
    }
    refreshHeight = () => {
        if(this.initHeight){
            this.listNum=parseInt(this.refs.tableContainer.offsetHeight/this.tdHeight)-1;
            if(this.data.length>this.listNum){
                this.totalPage=Math.ceil(this.data.length/this.listNum);
            }else{
                this.totalPage=1;
            }
            this.initHeight=false;
        }
    }
    pageTurning = () => {
        if(this.totalPage>1){
            this.setState({
                data:this.data.slice(this.page*this.listNum,((this.page+1)*this.listNum))
            });
            this.page++;
            if(this.page>=this.totalPage){
                this.cache();
                this.page=0;
            }
        }else{
            this.cache();
            this.setState({data:this.data});
        }
    }
    cache = () => {
        if(this.dataTemp.length!==0){
            this.data=this.dataTemp;
            this.dataTemp=[];
            if(this.data.length>this.listNum){
                this.totalPage=Math.ceil(this.data.length/this.listNum);
            }
        }
    }
    getData = () => {
        if(this.getServerCount++>this.totalPage){
            this.getServerCount=0;
            fetch(`http://192.168.3.133:8087/api/OperatingPreview/operateScreen?num=${this.state.value}`,{
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
                            this.dataTemp=data.data;
                            break;
                        default :
                            break;
                    }
                });
        }
    }
    setParameter = (v) => {
        localStorage.setItem("screenSelect",v);
        window.location.reload();

    }
    render () {
        let {data,y,w,h,options,value} = this.state;
        return (
            <section className="notice-screen">
                <header>
                    <Select value={value} className="notice-select" placeholder="请选择" onChange={this.setParameter.bind(this)}>
                        {
                            options.map(el => {
                                return <Select.Option key={el.value} label={el.label} value={el.value} />
                            })
                        }
                    </Select>
                    <p>手术预告&lt;本部&gt;</p>
                    <p>{y}  <span>{w}</span> {h}</p>
                </header>
                <section className="table-container" ref="tableContainer">
                    <table>
                        <thead>
                            <tr>
                             <th>房间</th>
                             <th>科室</th>
                             <th>床号</th>
                             <th>姓名</th>
                             {/*<th>住院号</th>*/}
                             <th>手术名称</th>
                             <th>手术医生</th>
                             <th>助手</th>
                            </tr>
                        </thead>
                        <tbody>
                        {
                            data.map((item,index)=>(
                                <tr key={index}>
                                    <td>{item.ssfj}</td>
                                    <td>{item.ksmc}</td>
                                    <td>{item.brch}</td>
                                    <td>{item.brxm}</td>
                                    {/*<td>{item.zyhm}</td>*/}
                                    <td>{item.ssmc}</td>
                                    <td>{item.ssys}</td>
                                    <td>{item.ssyz}</td>
                                </tr>
                            ))
                        }
                        </tbody>
                    </table>
                </section>
            </section>
        )
    }
}