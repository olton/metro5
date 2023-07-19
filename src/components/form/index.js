import "./form.css"
import {Component} from "../../core/component.js";
import {merge} from "../../routines/merge.js";
import {Validator} from "../validator";
import {Registry} from "../../core/registry.js";
import {exec} from "../../routines/exec.js";
import {noop, noop_true} from "../../routines/noop.js";

let FormDefaultOptions = {
    interactive: true,
    submitTimeout: 200,
    onBeforeReset: noop_true,
    onBeforeSubmit: noop_true,
    onResetForm: noop,
    onSubmitForm: noop,
    onValidateForm: noop,
    onInValidateForm: noop,
}

export class Form extends Component {
    constructor(elem, options) {
        if (typeof globalThis["metroFormSetup"] !== "undefined") {
            FormDefaultOptions = merge({}, FormDefaultOptions, globalThis["metroFormSetup"])
        }
        super(elem, "form", merge({}, FormDefaultOptions, options));
        this.createStruct()
    }

    createStruct(){
        const that = this, elem = this.elem, element = this.element, o = this.options
        const inputs = element.find("[data-validate]")

        element
            .attr("novalidate", 'novalidate');

        $.each(inputs, (i, el) => {
            const input = $(el)
            if (o.interactive) {
                input.on("change input propertychange cut paste copy drop", function(){
                    that.resetState(this)
                    const result = Validator.validateElement(this)
                    that.setInputState(this, Validator.checkResult(result))
                })
            }
        })

        this._onsubmit = null;
        this._onreset = null;

        if (elem.onsubmit !== null) {
            this._onsubmit = element[0].onsubmit;
            elem.onsubmit = null;
        }

        if (elem.onreset !== null) {
            this._onreset = element[0].onreset;
            elem.onreset = null;
        }

        elem.onsubmit = function(){
            return that.submit();
        };

        elem.onreset = function(){
            return that.reset();
        };
    }

    isControl(el){
        const parent = $(el).parent()
        return parent.hasClass("input") ||
               parent.hasClass("select") ||
               parent.hasClass("checkbox") ||
               parent.hasClass("radio") ||
               parent.hasClass("textarea") ||
               parent.hasClass("switch") ||
               parent.hasClass("spinner")
    }

    setInputState(el, state){
        const input = $(el)
        const target = this.isControl(input) ? input.parent() : input
        if (!state) {
            target.addClass("invalid")
        } else {
            target.addClass("valid")
        }
    }

    resetState(el){
        const input = $(el);
        const target = this.isControl(input) ? input.parent() : input
        target.removeClass("invalid valid")
    }

    submit(){
        const element = this.element, o = this.options
        const inputs = element.find("[data-validate]");
        const submit = element.find("input[type=submit], button[type=submit]");
        const formData = $.serialize(this.elem)
        let validData = true

        submit.attr("disabled", "disabled").addClass("disabled");

        $.each(inputs, (_, el)=>{
            this.resetState(el)
            const result = Validator.validateElement(el)
            const state = Validator.checkResult(result)
            this.setInputState(el, state)
            if (!state) {
                validData = false
            }
        })

        submit.removeAttr("disabled").removeClass("disabled");

        if (!validData) {
            this.fireEvent("InValidate", formData)
            return
        }

        if (!exec(o.onBeforeSubmit, [formData])) {
            this.fireEvent("inValidate", formData)
            return
        }

        this.fireEvent("validate", formData)

        setTimeout(()=>{
            exec(o.onSubmitForm, [formData], this.elem)
            this.fireEvent("submitForm", formData)
            if (this._onsubmit !==  null) exec(this._onsubmit, [formData], this.elem);
        }, o.submitTimeout)
    }

    reset(){
        const o = this.options
        if (!exec(o.onBeforeReset, [this.elem])) return
        $.each(this.element.find("[data-validate]"), (i, el) => {
            this.resetState(el)
        })
        if (this._onreset !==  null) exec(this._onreset, null, this.element[0]);
        exec(o.onResetForm, [this.elem])
    }
}

Registry.register("form", Form)

export {
    Validator
}