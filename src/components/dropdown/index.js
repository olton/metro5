import "./dropdown.css"
import {Component} from "../../core/component.js";
import {merge} from "../../routines/merge.js";
import {Registry} from "../../core/registry.js";
import {panic} from "../../routines/panic.js";

let DropdownDefaultOptions = {
    toggle: "",
    duration: 100,
    dropFilter: ""
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

        element.css({
            height: 0
        })

        this.closed = true
    }
    createEvents(){
        const that = this, element = this.element, o = this.options

        this.toggle.on("click", (e) => {
            if (!this.closed) {
                this.close()
            } else {
                this.open()
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

    open(el){
        if (!el) { el = this.elem }
        const dropdown = Metro.getPlugin(el, "dropdown")
        if (!dropdown) return;
        let height = dropdown.elem.scrollHeight
        if (!dropdown.closed || dropdown.element.hasClass("keep-closed")) return
        const parents = dropdown.element.parents('[data-role*=dropdown]')
        $('[data-role*=dropdown]').each((i, el) => {
            const $el = $(el)
            if ($el.in(parents) || $el.is(dropdown.element)) {
                console.log("stay")
                return
            }
            const pl = Metro.getPlugin(el, "dropdown")
            pl.close()
        })

        if (dropdown.element.hasClass('horizontal')) {
            let children_width = 0;
            let children_height = 0;
            $.each(dropdown.element.children('li'), function(i){
                const el = $(this)
                children_width += el.outerWidth(true);
                if (i===0) children_height = el[0].scrollHeight
                else {
                    if (children_height > el[0].scrollHeight) {
                        children_height = el[0].scrollHeight
                    }
                }
            });
            height = children_height
            dropdown.element.css('width', children_width);
        }

        Animation.animate({
            el: dropdown.elem,
            draw: {
                height: [0, height]
            },
            dur: dropdown.options.duration,
            onDone: () => {
                dropdown.element.parent().addClass("dropped-container")
                dropdown.element.addClass("dropped")
                dropdown.toggle.addClass("dropped-toggle")
                dropdown.closed = false
            }
        })
    }

    close(el){
        if (!el) { el = this.elem }
        const dropdown = Metro.getPlugin(el, "dropdown")
        if (!dropdown) return
        if (dropdown.closed || dropdown.element.hasClass("keep-open")) return
        Animation.animate({
            el: dropdown.elem,
            draw: {
                height: [0]
            },
            dur: dropdown.options.duration,
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