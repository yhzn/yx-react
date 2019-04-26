import React, { Component } from 'react';
import {Link} from 'react-router-dom'
import {Header} from "../component/header";
export class ServiceHome extends Component {
    constructor (props) {
        super(props);
        this.state={}
    }
    render () {
        return (
            <section>
                <Header title="患者服务" />
                <section className="service-home container">
                    <section className="bar">
                        <section className="user">
                           <div />
                        </section>
                        <p>用户名</p>
                    </section>
                    <ul className="cleanfix">
                        <li>
                            <Link to="/serviceinfo">
                            <section/>
                            <p>吞钱留信息</p>
                            </Link>
                        </li>
                        <li>
                            <Link to="/servicehome">
                            <section/>
                            <p>交易明细查询</p>
                            </Link>
                        </li>
                        <li>
                            <Link to="/servicehome">
                            <section/>
                            <p>病人全名</p>
                            </Link>
                        </li>
                        <li>
                            <Link to="/servicehome">
                            <section/>
                            <p>患者建议</p>
                            </Link>
                        </li>
                    </ul>
                </section>
            </section>
        )
    }


}