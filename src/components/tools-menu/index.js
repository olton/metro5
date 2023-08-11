import "./tools-menu.css"
import {Component} from "../../core/component.js";
import {exec, merge, noop, undef} from "../../routines/index.js";
import {Registry} from "../../core/registry.js";
import {GlobalEvents} from "../../core/global-events.js";

let ToolsMenuDefaultOptions = {
    duration: 100,
    ease: "linear",
    onClick: noop
}

export class ToolsMenu extends Component {
    animation = false

    constructor(elem, options) {
        if (!undef(globalThis["metroToolsMenuSetup"])) {
            ToolsMenuDefaultOptions = merge(ToolsMenuDefaultOptions, globalThis["metroToolsMenuSetup"])
        }
        super(elem, "tools-menu", merge({}, ToolsMenuDefaultOptions, options))
        this.#createStruct()
        this.#createEvents()
    }

    #createStruct(){
        const element = this.element, o = this.options
        element.find("ul").each((index, ul)=>{
            const el = $(ul)
            if (el.hasClass("horizontal")) {
                el.css({
                    width: 0
                })
            } else {
                el.css({
                    height: 0
                })
            }
        })
    }

    #createEvents(){
        const that = this, element = this.element, o = this.options

        element.on("click", ".dropdown-toggle", function (event) {
            event.preventDefault()
            event.stopPropagation()

            const toggle = $(this)

            if (that.animation) return

            that.animation = true

            const parent = toggle.closest("ul")
            const menu = toggle.siblings("ul")
            const horizontal = menu.hasClass("horizontal")
            let draw, action

            menu.toggleClass("open")

            if (menu.hasClass("open")) {
                action = "open"
                parent.css("overflow", "visible")
                draw = horizontal ? { width: [0, menu[0].scrollWidth] } : { height: [0, menu[0].scrollHeight] }
            } else {
                action = "close"
                menu.css("overflow", "hidden")
                draw = horizontal ? { width: [menu.width(), 0] } : { height: [menu.height(), 0] }
            }

            Animation.animate({
                el: menu[0],
                draw,
                dur: o.duration,
                ease: o.ease,
                onDone: () => {
                    that.animation = false
                    if (action === "close") {
                        parent.find("ul").each((i, l)=>{
                            const _l = $(l)
                            _l.removeClass("open").css("overflow", "hidden").css(_l.hasClass("horizontal") ? "width" : "height", 0)
                        })
                    } else {
                    }
                }
            })
        })

        element.on("click", "a:not(.dropdown-toggle)", function(event) {
            exec(o.onClick, [event], this)
        })
    }
}

Registry.register("tools-menu", ToolsMenu)

GlobalEvents.setEvent(()=>{
    $(window).on("click", function(e){
        $('[data-role-toolsmenu]').each((i, el) => {
            $(el).find("ul").each((i, l)=>{
                const _l = $(l)
                _l.removeClass("open").css("overflow", "hidden").css(_l.hasClass("horizontal") ? "width" : "height", 0)
            })
        })
    })
})