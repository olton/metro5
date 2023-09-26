import "./dropdown.css"
import {Component} from "../../core/component.js";
import {exec, merge, noop, panic} from "../../routines";
import {Registry} from "../../core/registry.js";
import {GlobalEvents} from "../../core/global-events.js";

let DropdownDefaultOptions = {
    toggle: "",
    duration: 100,
    ease: "linear",
    dropFilter: "",
    size: "auto",
    onDropdown: noop,
    onCloseup: noop,
    onClick: e => {
        e.preventDefault()
        e.stopPropagation()
    },
}

export class Dropdown extends Component {
    toggle = null
    closed = false
    constructor(elem, options) {
        super(elem, "dropdown", merge({}, DropdownDefaultOptions, options));
        this.createStruct()
        this.createEvents()
    }

    createStruct(){
        const element = this.element, o = this.options

        this.element.addClass("dropdown")

        this.toggle = o.toggle ?
            $(o.toggle) :
            element.siblings(".dropdown-toggle").length ?
                element.siblings(".dropdown-toggle") :
                panic(`No toggle defined!`)

        if (element.hasClass("horizontal")) {
            element.css({
                width: 0
            })
        } else {
            element.css({
                height: 0
            })
        }

        this.closed = true
    }
    createEvents(){
        this.toggle.on("click", (e) => {
            if (!this.closed) {
                this.close()
            } else {
                this.open()
            }
            e.preventDefault()
            e.stopPropagation()
        })

        this.element.on("click", this.options.onClick)
    }

    open(el){
        if (!el) { el = this.elem }
        const dropdown = $(el).plugin("dropdown")
        if (!dropdown) return;
        if (!dropdown.closed || dropdown.element.hasClass("keep-closed")) return
        const parents = dropdown.element.parents('[data-role*=dropdown]')
        $('[data-role*=dropdown]').each((i, el) => {
            const $el = $(el)
            if ($el.in(parents) || $el.is(dropdown.element)) {
                return
            }
            const pl = Metro5.getPlugin(el, "dropdown")
            pl.close()
        })

        const draw = {
            height: [0, dropdown.options.size === "auto" ? dropdown.elem.scrollHeight : dropdown.options.size]
        }

        exec(dropdown.options.onDropdown, [dropdown.elem])

        Animation.animate({
            el: dropdown.elem,
            draw,
            dur: dropdown.options.duration,
            ease: dropdown.options.ease,
            onDone: () => {
                dropdown.element.parent().addClass("dropped-container")
                dropdown.element.addClass("dropped")
                if (dropdown.options.size === "auto") dropdown.element.css("height", "auto")
                dropdown.toggle.addClass("dropped-toggle")
                dropdown.closed = false
            }
        })
    }

    close(el){
        if (!el) { el = this.elem }
        const dropdown = $(el).plugin("dropdown")
        if (!dropdown) return
        if (dropdown.closed || dropdown.element.hasClass("keep-open")) return

        dropdown.element.css({
            height: dropdown.element.height()
        })
        exec(dropdown.options.onCloseup, [dropdown.elem])

        Animation.animate({
            el: dropdown.elem,
            draw: {
                height: [0]
            },
            dur: dropdown.options.duration,
            ease: dropdown.options.ease,
            onDone: () => {
                dropdown.element.parent().removeClass("dropped-container")
                dropdown.element.removeClass("dropped")
                dropdown.toggle.removeClass("dropped-toggle")
                dropdown.closed = true
            }
        })
    }
}

Registry.register("dropdown", Dropdown)

GlobalEvents.setEvent(()=>{
    $(window).on("click", function(e){
        $('[data-role-dropdown]').each((i, el) => {
            $(el).plugin("dropdown").close()
        })
    })
})