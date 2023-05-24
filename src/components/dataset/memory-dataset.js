import {panic, compare, parse, clearStr} from "../../routines/index.js";
import {Dataset} from "./dataset.js";

export class MemoryDataset extends Dataset {

    constructor(source, options) {
        super(source, options)
    }

    search(query = ""){
        this._items = this._items.filter( row => row.join().toLowerCase().includes(clearStr(query).toLowerCase()))
        return this
    }

    _distribute() {
        this._data = [...this._origin.data]
        this._header = [...this._origin.header]
    }

    _getField(name){
        if (!this._header) {
            panic(`MemoryDataset->getField() :: Header data required!`)
        }
        let index= 0
        for(let field of this._header) {
            if (field.name === name) {
                return [field, index]
            }
            index++
        }
        return undefined
    }

    sortBy(fieldName, dir = "asc", type = "default"){
        const field = this._getField(fieldName)

        if (!field) {
            panic(`Wrong field name [${fieldName}] in header!`)
        }

        const [{name, sortable = true, sortDir, format = type, formatMask}, dataIndex = -1] = field

        if (dataIndex < 0) {
            panic(`Wrong field name [${fieldName}] in dataset!`)
        }

        this._items = this._items.sort((a, b) => {
            const curr = parse(a[dataIndex], {format, formatMask, locale: this._options.locale})
            const next = parse(b[dataIndex], {format, formatMask, locale: this._options.locale})

            return compare(curr, next, sortDir || dir)
        })
        return this
    }
}