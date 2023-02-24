import {Registry} from "./registry.js";
import {merge} from "../routines/merge.js";
import {globalize} from "./globalize.js";
import {md5} from "../routines/md5.js";
import {uniqueId} from "../routines/unique-id"
import {clearName} from "../routines/clear-name.js";
import {media, media_mode, medias} from "../routines/media.js";
import {to_array} from "../routines/to-array.js";
import {exec} from "../routines/exec.js";
import {registerLocales} from "./locales.js";
import {upgradeDatetime} from "./upgrade.js";

const MetroOptions = {
    removeCloakTimeout: 100
}

export class Metro5 {
    version = "5.0.0"
    status = "pre-alpha"
    plugins = {}
    options = {}
    locales = {}

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
        registerLocales(this.locales)
        upgradeDatetime(this.locales)

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
                                    that.getPlugin(elem, role).updateAttr(attr, newValue, oldValue)
                                }
                            }
                        }
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
                                        that.makePlugin(node, r)
                                    })
                                } else {
                                    $.each($node.find("[data-role"), (i, el) => {
                                        const roles = to_array($(el).attr("data-role"), ",")
                                        $.each(roles, (i, r) => {
                                            that.makePlugin(el, r)
                                        })
                                    })
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
        const pluginId = md5(`${clearName(name)}::${$(elem).id()}`)
        return this.plugins[pluginId]
    }

    makePlugin(elem, name, options){
        let elemId = $(elem).id()
        name = clearName(name)
        if (!elemId) {
            elemId = `${name}${uniqueId(16)}`
            $(elem).id(elemId)
        }
        const pluginId = md5(`${name}::${$(elem).id()}`)
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
        const pluginId = md5(`${clearName(name)}::${$(elem).id()}`)
        const plugin = this.plugins[pluginId]
        if (!plugin) return
        plugin.destroy()
        plugin.component.remove()
        delete this.plugins[pluginId]
    }

    registerPlugin(name, _class){
        return Registry.register(name, _class)
    }

    unregisterPlugin(name, _class){
        return Registry.unregister(name, _class)
    }

    getRegistry(){
        return Registry.getRegistry()
    }

    dumpRegistry(){
        return Registry.dump()
    }

    getLocale(locale, part){
        if (!this.locales[locale]) locale = 'en-US'
        const loc = this.locales[locale]
        return part ? loc[part] : loc
    }

    static playSound (src, volume = 0.5, cb){
        const audio = new Audio(src)
        audio.volume = volume

        audio.addEventListener('loadeddata', function(){
            audio.pause();
            audio.currentTime = 0;
            audio.play();
        });

        audio.addEventListener('ended', function(){
            exec(cb, [src, audio])
        });
    }
}
