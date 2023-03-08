import "./hamburger.css"
import {Component} from "../../core/component.js";
import {Registry} from "../../core/registry.js";
import {merge} from "../../routines/merge.js";
import {noop} from "../../routines/noop.js";

let HamburgerDefaultOptions = {
    active: "default", // chevron-up, chevron-down, arrow-left, arrow-right
    onHamburgerClick: noop
}

export class Hamburger extends Component {
    constructor(elem, options) {
        super(elem, "hamburger", merge({}, HamburgerDefaultOptions, options));
        this.createStruct()
        this.createEvents()
    }

    createStruct(){
        const element = this.element, o = this.options

        element.addClass("hamburger")

        if (o.active !== "default") {
            element.addClass(o.active)
        }

        element.html(`
            <span class="line"></span>
            <span class="line"></span>
            <span class="line"></span>
        `)
    }

    createEvents(){
        const element = this.element

        element.on("click", ()=>{
            //this.fireEvent("HamburgerClick")
            element.toggleClass("active")
        })
    }
}

Registry.register("hamburger", Hamburger)