import "./panel.css"
import {Component} from "../../core/component.js";
import {exec, isObjectType, merge, noop} from "../../routines/index.js";
import {Registry} from "../../core/registry.js";

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

    onCollapse: noop,
    onExpand: noop,
}

export class Panel extends Component {
    constructor(elem, options) {
        super(elem, "panel", merge({}, PanelDefaultOptions, options));
        this.collapsed = false
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

        if (o.collapsed) {
            this.collapse()
        }
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