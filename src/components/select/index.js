import "./select.css"
import {Component} from "../../core/component.js";
import {merge, undef} from "../../routines";
import {Registry} from "../../core/registry.js";

let SelectDefaultOptions = {
    id: "",
    label: "",
    clsSelect: "",
    clsLabel: "",
}

export class Select extends Component {
    state = null
    input = null
    search = null
    buttons = null
    dropdownToggle = null
    optionList = null
    placeholder = null

    constructor(elem, options) {
        if (!undef(globalThis["metroSelectSetup"])) {
            SelectDefaultOptions = merge(SelectDefaultOptions, globalThis["metroSelectSetup"])
        }
        super(elem, "select", merge({}, SelectDefaultOptions, options))
        this.createStruct()
        this.createEvents()
    }

    createStruct(){
        const element = this.element, o = this.options

        this.component = element.wrap("<label>").addClass("select").addClass(o.clsSelect)
        if (o.id) this.component.id(o.id)
        if (this.elem.multiple) this.component.addClass("multiple")

        this.placeholder = $("<span>").addClass("placeholder").html(o.placeholder)

        this.component.append(
            this.state = $("<input type='checkbox'>").addClass("select-focus-trigger"),
            this.buttons = $("<div>").addClass("button-group"),
            this.input = $("<div>").addClass("select-input"),
            this.dropdownToggle = $("<span>").addClass("dropdown-toggle"),
            this.optionList = $("<ul>").addClass("option-list")
        )

        if (o.label) {
            const label = $("<label>").addClass("label-for-input").addClass(o.clsLabel).html(o.label).insertBefore(this.component);
            if (element.attr("id")) {
                label.attr("for", element.attr("id"));
            }
            if (element.attr("dir") === "rtl") {
                label.addClass("rtl");
            }
        }
    }

    createEvents(){

    }
}

Registry.register("select", Select)