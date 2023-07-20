import {exec, merge, noop_arg, undef} from "../../routines";
import {Component} from "../../core/component.js";
import {Registry} from "../../core/registry.js";

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
        this.element.addClass("table")
        this.setupHeader()
        this.draw()
    }

    #parseHeaderFromHtml(){
        const header = this.element.find("thead")
        const headerCells = header.find("th")
        $.each(headerCells, (i, _cell) => {
            const cell = $(_cell)
            this._head.push({
                name: cell.attr("data-name") || cell.text() || `Field${i+1}`,
                caption: cell.html() || `Field${i+1}`,
                sortable: JSON.parse(cell.attr("data-sortable") || false),
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

    #parseHeaderFromObject(header){
        $.each(header, (i, cell) => {
            this._head.push({
                name: cell.name || `Field${i+1}`,
                caption: cell.caption || cell.name || `Field${i+1}`,
                sortable: cell.sortable || false,
                sortDir: cell.sortDir || "none",
                format: cell.format || "none",
                locale: cell.locale || "en-US",
                size: cell.size || "default",
                show: cell.show || true,
                template: cell.template || ""
            })
        })
        return this
    }

    setupHeader(header){
        if (undef(header)) {
            this.#parseHeaderFromHtml()
        } else {
            this.#parseHeaderFromObject(header)
        }
    }

    #parseBody(){
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
        const element = this.element, o = this.options
        const header = element.find("thead").clear()
        const headerRow = $("<tr>").appendTo(header)

        $.each(this._head, (i, h) => {
            const th = $("<th>").attr("data-name", h.name).html(h.caption).appendTo(headerRow)
        })

        return this
    }

    _drawBody(){
        // const element = this.element, o = this.options
        // const body = element.find("tbody").clear()
        //
        // for(let row of this._items) {
        //     const data = Array.isArray(row) ? row : Object.values(row)
        //     const tr = $("<tr>"), _tr = tr[0]
        //     let tdIndex = 0
        //     for(let cell of data) {
        //         const td = $("<td>"), _td = td[0]
        //         const head = this._head[tdIndex]
        //         td.html(exec(o.onDrawCellData, [cell, head]))
        //         tr.append(exec(o.onDrawCell, [_td, head]))
        //         tdIndex++
        //     }
        //     body.append(exec(o.onDrawRow, [_tr]))
        // }
    }

    _drawFoot(){

    }
}

Registry.register("table", Table)