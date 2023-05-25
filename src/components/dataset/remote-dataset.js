import {exec, merge, noop_arg, panic, required} from "../../routines/index.js";

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
    onData: noop_arg
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
    }

    async _fetch(){
        required(this._url, "RemoteDataset->fetch :: Source required for this operation!")

        const o = this._options

        this._response = await fetch(this._url, {
            method: this._method,
            headers: merge({}, {
                "Content-Type": o.contentType
            }, o.headers),
            body: this._body ? JSON.stringify(this._body) : null
        })

        if (!this._response.ok){
            panic(`We can't receive data for source ${this._url}!`)
        }

        return exec(this._options.onData, [await this._response.json()])
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
        this._items = await this._fetch()
        return this
    }

    setPage([page = 1, limit = 10]){
        this._page = page
        this._limit = limit
        return this
    }

    setBody(body){
        this._body = body
        return this
    }

    setMethod(method = "GET"){
        this._method = method
        return this
    }

    setHeaders(headers = {}){
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

    async search(query = ""){
        this._url = this._options.searchUrl.replace("$1", query)
        this._items = await this._fetch()
        return this
    }
}