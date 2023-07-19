import {Component} from "../../core/component.js";
import {merge, noop, panic, undef} from "../../routines/index.js";
import {Registry} from "../../core/registry.js";
import {MetroStorage} from "../storage/index.js";

let CollapseDefaultOptions = {
    toggle: null,
    collapsed: false,
    duration: 100,
    saveState: false,
    onExpand: noop,
    onCollapse: noop,
}

export class Collapse extends Component {
    constructor(elem, options) {
        if (!undef(globalThis["metroCollapseSetup"])) {
            CollapseDefaultOptions = merge({}, CollapseDefaultOptions, globalThis["metroCollapseSetup"])
        }

        super(elem, "collapse", merge({}, CollapseDefaultOptions, options))

        this.createStruct()
        this.createEvents()
    }

    createStruct(){
        const element = this.element, o = this.options
        this.element.css({
            overflow: "hidden"
        })
        this.collapsed = false

        this.toggler = this.options.toggle ?
            $(this.options.toggle)
            : this.element.siblings('.collapse-toggle').length > 0 ?
                this.element.siblings('.collapse-toggle')
                : this.element.siblings('a:nth-child(1)')

        if (o.saveState) {
            const id = element.id()
            if (!id || id.endsWith('--auto')) {
                panic(`To use saveState please define the ID for the element!`)
            } else {
                const storage = new MetroStorage()
                const collapsed = storage.getItem(`collapse:${id}:state`, false)
                if (collapsed) {
                    this.collapse()
                } else {
                    this.expand()
                }
            }
        }

        if (o.collapsed) {
            this.collapse()
        }
    }

    createEvents(){
        this.toggler.on("click", () => {
            this.toggle()
        })
    }

    #saveState(){
        const element = this.element, o = this.options
        const id = element.id()
        if (!o.saveState) {
            return this
        }
        if (!id || id.endsWith('--auto')) {
            panic(`To use saveState please define the ID for the element!`)
        }
        const storage = new MetroStorage()
        storage.setItem(`collapse:${element.id()}:state`, this.collapsed)
    }

    #collapse(height){
        Animation.animate({
            el: this.elem,
            draw: {
                height
            },
            dur: this.options.duration,
            onDone: () => {
                this.collapsed = height === 0
                this.component.addClass(this.collapsed ? "element-collapsed" : "element-expanded")
                this.#saveState()
                this.fireEvent(this.collapsed ? "collapse" : "expand", {
                    component: this.component
                })
            }
        })
    }

    collapse(){
        this.#collapse(0)
    }

    expand(){
        this.#collapse(this.elem.scrollHeight)
    }

    toggle(){
        if (this.collapsed) {
            this.expand()
        } else {
            this.collapse()
        }
    }

    updateAttr(attr, newVal, oldVal) {
        switch (attr) {
            case "data-collapsed": {
                if (newVal === "true") {
                    this.collapse()
                } else {
                    this.expand()
                }
                break;
            }
            case "data-duration": {
                this.options.duration = newVal
                break;
            }
        }
    }

    destroy() {
        this.toggler.off("click")
    }
}

Registry.register("collapse", Collapse)