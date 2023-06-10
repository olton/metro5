import {merge} from "../../routines/index.js";

let DatasetDefaultOptions = {

}

export class Dataset {
    _items = []
    _options = {}

    constructor(options) {
        this._options = merge({}, DatasetDefaultOptions, options)
    }

    items(){
        return this._items
    }
}