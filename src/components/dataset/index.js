import {isObjectType, merge, panic, required} from "../../routines";

let DatasetDefaultOptions = {
    method: "GET",
    contentType: "application/json",
    headers: {},
    body: null,
}

export class Dataset {
    #source = null
    #origin = []
    #items = []
    #response = null
    #header = null
    #data = null
    #options = null

    constructor(source, options) {
        required(source)
        this.#options = merge({}, DatasetDefaultOptions, options)
        this.#source = source
        this.#load()
    }

    async #load(){
        let obj = isObjectType(this.#source)
        if (obj) {
            this.#origin = obj
        } else {
            await this.#fetch()
        }
        this.#data = this.#origin.data
        this.#header = this.#origin.header
    }


    async #fetch(){
        const o = this.#options
        this.#response = await fetch(this.#source, {
            method: o.method,
            headers: merge({}, {
                "Content-Type": o.contentType
            }, o.headers),
           body: o.body ? JSON.stringify(o.body) : null
        })
        if (!this.#response.ok){
            panic(`We can't receive data for source ${this.#source}!`)
        }
        this.#origin = await this.#response.json()
        return this
    }

    origin(){
        return this.#origin
    }

    header(){
        return this.#header
    }

    data(){
        return this.#data
    }

    items(){
        return this.#items
    }

    filter(...fn){
        this.#items = this.#data

        for(let f of fn) {
            this.#items = this.#items.filter(f)
        }

        return this
    }

    sort(){

    }
}