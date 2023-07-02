import {exec, merge, noop_arg} from "../../routines";
import {Component} from "../../core/component.js";

let TableDefaultOptions = {
    onDrawRow: noop_arg,
    onDrawCell: noop_arg,
    onDrawCellData: noop_arg,
}

export class Table extends Component {
    _origin = []
    _items = []
    _filters = []
    _search = null
    _head = null
    _foot = null

    constructor(elem, options) {
        if (typeof globalThis["metroTableSetup"] !== "undefined") {
            TableDefaultOptions = merge({}, TableDefaultOptions, globalThis["metroTableSetup"])
        }
        super(elem, "table", merge({}, TableDefaultOptions, options))
    }

    head(head){
        if (typeof head === "undefined") {
            return this._head
        }
        this._head = head
        return this
    }

    items(){
        return this._items
    }

    origin(){
        return this._origin
    }

    filters(...fns){
        this._filters = [...fns]
        return this
    }

    search(fn){
        this._search = fn
        return this
    }

    sort(){

    }

    draw(){
        this._drawHead()
        this._drawBody()
        this._drawFoot()
    }

    _drawHead(){

    }

    _drawBody(){
        const element = this.element, o = this.options
        const body = element.find("tbody").clear()

        for(let row of this._items) {
            const data = Array.isArray(row) ? row : Object.values(row)
            const tr = $("<tr>"), _tr = tr[0]
            let tdIndex = 0
            for(let cell of data) {
                const td = $("<td>"), _td = td[0]
                const head = this._head[tdIndex]
                td.html(exec(o.onDrawCellData, [cell, head]))
                tr.append(exec(o.onDrawCell, [_td, head]))
                tdIndex++
            }
            body.append(exec(o.onDrawRow, [_tr]))
        }
    }

    _drawFoot(){

    }
}