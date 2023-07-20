import "./hint.css"
import {Component} from "../../core/component.js";
import {merge, noop} from "../../routines/index.js";
import {Registry} from "../../core/registry.js";

let HintDefaultOptions = {
    deferred: 100,
    hintHide: 5000,
    hintText: "",
    hintPosition: "top",
    hintOffset: 4,
    hintSize: 0,
    onHintShow: noop,
    onHintClose: noop,
}

export class Hint extends Component {
    hint = null
    over = false
    interval = null
    size = null
    hintText = null

    constructor(elem, options) {
        if (typeof globalThis["metroHintSetup"] !== "undefined") {
            HintDefaultOptions = merge({}, HintDefaultOptions, globalThis["metroHintSetup"])
        }

        super(elem, "hint", merge({}, HintDefaultOptions, options));
        this.hintText = this.options.hintText || this.element.attr("title")
        this.createEvents()
    }

    createEvents(){
        const element = this.element, o = this.options

        element.on("touchstart mouseenter", (e) => {
            this.over = true
            this.#createHint()
            if (this.interval) return
            this.interval = setTimeout(() => {
                this.#removeHint()
            }, +o.hintHide)
        })

        element.on("touchend mouseleave", (e) => {
            this.over = false
            this.#removeHint()
        })

        $(window).on("scroll", () => {
            if (this.hint !== null) this.#setPosition(this.hint)
        }, {ns: element.id()})

        element.on("reposition", (event) => {
            if (this.hint !== null) this.#setPosition(this.hint)
        })
    }

    #createHint(){
        const elem = this.elem, element = this.element, o = this.options
        const hint = $("<div>").addClass("hint").html(this.hintText)

        element.attr("title", null)

        if (o.hintSize) {
            hint.css({
                width: o.hintSize
            })
        }

        $(".hint:not(.permanent-hint)").remove()

        if (elem.tagName === 'TD' || elem.tagName === 'TH') {
            const wrapper = $("<div/>").css("display", "inline-block").html(element.html())
            element.html(wrapper)
            this.element = wrapper
        }

        hint.appendTo($("body"))

        this.#setPosition(hint.visible(false))

        this.size = {
            width: hint.outerWidth(),
            height: hint.outerHeight()
        }

        this.fireEvent("hint-show", {
            hint: hint[0]
        })

        this.hint = hint
    }

    #removeHint(){
        const element = this.element, o = this.options

        if (this.hint === null) return

        this.hint.remove()
        this.hint = null
        this.fireEvent("hint-close")

        clearInterval(this.interval)
        this.interval = null
    }

    #setPosition(hint){
        setTimeout(() => {
            const width = this.size.width,
                height = this.size.height,
                o = this.options,
                element = this.element,
                offset = element.offset(),
                scrollLeft = $(window).scrollLeft(),
                scrollTop = $(window).scrollTop()

            if (o.hintPosition === "bottom") {
                hint.addClass('bottom');
                hint.css({
                    top: offset.top - scrollTop + element.outerHeight() + o.hintOffset,
                    left: offset.left + element.outerWidth()/2 - width/2  - scrollLeft
                });
            } else if (o.hintPosition === "right") {
                hint.addClass('right');
                hint.css({
                    top: offset.top + element.outerHeight()/2 - height/2 - scrollTop,
                    left: offset.left + element.outerWidth() - scrollLeft + o.hintOffset
                });
            } else if (o.hintPosition === "left") {
                hint.addClass('left');
                hint.css({
                    top: offset.top + element.outerHeight()/2 - height/2 - scrollTop,
                    left: offset.left - width - scrollLeft - o.hintOffset
                });
            } else {
                hint.addClass('top');
                hint.css({
                    top: offset.top - scrollTop - height - o.hintOffset,
                    left: offset.left - scrollLeft + element.outerWidth()/2 - width/2
                });
            }
            hint.visible(true)
        })
    }

    destroy() {
        const element = this.element

        element.off("touchstart mouseenter")
        element.off("touchend mouseleave")
        $(window).off("scroll", {ns: element.id()})
    }
}

Registry.register("hint", Hint)