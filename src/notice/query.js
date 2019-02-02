import React, { Component } from 'react';
import {Header} from "../component/header";
import {Input,Button,Tabs} from "element-react"
import BScroll from "better-scroll";

export class NoticeQuery extends Component {
    constructor (props) {
        super(props);
        this.state={
           value:""
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
        console.log(this.state.value)
    }
    render () {
        return (
            <section className="notice-query">
                <Header title="手术预告（本部）"/>
                <section className="search-bar">
                    <Input placeholder="请输入医生姓名或工号"
                           onChange={(value) => {this.setState({value})}}
                           append={
                               <Button type="primary" icon="search" onClick={this.search}>搜索</Button>
                           }
                    />
                </section>
                <section className="container" ref="scroll">
                    <section>
                        <Tabs>
                            <Tabs.Pane label="未手术" name="1">
                                <ul>
                                    <li>
                                        <p>车贵晓</p>
                                        <p>住院号：</p>
                                    </li>
                                    <li>
                                        房间：
                                    </li>
                                    <li>
                                        科室：
                                    </li>
                                    <li>
                                        床号：
                                    </li>
                                    <li>
                                        手术名称：
                                    </li>
                                    <li>
                                        手术医生：
                                    </li>
                                    <li>
                                        助手：
                                    </li>
                                </ul>
                            </Tabs.Pane>
                            <Tabs.Pane label="已手术" name="2">
                            </Tabs.Pane>
                        </Tabs>
                    </section>
                </section>
            </section>
        )
    }
}