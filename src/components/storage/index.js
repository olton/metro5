import {nvl, undef} from "../../routines/index.js";
import {Registry} from "../../core/registry.js";

export class MetroStorage {
    key = ""
    storage = null
    constructor(props = {}) {
        this.key = !undef(props.key) ? props.key : "Metro5"
        this.storage = !undef(props.storageType) ? window[props.storageType] : window["localStorage"]
    }

    set key(newKey){
        this.key = newKey
    }

    get key(){
        return this.key
    }

    setItem(key, value){
        this.storage.setItem(this.key + ":" + key, JSON.stringify(value));
    }

    getItem(key, defaultValue, reviver) {
        let result, value;

        value = this.storage.getItem(this.key + ":" + key);

        try {
            result = JSON.parse(value, reviver);
        } catch (e) {
            result = null;
        }
        return nvl(result, defaultValue);
    }

    getItemPart(key, sub_key, defaultValue, reviver){
        let i, val = this.getItem(key, defaultValue, reviver);

        sub_key = sub_key.split("->");
        for(i = 0; i < sub_key.length; i++) {
            val = val[sub_key[i]];
        }
        return val;
    }

    delItem(key){
        this.storage.removeItem(this.key + ":" + key)
    }

    size(unit){
        let divider;
        switch (unit.toLowerCase()) {
            case 'm': {
                divider = 1024 * 1024;
                break;
            }
            case 'k': {
                divider = 1024;
                break;
            }
            default: divider = 1;
        }
        return JSON.stringify(this.storage).length / divider;
    }

}

Registry.register("storage", MetroStorage)