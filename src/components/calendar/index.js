import "./calendar.css"
import {Component} from "../../core/component.js";
import {Registry} from "../../core/registry.js";
import {merge} from "../../routines/merge.js";
import {to_array} from "../../routines/to-array.js";

let CalendarDefaultOptions = {
    deferred: 0,
    startFrom: "days",
    headerFormat: "dddd, MMM DD",
    timeFormat: 24,
    showHeader: true,
    showFooter: true,
    locale: "en-US",
    buttons: "cancel, today, clear, done",
    minYear: 0,
    maxYear: 0,
    weekStart: 1,
    showWeekNumber: true,
    showOutsideDays: true,
    showGhost: true,
    wide: false,
}

export class Calendar extends Component {
    draw = null
    current = null
    today = null

    constructor(elem, options) {
        if (typeof globalThis["metroCalendarSetup"] !== "undefined") {
            CalendarDefaultOptions = merge({}, CalendarDefaultOptions, globalThis["metroCalendarSetup"])
        }
        super(elem, 'calendar', merge({}, CalendarDefaultOptions, options));
        setTimeout(()=>{
            this.createStruct()
            this.createEvents()
        }, this.options.deferred)
    }

    createStruct(){
        const element = this.element, o = this.options
        const now = datetime().align("day")

        element.addClass("calendar")
        if (o.wide) {
            element.addClass("calendar-wide")
        }

        this.draw = o.startFrom
        this.today = now.clone()
        this.current = now.clone()

        this.drawCalendar()
    }
    createEvents(){
        const that = this, element = this.element, o = this.options

        element.on("click", ".next-month, .prev-month", function (){
            const el = $(this)
            if (el.hasClass("next-month")) {
                that.current.addMonth(1)
            } else {
                that.current.addMonth(-1)
            }
            that.drawCalendar()
        })

        element.on("click", ".next-year, .prev-year", function (){
            const el = $(this)
            if (el.hasClass("next-year")) {
                that.current.addYear(1)
            } else {
                that.current.addYear(-1)
            }
            that.drawCalendar()
        })

        element.on("click", ".curr-month", function(){
            that.draw = "months"
            that.drawCalendar()
        })

        element.on("click", ".curr-year", function(){
            that.draw = "years"
            that.drawCalendar()
        })

        element.on("click", ".button.today", function(){
            that.current = datetime()
            that.drawCalendar()
        })

        element.on("click", ".next-year-group, .prev-year-group", function(){
            const el = $(this)
            if (el.hasClass("next-year-group")) {
                that.current.addYear(9)
            } else {
                that.current.addYear(-9)
            }
            that.drawCalendar()
        })

        element.on("click", ".years > .year", function(){
            that.current.year($(this).text())
            that.draw = "months"
            that.drawCalendar()
        })

        element.on("click", ".months > .month", function(){
            that.current.month($(this).attr("data-month"))
            that.draw = "days"
            that.drawCalendar()
        })
    }

    drawDays(){
        const element = this.element, o = this.options
        let content = element.find(".calendar-content")
        const calendar = datetime(this.current.year(), this.current.month(), this.current.day()).useLocale(o.locale).calendar(o.weekStart);
        const locale = Metro.getLocale(o.locale, "calendar")
        const now = datetime()

        if (!content.length) {
            content = $("<div>").addClass("calendar-content").appendTo(element)
        }

        if (o.showWeekNumber) {
            content.addClass("-week-numbers");
        }

        content.clear()

        const toolbar = $("<div>").addClass("calendar-toolbar").appendTo(content);

        $("<span>").addClass("prev-month").html("&lsaquo;").appendTo(toolbar);
        $("<span>").addClass("curr-month").html(locale['months'][this.current.month()]).appendTo(toolbar);
        $("<span>").addClass("next-month").html("&rsaquo;").appendTo(toolbar);

        $("<span>").addClass("prev-year").html("&lsaquo;").appendTo(toolbar);
        $("<span>").addClass("curr-year").html(this.current.year()).appendTo(toolbar);
        $("<span>").addClass("next-year").html("&rsaquo;").appendTo(toolbar);

        const weekDays = $("<div>").addClass("week-days").appendTo(content);
        if (o.showWeekNumber) {
            $("<span>").addClass("week-number").html("#").appendTo(weekDays);
        }
        $.each(calendar['weekdays'], (_, wd) => {
            $("<span>").addClass("week-day").html(wd).appendTo(weekDays);
        });

        const calendarDays = $("<div>").addClass("days").appendTo(content);

        $.each(calendar['days'], (i, day) => {
            const date = datetime(day).align('day');
            const outsideDate = date.month() !== this.current.month();

            if (o.showWeekNumber && i % 7 === 0) {
                $("<span>").addClass("week-number").html(date.weekNumber(o.weekStart)).appendTo(calendarDays);
            }

            const cell = $("<span>").addClass("day").html(date.day()).appendTo(calendarDays);

            cell.data('day', day).addClass("to-animate");

            if (outsideDate) {
                cell.addClass("outside");
                if (!o.showOutsideDays) {
                    cell.empty();
                }
            }

            if (day === calendar['today']) {
                cell.addClass("today")
            }

            if (o.showGhost && date.day() === now.day()) {
                cell.addClass("coincidental");
            }
        })

        this.animateContent(".day");
    }

    drawMonths(){
        const element = this.element, o = this.options
        let content = element.find(".calendar-content")
        const locale = Metro.getLocale(o.locale, "calendar")["months"]

        if (!content.length) {
            content = $("<div>").addClass("calendar-content").appendTo(element)
        }

        content.clear()

        const toolbar = $("<div>").addClass("calendar-toolbar").appendTo(content);

        /**
         * Calendar toolbar
         */

        $("<span>").addClass("prev-year").html("&lsaquo;").appendTo(toolbar);
        $("<span>").addClass("curr-year").html(this.current.year()).appendTo(toolbar);
        $("<span>").addClass("next-year").html("&rsaquo;").appendTo(toolbar);

        const months = $("<div>").addClass("months")
        content.append( months );

        for(let i = 12; i < 24; i++) {
            const month = $("<div>")
                .attr("data-month", `${i - 12}`)
                .addClass("month")
                .addClass(i - 12 === this.today.month() && this.current.year() === this.today.year() ? "today" : "")
                .html(locale[i])

            months.append( month );

            month.addClass("to-animate");

            this.fireEvent("drawMonth", {
                month: i - 12,
                current: this.current,
                cell: month[0]
            });
        }

        this.animateContent(".months .month");

    }

    drawYears(){
        const element = this.element, o = this.options
        let content = element.find(".calendar-content")

        if (!content.length) {
           content = $("<div>").addClass("calendar-content").appendTo(element)
        }

        content.clear()

        const toolbar = $("<div>").addClass("calendar-toolbar").appendTo(content)

        $("<span>").addClass("prev-year-group").html("&lsaquo;").appendTo(toolbar);
        $("<span>").addClass("curr-year").html((this.current.year() - 4) + " - " + (this.current.year() + 4)).appendTo(toolbar);
        $("<span>").addClass("next-year-group").html("&rsaquo;").appendTo(toolbar);

        const years = $("<div>").addClass("years")
        content.append( years );

        for (let i = this.current.year() - 4; i <= this.current.year() + 4; i++){
            const year = $("<div>")
                .attr("data-year", i)
                .addClass("year")
                .addClass(i === this.current.year ? "today" : "")
                .html(i)

            years.append( year );

            year.addClass("to-animate");

            if (o.minYear && i < o.minYear ) {
                year.addClass("disabled");
            }

            if (o.maxYear && i > o.maxYear) {
                year.addClass("disabled");
            }

            this.fireEvent("drawYear", {
                year: i,
                current: this.current,
                cell: year[0]
            });
        }

        this.animateContent(".years .year");
    }

    drawTime(){}

    drawHeader(){
        const element = this.element, o = this.options
        let header = element.find(".calendar-header")
        if (!header.length) {
            header = $("<div>").addClass("calendar-header").appendTo(element)
        }
        header.clear()
        $(`<div data-role='clock' data-format="${o.timeFormat}">`).addClass("header-time").appendTo(header)
        $("<div>").addClass("header-year").html(this.today.year()).appendTo(header)
        $("<div>").addClass("header-day").html(this.today.format(o.headerFormat, o.locale)).appendTo(header)
        if (o.showHeader === false) {
            header.hide()
        }
    }

    drawFooter(){
        const element = this.element, o = this.options
        const locale = Metro.getLocale(o.locale, "buttons")
        let footer = element.find(".calendar-footer")
        if (!o.buttons.trim()) {
            footer.hide()
            return
        }
        if (footer.length === 0) {
            footer = $("<div>").addClass("calendar-footer").appendTo(element);
        }
        footer.clear()
        $.each(to_array(o.buttons, ","), (i, btn) => {
            const button = $("<button>").attr("type", "button").addClass(`button ${btn}`).html(locale[btn]).appendTo(footer);
            if (btn === 'cancel' || btn === 'done') {
                button.addClass("js-dialog-close");
            }
        })
        if (o.showFooter === false) {
            footer.hide();
        }
    }

    drawCalendar(){
        this.drawHeader()
        switch (this.draw) {
            case "months": this.drawMonths(); break;
            case "years": this.drawYears(); break;
            default: this.drawDays();
        }
        this.drawTime()
        this.drawFooter()
    }

    animateContent(target, cls){
        const element = this.element, o = this.options;
        const content = element.find(".calendar-content");

        cls = cls || "to-animate";

        content.find(target).each( (k, el) => {
            const day = $(el);
            setTimeout(() => {
                day.removeClass(cls);
            }, 10 * k);
        });
    }

}

Registry.register("calendar", Calendar)