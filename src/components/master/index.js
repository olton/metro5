import "./master.css"
import {Component} from "../../core/component.js";
import {merge, undef} from "../../routines/index.js";
import {Registry} from "../../core/registry.js";

let MasterDefaultOptions = {
    locale: "en-US"
}

export class Master extends Component {
    constructor(elem, options) {
        if (!undef(globalThis["metroMasterSetup"])) {
            MasterDefaultOptions = merge({}, MasterDefaultOptions, globalThis["metroMasterSetup"])
        }
        super(elem, "master", merge({}, MasterDefaultOptions, options))
        this.createStruct()
        this.createEvents()
    }

    createStruct(){
        const element = this.element, o = this.options

        const masterActions = $("<div>").addClass("master__actions").appendTo(element)
        const actions = ["help", "prev", "next", "finish"]

        actions.map((v) => {
            const btn = $("<button>").addClass(`button master__btn-${v}`).html(v).appendTo(masterActions)
            btn.fadeIn()
        })
    }

    createEvents(){}
}

Registry.register("master", Master)