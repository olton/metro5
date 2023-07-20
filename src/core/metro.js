import {Registry} from "./registry.js";
import {merge, md5, uniqueId, clearName, to_array, media, media_mode, medias} from "../routines";
import {globalize} from "./globalize.js";
import {registerLocales} from "./locales.js";
import {upgradeDatetime} from "./upgrade.js";
import {GlobalEvents} from "./global-events.js";
import {HotkeyManager} from "./hotkey-manager.js";

const MetroOptions = {
    removeCloakTimeout: 100,
    replaceHint: true,
}

export class Metro5 {
    version = "0.59.3"
    status = "pre-alpha"
    options = {}
    hotkeyManager = new HotkeyManager()
    static locales = {}
    static plugins = {};

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
        console.info(`Metro 5 - v${this.version}-${this.status}`);
        console.info(`Includes: Query, Datetime, String, Html, Animation, Color.`);
    }

    init(){
        globalize()
        registerLocales(Metro5.locales)
        upgradeDatetime(Metro5.locales)

        const plugins = $("[data-role]")
        const hotkeys = $("[data-hotkey]")

        plugins.each((_, elem)=>{
            const roles = to_array($(elem).attr("data-role"))
            for(let role of roles) {
                Metro5.makePlugin(elem, role, {})
            }
        })

        hotkeys.each((_, elem) => {
            this.hotkeyManager.register(
                elem,
                $(elem).attr("data-hotkey"),
                $(elem).attr("data-hotkey-repeat") || false
            )
        })

        if (this.options.replaceHint) {
            const needHint = $("[title], [data-hint-text]")
            needHint.each((_, el) => {
                Metro5.makePlugin(el, "hint")
            })
        }

        $(()=>{
            const body = $("body")
            if (body.hasClass('cloak')) {
                body.addClass('remove-cloak')
                setTimeout( () => {
                    body.removeClass('cloak remove-cloak')
                },this.options.removeCloakTimeout)
            }
        })

        $.each(GlobalEvents.getGlobalEvents(), (_, fn) => {
            if (typeof fn !== "function") {return}
            fn.apply(null, [])
        })

        $(window).on("resize", function(){
            globalThis.METRO_MEDIA = [];
            $.each(medias, function(key, query){
                if (media(query)) {
                    globalThis.METRO_MEDIA.push(media_mode[key]);
                }
            });
        });
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
                                    Metro5.getPlugin(elem, role).updateAttr(attr, newValue, oldValue)
                                }
                            }
                        }
                    }

                    if (mutation.attributeName === "data-hotkey") {
                        that.hotkeyManager.register(
                            elem,
                            newValue,
                            $elem.attr("data-hotkey-repeat") || false)
                    }
                } else if (mutation.type === 'childList'){
                    if (mutation.addedNodes.length) {
                        const nodes = mutation.addedNodes

                        if (nodes.length) {
                            for (let node of nodes) {
                                const $node = $(node)
                                if ($node.attr("data-role")) {
                                    const roles = to_array($node.attr("data-role"), ",")
                                    $.each(roles, (i, r) => {
                                        Metro5.makePlugin(node, r)
                                    })
                                }
                                $.each($node.find("[data-role"), (i, el) => {
                                    const roles = to_array($(el).attr("data-role"), ",")
                                    $.each(roles, (i, r) => {
                                        Metro5.makePlugin(el, r)
                                    })
                                })

                                if ($node.attr("data-hotkey")) {
                                    that.hotkeyManager.register(node, $node.attr("data-hotkey"), $node.attr("data-hotkey-repeat") || false)
                                }
                                $.each($node.find("[data-hotkey]"), (i, el) => {
                                    that.hotkeyManager.register(el, $(el).attr("data-hotkey"), $(el).attr("data-hotkey-repeat") || false)
                                })
                            }
                        }
                    }
                }
            })
        }
        const observer = new MutationObserver(observerCallback);
        observer.observe($("html")[0], observerConfig);
    }

    static getPlugin(elem, name){
        const pluginId = md5(`${clearName(name)}::${$(elem).id()}`)
        return Metro5.plugins[pluginId]
    }

    static makePlugin(elem, name, options){
        let elemId = $(elem).id()
        name = clearName(name)
        if (!elemId) {
            elemId = `${name}${uniqueId(16)}--auto`
            $(elem).id(elemId)
        }
        const pluginId = md5(`${name}::${$(elem).id()}`)
        if ($(elem).hasAttr(`data-role-${name}`) && $(elem).attr(`data-role-${name}`) === true) {
            return Metro5.plugins[pluginId]
        }
        const _class = Registry.getClass(name)
        if (!_class) {
            throw new Error(`Can't create component ${name}. Component Class does not exist!`)
        }
        const plugin = new _class(elem, options)
        Metro5.plugins[pluginId] = plugin
        elem.setAttribute(`data-role-${name}`, true)
        return plugin
    }

    static destroyPlugin(elem, name){
        const pluginId = md5(`${clearName(name)}::${$(elem).id()}`)
        const plugin = this.plugins[pluginId]
        if (!plugin) return
        plugin.destroy()
        plugin.component.remove()
        delete Metro5.plugins[pluginId]
    }

    static registerPlugin(name, _class){
        return Registry.register(name, _class)
    }

    static unregisterPlugin(name, _class){
        return Registry.unregister(name, _class)
    }

    static getRegistry(){
        return Registry.getRegistry()
    }

    static dumpRegistry(){
        Registry.dump()
    }

    static getLocale(locale, part){
        if (!Metro5.locales[locale]) locale = 'en-US'
        const loc = Metro5.locales[locale]
        return part ? loc[part] : loc
    }
}

globalThis.Metro5 = Metro5