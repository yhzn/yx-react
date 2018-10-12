import React, { Component } from 'react';
import {Select} from 'element-react'
export class SelectHospital extends Component {
    constructor(props) {
        super(props);

        this.state = {
            options: [{
                value: '1',
                label: '上海市东方医院'
            }, {
                value: '2',
                label: '复旦大学附属华山医院'
            }, {
                value: '3',
                label: '上海第六人民医院'
            }],
            value: ''
        };
    }
    selectChange = (value) =>{
        this.props.onSelectChange(value);
    }
    render() {
        return (
            <Select value={this.state.value} placeholder="请选择所属医院" onChange={this.selectChange}>
                {
                    this.state.options.map(el => {
                        return <Select.Option key={el.value} label={el.label} value={el.value}/>
                    })
                }
            </Select>
        )
    }

}