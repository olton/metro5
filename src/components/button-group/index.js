import "./button-group.css"
import {Component} from "../../core/component.js";
import {merge} from "../../routines/merge.js";
import {noop} from "../../routines/noop.js";
import {Registry} from "../../core/registry.js";

let ButtonGroupDefaultOptions = {
    singleButton: true,
    activeClass: "active",
    onButtonClick: noop,
}

export class ButtonGroup extends Component {
    constructor(elem, options) {
        if (typeof globalThis["metroButtonGroupSetup"] !== "undefined") {
            ButtonGroupDefaultOptions = merge({}, ButtonGroupDefaultOptions, globalThis["metroButtonGroupSetup"])
        }
        super(elem, "button-group", merge({}, ButtonGroupDefaultOptions, options));
        this.createStruct()
        this.createEvents()
    }

    createStruct(){
        const element = this.element, o = this.options

        element.addClass("button-group")

        const buttons = element.children()
        const active_buttons = element.children(".active")

        if (buttons.length === 0) return

        if (o.singleButton && active_buttons.length === 0) {
            $(buttons[0]).addClass("js-active").addClass(o.activeClass)
        }

        if (o.singleButton && active_buttons.length > 1) {
            active_buttons.removeClass("js-active").removeClass(o.activeClass)
            $(buttons[0]).addClass("js-active").addClass(o.activeClass)
        }
    }

    createEvents(){
        const that = this, o = this.options, buttons = this.element.children()

        buttons.on("click", function(e) {
            const el = $(this)

            that.fireEvent("buttonClick", {
                button: this,
                active: el.hasClass(o.activeClass)
            })

            if (o.singleButton && el.hasClass("active")) {
                return
            }

            if (o.singleButton) {
                buttons.removeClass(o.activeClass).removeClass("js-active")
                el.addClass(o.activeClass).addClass("js-active")
            } else {
                el.toggleClass(o.activeClass).toggleClass("js-active")
            }
        })
    }
}

Registry.register("buttongroup", ButtonGroup)