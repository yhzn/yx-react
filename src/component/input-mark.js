import React, { Component } from 'react';
import {Input,Button} from 'element-react'
export class InputMark extends Component{
    constructor (props) {
        super(props);
        this.state={
            value:this.props.value,
            placeholder:this.props.placeholder,
            key:this.props.k,
        }
    }
    getInput = (e) => {
        this.props.onGetInput(this.state.key,this.state.value,false)
    }
    render () {
        let {value,placeholder}=this.state;
        return (
            <section className="input-mark">
                <section onKeyUp={(e)=>{
                    if(e.keyCode===13){
                        this.getInput();
                    }
                }}>
                    {
                        this.props.textarea==="textarea"?
                            <section className="textarea-container">
                                <Input
                                    type="textarea"
                                    rows={2}
                                    placeholder={placeholder}
                                    autoFocus={true}
                                    onBlur={this.getInput}
                                    value={value}
                                    onChange={(value) => {
                                        this.setState({value:value.trim()})
                                    }}
                                />
                                <Button onClick={this.getInput}>确定</Button>
                            </section>
                            :
                            <Input
                            placeholder={placeholder}
                            autoFocus={true}
                            onBlur={this.getInput}
                            value={value}
                            onChange={(value) => {
                                this.setState({value:value.trim()})
                            }}
                            append={<Button onClick={this.getInput}>确定</Button>}
                        />

                    }

                </section>
            </section>
        )
    }

}