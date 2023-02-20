import {merge} from "../routines/merge.js";
import {Str, str} from "@olton/string"
import {exec} from "../routines/exec.js";
import {panic} from "../routines/panic.js";
import {objectLength} from "../routines/object-length.js";
import {isObject} from "../routines/is-object.js";

export const defaultComponentOptions = {

}

export class Component {
    constructor(elem, name, options) {
        this.options = merge({}, defaultComponentOptions, options)
        this.elem = elem
        this.element = $(elem)
        this.component = this.element
        this.name = name || `component`

        this.setOptionsFromAttributes()
    }

    setOptionsFromAttributes(){
        const element = this.element, o = this.options;
        const data = element.data()

        $.each(data, function(key, value){
            if (key === 'data-role') return
            key = new Str(key.substring(5)).camelCase().value
            if (key in o) {
                try {
                    o[key] = JSON.parse(value);
                } catch (e) {
                    o[key] = value;
                }
            }
        });
    }

    fireEvent(eventName, data){
        const element = this.element, o = this.options;
        const event = str(eventName).camelCase().capitalize().value;

        element.fire(event.toLowerCase(), data);

        return exec(o["on"+event], data, element[0]);
    }

    /**
     *
     * @param {Object} events {eventName: data, ...}
     * @returns {number}
     */
    fireEvents(events){
        if (!events || !isObject(events) || !objectLength(events)) {
            panic(`Events not defined`);
        }

        for (let o in events) {
            this.fireEvent(o, events[o])
        }

        return objectLength(events)
    }

    updateAttr(attr, newVal, oldVal){}
    destroy(){}
}