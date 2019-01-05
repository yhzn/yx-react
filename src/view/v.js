import React, { Component } from 'react';
import {validate} from "../tool/validator";
let v={
    ownerUser:{
        depends:'activeIdType',
        required:true,
        input:'user',
        name () {
          return '用户名'
        },
        need (depends) {
            console.log("fun need")
            console.log(depends)
            return true;
        },
    },
    ownerMobile:{
        mobile:true,    // 是否校验数据格式
        input:'mobile',
        name:'手机号码'
    },
    ownerCardId:{
        cardId:true,
        input:'cardId',
        name:'身份证号'
    },
    ownerNum:{
        required:true,
        numeric:[10,30],
        input:'number',
        name:'金额范围'
    },
    ownerRmb:{
        RMB:true,
        input:'rmb',
        name:'金额'

    },
    ownerCard:{
        depends:['activeIdType','testTips'],
        // required:true,
        // 根据条件判定是否校验数据类型
        cardId ({activeIdType},{reg,input}) {
            // if(activeIdType.s===1223){
            //     return reg.test(input);
            // }else{
            //     return true;
            // }
            return false
        },
        customizeTip ({activeIdType}) {
            return true
        },
        tipsText ({testTips}) {
            return "tipText"
        },
        name:'证件号码',
        input:'card'

    }
}
export class Validate extends Component {
    constructor (props) {
        super(props);
        this.state={
            v
        }
    }
    componentDidMount () {

    }
    submit = () => {
        if(validate({ctx:this,key:'v',rules:v})){
            console.log("成功")
        }else{
            console.log("失敗")
        }

    }
    render () {
        const {v} = this.state;
        return (
            <section className="v">
                <ul>
                    <ul>
                        <li><span>{v.ownerUser.tips}</span></li>
                        <li><input type="text" name="user" placeholder="输入用户名"/></li>
                        <li><span >{v.ownerMobile.tips}</span></li>
                        <li><input type="text" name="mobile" placeholder="手机号"/></li>
                        <li><span >{v.ownerRmb.tips}</span></li>
                        <li><input type="text" name="rmb" placeholder="数字格式人民币"/></li>
                        <li><span >{v.ownerCardId.tips}</span></li>
                        <li><input type="text" name="cardId" placeholder="输入身份证号"/></li>
                        <li><span >{v.ownerNum.tips}</span></li>
                        <li><input type="text" name="number" placeholder="输入某一范围的数字"/></li>
                        <li><span >{v.ownerCard.tips}</span></li>
                        <li><input type="text" name="card" placeholder="输入证件号"/></li>
                    </ul>
                </ul>
                <button onClick={this.submit}>提交</button>
            </section>
        )
    }
}