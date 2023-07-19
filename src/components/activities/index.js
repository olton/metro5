import "./activities.css"
import {Component} from "../../core/component.js";
import {merge} from "../../routines/merge.js";
import {Registry} from "../../core/registry.js";

const ActivitiesDefaultOptions = {
    type: "simple",
    style: "default"
}

export class Activity extends Component {
    constructor(elem, options = {}) {
        super(elem, "activity", merge({}, ActivitiesDefaultOptions, options));
        this.createStruct()
    }

    createStruct(){
        const element = this.element, o = this.options

        element.addClass("activity-type-"+o.type)

        const metro = () => {
            element.html(`
                <div class="activity-element-circle"></div>
                <div class="activity-element-circle"></div>
                <div class="activity-element-circle"></div>
                <div class="activity-element-circle"></div>
                <div class="activity-element-circle"></div>
            `)
        }
        const square = () => {
            element.html(`
                <div class="activity-element-square"></div>
                <div class="activity-element-square"></div>
                <div class="activity-element-square"></div>
                <div class="activity-element-square"></div>
            `)
        }
        const cycle = () => {
            element.html(`
                <div class="activity-element-circle"></div>
            `)
        }
        const ring = () => {
            element.html(`
                <div class="activity-element-wrap">
                    <div class="activity-element-circle"></div>
                </div>
                <div class="activity-element-wrap">
                    <div class="activity-element-circle"></div>
                </div>
                <div class="activity-element-wrap">
                    <div class="activity-element-circle"></div>
                </div>
                <div class="activity-element-wrap">
                    <div class="activity-element-circle"></div>
                </div>
                <div class="activity-element-wrap">
                    <div class="activity-element-circle"></div>
                </div>
            `)
        }
        const atom = () => {
            element.html(`
                <div class="activity-wrapper">
                    <div class="activity-element-electron"></div>
                    <div class="activity-element-electron"></div>
                    <div class="activity-element-electron"></div>
                </div>
            `)
        }
        const bars = () => {
            element.html(`
                <div class="activity-wrapper">
                    <span class="activity-element-bar"></span>
                    <span class="activity-element-bar"></span>
                    <span class="activity-element-bar"></span>
                    <span class="activity-element-bar"></span>
                    <span class="activity-element-bar"></span>
                    <span class="activity-element-bar"></span>
                </div>
            `)
        }
        const simple = () => {
            element.html(`
                <svg class="circular">
                    <circle class="path" cx="32" cy="32" r="20" fill="none" stroke-width="2" stroke-miterlimit="10"/>
                </svg>
            `)
        }

        switch (o.type) {
            case 'metro': metro(); break;
            case 'square': square(); break;
            case 'cycle': cycle(); break;
            case 'ring': ring(); break;
            case 'atom': atom(); break;
            case 'bars': bars(); break;
            default: simple();
        }

        let style = 'activity-style-'

        if (o.style === 'default') {
            style += $.dark ? 'light' : 'dark'
        } else {
            style += o.style
        }

        element.addClass(style)
    }
}

Registry.register("activity", Activity)