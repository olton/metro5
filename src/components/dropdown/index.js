import "./dropdown.css"
import {Component} from "../../core/component.js";
import {exec, merge, noop, panic} from "../../routines";
import {Registry} from "../../core/registry.js";
import {GlobalEvents} from "../../core/global-events.js";

let DropdownDefaultOptions = {
    toggle: "",
    duration: 100,
    dropFilter: "",
    onDropdown: noop,
    onDropup: noop,
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

        element.css({
            height: 0
        })

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
        const dropdown = Metro5.getPlugin(el, "dropdown")
        if (!dropdown) return;
        let height = dropdown.elem.scrollHeight
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

        let draw

        if (dropdown.element.hasClass('horizontal')) {
            let children_width = 0;
            let children_height = 0;
            $.each(dropdown.element.children('li'), function(i){
                const el = $(this)
                children_width += el.outerWidth(true);
                if (dropdown.element.hasClass("tools-menu")) {
                    children_height = dropdown.element.hasClass("compact") ? 40 : 60
                } else {
                    if (i === 0) children_height = el[0].scrollHeight
                    else {
                        if (children_height > el[0].scrollHeight) {
                            children_height = el[0].scrollHeight
                        }
                    }
                }
            });
            dropdown.element.css('height', children_height);
            draw = {
                width: [0, children_width]
            }
        } else {
            draw = {
                height: [0, height]
            }
        }

        exec(dropdown.options.onDropdown, [dropdown.elem])

        Animation.animate({
            el: dropdown.elem,
            draw,
            dur: dropdown.options.duration,
            onDone: () => {
                dropdown.element.parent().addClass("dropped-container")
                dropdown.element.addClass("dropped")
                dropdown.element.css("height", "auto")
                dropdown.toggle.addClass("dropped-toggle")
                dropdown.closed = false
            }
        })
    }

    close(el){
        if (!el) { el = this.elem }
        const dropdown = Metro5.getPlugin(el, "dropdown")
        if (!dropdown) return
        if (dropdown.closed || dropdown.element.hasClass("keep-open")) return

        dropdown.element.css({
            height: dropdown.element.height()
        })
        exec(dropdown.options.onDropup, [dropdown.elem])

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
GlobalEvents.setEvent(()=>{
    $(window).on("click", function(e){
        $('[data-role-dropdown]').each((i, el) => {
            const pl = Metro5.getPlugin(el, "dropdown")
            if (pl) pl.close()
        })
    })
})