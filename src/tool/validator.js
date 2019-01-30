import {type} from './validate'
import {isFunction} from "./tool";
import $ from 'jquery'
class Validator {
    constructor ({type}) {
        this.depends={};
        this.type=type;
    }
    validate ({ctx,key,rules}) {
        this.ctx=ctx;
        this.rules=rules;
        this.key=key;
        this.removeCache();
        return Object.keys(rules).map(this.engine,this).every( valid => valid );
    }
    removeCache () {
        this.depends={}
    }
    engine (key) {
        // 获取校验规则
        let rule=this.rules[key];
        let depends=this.getDepends(rule); // 获取依赖项，补全依赖项中的信息
        let name=isFunction(rule.name) ? rule.name(depends) : rule.name;

        return !Object.keys(this.type).some(type => {
            let point = rule[type]; // 获取校验点
            let predefine = this.type[type]; // 获取校验预置对象
            let valid = true;
            rule.tips='';
            let option = {}; // 可选对象
            // 判断是否需要校验
            if (!point) {
                return false;
            }
            let need = this.getNeed(rule,depends); // required 校验前的判定
            if (type==='required' && isFunction(rule.need) && !need) {
                return false; // 依据 need 判断是否跳过 required 校验点
            }

            let customizeTip = this.isCustomizeTip(rule,depends); // 自定义提示
            let tipsText = this.isTextTips(rule,depends);

            // 规则校验是否依赖 input 输入框的值, 如果 depends 项中罗列的项不能找到数据, 则需要一个 input

            let hasInput = !!rule.input;
            let input = this.getInput(rule);
            if (hasInput) {
                option.input=input;
            }
            if (type!=='required' && !input) {
                // 非 required 输入框 无内容跳过该校验点（非必填项，若填写必须满足校验规则）
                return false;
            }
            if (isFunction(point)) {
                option.reg = predefine.reg;
                if (customizeTip) {
                    if (!point(depends,option)) {
                        rule.tips = tipsText;
                    }
                    return !point (depends,option);
                }else{
                    valid = !point(depends,option);
                }
            }else {
                if (predefine.validate) {
                    if (Array.isArray(input)) {
                        valid = input.every(it => predefine.validate({input:it,reg:predefine.reg,set:point}));
                    }else{
                        valid = predefine.validate({input,reg:predefine.reg,set:point})
                    }
                }else if (predefine.reg) {
                    if (Array.isArray(input)) {
                        valid = input.every(it => predefine.reg.test(it));
                    }else{
                        valid = predefine.reg.test(input);
                    }
                }else{
                    throw new Error(`${JSON.stringify(rule)} should have a validate function or a regExp`);
                }
            }

            if (!valid) {
                rule.tips = predefine.tips({name,set:point,input});
            }
            this.ctx.setState({[this.key]:this.rules});
            return !valid;
        })

    }
    _getInput (input) {
        return this.ctx.$ ? this.ctx.$(`[name="${input}"]`).val() : $(`[name="${input}"]`).val();
    }
    getInput ({input}) {
        if(input){
            if(Array.isArray(input)){
                return input.map(it => {
                    return this._getInput(it);
                })
            }else{
                return this._getInput(input);
            }
        }
    }

    isTextTips ({tipsText},depends) {
        return isFunction(tipsText) ? tipsText(depends) : tipsText;
    }
    // 自定义提示
    isCustomizeTip ({customizeTip},depends) {
        return isFunction(customizeTip) ? customizeTip(depends) : customizeTip;
    }
    getNeed ({need},depends) {
        return isFunction(need) ? need(depends):need;
    }
    // 获取依赖项的数据
    getOneDepend (key) {
        if(!this.depends[key]){
            this.depends[key]=this.ctx[key];
        }
        return this.depends[key];
    }
    getDepends ({depends=[]}) {
        let res = {};
        if(Array.isArray(depends)){
            depends.forEach(key => {
                res[key]=this.getOneDepend(key);
            })
        }else if(typeof depends === 'string'){
            let key=depends;
            res[key]=this.getOneDepend(key);
        }
        return res;
    }

}

let validator = new Validator({type});
export let validate = validator.validate.bind(validator);