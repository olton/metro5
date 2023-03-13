import "./countdown.css"
import {Component} from "../../core/component.js";
import {merge, undef} from "../../routines/index.js";
import {Registry} from "../../core/registry.js";

let CountdownDefaultOptions = {
    locale: "en-US",
    date: null,
    inputFormat: "",
    days: null,
    hours: null,
    minutes: null,
    seconds: null,
    start: true,
    duration: 600,
    animate: "none"
}

export class Countdown extends Component {
    breakpoint = null
    leftTime = null
    current = null
    blinkInterval = null
    tickInterval = null
    current = {
        d: 0, h: 0, m: 0, s: 0
    }

    constructor(elem, options) {
        if (!undef(globalThis["metroCountdownSetup"])) {
            CountdownDefaultOptions = merge({}, CountdownDefaultOptions, globalThis["metroCountdownSetup"])
        }
        super(elem, "countdown", merge({}, CountdownDefaultOptions, options));
        setTimeout(()=>{
            this.createStruct()
            this.createEvents()
        })
    }

    createStruct(){
        const that = this, element = this.element, o = this.options;
        const parts = ["days", "hours", "minutes", "seconds"];
        const dm = 24*60*60*1000;
        const now = datetime().time();
        const locale = Metro.getLocale(o.locale, "calendar")
        let delta_days, digit;

        this.setBreakpoint()

        element.addClass("countdown")

        delta_days = Math.round((that.breakpoint - now) / dm);

        $.each(parts, function(){
            const part = $("<div>").addClass("part " + this).attr("data-label", locale["time"][this]).appendTo(element);

            $("<div>").addClass("digit").appendTo(part);
            $("<div>").addClass("digit").appendTo(part);

            if (this === "days" && delta_days >= 100) {
                for(let i = 0; i < String(Math.round(delta_days/100)).length; i++) {
                    $("<div>").addClass("digit").appendTo(part);
                }
            }
        });

        digit = element.find(".digit");
        digit.append($("<span class='digit-placeholder'>").html("0"));
        digit.append($("<span class='digit-value'>").html("0"));

        if (o.start === true) {
            this.start();
        } else {
            this.tick();
        }
    }

    createEvents(){
        $(document).on("visibilitychange", () => {
            if (document.hidden) {
                this.pause();
            } else {
                this.resume();
            }
        }, {ns: this.element.id});
    }

    setBreakpoint(){
        const o = this.options;
        const dm = 86400000, hm = 3600000, mm = 60000, sm = 1000;

        this.breakpoint = datetime().time();

        if (o.date) {
            this.breakpoint = (o.inputFormat ? Datetime.from(o.date, o.inputFormat) : datetime(o.date)).time();
        }

        if (parseInt(o.days) > 0) {
            this.breakpoint += parseInt(o.days) * dm;
        }
        if (parseInt(o.hours) > 0) {
            this.breakpoint += parseInt(o.hours) * hm;
        }
        if (parseInt(o.minutes) > 0) {
            this.breakpoint += parseInt(o.minutes) * mm;
        }
        if (parseInt(o.seconds) > 0) {
            this.breakpoint += parseInt(o.seconds) * sm;
        }
    }

    start(){
        const element = this.element;

        if (element.data("paused") === false) {
            return;
        }

        clearInterval(this.blinkInterval);
        clearInterval(this.tickInterval);

        element.data("paused", false);

        this.setBreakpoint();
        this.tick();

        this.blinkInterval = setInterval(()=>{this.blink();}, 500);
        this.tickInterval = setInterval(()=>{this.tick();}, 1000);
    }
    stop(){
        const element = this.element;
        clearInterval(this.blinkInterval);
        clearInterval(this.tickInterval);
        element.data("paused", true);
        element.find(".digit").html("0");
        this.current = {
            d: 0, h:0, m: 0, s:0
        };
    }
    pause(){
        clearInterval(this.blinkInterval);
        clearInterval(this.tickInterval);
        this.element.data("paused", true);
    }
    resume(){
        this.element.data("paused", false);
        this.blinkInterval = setInterval(()=>{this.blink();}, 500);
        this.tickInterval = setInterval(()=>{this.tick();}, 1000);
    }
    reset(){
        const element = this.element;

        clearInterval(this.blinkInterval);
        clearInterval(this.tickInterval);

        const digit = element.find(".digit").clear();

        digit.append($("<span class='digit-placeholder'>").html("0"));
        digit.append($("<span class='digit-value'>").html("0"));

        this.setBreakpoint();

        element.data("paused", false);

        this.tick();

        this.blinkInterval = setInterval(()=>{this.blink();}, 500);
        this.tickInterval = setInterval(()=>{this.tick();}, 1000);
    }
    resetWith(val){
        const element = this.element, o = this.options;

        if (typeof val === "string") {
            element.attr("data-date", val)
            o.date = val
        } else if (typeof val === 'object') {
            const keys = ["days", "hours", "minutes", "seconds"]
            $.each(keys, function(i, v){
                if (!undef(val[v])) {
                    element.attr("data-"+v, val[v])
                    o[v] = val[v]
                }
            })
        }

        this.reset()
    }
    tick(){
        const element = this.element, o = this.options;
        const dm = 24*60*60, hm = 60*60, mm = 60, sm = 1;
        const now = datetime().time();
        let left, d, h, m, s;
        const days = element.find(".days"),
              hours = element.find(".hours"),
              minutes = element.find(".minutes"),
              seconds = element.find(".seconds");

        left = Math.floor((this.breakpoint - now)/1000);

        if (left <= -1) {
            this.stop();
            this.fireEvent("alarm", {
                time: now
            });
            return ;
        }

        d = Math.floor(left / dm);

        left -= d * dm;
        if (this.current.d !== d) {
            this.current.d = d;
            this.draw("days", d);
        }

        if (d === 0) {
            if (this.zeroDaysFired === false) {
                this.zeroDaysFired = true;
                this.fireEvent("zero", {
                    part: "days",
                    value: days
                });
            }
        }

        h = Math.floor(left / hm);
        left -= h*hm;
        if (this.current.h !== h) {
            this.current.h = h;
            this.draw("hours", h);
        }

        if (d === 0 && h === 0) {
            if (this.zeroHoursFired === false) {
                this.zeroHoursFired = true;
                this.fireEvent("zero", {
                    part: "hours",
                    value: hours
                });
            }
        }

        m = Math.floor(left / mm);
        left -= m*mm;
        if (this.current.m !== m) {
            this.current.m = m;
            this.draw("minutes", m);
        }

        if (d === 0 && h === 0 && m === 0) {
            if (this.zeroMinutesFired === false) {
                this.zeroMinutesFired = true;
                this.fireEvent("zero", {
                    part: "minutes",
                    value: minutes
                });
            }
        }

        s = Math.floor(left / sm);
        if (this.current.s !== s) {
            this.current.s = s;
            this.draw("seconds", s);
        }

        if (d === 0 && h === 0 && m === 0 && s === 0) {
            if (this.zeroSecondsFired === false) {
                this.zeroSecondsFired = true;
                this.fireEvent("zero", {
                    part: "seconds",
                    value: seconds
                });
            }
        }

        this.fireEvent("tick", {
            days: d,
            hours: h,
            minutes: m,
            seconds: s
        });
    }
    blink(){
        this.element.toggleClass("blink")
        this.fireEvent("blink", {
            time: this.current,
            left: this.leftTime
        })
    }

    draw(part, value){
        const element = this.element, o = this.options;
        let digits, digits_length, digit_value, digit_current, digit;
        let len, duration = this.options.duration;

        const slideDigit = (digit, value) => {
            let digit_copy, height = digit.height();

            digit.siblings(".-old-digit").remove();
            digit_copy = digit.clone().appendTo(digit.parent());

            digit
                .addClass("-old-digit")

            Animation.animate({
                el: digit[0],
                draw: {
                    top: [0, height],
                    opacity: 0
                },
                dur: duration,
                ease: o.ease,
                onDone: function(){
                    $(this).remove();
                }
            });

            digit_copy
                .html(value)

            Animation.animate({
                el: digit_copy[0],
                draw: {
                    top: [-height, 0],
                    opacity: 1
                },
                dur: duration,
                ease: o.ease
            });
        };

        const fadeDigit = (digit, value) => {
            let digit_copy;
            digit.siblings(".-old-digit").remove();
            digit_copy = digit.clone().appendTo(digit.parent());
            digit_copy.css({
                opacity: 0
            });

            digit
                .addClass("-old-digit")

            Animation.animate({
                el: digit[0],
                draw: {
                    opacity: 0
                },
                dur: duration / 2,
                ease: o.ease,
                onDone: function(){
                    $(this).remove();
                }
            });

            digit_copy
                .html(value)

            Animation.animate({
                el: digit_copy[0],
                draw: {
                    opacity: 1
                },
                dur: duration / 2,
                ease: o.ease
            });
        };

        value = ""+value;

        if (value.length === 1) {
            value = '0'+value;
        }

        len = value.length;

        digits = element.find("."+part+" .digit:not(.-old-digit)");
        digits_length = digits.length;

        for(let i = 0; i < len; i++){
            digit = digits.eq(digits_length - 1).find(".digit-value");
            digit_value = Math.floor( parseInt(value) / Math.pow(10, i) ) % 10;
            digit_current = parseInt(digit.text());

            digits_length--;

            if (digit_current === digit_value) {
                continue;
            }

            switch ((""+o.animate).toLowerCase()) {
                case "slide": slideDigit(digit, digit_value); break;
                case "fade": fadeDigit(digit, digit_value); break;
                default: digit.html(digit_value);
            }
        }
    }

    getBreakpoint(){
        return new Date(this.breakpoint)
    }
    getLeft(){
        const dm = 24*60*60*1000, hm = 60*60*1000, mm = 60*1000, sm = 1000;
        const now = (new Date()).getTime();
        const left_seconds = Math.floor(this.breakpoint - now);
        return {
            days: Math.round(left_seconds / dm),
            hours: Math.round(left_seconds / hm),
            minutes: Math.round(left_seconds / mm),
            seconds: Math.round(left_seconds / sm)
        };
    }

    i18n(loc){
        const element = this.element, o = this.options;
        const parts = ["days", "hours", "minutes", "seconds"];
        const locale = Metro.getLocale(loc)
        if (!loc) return
        o.locale = loc
        $.each(parts, function(){
            const cls = ".part." + this;
            const part = element.find(cls);
            part.attr("data-label", locale["calendar"]["time"][this]);
        });
    }
}

Registry.register("countdown", Countdown)