import "./select.css"
import {Component} from "../../core/component.js";
import {merge, undef} from "../../routines";
import {Registry} from "../../core/registry.js";

let SelectDefaultOptions = {
    id: "",
    label: "",
    showGroupName: true,
    dropHeight: "auto",
    clsSelect: "",
    clsLabel: "",
    clsOptionGroup: "",
    clsOption: "",
    clsGroupName: "",
}

export class Select extends Component {
    state = null
    input = null
    search = null
    buttons = null
    dropdownToggle = null
    optionList = null
    placeholder = null
    dropback = null

    constructor(elem, options) {
        if (!undef(globalThis["metroSelectSetup"])) {
            SelectDefaultOptions = merge(SelectDefaultOptions, globalThis["metroSelectSetup"])
        }
        super(elem, "select", merge({}, SelectDefaultOptions, options))
        this.createStruct()
        this.createEvents()
    }

    #addGroup(grp){
        const o = this.options

        $("<li>").html(grp.label).addClass("group-title").addClass(o.clsOptionGroup).appendTo(this.optionList);

        $(grp).children().each( (index, el) => {
            this.#addOption(el, grp.label);
        })
    }

    #addOption(opt, grp){
        const element = this.element, elem = this.elem, o = this.options
        const option = $(opt)

        const {text, value} = opt
        const template = option.attr("data-template")
        const listItem = $("<li>").addClass(o.clsOption).data("option", opt).attr("data-text", text).attr('data-value', value ? value : "");
        let   html = template ? template.replace("$1", text) : text
        const anchor = $("<a>").html(html);
        const displayValue = option.attr("data-display")

        if (displayValue) {
            listItem.attr("data-display", displayValue)
            html = displayValue
        }

        listItem.addClass(opt.className)
        listItem.attr("data-group", grp)

        if (option.is(":disabled")) {
            listItem.addClass("disabled")
        }

        if (option.is(":selected")) {
            if (o.showGroupName && grp) {
                html += `&nbsp;<span class='selected-item__group-name ${o.clsGroupName}'>${grp}</span>`
            }
            if (elem.multiple) {
                listItem.addClass("selected-option")
                this.input.append(this.#addTag(html, listItem))
            } else {
                listItem.addClass("active-option")
                element.val(value)
                this.input.html(html)
                this.fireEvent("change", {
                    value
                })
            }
        }

        listItem.append(anchor).appendTo(this.optionList)
    }

    #addTag(){

    }

    #createOptions(){
        const element = this.element, o = this.options
        this.optionList.clear()
        element.children().each((index, el) => {
            if (el.tagName === "OPTION") {
                this.#addOption(el);
            } else if (this.tagName === "OPTGROUP") {
                this.#addGroup(el);
            }
        })
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
            this.dropback = $("<div>").addClass("drop-container"),
        )

        this.dropback.append(
            this.optionList = $("<ul>").addClass("option-list")
        )

        Metro5.makePlugin(this.dropback[0], "dropdown", {
            height: o.dropHeight,
            toggle: this.input,
            onDropdown: () => {
            }
        })

        this.#createOptions()

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