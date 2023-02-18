import {debug} from "../routines/debug.js";

globalThis.METRO5_COMPONENTS_REGISTRY = {}

export const Registry = {
    register(name, _class){
        if (METRO5_COMPONENTS_REGISTRY[name]) {
            return
        }
        METRO5_COMPONENTS_REGISTRY[name] = _class
    },

    unregister(name, _class){
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

    dump(){
        debug(METRO5_COMPONENTS_REGISTRY)
    }
}