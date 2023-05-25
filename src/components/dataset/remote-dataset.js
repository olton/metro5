import {exec, merge, noop, noop_arg, panic, required} from "../../routines/index.js";

let RemoteDatasetOptions = {
    source: "",
    searchUrl: "",
    searchMethod: "GET",
    method: "GET",
    contentType: "application/json; charset=UTF-8",
    headers: {},
    body: null,
    locale: "en-US",
    page: 1,
    limit: 10,
    onData: noop_arg,
    onFail: noop
}

export class RemoteDataset {
    _url = null
    _page = 1
    _limit = 10
    _body = null
    _method = "GET"
    _headers = {}
    _items = []

    constructor(options) {
        this._options = merge({}, RemoteDatasetOptions, options)
        this._url = this._options.source
        this._body = this._options.body
        this._method = this._options.method
        this._headers = merge({}, this._options.headers)
        this._page = this._options.page
        this._limit = this._options.limit
        this._count = 0
        this._contentType = this._options.contentType
    }

    async _fetch(){
        required(this._url, "RemoteDataset->fetch :: Source required for this operation!")

        const o = this._options

        this._response = await fetch(this._url, {
            method: this._method,
            headers: merge({}, {
                "Content-Type": this._contentType
            }, this._headers),
            body: this._body ? JSON.stringify(this._body) : null
        })

        if (!this._response.ok) {
            panic(`We can't receive data for source ${this._url}! Response status ${this._response.status}!`)
        }

        return await this._response.json()
    }

    async run(arg = []){
        if (!arg.length) {
            this._url = this._options.source
                .replace("$1", "" + this._page)
                .replace("$2", "" + this._limit)
        } else {
            if (Array.isArray(arg)) {
                let index = 1
                this._url = this._options.source
                for (let i of arg) {
                    this._url = this._url.replace(`$${index}`, i)
                    index++
                }
            }
        }
        try {
            this._items = await this._fetch()
            this._count = this._items.length
            exec(this._options.onData, [this._items])
            return this
        } catch (e) {
            console.error(e.message)
        }
    }

    async search(query = ""){
        this._url = this._options.searchUrl.replace("$1", query)
        this._items = await this._fetch()
        return this
    }

    get response(){
        return this._response
    }

    get ok(){
        return this._response.ok
    }

    get status(){
        return this._response.status
    }

    get count(){
        return this._count
    }

    page([page = 1, limit = 10]){
        this._page = page
        this._limit = limit
        return this
    }

    body(body){
        this._body = body
        return this
    }

    method(method = "GET"){
        this._method = method
        return this
    }

    contentType(val){
        this._contentType = val
        return this
    }

    headers(headers = {}){
        this._headers = merge({}, this._headers, headers)
        return this
    }

    items(){
        return this._items
    }

    filter(...fn){
        for(let f of fn) {
            this._items = this._items.filter(f)
        }
        return this
    }
}