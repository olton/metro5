import {undef} from "../../routines/undef.js";
import {exec, isFunc} from "../../routines/exec.js";
import {to_array} from "../../routines/to-array.js";

export const Validator = {
    required: function(val){
        if (Array.isArray(val)) {
            return val.length > 0 ? val : false;
        } else {
            return val ? val.trim() : false;
        }
    },
    length: function(val, len){
        if (Array.isArray(val)) {return val.length === parseInt(len);}
        if (isNaN(len) || len <= 0) {
            return false;
        }
        return val.trim().length === parseInt(len);
    },
    minlength: function(val, len){
        if (Array.isArray(val)) {return val.length >= parseInt(len);}
        if (isNaN(len) || len <= 0) {
            return false;
        }
        return val.trim().length >= parseInt(len);
    },
    maxlength: function(val, len){
        if (Array.isArray(val)) {return val.length <= parseInt(len);}
        if (isNaN(len) || len <= 0) {
            return false;
        }
        return val.trim().length <= parseInt(len);
    },
    min: function(val, min_value){
        if (isNaN(min_value)) {
            return false;
        }
        if (!this.number(val)) {
            return false;
        }
        if (isNaN(val)) {
            return false;
        }
        return Number(val) >= Number(min_value);
    },
    max: function(val, max_value){
        if (max_value || isNaN(max_value)) {
            return false;
        }
        if (!this.number(val)) {
            return false;
        }
        if (isNaN(val)) {
            return false;
        }
        return Number(val) <= Number(max_value);
    },
    email: function(val){
        /* eslint-disable-next-line */
        return /^[a-z0-9\u007F-\uffff!#$%&'*+\/=?^_`{|}~-]+(?:\.[a-z0-9\u007F-\uffff!#$%&'*+\/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z]{2,}$/i.test(val);
    },
    domain: function(val){
        /* eslint-disable-next-line */
        return /^((xn--)?[a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,}$/.test(val);
    },
    url: function(val){
        /* eslint-disable-next-line */
        const regexp    = /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z0-9\u00a1-\uffff][a-z0-9\u00a1-\uffff_-]{0,62})?[a-z0-9\u00a1-\uffff]\.)+(?:[a-z\u00a1-\uffff]{2,}\.?))(?::\d{2,5})?(?:[/?#]\S*)?$/i;
        return regexp.test(val);
    },
    date: function(val, format, locale){
        try {
            if (!format) {
                datetime(val);
            } else {
                Datetime.from(val, format, locale);
            }
            return true;
        } catch (e) {
            return false;
        }
    },
    number: function(val){
        return !isNaN(val);
    },
    integer: function(val){
        return !isNaN(val) && Number.isInteger(+val);
    },
    float: function(val){
        return !isNaN(val) && !Number.isInteger(+val);
    },
    digits: function(val){
        return /^\d+$/.test(val);
    },
    hexcolor: function(val){
        /* eslint-disable-next-line */
        return /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(val);
    },
    color: function(val){ // TODO check it
        if (undef(val)) return false;
        return Color.isColor(val);
    },
    pattern: function(val, pat){
        if (undef(val)) return false;
        if (undef(pat)) return false;
        const reg = new RegExp(pat);
        return reg.test(val);
    },
    compare: function(val, val2){
        return val === val2;
    },
    not: function(val, not_this){
        return val !== not_this;
    },
    notequals: function(val, val2){
        if (undef(val)) return false;
        if (undef(val2)) return false;
        return val.trim() !== val2.trim();
    },
    equals: function(val, val2){
        if (undef(val)) return false;
        if (undef(val2)) return false;
        return val.trim() === val2.trim();
    },
    custom: function(val, func){
        if (isFunc(func) === false) {
            return false;
        }
        return exec(func, [val]);
    },

    validate(val, functions = ""){
        const result = {}
        $.each(to_array(functions, " "), (i, f) => {
            const rule = f.split("=")
            const fn = rule[0]; rule.shift()
            const ab = rule.join("=")
            if (['compare', 'equals', 'notequals'].includes(fn)) {
                const val2 = $(`[name=${ab}]`).val()
                result[fn] = this[fn].apply(null, [val, val2])
            } else if (fn === "custom") {
                result[fn] = this.custom(val, fn)
            } else {
                result[fn] = this[fn].apply(null, [val, ab])
            }
        })
        return result
    },

    validateElement(el, functions){
        const $el = $(el)

        if (!functions) {
            functions = $el.attr("data-validate")
        }

        if ($el.attr("type").toLowerCase() === 'checkbox' && functions.includes("required")) {
            return {
                "required": $el.is(":checked")
            }
        }

        else if ($el.attr("type").toLowerCase() === "radio"  && functions.includes("required")) {
            const name = $el.attr("name")
            const checks = $("input[name=" + name.replace("[", "\\\[").replace("]", "\\\]") + "]:checked");
            return {
                "required": checks.length
            }
        }

        else
        return this.validate($el.val(), functions)
    },

    checkResult(result){
        for(let key in result) {
            if (result[key] === false) {
                return false
            }
        }
        return true
    }
}