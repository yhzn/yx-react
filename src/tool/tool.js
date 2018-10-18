import $ from "jquery";

import {MessageBox} from "element-react";
import qs from "qs";
import "whatwg-fetch";
export let baseUrl="http://localhost:8005/api/";
export let formData = (parameter) => {
    let formData = new FormData();
    for(let key in parameter){
        formData.append(key, parameter[key]);
    }
    return formData;
}
export let getCodeTime = (_this,url,parameter) => {
    if(!_this.state.getCodeFlag){
        return false;
    }
    if(!_this.state.phone.trim()){
        _this.setState({errPhone:"手机号不能为空"});
        return false;

    }
    if(!!_this.state.errPhone.trim()){
        return false;

    }
    _this.state.getCodeFlag=false;
    let count=60;
    fetch(url,{
        method:"post",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: qs.stringify(parameter)
    })
    .then((res)=>{
        if(res.status==200){
            return res.json()
        }
    })
    .then((data)=>{
        switch (data.code){
            case 201:
                _this.setState({errPhone:"该手机号未注册"});
                break;
            case 0:
                break;
            default :
                count=0;
                clearInterval(_this.timer);
                _this.setState({
                    codeBtnText:`获取验证码`,
                    getCodeFlag:true
                })
                MessageBox.alert("验证码获取失败，请重新获取");
                break;
        }
    })
    .catch(()=>{
            count=60;
            clearInterval(_this.timer);
            _this.setState({
                codeBtnText:`获取验证码`,
                getCodeFlag:true
            })
            MessageBox.alert("验证码获取失败，请重新获取");

    })
    _this.setState({
        codeBtnText:`${count} s后重新获取`
    })
    _this.timer=setInterval(()=>{
        _this.setState({
            codeBtnText:`${--count} s后重新获取`
        })
        if(count===0){
            clearInterval(_this.timer);
            _this.setState({
                codeBtnText:`获取验证码`,
                getCodeFlag:true
            })
        }
    },1000)
}

export let setCookie = function (name, value, day) {
    if(day !== 0){     //当设置的时间等于0时，不设置expires属性，cookie在浏览器关闭后删除
        let expires = day * 24 * 60 * 60 * 1000;
        let date = new Date(+new Date()+expires);
        document.cookie = name + "=" + escape(value) + ";expires=" + date.toUTCString();
    }else{
         document.cookie = name + "=" + escape(value);
    }
};

export let getCookie = (name) => {
    let arr;
    let reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
    if (arr = document.cookie.match(reg)){
        return unescape(arr[2]);

    }else{
        return null
    }
};
export let delCookie = function (name) {
         setCookie(name, ' ', -1);
};