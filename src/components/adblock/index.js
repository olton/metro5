import {Component} from "../../core/component.js";
import {merge, shuffleArray} from "../../routines";
import {Registry} from "../../core/registry.js";

let AdblockHunterDefaultOptions = {
    deferred: 0,
    bait: "adblock-bite adsense google-adsense dblclick advert topad top_ads topAds textads sponsoredtextlink_container show_ads right-banner rekl mpu module-ad mid_ad mediaget horizontal_ad headerAd contentAd brand-link bottombanner bottom_ad_block block_ad bannertop banner-right banner-body b-banner b-article-aside__banner b-advert adwrapper adverts advertisment advertisement:not(body) advertise advert_list adtable adsense adpic adlist adleft adinfo adi adholder adframe addiv ad_text ad_space ad_right ad_links ad_body ad_block ad_Right adTitle adText",
    checkLocalhost: true,
    checkCount: 10,
    checkInterval: 1000,
    onBite: f => f,
    onFishingStart: f => f,
    onFishingDone: f => f
}

export class AdblockHunter extends Component {
    constructor(elem, options) {
        if (typeof globalThis["metroAdblockHunterSetup"] !== 'undefined') {
            AdblockHunterDefaultOptions = merge({}, AdblockHunterDefaultOptions, globalThis["metroAdblockHunterSetup"])
        }
        super(elem, "adblock-hunter", merge({}, AdblockHunterDefaultOptions, options));
        this.createBait()
        setTimeout(()=>{
            this.fishing()
        }, this.options.deferred)
    }

    createBait(){
        const o = this.options
        const html = this.element.html().trim()
        const classes = o.bait + (html ? html : "")
        this.element
            .addClass(shuffleArray(classes.split(" ")).join(" "))
            .css({
                position: "fixed",
                height: 1,
                width: 1,
                overflow: "hidden",
                visibility: "visible",
                top: 0,
                left: 0,
                zIndex: -1
            })
            .append($("<a href='https://dblclick.net'>").html('dblclick.net'))
    }

    fishing(){
        const o = this.options
        let checkCount = o.checkCount
        let interval

        this.fireEvent("fishing-start")

        const done = () => {
            clearInterval(interval)
            this.fireEvent("fishing-done")
            this.element.remove()
        }
        const run = () => {
            let a = $(".adsense.google-adsense.dblclick.advert.adblock-bite");
            let b = a.find("a");

            if (!o.checkLocalhost && $.localhost) {
                done()
                return
            }

            if (!a.length || !b.length || a.css("display") === 'none' || b.css("display") === "none") {
                this.fireEvent("bite")
                done()
            } else {
                checkCount--
                if (checkCount === 0) {
                    done()
                }
            }
        }

        interval = setInterval(run, o.checkInterval)
    }
}

Registry.register("adblock-hunter", AdblockHunter)