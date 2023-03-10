import "./switch.css"
import {Component} from "../../core/component.js";
import {merge, undef} from "../../routines/index.js";
import {Registry} from "../../core/registry.js";

let SwitchDefaultOptions = {
    transition: true,
    caption: "",
    captionPosition: "right",
    textOn: "",
    textOff: "",
    showOnOff: false,
}

export class Switch extends Component {
    constructor(elem, options) {
        if (!undef(globalThis["metroSwitchSetup"])) {
            SwitchDefaultOptions = merge({}, SwitchDefaultOptions, globalThis["metroSwitchSetup"])
        }
        super(elem, "switch", merge({}, SwitchDefaultOptions, options));
        this.createStruct()
        this.createEvents()
    }

    createStruct(){
        const element = this.element, o = this.options;
        const check = $("<span>").addClass("check");
        const caption = $("<span>").addClass("caption").html(o.caption);

        element.attr("type", "checkbox");

        const container = element.wrap(
            $("<label>").addClass(`switch`)
        );

        this.component = container;

        check.appendTo(container);
        caption.appendTo(container);

        if (o.transition === true) {
            container.addClass("transition-on");
        }

        if (o.captionPosition === 'left') {
            container.addClass("caption-left");
        }

        element[0].className = '';
    }

    createEvents(){
        const element = this.element

        if (element.attr("readonly") !== undefined) {
            element.on("click", (e)=>{
                e.preventDefault();
            })
        }
    }

    destroy() {
        this.component.remove()
    }
}

Registry.register("switch", Switch)