import {Component} from "../../core/component.js";
import {compare, merge, parse, undef} from "../../routines/index.js";
import {Registry} from "../../core/registry.js";

export const SORT_ASC = "asc"
export const SORT_DESC = "desc"

let SorterDefaultOptions = {
    sort: SORT_ASC,
    format: "default",
    formatMask: null,
    locale: "en-US"
}


export class Sorter extends Component {
    items = []

    constructor(elem, options) {
        if (!undef(globalThis['metroSorterSetup'])) {
            SorterDefaultOptions = merge({}, SorterDefaultOptions, globalThis['metroSorterSetup'])
        }
        super(elem, "sorter", merge({}, SorterDefaultOptions, options))
        this.sort()
    }

    sort(options){
        this.options = merge(this.options, options)

        this.items = this.element.children().sort((a, b)=>{
            const _a = parse($(a).text(), {...this.options})
            const _b = parse($(b).text(), {...this.options})
            return compare(_a, _b, this.options.sort)
        })
        this.element.clear().append(...this.items)
    }

    updateAttr(attr, newVal, oldVal) {
        switch (attr) {
            case "data-sort": this.options.sort = newVal; break;
            case "data-format": this.options.format = newVal; break;
            case "data-format-mask": this.options.formatMask = newVal; break;
            case "data-locale": this.options.locale = newVal; break;
        }
        this.sort()
    }
}

Registry.register("sorter", Sorter)