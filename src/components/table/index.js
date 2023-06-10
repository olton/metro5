import "./table.css"
import {Component} from "../../core/component.js";
import {merge, undef} from "../../routines/index.js";
import {_dataset} from "../dataset/_dataset.js";

let TableDefaultOptions = {
    url: null,
    searchUrl: null,
}

export class Table extends Component {
    #dataset = null
    #filters = []
    #service = null
    #header = null
    #view = null

    constructor(elem, options) {
        if (!undef(globalThis["metroTableSetup"])) {
            TableDefaultOptions = merge({}, TableDefaultOptions, globalThis["metroTableSetup"])
        }

        super(elem, "table", merge({}, TableDefaultOptions, options));

        this.#setupDataset()
    }

    #setupDataset(){
        const o = this.options


    }

    createStruct(){

    }

    createEvents(){

    }
}