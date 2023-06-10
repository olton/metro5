import {Dataset} from "./dataset.js";
import {merge, undef} from "../../routines/index.js";
import {Fetcher} from "../fetcher/index.js";

let RemoteDatasetDefaultOptions = {
    url: "",
}

export class RemoteDataset extends Dataset {
    _fetcher = null
    _filters = []

    constructor(options) {
        if (typeof globalThis["metroRemoteDatasetSetup"] !== "undefined") {
            RemoteDatasetDefaultOptions = merge({}, RemoteDatasetDefaultOptions, globalThis["metroRemoteDatasetSetup"])
        }

        super(merge({}, RemoteDatasetDefaultOptions, options));

        this._fetcher = new Fetcher()
    }

    async get(...args){
        const {url, options} = this._options

        this._items = await this._fetcher
            .url(url)
            .options(options)
            .args(...args)
            .run()

        if (this._filters.length) {
            for(let fn of this._filters) {
                this._items = this._items.filter(fn)
            }
        }

        return this.items()
    }

    url(newUrl){
        if (undef(newUrl)) {
            return this._options.url
        }
        this._options.url = newUrl
        return this
    }

    options(newOptions){
        this._options = merge(this._options, newOptions)
        return this
    }

    filters(...fns){
        this._filters = [...fns]
        return this
    }
}