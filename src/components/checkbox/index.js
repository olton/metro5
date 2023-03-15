import "./checkbox.css"
import {Component} from "../../core/component.js";
import {merge, noop, undef} from "../../routines/index.js";
import {Registry} from "../../core/registry.js";

const CHECKBOX_STATES = {
    UNCHECKED: -1,
    INDETERMINATE: 0,
    CHECKED: 1,
}

const CHECKBOX_CAPTION_POSITION = {
    LEFT: 'left',
    RIGHT: 'right',
}

let CheckboxDefaultOptions = {
    states: 2,
    caption: "",
    captionPosition: "right",
    initialState: CHECKBOX_STATES.UNCHECKED,
    readOnly: false,
    onChangeState: noop
}

export class Checkbox extends Component {
    state = -1
    constructor(elem, options) {
        if (!undef(globalThis["metroCheckboxSetup"])) {
            CheckboxDefaultOptions = merge({}, CheckboxDefaultOptions, globalThis["metroCheckboxSetup"])
        }
        super(elem, "checkbox", merge({}, CheckboxDefaultOptions, options));
        this.createStruct()
        this.createEvents()
    }

    createStruct(){
        const element = this.element, elem = this.elem, o = this.options
        const check = $("<span>").addClass("check");
        const caption = $("<span>").addClass("caption").html(o.caption);

        element.attr("type", "checkbox");

        const checkbox = element.wrap(
            $("<label>")
                .addClass("checkbox")
                .addClass("transition-on")
                .addClass(o.captionPosition === CHECKBOX_CAPTION_POSITION.LEFT ? "caption-left" : "caption-right")
        )

        check.appendTo(checkbox);
        caption.appendTo(checkbox);

        this.state = elem.checked ? CHECKBOX_STATES.CHECKED : o.initialState

        this.drawState()
    }

    createEvents(){
        const element = this.element, o = this.options

        if (element.attr("readonly") !== undefined || o.readOnly === true) {
            element.on("click", function(e){
                e.preventDefault();
            })
        } else {
            element.on("click", (e) => {
                if (o.states === 1) {
                    e.preventDefault()
                } else if (o.states === 2) {
                    this.state = this.state === -1 ? 1 : -1
                } else {
                    this.state += 1
                    if (this.state === 2) {
                        this.state = -1
                    }
                }
                this.drawState()
                this.fireEvent("ChangeState", {
                    state: this.state
                })
            })
        }
    }

    drawState(){
        const element = this.element, elem = this.elem, o = this.options
        if (o.states === 1) {
            elem.checked = this.state === 0 || this.state === 1
            if (this.state === 0) {
                elem.indeterminate = true
            }
        } else if (o.states === 2) {
            elem.checked = this.state === 1
        } else {
            if (this.state === -1) {
                elem.indeterminate = false
                elem.checked = false
                element.attr("data-indeterminate", false);
            } else if (this.state === 0) {
                element.attr("data-indeterminate", true);
                elem.indeterminate = true
                elem.checked = true
            } else {
                element.attr("data-indeterminate", false);
                elem.indeterminate = false
                elem.checked = true
            }
        }
    }

    getState(){
        return this.state
    }

    setState(state){
        this.state = state
        this.drawState()
    }
}

Registry.register("checkbox", Checkbox)