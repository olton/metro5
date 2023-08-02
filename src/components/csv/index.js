import {merge} from "../../routines/index.js";
import {Registry} from "../../core/registry.js";

let CsvDefaultOptions = {
    delimiter: "\t",
    newLine: "\r\n",
    header: true
}

export class Csv {
    #options = {}
    #data = []
    #content = null

    constructor(options) {
        this.#options = merge({}, CsvDefaultOptions, options)
    }

    set(data){
        if (data) {
            this.#data = data
        }
        return this
    }

    array2csv(data){
        if (data) {
            this.#data = data
        }
        this.#content = "data:text/csv;charset=utf-8,"
            + this.#data.map(e => e.join(this.#options.delimiter)).join(this.#options.newLine)
        return this
    }

    json2csv(data){
        if (data) {
            this.#data = data
        }
        const temp = []
        if (this.#options.header) temp.push(Object.keys(this.#data[0]))
        this.#data.forEach(item => temp.push(Object.values(item)))
        this.#data = temp
        this.array2csv()
        return this
    }

    download(filename = 'file.csv', content = null){
        const encodedUri = encodeURI(content || this.#content)
        const link = document.createElement("a")
        link.setAttribute("href", encodedUri)
        link.setAttribute("download", filename)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    content(){
        return this.#content
    }
}

Registry.register("csv", Csv)