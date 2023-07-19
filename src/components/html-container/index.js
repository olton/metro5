import {Component} from "../../core/component.js";
import {merge} from "../../routines/merge.js";
import {noop} from "../../routines/noop.js";
import {Registry} from "../../core/registry.js";

let HtmlContainerDefaultOptions = {
    method: "get",
    cors: "",
    cache: "default",
    credentials: "same-origin",
    contentType: 'application/json',
    src: null,
    insertMode: "default", // replace, append, prepend
}

export class HtmlContainer extends Component {
    constructor(elem, options) {
        if (typeof globalThis["metroHtmlContainerSetup"] !== "undefined") {
            HtmlContainerDefaultOptions = merge({}, HtmlContainerDefaultOptions, globalThis["metroHtmlContainerSetup"])
        }
        super(elem, "htmlcontainer", merge({}, HtmlContainerDefaultOptions, options));
        this.createStruct()
    }

    createStruct(){
        const element = this.element, o = this.options

        if (!o.src) return

        this.fetchHtml()
    }

    async fetchHtml(){
        const element = this.element, o = this.options

        const response = await fetch(o.src, {
            method: o.method,
            mode: o.cors,
            cache: o.cache,
            credentials: o.credentials,
            headers: {
                'Content-Type': o.contentType
            }
        })
        const text = await response.text()

        let _data = $(text);

        if (_data.length === 0) {
            _data = $("<div>").html(text);
        }

        switch (o.insertMode) {
            case "prepend": element.prepend(_data.script()); break;
            case "append": element.append(_data.script()); break;
            case "replace": _data.script().insertBefore(element); element.remove(); break;
            default: {
                element.html(_data.script().outerHTML())
            }
        }
    }
}

Registry.register("htmlcontainer", HtmlContainer)