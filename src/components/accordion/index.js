import * as AccordionCss from "./accordion.css"
import {Component} from "../../core/component.js";
import {merge} from "../../routines/merge.js";
import {Registry} from "../../core/registry.js";

const AccordionDefaultOptions = {
    deferred: 0,
    showMarker: true,
    markerPosition: "left",
    singleFrame: true,
    duration: 1000
}

export class Accordion extends Component {
    constructor(elem, options = {}) {
        super(elem, "accordion", merge({}, AccordionDefaultOptions, options));
    }
}

Registry.register("accordion", Accordion)