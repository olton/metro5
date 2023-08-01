import {Component} from "../../core/component.js";
import {merge, undef} from "../../routines/index.js";

let SelectDefaultOptions = {

}

export class Select extends Component {
    constructor(elem, options) {
        if (!undef(globalThis["metroSelectSetup"])) {
            SelectDefaultOptions = merge({}, SelectDefaultOptions, globalThis["metroSelectSetup"])
        }
        super(elem, "select", merge({}, SelectDefaultOptions, options))
        this.createStruct()
        this.createEvents()
    }

    createStruct(){

    }

    createEvents(){

    }
}