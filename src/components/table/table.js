import {exec, isObjectType, merge, noop_arg, undef} from "../../routines";
import {Component} from "../../core/component.js";
import {Registry} from "../../core/registry.js";
import {Dataset} from "../dataset/index.js";

let TableDefaultOptions = {
    dataset: null,
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
        this.createStruct()
        this.createEvents()
    }

    createStruct(){
        const element = this.element, o = this.options

        element.addClass("table")
        this.component = element.wrap("<div>").addClass("table-component")

        this.setDataset()
        this.parseHeader()
        this.parseBody()

        this.draw()
    }

    createEvents(){

    }

    setDataset(){
        const element = this.element, o = this.options
        let dataset

        if (o.dataset instanceof Dataset) {

        } else {
            dataset = isObjectType(o.dataset)
        }
    }

    parseHeader(header){
        if (undef(header)) {
            const header = this.element.find("thead")
            const headerCells = header.find("th")
            $.each(headerCells, (i, _cell) => {
                const cell = $(_cell)
                this._head.push({
                    name: cell.attr("data-name") || cell.text() || `Field${i + 1}`,
                    caption: cell.html() || `Field${i + 1}`,
                    sortable: JSON.parse(cell.attr("data-sortable") || false),
                    sortDir: cell.attr("data-sort-dir") || "none",
                    format: cell.attr("data-format") || "none",
                    locale: cell.attr("data-locale") || "en-US",
                    size: cell.attr("data-size") || "default",
                    show: JSON.parse(cell.attr("data-show") || true),
                    template: cell.attr("data-template") || ""
                })
            })
        } else {
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
        }
        return this
    }

    parseBody(data){
        if (undef(data)) {
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
        } else {
            this._origin = data
        }
        return this
    }

    get items(){
        return this._items
    }

    get origin(){
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
            if (h.sortable) {
                th.addClass("sorting")
                if (h.sortDir !== "none") {
                    th.addClass(`sort-${h.sortDir}`)
                }
            }
        })

        return this
    }

    _drawBody(){

    }

    _drawFoot(){

    }
}

Registry.register("table", Table)