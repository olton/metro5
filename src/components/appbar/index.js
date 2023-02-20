import "./appbar.css"
import {Component} from "../../core/component.js";
import {Registry} from "../../core/registry.js";
import {merge} from "../../routines/merge.js";

let AppbarDefaultOptions = {
    deferred: 0
}

export class Appbar extends Component {
    constructor(elem, options) {
        if (typeof globalThis["metroAppbarSetup"] !== "undefined") {
            AppbarDefaultOptions = merge({}, AppbarDefaultOptions, globalThis["metroAppbarSetup"])
        }
        super(elem, "appbar", merge({}, AppbarDefaultOptions, options));
        setTimeout(()=>{
            this.createStruct()
            this.createEvents()
        }, this.options.deferred)
    }

    createStruct(){}
    createEvents(){}
}

Registry.register("appbar", Appbar)