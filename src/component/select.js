import React, { Component } from 'react';
import {Select} from 'element-react'
import "whatwg-fetch"
export class SelectHospital extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: ''
        };
    }
    selectChange = (value) =>{
        this.props.onSelectChange(value);
    }
    render() {
        return (
            <section>
                {
                    this.props.options&&this.props.options.length!==0&&<Select value={this.props.value} placeholder="请选择所属医院" onChange={this.selectChange}>
                        {
                            this.props.options.map(el => {
                                return <Select.Option key={el.value} label={el.text} value={el.value}/>
                            })
                        }
                    </Select>
                }
            </section>
        )
    }

}