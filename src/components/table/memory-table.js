import {Table} from "./table.js";
import {merge} from "../../routines/index.js";
import {Dataset} from "../dataset/index.js";

let MemoryTableDefaultOptions = {
    source: null,
    url: null,
    urlOptions: null,
}

export class MemoryTable extends Table {
    _dataset = null

    constructor(elem, options) {
        if (typeof globalThis["metroMemoryTableSetup"] !== "undefined") {
            MemoryTableDefaultOptions = merge({}, MemoryTableDefaultOptions, globalThis["metroMemoryTableSetup"])
        }
        super(elem, merge({}, MemoryTableDefaultOptions, options));
        this._dataset = new Dataset({
            ...this.options.urlOptions
        })
        this.get()
    }

    load(){
        this._dataset.url(this.options.url).get().then(data => {
            this._head = data.head
            this._origin = data.data
            this._foot = data.foot
            this.draw()
        })

        return this
    }


}