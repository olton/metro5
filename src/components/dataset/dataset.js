import {clearStr, compare, exec, isObjectType, merge, noop_arg, panic, required} from "../../routines/index.js";

export let DatasetDefaultOptions = {
    method: "GET",
    contentType: "application/json",
    headers: {},
    body: null,
    locale: "en-US",
    onData: noop_arg
}

export class Dataset {
    _source = null
    _origin = []
    _items = []
    _response = null
    _header = null
    _data = null
    _options = null
    _loaded = false

    constructor(source, options) {
        required(source, `Source value required!`)
        this._options = merge({}, DatasetDefaultOptions, options)
        this._source = source
    }

    _distribute(){
        panic(`You must override the distribute() method!`)
    }

    async _load(){
        let obj = isObjectType(this._source)
        if (obj) {
            this._origin = obj
        } else {
            this._origin = await this._fetch()
        }
        this._origin = exec(this._options.onData, [this._origin])
        return this
    }

    async _fetch(){
        const o = this._options
        this._response = await fetch(this._source, {
            method: o.method,
            headers: merge({}, {
                "Content-Type": o.contentType
            }, o.headers),
            body: o.body ? JSON.stringify(o.body) : null
        })
        if (!this._response.ok){
            panic(`We can't receive data for source ${this._source}!`)
        }

        return await this._response.json()
    }

    async run(){
        await this._load()
        this._distribute()
        this.init()
        this._loaded = true
    }

    origin(){
        return this._origin
    }

    header(){
        return this._header
    }

    data(){
        return this._data
    }

    items(){
        return this._items
    }

    count(){
        return this._items.length
    }

    init(){
        this._items = this._data
        return this
    }

    async reload(source, options){
        this._loaded = false
        this._options = merge({}, this._options, options)
        this._source = source
        await this.run()
        return this
    }

    setOptions(options){
        this._options = merge({}, this._options, options)
        return this
    }

    setSource(source){
        this._source = source
        return this
    }

    page(num, offset = 25){
        const pageData = []

        for(let i = (num - 1) * offset; i < num * offset; i++) {
            if (this._items[i]) pageData.push(this._items[i])
        }

        return pageData
    }

    filter(...fn){
        for(let f of fn) {
            this._items = this._items.filter(f)
        }
        return this
    }

    search(query = ""){
        this._items = this._items.filter( row => JSON.stringify(row).toLowerCase().includes(clearStr(query).toLowerCase()))
        return this
    }

    sort(dir = "asc"){
        this._items = this._items.sort((a, b) => {
            const curr = a.join().toLowerCase()
            const next = b.join().toLowerCase()

            return compare(curr, next, dir)
        })
        return this
    }

}