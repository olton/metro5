import "./form.css"
import {Component} from "../../core/component.js";
import {merge} from "../../routines/merge.js";
import {Validator} from "./validator.js";

let FormDefaultOptions = {
    deferred: 0,
    validate: true,
}

export class Form extends Component {
    constructor(elem, options) {
        if (typeof globalThis["metroFormSetup"] !== "undefined") {
            FormDefaultOptions = merge({}, FormDefaultOptions, globalThis["metroFormSetup"])
        }
        super(elem, "form", merge({}, FormDefaultOptions, options));
        setTimeout(()=>{
            this.createStruct()
            this.createEvents()
        }, this.options.deferred)
    }

    createStruct(){}
    createEvents(){}
}

export {
    Validator
}