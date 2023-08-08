import "./infobox.css"

import {exec, merge, noop, noop_true, undef} from "../../routines/index.js";
import {Registry} from "../../core/registry.js";

let InfoboxDefaultOptions = {
    top: null,
    title: "",
    message: "",
    overlayColor: "",
    overlayAlpha: .5,
    clsInfobox: "",
    onBeforeOpen: noop_true,
    onOpen: noop,
    onClose: noop,
}

export class Infobox {
    box = null
    overlay = null

    constructor(options) {
        if (!undef(globalThis["metroInfoboxSetup"])) {
            InfoboxDefaultOptions = merge({}, InfoboxDefaultOptions, globalThis["metroInfoboxSetup"])
        }
        this.options = merge({}, InfoboxDefaultOptions, options)
        this.create()
    }

    create(){
        const o = this.options

        if (!exec(o.onBeforeOpen, [])) {
            return undefined
        }

        this.overlay = $(".overlay")
        if (this.overlay.length === 0) {
            this.overlay = $("<div>").addClass("overlay").appendTo("body")
        }

        if (o.overlayColor) {
            const color = new Color(o.overlayColor)
            this.overlay.css({
                background: color.toRGBA(o.overlayAlpha)
            })
        }

        let closer, content

        this.box = $("<div>").addClass("info-box").addClass(o.clsInfobox).appendTo("body")
        this.box.append(
            closer = $("<span>").addClass("info-box__closer"),
            content = $("<div>").addClass("info-box__content")
        )

        content.append(
            $("<div>").addClass("info-box__title").html(o.title),
            $("<div>").addClass("info-box__message").html(o.message),
        )

        closer.on("click", () => {
            closer.off("click")
            this.destroy()
        })

        exec(this.options.onOpen, [this.box[0]], this.box[0])

        this.box.css({
            top: undef(o.top) ? ($(window).height() - this.box.outerHeight()) / 2 : o.top,
            left: ($(window).width() - this.box.outerWidth()) / 2,
        })

        return this.box
    }

    destroy(){
        this.overlay.remove()
        exec(this.options.onClose, [this.box[0]], this.box[0])
        this.box.remove()
        this.box = null
    }

    content({title, message} = {}){
        const _title = this.box.find(".info-box__title")
        const _message = this.box.find(".info-box__message")

        if (title) {_title.html(title)}
        if (message) {_message.html(message)}
    }

    infobox(){
        return this.box
    }
}

globalThis.infobox = options => new Infobox(options)

Registry.register("infobox", Infobox)