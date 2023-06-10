import {merge, panic, undef} from "../../routines/index.js";

let FetcherDefaultOptions = {
    url: "",
    contentType: "application/json",
    method: "GET",
    headers: null,
    body: null,
    mode: "cors",
    credentials: "omit",
    cache: "default",
    redirect: "follow",
    referrer: "client",
    referrerPolicy: "no-referrer",
    integrity: null,
    keepalive: null,
    signal: null,
}

export class Fetcher {
    #url = null
    #options = {}

    constructor(options) {
        if (typeof globalThis["metroFetcherSetup"] !== "undefined") {
            FetcherDefaultOptions = merge({}, FetcherDefaultOptions, globalThis["metroFetcherSetup"])
        }

        this.#options = merge({}, FetcherDefaultOptions, options)

        if (this.#options.url) {
            this.url(this.#options.url)
        }
    }

    async #fetch(){
        const o = this.#options

        const init = {
            method: o.method,
            headers: {
                "Content-Type": o.contentType,
                ...merge({}, o.headers)
            },
            mode: o.mode,
            credentials: o.credentials,
            cache: o.cache,
            redirect: o.redirect,
            referrer: o.referrer,
            referrerPolicy: o.referrerPolicy,
            keepalive: o.keepalive,
        }

        if (o.body) init.body = JSON.stringify(o.body)
        if (o.integrity) init.integrity = o.integrity
        if (o.signal instanceof AbortSignal) init.signal = o.signal

        this._response = await fetch(this.#url, init).catch(error => panic(error))

        if (!this._response.ok){
            panic(`We can't receive data for source ${this.#url}!`)
        }

        return await this._response.json()
    }

    url(val){
        if (undef(val)) {
            return this.#url
        }
        this.#url = val
        return this
    }

    args(...args){
        [...args].forEach((v, i) => {
            this.#url = this.#url.replace(`$${i+1}`, v)
        })
        return this
    }

    options(options){
        this.#options = merge(this.options, options)
        return this
    }

    async run(){
        return await this.#fetch()
    }
}
