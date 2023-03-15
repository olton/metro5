import "./radio.css"
import {Component} from "../../core/component.js";
import {merge, noop, undef} from "../../routines/index.js";
import {Registry} from "../../core/registry.js";

const RADIO_CAPTION_POSITION = {
    LEFT: "left",
    RIGHT: "right"
}

let RadioDefaultOptions = {
    caption: "",
    captionPosition: RADIO_CAPTION_POSITION.RIGHT,
    onChangeState: noop
}

export class Radio extends Component {
    constructor(elem, options) {
        if (!undef(globalThis['metroRadioSetup'])) {
            RadioDefaultOptions = merge({}, RadioDefaultOptions, globalThis['metroRadioSetup'])
        }
        super(elem, "radio", merge({}, RadioDefaultOptions, options));
        this.createStruct()
        this.createEvents()
    }

    createStruct(){
        const element = this.element, o = this.options
        const check = $("<span>").addClass("check");
        const caption = $("<span>").addClass("caption").html(o.caption);

        element.attr("type", "radio");

        const radio = element.wrap(
            $("<label>").addClass("radio").addClass("transition-on")
        )

        if (o.captionPosition === RADIO_CAPTION_POSITION.LEFT) {
            radio.addClass("caption-left");
        }

        check.appendTo(radio);
        caption.appendTo(radio);
    }

    createEvents(){
        const element = this.element, o = this.options

        if (element.attr("readonly") !== undefined || o.readOnly === true) {
            element.on("click", function(e){
                e.preventDefault();
            })
        } else {
            this.fireEvent("ChangeState", {
                state: this.elem.checked
            })
        }
    }
}

Registry.register("radio", Radio)