import {Registry} from "./registry.js";
import {merge} from "../routines/merge.js";
import {globalize} from "./globalize.js";
import {glob} from "glob";

const MetroOptions = {
    removeCloakTimeout: 1000
}

export class MetroUI {
    version = "5.0.0"
    status = "pre-alpha"
    plugins = {}
    options = {}

    constructor(options = {}) {
        this.options = merge({}, MetroOptions, options)

        this.info()
        this.init()
        this.observe()

        if (typeof this.options.onInit === 'function') {
            this.options.onInit.apply(this, [])
        }
    }

    info(){
        console.info(`Metro UI - v${this.version}-${this.status}`);
        console.info(`Includes: Query, Datetime, String, Html, Animation, Color.`);
    }

    init(){
        globalize()

        const plugins = $("[data-role]")

        plugins.each((_, elem)=>{
            const roles = elem
                .getAttribute("data-role")
                .replace(",", " ")
                .split(" ")
                .map(r => r.trim())
                .filter(v => !!v)
            for(let role of roles) {
                this.makePlugin(elem, role, {})
            }
        })

        $(()=>{
            const body = $("body")
            if (body.hasClass('cloak')) {
                body.addClass('remove-cloak')
                setTimeout( () => {
                    body.removeClass('cloak remove-cloak')
                },this.options.removeCloakTimeout)
            }
        })
    }

    observe(){
        const that = this
        const observerConfig = {
            childList: true,
            attributes: true,
            subtree: true
        };
        const observerCallback = function(mutations){
            mutations.map(function(mutation){
                // console.info(mutation)
                const elem = mutation.target
                const $elem = $(elem)

                if (mutation.type === 'attributes') {
                    const attr = mutation.attributeName
                    const newValue = $elem.attr(attr), oldValue = mutation.oldValue

                    if (mutation.attributeName !== "data-role") {
                        const roleName = $elem.attr('data-role')
                        if (roleName) {
                            for(let role of roleName.split(" ")) {
                                if ($elem.hasAttr(`data-role-${name}`) && $elem.attr(`data-role-${name}`) === true) {
                                    that.getPlugin(elem, role).updateAttr(attr, newValue, oldValue)
                                }
                            }
                        }
                    }
                } else if (mutation.type === 'childList'){
                    if (mutation.addedNodes.length) {
                        const nodes = mutation.addedNodes

                        if (nodes.length) {
                            for(let node of nodes) {
                                const $node = $(node)
                                if ($node.hasAttr("data-role")) {
                                    that.makePlugin(node, $node.attr('data-role'))
                                }
                            }
                        }
                    }
                }
            })
        }
        const observer = new MutationObserver(observerCallback);
        observer.observe($("html")[0], observerConfig);
    }

    getPlugin(elem, name){
        return this.plugins[btoa(`${name}::${JSON.stringify(elem)}`)]
    }

    makePlugin(elem, name, options){
        const pluginId = btoa(`${name}::${JSON.stringify(elem)}`)

        if ($(elem).hasAttr(`data-role-${name}`) && $(elem).attr(`data-role-${name}`) === true) {
            return this.plugins[pluginId]
        }

        const _class = Registry.getClass(name)

        if (!_class) {
            throw new Error(`Can't create component ${name}`)
        }

        const plugin = new _class(elem, options)
        this.plugins[pluginId] = plugin
        elem.setAttribute(`data-role-${name}`, true)
        return plugin
    }

    destroyPlugin(elem, name){
        const pluginId = btoa(`${name}::${JSON.stringify(elem)}`)
        const plugin = this.plugins[pluginId]
        if (!plugin) return
        plugin.destroy()
        plugin.component.remove()
        delete this.plugins[pluginId]
    }
}
