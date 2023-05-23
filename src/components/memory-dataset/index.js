import {isObjectType, merge, panic, required, compare} from "../../routines";

let DatasetDefaultOptions = {
    method: "GET",
    contentType: "application/json",
    headers: {},
    body: null,
    locale: "en-US"
}

export class MemoryDataset {
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
        this.init()
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

    count(){
        return this.#items.length
    }

    init(){
        this.#items = this.#data
        return this
    }

    filter(...fn){
        for(let f of fn) {
            this.#items = this.#items.filter(f)
        }
        return this
    }

    search(query){
        this.#items = this.#items.filter( row => row.join().toLowerCase().includes(query.replace(/[\n\r]+|[\s]{2,}/g, ' ').trim().toLowerCase()))
        return this
    }

    sort(dir){
        this.#items = this.#items.sort((a, b) => {
            const curr = a.join().toLowerCase()
            const next = b.join().toLowerCase()

            return compare(curr, next, dir)
        })
        return this
    }

    #getField(name){
        if (!this.#header) {
            panic(`Dataset->getField() :: Header data required!`)
        }
        let index= 0
        for(let field of this.#header) {
            if (field.name === name) {
                return [field, index]
            }
            index++
        }
        return undefined
    }

    sortBy(fieldName, dir = "asc", type = "default"){
        const field = this.#getField(fieldName)

        if (!field) {
            panic(`Wrong field name [${fieldName}] in header!`)
        }

        const [{name, sortable = true, sortDir, format = type, formatMask}, dataIndex = -1] = field

        if (dataIndex < 0) {
            panic(`Wrong field name [${fieldName}] in dataset!`)
        }

        const transform = (v) => {
            let result

            switch (format) {
                case "number": result = Number(v); break;
                case "integer":
                case "int": result = parseInt(v); break;
                case "float": result = parseFloat(v); break;
                case "date": result = formatMask ? Datetime.from(v, formatMask, this.#options.locale) : datetime(v); break;
                case "money": result = parseFloat(v.replace(/[^0-9-.]/g, '')); break;
                case "card": result = v.replace(/[^0-9]/g, ''); break;
                default: result = v.toLowerCase()
            }

            return result
        }

        this.#items = this.#items.sort((a, b) => {
            const curr = transform(a[dataIndex])
            const next = transform(b[dataIndex])

            return compare(curr, next, sortDir || dir)
        })
        return this
    }

    page(num, offset = 25){
        const pageData = []

        for(let i = (num - 1) * offset; i < num * offset; i++) {
            if (this.#items[i]) pageData.push(this.#items[i])
        }

        return pageData
    }
}