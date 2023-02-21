import "./dropdown.css"
import {Component} from "../../core/component.js";
import {merge} from "../../routines/merge.js";
import {Registry} from "../../core/registry.js";
import {panic} from "../../routines/panic.js";

let DropdownDefaultOptions = {
    deferred: 0,
    toggle: "",
    duration: 100,
}

export class Dropdown extends Component {
    toggle = null
    closed = false
    constructor(elem, options) {
        super(elem, "dropdown", merge({}, DropdownDefaultOptions, options));
        setTimeout(()=>{
            this.createStruct()
            this.createEvents()
        }, this.options.deferred)
    }

    createStruct(){
        const element = this.element, o = this.options

        this.element.addClass("dropdown")

        this.toggle = o.toggle ?
            $(o.toggle) :
            element.siblings(".dropdown-toggle").length ?
                element.siblings(".dropdown-toggle") :
                panic(`No toggle defined!`)

        element.css({
            height: 0
        })

        this.closed = true
    }
    createEvents(){
        const that = this

        this.toggle.on("click", function(e){
            if (that.closed) {
                that.open()
            } else {
                that.close()
            }
            e.preventDefault()
            e.stopPropagation()
        })

        this.element.on("click", function(e){
            e.preventDefault()
            e.stopPropagation()
        })

        $(window).on("click", function(e){
            $('[data-role*=dropdown]').each((i, el) => {
                const pl = Metro.getPlugin(el, "dropdown")
                pl.close()
            })
        })
    }

    open(){
        const o = this.options
        const height = this.elem.scrollHeight

        if (!this.closed || this.element.hasClass("keep-closed")) return

        $('[data-role*=dropdown]').each((i, el) => {
            if ($(el).is(this.elem)) return
            const pl = Metro.getPlugin(el, "dropdown")
            pl.close()
        })

        Animation.animate({
            el: this.elem,
            draw: {
                height: [0, height]
            },
            dur: o.duration,
            onDone: () => {}
        })

        this.closed = false
        this.toggle.addClass("dropped-toggle")
    }

    close(){
        const that = this, o = this.options

        if (this.closed || this.element.hasClass("keep-open")) return

        Animation.animate({
            el: this.elem,
            draw: {
                height: [0]
            },
            dur: o.duration,
            onDone: () => {}
        })
        that.closed = true
        this.toggle.removeClass("dropped-toggle")
    }
}

Registry.register("dropdown", Dropdown)