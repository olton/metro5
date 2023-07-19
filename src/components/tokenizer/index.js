import "./tokenizer.css"
import {Component} from "../../core/component.js";
import {merge} from "../../routines/merge.js";
import {noop} from "../../routines/noop.js";
import {Registry} from "../../core/registry.js";

let TokenizerDefaultOptions = {
    splitter: "",
    tag: "span",
    space: "&nbsp;",
    useTokenSymbol: true,
    useTokenIndex: true,
    onToken: noop,
    onTokenize: noop,
}

export class Tokenizer extends Component {
    originalText = null
    constructor(elem, options) {
        if (typeof globalThis["metroTokenizerSetup"] !== "undefined") {
            TokenizerDefaultOptions = merge({}, TokenizerDefaultOptions, globalThis["metroTokenizerSetup"])
        }
        super(elem, "tokenizer", merge({}, TokenizerDefaultOptions, options));
        this.createStruct()
    }

    createStruct(){
        const element = this.element, o = this.options

        this.originalText = element.text()
        element.clear().attr("aria-label", this.originalText)

        $.each(this.originalText.split(o.splitter), (i, t)=>{
            const isSpace = t === " "
            const token = $(`<${o.tag}>`).attr("aria-hidden", true).html(isSpace ? o.space : t)
            const index = i + 1

            token
                .addClass(isSpace && o.useTokenSymbol ? "" : "ts-"+t.replace(" ", "_"))
                .addClass(isSpace && o.useTokenIndex ? "" : "ti-" + (index))

            if (!isSpace) {
                token.addClass(index % 2 === 0 ? "te-even" : "te-odd");
            }

            if (o.prepend) {
                token.prepend($(o.prepend).length ? $(o.prepend) : $("<span>").html(o.prepend))
            }

            if (o.append) {
                token.append($(o.append).length ? $(o.append) : $("<span>").html(o.append));
            }

            element.append(token);

            this.fireEvent("token", {
                token: t,
                elem: token[0]
            })
        })

        this.fireEvent("tokenize", {
            elem: this.elem
        })
    }
}

Registry.register("tokenizer", Tokenizer)