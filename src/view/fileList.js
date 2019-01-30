import React, { Component } from 'react';
import {baseRestartUrl} from "../tool/tool";
import {Header} from "../component/header";
import BScroll from 'better-scroll';
import {Pagination,Loading,MessageBox} from "element-react";
import "whatwg-fetch";
let data={
    "currentPage":1,
    "totalPage":50,
    "list":[
        {
            "text":"文件",
            "date":"2018/08/09 11:20",
            "checked":true,
            "url":""
        },
        {
            "text":"文件",
            "date":"2018/08/09 11:20",
            "url":""
        },
        {
            "text":"文件",
            "date":"2018/08/09 11:20",
            "url":""
        },
        {
            "text":"文件",
            "date":"2018/08/09 11:20",
            "url":""
        },
        {
            "text":"文件",
            "date":"2018/08/09 11:20",
            "url":""
        },
        {
            "text":"文件",
            "date":"2018/08/09 11:20",
            "url":""
        },
        {
            "text":"文件",
            "date":"2018/08/09 11:20",
            "url":""
        },
        {
            "text":"文件",
            "date":"2018/08/09 11:20",
            "url":""
        },
        {
            "text":"文件",
            "date":"2018/08/09 11:20",
            "url":""
        },
        {
            "text":"文件",
            "date":"2018/08/09 11:20",
            "url":""
        },
        {
            "text":"文件",
            "date":"2018/08/09 11:20",
            "url":""
        },
        {
            "text":"文件",
            "date":"2018/08/09 11:20",
            "url":""
        },
        {
            "text":"文件",
            "date":"2018/08/09 11:20",
            "url":""
        }
    ]

}

export class FileList extends Component {
    constructor (props) {
        super(props);
        this.state={
            data:[],
            currentPage:1,
            totalPage:1,
            loading:true,
        }
    }
    componentDidMount () {
        this.scroll=new BScroll(this.refs.scroll,{
            scrollY:true,
            click:true,
            probeType:3,
        });
        this.getData(1)
    }
    getData = (page) => {
        this.setState({loading:true});
        fetch(baseRestartUrl+"logList?page="+page+"&ipMark="+this.props.match.params.id,{
            // method:"post",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
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
                        data:data.msg.list,
                        currentPage:data.msg.currentPage,
                        totalPage:data.msg.totalPage

                    })
                    this.timer=setTimeout(() => {
                        if(!!this.refs.scroll){
                            this.scroll.refresh();
                        }
                        clearTimeout(this.timer);
                    },600)

                }
            })
            .catch((err) => {
                this.setState({loading:false});
                MessageBox.alert('数据加载失败', '提示');

            })
    }
    checkedFile = (fileName) => {
        fetch(baseRestartUrl+"updateFileState?fileName="+fileName,{
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        })
            .then((response) => {
                if(response.status===200){
                    return response.json()
                }
            })
            .catch((err) => {
                console.log(err)
            })
    }
    render () {
        let {data,currentPage,totalPage,loading} = this.state;
        return (
            <section className="file-list">
               <Header title="重启日志文件" />
                <section className="container" ref="scroll">
                    <ul>
                        {
                            data.map((item,index)=>(
                                <li key={index} onClick={this.checkedFile.bind(this,item.text)}>
                                    <a href={item.url} className={item.checked?null:"active"}>
                                        <span>{item.text}</span>
                                        <span>{item.date}</span>
                                    </a>
                                </li>
                            ))
                        }
                    </ul>
                </section>
                <section className="page">
                    {
                        totalPage >= 2 &&
                            <Pagination
                                layout="prev, pager, next"
                                currentPage={currentPage}
                                pageSize={1}
                                total={totalPage}
                                onCurrentChange={this.getData}
                            />

                    }
                </section>
                {
                    loading && <Loading text="数据加载中......" fullscreen={true}/>
                }
            </section>
        )
    }
}