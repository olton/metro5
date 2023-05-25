import {Dataset} from "./dataset.js";
import {clearStr, compare, parse, required} from "../../routines/index.js";

export class JsonDataset extends Dataset {
    constructor(options) {
        required(options.source, `Source value required!`)
        super(options)
    }

    _distribute() {
        this._data = [...this._origin]
    }

    search(query = ""){
        this._items = this._items.filter( row => Object.values(row).join().toLowerCase().includes(clearStr(query).toLowerCase()))
        return this
    }

    sortBy(fieldName, dir = "asc", format = "default", formatMask, locale){
        this._items = this._items.sort((a, b)=>{
            const curr = parse(a[fieldName], {format, formatMask, locale: locale || this._options.locale})
            const next = parse(b[fieldName], {format, formatMask, locale: locale || this._options.locale})

            return compare(curr, next, dir)
        })
        return this
    }
}