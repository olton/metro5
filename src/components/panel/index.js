import "./panel.css"
import {Component} from "../../core/component.js";
import {isObjectType, merge, noop, panic, undef} from "../../routines/index.js";
import {Registry} from "../../core/registry.js";
import {MetroStorage} from "../storage/index.js";

let PanelDefaultOptions = {
    id: "",
    caption: "Panel",
    icon: "",
    collapsible: true,
    collapsed: false,
    duration: 100,
    width: "auto",
    height: "auto",
    closeable: false,
    customButtons: null,
    saveState: false,

    onCollapse: noop,
    onExpand: noop,
}

export class Panel extends Component {
    collapsed = false

    constructor(elem, options) {
        if (!undef(globalThis["metroPanelSetup"])) {
            PanelDefaultOptions = merge({}, PanelDefaultOptions, globalThis["metroPanelSetup"])
        }
        super(elem, "panel", merge({}, PanelDefaultOptions, options));
        this.createStruct()
    }

    createStruct(){
        const element = this.element, o = this.options
        const panel = $("<div>").addClass("panel")
        const caption = $("<div>").addClass("panel-title")
        const content = $("<div>").addClass("panel-content")
        const contentInner = $("<div>").addClass("panel-content-inner").appendTo(content)

        if (o.id) {
            panel.id(o.id)
        }

        panel.insertBefore(element)

        // Create caption
        if (o.icon) $("<span>").addClass("icon").html(o.icon).appendTo(caption)
        $("<div>").addClass("caption").html(o.caption).appendTo(caption)

        const customButtons = isObjectType(o.customButtons)
        if (customButtons) {
            const customButtonsContainer = $("<div>").addClass("custom-buttons").appendTo(caption)
            $.each(customButtons, (i, b) => {
                const btn = $("<button>")
                    .prop("type", "button")
                    .addClass("button btn-custom")
                    .addClass(b.className)
                    .html(b.caption)
                    .appendTo(customButtonsContainer)
                btn.on("click", b.onclick.bind(this))
            })
        }

        const serviceButtonsContainer = $("<div>").addClass("service-buttons").appendTo(caption)
        if (o.collapsible) {
            const btn = $("<button>").addClass("button btn-custom dropdown-toggle").html("&#x2195;").appendTo(serviceButtonsContainer)
            btn.on("click", () => {
                this.#collapse(this.collapsed ? content[0].scrollHeight : 0)
            })
        }
        if (o.closeable) {
            const btn = $("<button>").addClass("button btn-custom dropdown-toggle").html("╳").appendTo(serviceButtonsContainer)
            btn.on("click", () => {
                this.destroy()
            })
        }

        // Create content
        element.appendTo(contentInner)

        // Create panel
        panel.append(caption, content)

        this.component = panel

        if (o.saveState) {
            const id = element.id()
            if (!id || id.endsWith('--auto')) {
                panic(`To use saveState please define the ID for the element!`)
            } else {
                const storage = new MetroStorage()
                const collapsed = storage.getItem(`panel:${element.id()}:state`, false)
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
        storage.setItem(`panel:${element.id()}:state`, this.collapsed)
    }

    #collapse(height){
        Animation.animate({
            el: this.component.find('.panel-content')[0],
            draw: {
                height
            },
            dur: this.options.duration,
            onDone: () => {
                this.collapsed = height === 0
                this.component.addClass(this.collapsed ? "panel-collapsed" : "panel-expanded")
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
        this.#collapse(this.component.find('.panel-content')[0].scrollHeight)
    }
}

Registry.register("panel", Panel)