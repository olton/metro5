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
    _sort = null
    _head = []
    _foot = []
    _view = []

    constructor(elem, options) {
        if (typeof globalThis["metroTableSetup"] !== "undefined") {
            TableDefaultOptions = merge({}, TableDefaultOptions, globalThis["metroTableSetup"])
        }
        super(elem, "table", merge({}, TableDefaultOptions, options))
    }

    parseHeader(){
        const header = this.element.find("thead")
        const headerCells = header.find("th")
        $.each(headerCells, (i, cell) => {
            this._head.push({
                name: cell.attr("data-name") || cell.html() || `Field${i+1}`,
                sortable: JSON.parse(cell.attr("data-sortable")),
                sortDir: cell.attr("data-sort-dir") || "none",
                format: cell.attr("data-format") || "none",
                locale: cell.attr("data-locale") || "en-US",
                size: cell.attr("data-size") || "default",
                show: JSON.parse(cell.attr("data-show") || true),
                template: cell.attr("data-template") || ""
            })
        })
        return this
    }

    parseBody(){
        const body = this.element.find("tbody")
        $.each(body.find("tr"), (trIndex, tr) => {
            const tdArray = []
            $.each(tr.find("td"), (tdIndex, td) => {
                tdArray.push({
                    className: td[0].className,
                    cellData: td.html()
                })
            })
            this._origin.push(tdArray)
        })
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

    sort(fn){
        this._sort = fn
        return this
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