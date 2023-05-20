import {debug} from "../routines/debug.js";
import {panic} from "../routines/index.js";

globalThis.METRO5_COMPONENTS_REGISTRY = {}

export const Registry = {
    register(name, _class){
        name = name.replaceAll("-", "")
        if (METRO5_COMPONENTS_REGISTRY[name]) {
            return
        }
        METRO5_COMPONENTS_REGISTRY[name] = _class
    },

    unregister(name, _class){
        name = name.replaceAll("-", "")
        if (!METRO5_COMPONENTS_REGISTRY[name] || METRO5_COMPONENTS_REGISTRY[name] !== _class) {
            return
        }
        delete METRO5_COMPONENTS_REGISTRY[name]
    },

    getClass(name){
        return METRO5_COMPONENTS_REGISTRY[name]
    },

    getRegistry(){
        return METRO5_COMPONENTS_REGISTRY
    },

    components(){
        return Object.keys(METRO5_COMPONENTS_REGISTRY)
    },

    dump(){
        debug(Registry.components())
    },

    required(...names){
        const keys = Registry.components()
        for (let name of names) {
            if (!keys.includes(name)) {
                panic(`Component ${name} required!`)
            }
        }
    }
}