import "./cookies.css"
import {to_array} from "../../routines/to-array.js";
import {merge} from "../../routines/merge.js";
import {Component} from "../../core/component.js";
import {noop} from "../../routines/noop.js";
import {Registry} from "../../core/registry.js";

let CookieDefaultOptions = {
    path: "/",
    expires: null,
    maxAge: null,
    domain: null,
    secure: false,
    samesite: null
}

if (typeof globalThis['metroCookiesSetup'] !== "undefined") {
    CookieDefaultOptions = merge({}, CookieDefaultOptions, globalThis['metroCookiesSetup'])
}

export const Cookies = {
    getCookies: function(){
        const a = to_array(document.cookie, ";");
        const o = {};
        $.each(a, function(){
            const [key, value] = this.split('=');
            o[key] = value;
        });
        return o;
    },

    getCookie: function(name){
        const cookieName = encodeURIComponent(name) + "=";
        const cookies = to_array(document.cookie, ";");

        for(let cookie of cookies) {
            while (cookie.charAt(0) === ' ') {
                cookie = cookie.substring(1, cookie.length);
            }
            if (cookie.indexOf(cookieName) === 0) {
                return decodeURIComponent(cookie.substring(cookieName.length, cookie.length));
            }
        }

        return null;
    },

    setCookie: function(name, value, options){
        const cookieName = encodeURIComponent(name);
        const cookieValue = encodeURIComponent(value);
        let date, opt, a = [];

        if (options && !isNaN(options)) {
            date = new Date();
            date.setTime(date.getTime()+(parseInt(options)));
            opt = merge({}, CookieDefaultOptions, {
                expires: date.toUTCString()
            });
        } else {
            opt = merge({}, CookieDefaultOptions, options);
        }

        $.each(opt, (key, val) => {
            if (key !== 'secure' && val) {
                a.push(string(key).dashedName().value + "=" + val);
            }
            if (key === 'secure' && val === true) {
                a.push( "secure" );
            }
        });

        document.cookie = cookieName + '=' + cookieValue + "; " +  a.join("; ");
    },

    delCookie: function(name){
        this.setCookie(name, false, {
            maxAge: -1
        });
    }
}

globalThis.cookies = Cookies

let CookieDisclaimerDefaultOptions = {
    name: 'cookies_accepted',
    acceptButton: '.cookie-accept-button',
    cancelButton: '.cookie-cancel-button',
    duration: "30days",
    acceptButtonName: "Accept",
    cancelButtonName: "Cancel",
    onAccept: noop,
    onDecline: noop
}

export class CookieDisclaimer extends Component {
    disclaimer = null
    constructor(elem, options) {
        if (typeof globalThis['metroCookieDisclaimerSetup'] !== "undefined") {
            CookieDisclaimerDefaultOptions = merge({}, CookieDisclaimerDefaultOptions, globalThis['metroCookieDisclaimerSetup'])
        }
        super(elem, "cookiedisclaimer", merge({}, CookieDisclaimerDefaultOptions, options));

        this.createStruct()
        this.createEvents()
    }

    createStruct(){
        const element = this.element, o = this.options

        element.addClass("cookie-disclaimer-block").hide()

        if (Cookies.getCookie(o.name)) {
            return ;
        }

        let buttons = element.find(`${o.acceptButton}, ${o.cancelButton}`)
        if (!buttons.length) {
            const buttons_block = $("<div>")
                .addClass("cookie-disclaimer-actions")
                .append( $('<button>').addClass('button cookie-accept-button').html(o.acceptButtonName) )
                .append( $('<button>').addClass('button cookie-cancel-button ml-1').html(o.cancelButtonName) );
            buttons_block.appendTo(element)
        }

        element.show()
    }

    createEvents(){
        const element = this.element, o = this.options

        element.on("click", o.acceptButton, () => {
            element.hide()

            let dur = 0;
            const durations = to_array(""+o.duration, " ");

            $.each(durations, (_, el) => {
                let d = ""+el;
                if (d.includes("d")) {
                    dur += parseInt(d)*24*60*60*1000;
                } else
                if (d.includes("h")) {
                    dur += parseInt(d)*60*60*1000;
                } else
                if (d.includes("m")) {
                    dur += parseInt(d)*60*1000;
                } else
                if (d.includes("s")) {
                    dur += parseInt(d)*1000;
                } else {
                    dur += parseInt(d);
                }
            })

            Cookies.setCookie(o.name, true, dur);

            this.fireEvent("accept")
        })

        element.on("click", o.cancelButton, () => {
            element.hide()
            this.fireEvent("decline")
        })
    }
}

Registry.register("cookiedisclaimer", CookieDisclaimer)