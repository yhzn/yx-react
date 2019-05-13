import {MessageBox} from "element-react";
import qs from "qs";
import "whatwg-fetch";


// 生产环境
let baseUrl="http://210.22.124.170:8005/api/";
let baseRestartUrl="http://210.22.124.170:8089/";
let basePrUrl="http://guahao.easthospital.cn:8088/api/";
let baseQrUrl="http://guahao.easthospital.cn:8088/qr/";
let baseOUrl="http://guahao.easthospital.cn:8088/";
let baseKQrl="http://yiliao.chinaforwards.com:8006";

 if(process.env.NODE_ENV==="development"){
     baseUrl="http://192.168.17.169:8005/api/";
     basePrUrl="http://192.168.17.169:8088/api/";
     // baseQrUrl="http://192.168.17.169:8088/qr/"
     // baseKQrl="http://192.168.17.159:3001";
     baseKQrl="http://192.168.17.159:3000";
     baseQrUrl = "http://192.168.17.166:8088/qr/";
 }
export {baseUrl,baseRestartUrl,basePrUrl,baseQrUrl,baseOUrl,baseKQrl}

export let isBasic = (it) => {
    return it===null || ( typeof it !== "object" && typeof it !== "array");
}
export let clone =  (it) => {
    if(isBasic(it)){
        return it;
    }
    let result = Array.isArray(it) ? [] : {};
    for (let i in it){
        result[i]=clone(it[i]);
    }
    return result;
}

let is = (it,type) => {
    return ({}).toString.call(it)===`[object ${type}]`;

}

export let isFunction = (it) => {
    return is(it,'Function')

}

export let formData = (parameter) => {
    let formData = new FormData();
    for(let key in parameter){
        formData.append(key, parameter[key]);
    }
    return formData;
}
export let getCodeTime = (_this,url,parameter,f=true) => {
    if(!_this.state.getCodeFlag){
        return false;
    }
    if(f){
        _this.setState({errPhone:""});
        if(!_this.state.phone.trim()){
            _this.setState({errPhone:"手机号不能为空!"});
            return false;

        }
        if(!/^1[3,4,5,7,8]\d{9}$/.test(_this.state.phone.trim())){
            _this.setState({errPhone:"手机号格式不正确"});
            return false;
        }
    }else{
        // 会议签到
        if(!_this.state.phone.trim()){
            MessageBox.alert("手机号不能为空","提示");
            return false;
        }
        if(!/^1[3,4,5,7,8]\d{9}$/.test(_this.state.phone.trim())){
            MessageBox.alert("手机号格式不正确","提示");
            return false;

        }
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
        if(res.status===200){
            return res.json()
        }
    })
    .then((data)=>{
        switch (data.code) {
            // case 201:
            //     clearInterval(_this.timer);
            //     _this.setState({
            //         codeBtnText: `获取验证码`,
            //         getCodeFlag: true
            //     });
            //     _this.setState({errPhone: "该手机号未注册"});
            //     return false;
            // case 303:
            //     clearInterval(_this.timer);
            //     _this.setState({
            //         codeBtnText: `获取验证码`,
            //         getCodeFlag: true
            //     });
            //     _this.setState({errPhone: "该手机号已注册"});
            //     return false;
            case 0:
                return false;
            default :
                clearInterval(_this.timer);
                _this.setState({
                    codeBtnText: `获取验证码`,
                    getCodeFlag: true
                });
                MessageBox.alert(data.msg,"提示");
                return false;
        }
    })
    .catch(()=>{
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
        if(count<=0){
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
    let reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
    let arr= document.cookie.match(reg);
    if (arr){
        return unescape(arr[2]);

    }else{
        return null
    }
};
export let delCookie = function (name) {
         setCookie(name, ' ', -1);
};
export let getUrlParam = function (name) {
    let after = window.location.hash;
    let index =after.indexOf('?');
    if(index === -1) { //如果url中没有传参直接返回空
        return null
     }
     //key存在先通过search取值如果取不到就通过hash来取
    if(after){
        let reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
        let r = after.slice(index+1).match(reg);
        if(r != null) {
            return  decodeURIComponent(r[2]);
        } else {
            return null;
        }
    }
    // let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    // let r = window.location.search.substr(1).match(reg);
    // if (r != null) return unescape(r[2]);
    // return null;
}
export let getHomeUrlParam = function (name) {
    let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    let r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}
