import React, { Component } from 'react';
import {DatePicker,Button} from 'element-react'
export class DataRange extends Component{
    constructor (props) {
        super(props);
        this.startTime=this.props.startTime;
        this.endTime=this.props.endTime;
    }
    search = () => {
        this.props.onGetDateRange(this.startTime,this.endTime);
    }
    render () {
        let {startTime,endTime}=this.props;
       return (
           <section>
               <section className="data-range">
                   <DatePicker
                       value={startTime}
                       placeholder="选择日期"
                       isReadOnly={true}
                       onChange={date=>{
                           this.startTime=date;
                       }}
                       disabledDate={time=>time.getTime() > this.endTime}
                   />
                   <span className="line">--</span>
                   <DatePicker
                       value={endTime}
                       placeholder="选择日期"
                       isReadOnly={true}
                       onChange={date=>{
                           this.endTime=date;
                       }}
                       disabledDate={time=>time.getTime() > Date.now()}
                   />
                   <Button type="info" onClick={this.search}>查询</Button>
               </section>
           </section>
       )
    }
}