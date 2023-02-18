(function (require$$0, require$$4, require$$3, require$$5) {
    'use strict';

    function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

    var require$$0__default = /*#__PURE__*/_interopDefaultLegacy(require$$0);
    var require$$4__default = /*#__PURE__*/_interopDefaultLegacy(require$$4);
    var require$$3__default = /*#__PURE__*/_interopDefaultLegacy(require$$3);
    var require$$5__default = /*#__PURE__*/_interopDefaultLegacy(require$$5);

    const debug = (...args) => {
        !args.length ? console.log('Hi!') : args.length === 1 ? console.log(JSON.stringify(args[0], null, 2)) : console.log(...args);
    };

    globalThis.METRO5_COMPONENTS_REGISTRY = {};

    const Registry = {
        register(name, _class){
            if (METRO5_COMPONENTS_REGISTRY[name]) {
                return
            }
            METRO5_COMPONENTS_REGISTRY[name] = _class;
        },

        unregister(name, _class){
            if (!METRO5_COMPONENTS_REGISTRY[name] || METRO5_COMPONENTS_REGISTRY[name] !== _class) {
                return
            }
            delete METRO5_COMPONENTS_REGISTRY[name];
        },

        getClass(name){
            return METRO5_COMPONENTS_REGISTRY[name]
        },

        getRegistry(){
            return METRO5_COMPONENTS_REGISTRY
        },

        dump(){
            debug(METRO5_COMPONENTS_REGISTRY);
        }
    };

    const isObject = item => (item && typeof item === 'object' && !Array.isArray(item));

    const merge = (target, ...sources) => {
        if (!sources.length) return target;
        const source = sources.shift();

        if (isObject(target) && isObject(source)) {
            for (const key in source) {
                if (isObject(source[key])) {
                    if (!target[key]) Object.assign(target, { [key]: {} });
                    merge(target[key], source[key]);
                } else {
                    Object.assign(target, { [key]: source[key] });
                }
            }
        }

        return merge(target, ...sources);
    };

    const isNum = v => !isNaN(v);

    const DEFAULT_FORMAT = "YYYY-MM-DDTHH:mm:ss.sss";
    const INVALID_DATE = "Invalid date";
    const REGEX_FORMAT = /\[([^\]]+)]|Y{1,4}|M{1,4}|D{1,2}|d{1,4}|H{1,2}|m{1,2}|s{1,3}/g;
    const REGEX_FORMAT_STRFTIME = /(%[a-z])/gi;
    const DEFAULT_FORMAT_STRFTIME = "%Y-%m-%dT%H:%M:%S.%Q%t";
    const DEFAULT_LOCALE = {
        months: "January February March April May June July August September October November December".split(" "),
        monthsShort: "Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec".split(" "),
        weekdays: "Sunday Monday Tuesday Wednesday Thursday Friday Saturday".split(" "),
        weekdaysShort: "Sun Mon Tue Wed Thu Fri Sat".split(" "),
        weekdaysMin: "Su Mo Tu We Th Fr Sa".split(" "),
        weekStart: 0
    };

    const M = {
        ms: "Milliseconds",
        s: "Seconds",
        m: "Minutes",
        h: "Hours",
        D: "Date",
        d: "Day",
        M: "Month",
        Y: "FullYear",
        y: "Year",
        t: "Time"
    };

    const C = {
        ms: "ms",
        s: "second",
        m: "minute",
        h: "hour",
        D: "day",
        W: "week",
        d: "weekDay",
        M: "month",
        Y: "year",
        Y2: "year2",
        t: "time",
        c: "century",
        q: "quarter"
    };

    const required = (m = '') => {
        throw new Error("This argument is required!")
    };

    const isset = (v, nullable = true) => {
        try {
            return nullable ? typeof v !== 'undefined' : typeof v !== 'undefined' && v !== null
        } catch (e) {
            return false
        }
    };

    const not = v => typeof v === "undefined" || v === null;

    const lpad$1 = function(str, pad, length){
        let _str = ""+str;
        if (length && _str.length >= length) {
            return _str;
        }
        return Array((length + 1) - _str.length).join(pad) + _str;
    };

    class Datetime {
        constructor() {
            const args = [].slice.call(arguments);
            this.value = new (Function.prototype.bind.apply(Date,  [this].concat(args) ) );
            this.locale = "en";
            this.weekStart = Datetime.locales["en"].weekStart;
            this.utcMode = false;
            this.mutable = true;

            if (!isNum(this.value.getTime())) {
                throw new Error(INVALID_DATE);
            }
        }

        static locales = {
            "en": DEFAULT_LOCALE
        }

        static isDatetime(val){
            return val instanceof Datetime;
        }

        static now(asDate = false){
            return datetime()[asDate ? "val" : "time"]();
        }

        static parse(str = required()){
            return datetime(Date.parse(str));
        }

        static setLocale(name = required(), locale = required()){
            Datetime.locales[name] = locale;
        }

        static getLocale(name = "en"){
            return isset(Datetime.locales[name], false) ? Datetime.locales[name] : Datetime.locales["en"];
        }

        static align(date, align){
            let _date = datetime(date),
                result, temp;

            switch (align) {
                case C.s:  result = _date.ms(0); break; //second
                case C.m:  result = Datetime.align(_date, C.s)[C.s](0); break; //minute
                case C.h:  result = Datetime.align(_date, C.m)[C.m](0); break; //hour
                case C.D:  result = Datetime.align(_date, C.h)[C.h](0); break; //day
                case C.M:  result = Datetime.align(_date, C.D)[C.D](1); break; //month
                case C.Y:  result = Datetime.align(_date, C.M)[C.M](0); break; //year
                case C.W:  {
                    temp = _date.weekDay();
                    result = Datetime.align(date, C.D).addDay(-temp);
                    break; // week
                }
                default: result = _date;
            }
            return result;
        }

        static alignEnd(date, align){
            let _date = datetime(date),
                result, temp;

            switch (align) {
                case C.ms: result = _date.ms(999); break; //second
                case C.s:  result = Datetime.alignEnd(_date, C.ms); break; //second
                case C.m:  result = Datetime.alignEnd(_date, C.s)[C.s](59); break; //minute
                case C.h:  result = Datetime.alignEnd(_date, C.m)[C.m](59); break; //hour
                case C.D:  result = Datetime.alignEnd(_date, C.h)[C.h](23); break; //day
                case C.M:  result = Datetime.alignEnd(_date, C.D)[C.D](1).add(1, C.M).add(-1, C.D); break; //month
                case C.Y:  result = Datetime.alignEnd(_date, C.D)[C.M](11)[C.D](31); break; //year
                case C.W:  {
                    temp = _date.weekDay();
                    result = Datetime.alignEnd(_date, 'day').addDay(6 - temp);
                    break; // week
                }

                default: result = date;
            }

            return result;
        }

        immutable(v){
            this.mutable = !(not(v) ? true : v);
            return this;
        }

        utc(){
            this.utcMode = true;
            return this;
        }

        local(){
            this.utcMode = false;
            return this;
        }

        useLocale(val){
            this.locale = !isset(Datetime.locales[val], false) ? "en" : val;
            this.weekStart = Datetime.getLocale(this.locale).weekStart;
            return this;
        }

        clone(){
            const c = datetime(this.value);
            c.locale = this.locale;
            c.weekStart = this.weekStart;
            c.mutable = this.mutable;
            return c;
        }

        align(to){
            if (this.mutable) {
                this.value = Datetime.align(this, to).val();
                return this;
            }

            return this.clone().immutable(false).align(to).immutable(!this.mutable);
        }

        alignEnd(to){
            if (this.mutable) {
                this.value = Datetime.alignEnd(this, to).val();
                return this;
            }

            return this.clone().immutable(false).alignEnd(to).immutable(!this.mutable);
        }

        val(val){
            if ( !(val instanceof Date) )
                return this.value;

            if (this.mutable) {
                this.value = val;
                return this;
            }

            return datetime(val);
        }

        year2(){
            return +(""+this.year()).substr(-2);
        }

        /* Get + Set */

        _set(m, v){
            const fn = "set" + (this.utcMode && m !== "t" ? "UTC" : "") + M[m];
            if (this.mutable) {
                this.value[fn](v);
                return this;
            }
            const clone = this.clone();
            clone.value[fn](v);
            return clone;
        }

        _get(m){
            const fn = "get" + (this.utcMode && m !== "t" ? "UTC" : "") + M[m];
            return this.value[fn]();
        }

        _work(part, val){
            if (!arguments.length || (typeof val === "undefined" || val === null)) {
                return this._get(part);
            }
            return this._set(part, val);
        }

        ms(val){ return this._work("ms", val);}
        second(val){return this._work("s", val);}
        minute(val){return this._work("m", val); }
        hour(val){return this._work("h", val);}
        day(val){return this._work("D", val);}
        month(val){return this._work("M", val);}
        year(val){return this._work("Y", val);}
        time(val){return this._work("t", val);}

        weekDay(val){
            if (!arguments.length || (not(val))) {
                return this.utcMode ? this.value.getUTCDay() : this.value.getDay();
            }

            const curr = this.weekDay();
            const diff = val - curr;

            this.day(this.day() + diff);

            return this;
        }

        get(unit){
            return typeof this[unit] !== "function" ? this : this[unit]();
        }

        set(unit, val){
            return typeof this[unit] !== "function" ? this : this[unit](val);
        }

        add(val, to){
            switch (to) {
                case C.h: return this.time(this.time() + (val * 60 * 60 * 1000));
                case C.m: return this.time(this.time() + (val * 60 * 1000));
                case C.s: return this.time(this.time() + (val * 1000));
                case C.ms: return this.time(this.time() + (val));
                case C.D: return this.day(this.day() + val);
                case C.W: return this.day(this.day() + val * 7);
                case C.M: return this.month(this.month() + val);
                case C.Y: return this.year(this.year() + val);
            }
        }

        addHour(v){return this.add(v,C.h);}
        addMinute(v){return this.add(v,C.m);}
        addSecond(v){return this.add(v, C.s);}
        addMs(v){return this.add(v, C.ms);}
        addDay(v){return this.add(v,C.D);}
        addWeek(v){return this.add(v,C.W);}
        addMonth(v){return this.add(v, C.M);}
        addYear(v){return this.add(v, C.Y);}

        format(fmt, locale){
            const format = fmt || DEFAULT_FORMAT;
            const names = Datetime.getLocale(locale || this.locale);
            const year = this.year(), year2 = this.year2(), month = this.month(), day = this.day(), weekDay = this.weekDay();
            const hour = this.hour(), minute = this.minute(), second = this.second(), ms = this.ms();
            const matches = {
                YY: year2,
                YYYY: year,
                M: month + 1,
                MM: lpad$1(month + 1, 0, 2),
                MMM: names.monthsShort[month],
                MMMM: names.months[month],
                D: day,
                DD: lpad$1(day, 0, 2),
                d: weekDay,
                dd: names.weekdaysMin[weekDay],
                ddd: names.weekdaysShort[weekDay],
                dddd: names.weekdays[weekDay],
                H: hour,
                HH: lpad$1(hour, 0, 2),
                m: minute,
                mm: lpad$1(minute,0, 2),
                s: second,
                ss: lpad$1(second,0, 2),
                sss: lpad$1(ms,0, 3)
            };

            return format.replace(REGEX_FORMAT, (match, $1) => $1 || matches[match]);
        }

        valueOf(){
            return this.value.valueOf();
        }

        toString(){
            return this.value.toString();
        }
    }

    const datetime = (...args) => args && args[0] instanceof Datetime ? args[0] : new Datetime(...args);

    const fnFormat$5 = Datetime.prototype.format;

    const buddhistMixin = {
        buddhist() {
            return this.year() + 543;
        },

        format(format, locale) {
            format = format || DEFAULT_FORMAT;
            const matches = {
                BB: (this.buddhist() + "").slice(-2),
                BBBB: this.buddhist()
            };
            let result = format.replace(/(\[[^\]]+])|B{4}|B{2}/g, (match, $1) => $1 || matches[match]);

            return fnFormat$5.bind(this)(result, locale)
        }
    };

    Object.assign(Datetime.prototype, buddhistMixin);

    const createCalendar = (date, iso) => {
        let _date = datetime(date);
        let ws = iso === 0 || iso ? iso : date.weekStart;
        let wd = ws ? _date.isoWeekDay() : _date.weekDay();
        let names = Datetime.getLocale(_date.locale);
        let now = datetime(), i;

        const getWeekDays = (wd, ws) => {
            if (ws === 0) {
                return wd;
            }
            let su = wd[0];
            return wd.slice(1).concat([su]);
        };

        const result = {
            month: names.months[_date.month()],
            days: [],
            weekstart: iso ? 1 : 0,
            weekdays: getWeekDays(names.weekdaysMin,ws),
            today: now.format("YYYY-MM-DD"),
            weekends: [],
            week: []
        };


        _date.addDay(ws ? -wd+1 : -wd);

        for(i = 0; i < 42; i++) {
            result.days.push(_date.format("YYYY-MM-DD"));
            _date.add(1, 'day');
        }

        result.weekends = result.days.filter(function(v, i){
            const def = [0,6,7,13,14,20,21,27,28,34,35,41];
            const iso = [5,6,12,13,19,20,26,27,33,34,40,41];

            return ws === 0 ? def.includes(i) : iso.includes(i);
        });

        _date = now.clone();
        wd = ws ? _date.isoWeekDay() : _date.weekDay();
        _date.addDay(ws ? -wd+1 : -wd);
        for (i = 0; i < 7; i++) {
            result.week.push(_date.format("YYYY-MM-DD"));
            _date.add(1, 'day');
        }

        return result;
    };

    Object.assign(Datetime.prototype, {
        // 1 - Monday, 0 - Sunday
        calendar(weekStart){
            return createCalendar(this, weekStart);
        }
    });

    const fnFormat$4 = Datetime.prototype.format;

    Object.assign(Datetime.prototype, {
        century(){
            return Math.ceil(this.year()/100);
        },

        format(format, locale){
            format = format || DEFAULT_FORMAT;

            const matches = {
                C: this.century()
            };

            let fmt = format.replace(/(\[[^\]]+])|C/g, (match, $1) => $1 || matches[match]);

            return fnFormat$4.bind(this)(fmt, locale)
        }
    });

    Object.assign(Datetime.prototype, {
        same(d){
            return this.time() === datetime(d).time();
        },

        /*
        * align: year, month, day, hour, minute, second, ms = default
        * */
        compare(d, align, operator = "="){
            const date = datetime(d);
            const curr = datetime(this.value);
            let t1, t2;

            operator = operator || "=";

            if (["<", ">", ">=", "<=", "=", "!="].includes(operator) === false) {
                operator = "=";
            }

            align = (align || "ms").toLowerCase();

            t1 = curr.align(align).time();
            t2 = date.align(align).time();

            switch (operator) {
                case "<":
                    return t1 < t2;
                case ">":
                    return t1 > t2;
                case "<=":
                    return t1 <= t2;
                case ">=":
                    return t1 >= t2;
                case "=":
                    return t1 === t2;
                case "!=":
                    return t1 !== t2;
            }
        },

        between(d1, d2){
            return this.younger(d1) && this.older(d2);
        },

        older(date, align){
            return this.compare(date, align, "<");
        },

        olderOrEqual(date, align){
            return this.compare(date, align, "<=");
        },

        younger(date, align){
            return this.compare(date, align, ">");
        },

        youngerOrEqual(date, align){
            return this.compare(date, align, ">=");
        },

        equal(date, align){
            return this.compare(date, align, "=");
        },

        notEqual(date, align){
            return this.compare(date, align, "!=");
        },

        diff(d){
            const date = datetime(d);
            const diff = Math.abs(this.time() - date.time());
            const diffMonth = Math.abs(this.month() - date.month() + (12 * (this.year() - date.year())));

            return {
                "ms": diff,
                "second": Math.ceil(diff / 1000),
                "minute": Math.ceil(diff / (1000 * 60)),
                "hour": Math.ceil(diff / (1000 * 60 * 60)),
                "day": Math.ceil(diff / (1000 * 60 * 60 * 24)),
                "month": diffMonth,
                "year": Math.floor(diffMonth / 12)
            }
        },

        distance(d, align){
            return this.diff(d)[align];
        }
    });

    Object.assign(Datetime.prototype, {
        isLeapYear(){
            const year = this.year();
            return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
        }
    });

    Object.assign(Datetime.prototype, {
        dayOfYear(){
            const dayCount = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
            const month = this.month();
            const day = this.day();
            return dayCount[month] + day + ((month > 1 && this.isLeapYear()) ? 1 : 0);
        }
    });

    Object.assign(Datetime.prototype, {
        daysInMonth(){
            const curr = datetime(this.value);
            return curr.add(1, 'month').day(1).add(-1, 'day').day();
        },

        daysInYear(){
            return this.isLeapYear() ? 366 : 365;
        },

        daysInYearMap(){
            const result = [];
            const curr = datetime(this.value);

            curr.month(0).day(1);

            for(let i = 0; i < 12; i++) {
                curr.add(1, 'month').add(-1, 'day');
                result.push(curr.day());
                curr.day(1).add(1, 'month');
            }
            return result;
        },

        daysInYearObj(locale, shortName){
            const map = this.daysInYearMap();
            const result = {};
            const names = Datetime.getLocale(locale || this.locale);

            map.forEach((v, i) => result[names[shortName ? 'monthsShort' : 'months'][i]] = v);

            return result;
        }
    });

    Object.assign(Datetime.prototype, {
        decade(){
            return Math.floor(this.year()/10) * 10;
        },

        decadeStart(){
            const decade = this.decade();
            const result = this.mutable ? this : this.clone();

            return result.year(decade).month(0).day(1);
        },

        decadeEnd(){
            const decade = this.decade() + 9;
            const result = this.mutable ? this : this.clone();

            return result.year(decade).month(11).day(31);
        },

        decadeOfMonth(){
            const part = this.clone().add(1, "month").day(1).add(-1, 'day').day() / 3;
            const day = this.day();

            if (day <= part) return 1;
            if (day <= part * 2) return 2;
            return 3;
        }
    });

    Object.assign(Datetime, {
        from(str, format, locale){
            let norm, normFormat, fItems, dItems;
            let iMonth, iDay, iYear, iHour, iMinute, iSecond, iMs;
            let year, month, day, hour, minute, second, ms;
            let parsedMonth;

            const getIndex = function(where, what){
                return where.map(function(el){
                    return el.toLowerCase();
                }).indexOf(what.toLowerCase());
            };

            const monthNameToNumber = function(month){
                let i = -1;
                const names = Datetime.getLocale(locale || 'en');

                if (not(month)) return -1;

                i = getIndex(names.months, month);

                if (i === -1 && typeof names["monthsParental"] !== "undefined") {
                    i = getIndex(names["monthsParental"], month);
                }

                if (i === -1) {
                    month = month.substr(0, 3);
                    i = getIndex(names.monthsShort, month);
                }

                return i === -1 ? -1 : i + 1;
            };

            const getPartIndex = function(part){
                const parts = {
                    "month": ["M", "mm", "%m"],
                    "day": ["D", "dd", "%d"],
                    "year": ["YY", "YYYY", "yy", "yyyy", "%y"],
                    "hour": ["h", "hh", "%h"],
                    "minute": ["m", "mi", "i", "ii", "%i"],
                    "second": ["s", "ss", "%s"],
                    "ms": ["sss"]
                };

                let result = -1, key, index;

                for(let i = 0; i < parts[part].length; i++) {
                    key = parts[part][i];
                    index = fItems.indexOf(key);
                    if (index !== -1) {
                        result = index;
                        break;
                    }
                }

                return result;
            };

            if (!format) {
                return datetime();
            }

            /* eslint-disable-next-line */
            norm = str.replace(/[\/,.:\s]/g, '-');
            /* eslint-disable-next-line */
            normFormat = format.toLowerCase().replace(/[^a-zA-Z0-9%]/g, '-');
            fItems = normFormat.split('-');
            dItems = norm.split('-');

            if (norm.replace(/-/g,"").trim() === "") {
                throw new Error(INVALID_DATE);
            }

            iMonth = getPartIndex("month");
            iDay = getPartIndex("day");
            iYear = getPartIndex("year");
            iHour = getPartIndex("hour");
            iMinute = getPartIndex("minute");
            iSecond = getPartIndex("second");
            iMs = getPartIndex("ms");

            if (iMonth > -1 && dItems[iMonth]) {
                if (isNaN(parseInt(dItems[iMonth]))) {
                    dItems[iMonth] = monthNameToNumber(dItems[iMonth]);
                    if (dItems[iMonth] === -1) {
                        iMonth = -1;
                    }
                } else {
                    parsedMonth = parseInt(dItems[iMonth]);
                    if (parsedMonth < 1 || parsedMonth > 12) {
                        iMonth = -1;
                    }
                }
            } else {
                iMonth = -1;
            }

            year  = iYear > -1 && dItems[iYear] ? dItems[iYear] : 0;
            month = iMonth > -1 && dItems[iMonth] ? dItems[iMonth] : 1;
            day   = iDay > -1 && dItems[iDay] ? dItems[iDay] : 1;

            hour    = iHour > -1 && dItems[iHour] ? dItems[iHour] : 0;
            minute  = iMinute > -1 && dItems[iMinute] ? dItems[iMinute] : 0;
            second  = iSecond > -1 && dItems[iSecond] ? dItems[iSecond] : 0;
            ms  = iMs > -1 && dItems[iMs] ? dItems[iMs] : 0;

            return datetime(year, month-1, day, hour, minute, second, ms);
        }
    });

    const fnFormat$3 = Datetime.prototype.format;

    Object.assign(Datetime.prototype, {
        ampm(isLowerCase){
            let val = this.hour() < 12 ? "AM" : "PM";
            return isLowerCase ? val.toLowerCase() : val;
        },

        hour12: function(h, p){
            let hour = h;

            if (arguments.length === 0) {
                return this.hour() % 12;
            }

            p = p || 'am';

            if (p.toLowerCase() === "pm") {
                hour += 12;
            }

            return this.hour(hour);
        },

        format: function(format, locale){
            let matches, result, h12 = this.hour12();

            format = format || DEFAULT_FORMAT;

            matches = {
                a: "["+this.ampm(true)+"]",
                A: "["+this.ampm(false)+"]",
                h: h12,
                hh: lpad$1(h12, 0, 2)
            };

            result = format.replace(/(\[[^\]]+])|a|A|h{1,2}/g, (match, $1) => $1 || matches[match]);

            return fnFormat$3.bind(this)(result, locale)
        }
    });

    const fnFormat$2 = Datetime.prototype.format;
    const fnAlign$1 = Datetime.align;
    const fnAlignEnd$1 = Datetime.alignEnd;

    Object.assign(Datetime, {
        align(d, align) {
            let date = datetime(d), result, temp;

            switch(align) {
                case "isoWeek":
                    temp = date.isoWeekDay();
                    result = fnAlign$1(date, 'day').addDay(-temp + 1);
                    break; // isoWeek

                default: result = fnAlign$1.apply(undefined, [date, align]);
            }

            return result;
        },

        alignEnd (d, align) {
            let date = datetime(d), result, temp;

            switch(align) {
                case "isoWeek":
                    temp = date.isoWeekDay();
                    result = fnAlignEnd$1(date, 'day').addDay(7 - temp);
                    break; // isoWeek

                default: result = fnAlignEnd$1.apply(undefined, [date, align]);
            }

            return result;
        }
    });

    Object.assign(Datetime.prototype, {
        isoWeekDay(val){
            let wd = (this.weekDay() + 6) % 7 + 1;

            if (!arguments.length || (not(val))) {
                return wd;
            }

            return this.addDay(val - wd);
        },

        format(format, locale){
            format = format || DEFAULT_FORMAT;
            const matches = {
                I: this.isoWeekDay()
            };
            let result = format.replace(/(\[[^\]]+])|I{1,2}/g, (match, $1) => $1 || matches[match]);
            return fnFormat$2.bind(this)(result, locale)
        }
    });

    Object.assign(Datetime, {
        max(){
            let arr = [].slice.call(arguments);
            return arr.map((el) => datetime(el)).sort((a, b) => b.time() - a.time())[0];
        }
    });

    Object.assign(Datetime.prototype, {
        max(){
            return Datetime.max.apply(this, [this].concat([].slice.call(arguments)));
        }
    });

    Object.assign(Datetime, {
        min(){
            let arr = [].slice.call(arguments);
            return arr.map((el) => datetime(el)).sort((a, b) => a.time() - b.time())[0];
        }
    });

    Object.assign(Datetime.prototype, {
        min(){
            return Datetime.min.apply(this, [this].concat([].slice.call(arguments)));
        }
    });

    const fnAlign = Datetime.align;
    const fnAlignEnd = Datetime.alignEnd;
    const fnAdd = Datetime.prototype.add;

    Object.assign(Datetime, {
        align(d, align){
            let date = datetime(d), result;

            switch(align) {
                case "quarter":  result = Datetime.align(date, 'day').day(1).month(date.quarter() * 3 - 3); break; //quarter
                default: result = fnAlign.apply(this, [date, align]);
            }

            return result;
        },

        alignEnd(d, align){
            let date = datetime(d), result;

            switch(align) {
                case "quarter":  result = Datetime.align(date, 'quarter').add(3, 'month').add(-1, 'ms'); break; //quarter
                default: result = fnAlignEnd.apply(this, [date, align]);
            }

            return result;
        }
    });

    Object.assign(Datetime.prototype, {
        quarter(){
            const month = this.month();

            if (month <= 2) return 1;
            if (month <= 5) return 2;
            if (month <= 8) return 3;
            return 4;
        },

        add(val, to){
            if (to === "quarter") {
                return this.month(this.month() + val * 3);
            }
            return fnAdd.bind(this)(val, to);
        },

        addQuarter(v){
            return this.add(v, "quarter");
        }
    });

    Object.assign(Datetime, {
        sort(arr, opt){
            let result, _arr;
            const o = {};

            if (typeof opt === "string" || typeof opt !== "object" || not(opt)) {
                o.format = DEFAULT_FORMAT;
                o.dir = opt && opt.toUpperCase() === "DESC" ? "DESC" : "ASC";
                o.returnAs = "datetime";
            } else {
                o.format = opt.format || DEFAULT_FORMAT;
                o.dir = (opt.dir || "ASC").toUpperCase();
                o.returnAs = opt.format ? "string" : opt.returnAs || "datetime";
            }

            _arr =  arr.map((el) => datetime(el)).sort((a, b) => a.valueOf() - b.valueOf());

            if (o.dir === "DESC") {
                _arr.reverse();
            }

            switch (o.returnAs) {
                case "string":
                    result = _arr.map((el) => el.format(o.format));
                    break;
                case "date":
                    result = _arr.map((el) => el.val());
                    break;

                default: result = _arr;
            }

            return result;
        }
    });

    const fnFormat$1 = Datetime.prototype.format;

    Object.assign(Datetime.prototype, {
        utcOffset(){
            return this.value.getTimezoneOffset();
        },

        timezone(){
            return this.toTimeString().replace(/.+GMT([+-])(\d{2})(\d{2}).+/, '$1$2:$3');
        },

        timezoneName(){
            return this.toTimeString().replace(/.+\((.+?)\)$/, '$1');
        },

        format(format, locale){
            format = format || DEFAULT_FORMAT;

            const matches = {
                Z: this.utcMode ? "Z" : this.timezone(),
                ZZ: this.timezone().replace(":", ""),
                ZZZ: "[GMT]"+this.timezone(),
                z: this.timezoneName()
            };

            let result = format.replace(/(\[[^\]]+])|Z{1,3}|z/g, (match, $1) => $1 || matches[match]);

            return fnFormat$1.bind(this)(result, locale)
        }
    });

    const fnFormat = Datetime.prototype.format;

    Object.assign(Datetime.prototype, {
        // TODO Need optimisation
        weekNumber (weekStart) {
            let nYear, nday, newYear, day, daynum, weeknum;

            weekStart = +weekStart || 0;
            newYear = datetime(this.year(), 0, 1);
            day = newYear.weekDay() - weekStart;
            day = (day >= 0 ? day : day + 7);
            daynum = Math.floor(
                (this.time() - newYear.time() - (this.utcOffset() - newYear.utcOffset()) * 60000) / 86400000
            ) + 1;

            if(day < 4) {
                weeknum = Math.floor((daynum + day - 1) / 7) + 1;
                if(weeknum > 52) {
                    nYear = datetime(this.year() + 1, 0, 1);
                    nday = nYear.weekDay() - weekStart;
                    nday = nday >= 0 ? nday : nday + 7;
                    weeknum = nday < 4 ? 1 : 53;
                }
            }
            else {
                weeknum = Math.floor((daynum + day - 1) / 7);
            }
            return weeknum;
        },

        isoWeekNumber(){
            return this.weekNumber(1);
        },

        weeksInYear(weekStart){
            const curr = datetime(this.value);
            return curr.month(11).day(31).weekNumber(weekStart);
        },

        format: function(format, locale){
            let matches, result, wn = this.weekNumber(), wni = this.isoWeekNumber();

            format = format || DEFAULT_FORMAT;

            matches = {
                W: wn,
                WW: lpad$1(wn, 0, 2),
                WWW: wni,
                WWWW: lpad$1(wni, 0, 2)
            };

            result = format.replace(/(\[[^\]]+])|W{1,4}/g, (match, $1) => $1 || matches[match]);

            return fnFormat.bind(this)(result, locale)
        }
    });

    Object.assign(Datetime.prototype, {
        strftime(fmt, locale){
            const format = fmt || DEFAULT_FORMAT_STRFTIME;
            const names = Datetime.getLocale(locale || this.locale);
            const year = this.year(), year2 = this.year2(), month = this.month(), day = this.day(), weekDay = this.weekDay();
            const hour = this.hour(), hour12 = this.hour12(), minute = this.minute(), second = this.second(), ms = this.ms(), time = this.time();
            const aDay = lpad$1(day, 0, 2),
                aMonth = lpad$1(month + 1, 0, 2),
                aHour = lpad$1(hour, 0, 2),
                aHour12 = lpad$1(hour12, 0, 2),
                aMinute = lpad$1(minute, 0, 2),
                aSecond = lpad$1(second, 0, 2),
                aMs = lpad$1(ms, 0, 3);

            const that = this;

            const thursday = function(){
                return datetime(that.value).day(that.day() - ((that.weekDay() + 6) % 7) + 3);
            };

            const matches = {
                '%a': names.weekdaysShort[weekDay],
                '%A': names.weekdays[weekDay],
                '%b': names.monthsShort[month],
                '%h': names.monthsShort[month],
                '%B': names.months[month],
                '%c': this.toString().substring(0, this.toString().indexOf(" (")),
                '%C': this.century(),
                '%d': aDay,
                '%D': [aDay, aMonth, year].join("/"),
                '%e': day,
                '%F': [year, aMonth, aDay].join("-"),
                '%G': thursday().year(),
                '%g': (""+thursday().year()).slice(2),
                '%H': aHour,
                '%I': aHour12,
                '%j': lpad$1(this.dayOfYear(), 0, 3),
                '%k': aHour,
                '%l': aHour12,
                '%m': aMonth,
                '%n': month + 1,
                '%M': aMinute,
                '%p': this.ampm(),
                '%P': this.ampm(true),
                '%s': Math.round(time / 1000),
                '%S': aSecond,
                '%u': this.isoWeekDay(),
                '%V': this.isoWeekNumber(),
                '%w': weekDay,
                '%x': this.toLocaleDateString(),
                '%X': this.toLocaleTimeString(),
                '%y': year2,
                '%Y': year,
                '%z': this.timezone().replace(":", ""),
                '%Z': this.timezoneName(),
                '%r': [aHour12, aMinute, aSecond].join(":") + " " + this.ampm(),
                '%R': [aHour, aMinute].join(":"),
                "%T": [aHour, aMinute, aSecond].join(":"),
                "%Q": aMs,
                "%q": ms,
                "%t": this.timezone()
            };

            return format.replace(
                REGEX_FORMAT_STRFTIME,
                (match) => (matches[match] === 0 || matches[match] ? matches[match] : match)
            );
        }
    });

    Object.assign(Datetime, {
        isToday(date){
            const d = datetime(date).align("day");
            const c = datetime().align('day');

            return d.time() === c.time();
        }
    });

    Object.assign(Datetime.prototype, {
        isToday(){
            return Datetime.isToday(this);
        },

        today(){
            const now = datetime();

            if (!this.mutable) {
                return now;
            }
            return this.val(now.val());
        }
    });

    Object.assign(Datetime, {
        isTomorrow(date){
            const d = datetime(date).align("day");
            const c = datetime().align('day').add(1, 'day');

            return d.time() === c.time();
        }
    });

    Object.assign(Datetime.prototype, {
        isTomorrow(){
            return Datetime.isTomorrow(this);
        },

        tomorrow(){
            if (!this.mutable) {
                return this.clone().immutable(false).add(1, 'day').immutable(!this.mutable);
            }
            return this.add(1, 'day');
        }
    });

    Object.assign(Datetime.prototype, {
        toDateString(){
            return this.value.toDateString();
        },

        toISOString(){
            return this.value.toISOString();
        },

        toJSON(){
            return this.value.toJSON();
        },

        toGMTString(){
            return this.value.toGMTString();
        },

        toLocaleDateString(){
            return this.value.toLocaleDateString();
        },

        toLocaleString(){
            return this.value.toLocaleString();
        },

        toLocaleTimeString(){
            return this.value.toLocaleTimeString();
        },

        toTimeString(){
            return this.value.toTimeString();
        },

        toUTCString(){
            return this.value.toUTCString();
        },

        toDate(){
            return new Date(this.value);
        }
    });

    Object.assign(Datetime, {
        timestamp(){
            return new Date().getTime() / 1000;
        }
    });

    Object.assign(Datetime.prototype, {
        unix(val) {
            let _val;

            if (!arguments.length || (not(val))) {
                return Math.floor(this.valueOf() / 1000)
            }

            _val = val * 1000;

            if (this.mutable) {
                return this.time(_val);
            }

            return datetime(this.value).time(_val);
        },

        timestamp(){
            return this.unix();
        }
    });

    Object.assign(Datetime, {
        isYesterday(date){
            const d = datetime(date).align("day");
            const c = datetime().align('day').add(-1, 'day');

            return d.time() === c.time();
        }
    });

    Object.assign(Datetime.prototype, {
        isYesterday(){
            return Datetime.isYesterday(this);
        },

        yesterday(){
            if (!this.mutable) {
                return this.clone().immutable(false).add(-1, 'day').immutable(!this.mutable);
            }
            return this.add(-1, 'day');
        }
    });

    const getResult = (val) => {
        let res;
        let seconds = Math.floor(val / 1000),
            minutes = Math.floor(seconds / 60),
            hours = Math.floor(minutes / 60),
            days = Math.floor(hours / 24),
            months = Math.floor(days / 30),
            years = Math.floor(months / 12);

        if (years >= 1) res =  `${years} year`;
        if (months >= 1 && years < 1) res =  `${months} mon`;
        if (days >= 1 && days <= 30) res =  `${days} days`;
        if (hours && hours < 24) res =  `${hours} hour`;
        if (minutes && (minutes >= 40 && minutes < 60)) res =  "less a hour";
        if (minutes && minutes < 40) res =  `${minutes} min`;
        if (seconds && seconds >= 30 && seconds < 60) res =  `${seconds} sec`;
        if (seconds < 30) res =  `few sec`;

        return res
    };

    Object.assign(Datetime, {
        timeLapse(d) {
            let old = datetime(d),
                now = datetime(),
                val = now - old;

            return getResult(val)
        }
    });

    Object.assign(Datetime.prototype, {
        timeLapse() {
            let val = datetime() - +this;
            return getResult(val)
        }
    });

    const ParseTimeMixin = {
        parseTime (t) {
            if (!isNaN(t)) return Math.abs(+t)
            const pattern = /([0-9]+d)|([0-9]{1,2}h)|([0-9]{1,2}m)|([0-9]{1,2}s)/gm;
            const match = t.match(pattern);
            return match.reduce( (acc, val) => {
                let res;

                if (val.includes('d')) {
                    res = 1000 * 60 * 60 * 24 * parseInt(val);
                } else if (val.includes('h')) {
                    res = 1000 * 60 * 60 * parseInt(val);
                } else if (val.includes('m')) {
                    res = 1000 * 60 * parseInt(val);
                } else if (val.includes('s')) {
                    res = 1000 * parseInt(val);
                }

                return acc + res
            }, 0 )
        }
    };

    Object.assign(Datetime, ParseTimeMixin);

    /**
     * A regular expression string matching digits
     */
    const digit = '\\d';
    /**
     * A regular expression string matching whitespace
     */

    const whitespace = '\\s\\uFEFF\\xA0';
    /**
     * A regular expression string matching diacritical mark
     */

    const diacriticalMark = '\\u0300-\\u036F\\u1AB0-\\u1AFF\\u1DC0-\\u1DFF\\u20D0-\\u20FF\\uFE20-\\uFE2F';
    /**
     * A regular expression to match the General Punctuation Unicode block
     */

    const generalPunctuationBlock = '\\u2000-\\u206F';
    /**
     * A regular expression to match non characters from from Basic Latin and Latin-1 Supplement Unicode blocks
     */

    const nonCharacter = '\\x00-\\x2F\\x3A-\\x40\\x5B-\\x60\\x7b-\\xBF\\xD7\\xF7';
    /**
     * A regular expression to match the dingbat Unicode block
     */

    const dingbatBlock = '\\u2700-\\u27BF';
    /**
     * A regular expression string that matches lower case letters: LATIN
     */

    const lowerCaseLetter = 'a-z\\xB5\\xDF-\\xF6\\xF8-\\xFF\\u0101\\u0103\\u0105\\u0107\\u0109\\u010B\\u010D\\u010F\\u0111\\u0113\\u0115\\u0117\\u0119\\u011B\\u011D\\u011F\\u0121\\u0123\\u0125\\u0127\\u0129\\u012B\\u012D\\u012F\\u0131\\u0133\\u0135\\u0137\\u0138\\u013A\\u013C\\u013E\\u0140\\u0142\\u0144\\u0146\\u0148\\u0149\\u014B\\u014D\\u014F\\u0151\\u0153\\u0155\\u0157\\u0159\\u015B\\u015D\\u015F\\u0161\\u0163\\u0165\\u0167\\u0169\\u016B\\u016D\\u016F\\u0171\\u0173\\u0175\\u0177\\u017A\\u017C\\u017E-\\u0180\\u0183\\u0185\\u0188\\u018C\\u018D\\u0192\\u0195\\u0199-\\u019B\\u019E\\u01A1\\u01A3\\u01A5\\u01A8\\u01AA\\u01AB\\u01AD\\u01B0\\u01B4\\u01B6\\u01B9\\u01BA\\u01BD-\\u01BF\\u01C6\\u01C9\\u01CC\\u01CE\\u01D0\\u01D2\\u01D4\\u01D6\\u01D8\\u01DA\\u01DC\\u01DD\\u01DF\\u01E1\\u01E3\\u01E5\\u01E7\\u01E9\\u01EB\\u01ED\\u01EF\\u01F0\\u01F3\\u01F5\\u01F9\\u01FB\\u01FD\\u01FF\\u0201\\u0203\\u0205\\u0207\\u0209\\u020B\\u020D\\u020F\\u0211\\u0213\\u0215\\u0217\\u0219\\u021B\\u021D\\u021F\\u0221\\u0223\\u0225\\u0227\\u0229\\u022B\\u022D\\u022F\\u0231\\u0233-\\u0239\\u023C\\u023F\\u0240\\u0242\\u0247\\u0249\\u024B\\u024D\\u024F';
    /**
     * A regular expression string that matches upper case letters: LATIN
     */

    const upperCaseLetter = '\\x41-\\x5a\\xc0-\\xd6\\xd8-\\xde\\u0100\\u0102\\u0104\\u0106\\u0108\\u010a\\u010c\\u010e\\u0110\\u0112\\u0114\\u0116\\u0118\\u011a\\u011c\\u011e\\u0120\\u0122\\u0124\\u0126\\u0128\\u012a\\u012c\\u012e\\u0130\\u0132\\u0134\\u0136\\u0139\\u013b\\u013d\\u013f\\u0141\\u0143\\u0145\\u0147\\u014a\\u014c\\u014e\\u0150\\u0152\\u0154\\u0156\\u0158\\u015a\\u015c\\u015e\\u0160\\u0162\\u0164\\u0166\\u0168\\u016a\\u016c\\u016e\\u0170\\u0172\\u0174\\u0176\\u0178\\u0179\\u017b\\u017d\\u0181\\u0182\\u0184\\u0186\\u0187\\u0189-\\u018b\\u018e-\\u0191\\u0193\\u0194\\u0196-\\u0198\\u019c\\u019d\\u019f\\u01a0\\u01a2\\u01a4\\u01a6\\u01a7\\u01a9\\u01ac\\u01ae\\u01af\\u01b1-\\u01b3\\u01b5\\u01b7\\u01b8\\u01bc\\u01c4\\u01c5\\u01c7\\u01c8\\u01ca\\u01cb\\u01cd\\u01cf\\u01d1\\u01d3\\u01d5\\u01d7\\u01d9\\u01db\\u01de\\u01e0\\u01e2\\u01e4\\u01e6\\u01e8\\u01ea\\u01ec\\u01ee\\u01f1\\u01f2\\u01f4\\u01f6-\\u01f8\\u01fa\\u01fc\\u01fe\\u0200\\u0202\\u0204\\u0206\\u0208\\u020a\\u020c\\u020e\\u0210\\u0212\\u0214\\u0216\\u0218\\u021a\\u021c\\u021e\\u0220\\u0222\\u0224\\u0226\\u0228\\u022a\\u022c\\u022e\\u0230\\u0232\\u023a\\u023b\\u023d\\u023e\\u0241\\u0243-\\u0246\\u0248\\u024a\\u024c\\u024e';

    /**
     * Regular expression to match whitespaces from the left side
     */

    const REGEXP_TRIM_LEFT = new RegExp('^[' + whitespace + ']+');
    /**
     * Regular expression to match whitespaces from the right side
     */

    const REGEXP_TRIM_RIGHT = new RegExp('[' + whitespace + ']+$');
    /**
     * Regular expression to match digit characters
     */

    const REGEXP_DIGIT = new RegExp('^' + digit + '+$');
    /**
     * Regular expression to match HTML special characters.
     */

    const REGEXP_HTML_SPECIAL_CHARACTERS = /[<>&"'`]/g;
    const REGEXP_TAGS = /(<([^>]+)>)/ig;
    /**
     * Regular expression to match Unicode words
     */

    const REGEXP_WORD = new RegExp('(?:[' + upperCaseLetter + '][' + diacriticalMark + ']*)?(?:[' + lowerCaseLetter + '][' + diacriticalMark + ']*)+|\
(?:[' + upperCaseLetter + '][' + diacriticalMark + ']*)+(?![' + lowerCaseLetter + '])|\
[' + digit + ']+|\
[' + dingbatBlock + ']|\
[^' + nonCharacter + generalPunctuationBlock + whitespace + ']+', 'g');
    /**
     * Regular expression to match words from Basic Latin and Latin-1 Supplement blocks
     */

    const REGEXP_LATIN_WORD = /[A-Z\xC0-\xD6\xD8-\xDE]?[a-z\xDF-\xF6\xF8-\xFF]+|[A-Z\xC0-\xD6\xD8-\xDE]+(?![a-z\xDF-\xF6\xF8-\xFF])|\d+/g;
    /**
     * Regular expression to match alpha characters
     */

    const REGEXP_ALPHA = new RegExp('^(?:[' + lowerCaseLetter + upperCaseLetter + '][' + diacriticalMark + ']*)+$');
    /**
     * Regular expression to match alpha and digit characters
     */

    const REGEXP_ALPHA_DIGIT = new RegExp('^((?:[' + lowerCaseLetter + upperCaseLetter + '][' + diacriticalMark + ']*)|[' + digit + '])+$');
    /**
     * Regular expression to match Extended ASCII characters, i.e. the first 255
     */

    const REGEXP_EXTENDED_ASCII = /^[\x01-\xFF]*$/;

    const toStr = function (val) {
      let def = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "";
      if (!val) return def;
      if (typeof val === "string") return val;
      if (Array.isArray(val)) return val.join("");
      return JSON.stringify(val);
    };

    const nvl$1 = (a, b) => {
      return typeof a === "undefined" || a === null ? b : a;
    };

    /*
    * Split string to words. You can set specified patter to split
    * */

    const words = (s, pattern, flags) => {
      let regexp;

      if (!pattern) {
        regexp = REGEXP_EXTENDED_ASCII.test(s) ? REGEXP_LATIN_WORD : REGEXP_WORD;
      } else if (pattern instanceof RegExp) {
        regexp = pattern;
      } else {
        regexp = new RegExp(pattern, nvl$1(flags, ''));
      }

      return nvl$1(toStr(s).match(regexp), []);
    };

    const capitalize = function (s) {
      let strong = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

      let _s = toStr(s);

      let last = _s.substr(1);

      return _s.substr(0, 1).toUpperCase() + (strong ? last.toLowerCase() : last);
    };

    const camelCase$1 = s => {
      return words(toStr(s)).map((el, i) => {
        return i === 0 ? el.toLowerCase() : capitalize(el);
      }).join("");
    };

    const dashedName$1 = s => words(toStr(s)).map(el => el.toLowerCase()).join("-");

    const decapitalize = s => {
      let _s = toStr(s);

      return _s.substr(0, 1).toLowerCase() + _s.substr(1);
    };

    const kebab = function (s) {
      let joinWith = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '-';
      return words(toStr(s)).map(el => el.toLowerCase()).join(joinWith);
    };

    const lower = s => toStr(s).toLowerCase();

    /*
    * Split string to chars array with ignores
    * */

    const chars$1 = function (s) {
      let ignore = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
      return toStr(s).split("").filter(el => !ignore.includes(el));
    };

    const reverse = (s, ignore) => chars$1(toStr(s), ignore).reverse().join("");

    const shuffleArray = function () {
      let a = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
      let _a = [...a];
      let i = _a.length,
          t,
          r;

      while (0 !== i) {
        r = Math.floor(Math.random() * i);
        i -= 1;
        t = _a[i];
        _a[i] = _a[r];
        _a[r] = t;
      }

      return _a;
    };

    const shuffle = s => shuffleArray(toStr(s).split("")).join("");

    const snake = s => words(toStr(s)).map(el => el.toLowerCase()).join("_");

    const _swap = (swapped, char) => {
      const lc = char.toLowerCase();
      const uc = char.toUpperCase();
      return swapped + (char === lc ? uc : lc);
    };

    const swap = s => toStr(s).split("").reduce(_swap, '');

    const title$1 = function (s, noSplit) {
      let sep = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "";

      let _s = toStr(s);

      const regexp = REGEXP_EXTENDED_ASCII.test(_s) ? REGEXP_LATIN_WORD : REGEXP_WORD;
      const noSplitArray = Array.isArray(noSplit) ? noSplit : typeof noSplit !== "string" ? [] : noSplit.split(sep);
      return s.replace(regexp, (w, i) => {
        const isNoSplit = i && noSplitArray.includes(_s[i - 1]);
        return isNoSplit ? lower(w) : capitalize(w);
      });
    };

    const upper = s => toStr(s).toUpperCase();

    /*
    * Get string length
    * */

    const count = s => toStr(s).length;

    const uniqueArray = function () {
      let a = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
      let _a = [...a];

      for (let i = 0; i < _a.length; ++i) {
        for (let j = i + 1; j < _a.length; ++j) {
          if (_a[i] === _a[j]) _a.splice(j--, 1);
        }
      }

      return _a;
    };

    const countChars = (s, ignore) => chars$1(s, ignore).length;
    const countUniqueChars = (s, ignore) => uniqueArray(chars$1(s, ignore)).length;

    const countSubstr = function (s) {
      let sub = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "";

      let _s = toStr(s);

      let _sub = toStr(sub);

      return _s === '' || _sub === '' ? 0 : _s.split(_sub).length - 1;
    };

    const countWords = (s, pattern, flags) => words(s, pattern, flags).length;
    const countUniqueWords = (s, pattern, flags) => uniqueArray(words(s, pattern, flags)).length;

    const escapeCharactersMap = {
      '<': '&lt;',
      '>': '&gt;',
      '&': '&amp;',
      '"': '&quot;',
      "'": '&#x27;',
      '`': '&#x60;'
    };

    function replaceSpecialCharacter(character) {
      return escapeCharactersMap[character];
    }

    const escapeHtml = s => toStr(s).replace(REGEXP_HTML_SPECIAL_CHARACTERS, replaceSpecialCharacter);

    const unescapeCharsMap = {
      '<': /(&lt;)|(&#x0*3c;)|(&#0*60;)/gi,
      '>': /(&gt;)|(&#x0*3e;)|(&#0*62;)/gi,
      '&': /(&amp;)|(&#x0*26;)|(&#0*38;)/gi,
      '"': /(&quot;)|(&#x0*22;)|(&#0*34;)/gi,
      "'": /(&#x0*27;)|(&#0*39;)/gi,
      '`': /(&#x0*60;)|(&#0*96;)/gi
    };
    const chars = Object.keys(unescapeCharsMap);

    function reduceUnescapedString(string, key) {
      return string.replace(unescapeCharsMap[key], key);
    }

    const unescapeHtml = s => chars.reduce(reduceUnescapedString, toStr(s));

    const unique = (s, ignore) => uniqueArray(chars$1(s, ignore)).join("");

    const uniqueWords = (s, pattern, flags) => uniqueArray(words(s, pattern, flags)).join("");

    /*
    * Get substring from string.
    * */

    const substr = (s, start, len) => toStr(s).substr(start, len);

    /*
    * Get N first chars from string.
    * */

    const first = function (s) {
      let len = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      return substr(toStr(s), 0, len);
    };

    /*
    * Get N last chars from string.
    * */

    const last = function (s) {
      let len = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

      let _s = toStr(s);

      return _s ? substr(_s, _s.length - len) : '';
    };

    const MAX_SAFE_INTEGER = 0x1fffffffffffff;
    const BYTE_ORDER_MARK = '\uFEFF';

    const clip = function (val, min) {
      let max = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : MAX_SAFE_INTEGER;
      if (val < min) return min;
      if (val > max) return max;
      return val;
    };

    const toInt = val => {
      if (val === Infinity) return MAX_SAFE_INTEGER;
      if (val === -Infinity) return -MAX_SAFE_INTEGER;
      return ~~val;
    };

    /*
    * Truncates `subject` to a new `length` with specified ending.
    * */

    const truncate = function (s) {
      let len = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      let end = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '...';

      let _s = toStr(s);

      let _len = !len ? _s.length : clip(toInt(len), 0, MAX_SAFE_INTEGER);

      return substr(_s, 0, _len) + (_s.length === _len ? '' : end);
    };

    /*
    * Slice string to N parts.
    * */

    const slice$1 = function (s) {
      let parts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;

      let _s = toStr(s);

      let res = [];
      let len = Math.round(_s.length / parts);

      for (let i = 0; i < parts; i++) {
        res.push(substr(_s, i * len, len));
      }

      return res;
    };

    /*
    * Truncates `subject` to a new `length` and does not break the words with specified ending.
    * */

    const prune = function (s) {
      let len = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      let end = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "";

      let _s = toStr(s);

      let _len = !len ? _s.length : clip(toInt(len), 0, MAX_SAFE_INTEGER);

      let _truncatedLen = 0;
      const pattern = REGEXP_EXTENDED_ASCII.test(_s) ? REGEXP_LATIN_WORD : REGEXP_WORD;

      _s.replace(pattern, (word, offset) => {
        const wordLength = offset + word.length;

        if (wordLength <= _len - end.length) {
          _truncatedLen = wordLength;
        }
      });

      return _s.substr(0, _truncatedLen) + end;
    };

    const repeat = function (s) {
      let times = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

      let _s = toStr(s);

      let _times = !times ? _s.length : clip(toInt(times), 0, MAX_SAFE_INTEGER);

      const _origin = _s;

      if (times === 0) {
        return "";
      }

      for (let i = 0; i < _times - 1; i++) {
        _s += _origin;
      }

      return _s;
    };

    const padBuilder = function (pad) {
      let len = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      const padLength = pad.length;
      const length = len - padLength;
      return repeat(pad, length + 1).substr(0, len);
    };

    const _pad = function (s) {
      let pad = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "";
      let len = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
      let left = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

      let _s = toStr(s);

      let _len = !len ? _s.length : clip(toInt(len), 0, MAX_SAFE_INTEGER);

      let _padLen = pad.length;

      let _paddingLen = _len - _s.length;

      let _sideLen = _paddingLen;

      if (_paddingLen <= 0 || _padLen === 0) {
        return _s;
      }

      let pads = padBuilder(pad, _sideLen);
      return left ? pads + _s : _s + pads;
    };

    const lpad = function (s) {
      let pad = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : ' ';
      let len = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
      return _pad(s, len, pad, true);
    };
    const rpad = function (s) {
      let pad = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : ' ';
      let len = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
      return _pad(s, len, pad, false);
    };
    const pad = function (s) {
      let pad = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
      let len = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

      let _s = toStr(s);

      let _len = !len ? _s.length : clip(toInt(len), 0, MAX_SAFE_INTEGER);

      let _padLen = pad.length;

      let _paddingLen = _len - _s.length;

      let _sideLen = toInt(_paddingLen / 2); //?


      let _remainingLen = _paddingLen % 2; //?


      if (_paddingLen <= 0 || _padLen === 0) {
        return _s;
      }

      return padBuilder(pad, _sideLen) + _s + padBuilder(pad, _sideLen + _remainingLen); //?
    };

    const insert = function (s) {
      let sbj = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
      let pos = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

      let _s = toStr(s);

      return _s.substr(0, pos) + sbj + _s.substr(pos);
    };

    const reduce = Array.prototype.reduce;
    const reduceRight = Array.prototype.reduceRight;
    const trim = (s, ws) => ltrim(rtrim(s, ws), ws);
    const ltrim = (s, ws) => {
      let _s = toStr(s);

      if (!ws) {
        return _s.replace(REGEXP_TRIM_LEFT, '');
      }

      if (ws === '' || _s === '') {
        return _s;
      }

      if (typeof ws !== "string") {
        ws = '';
      }

      let match = true;
      return reduce.call(_s, (trimmed, char) => {
        if (match && ws.includes(char)) {
          return trimmed;
        }

        match = false;
        return trimmed + char;
      }, '');
    };
    const rtrim = (s, ws) => {
      let _s = toStr(s);

      if (!ws) {
        return _s.replace(REGEXP_TRIM_RIGHT, '');
      }

      if (ws === '' || _s === '') {
        return _s;
      }

      if (typeof ws !== "string") {
        ws = '';
      }

      let match = true;
      return reduceRight.call(_s, (trimmed, char) => {
        if (match && ws.includes(char)) {
          return trimmed;
        }

        match = false;
        return char + trimmed;
      }, '');
    };

    const endsWith = (s, end, pos) => toStr(s).endsWith(end, pos);

    const isAlpha = s => REGEXP_ALPHA.test(toStr(s));

    const isAlphaDigit = s => REGEXP_ALPHA_DIGIT.test(toStr(s));

    const isDigit = s => REGEXP_DIGIT.test(toStr(s));

    const isBlank = function (s) {
      let strong = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
      return strong ? toStr(s).length === 0 : trim(s).length === 0;
    };

    const isEmpty = s => trim(s).length === 0;

    const isLower = s => lower(s) === s;

    const isUpper = s => upper(s) === s;

    const startWith = (s, start, pos) => toStr(s).startsWith(start, pos);

    const stripTagsAll = s => toStr(s).replace(REGEXP_TAGS, '');
    const stripTags = function (s) {
      let allowed = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

      let _s = toStr(s);

      let tags = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi;
      return _s.replace(tags, ($0, $1) => {
        return allowed.includes($1) ? $0 : '';
      });
    };

    /*
    * Original code
    * copyright (c) 2007-present by Alexandru Mărășteanu <hello@alexei.ro>
    * Source: https://github.com/alexei/sprintf.js
    * License: BSD-3-Clause License
    * */
    const re = {
      not_string: /[^s]/,
      not_bool: /[^t]/,
      not_type: /[^T]/,
      not_primitive: /[^v]/,
      number: /[diefg]/,
      numeric_arg: /[bcdiefguxX]/,
      json: /[j]/,
      not_json: /[^j]/,
      text: /^[^\x25]+/,
      modulo: /^\x25{2}/,
      placeholder: /^\x25(?:([1-9]\d*)\$|\(([^)]+)\))?(\+)?(0|'[^$])?(-)?(\d+)?(?:\.(\d+))?([b-gijostTuvxX])/,
      key: /^([a-z_][a-z_\d]*)/i,
      key_access: /^\.([a-z_][a-z_\d]*)/i,
      index_access: /^\[(\d+)\]/,
      sign: /^[+-]/
    };

    function sprintf_format(parse_tree, argv) {
      let cursor = 1,
          tree_length = parse_tree.length,
          arg,
          output = '',
          ph,
          pad,
          pad_character,
          pad_length,
          is_positive,
          sign;

      for (let i = 0; i < tree_length; i++) {
        if (typeof parse_tree[i] === 'string') {
          output += parse_tree[i];
        } else if (typeof parse_tree[i] === 'object') {
          ph = parse_tree[i]; // convenience purposes only

          if (ph.keys) {
            // keyword argument
            arg = argv[cursor];

            for (let k = 0; k < ph.keys.length; k++) {
              if (typeof arg === "undefined") {
                throw new Error(sprintf('[sprintf] Cannot access property "%s" of undefined value "%s"', ph.keys[k], ph.keys[k - 1]));
              }

              arg = arg[ph.keys[k]];
            }
          } else if (ph.param_no) {
            // positional argument (explicit)
            arg = argv[ph.param_no];
          } else {
            // positional argument (implicit)
            arg = argv[cursor++];
          }

          if (re.not_type.test(ph.type) && re.not_primitive.test(ph.type) && arg instanceof Function) {
            arg = arg();
          }

          if (re.numeric_arg.test(ph.type) && typeof arg !== 'number' && isNaN(arg)) {
            throw new TypeError(sprintf('[sprintf] expecting number but found %T'));
          }

          if (re.number.test(ph.type)) {
            is_positive = arg >= 0;
          }

          switch (ph.type) {
            case 'b':
              arg = parseInt(arg, 10).toString(2);
              break;

            case 'c':
              arg = String.fromCharCode(parseInt(arg, 10));
              break;

            case 'd':
            case 'i':
              arg = parseInt(arg, 10);
              break;

            case 'j':
              arg = JSON.stringify(arg, null, ph.width ? parseInt(ph.width) : 0);
              break;

            case 'e':
              arg = ph.precision ? parseFloat(arg).toExponential(ph.precision) : parseFloat(arg).toExponential();
              break;

            case 'f':
              arg = ph.precision ? parseFloat(arg).toFixed(ph.precision) : parseFloat(arg);
              break;

            case 'g':
              arg = ph.precision ? String(Number(arg.toPrecision(ph.precision))) : parseFloat(arg);
              break;

            case 'o':
              arg = (parseInt(arg, 10) >>> 0).toString(8);
              break;

            case 's':
              arg = String(arg);
              arg = ph.precision ? arg.substring(0, ph.precision) : arg;
              break;

            case 't':
              arg = String(!!arg);
              arg = ph.precision ? arg.substring(0, ph.precision) : arg;
              break;

            case 'T':
              arg = Object.prototype.toString.call(arg).slice(8, -1).toLowerCase();
              arg = ph.precision ? arg.substring(0, ph.precision) : arg;
              break;

            case 'u':
              arg = parseInt(arg, 10) >>> 0;
              break;

            case 'v':
              arg = arg.valueOf();
              arg = ph.precision ? arg.substring(0, ph.precision) : arg;
              break;

            case 'x':
              arg = (parseInt(arg, 10) >>> 0).toString(16);
              break;

            case 'X':
              arg = (parseInt(arg, 10) >>> 0).toString(16).toUpperCase();
              break;
          }

          if (re.json.test(ph.type)) {
            output += arg;
          } else {
            if (re.number.test(ph.type) && (!is_positive || ph.sign)) {
              sign = is_positive ? '+' : '-';
              arg = arg.toString().replace(re.sign, '');
            } else {
              sign = '';
            }

            pad_character = ph.pad_char ? ph.pad_char === '0' ? '0' : ph.pad_char.charAt(1) : ' ';
            pad_length = ph.width - (sign + arg).length;
            pad = ph.width ? pad_length > 0 ? pad_character.repeat(pad_length) : '' : '';
            output += ph.align ? sign + arg + pad : pad_character === '0' ? sign + pad + arg : pad + sign + arg;
          }
        }
      }

      return output;
    }

    const sprintf_cache = Object.create(null);

    function sprintf_parse(fmt) {
      if (sprintf_cache[fmt]) {
        return sprintf_cache[fmt];
      }

      let _fmt = fmt,
          match,
          parse_tree = [],
          arg_names = 0;

      while (_fmt) {
        if ((match = re.text.exec(_fmt)) !== null) {
          parse_tree.push(match[0]);
        } else if ((match = re.modulo.exec(_fmt)) !== null) {
          parse_tree.push('%');
        } else if ((match = re.placeholder.exec(_fmt)) !== null) {
          if (match[2]) {
            arg_names |= 1;
            let field_list = [],
                replacement_field = match[2],
                field_match = [];

            if ((field_match = re.key.exec(replacement_field)) !== null) {
              field_list.push(field_match[1]);

              while ((replacement_field = replacement_field.substring(field_match[0].length)) !== '') {
                if ((field_match = re.key_access.exec(replacement_field)) !== null) {
                  field_list.push(field_match[1]);
                } else if ((field_match = re.index_access.exec(replacement_field)) !== null) {
                  field_list.push(field_match[1]);
                } else {
                  throw new SyntaxError('[sprintf] failed to parse named argument key');
                }
              }
            } else {
              throw new SyntaxError('[sprintf] failed to parse named argument key');
            }

            match[2] = field_list;
          } else {
            arg_names |= 2;
          }

          if (arg_names === 3) {
            throw new Error('[sprintf] mixing positional and named placeholders is not (yet) supported');
          }

          parse_tree.push({
            placeholder: match[0],
            param_no: match[1],
            keys: match[2],
            sign: match[3],
            pad_char: match[4],
            align: match[5],
            width: match[6],
            precision: match[7],
            type: match[8]
          });
        } else {
          throw new SyntaxError('[sprintf] unexpected placeholder');
        }

        _fmt = _fmt.substring(match[0].length);
      }

      return sprintf_cache[fmt] = parse_tree;
    }

    const sprintf = key => sprintf_format(sprintf_parse(key), arguments);
    const vsprintf = (fmt, argv) => sprintf.apply(null, [fmt].concat(argv || []));

    const includes = (s, sub, pos) => toStr(s).includes(sub, pos);

    const split = function (str) {
      let sep = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
      let limit = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;
      let trim = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;
      return toStr(str).split(sep, limit).map(el => trim ? el.trim() : el).filter(el => trim ? !isEmpty(el) : true);
    };

    const strip = function (str) {
      let what = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      let replace = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "";

      let _str = toStr(str);

      let regexp;
      if (!what) return _str;
      regexp = new RegExp(what, "g");
      return _str.replace(regexp, replace);
    };

    const wrapTag = function (s) {
      let tag = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "div";
      return `<${tag}>${toStr(s)}</${tag}>`;
    };
    const wrap = function (s) {
      let before = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "";
      let after = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "";
      return before + toStr(s) + after;
    };

    const isString = s => typeof s === "string";

    const matches$1 = function (s, pattern) {
      let flags = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';

      let _s = toStr(s);

      let patternStr;

      if (!(pattern instanceof RegExp)) {
        patternStr = pattern ? trim(toStr(pattern)) : '';

        if (!patternStr) {
          return false;
        }

        pattern = new RegExp(patternStr, flags);
      }

      return pattern.test(_s);
    };

    const append = function (s) {
      let what = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
      let times = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;
      return toStr(s) + repeat(what, times);
    };

    const prepend = function (s) {
      let what = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
      let times = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;
      return repeat(what, times) + toStr(s);
    };

    const stripBoom = s => {
      let _s = toStr(s);

      if (_s === '') return _s;
      return _s[0] === BYTE_ORDER_MARK ? _s.substr(1) : _s;
    };

    const shorten = function (v) {
      let l = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 5;
      let d = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '...';
      return !v ? v : `${v.substring(0, l)}${d}${v.substring(v.length - l)}`;
    };

    var f = {
      camelCase: camelCase$1,
      capitalize,
      chars: chars$1,
      count,
      countChars,
      countUniqueChars,
      countSubstr,
      countWords,
      countUniqueWords,
      dashedName: dashedName$1,
      decapitalize,
      kebab,
      lower,
      reverse,
      shuffle,
      snake,
      swap,
      title: title$1,
      upper,
      words,
      wrap,
      wrapTag,
      escapeHtml,
      unescapeHtml,
      unique,
      uniqueWords,
      substr,
      first,
      last,
      truncate,
      slice: slice$1,
      prune,
      repeat,
      pad,
      lpad,
      rpad,
      insert,
      trim,
      ltrim,
      rtrim,
      endsWith,
      isAlpha,
      isAlphaDigit,
      isDigit,
      isBlank,
      isEmpty,
      isLower,
      isUpper,
      startWith,
      stripTags,
      stripTagsAll,
      sprintf,
      vsprintf,
      includes,
      split,
      strip,
      isString,
      matches: matches$1,
      append,
      prepend,
      stripBoom,
      shorten
    };

    class Str {
      constructor() {
        let v = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";
        let {
          mutable = true
        } = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        this.value = v.toString();
        this.mutable = mutable;
      }

      [Symbol.toPrimitive](hint) {
        if (hint === "number") {
          return +this.value;
        }

        return this.value;
      }

      get [Symbol.toStringTag]() {
        return "Str";
      }

      val(v) {
        if (typeof v === "undefined" || v === null) return this.value;
        this.value = v.toString();
        return this;
      }

      get length() {
        return this.value.length;
      }

      immutable() {
        let state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
        this.mutable = !state;
      }

      toString() {
        return this.value;
      }

      _result(v) {
        if (!this.mutable) {
          return str(v);
        }

        this.value = v;
        return this;
      }

      camelCase() {
        return this._result(f.camelCase(this.value));
      }

      capitalize(strong) {
        return this._result(f.capitalize(this.value, strong));
      }

      chars(ignore) {
        return this._result(f.chars(this.value, ignore));
      }

      count() {
        return f.count(this.value);
      }

      countChars(ignore) {
        return f.countChars(this.value, ignore);
      }

      countUniqueChars(ignore) {
        return f.countUniqueChars(this.value, ignore);
      }

      countSubstr(sub) {
        return f.countSubstr(this.value, sub);
      }

      countWords(pattern, flags) {
        return f.countChars(this.value, pattern, flags);
      }

      countUniqueWords(pattern, flags) {
        return f.countUniqueChars(this.value, pattern, flags);
      }

      dashedName() {
        return this._result(f.dashedName(this.value));
      }

      decapitalize() {
        return this._result(f.decapitalize(this.value));
      }

      endsWith(str, pos) {
        return f.endsWith(this.value, str, pos);
      }

      escapeHtml() {
        return this._result(f.escapeHtml(this.value));
      }

      first() {
        return this._result(f.first(this.value));
      }

      includes(sub, pos) {
        return f.includes(this.value, sub, pos);
      }

      insert(str, pos) {
        return this._result(f.insert(this.value, str, pos));
      }

      isAlpha() {
        return f.isAlpha(this.value);
      }

      isAlphaDigit() {
        return f.isAlphaDigit(this.value);
      }

      isBlank(strong) {
        return f.isBlank(this.value, strong);
      }

      isDigit() {
        return f.isDigit(this.value);
      }

      isEmpty() {
        return f.isEmpty(this.value);
      }

      isLower() {
        return f.isLower(this.value);
      }

      static isString(v) {
        return f.isString(v);
      }

      isUpper() {
        return f.isUpper(this.value);
      }

      kebab(joinWith) {
        return this._result(f.kebab(this.value, joinWith));
      }

      last(len) {
        return this._result(f.last(this.value, len));
      }

      lower() {
        return this._result(f.lower(this.value));
      }

      matches(pattern, flags) {
        return f.matches(this.value, pattern, flags);
      }

      pad(pad, len) {
        return this._result(f.pad(this.value, pad, len));
      }

      lpad(pad, len) {
        return this._result(f.lpad(this.value, pad, len));
      }

      rpad(pad, len) {
        return this._result(f.rpad(this.value, pad, len));
      }

      prune(len, end) {
        return this._result(f.prune(this.value, len, end));
      }

      repeat(times) {
        return this._result(f.repeat(this.value, times));
      }

      append(str, times) {
        return this._result(f.append(this.value, str, times));
      }

      prepend(str, times) {
        return this._result(f.prepend(this.value, str, times));
      }

      reverse(ignore) {
        return this._result(f.reverse(this.value, ignore));
      }

      shuffle() {
        return this._result(f.shuffle(this.value));
      }

      slice(parts) {
        return this._result(f.slice(this.value, parts));
      }

      snake() {
        return this._result(f.snake(this.value));
      }

      split(sep, limit, trim) {
        return this._result(f.split(this.value, sep, limit, trim));
      }

      sprintf() {
        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        return this._result(f.sprintf(this.value, ...args));
      }

      vsprintf() {
        for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
          args[_key2] = arguments[_key2];
        }

        return this._result(f.vsprintf(this.value, ...args));
      }

      startWith(str, pos) {
        return f.startWith(this.value, str, pos);
      }

      stripBoom() {
        return this._result(f.stripBoom(this.value));
      }

      stripTags(allowed) {
        return this._result(f.stripTags(this.value, allowed));
      }

      stripTagsAll() {
        return this._result(f.stripTagsAll(this.value));
      }

      strip(str, replace) {
        return this._result(f.strip(this.value, str, replace));
      }

      substr(start, len) {
        return this._result(f.substr(this.value, start, len));
      }

      swap() {
        return this._result(f.swap(this.value));
      }

      title(noSplit, sep) {
        return this._result(f.title(this.value, noSplit, sep));
      }

      trim(ws) {
        return this._result(f.trim(this.value, ws));
      }

      ltrim(ws) {
        return this._result(f.ltrim(this.value, ws));
      }

      rtrim(ws) {
        return this._result(f.rtrim(this.value, ws));
      }

      truncate(len, end) {
        return this._result(f.truncate(this.value, len, end));
      }

      unescapeHtml() {
        return this._result(f.unescapeHtml(this.value));
      }

      unique(ignore) {
        return this._result(f.unique(this.value, ignore));
      }

      uniqueWords(pattern, flags) {
        return this._result(f.uniqueWords(this.value, pattern, flags));
      }

      upper() {
        return this._result(f.upper(this.value));
      }

      words(pattern, flags) {
        return f.words(this.value, pattern, flags);
      }

      wrap(before, after) {
        return this._result(f.wrap(this.value, before, after));
      }

      wrapTag(tag) {
        return this._result(f.wrapTag(this.value, tag));
      }

      shorten(l, d) {
        return this._result(f.shorten(this.value, l, d));
      }

    }

    Object.assign(Str, f);

    const str = v => new Str(v);

    const isArrayLike = obj => obj && (Array.isArray(obj) || typeof obj.length === "number");

    const each = (ctx, cb) => {
        let index = 0;
        if (isArrayLike(ctx)) {
            [].forEach.call(ctx, function(val, key) {
                cb.apply(val, [key, val, index++]);
            });
        } else {
            for(let key in ctx) {
                if (ctx.hasOwnProperty(key))
                    cb.apply(ctx[key], [key, ctx[key], index++]);
            }
        }

        return ctx
    };

    const MAX_UID = 1_000_000;

    const uid = prefix => {
        do {
            prefix += Math.floor(Math.random() * MAX_UID);
        } while (document.getElementById(prefix))

        return prefix
    };

    const matches = Element.prototype.matches || Element.prototype["matchesSelector"] || Element.prototype["webkitMatchesSelector"] || Element.prototype["mozMatchesSelector"] || Element.prototype["msMatchesSelector"] || Element.prototype["oMatchesSelector"];

    const isLocalhost = host => {
        const hostname = host || globalThis.location.hostname;
        return (
            hostname === "localhost" ||
            hostname === "127.0.0.1" ||
            hostname === "[::1]" ||
            hostname === "" ||
            hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/) !== null
        )
    };

    const isTouchable = () => (('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (navigator["msMaxTouchPoints"] > 0));

    const exec = (fn, args, context) => {
        let func;

        if (typeof fn === "function") {
            func = fn;
        } else
        if (/^[a-z]+[\w.]*[\w]$/i.test(fn)) {
            const ns = fn.split(".");
            func = globalThis;

            for(let i = 0; i < ns.length; i++) {
                func = func[ns[i]];
            }
        } else {
            func = new Function("a", fn);
        }

        return func.apply(context, args)
    };

    const isPrivateAddress = (loc = globalThis.location.hostname) => /(^localhost)|(^127\.)|(^192\.168\.)|(^10\.)|(^172\.1[6-9]\.)|(^172\.2\d\.)|(^172\.3[0-1]\.)|(^::1$)|(^[fF][cCdD])/.test( loc );

    const isVisible = (elem) => !!( elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length );

    const isHidden = elem => {
        const s = getComputedStyle(elem);
        return !isVisible(elem) || +s['opacity'] === 0 || elem.hidden || s['visibility'] === "hidden";
    };

    const inViewport = el => {
        const rect = el.getBoundingClientRect();

        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        )
    };

    // Shoutout AngusCroll (https://goo.gl/pxwQGp)

    const toType = obj => ({}).toString.call(obj).match(/\s([a-z|A-Z]+)/)[1].toLowerCase();

    const queryCheck = s => document.createDocumentFragment().querySelector(s);

    const isSelector = selector => {
        try {
            queryCheck(selector);
            return true;
        } catch {
            return false
        }
    };

    const nvl = (val, ifNullValue) => (val === null || typeof val === 'undefined') ? ifNullValue : val;

    const iif = (cond, trueVal, falseVal) => cond ? trueVal : falseVal;

    const undef = val => {
        return typeof val === "undefined" || val === undefined || val === null;
    };

    function coalesce () {
        const args = [...arguments];
        for(let arg of args) {
            if (!undef(arg)) return arg
        }
        return null
    }

    const isPlainObject = obj => {
        let proto;
        if ( !obj || Object.prototype.toString.call( obj ) !== "[object Object]" ) {
            return false
        }
        proto = obj.prototype !== undefined;
        if ( !proto ) {
            return true
        }
        return proto.constructor && typeof proto.constructor === "function"
    };

    const str2array = (str, del = " ") => (""+str).split(del).map(s => (s.trim()));

    const Attr = {
        attr(name, val){
            const attributes = {};

            if (this.length === 0 && arguments.length === 0) {
                return undefined
            }

            if (this.length && arguments.length === 0) {
                each(this[0].attributes, function(){
                    attributes[this.nodeName] = this.nodeValue;
                });
                return attributes
            }

            if (arguments.length === 1) {
                return this.length && this[0].nodeType === 1 && this[0].hasAttribute(name) ? this[0].getAttribute(name) : undefined
            }

            return this.each(function(){
                const el = this;
                if (isPlainObject(name)) {
                    each(name, function(k, v){
                        el.setAttribute(k, v);
                    });
                } else {
                    val ? el.setAttribute(name, val) : el.removeAttribute(name);
                }
            })
        },

        hasAttr(name){
            return !!this.attr(name)
        },

        hasAttrs(names){
            let result = true;
            for(let name of names) {
                if (typeof this.attr(name) === 'undefined') {
                    return false
                }
            }
            return result
        },

        removeAttr: function(name){
            let attributes;

            if (undef(name)) {
                return this.each(function(){
                    const el = this;
                    each(el.attributes, function(){
                        el.removeAttribute(this);
                    });
                })
            }

            attributes = typeof name === "string" ? str2array(name, ",") : name;

            return this.each(function(){
                const el = this;
                each(attributes, function(){
                    if (el.hasAttribute(this)) el.removeAttribute(this);
                });
            })
        },

        toggleAttr: function(name, val){
            return this.each(function(){
                const el = this;

                if (undef(val)) {
                    el.removeAttribute(name);
                } else {
                    el.setAttribute(name, val);
                }
            })
        },

        id: function(val){
            return this.length ? val ? this[0].setAttribute("id", val) : this[0].getAttribute("id") : undefined
        }
    };

    const Class = {
        addClass(){},
        removeClass(){},
        toggleClass(){},
        containsClass(){},
        itemClass(){},

        hasClass(cls){
            let result = false;

            if (!cls || typeof cls !== "string") {
                return false
            }

            this.each((_, el) => {
                each(str2array(cls), (_, c) => {
                    if (!result && el.classList && el.classList.contains(c)) {
                        result = true;
                    }
                });
            });

            return result
        },

        clearClasses(){
            return this.each(function(){
                this.className = "";
            })
        },

        classes(index = 0, asArray = true){
            return this.length === 0 ? undefined : asArray ? str2array(this[index].className) : this[index].className
        },

        classesCount(index = 0){
            return this.length === 0 ? undefined : this[index].classList.length
        },

        removeClassBy(mask){
            return this.each((_, el) => {
                each(str2array(el.className), (_, c) => {
                    if (c.includes(mask)) {
                        el.classList.remove(c);
                    }
                });
            })
        }
    };

    const methods = ['add', 'remove', 'toggle', 'contains', 'item'];

    each(methods, (_, m) => {
        Class[`${m}Class`] = function(cls) {
            if (!cls.trim()) return this
            return this.each((_, el)=>{
                const hasClassList = typeof el.classList !== "undefined";
                each(str2array(cls),(_, c) => {
                    if (hasClassList) el.classList[m](c);
                });
            })
        };
    });

    const Contains = {
        index(sel, global = false){
            let el, _index = -1;

            if (this.length === 0) {
                return _index
            }

            if (undef(sel)) {
                el = this[0];
            } else if (isArrayLike(sel)) {
                el = sel[0];
            } else if (typeof sel === "string") {
                el = $(sel)[0];
            } else {
                el = undefined;
            }

            if (undef(el)) {
                return _index
            }

            if (global) {
                if (el && el.parentNode) each(el.parentNode.children, function(i){
                    if (this === el) {
                        _index = i;
                    }
                });
            } else {
                this.each(function(i){
                    if (this === el) {
                        _index = i;
                    }
                });
            }
            return _index
        },

        get(i){
            if (undef(i)) {
                return this
            }
            return i < 0 ? this[ i + this.length ] : this[ i ]
        },

        eq(i){
            return !undef(i) && this.length > 0 ? $(this.get(i), undefined,{prevObj: this}) : this
        },

        is(s){
            let result = false;

            if (this.length === 0) {
                return false
            }

            if (isArrayLike(s)) {
                this.each(function(){
                    const el = this;
                    each(s, function(){
                        const sel = this;
                        if (el === sel) {
                            result = true;
                        }
                    });
                });
            } else

            if (s === ":selected") {
                this.each(function(){
                    if (!result && this.selected) result = true;
                });
            } else

            if (s === ":checked") {
                this.each(function(){
                    if (!result && this.checked) result = true;
                });
            } else

            if (s === ":visible") {
                this.each(function(){
                    if (!result && isVisible(this)) result = true;
                });
            } else

            if (s === ":hidden") {
                this.each(function(){
                    const styles = getComputedStyle(this);
                    if (
                        this.getAttribute('type') === 'hidden'
                        || this.hidden
                        || styles['display'] === 'none'
                        || styles['visibility'] === 'hidden'
                        || parseInt(styles['opacity']) === 0
                    ) result = true;
                });
            } else

            if (typeof  s === "string") {
                this.each(function(){
                    if (matches.call(this, s)) {
                        result = true;
                    }
                });
            } else

            if (s.nodeType && s.nodeType === 1) {
                this.each(function(){
                    if  (this === s) {
                        result = true;
                    }
                });
            }

            return result
        },

        same(o){
            let result = true;
            const _o = $(o);

            if (this.length !== _o.length) return false

            for (let i = 0; i < _o.length; i++) {
                if (_o[i] !== this[i]) {
                    result = false;
                    break
                }
            }

            return result
        },

        last(){
            return this.eq(this.length - 1)
        },

        first(){
            return this.eq(0)
        },

        filter(fn){
            if (typeof fn === "string") {
                let sel = fn;
                fn = el => matches.call(el, sel);
            }

            return $([].filter.call(this, fn), undefined,{prevObj: this})
        },

        odd(s){
            let result = this.filter((_, i) => i % 2 === 0);

            if (s) {
                result = result.filter(el => matches.call(el, s));
            }

            return $(result, undefined, {prevObj: this})
        },

        even(s){
            let result = this.filter((_, i) => i % 2 !== 0);

            if (s) {
                result = result.filter((el) => matches.call(el, s));
            }

            return $(result, undefined,{prevObj: this})
        },

        find(s){
            let res = [], result;

            if (this.length === 0) {
                result = this; // maybe need return undefined ???
            } else {
                this.each(function () {
                    const el = this;
                    if (typeof el.querySelectorAll !== "undefined")
                        res = res.concat([].slice.call(el.querySelectorAll(s)));
                });
                result = $(res);
            }

            return $(result, undefined,{prevObj: this})
        },

        contains(s){
            return this.find(s).length > 0
        },

        children(s){
            let i, res = [];

            this.each(function(){
                const el = this;
                for(i = 0; i < el.children.length; i++) {
                    if (el.children[i].nodeType === 1)
                        res.push(el.children[i]);
                }
            });

            res = s ? res.filter(el => matches.call(el, s)) : res;

            return $(res, undefined,{prevObj: this})
        },

        parent(s){
            let res = [];
            if (this.length === 0) {
                return
            }

            this.each(function(){
                if (this.parentNode) {
                    if (!res.includes(this.parentNode))
                        res.push(this.parentNode);
                }
            });

            res = s ? res.filter(el => matches.call(el, s)) : res;

            return $(res, undefined,{prevObj: this})
        },

        parents(s){
            let res = [];

            if (this.length === 0) {
                return
            }

            this.each(function(){
                let par = this.parentNode;
                while (par) {
                    if (par.nodeType === 1 && !res.includes(par)) {
                        if (s) {
                            if (matches.call(par, s)) {
                                res.push(par);
                            }
                        } else {
                            res.push(par);
                        }
                    }
                    par = par.parentNode;
                }
            });

            return $(res, undefined,{prevObj: this})
        },

        siblings(s){
            let res = [];

            if (this.length === 0) {
                return
            }

            this.each(function(){
                const el = this;
                if (el.parentNode) {
                    each(el.parentNode.children, function(){
                        if (el !== this) res.push(this);
                    });
                }
            });

            if (s) {
                res = res.filter(el => matches.call(el, s));
            }

            return $(res, undefined,{prevObj: this})
        },

        _siblingAll(dir, s){
            let res = [];

            if (this.length === 0) {
                return
            }

            this.each(function(){
                let el = this;
                while (el) {
                    el = el[dir];
                    if (!el) break
                    res.push(el);
                }
            });

            if (s) {
                res = res.filter(el => matches.call(el, s));
            }

            return $(res, undefined,{prevObj: this})
        },

        _sibling(dir, s){
            let res = [];

            if (this.length === 0) {
                return
            }

            this.each(function(){
                const el = this[dir];
                if (el && el.nodeType === 1) {
                    res.push(el);
                }
            });

            if (s) {
                res = res.filter(el => matches.call(el, s));
            }

            return $(res, undefined,{prevObj: this})
        },

        prev(s){
            return this._sibling('previousElementSibling', s)
        },

        next(s){
            return this._sibling('nextElementSibling', s)
        },

        prevAll(s){
            return this._siblingAll('previousElementSibling', s)
        },

        nextAll(s){
            return this._siblingAll('nextElementSibling', s)
        },

        closest(s){
            const res = [];

            if (this.length === 0) {
                return
            }

            if (!s) {
                return this.parent(s)
            }

            this.each(function(){
                let el = this;
                while (el) {
                    if (!el) break
                    if (matches.call(el, s)) {
                        res.push(el);
                        return
                    }
                    el = el.parentElement;
                }
            });

            return $(res.reverse(), undefined,{prevObj: this})
        },

        has(s){
            const res = [];

            if (this.length === 0) {
                return
            }

            this.each(function(){
                const el = this;
                const child = $(el).children(s);
                if (child.length > 0) {
                    res.push(this);
                }
            });

            return $(res, undefined,{prevObj: this})
        },

        back(to_start = false){
            let ret;
            if (to_start) {
                ret = this.prevObj;
                while (ret) {
                    if (!ret.prevObj) break
                    ret = ret.prevObj;
                }
            } else {
                ret = this.prevObj ? this.prevObj : this;
            }
            return ret
        }
    };

    const Scroll = {
        scrollTop: function(val){
            if (undef(val)) {
                return this.length === 0 ? undefined : this[0] === window ? scrollY : this[0].scrollTop
            }

            return this.each(function(){
                this.scrollTop = val;
            })
        },

        scrollLeft: function(val){
            if (undef(val)) {
                return this.length === 0 ? undefined : this[0] === window ? scrollX : this[0].scrollLeft
            }

            return this.each(function(){
                this.scrollLeft = val;
            })
        }
    };

    const camelCase = str => str.replace(/-([a-z])/g, g => g[1].toUpperCase());

    const Css = {
        _setStyleProp(el, key, val){
            key = camelCase(key);

            if (["scrollLeft", "scrollTop"].includes(key)) {
                el[key] = (parseInt(val));
            } else {
                el.style[key] = isNaN(val) || ['opacity', 'zIndex'].includes(key) ? val : val + 'px';
            }
        },

        _getStyle(el, prop, pseudo){
            return ["scrollLeft", "scrollTop"].includes(prop) ? $(el)[prop]() : getComputedStyle(el, pseudo)[prop]
        },

        style: function(name, pseudo){
            let el;
            const that = this;

            if (typeof name === 'string' && this.length === 0) {
                return undefined
            }

            if (this.length === 0) {
                return this
            }

            el = this[0];

            if (undef(name) || name === "all") {
                return getComputedStyle(el, pseudo)
            } else {
                const result = {}, names = str2array(name, ",");

                if (names.length === 1)  {
                    return this._getStyle(el, names[0], pseudo)
                } else {
                    each(names, function () {
                        const prop = this;
                        result[prop] = that._getStyle(el, prop, pseudo);
                    });
                    return result
                }
            }
        },

        removeStyle: function(name){
            if (undef(name) || this.length === 0) return this

            const names = str2array(name);

            return this.each(function(){
                const el = this;
                each(names, function(){
                    el.style.removeProperty(this);
                });
            })
        },

        css: function(key, val){
            const that = this;

            key = key || 'all';

            if (typeof key === "string" && !val) {
                return  this.style(key)
            }

            return this.each(function(){
                const el = this;
                if (typeof key === "object") {
                    each(key, function(key, val){
                        that._setStyleProp(el, key, val);
                    });
                } else if (typeof key === "string") {
                    that._setStyleProp(el, key, val);
                }
            })
        }
    };

    const isEmptyObject = obj => {
        if (typeof obj !== "object" || obj === null) {
            return undefined;
        }
        for (let name in obj ) {
            if (obj.hasOwnProperty(name)) return false;
        }
        return true;
    };

    const normalizeEventName = name => typeof name !== "string" ? undefined : name.replace(/\-/g, "").toLowerCase();

    const overriddenStop =  Event.prototype.stopPropagation;
    const overriddenPrevent =  Event.prototype.preventDefault;

    Event.prototype.stopPropagation = function(){
        this.isPropagationStopped = true;
        overriddenStop.apply(this, arguments);
    };

    Event.prototype.preventDefault = function(){
        this.isPreventedDefault = true;
        overriddenPrevent.apply(this, arguments);
    };

    Event.prototype.stop = function(immediate){
        return immediate ? this.stopImmediatePropagation() : this.stopPropagation()
    };

    const DollarEvents = {
        events: [],
        eventHooks: {},
        eventUID: -1,

        ready(fn, op = false){
            return $(fn, op)
        },

        load(fn, op = false){
            return $(window).on("load", fn, op)
        },

        unload(fn, op = false){
            return $(window).on("unload", fn, op)
        },

        beforeunload(fn, op = false){
            if (typeof fn === "string") {
                return $(window).on("beforeunload", function(e){
                    e.returnValue = fn;
                    return fn
                }, op)
            } else {
                return $(window).on("beforeunload", fn, op)
            }
        },

        setEventHandler: function({element, event, handler, selector, ns, id, options} = args){
            let i, freeIndex = -1, eventObj, resultIndex;
            if (this.events.length > 0) {
                for(i = 0; i < this.events.length; i++) {
                    if (this.events[i].handler === null) {
                        freeIndex = i;
                        break
                    }
                }
            }

            eventObj = {
                element,
                event,
                handler,
                selector,
                ns,
                id,
                options
            };

            if (freeIndex === -1) {
                this.events.push(eventObj);
                resultIndex = this.events.length - 1;
            } else {
                this.events[freeIndex] = eventObj;
                resultIndex = freeIndex;
            }

            return resultIndex
        },

        getEventHandler: function(index){
            const events = this.events;
            let handler;

            if (undef(events[index])) {
                return undefined
            }

            handler = events[index].handler;
            events[index] = null;
            return handler
        },

        off: function(){
            this.each(this.events, function(){
                this.element.removeEventListener(this.event, this.handler, this.options);
            });
            this.events = [];
            return this
        },

        getEvents: function(){
            return this.events
        },

        getEventHooks: function(){
            return this.eventHooks
        },

        addEventHook: function(event, handler, type = "before"){
            this.each(str2array(event), function(){
                this.eventHooks[camelCase(type+"-"+this)] = handler;
            });
            return this
        },

        removeEventHook: function(event, type = "before"){
            this.each(str2array(event), (k, v) => {
                delete this.eventHooks[camelCase(type+"-"+v)];
            });
            return this
        },

        removeEventHooks: function(event, type = "before"){
            if (undef(event)) {
                this.eventHooks = {};
            } else {
                this.each(str2array(event), (k, v) => {
                    delete this.eventHooks[camelCase(type+"-"+v)];
                });
            }
            return this
        }
    };

    const Events = {
        load: function(fn, op){
            return (this.length === 0 || this[0]['self'] !== window) ? undefined : DollarEvents.load(fn, op)
        },

        unload: function(fn, op){
            return (this.length === 0 || this[0]['self'] !== window) ? undefined : DollarEvents.unload(fn, op)
        },

        beforeunload: function(fn, op){
            return (this.length === 0 || this[0]['self'] !== window) ? undefined : DollarEvents.beforeunload(fn, op)
        },

        ready: function(fn, op){
            if (this.length && this[0] === document && typeof fn === 'function') {
                return DollarEvents.ready(fn, op)
            }
        },

        on: function(eventsList, sel, handler, options){
            if (this.length === 0) {
                return 
            }

            if (typeof sel === 'function') {
                options = handler;
                handler = sel;
                sel = undefined;
            }

            if (!isPlainObject(options)) {
                options = {};
            }

            return this.each(function(){
                const el = this;
                each(str2array(eventsList), function(){
                    let h, index, originEvent;
                    const ev = this, event = ev.split("."), name = normalizeEventName(event[0]), ns = options.ns ? options.ns : event[1];

                    DollarEvents.eventUID++;

                    h = function(e){
                        let target = e.target;
                        const beforeHook = DollarEvents.eventHooks[camelCase("before-"+name)];
                        const afterHook = DollarEvents.eventHooks[camelCase("after-"+name)];

                        if (typeof beforeHook === "function") {
                            beforeHook.call(target, e);
                        }

                        if (!sel) {
                            handler.call(el, e);
                        } else {
                            while (target && target !== el) {
                                if (matches.call(target, sel)) {
                                    handler.call(target, e);
                                    if (e.isPropagationStopped) {
                                        e.stopImmediatePropagation();
                                        break
                                    }
                                }
                                target = target.parentNode;
                            }
                        }

                        if (typeof afterHook === "function") {
                            afterHook.call(target, e);
                        }

                        if (options.once) {
                            index = +$(el).data( "event-"+e.type+(sel ? ":"+sel:"")+(ns ? ":"+ns:"") );
                            if (!isNaN(index)) DollarEvents.events.splice(index, 1);
                        }
                    };

                    Object.defineProperty(h, "name", {
                        value: handler.name && handler.name !== "" ? handler.name : "func_event_"+name+"_"+DollarEvents.eventUID
                    });

                    originEvent = name+(sel ? ":"+sel:"")+(ns ? ":"+ns:"");

                    el.addEventListener(name, h, !isEmptyObject(options) ? options : false);

                    index = DollarEvents.setEventHandler({
                        el: el,
                        event: name,
                        handler: h,
                        selector: sel,
                        ns: ns,
                        id: DollarEvents.eventUID,
                        options: !isEmptyObject(options) ? options : false
                    });
                    $(el).data('event-'+originEvent, index);
                });
            })
        },

        one: function(events, sel, handler, options){
            if (!isPlainObject(options)) {
                options = {};
            }

            options.once = true;

            return this["on"].apply(this, [events, sel, handler, options])
        },

        off: function(eventsList, sel, options){

            if (isPlainObject(sel)) {
                options = sel;
                sel = null;
            }

            if (!isPlainObject(options)) {
                options = {};
            }

            if (!eventsList || eventsList.toLowerCase() === 'all') {
                return this.each(function(){
                    const el = this;
                    each(DollarEvents.events, function(){
                        const e = this;
                        if (e.element === el) {
                            el.removeEventListener(e.event, e.handler, e.options);
                            e.handler = null;
                            $(el).data("event-"+name+(e.selector ? ":"+e.selector:"")+(e.ns ? ":"+e.ns:""), null);
                        }
                    });
                })
            }

            return this.each(function(){
                const el = this;
                each(str2array(eventsList), function(){
                    const evMap = this.split("."),
                        name = normalizeEventName(evMap[0]),
                        ns = options.ns ? options.ns : evMap[1];
                    let originEvent, index;

                    originEvent = "event-"+name+(sel ? ":"+sel:"")+(ns ? ":"+ns:"");
                    index = +$(el).data(originEvent);

                    if (index !== undefined && DollarEvents.events[index].handler) {
                        el.removeEventListener(name, DollarEvents.events[index].handler, DollarEvents.events[index].options);
                        DollarEvents.events[index].handler = null;
                    }

                    $(el).data(originEvent, null);
                });
            })
        },

        trigger: function(name, data){
            return this.fire(name, data)
        },

        fire: function(name, data){
            const _name = normalizeEventName(name);

            if (this.length === 0) {
                return 
            }

            if (['focus', 'blur'].indexOf(_name) > -1) {
                this[0][_name]();
                return this
            }

            const e = new CustomEvent(_name, {
                bubbles: true,
                cancelable: true,
                detail: data
            });

            return this.each(function(){
                this.dispatchEvent(e);
            })
        },

        hover: function( fnOver, fnOut, options ) {
            return this.on("mouseenter", fnOver, options ).on("mouseleave", fnOut || fnOver, options )
        }
    };

    const eventMap = [
        "blur", "focus", "resize", "scroll",
        "click", "dblclick",
        "mousedown", "mouseup", "mousemove", "mouseenter", "mouseleave", "mouseover",
        "touchstart", "touchend", "touchmove", "touchcancel",
        "change", "select", "submit",
        "keyup", "keydown", "keypress",
        "contextmenu"
    ];

    eventMap.forEach(function( name ) {
        Events[ name ] = function( sel, fn, opt ) {
            return arguments.length > 0 ?
                this.on( name, sel, fn, opt ) :
                this.fire( name, opt.detail )
        };
    });

    class DataSet {
        constructor() {
            this._dataset = new Map();
        }

        set(element, key, data){
            if (!this._dataset.has(element)) {
                this._dataset.set(element, new Map());
            }

            const instanceMap = this._dataset.get(element);

            if (!instanceMap.has(key) && instanceMap.size !== 0) {
                console.error(`Query doesn't allow more than one instance per element. Bound instance: ${Array.from(instanceMap.keys())[0]}.`);
                return
            }

            instanceMap.set(key, data);
        }

        get(element, key, defaultValue = null){
            if (this._dataset.has(element)) {
                const elementData = this._dataset.get(element);
                return key ? elementData.get(key) || defaultValue : elementData
            }

            return null
        }

        remove(element, key){
            if (!this._dataset.has(element)) {
                return
            }

            const instanceMap = this._dataset.get(element);

            instanceMap.delete(key);

            if (instanceMap.size === 0) {
                this._dataset.delete(element);
            }
        }

        removeAll(element){
            if (!this._dataset.has(element)) {
                return
            }
            this._dataset.delete(element);
        }

        attr(elem, key, data){
            if (elem.nodeType !== 1 || !key) {
                return undefined
            }

            const attrName = "data-" + key.replace(/[A-Z]/g, "-$&").toLowerCase();

            if ( data ) {
                elem.setAttribute(attrName, JSON.stringify( data ));
            }

            return elem.getAttribute(attrName);
        }
    }

    const appendScript = (el, context = document.body) => {
        if (!context instanceof HTMLElement) {
            return
        }

        const elements = $(el);

        each(elements, (_, scr) => {
            if (scr.tagName && scr.tagName === "SCRIPT") {
                const s = document.createElement('script');
                s.type = 'text/javascript';
                if (scr.src) {
                    s.src = scr.src;
                } else {
                    s.textContent = scr.innerText;
                }
                context.appendChild(s);
                if (scr.parentNode)
                    scr.parentNode.removeChild(scr);
                return s
            }
        });
    };

    const Script$1 = {
        script(context){
            appendScript(this, context);
            return this
        }
    };

    const parseHTML = function (html) {
        const regexpSingleTag = /^<([a-z][^\/\0>:\x20\t\r\n\f]*)[\x20\t\r\n\f]*\/?>(?:<\/\1>|)$/i;
        let base, singleTag, result = [], doc;

        if (typeof html !== "string") {
            return []
        }

        doc = document.implementation.createHTMLDocument("");
        base = doc.createElement( "base" );
        base.href = document.location.href;
        doc.head.appendChild( base );

        singleTag = regexpSingleTag.exec(html);

        if (singleTag) {
            result.push(document.createElement(singleTag[1]));
        } else {
            doc.body.innerHTML = html;
            for(let i = 0; i < doc.body.childNodes.length; i++) {
                result.push(doc.body.childNodes[i]);
            }
        }

        return result
    };

    const args$1 = function() {
        let elements = [], _args = [...arguments];

        for (let arg of _args) {
            elements = [].concat(elements, normalizeElements(arg));
        }

        return elements
    };

    const normalizeElements = function(s){
        let result = undefined;

        if (typeof s === "string")
            result = isSelector(s) ? $(s) : parseHTML(s);
        else if (s.nodeType && s.nodeType === 1)
            result = [s];
        else if (isArrayLike(s))
            result = s;

        return result
    };

    const Manipulations = {
        appendText(text){
            return this.each((_, el) => el.innerHTML += text)
        },

        prependText(text){
            return this.each((_, el) => el.innerHTML = text + el.innerHTML);
        },

        append(){
            let elements = args$1(...arguments);

            return this.each( (index, el) => {
                each(elements, (_, ch) => {
                    if (el === ch) return
                    const child = index === 0 ? ch : ch.cloneNode(true);
                    if (child.tagName && child.tagName !== "SCRIPT") el.append(child);
                    appendScript(child);
                });
            })
        },

        appendTo(){
            let elements = args$1(...arguments);

            return this.each((index, el) => {
                each(elements, (parIndex, parent) => {
                    if (el === parent) return
                    $(parent).append(parIndex === 0 ? el : el.cloneNode(true));
                });
            })
        },

        prepend(){
            let elements = args$1(...arguments);

            return this.each( (elIndex, el) => {
                each(elements, (_, ch) => {
                    if (el === ch) return
                    const child = elIndex === 0 ? ch : ch.cloneNode(true);
                    if (child.tagName && child.tagName !== "SCRIPT") el.prepend(child);
                    appendScript(child);
                });
            })
        },

        prependTo(){
            let elements = args$1(...arguments);

            return this.each((index, el) => {
                each(elements, (parIndex, parent) => {
                    if (el === parent) return
                    $(parent).prepend(parIndex === 0 ? el : el.cloneNode(true));
                });
            })
        },

        insertBefore(){
            let elements = args$1(...arguments);

            console.log("elements", elements, ...arguments);

            return this.each((index, el) => {
                each(elements, (elIndex, ch) => {
                    if (el === ch) return
                    if (ch.parentNode) {
                        ch.parentNode.insertBefore(elIndex === 0 ? el : el.cloneNode(true), ch);
                    }
                });
            })
        },

        insertAfter(){
            let elements = args$1(...arguments);

            return this.each((index, el) => {
                each(elements, (elIndex, ch) => {
                    if (el === ch) return
                    if (ch.parentNode) {
                        ch.parentNode.insertBefore(elIndex === 0 ? el : el.cloneNode(true), ch.nextSibling);
                    }
                });
            })
        },

        after(html){
            return this.each(function(){
                const el = this;
                if (typeof html === "string") {
                    el.insertAdjacentHTML('afterend', html);
                } else {
                    $(html).insertAfter(el);
                }
            })
        },

        before(html){
            return this.each(function(){
                const el = this;
                if (typeof html === "string") {
                    el.insertAdjacentHTML('beforebegin', html);
                } else {
                    $(html).insertBefore(el);
                }
            })
        },

        clone(deep = false, withData = false){
            const res = [];
            this.each((_, el) => {
                const clone = $(el.cloneNode(deep));
                if (withData) {
                    const data = $.dataset.get(el);
                    each(data, function(k, v){
                        $.dataset.set(clone, k, v);
                    });
                }
                res.push(clone);
            });

            return $(res)
        },

        import(deep = false){
            const res = [];
            this.each((_, el) => res.push(document.importNode(el, deep)));
            return $(res)
        },

        adopt(){
            const res = [];
            this.each((_, el) => res.push(document.adoptNode(el)));
            return $(res)
        },

        remove(selector){
            let i = 0, node, out;
            const res = [];

            if (this.length === 0) {
                return this
            }

            out = selector ? this.filter((el) => $.matches.call(el, selector)) : this;

            for ( ; ( node = out[ i ] ) != null; i++ ) {
                if (node.parentNode) {
                    res.push(node.parentNode.removeChild(node));
                    $.dataset.removeAll(node);
                }
            }

            return $(res)
        },

        clear(){
            return this.each((_, el)=>el.innerHTML = '')
        },

        wrap(el){
            const wrapper = $(normalizeElements(el));
            const res = [];

            if (!this.length || !wrapper.length) {
                return
            }

            this.each((_, el) => {
                let _wrapper = wrapper.clone(true, true);
                _wrapper.insertBefore(el);
                let _target = _wrapper;
                while (_target.children().length) {
                    _target = _target.children().eq(0);
                }
                _target.append(el);
                res.push(_wrapper);
            });

            return $(res)
        },

        wrapAll( el ){
            const wrapper = $(normalizeElements(el));
            let _wrapper, _target;

            if (!this.length || !wrapper.length) {
                return
            }

            _wrapper = wrapper.clone(true, true);
            _wrapper.insertBefore(this[0]);

            _target = _wrapper;
            while (_target.children().length) {
                _target = _target.children().eq(0);
            }

            this.each(function(){
                _target.append(this);
            });

            return _wrapper;
        },

        wrapInner: function( el ){
            if (this.length === 0) {
                return ;
            }

            var wrapper = $(normalizeElements(el));

            if (!wrapper.length) {
                return ;
            }

            var res = [];

            this.each(function(){
                var elem = $(this);
                var html = elem.html();
                var wrp = wrapper.clone(true, true);
                elem.html(wrp.html(html));
                res.push(wrp);
            });

            return $(res);
        }
    };

    const Utils = {
        toArray: function(){
            return [...this]
        },
        age(){
            return this.timestamp
        },
        each(cb){
            return each(this, cb)
        },
    };

    const Visibility = {
        inViewport(){
            return this.length ? inViewport(this[0]) : undefined
        },

        isVisible(){
            return this.length ? isVisible(this[0]) : undefined
        },

        isHidden(){
            return this.length ? isHidden(this[0]) : undefined
        },

        hide(cb){
            return this.each((_, el) => {
                getComputedStyle(el, null)['display'];
                $(el).data('display-state', el.style.display);
                el.style.display = 'none';
                if (typeof cb === "function") {
                    cb.apply(el, [el]);
                }
            })
        },

        show(cb){
            return this.each((_, el) => {
                const display = $(el).data('display-state');
                console.log(display);
                el.style.display = display ? display === 'none' ? 'block' : display : '';
                if (parseInt(el.style.opacity) === 0) {
                    el.style.opacity = "1";
                }
                if (typeof cb === "function") {
                    cb.apply(el, [el]);
                }
            })
        },

        visible(mode = true, cb){
            return this.each((_, el) => {
                el.style.visibility = mode ? 'visible' : 'hidden';
                if (typeof cb === "function") {
                    cb.apply(el, [el]);
                }
            })
        },

        toggle(cb){
            return this.each((_, el) => {
                let func = "show";
                if ( getComputedStyle(el, null)['display'] !== 'none') {
                    func = 'hide';
                }
                $(el)[func](cb);
            })
        },

        hidden(mode = true, cb){
            if (typeof mode !== "boolean") {
                mode = false;
            }
            return this.each( (_, el) => {
                el.hidden = mode;
                if (typeof cb === "function") {
                    cb.apply(el, [el]);
                }
            })
        }
    };

    const Props = {
        _prop(prop, value = ''){
            if (arguments.length === 1) {
                return this.length === 0 ? undefined : this[0][prop]
            }

            return this.each((_, el) => {
                if (typeof el[prop] !== "undefined")
                    el[prop] = value;
            })
        },

        prop(prop, value){
            return arguments.length === 1 ?
                this._prop(prop) :
                this._prop(prop, typeof value === "undefined" ? "" : value)
        },

        val(value){
            if (undef(value)) {
                return !this.length ? undefined : this[0].value
            }

            return this.each((_, el) => {
                if (typeof el.value !== "undefined") {
                    el.value = value;
                } else {
                    el.innerHTML = value;
                }
            })
        },

        html(value){
            const that = this, v = [];
            if (arguments.length === 0) {
                return this._prop('innerHTML');
            }
            if (typeof value !== 'string' && isArrayLike(value)) {
                each(value, (_, el) => {
                    if (el instanceof HTMLElement)
                        v.push(this.outerHTML);
                });
            } else {
                v.push(value);
            }
            that._prop('innerHTML', v.join("\n"));
            return this
        },

        outerHTML(){
            return this._prop('outerHTML');
        },

        text(value){
            return arguments.length === 0 ?
                this._prop('textContent') :
                this._prop('textContent', typeof value === "undefined" ? "" : value);
        },

        innerText(value){
            return arguments.length === 0 ?
                this._prop('innerText') :
                this._prop('innerText', typeof value === "undefined" ? "" : value);
        },

        empty(){
            return this.each((_, el) => {
                if (typeof el.value !== "undefined") {
                    el.value = "";
                } else if (typeof el.innerHTML !== "undefined") {
                    el.innerHTML = "";
                }
            })
        },

        clear: function(){
            return this.empty()
        }
    };

    const Size = {
        _size: function(prop, val){
            if (this.length === 0) return

            if (undef(val)) {
                const el = this[0];
                if (prop === 'height') {
                    return el === window ? window.innerHeight : el === document ? el.body.clientHeight : parseInt(getComputedStyle(el).height)
                }
                if (prop === 'width') {
                    return el === window ? window.innerWidth : el === document ? el.body.clientWidth : parseInt(getComputedStyle(el).width)
                }
            }

            return this.each((_, el) => {
                if (el === window || el === document) {return }
                if (el.style.hasOwnProperty(prop)) {
                    el.style[prop] = isNaN(val) ? val : val + 'px';
                }
            })
        },

        height: function(val){
            return this._size('height', val)
        },

        width: function(val){
            return this._size('width', val)
        },

        _sizeOut: function(prop, val){
            if (this.length === 0) return

            if (!undef(val) && typeof val !== "boolean") {
                return this.each((_, el) => {
                    if (el === window || el === document) {return }
                    const style = getComputedStyle(el);
                    let h,
                        bs = prop === 'width' ? parseInt(style['border-left-width']) + parseInt(style['border-right-width']) : parseInt(style['border-top-width']) + parseInt(style['border-bottom-width']),
                        pa = prop === 'width' ? parseInt(style['padding-left']) + parseInt(style['padding-right']) : parseInt(style['padding-top']) + parseInt(style['padding-bottom']);

                    h = $(el)[prop](val)[prop]() - bs - pa;
                    el.style[prop] = h + 'px';
                })
            }

            const elem = this[0],
                  size = elem[prop === 'width' ? 'offsetWidth' : 'offsetHeight'],
                  style = getComputedStyle(elem),
                  result = size + parseInt(style[prop === 'width' ? 'margin-left' : 'margin-top']) + parseInt(style[prop === 'width' ? 'margin-right' : 'margin-bottom']);

            return val === true ? result : size
        },

        outerWidth: function(val){
            return this._sizeOut('width', val)
        },

        outerHeight: function(val){
            return this._sizeOut('height', val)
        },

        padding: function(pseudo){
            if (this.length === 0) return
            const style = getComputedStyle(this[0], pseudo);

            return {
                top: parseInt(style["padding-top"]),
                right: parseInt(style["padding-right"]),
                bottom: parseInt(style["padding-bottom"]),
                left: parseInt(style["padding-left"])
            }
        },

        margin: function(pseudo){
            if (this.length === 0) return
            const style = getComputedStyle(this[0], pseudo);

            return {
                top: parseInt(style["margin-top"]),
                right: parseInt(style["margin-right"]),
                bottom: parseInt(style["margin-bottom"]),
                left: parseInt(style["margin-left"])
            }
        },

        border: function(pseudo){
            if (this.length === 0) return
            const style = getComputedStyle(this[0], pseudo);

            return {
                top: parseInt(style["border-top-width"]),
                right: parseInt(style["border-right-width"]),
                bottom: parseInt(style["border-bottom-width"]),
                left: parseInt(style["border-left-width"])
            }
        }
    };

    const Initiator = {
        init(){
            if (!this.selector) {
                return
            }

            if (typeof this.selector === 'function') {
                document.addEventListener('DOMContentLoaded', this.selector, (this.context || false));
                return
            }

            if (this.selector === 'window' || (this.selector && this.selector.self === window)) {
                this[0] = window;
                this.length = 1;
                return
            }

            if (this.selector === 'doctype' || (this.selector && this.selector.nodeType && this.selector.nodeType === 10)) {
                this[0] = document.doctype;
                this.length = 1;
                return
            }

            if (this.selector === 'document' || (this.selector && this.selector.nodeType && this.selector.nodeType === 9)) {
                this[0] = document;
                this.length = 1;
                return
            }

            if (typeof this.selector === "object" && isArrayLike(this.selector)) {
                each(this.selector, (key, val) => {
                    this.push(val instanceof Query ? val[0] : val);
                });
                return
            }

            if (this.selector instanceof HTMLElement) {
                this.push(this.selector);
                return
            }

            if (typeof this.selector === 'string' && isSelector(this.selector)) {
                [].push.apply(this, document.querySelectorAll(this.selector));
                return
            }

            if (this.selector === "#" || this.selector === ".") {
                console.warn("Selector can't be # or .");
                return
            }

            if (typeof this.selector === "string") {

                const parsed = parseHTML(this.selector);
                const DOMSelector = parsed.length === 1 && parsed[0].nodeType === 3;

                if (DOMSelector) {
                    [].push.apply(this, document.querySelectorAll(this.selector));
                } else {
                    [].push.apply(this, parsed);
                }

                if (this.length > 0 && this.context) {
                    // Additional attributes for elements
                    if (typeof this.context === 'object' && isPlainObject(this.context)) {
                        each(this,(_, el) => {
                            for(let name in this.context) {
                                if (this.context.hasOwnProperty(name))
                                    el.setAttribute(name, this.context[name]);
                            }
                        });
                    } else {
                        // Insert elements into context
                        if (typeof this.context === "string") {
                            this.context = $(this.context);
                        }

                        let contextTargets = [];

                        if (this.context instanceof HTMLElement) {
                            contextTargets.push(this.context);
                        } else if (isArrayLike(this.context)) {
                            [].push.apply(contextTargets, this.context);
                        }

                        const result = [];
                        each(contextTargets, (_, ctx) => {
                            const clone = this.clone(true, true);
                            new Query(ctx).append(clone);
                            each(clone, (_, cl)=>{
                                result.push(cl);
                            });
                        });
                        this.length = 0
                        ;[].push.apply(this, result);
                    }
                }
            }
        }
    };

    const bool = val => {
        if (undef(val)) return false
        if (typeof val === "boolean") return val
        if (typeof val === 'number' && val !== 0) return val
        if (typeof val === 'number' && val === 0) return false
        if (['true', 'ok', 'yes'].includes((""+val).toLowerCase())) return true
        return false
    };

    const Position = {
        offset: function(){
            if (this.length === 0) return

            const el = this[0];
            return {
                top: el.offsetTop,
                left: el.offsetLeft,
                height: el.offsetHeight,
                width: el.offsetWidth,
                parent: el.offsetParent
            }
        },

        position: function(margin){
            let ml = 0, mt = 0, el, style;

            if (this.length === 0) return

            el = this[0];
            style = getComputedStyle(el);

            if (bool(margin)) {
                ml = parseInt(style['margin-left']);
                mt = parseInt(style['margin-top']);
            }

            return {
                left: el.offsetLeft - ml,
                top: el.offsetTop - mt
            }
        },

        left: function(val, margin){
            if (this.length === 0) return

            if (undef(val)) {
                return this.position(margin).left
            }

            if (typeof val === "boolean") {
                margin = val;
                return this.position(margin).left
            }

            return this.each(function(){
                $(this).css({
                    left: val
                });
            })
        },

        top: function(val, margin){
            if (this.length === 0) return

            if (undef(val)) {
                return this.position(margin).top
            }

            if (typeof val === "boolean") {
                margin = val;
                return this.position(margin).top
            }

            return this.each(function(){
                $(this).css({
                    top: val
                });
            })
        },

        coord: function(){
            return this.length === 0 ? undefined : this[0].getBoundingClientRect()
        },

        pos: function(){
            if (this.length === 0) return

            return {
                top: parseInt($(this[0]).style("top")),
                left: parseInt($(this[0]).style("left"))
            }
        }
    };

    const defaultOptions = {
        uid: 'uid',
        prevObj: null
    };

    class Query$1 extends Array {
        get [Symbol.toStringTag](){return "Query"}

        [Symbol.toPrimitive](hint){
            if (hint === "string") {
                const arr = [...this];
                return JSON.stringify(arr)
            }

            return this.value
        }

        constructor(selector, context, options) {
            super();

            this.options = Object.assign({}, defaultOptions, options);
            this.length = 0;
            this.uid = uid(this.options.uid);
            this.timestamp = + new Date();
            this.selector = typeof selector === "string" ? selector.trim() : selector;
            this.context = context;
            this.prevObj = this.options.prevObj;

            this.init();
        }
    }

    const query = (...rest) => new Query$1(...rest);
    const $$2 = query;

    Query$1.use = (...mixins) => Object.assign(Query$1.prototype, ...mixins);
    query.use = (...mixins) => Object.assign(query, ...mixins);

    Query$1.use(
        Initiator,
        Attr,
        Class,
        Contains,
        Css,
        Scroll,
        Events,
        Script$1,
        Manipulations,
        Utils,
        Visibility,
        Props,
        Size,
        Position
    );

    query.use({
        dataset: new DataSet(),
        matches: matches,
        html: $$2('html'),
        doctype: $$2("doctype"),
        head: $$2('head'),
        body: $$2('body'),
        document: $$2('document'),
        window: $$2('window'),
        meta: name => !name ? $$2("meta") : $$2("meta[name=$name]".replace("$name", name)),
        metaBy: name => !name ? $$2.meta : $$2("meta[$name]".replace("$name", name)),
        charset: val => {
            if (val) {
                const m = $$2('meta[charset]');
                if (m.length > 0) {
                    m.attr('charset', val);
                }
            }
            return document.characterSet
        },
        each: function(ctx, cb){ return each(ctx, cb) },
        bind: (fn, ctx) => typeof fn !== "function" ? undefined : fn.bind(ctx),
        proxy: (target, handler) => new Proxy(target, handler),
        device: (/android|wearos|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(navigator.userAgent.toLowerCase())),
        localhost: isLocalhost(),
        isLocalhost: isLocalhost,
        privateAddress: isPrivateAddress(),
        isPrivateAddress: isPrivateAddress,
        touchable: isTouchable(),
        script: appendScript,
        noop: () => {},
        noop_true: () => true,
        noop_false: () => false,
        exec: exec,
        dark: globalThis.matchMedia && globalThis.matchMedia('(prefers-color-scheme: dark)').matches,
        isVisible,
        isHidden,
        inViewport,
        type: toType,
        isSelector,
        undef,
        iif,
        nvl,
        coalesce
    });

    Query$1.use({
        data(key, val){
            let elem, data;

            if (this.length === 0) {
                return
            }

            elem = this[0];

            if (!arguments.length) {
                data = $$2.dataset.get(elem);
                if (!data) {
                    data = {};
                    for(let attr of [...elem.attributes]) {
                        const attrName = attr.name;
                        if (attrName.startsWith('data-')) {
                            ({
                                [attrName]: elem.getAttribute(attrName)
                            });
                            // data.push([attrName, elem.getAttribute(attrName)])
                            data[attrName] = elem.getAttribute(attrName);
                        }
                    }
                }
                return data
            }

            if (arguments.length === 1) {
                return $$2.dataset.get(elem, key) || $$2.dataset.attr(elem, key)
            }

            return this.each( function() {
                $$2.dataset.set( this, key, val );
            })
        },

        removeData( key ) {
            return this.each( function() {
                $$2.dataset.remove( this, key );
            })
        }
    });

    let _$ = globalThis.$;

    query.use({
        global(){
            _$ = globalThis.$;
            globalThis.$ = $$2;
        },
        noConflict(){
            if ( globalThis.$ === $$2 ) {
                globalThis.$ = _$;
            }
            return $$2
        }
    });

    const $$1 = query;

    function dashedName(str){
        return str.replace(/([A-Z])/g, function(u) { return "-" + u.toLowerCase(); });
    }

    function setClasses(src = []){
        return Array.isArray(src) ? src.join(" ") : src.toString()
    }

    const numProps = ['opacity', 'zIndex', "order", "zoom"];

    function setStyles(src = {}){
        return Object.keys( src ).map( key => {
            const propName = dashedName(key);
            let propVal = src[key];

            if (!numProps.includes(propName) && !isNaN(propVal)) {
                propVal += 'px';
            }

            return `${propName}: ${propVal}`
        } ).join(";")
    }

    const universalAttributes = [
        "accesskey",
        "contenteditable",
        "contextmenu",
        "dir",
        "id",
        "lang",
        "spellcheck",
        "tabindex",
        "title"
    ];

    class BaseElement {
        constructor(options = {}) {
            this.options = options;
            this.tag = "div";
        }

        selfAttributes(){
            return []
        }

        get attributes(){
            return this.getAttributes().join(" ")
        }

        getAttributes(){
            let attr = [],
                single = ['hidden', 'disabled', 'required', 'readonly', 'selected', 'open', 'multiply', 'default'],
                service = ["className", "style", "data", "tag", "events"];

            for(let key in this.options) {
                if (service.includes(key))
                    continue

                if ( single.includes(key) && this.options[key] === true ) {
                    attr.push(key);
                    continue
                }

                if ( (this.selfAttributes().includes(key) && !attr.includes(key)) || universalAttributes.includes(key) ) {
                    attr.push(`${key}="${this.options[key]}"`);
                }
            }

            if (this.classes) attr.push(`class="${this.classes}"`);
            if (this.styles) attr.push(`style="${this.styles}"`);
            if (this.dataSet) attr.push(this.dataSet);
            if (this.aria) attr.push(this.aria);

            return attr
        }

        draw(){
            return this.template()
        }

        get dataSet(){
            const {data = {}} = this.options;
            let _ = [];

            if (data === {}) return ""

            for(let key in data) {
                _.push(`data-${dashedName(key)}="${data[key]}"`);
            }

            return _.join(" ")
        }

        get aria(){
            const {aria = {}} = this.options;
            let _ = [];

            if (aria === {}) return ""

            for(let key in aria) {
                _.push(`aria-${key.toLowerCase()}="${aria[key]}"`);
            }

            return _.join(" ")
        }

        get events(){
            const {events = {}} = this.options;
            let eventsArray = [];

            if (events === {}) return ""

            for(let key in events) {
                eventsArray.push(`${key.toLowerCase()}="${events[key]}"`);
            }

            return eventsArray.join(" ")
        }

        get classes(){
            const {className = []} = this.options;
            return setClasses(className)
        }

        get styles(){
            const {style = {}} = this.options;
            return setStyles(style)
        }

        template(){
            return ``
        }
    }

    const parser = element => {
        if (Array.isArray(element)) {
            return element.map( parser ).join("")
        } else if (typeof element === 'string') {
            return element
        } else if (element.draw) {
            return element.draw()
        }
        throw new Error("Unknown element! " + element)
    };

    class Tag extends BaseElement {
        constructor(children = '', options = {}) {
            if (typeof children === 'object' && !Array.isArray(children) && !(children.draw)) {
                options = children;
                children = '';
            }
            super(options);
            this.children = children;
        }

        template(content){
            const tag = this.options.tag ? this.options.tag : this.tag;

            return `
            <${tag} ${this.attributes} ${this.events}>${content}</${tag}>
        `
        }

        draw(){
            let children = this.children, html;

            if (children == null) {
                children = '';
            }

            if (typeof children === "string") {
                html = children;
            } else if (children instanceof BaseElement) {
                html = children.draw();
            } else if (Array.isArray(children)) {
                html = children.map( parser ).join("");
            } else {
                html = '';
            }

            return this.template(html)
        }
    }

    class TagEmpty extends BaseElement {
        constructor(options = {}) {
            super(options);
            this.options = options;
        }

        template(){
            const tag = this.options.tag ? this.options.tag : this.tag;

            return `
            <${tag} ${this.attributes} ${this.events}/>
        `
        }
    }

    const render = (view = [], renderTo = document.body, options = {}) => {
        let html, renderPoint;


        const {clear = true, where = 'beforeend'} = options;

        renderPoint = typeof renderTo === "string" ? document.querySelector(renderTo) : renderTo;

        if (!renderPoint) {
            renderPoint = document.body;
        }

        if (clear) {
            renderPoint.innerHTML = "";
        }

        if (!Array.isArray(view)) {
            view = [view];
        }

        html = view.map( parser ).join("");
        renderPoint.insertAdjacentHTML(where, html);
    };

    class Router {
        version = "0.1.0"
        _routes = []
        _route = '/'
        _mode = null
        _ignore = '[data-route-ignore]'
        _404 = () => {}

        constructor(options = {}) {
            this.options = Object.assign({}, this.options, options);

            if (this.options.mode) this._mode = this.options.mode;
            if (this.options.ignore) this._ignore = this.options.ignore;
            if (this.options.routes) this.addRoutes(this.options.routes);
            if (this.options["404"] && typeof this.options["404"] === "function") this._404 = this.options["404"];
        }

        clearSlashes(path) {
            return path.replace(/\/$/, '').replace(/^\//, '')
        }

        index(path){
            let exists = -1;

            for(let i = 0; i < this._routes.length; i++) {
                if (this._routes[i].path === path) {
                    exists = i;
                    break
                }
            }

            return exists
        }

        routeExists(path){
            return this.index(path) !== -1
        }

        _routesFn(routes, fn){
            if (Array.isArray(routes) && routes.length) {
                routes.forEach( r => {
                    if (r.path)
                        this[fn](r.path, r.callback);
                } );
            } else if (typeof routes === "object") {
                for (let key in routes) {
                    if (routes.hasOwnProperty(key))
                        this[fn](key, routes[key]);
                }
            }

        }

        addRoute(path, callback){
            if (path && !this.routeExists(path)) {
                this._routes.push({
                    path: path,
                    callback: callback,
                    pattern: new RegExp('^' + (path).replace(/:\w+/g,'(\\w+)') + '$'),
                });
            }

            return this
        }

        addRoutes(routes){
            this._routesFn(routes, 'addRoute');
            return this
        }

        updRoute(path, route){
            const i = this.index(path);

            if (i === -1) return

            if (route && route.path) this._routes[i].path = route.path;
            if (route && route.callback) this._routes[i].callback = route.callback;

            return this
        }

        updRoutes(routes){
            this._routesFn(routes, 'updRoute');
            return this
        }

        delRoute(path){
            if (this.routeExists(path))
                delete this._routes[path];

            return this
        }

        findRoute(path){
            let result;

            for (let i = 0; i < this._routes.length; i++) {
                if (path.match(this._routes[i].pattern)) {
                    result = this._routes[i];
                    break
                }
            }

            return result
        }

        exec(loc = document.location, pushState = false){
            let url, path, route;

            url = new URL(loc);
            path = url.pathname;
            route = this.findRoute(path);

            if (!route) {
                this._404();
                return this
            }

            if (pushState)
                history.pushState(null, null, path);

            if (route && typeof route.callback === "function") {
                route.callback.apply(this, [path]);
            }

            this.route = path;

            return this
        }

        listen(){
            const {ignore} = this.options;

            window.addEventListener('click', (e) => {
                const target = e.target;
                let href;

                if (target.tagName.toLowerCase() !== "a" || target.matches(ignore)) return

                e.preventDefault();

                href = target.href;

                if (href) this.exec(href, true);
            }, false);

            window.addEventListener("popstate", (e) => {
                this.exec(document.location);
            }, false);

            return this
        }
    }

    const router = routes => new Router(routes);

    const createStyleElement = (content = '', media) => {
        let style = document.createElement("style");

        if (media !== undefined) {
            style.setAttribute("media", media);
        }

        style.appendChild(document.createTextNode(content));
        document.head.appendChild(style);

        return style
    };

    const createStyleSheet = (media) => {
        return createStyleElement(media).sheet
    };

    const addCssRule = (sheet, selector, rules) => {
        sheet.insertRule(selector + "{" + rules + "}");
    };

    const addStyle = (style, media) => {
        if (typeof style === "string") {
            createStyleElement(style, media);
            return
        }

        const sheet = createStyleSheet(media);
        for(let key in style) {
            addCssRule(sheet, key, setStyles(style[key]));
        }
    };

    const cssLoader = async (path, options) => {
        let response = await fetch(path, options), textNode, tag;

        if (!response.ok) {
            throw new Error("HTTP error: " + response.status)
        }

        textNode = await response.text();
        tag = document.createElement("style");
        tag.appendChild(document.createTextNode(textNode));
        document.body.appendChild(tag);
    };

    const jsLoader = async (path, options) => {
        let response = await fetch(path, options), textNode, tag;

        if (!response.ok) {
            throw new Error("HTTP error: " + response.status)
        }

        textNode = await response.text();
        tag = document.createElement("script");
        tag.appendChild(document.createTextNode(textNode));
        document.body.appendChild(tag);
    };

    const viewLoader = async (path, options = {}, storage = false) => {
        let response, textNode, result = () => {}, storageKey;

        if (storage !== false) {
            storageKey = `htmljs::key::${path}`;
            textNode = localStorage.getItem(storageKey);
        }

        if (!textNode) {

            response = await fetch(path, options);

            if (!response.ok) {
                throw new Error("HTTP error: " + response.status)
            }

            textNode = await response.text();

            if (storage !== false) {
                localStorage.setItem(storageKey, textNode);
            }
        }

        const eval2 = eval;

        eval2(`result = ${textNode}`);

        return typeof result === "function" ? result() : result
    };

    const clearViewStorageHolder = path => localStorage.removeItem(`htmljs::key::${path}`);

    class Span extends Tag {
        tag = 'span'
    }

    const span = (children = '', options = {}) => new Span(children, options);

    class Img extends TagEmpty {
        tag = 'img'

        selfAttributes() {
            return ["align", "alt", "border", "height", "hspace", "ismap", "longdesc", "lowsrc", "src", "vspace", "width", "usemap"]
        }
    }

    const img = (options = {}) => new Img(options);
    const img2 = (src = '', alt = '', options = {}) => img({...options, src, alt});

    class Input extends TagEmpty {
        tag = "input"

        selfAttributes() {
            return [
                "accept", "align", "alt", "autocomplete", "autofocus", "border", "checked", "disabled", "form", "formaction",
                "formenctype", "formmethod", "formnovalidate", "formtarget", "list", "max", "maxlength", "min", "multiple",
                "name", "pattern", "placeholder", "size", "src", "step", "type", "value"
            ]
        }
    }

    const input = (options = {}) => new Input(options);
    const input2 = (value = '', options = {}) => new Input({...options, value});

    class Br extends TagEmpty {
        tag = 'br'

        selfAttributes() {
            return ["clear"]
        }
    }

    const br = options => new Br(options);

    class Hr extends TagEmpty {
        tag = 'hr'
    }

    const hr = options => new Hr(options);

    class Heading extends Tag {
        constructor(tag = 'h1', children = '', options = {}) {
            super(children, options);
            this.tag = tag;
        }
    }

    const heading = (tag = 'h1', children = '', options = {}) => new Heading(tag, children, options);
    const h1 = (children = '', options = {}) => heading('h1', children, options);
    const h2 = (children = '', options = {}) => heading('h2', children, options);
    const h3 = (children = '', options = {}) => heading('h3', children, options);
    const h4 = (children = '', options = {}) => heading('h4', children, options);
    const h5 = (children = '', options = {}) => heading('h5', children, options);
    const h6 = (children = '', options = {}) => heading('h6', children, options);

    class Section extends Tag {
        tag = 'section'
    }

    const section = (children = '', options = {}) => new Section(children, options);

    class Anchor extends Tag {
        tag = 'a'

        selfAttributes() {
            return ["coords", "download", "hreflang", "name", "rel", "rev", "shape", "target", "type", "href"]
        }
    }

    const anchor = (children = '', options = {}) => new Anchor(children, options);
    const a = (href = '#', children = '', options = {}) => new Anchor(children, {...options, href});

    class Abbr extends Tag {
        tag = "abbr"
    }

    const abbr = (children = '', options = {}) => new Abbr(children, options);

    class Article extends Tag {
        tag = 'article'
    }

    const article = (children = '', options = {}) => new Article(children, options);

    class Nav extends Tag {
        tag = 'nav'
    }

    const nav = (children = '', options = {}) => new Nav(children, options);

    class Aside extends Tag {
        tag = 'aside'
    }

    const aside = (children = '', options = {}) => new Aside(children, options);

    class Header extends Tag {
        tag = 'header'
    }

    const header = (children = '', options = {}) => new Header(children, options);

    class Footer extends Tag {
        tag = 'footer'
    }

    const footer = (children = '', options = {}) => new Footer(children, options);

    class Address extends Tag {
        tag = 'address'
    }

    const address = (children = '', options = {}) => new Address(children, options);

    class Map$1 extends Tag {
        tag = 'map'

        selfAttributes() {
            return ["name"]
        }
    }

    const map = (children = '', options = {}) => new Map$1(children, options);

    class Area extends TagEmpty {
        tag = 'area'

        selfAttributes() {
            return ["alt", "coords", "hreflang", "nohref", "shape", "target", "type", "href"]
        }
    }

    const area = (options = {}) => new Area(options);
    const area2 = (href = '#', options = {}) => area({...options, href});

    class AudioTag extends Tag {
        tag = 'audio'

        selfAttributes() {
            return ["autoplay", "controls", "loop", "preload", "src"]
        }
    }

    const audio = (children = '', options = {}) => new AudioTag(children, options);
    const audio2 = (src = '', children = '', options = {}) => new AudioTag(children, {...options, src});

    class Bold extends Tag {
        tag = 'b'
    }

    const bold = (children = '', options = {}) => new Bold(children, options);

    class Bdi extends Tag {
        tag = 'bdi'
    }

    const bdi = (children = '', options = {}) => new Bdi(children, options);

    class Bdo extends Tag {
        tag = 'bdo'
    }

    const bdo = (children = '', options = {}) => new Bdo(children, options);

    class Blockquote extends Tag {
        tag = 'blockquote'

        selfAttributes() {
            return ["cite"];
        }
    }

    const blockquote = (children = '', options = {}) => new Blockquote(children, options);

    class Button extends Tag {
        tag = 'button'

        selfAttributes() {
            return ["autofocus", "form", "formaction", "formenctype", "formmethod", "formnovalidate", "formtarget", "name", "type", "value"]
        }
    }

    const button = (children = '', options = {}) => new Button(children, options);

    class Canvas extends Tag {
        tag = 'canvas'

        selfAttributes() {
            return ["width", "height"]
        }
    }

    const canvas = (children = '', options = {}) => new Canvas(children, options);

    class Table extends Tag {
        tag = 'table'

        selfAttributes() {
            return [
                "align", "background", "bgcolor", "border", "bordercolor", "cellpadding",
                "cellspacing", "cols", "frame", "height", "rules", "summary", "width"
            ]
        }
    }

    const table = (children = '', options = {}) => new Table(children, options);

    class Caption extends Tag {
        tag = 'caption'

        selfAttributes() {
            return ["align", "valign"]
        }
    }

    const caption = (children = '', options = {}) => new Caption(children, options);

    class Col extends TagEmpty {
        tag = 'col'

        selfAttributes() {
            return ["align", "valign", "char", "charoff", "span", "width"]
        }
    }

    const col = options => new Col(options);

    class Colgroup extends TagEmpty {
        tag = 'colgroup'

        selfAttributes() {
            return ["align", "valign", "char", "charoff", "span", "width"]
        }
    }

    const colgroup = options => new Colgroup(options);

    class TableSection extends Tag {
        constructor(tag = 'tbody', children = '', options = {}) {
            super(children, options);
            this.tag = tag;
        }

        selfAttributes() {
            return ["align", "valign", "char", "charoff", "bgcolor"]
        }
    }

    const tbody = (children = '', options = {}) => new TableSection('tbody', children, options);
    const thead = (children = '', options = {}) => new TableSection('thead', children, options);
    const tfoot = (children = '', options = {}) => new TableSection('tfoot', children, options);

    class TableRow extends Tag {
        tag = "tr"

        selfAttributes() {
            return ["align", "bgcolor", "bordercolor", "char", "charoff", "valign"]
        }
    }

    const tr = (children = '', options = {}) => new TableRow(children, options);

    class TableCell extends Tag {
        constructor(tag = 'td', children = '', options = {}) {
            super(children, options);
            this.tag = tag;
        }

        selfAttributes() {
            return ["abbr", "align", "axis", "background", "bgcolor", "bordercolor", "char", "charoff", "colspan", "headers", "height", "nowrap", "rowspan", "scope", "valign", "width"]
        }
    }

    const th = (children = '', options = {}) => new TableCell('th', children, options);
    const td = (children = '', options = {}) => new TableCell('td', children, options);

    class Cite extends Tag {
        tag = 'cite'
    }

    const cite = (children = '', options = {}) => new Cite(children, options);

    class Code extends Tag {
        tag = 'code'
    }

    const code = (children = '', options = {}) => new Code(children, options);

    class Dl extends Tag {
        tag = 'dl'
    }

    class Dt extends Tag {
        tag = 'dt'
    }

    class Dd extends Tag {
        tag = 'dd'
    }

    const dl = (children = '', options = {}) => new Dl(children, options);
    const dt = (children = '', options = {}) => new Dt(children, options);
    const dd = (children = '', options = {}) => new Dd(children, options);

    class Details extends Tag {
        tag = 'details'
    }

    const details = (children = '', options = {}) => new Details(children, options);

    class Summary extends Tag {
        tag = 'summary'
    }

    const summary = (children = '', options = {}) => new Summary(children, options);

    class Dfn extends Tag {
        tag = 'dfn'
    }

    const dfn = (children = '', options = {}) => new Dfn(children, options);

    class Div extends Tag {
        tag = 'div'

        selfAttributes() {
            return ["align", "title"]
        }
    }

    const div = (children = '', options = {}) => new Div(children, options);

    class Em extends Tag {
        tag = 'em'
    }

    const em = (children = '', options = {}) => new Em(children, options);

    class Ital extends Tag {
        tag = 'i'
    }

    const ital = (children = '', options = {}) => new Ital(children, options);
    const i = (children = '', options = {}) => new Ital(children, options);

    class Strong extends Tag {
        tag = 'strong'
    }

    const strong = (children = '', options = {}) => new Strong(children, options);

    class Embed extends Tag {
        tag = 'embed'

        selfAttributes() {
            return ["align", "height", "hspace", "pluginspace", "src", "type", "vspace", "width"]
        }
    }

    const embed = (children = '', options = {}) => new Embed(children, options);

    class NoEmbed extends Tag {
        tag = 'noembed'
    }

    const noembed = (children = '', options = {}) => new NoEmbed(children, options);

    class Fieldset extends Tag {
        tag = 'fieldset'

        selfAttributes() {
            return ["form", "title"]
        }
    }

    const fieldset = (children = '', options = {}) => new Fieldset(children, options);

    class Legend extends Tag {
        tag = 'legend'

        selfAttributes() {
            return ["align", "title"]
        }
    }

    const legend = (children = '', options = {}) => new Legend(children, options);

    class Figure extends Tag {
        tag = 'figure'
    }

    const figure = (children = '', options = {}) => new Figure(children, options);

    class FigCaption extends Tag {
        tag = 'figcaption'
    }

    const figcaption = (children = '', options = {}) => new FigCaption(children, options);

    class Form extends Tag {
        tag = 'form'

        selfAttributes() {
            return ["accept-charset", "action", "autocomplete", "enctype", "method", "name", "novalidate", "target"]
        }
    }

    const form = (children = '', options = {}) => new Form(children, options);

    class Frameset extends Tag {
        tag = 'frameset'

        selfAttributes() {
            return ["border", "bordercolor", "cols", "frameborder", "framespacing", "rows"]
        }
    }

    const frameset = (children = '', options = {}) => new Frameset(children, options);

    class Frame extends TagEmpty {
        tag = 'frame'

        selfAttributes() {
            return ["bordercolor", "frameborder", "noresize", "name", "src", "scrolling"]
        }
    }

    const frame = (options = {}) => new Frame(options);
    const frame2 = (src = '', name = '', options = {}) => new Frame({...options, src, name});

    class NoFrames extends Tag {
        tag = 'noframes'
    }

    const noframes = (children = '', options = {}) => new NoFrames(children, options);

    class IFrame extends Tag {
        tag = 'iframe'

        selfAttributes() {
            return ["align", "allowtransparency", "frameborder", "height", "hspace", "marginheight", "marginwidth", "name", "sandbox", "scrolling", "seamless", "src", "srcdoc", "vspace", "width"]
        }
    }

    const iframe = (children = '', options = {}) => new IFrame(children, options);
    const iframe2 = (src = '', name = '', children = '', options = {}) => new IFrame(children, {...options, src, name});

    class Ins extends Tag {
        tag = 'ins'

        selfAttributes() {
            return ["cite", "datetime"]
        }
    }

    const ins = (children = '', options = {}) => new Ins(children, options);

    class Kbd extends Tag {
        tag = 'kbd'
    }

    const kbd = (children = '', options = {}) => new Kbd(children, options);

    class Label extends Tag {
        tag = 'label'

        selfAttributes() {
            return ["for"]
        }
    }

    const label = (children = '', options = {}) => new Label(children, options);
    const label2 = (_for = '', children = '', options = {}) => label(children, {...options, "for": _for});

    class List extends Tag {
        constructor(tag = 'ul', children = '', options = {}) {
            super(children, options);
            this.tag = tag;
        }

        selfAttributes() {
            return this.tag === 'ul'
                ? ["type"]
                : ["type", "reserved", "start"]
        }
    }

    class ListItem extends Tag {
        tag = "li"

        selfAttributes() {
            return ["type", "value"]
        }
    }

    const ul = (children = '', options = {}) => new List('ul', children, options);
    const ol = (children = '', options = {}) => new List('ol', children, options);
    const li = (children = '', options = {}) => new ListItem(children, options);

    class Mark extends Tag {
        tag = 'mark'
    }

    const mark$1 = (children = '', options = {}) => new Mark(children, options);

    class NoScript extends Tag {
        tag = 'noscript'
    }

    const noscript = (children = '', options = {}) => new NoScript(children, options);

    class Select extends Tag {
        tag = 'select'

        selfAttributes() {
            return ["autofocus", "form", "name", "size"]
        }
    }

    const select = (children = '', options = {}) => new Select(children, options);

    class OptionGroup extends Tag {
        tag = 'optgroup'

        selfAttributes() {
            return ["label"]
        }
    }

    const optgroup = (children = '', options = {}) => new OptionGroup(children, options);

    class Option extends Tag {
        tag = 'option'

        selfAttributes() {
            return ["label", "value"]
        }
    }

    const option = (value = '', children = '', options = {}) => new Option(value, children, options);

    class Output extends Tag {
        tag = 'output'

        selfAttributes() {
            return ["for", "form", "name"]
        }
    }

    const output = (children = '', options = {}) => new Output(children, options);

    class Paragraph extends Tag {
        tag = 'p'

        selfAttributes() {
            return ["align"]
        }
    }

    const paragraph = (children = '', options = {}) => new Paragraph(children, options);
    const p = (children = '', options = {}) => new Paragraph(children, options);

    class Pre extends Tag {
        tag = 'pre'
    }

    const pre = (children = '', options = {}) => new Pre(children, options);

    class Quoted extends Tag {
        tag = 'q'

        selfAttributes() {
            return ["cite"]
        }
    }

    const q = (children = '', options = {}) => new Quoted(children, options);

    class Strike extends Tag {
        tag = 'strike'
    }

    const strike = (children = '', options = {}) => new Strike(children, options);
    const s = (children = '', options = {}) => new Strike(children, options);

    class Script extends Tag {
        tag = 'script'

        selfAttributes() {
            return ["async", "defer", "language", "src", "type"]
        }
    }

    const script = (children = '', options = {}) => new Script(children, options);
    const script2 = (src = '', children = '', options = {}) => script(children, {...options, src});

    class Small extends Tag {
        tag = 'small'
    }

    const small = (children = '', options = {}) => new Small(children, options);

    class Source extends TagEmpty {
        tag = 'source'

        selfAttributes() {
            return ["media", "src", "type"]
        }
    }

    const source = (options = {}) => new Source(options);
    const source2 = (src = '', options = {}) => source({...options, src});

    class Sub extends Tag {
        tag = 'sub'
    }

    const sub = (children = '', options = {}) => new Sub(children, options);

    class Sup extends Tag {
        tag = 'sup'
    }

    const sup = (children = '', options = {}) => new Sup(children, options);

    class Textarea extends Tag {
        tag = 'textarea'

        selfAttributes() {
            return ["autofocus", "cols", "form", "maxlength", "name", "placeholder", "rows", "wrap"]
        }
    }

    const textarea = (children = '', options = {}) => new Textarea(children, options);

    class Time extends Tag {
        tag = 'time'

        selfAttributes() {
            return ["datetime", "pubdate"]
        }
    }

    const time = (children = '', options = {}) => new Time(children, options);

    class Track extends TagEmpty {
        tag = 'track'

        selfAttributes() {
            return ["kind", "src", "srclang", "label"]
        }
    }

    const track = (options = {}) => new Track(options);
    const track2 = (src = '', options = {}) => track({...options, src});

    class Var extends Tag {
        tag = 'var'
    }

    const variable = (children = '', options = {}) => new Var(children, options);

    class VideoTag extends Tag {
        tag = 'video'

        selfAttributes() {
            return ["autoplay", "controls", "height", "loop", "loop", "poster", "preload", "src", "width"]
        }
    }

    const video = (children = '', options = {}) => new VideoTag(children, options);
    const video2 = (src = '', children = '', options = {}) => video(children, {...options, src});

    class Wbr extends TagEmpty {
        tag = 'wbr'
    }

    const wbr = options => new Wbr(options);

    class Main extends Tag {
        tag = 'main'
    }

    const main = (children = '', options = {}) => new Main(children, options);

    class Flexbox extends Tag {
        tag = "div"

        constructor(children = "", options = {}) {
            let {style = {}, order = 0, justify = "flex-start", align = "stretch", content = "normal"} = options;
            const flex = ["direction", "wrap", "flow", "grow", "shrink", "basis"];

            style.display = options.inline === true ? "inline-flex" : "flex";

            flex.forEach( v => {
                if (typeof options[v] !== "undefined") {
                    style[`flex-${v}`] = options[v];
                }
            } );

            style.order = order;
            style.justifyContent = justify;
            style.alignItems = align;
            style.alignContent = content;

            super(children, {...options, style});
        }
    }

    const flexbox = (children, options) => new Flexbox(children, options);

    class Margin extends Tag {
        constructor(children = "", options = {}) {
            let {style = {}} = options;
            const position = ["left", "right", "top", "bottom"];

            position.forEach( v => {
                if (typeof options[v] !== "undefined") {
                    let val = options[v];
                    style[`margin-${v}`] = isNaN(val) ? val : `${val}px`;
                }
            } );

            super(children, {...options, style});
        }
    }

    const margin = (children, options) => new Margin(children, options);

    class Padding extends Tag {
        constructor(children = "", options = {}) {
            let {style = {}} = options;
            const position = ["left", "right", "top", "bottom"];

            position.forEach( v => {
                if (typeof options[v] !== "undefined") {
                    let val = options[v];
                    style[`padding-${v}`] = isNaN(val) ? val : `${val}px`;
                }
            } );

            super(children, {...options, style});
        }
    }

    const padding = (children, options) => new Padding(children, options);

    class Center extends Tag {
        constructor(children = "", options = {}) {
            let {style = {}} = options;

            style.textAlign = "center";

            super(children, {...options, style});
        }
    }

    const center = (children, options) => new Center(children, options);

    class FigureSimple extends Tag {
        tag = 'figure'

        constructor(img = '', caption = '', alt= '', options = {}) {
            if (alt && typeof alt !== "string") {
                options = alt;
                alt = "";
            }

            super(options);

            this.img = img;
            this.alt = alt;
            this.caption = caption;
        }

        template() {
            return `
            <${this.tag} ${this.attributes} ${this.events}>
                <img src="${this.img}" alt="${this.alt}">
                <figcaption>${this.caption}</figcaption>            
            </${this.tag}>
        `
        }
    }

    const figureSimple = (img, caption, alt, options) => new FigureSimple(img, caption, alt, options);

    class CssGrid extends Tag {
        constructor(children = '', options = {}) {
            let {style = {}} = options;
            const props = ["gap", "templateRows", "templateColumns", "templateAreas", "autoRows", "autoColumns", "autoFlow"];

            style.display = "grid"; // inline-grid ?

            props.forEach( v => {
                if (typeof options[v] !== "undefined") {
                    style[`grid-${dashedName(v)}`] = options[v];
                }
            } );

            super(children, {...options, style});
        }
    }

    const cssGrid = (children, options) => new CssGrid(children, options);

    class CssGridItem extends Tag {
        constructor(children = '', options = {}) {
            let {style = {}} = options;
            const props = ["rowStart", "rowEnd", "columnStart", "columnEnd", "area", "column", "row"];

            props.forEach( v => {
                if (typeof options[v] !== "undefined") {
                    style[`grid-${dashedName(v)}`] = options[v];
                }
            } );

            super(children, {...options, style});

            if (options.tag) {
                this.tag = options.tag;
            }
        }
    }

    const cssGridItem = (children, options) => new CssGridItem(children, options);

    class Meta extends TagEmpty {
        tag = 'meta'

        selfAttributes() {
            return ["content", "name", "http-equiv", "charset"]
        }
    }

    const meta = options => new Meta(options);

    const addMeta = options => {
        let metas = document.head.querySelectorAll("meta");
        let metaElement = meta(options), attr;
        const check = ["name", "charset", "http-equiv"];

        metas.forEach( v => {
            for (let i = 0; i < check.length; i++) {
                attr = check[i];
                if (options[attr] && (v.hasAttribute(attr) && v.getAttribute(attr) === options[attr])) {
                    v.remove();
                    return
                }
            }
        });

        render(metaElement, document.head, {clear: false});
    };

    class Title extends Tag {
        tag = 'title'
    }

    const title = text => new Title(text);

    const addTitle = text => {
        let t = document.head.querySelector("title");

        if (t) {
            t.remove();
        }

        render(title(text), document.head, {clear: false});
    };

    var html = /*#__PURE__*/Object.freeze({
        __proto__: null,
        BaseElement: BaseElement,
        Tag: Tag,
        TagEmpty: TagEmpty,
        render: render,
        router: router,
        Router: Router,
        createStyleElement: createStyleElement,
        createStyleSheet: createStyleSheet,
        addCssRule: addCssRule,
        addStyle: addStyle,
        cssLoader: cssLoader,
        jsLoader: jsLoader,
        viewLoader: viewLoader,
        clearViewStorageHolder: clearViewStorageHolder,
        br: br,
        Br: Br,
        hr: hr,
        Hr: Hr,
        span: span,
        Span: Span,
        Img: Img,
        img: img,
        img2: img2,
        Input: Input,
        input: input,
        input2: input2,
        heading: heading,
        Heading: Heading,
        h1: h1,
        h2: h2,
        h3: h3,
        h4: h4,
        h5: h5,
        h6: h6,
        section: section,
        Section: Section,
        anchor: anchor,
        a: a,
        Anchor: Anchor,
        abbr: abbr,
        Abbr: Abbr,
        article: article,
        Article: Article,
        nav: nav,
        Nav: Nav,
        aside: aside,
        Aside: Aside,
        header: header,
        Header: Header,
        footer: footer,
        Footer: Footer,
        address: address,
        Address: Address,
        map: map,
        Map: Map$1,
        area: area,
        Area: Area,
        area2: area2,
        audio: audio,
        audio2: audio2,
        AudioTag: AudioTag,
        bold: bold,
        Bold: Bold,
        bdi: bdi,
        Bdi: Bdi,
        bdo: bdo,
        Bdo: Bdo,
        blockquote: blockquote,
        Blockquote: Blockquote,
        button: button,
        Button: Button,
        canvas: canvas,
        Canvas: Canvas,
        table: table,
        Table: Table,
        caption: caption,
        Caption: Caption,
        col: col,
        Col: Col,
        colgroup: colgroup,
        Colgroup: Colgroup,
        TableSection: TableSection,
        TableCell: TableCell,
        thead: thead,
        tbody: tbody,
        tfoot: tfoot,
        td: td,
        th: th,
        tr: tr,
        TableRow: TableRow,
        cite: cite,
        Cite: Cite,
        code: code,
        Code: Code,
        dl: dl,
        dt: dt,
        dd: dd,
        Dl: Dl,
        Dt: Dt,
        Dd: Dd,
        details: details,
        Details: Details,
        summary: summary,
        Summary: Summary,
        dfn: dfn,
        Dfn: Dfn,
        div: div,
        Div: Div,
        em: em,
        Em: Em,
        ital: ital,
        Ital: Ital,
        i: i,
        strong: strong,
        Strong: Strong,
        embed: embed,
        Embed: Embed,
        noembed: noembed,
        NoEmbed: NoEmbed,
        fieldset: fieldset,
        Fieldset: Fieldset,
        legend: legend,
        Legend: Legend,
        figure: figure,
        Figure: Figure,
        figcaption: figcaption,
        FigCaption: FigCaption,
        form: form,
        Form: Form,
        frame: frame,
        frame2: frame2,
        frameset: frameset,
        Frame: Frame,
        Frameset: Frameset,
        noframes: noframes,
        NoFrames: NoFrames,
        iframe: iframe,
        IFrame: IFrame,
        iframe2: iframe2,
        ins: ins,
        Ins: Ins,
        kbd: kbd,
        Kbd: Kbd,
        label: label,
        label2: label2,
        Label: Label,
        ul: ul,
        ol: ol,
        li: li,
        List: List,
        ListItem: ListItem,
        mark: mark$1,
        Mark: Mark,
        noscript: noscript,
        NoScript: NoScript,
        select: select,
        Select: Select,
        OptionGroup: OptionGroup,
        optgroup: optgroup,
        Option: Option,
        option: option,
        output: output,
        Output: Output,
        p: p,
        Paragraph: Paragraph,
        paragraph: paragraph,
        pre: pre,
        Pre: Pre,
        q: q,
        Quoted: Quoted,
        s: s,
        strike: strike,
        Strike: Strike,
        script: script,
        Script: Script,
        script2: script2,
        small: small,
        Small: Small,
        source: source,
        Source: Source,
        source2: source2,
        sub: sub,
        Sub: Sub,
        sup: sup,
        Sup: Sup,
        textarea: textarea,
        Textarea: Textarea,
        time: time,
        Time: Time,
        track: track,
        Track: Track,
        track2: track2,
        variable: variable,
        Var: Var,
        video: video,
        VideoTag: VideoTag,
        video2: video2,
        wbr: wbr,
        Wbr: Wbr,
        main: main,
        Main: Main,
        flexbox: flexbox,
        Flexbox: Flexbox,
        margin: margin,
        Margin: Margin,
        padding: padding,
        Padding: Padding,
        center: center,
        Center: Center,
        figureSimple: figureSimple,
        FigureSimple: FigureSimple,
        cssGrid: cssGrid,
        CssGrid: CssGrid,
        cssGridItem: cssGridItem,
        CssGridItem: CssGridItem,
        meta: meta,
        Meta: Meta,
        addMeta: addMeta,
        title: title,
        Title: Title,
        addTitle: addTitle
    });

    const globalize = () => {
        globalThis.Datetime = Datetime;
        globalThis.datetime = datetime;
        globalThis.Str = Str;
        globalThis.string = str;
        globalThis.$ = $$1;
        globalThis.Query = Query$1;
        globalThis.query = query;
        globalThis.html = {
            ...html
        };
        globalThis.__htmlSaver = {};
        globalThis.html.extract = (ctx = globalThis) => {
            for (let key in globalThis.html) {
                globalThis.__htmlSaver[key] = globalThis[key];
                ctx[key] = globalThis.html[key];
            }
        };

        globalThis.html.restore = (ctx = globalThis) => {
            for (let key in globalThis.__htmlSaver) {
                ctx[key] = globalThis.__htmlSaver[key];
            }
        };
    };

    var old$1 = {};

    // Copyright Joyent, Inc. and other Node contributors.
    //
    // Permission is hereby granted, free of charge, to any person obtaining a
    // copy of this software and associated documentation files (the
    // "Software"), to deal in the Software without restriction, including
    // without limitation the rights to use, copy, modify, merge, publish,
    // distribute, sublicense, and/or sell copies of the Software, and to permit
    // persons to whom the Software is furnished to do so, subject to the
    // following conditions:
    //
    // The above copyright notice and this permission notice shall be included
    // in all copies or substantial portions of the Software.
    //
    // THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
    // OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
    // MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
    // NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
    // DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
    // OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
    // USE OR OTHER DEALINGS IN THE SOFTWARE.

    var pathModule = require$$4__default["default"];
    var isWindows$1 = process.platform === 'win32';
    var fs$2 = require$$0__default["default"];

    // JavaScript implementation of realpath, ported from node pre-v6

    var DEBUG = process.env.NODE_DEBUG && /fs/.test(process.env.NODE_DEBUG);

    function rethrow() {
      // Only enable in debug mode. A backtrace uses ~1000 bytes of heap space and
      // is fairly slow to generate.
      var callback;
      if (DEBUG) {
        var backtrace = new Error;
        callback = debugCallback;
      } else
        callback = missingCallback;

      return callback;

      function debugCallback(err) {
        if (err) {
          backtrace.message = err.message;
          err = backtrace;
          missingCallback(err);
        }
      }

      function missingCallback(err) {
        if (err) {
          if (process.throwDeprecation)
            throw err;  // Forgot a callback but don't know where? Use NODE_DEBUG=fs
          else if (!process.noDeprecation) {
            var msg = 'fs: missing callback ' + (err.stack || err.message);
            if (process.traceDeprecation)
              console.trace(msg);
            else
              console.error(msg);
          }
        }
      }
    }

    function maybeCallback(cb) {
      return typeof cb === 'function' ? cb : rethrow();
    }

    pathModule.normalize;

    // Regexp that finds the next partion of a (partial) path
    // result is [base_with_slash, base], e.g. ['somedir/', 'somedir']
    if (isWindows$1) {
      var nextPartRe = /(.*?)(?:[\/\\]+|$)/g;
    } else {
      var nextPartRe = /(.*?)(?:[\/]+|$)/g;
    }

    // Regex to find the device root, including trailing slash. E.g. 'c:\\'.
    if (isWindows$1) {
      var splitRootRe = /^(?:[a-zA-Z]:|[\\\/]{2}[^\\\/]+[\\\/][^\\\/]+)?[\\\/]*/;
    } else {
      var splitRootRe = /^[\/]*/;
    }

    old$1.realpathSync = function realpathSync(p, cache) {
      // make p is absolute
      p = pathModule.resolve(p);

      if (cache && Object.prototype.hasOwnProperty.call(cache, p)) {
        return cache[p];
      }

      var original = p,
          seenLinks = {},
          knownHard = {};

      // current character position in p
      var pos;
      // the partial path so far, including a trailing slash if any
      var current;
      // the partial path without a trailing slash (except when pointing at a root)
      var base;
      // the partial path scanned in the previous round, with slash
      var previous;

      start();

      function start() {
        // Skip over roots
        var m = splitRootRe.exec(p);
        pos = m[0].length;
        current = m[0];
        base = m[0];
        previous = '';

        // On windows, check that the root exists. On unix there is no need.
        if (isWindows$1 && !knownHard[base]) {
          fs$2.lstatSync(base);
          knownHard[base] = true;
        }
      }

      // walk down the path, swapping out linked pathparts for their real
      // values
      // NB: p.length changes.
      while (pos < p.length) {
        // find the next part
        nextPartRe.lastIndex = pos;
        var result = nextPartRe.exec(p);
        previous = current;
        current += result[0];
        base = previous + result[1];
        pos = nextPartRe.lastIndex;

        // continue if not a symlink
        if (knownHard[base] || (cache && cache[base] === base)) {
          continue;
        }

        var resolvedLink;
        if (cache && Object.prototype.hasOwnProperty.call(cache, base)) {
          // some known symbolic link.  no need to stat again.
          resolvedLink = cache[base];
        } else {
          var stat = fs$2.lstatSync(base);
          if (!stat.isSymbolicLink()) {
            knownHard[base] = true;
            if (cache) cache[base] = base;
            continue;
          }

          // read the link if it wasn't read before
          // dev/ino always return 0 on windows, so skip the check.
          var linkTarget = null;
          if (!isWindows$1) {
            var id = stat.dev.toString(32) + ':' + stat.ino.toString(32);
            if (seenLinks.hasOwnProperty(id)) {
              linkTarget = seenLinks[id];
            }
          }
          if (linkTarget === null) {
            fs$2.statSync(base);
            linkTarget = fs$2.readlinkSync(base);
          }
          resolvedLink = pathModule.resolve(previous, linkTarget);
          // track this, if given a cache.
          if (cache) cache[base] = resolvedLink;
          if (!isWindows$1) seenLinks[id] = linkTarget;
        }

        // resolve the link, then start over
        p = pathModule.resolve(resolvedLink, p.slice(pos));
        start();
      }

      if (cache) cache[original] = p;

      return p;
    };


    old$1.realpath = function realpath(p, cache, cb) {
      if (typeof cb !== 'function') {
        cb = maybeCallback(cache);
        cache = null;
      }

      // make p is absolute
      p = pathModule.resolve(p);

      if (cache && Object.prototype.hasOwnProperty.call(cache, p)) {
        return process.nextTick(cb.bind(null, null, cache[p]));
      }

      var original = p,
          seenLinks = {},
          knownHard = {};

      // current character position in p
      var pos;
      // the partial path so far, including a trailing slash if any
      var current;
      // the partial path without a trailing slash (except when pointing at a root)
      var base;
      // the partial path scanned in the previous round, with slash
      var previous;

      start();

      function start() {
        // Skip over roots
        var m = splitRootRe.exec(p);
        pos = m[0].length;
        current = m[0];
        base = m[0];
        previous = '';

        // On windows, check that the root exists. On unix there is no need.
        if (isWindows$1 && !knownHard[base]) {
          fs$2.lstat(base, function(err) {
            if (err) return cb(err);
            knownHard[base] = true;
            LOOP();
          });
        } else {
          process.nextTick(LOOP);
        }
      }

      // walk down the path, swapping out linked pathparts for their real
      // values
      function LOOP() {
        // stop if scanned past end of path
        if (pos >= p.length) {
          if (cache) cache[original] = p;
          return cb(null, p);
        }

        // find the next part
        nextPartRe.lastIndex = pos;
        var result = nextPartRe.exec(p);
        previous = current;
        current += result[0];
        base = previous + result[1];
        pos = nextPartRe.lastIndex;

        // continue if not a symlink
        if (knownHard[base] || (cache && cache[base] === base)) {
          return process.nextTick(LOOP);
        }

        if (cache && Object.prototype.hasOwnProperty.call(cache, base)) {
          // known symbolic link.  no need to stat again.
          return gotResolvedLink(cache[base]);
        }

        return fs$2.lstat(base, gotStat);
      }

      function gotStat(err, stat) {
        if (err) return cb(err);

        // if not a symlink, skip to the next path part
        if (!stat.isSymbolicLink()) {
          knownHard[base] = true;
          if (cache) cache[base] = base;
          return process.nextTick(LOOP);
        }

        // stat & read the link if not read before
        // call gotTarget as soon as the link target is known
        // dev/ino always return 0 on windows, so skip the check.
        if (!isWindows$1) {
          var id = stat.dev.toString(32) + ':' + stat.ino.toString(32);
          if (seenLinks.hasOwnProperty(id)) {
            return gotTarget(null, seenLinks[id], base);
          }
        }
        fs$2.stat(base, function(err) {
          if (err) return cb(err);

          fs$2.readlink(base, function(err, target) {
            if (!isWindows$1) seenLinks[id] = target;
            gotTarget(err, target);
          });
        });
      }

      function gotTarget(err, target, base) {
        if (err) return cb(err);

        var resolvedLink = pathModule.resolve(previous, target);
        if (cache) cache[base] = resolvedLink;
        gotResolvedLink(resolvedLink);
      }

      function gotResolvedLink(resolvedLink) {
        // resolve the link, then start over
        p = pathModule.resolve(resolvedLink, p.slice(pos));
        start();
      }
    };

    var fs_realpath = realpath;
    realpath.realpath = realpath;
    realpath.sync = realpathSync;
    realpath.realpathSync = realpathSync;
    realpath.monkeypatch = monkeypatch;
    realpath.unmonkeypatch = unmonkeypatch;

    var fs$1 = require$$0__default["default"];
    var origRealpath = fs$1.realpath;
    var origRealpathSync = fs$1.realpathSync;

    var version = process.version;
    var ok = /^v[0-5]\./.test(version);
    var old = old$1;

    function newError (er) {
      return er && er.syscall === 'realpath' && (
        er.code === 'ELOOP' ||
        er.code === 'ENOMEM' ||
        er.code === 'ENAMETOOLONG'
      )
    }

    function realpath (p, cache, cb) {
      if (ok) {
        return origRealpath(p, cache, cb)
      }

      if (typeof cache === 'function') {
        cb = cache;
        cache = null;
      }
      origRealpath(p, cache, function (er, result) {
        if (newError(er)) {
          old.realpath(p, cache, cb);
        } else {
          cb(er, result);
        }
      });
    }

    function realpathSync (p, cache) {
      if (ok) {
        return origRealpathSync(p, cache)
      }

      try {
        return origRealpathSync(p, cache)
      } catch (er) {
        if (newError(er)) {
          return old.realpathSync(p, cache)
        } else {
          throw er
        }
      }
    }

    function monkeypatch () {
      fs$1.realpath = realpath;
      fs$1.realpathSync = realpathSync;
    }

    function unmonkeypatch () {
      fs$1.realpath = origRealpath;
      fs$1.realpathSync = origRealpathSync;
    }

    const isWindows = typeof process === 'object' &&
      process &&
      process.platform === 'win32';
    var path$2 = isWindows ? { sep: '\\' } : { sep: '/' };

    var balancedMatch = balanced$1;
    function balanced$1(a, b, str) {
      if (a instanceof RegExp) a = maybeMatch(a, str);
      if (b instanceof RegExp) b = maybeMatch(b, str);

      var r = range(a, b, str);

      return r && {
        start: r[0],
        end: r[1],
        pre: str.slice(0, r[0]),
        body: str.slice(r[0] + a.length, r[1]),
        post: str.slice(r[1] + b.length)
      };
    }

    function maybeMatch(reg, str) {
      var m = str.match(reg);
      return m ? m[0] : null;
    }

    balanced$1.range = range;
    function range(a, b, str) {
      var begs, beg, left, right, result;
      var ai = str.indexOf(a);
      var bi = str.indexOf(b, ai + 1);
      var i = ai;

      if (ai >= 0 && bi > 0) {
        if(a===b) {
          return [ai, bi];
        }
        begs = [];
        left = str.length;

        while (i >= 0 && !result) {
          if (i == ai) {
            begs.push(i);
            ai = str.indexOf(a, i + 1);
          } else if (begs.length == 1) {
            result = [ begs.pop(), bi ];
          } else {
            beg = begs.pop();
            if (beg < left) {
              left = beg;
              right = bi;
            }

            bi = str.indexOf(b, i + 1);
          }

          i = ai < bi && ai >= 0 ? ai : bi;
        }

        if (begs.length) {
          result = [ left, right ];
        }
      }

      return result;
    }

    var balanced = balancedMatch;

    var braceExpansion = expandTop;

    var escSlash = '\0SLASH'+Math.random()+'\0';
    var escOpen = '\0OPEN'+Math.random()+'\0';
    var escClose = '\0CLOSE'+Math.random()+'\0';
    var escComma = '\0COMMA'+Math.random()+'\0';
    var escPeriod = '\0PERIOD'+Math.random()+'\0';

    function numeric(str) {
      return parseInt(str, 10) == str
        ? parseInt(str, 10)
        : str.charCodeAt(0);
    }

    function escapeBraces(str) {
      return str.split('\\\\').join(escSlash)
                .split('\\{').join(escOpen)
                .split('\\}').join(escClose)
                .split('\\,').join(escComma)
                .split('\\.').join(escPeriod);
    }

    function unescapeBraces(str) {
      return str.split(escSlash).join('\\')
                .split(escOpen).join('{')
                .split(escClose).join('}')
                .split(escComma).join(',')
                .split(escPeriod).join('.');
    }


    // Basically just str.split(","), but handling cases
    // where we have nested braced sections, which should be
    // treated as individual members, like {a,{b,c},d}
    function parseCommaParts(str) {
      if (!str)
        return [''];

      var parts = [];
      var m = balanced('{', '}', str);

      if (!m)
        return str.split(',');

      var pre = m.pre;
      var body = m.body;
      var post = m.post;
      var p = pre.split(',');

      p[p.length-1] += '{' + body + '}';
      var postParts = parseCommaParts(post);
      if (post.length) {
        p[p.length-1] += postParts.shift();
        p.push.apply(p, postParts);
      }

      parts.push.apply(parts, p);

      return parts;
    }

    function expandTop(str) {
      if (!str)
        return [];

      // I don't know why Bash 4.3 does this, but it does.
      // Anything starting with {} will have the first two bytes preserved
      // but *only* at the top level, so {},a}b will not expand to anything,
      // but a{},b}c will be expanded to [a}c,abc].
      // One could argue that this is a bug in Bash, but since the goal of
      // this module is to match Bash's rules, we escape a leading {}
      if (str.substr(0, 2) === '{}') {
        str = '\\{\\}' + str.substr(2);
      }

      return expand$1(escapeBraces(str), true).map(unescapeBraces);
    }

    function embrace(str) {
      return '{' + str + '}';
    }
    function isPadded(el) {
      return /^-?0\d/.test(el);
    }

    function lte(i, y) {
      return i <= y;
    }
    function gte(i, y) {
      return i >= y;
    }

    function expand$1(str, isTop) {
      var expansions = [];

      var m = balanced('{', '}', str);
      if (!m) return [str];

      // no need to expand pre, since it is guaranteed to be free of brace-sets
      var pre = m.pre;
      var post = m.post.length
        ? expand$1(m.post, false)
        : [''];

      if (/\$$/.test(m.pre)) {    
        for (var k = 0; k < post.length; k++) {
          var expansion = pre+ '{' + m.body + '}' + post[k];
          expansions.push(expansion);
        }
      } else {
        var isNumericSequence = /^-?\d+\.\.-?\d+(?:\.\.-?\d+)?$/.test(m.body);
        var isAlphaSequence = /^[a-zA-Z]\.\.[a-zA-Z](?:\.\.-?\d+)?$/.test(m.body);
        var isSequence = isNumericSequence || isAlphaSequence;
        var isOptions = m.body.indexOf(',') >= 0;
        if (!isSequence && !isOptions) {
          // {a},b}
          if (m.post.match(/,.*\}/)) {
            str = m.pre + '{' + m.body + escClose + m.post;
            return expand$1(str);
          }
          return [str];
        }

        var n;
        if (isSequence) {
          n = m.body.split(/\.\./);
        } else {
          n = parseCommaParts(m.body);
          if (n.length === 1) {
            // x{{a,b}}y ==> x{a}y x{b}y
            n = expand$1(n[0], false).map(embrace);
            if (n.length === 1) {
              return post.map(function(p) {
                return m.pre + n[0] + p;
              });
            }
          }
        }

        // at this point, n is the parts, and we know it's not a comma set
        // with a single entry.
        var N;

        if (isSequence) {
          var x = numeric(n[0]);
          var y = numeric(n[1]);
          var width = Math.max(n[0].length, n[1].length);
          var incr = n.length == 3
            ? Math.abs(numeric(n[2]))
            : 1;
          var test = lte;
          var reverse = y < x;
          if (reverse) {
            incr *= -1;
            test = gte;
          }
          var pad = n.some(isPadded);

          N = [];

          for (var i = x; test(i, y); i += incr) {
            var c;
            if (isAlphaSequence) {
              c = String.fromCharCode(i);
              if (c === '\\')
                c = '';
            } else {
              c = String(i);
              if (pad) {
                var need = width - c.length;
                if (need > 0) {
                  var z = new Array(need + 1).join('0');
                  if (i < 0)
                    c = '-' + z + c.slice(1);
                  else
                    c = z + c;
                }
              }
            }
            N.push(c);
          }
        } else {
          N = [];

          for (var j = 0; j < n.length; j++) {
            N.push.apply(N, expand$1(n[j], false));
          }
        }

        for (var j = 0; j < N.length; j++) {
          for (var k = 0; k < post.length; k++) {
            var expansion = pre + N[j] + post[k];
            if (!isTop || isSequence || expansion)
              expansions.push(expansion);
          }
        }
      }

      return expansions;
    }

    const minimatch$1 = minimatch_1 = (p, pattern, options = {}) => {
      assertValidPattern(pattern);

      // shortcut: comments match nothing.
      if (!options.nocomment && pattern.charAt(0) === '#') {
        return false
      }

      return new Minimatch$1(pattern, options).match(p)
    };

    var minimatch_1 = minimatch$1;

    const path$1 = path$2;
    minimatch$1.sep = path$1.sep;

    const GLOBSTAR = Symbol('globstar **');
    minimatch$1.GLOBSTAR = GLOBSTAR;
    const expand = braceExpansion;

    const plTypes = {
      '!': { open: '(?:(?!(?:', close: '))[^/]*?)'},
      '?': { open: '(?:', close: ')?' },
      '+': { open: '(?:', close: ')+' },
      '*': { open: '(?:', close: ')*' },
      '@': { open: '(?:', close: ')' }
    };

    // any single thing other than /
    // don't need to escape / when using new RegExp()
    const qmark = '[^/]';

    // * => any number of characters
    const star = qmark + '*?';

    // ** when dots are allowed.  Anything goes, except .. and .
    // not (^ or / followed by one or two dots followed by $ or /),
    // followed by anything, any number of times.
    const twoStarDot = '(?:(?!(?:\\\/|^)(?:\\.{1,2})($|\\\/)).)*?';

    // not a ^ or / followed by a dot,
    // followed by anything, any number of times.
    const twoStarNoDot = '(?:(?!(?:\\\/|^)\\.).)*?';

    // "abc" -> { a:true, b:true, c:true }
    const charSet = s => s.split('').reduce((set, c) => {
      set[c] = true;
      return set
    }, {});

    // characters that need to be escaped in RegExp.
    const reSpecials = charSet('().*{}+?[]^$\\!');

    // characters that indicate we have to add the pattern start
    const addPatternStartSet = charSet('[.(');

    // normalizes slashes.
    const slashSplit = /\/+/;

    minimatch$1.filter = (pattern, options = {}) =>
      (p, i, list) => minimatch$1(p, pattern, options);

    const ext = (a, b = {}) => {
      const t = {};
      Object.keys(a).forEach(k => t[k] = a[k]);
      Object.keys(b).forEach(k => t[k] = b[k]);
      return t
    };

    minimatch$1.defaults = def => {
      if (!def || typeof def !== 'object' || !Object.keys(def).length) {
        return minimatch$1
      }

      const orig = minimatch$1;

      const m = (p, pattern, options) => orig(p, pattern, ext(def, options));
      m.Minimatch = class Minimatch extends orig.Minimatch {
        constructor (pattern, options) {
          super(pattern, ext(def, options));
        }
      };
      m.Minimatch.defaults = options => orig.defaults(ext(def, options)).Minimatch;
      m.filter = (pattern, options) => orig.filter(pattern, ext(def, options));
      m.defaults = options => orig.defaults(ext(def, options));
      m.makeRe = (pattern, options) => orig.makeRe(pattern, ext(def, options));
      m.braceExpand = (pattern, options) => orig.braceExpand(pattern, ext(def, options));
      m.match = (list, pattern, options) => orig.match(list, pattern, ext(def, options));

      return m
    };





    // Brace expansion:
    // a{b,c}d -> abd acd
    // a{b,}c -> abc ac
    // a{0..3}d -> a0d a1d a2d a3d
    // a{b,c{d,e}f}g -> abg acdfg acefg
    // a{b,c}d{e,f}g -> abdeg acdeg abdeg abdfg
    //
    // Invalid sets are not expanded.
    // a{2..}b -> a{2..}b
    // a{b}c -> a{b}c
    minimatch$1.braceExpand = (pattern, options) => braceExpand(pattern, options);

    const braceExpand = (pattern, options = {}) => {
      assertValidPattern(pattern);

      // Thanks to Yeting Li <https://github.com/yetingli> for
      // improving this regexp to avoid a ReDOS vulnerability.
      if (options.nobrace || !/\{(?:(?!\{).)*\}/.test(pattern)) {
        // shortcut. no need to expand.
        return [pattern]
      }

      return expand(pattern)
    };

    const MAX_PATTERN_LENGTH = 1024 * 64;
    const assertValidPattern = pattern => {
      if (typeof pattern !== 'string') {
        throw new TypeError('invalid pattern')
      }

      if (pattern.length > MAX_PATTERN_LENGTH) {
        throw new TypeError('pattern is too long')
      }
    };

    // parse a component of the expanded set.
    // At this point, no pattern may contain "/" in it
    // so we're going to return a 2d array, where each entry is the full
    // pattern, split on '/', and then turned into a regular expression.
    // A regexp is made at the end which joins each array with an
    // escaped /, and another full one which joins each regexp with |.
    //
    // Following the lead of Bash 4.1, note that "**" only has special meaning
    // when it is the *only* thing in a path portion.  Otherwise, any series
    // of * is equivalent to a single *.  Globstar behavior is enabled by
    // default, and can be disabled by setting options.noglobstar.
    const SUBPARSE = Symbol('subparse');

    minimatch$1.makeRe = (pattern, options) =>
      new Minimatch$1(pattern, options || {}).makeRe();

    minimatch$1.match = (list, pattern, options = {}) => {
      const mm = new Minimatch$1(pattern, options);
      list = list.filter(f => mm.match(f));
      if (mm.options.nonull && !list.length) {
        list.push(pattern);
      }
      return list
    };

    // replace stuff like \* with *
    const globUnescape = s => s.replace(/\\(.)/g, '$1');
    const charUnescape = s => s.replace(/\\([^-\]])/g, '$1');
    const regExpEscape = s => s.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
    const braExpEscape = s => s.replace(/[[\]\\]/g, '\\$&');

    class Minimatch$1 {
      constructor (pattern, options) {
        assertValidPattern(pattern);

        if (!options) options = {};

        this.options = options;
        this.set = [];
        this.pattern = pattern;
        this.windowsPathsNoEscape = !!options.windowsPathsNoEscape ||
          options.allowWindowsEscape === false;
        if (this.windowsPathsNoEscape) {
          this.pattern = this.pattern.replace(/\\/g, '/');
        }
        this.regexp = null;
        this.negate = false;
        this.comment = false;
        this.empty = false;
        this.partial = !!options.partial;

        // make the set of regexps etc.
        this.make();
      }

      debug () {}

      make () {
        const pattern = this.pattern;
        const options = this.options;

        // empty patterns and comments match nothing.
        if (!options.nocomment && pattern.charAt(0) === '#') {
          this.comment = true;
          return
        }
        if (!pattern) {
          this.empty = true;
          return
        }

        // step 1: figure out negation, etc.
        this.parseNegate();

        // step 2: expand braces
        let set = this.globSet = this.braceExpand();

        if (options.debug) this.debug = (...args) => console.error(...args);

        this.debug(this.pattern, set);

        // step 3: now we have a set, so turn each one into a series of path-portion
        // matching patterns.
        // These will be regexps, except in the case of "**", which is
        // set to the GLOBSTAR object for globstar behavior,
        // and will not contain any / characters
        set = this.globParts = set.map(s => s.split(slashSplit));

        this.debug(this.pattern, set);

        // glob --> regexps
        set = set.map((s, si, set) => s.map(this.parse, this));

        this.debug(this.pattern, set);

        // filter out everything that didn't compile properly.
        set = set.filter(s => s.indexOf(false) === -1);

        this.debug(this.pattern, set);

        this.set = set;
      }

      parseNegate () {
        if (this.options.nonegate) return

        const pattern = this.pattern;
        let negate = false;
        let negateOffset = 0;

        for (let i = 0; i < pattern.length && pattern.charAt(i) === '!'; i++) {
          negate = !negate;
          negateOffset++;
        }

        if (negateOffset) this.pattern = pattern.slice(negateOffset);
        this.negate = negate;
      }

      // set partial to true to test if, for example,
      // "/a/b" matches the start of "/*/b/*/d"
      // Partial means, if you run out of file before you run
      // out of pattern, then that's fine, as long as all
      // the parts match.
      matchOne (file, pattern, partial) {
        var options = this.options;

        this.debug('matchOne',
          { 'this': this, file: file, pattern: pattern });

        this.debug('matchOne', file.length, pattern.length);

        for (var fi = 0,
            pi = 0,
            fl = file.length,
            pl = pattern.length
            ; (fi < fl) && (pi < pl)
            ; fi++, pi++) {
          this.debug('matchOne loop');
          var p = pattern[pi];
          var f = file[fi];

          this.debug(pattern, p, f);

          // should be impossible.
          // some invalid regexp stuff in the set.
          /* istanbul ignore if */
          if (p === false) return false

          if (p === GLOBSTAR) {
            this.debug('GLOBSTAR', [pattern, p, f]);

            // "**"
            // a/**/b/**/c would match the following:
            // a/b/x/y/z/c
            // a/x/y/z/b/c
            // a/b/x/b/x/c
            // a/b/c
            // To do this, take the rest of the pattern after
            // the **, and see if it would match the file remainder.
            // If so, return success.
            // If not, the ** "swallows" a segment, and try again.
            // This is recursively awful.
            //
            // a/**/b/**/c matching a/b/x/y/z/c
            // - a matches a
            // - doublestar
            //   - matchOne(b/x/y/z/c, b/**/c)
            //     - b matches b
            //     - doublestar
            //       - matchOne(x/y/z/c, c) -> no
            //       - matchOne(y/z/c, c) -> no
            //       - matchOne(z/c, c) -> no
            //       - matchOne(c, c) yes, hit
            var fr = fi;
            var pr = pi + 1;
            if (pr === pl) {
              this.debug('** at the end');
              // a ** at the end will just swallow the rest.
              // We have found a match.
              // however, it will not swallow /.x, unless
              // options.dot is set.
              // . and .. are *never* matched by **, for explosively
              // exponential reasons.
              for (; fi < fl; fi++) {
                if (file[fi] === '.' || file[fi] === '..' ||
                  (!options.dot && file[fi].charAt(0) === '.')) return false
              }
              return true
            }

            // ok, let's see if we can swallow whatever we can.
            while (fr < fl) {
              var swallowee = file[fr];

              this.debug('\nglobstar while', file, fr, pattern, pr, swallowee);

              // XXX remove this slice.  Just pass the start index.
              if (this.matchOne(file.slice(fr), pattern.slice(pr), partial)) {
                this.debug('globstar found match!', fr, fl, swallowee);
                // found a match.
                return true
              } else {
                // can't swallow "." or ".." ever.
                // can only swallow ".foo" when explicitly asked.
                if (swallowee === '.' || swallowee === '..' ||
                  (!options.dot && swallowee.charAt(0) === '.')) {
                  this.debug('dot detected!', file, fr, pattern, pr);
                  break
                }

                // ** swallows a segment, and continue.
                this.debug('globstar swallow a segment, and continue');
                fr++;
              }
            }

            // no match was found.
            // However, in partial mode, we can't say this is necessarily over.
            // If there's more *pattern* left, then
            /* istanbul ignore if */
            if (partial) {
              // ran out of file
              this.debug('\n>>> no match, partial?', file, fr, pattern, pr);
              if (fr === fl) return true
            }
            return false
          }

          // something other than **
          // non-magic patterns just have to match exactly
          // patterns with magic have been turned into regexps.
          var hit;
          if (typeof p === 'string') {
            hit = f === p;
            this.debug('string match', p, f, hit);
          } else {
            hit = f.match(p);
            this.debug('pattern match', p, f, hit);
          }

          if (!hit) return false
        }

        // Note: ending in / means that we'll get a final ""
        // at the end of the pattern.  This can only match a
        // corresponding "" at the end of the file.
        // If the file ends in /, then it can only match a
        // a pattern that ends in /, unless the pattern just
        // doesn't have any more for it. But, a/b/ should *not*
        // match "a/b/*", even though "" matches against the
        // [^/]*? pattern, except in partial mode, where it might
        // simply not be reached yet.
        // However, a/b/ should still satisfy a/*

        // now either we fell off the end of the pattern, or we're done.
        if (fi === fl && pi === pl) {
          // ran out of pattern and filename at the same time.
          // an exact hit!
          return true
        } else if (fi === fl) {
          // ran out of file, but still had pattern left.
          // this is ok if we're doing the match as part of
          // a glob fs traversal.
          return partial
        } else /* istanbul ignore else */ if (pi === pl) {
          // ran out of pattern, still have file left.
          // this is only acceptable if we're on the very last
          // empty segment of a file with a trailing slash.
          // a/* should match a/b/
          return (fi === fl - 1) && (file[fi] === '')
        }

        // should be unreachable.
        /* istanbul ignore next */
        throw new Error('wtf?')
      }

      braceExpand () {
        return braceExpand(this.pattern, this.options)
      }

      parse (pattern, isSub) {
        assertValidPattern(pattern);

        const options = this.options;

        // shortcuts
        if (pattern === '**') {
          if (!options.noglobstar)
            return GLOBSTAR
          else
            pattern = '*';
        }
        if (pattern === '') return ''

        let re = '';
        let hasMagic = false;
        let escaping = false;
        // ? => one single character
        const patternListStack = [];
        const negativeLists = [];
        let stateChar;
        let inClass = false;
        let reClassStart = -1;
        let classStart = -1;
        let cs;
        let pl;
        let sp;
        // . and .. never match anything that doesn't start with .,
        // even when options.dot is set.  However, if the pattern
        // starts with ., then traversal patterns can match.
        let dotTravAllowed = pattern.charAt(0) === '.';
        let dotFileAllowed = options.dot || dotTravAllowed;
        const patternStart = () =>
          dotTravAllowed
            ? ''
            : dotFileAllowed
            ? '(?!(?:^|\\/)\\.{1,2}(?:$|\\/))'
            : '(?!\\.)';
        const subPatternStart = (p) =>
          p.charAt(0) === '.'
            ? ''
            : options.dot
            ? '(?!(?:^|\\/)\\.{1,2}(?:$|\\/))'
            : '(?!\\.)';


        const clearStateChar = () => {
          if (stateChar) {
            // we had some state-tracking character
            // that wasn't consumed by this pass.
            switch (stateChar) {
              case '*':
                re += star;
                hasMagic = true;
              break
              case '?':
                re += qmark;
                hasMagic = true;
              break
              default:
                re += '\\' + stateChar;
              break
            }
            this.debug('clearStateChar %j %j', stateChar, re);
            stateChar = false;
          }
        };

        for (let i = 0, c; (i < pattern.length) && (c = pattern.charAt(i)); i++) {
          this.debug('%s\t%s %s %j', pattern, i, re, c);

          // skip over any that are escaped.
          if (escaping) {
            /* istanbul ignore next - completely not allowed, even escaped. */
            if (c === '/') {
              return false
            }

            if (reSpecials[c]) {
              re += '\\';
            }
            re += c;
            escaping = false;
            continue
          }

          switch (c) {
            /* istanbul ignore next */
            case '/': {
              // Should already be path-split by now.
              return false
            }

            case '\\':
              if (inClass && pattern.charAt(i + 1) === '-') {
                re += c;
                continue
              }

              clearStateChar();
              escaping = true;
            continue

            // the various stateChar values
            // for the "extglob" stuff.
            case '?':
            case '*':
            case '+':
            case '@':
            case '!':
              this.debug('%s\t%s %s %j <-- stateChar', pattern, i, re, c);

              // all of those are literals inside a class, except that
              // the glob [!a] means [^a] in regexp
              if (inClass) {
                this.debug('  in class');
                if (c === '!' && i === classStart + 1) c = '^';
                re += c;
                continue
              }

              // if we already have a stateChar, then it means
              // that there was something like ** or +? in there.
              // Handle the stateChar, then proceed with this one.
              this.debug('call clearStateChar %j', stateChar);
              clearStateChar();
              stateChar = c;
              // if extglob is disabled, then +(asdf|foo) isn't a thing.
              // just clear the statechar *now*, rather than even diving into
              // the patternList stuff.
              if (options.noext) clearStateChar();
            continue

            case '(': {
              if (inClass) {
                re += '(';
                continue
              }

              if (!stateChar) {
                re += '\\(';
                continue
              }

              const plEntry = {
                type: stateChar,
                start: i - 1,
                reStart: re.length,
                open: plTypes[stateChar].open,
                close: plTypes[stateChar].close,
              };
              this.debug(this.pattern, '\t', plEntry);
              patternListStack.push(plEntry);
              // negation is (?:(?!(?:js)(?:<rest>))[^/]*)
              re += plEntry.open;
              // next entry starts with a dot maybe?
              if (plEntry.start === 0 && plEntry.type !== '!') {
                dotTravAllowed = true;
                re += subPatternStart(pattern.slice(i + 1));
              }
              this.debug('plType %j %j', stateChar, re);
              stateChar = false;
              continue
            }

            case ')': {
              const plEntry = patternListStack[patternListStack.length - 1];
              if (inClass || !plEntry) {
                re += '\\)';
                continue
              }
              patternListStack.pop();

              // closing an extglob
              clearStateChar();
              hasMagic = true;
              pl = plEntry;
              // negation is (?:(?!js)[^/]*)
              // The others are (?:<pattern>)<type>
              re += pl.close;
              if (pl.type === '!') {
                negativeLists.push(Object.assign(pl, { reEnd: re.length }));
              }
              continue
            }

            case '|': {
              const plEntry = patternListStack[patternListStack.length - 1];
              if (inClass || !plEntry) {
                re += '\\|';
                continue
              }

              clearStateChar();
              re += '|';
              // next subpattern can start with a dot?
              if (plEntry.start === 0 && plEntry.type !== '!') {
                dotTravAllowed = true;
                re += subPatternStart(pattern.slice(i + 1));
              }
              continue
            }

            // these are mostly the same in regexp and glob
            case '[':
              // swallow any state-tracking char before the [
              clearStateChar();

              if (inClass) {
                re += '\\' + c;
                continue
              }

              inClass = true;
              classStart = i;
              reClassStart = re.length;
              re += c;
            continue

            case ']':
              //  a right bracket shall lose its special
              //  meaning and represent itself in
              //  a bracket expression if it occurs
              //  first in the list.  -- POSIX.2 2.8.3.2
              if (i === classStart + 1 || !inClass) {
                re += '\\' + c;
                continue
              }

              // split where the last [ was, make sure we don't have
              // an invalid re. if so, re-walk the contents of the
              // would-be class to re-translate any characters that
              // were passed through as-is
              // TODO: It would probably be faster to determine this
              // without a try/catch and a new RegExp, but it's tricky
              // to do safely.  For now, this is safe and works.
              cs = pattern.substring(classStart + 1, i);
              try {
                RegExp('[' + braExpEscape(charUnescape(cs)) + ']');
                // looks good, finish up the class.
                re += c;
              } catch (er) {
                // out of order ranges in JS are errors, but in glob syntax,
                // they're just a range that matches nothing.
                re = re.substring(0, reClassStart) + '(?:$.)'; // match nothing ever
              }
              hasMagic = true;
              inClass = false;
            continue

            default:
              // swallow any state char that wasn't consumed
              clearStateChar();

              if (reSpecials[c] && !(c === '^' && inClass)) {
                re += '\\';
              }

              re += c;
              break

          } // switch
        } // for

        // handle the case where we left a class open.
        // "[abc" is valid, equivalent to "\[abc"
        if (inClass) {
          // split where the last [ was, and escape it
          // this is a huge pita.  We now have to re-walk
          // the contents of the would-be class to re-translate
          // any characters that were passed through as-is
          cs = pattern.slice(classStart + 1);
          sp = this.parse(cs, SUBPARSE);
          re = re.substring(0, reClassStart) + '\\[' + sp[0];
          hasMagic = hasMagic || sp[1];
        }

        // handle the case where we had a +( thing at the *end*
        // of the pattern.
        // each pattern list stack adds 3 chars, and we need to go through
        // and escape any | chars that were passed through as-is for the regexp.
        // Go through and escape them, taking care not to double-escape any
        // | chars that were already escaped.
        for (pl = patternListStack.pop(); pl; pl = patternListStack.pop()) {
          let tail;
          tail = re.slice(pl.reStart + pl.open.length);
          this.debug('setting tail', re, pl);
          // maybe some even number of \, then maybe 1 \, followed by a |
          tail = tail.replace(/((?:\\{2}){0,64})(\\?)\|/g, (_, $1, $2) => {
            /* istanbul ignore else - should already be done */
            if (!$2) {
              // the | isn't already escaped, so escape it.
              $2 = '\\';
            }

            // need to escape all those slashes *again*, without escaping the
            // one that we need for escaping the | character.  As it works out,
            // escaping an even number of slashes can be done by simply repeating
            // it exactly after itself.  That's why this trick works.
            //
            // I am sorry that you have to see this.
            return $1 + $1 + $2 + '|'
          });

          this.debug('tail=%j\n   %s', tail, tail, pl, re);
          const t = pl.type === '*' ? star
            : pl.type === '?' ? qmark
            : '\\' + pl.type;

          hasMagic = true;
          re = re.slice(0, pl.reStart) + t + '\\(' + tail;
        }

        // handle trailing things that only matter at the very end.
        clearStateChar();
        if (escaping) {
          // trailing \\
          re += '\\\\';
        }

        // only need to apply the nodot start if the re starts with
        // something that could conceivably capture a dot
        const addPatternStart = addPatternStartSet[re.charAt(0)];

        // Hack to work around lack of negative lookbehind in JS
        // A pattern like: *.!(x).!(y|z) needs to ensure that a name
        // like 'a.xyz.yz' doesn't match.  So, the first negative
        // lookahead, has to look ALL the way ahead, to the end of
        // the pattern.
        for (let n = negativeLists.length - 1; n > -1; n--) {
          const nl = negativeLists[n];

          const nlBefore = re.slice(0, nl.reStart);
          const nlFirst = re.slice(nl.reStart, nl.reEnd - 8);
          let nlAfter = re.slice(nl.reEnd);
          const nlLast = re.slice(nl.reEnd - 8, nl.reEnd) + nlAfter;

          // Handle nested stuff like *(*.js|!(*.json)), where open parens
          // mean that we should *not* include the ) in the bit that is considered
          // "after" the negated section.
          const closeParensBefore = nlBefore.split(')').length;
          const openParensBefore = nlBefore.split('(').length - closeParensBefore;
          let cleanAfter = nlAfter;
          for (let i = 0; i < openParensBefore; i++) {
            cleanAfter = cleanAfter.replace(/\)[+*?]?/, '');
          }
          nlAfter = cleanAfter;

          const dollar = nlAfter === '' && isSub !== SUBPARSE ? '(?:$|\\/)' : '';

          re = nlBefore + nlFirst + nlAfter + dollar + nlLast;
        }

        // if the re is not "" at this point, then we need to make sure
        // it doesn't match against an empty path part.
        // Otherwise a/* will match a/, which it should not.
        if (re !== '' && hasMagic) {
          re = '(?=.)' + re;
        }

        if (addPatternStart) {
          re = patternStart() + re;
        }

        // parsing just a piece of a larger pattern.
        if (isSub === SUBPARSE) {
          return [re, hasMagic]
        }

        // if it's nocase, and the lcase/uppercase don't match, it's magic
        if (options.nocase && !hasMagic) {
          hasMagic = pattern.toUpperCase() !== pattern.toLowerCase();
        }

        // skip the regexp for non-magical patterns
        // unescape anything in it, though, so that it'll be
        // an exact match against a file etc.
        if (!hasMagic) {
          return globUnescape(pattern)
        }

        const flags = options.nocase ? 'i' : '';
        try {
          return Object.assign(new RegExp('^' + re + '$', flags), {
            _glob: pattern,
            _src: re,
          })
        } catch (er) /* istanbul ignore next - should be impossible */ {
          // If it was an invalid regular expression, then it can't match
          // anything.  This trick looks for a character after the end of
          // the string, which is of course impossible, except in multi-line
          // mode, but it's not a /m regex.
          return new RegExp('$.')
        }
      }

      makeRe () {
        if (this.regexp || this.regexp === false) return this.regexp

        // at this point, this.set is a 2d array of partial
        // pattern strings, or "**".
        //
        // It's better to use .match().  This function shouldn't
        // be used, really, but it's pretty convenient sometimes,
        // when you just want to work with a regex.
        const set = this.set;

        if (!set.length) {
          this.regexp = false;
          return this.regexp
        }
        const options = this.options;

        const twoStar = options.noglobstar ? star
          : options.dot ? twoStarDot
          : twoStarNoDot;
        const flags = options.nocase ? 'i' : '';

        // coalesce globstars and regexpify non-globstar patterns
        // if it's the only item, then we just do one twoStar
        // if it's the first, and there are more, prepend (\/|twoStar\/)? to next
        // if it's the last, append (\/twoStar|) to previous
        // if it's in the middle, append (\/|\/twoStar\/) to previous
        // then filter out GLOBSTAR symbols
        let re = set.map(pattern => {
          pattern = pattern.map(p =>
            typeof p === 'string' ? regExpEscape(p)
            : p === GLOBSTAR ? GLOBSTAR
            : p._src
          ).reduce((set, p) => {
            if (!(set[set.length - 1] === GLOBSTAR && p === GLOBSTAR)) {
              set.push(p);
            }
            return set
          }, []);
          pattern.forEach((p, i) => {
            if (p !== GLOBSTAR || pattern[i-1] === GLOBSTAR) {
              return
            }
            if (i === 0) {
              if (pattern.length > 1) {
                pattern[i+1] = '(?:\\\/|' + twoStar + '\\\/)?' + pattern[i+1];
              } else {
                pattern[i] = twoStar;
              }
            } else if (i === pattern.length - 1) {
              pattern[i-1] += '(?:\\\/|' + twoStar + ')?';
            } else {
              pattern[i-1] += '(?:\\\/|\\\/' + twoStar + '\\\/)' + pattern[i+1];
              pattern[i+1] = GLOBSTAR;
            }
          });
          return pattern.filter(p => p !== GLOBSTAR).join('/')
        }).join('|');

        // must match entire pattern
        // ending in a * or ** will make it less strict.
        re = '^(?:' + re + ')$';

        // can match anything, as long as it's not this.
        if (this.negate) re = '^(?!' + re + ').*$';

        try {
          this.regexp = new RegExp(re, flags);
        } catch (ex) /* istanbul ignore next - should be impossible */ {
          this.regexp = false;
        }
        return this.regexp
      }

      match (f, partial = this.partial) {
        this.debug('match', f, this.pattern);
        // short-circuit in the case of busted things.
        // comments, etc.
        if (this.comment) return false
        if (this.empty) return f === ''

        if (f === '/' && partial) return true

        const options = this.options;

        // windows: need to use /, not \
        if (path$1.sep !== '/') {
          f = f.split(path$1.sep).join('/');
        }

        // treat the test path as a set of pathparts.
        f = f.split(slashSplit);
        this.debug(this.pattern, 'split', f);

        // just ONE of the pattern sets in this.set needs to match
        // in order for it to be valid.  If negating, then just one
        // match means that we have failed.
        // Either way, return on the first hit.

        const set = this.set;
        this.debug(this.pattern, 'set', set);

        // Find the basename of the path by looking for the last non-empty segment
        let filename;
        for (let i = f.length - 1; i >= 0; i--) {
          filename = f[i];
          if (filename) break
        }

        for (let i = 0; i < set.length; i++) {
          const pattern = set[i];
          let file = f;
          if (options.matchBase && pattern.length === 1) {
            file = [filename];
          }
          const hit = this.matchOne(file, pattern, partial);
          if (hit) {
            if (options.flipNegate) return true
            return !this.negate
          }
        }

        // didn't get any hits.  this is success if it's a negative
        // pattern, failure otherwise.
        if (options.flipNegate) return false
        return this.negate
      }

      static defaults (def) {
        return minimatch$1.defaults(def).Minimatch
      }
    }

    minimatch$1.Minimatch = Minimatch$1;

    var inherits_browserExports = {};
    var inherits_browser = {
      get exports(){ return inherits_browserExports; },
      set exports(v){ inherits_browserExports = v; },
    };

    if (typeof Object.create === 'function') {
      // implementation from standard node.js 'util' module
      inherits_browser.exports = function inherits(ctor, superCtor) {
        if (superCtor) {
          ctor.super_ = superCtor;
          ctor.prototype = Object.create(superCtor.prototype, {
            constructor: {
              value: ctor,
              enumerable: false,
              writable: true,
              configurable: true
            }
          });
        }
      };
    } else {
      // old school shim for old browsers
      inherits_browser.exports = function inherits(ctor, superCtor) {
        if (superCtor) {
          ctor.super_ = superCtor;
          var TempCtor = function () {};
          TempCtor.prototype = superCtor.prototype;
          ctor.prototype = new TempCtor();
          ctor.prototype.constructor = ctor;
        }
      };
    }

    var common = {};

    common.setopts = setopts;
    common.ownProp = ownProp;
    common.makeAbs = makeAbs;
    common.finish = finish;
    common.mark = mark;
    common.isIgnored = isIgnored;
    common.childrenIgnored = childrenIgnored;

    function ownProp (obj, field) {
      return Object.prototype.hasOwnProperty.call(obj, field)
    }

    var fs = require$$0__default["default"];
    var path = require$$4__default["default"];
    var minimatch = minimatch_1;
    var isAbsolute = require$$4__default["default"].isAbsolute;
    var Minimatch = minimatch.Minimatch;

    function alphasort (a, b) {
      return a.localeCompare(b, 'en')
    }

    function setupIgnores (self, options) {
      self.ignore = options.ignore || [];

      if (!Array.isArray(self.ignore))
        self.ignore = [self.ignore];

      if (self.ignore.length) {
        self.ignore = self.ignore.map(ignoreMap);
      }
    }

    // ignore patterns are always in dot:true mode.
    function ignoreMap (pattern) {
      var gmatcher = null;
      if (pattern.slice(-3) === '/**') {
        var gpattern = pattern.replace(/(\/\*\*)+$/, '');
        gmatcher = new Minimatch(gpattern, { dot: true });
      }

      return {
        matcher: new Minimatch(pattern, { dot: true }),
        gmatcher: gmatcher
      }
    }

    function setopts (self, pattern, options) {
      if (!options)
        options = {};

      // base-matching: just use globstar for that.
      if (options.matchBase && -1 === pattern.indexOf("/")) {
        if (options.noglobstar) {
          throw new Error("base matching requires globstar")
        }
        pattern = "**/" + pattern;
      }

      self.windowsPathsNoEscape = !!options.windowsPathsNoEscape ||
        options.allowWindowsEscape === false;
      if (self.windowsPathsNoEscape) {
        pattern = pattern.replace(/\\/g, '/');
      }

      self.silent = !!options.silent;
      self.pattern = pattern;
      self.strict = options.strict !== false;
      self.realpath = !!options.realpath;
      self.realpathCache = options.realpathCache || Object.create(null);
      self.follow = !!options.follow;
      self.dot = !!options.dot;
      self.mark = !!options.mark;
      self.nodir = !!options.nodir;
      if (self.nodir)
        self.mark = true;
      self.sync = !!options.sync;
      self.nounique = !!options.nounique;
      self.nonull = !!options.nonull;
      self.nosort = !!options.nosort;
      self.nocase = !!options.nocase;
      self.stat = !!options.stat;
      self.noprocess = !!options.noprocess;
      self.absolute = !!options.absolute;
      self.fs = options.fs || fs;

      self.maxLength = options.maxLength || Infinity;
      self.cache = options.cache || Object.create(null);
      self.statCache = options.statCache || Object.create(null);
      self.symlinks = options.symlinks || Object.create(null);

      setupIgnores(self, options);

      self.changedCwd = false;
      var cwd = process.cwd();
      if (!ownProp(options, "cwd"))
        self.cwd = path.resolve(cwd);
      else {
        self.cwd = path.resolve(options.cwd);
        self.changedCwd = self.cwd !== cwd;
      }

      self.root = options.root || path.resolve(self.cwd, "/");
      self.root = path.resolve(self.root);

      // TODO: is an absolute `cwd` supposed to be resolved against `root`?
      // e.g. { cwd: '/test', root: __dirname } === path.join(__dirname, '/test')
      self.cwdAbs = isAbsolute(self.cwd) ? self.cwd : makeAbs(self, self.cwd);
      self.nomount = !!options.nomount;

      if (process.platform === "win32") {
        self.root = self.root.replace(/\\/g, "/");
        self.cwd = self.cwd.replace(/\\/g, "/");
        self.cwdAbs = self.cwdAbs.replace(/\\/g, "/");
      }

      // disable comments and negation in Minimatch.
      // Note that they are not supported in Glob itself anyway.
      options.nonegate = true;
      options.nocomment = true;

      self.minimatch = new Minimatch(pattern, options);
      self.options = self.minimatch.options;
    }

    function finish (self) {
      var nou = self.nounique;
      var all = nou ? [] : Object.create(null);

      for (var i = 0, l = self.matches.length; i < l; i ++) {
        var matches = self.matches[i];
        if (!matches || Object.keys(matches).length === 0) {
          if (self.nonull) {
            // do like the shell, and spit out the literal glob
            var literal = self.minimatch.globSet[i];
            if (nou)
              all.push(literal);
            else
              all[literal] = true;
          }
        } else {
          // had matches
          var m = Object.keys(matches);
          if (nou)
            all.push.apply(all, m);
          else
            m.forEach(function (m) {
              all[m] = true;
            });
        }
      }

      if (!nou)
        all = Object.keys(all);

      if (!self.nosort)
        all = all.sort(alphasort);

      // at *some* point we statted all of these
      if (self.mark) {
        for (var i = 0; i < all.length; i++) {
          all[i] = self._mark(all[i]);
        }
        if (self.nodir) {
          all = all.filter(function (e) {
            var notDir = !(/\/$/.test(e));
            var c = self.cache[e] || self.cache[makeAbs(self, e)];
            if (notDir && c)
              notDir = c !== 'DIR' && !Array.isArray(c);
            return notDir
          });
        }
      }

      if (self.ignore.length)
        all = all.filter(function(m) {
          return !isIgnored(self, m)
        });

      self.found = all;
    }

    function mark (self, p) {
      var abs = makeAbs(self, p);
      var c = self.cache[abs];
      var m = p;
      if (c) {
        var isDir = c === 'DIR' || Array.isArray(c);
        var slash = p.slice(-1) === '/';

        if (isDir && !slash)
          m += '/';
        else if (!isDir && slash)
          m = m.slice(0, -1);

        if (m !== p) {
          var mabs = makeAbs(self, m);
          self.statCache[mabs] = self.statCache[abs];
          self.cache[mabs] = self.cache[abs];
        }
      }

      return m
    }

    // lotta situps...
    function makeAbs (self, f) {
      var abs = f;
      if (f.charAt(0) === '/') {
        abs = path.join(self.root, f);
      } else if (isAbsolute(f) || f === '') {
        abs = f;
      } else if (self.changedCwd) {
        abs = path.resolve(self.cwd, f);
      } else {
        abs = path.resolve(f);
      }

      if (process.platform === 'win32')
        abs = abs.replace(/\\/g, '/');

      return abs
    }


    // Return true, if pattern ends with globstar '**', for the accompanying parent directory.
    // Ex:- If node_modules/** is the pattern, add 'node_modules' to ignore list along with it's contents
    function isIgnored (self, path) {
      if (!self.ignore.length)
        return false

      return self.ignore.some(function(item) {
        return item.matcher.match(path) || !!(item.gmatcher && item.gmatcher.match(path))
      })
    }

    function childrenIgnored (self, path) {
      if (!self.ignore.length)
        return false

      return self.ignore.some(function(item) {
        return !!(item.gmatcher && item.gmatcher.match(path))
      })
    }

    var sync;
    var hasRequiredSync;

    function requireSync () {
    	if (hasRequiredSync) return sync;
    	hasRequiredSync = 1;
    	sync = globSync;
    	globSync.GlobSync = GlobSync;

    	var rp = fs_realpath;
    	var minimatch = minimatch_1;
    	minimatch.Minimatch;
    	requireGlob().Glob;
    	var path = require$$4__default["default"];
    	var assert = require$$5__default["default"];
    	var isAbsolute = require$$4__default["default"].isAbsolute;
    	var common$1 = common;
    	var setopts = common$1.setopts;
    	var ownProp = common$1.ownProp;
    	var childrenIgnored = common$1.childrenIgnored;
    	var isIgnored = common$1.isIgnored;

    	function globSync (pattern, options) {
    	  if (typeof options === 'function' || arguments.length === 3)
    	    throw new TypeError('callback provided to sync glob\n'+
    	                        'See: https://github.com/isaacs/node-glob/issues/167')

    	  return new GlobSync(pattern, options).found
    	}

    	function GlobSync (pattern, options) {
    	  if (!pattern)
    	    throw new Error('must provide pattern')

    	  if (typeof options === 'function' || arguments.length === 3)
    	    throw new TypeError('callback provided to sync glob\n'+
    	                        'See: https://github.com/isaacs/node-glob/issues/167')

    	  if (!(this instanceof GlobSync))
    	    return new GlobSync(pattern, options)

    	  setopts(this, pattern, options);

    	  if (this.noprocess)
    	    return this

    	  var n = this.minimatch.set.length;
    	  this.matches = new Array(n);
    	  for (var i = 0; i < n; i ++) {
    	    this._process(this.minimatch.set[i], i, false);
    	  }
    	  this._finish();
    	}

    	GlobSync.prototype._finish = function () {
    	  assert.ok(this instanceof GlobSync);
    	  if (this.realpath) {
    	    var self = this;
    	    this.matches.forEach(function (matchset, index) {
    	      var set = self.matches[index] = Object.create(null);
    	      for (var p in matchset) {
    	        try {
    	          p = self._makeAbs(p);
    	          var real = rp.realpathSync(p, self.realpathCache);
    	          set[real] = true;
    	        } catch (er) {
    	          if (er.syscall === 'stat')
    	            set[self._makeAbs(p)] = true;
    	          else
    	            throw er
    	        }
    	      }
    	    });
    	  }
    	  common$1.finish(this);
    	};


    	GlobSync.prototype._process = function (pattern, index, inGlobStar) {
    	  assert.ok(this instanceof GlobSync);

    	  // Get the first [n] parts of pattern that are all strings.
    	  var n = 0;
    	  while (typeof pattern[n] === 'string') {
    	    n ++;
    	  }
    	  // now n is the index of the first one that is *not* a string.

    	  // See if there's anything else
    	  var prefix;
    	  switch (n) {
    	    // if not, then this is rather simple
    	    case pattern.length:
    	      this._processSimple(pattern.join('/'), index);
    	      return

    	    case 0:
    	      // pattern *starts* with some non-trivial item.
    	      // going to readdir(cwd), but not include the prefix in matches.
    	      prefix = null;
    	      break

    	    default:
    	      // pattern has some string bits in the front.
    	      // whatever it starts with, whether that's 'absolute' like /foo/bar,
    	      // or 'relative' like '../baz'
    	      prefix = pattern.slice(0, n).join('/');
    	      break
    	  }

    	  var remain = pattern.slice(n);

    	  // get the list of entries.
    	  var read;
    	  if (prefix === null)
    	    read = '.';
    	  else if (isAbsolute(prefix) ||
    	      isAbsolute(pattern.map(function (p) {
    	        return typeof p === 'string' ? p : '[*]'
    	      }).join('/'))) {
    	    if (!prefix || !isAbsolute(prefix))
    	      prefix = '/' + prefix;
    	    read = prefix;
    	  } else
    	    read = prefix;

    	  var abs = this._makeAbs(read);

    	  //if ignored, skip processing
    	  if (childrenIgnored(this, read))
    	    return

    	  var isGlobStar = remain[0] === minimatch.GLOBSTAR;
    	  if (isGlobStar)
    	    this._processGlobStar(prefix, read, abs, remain, index, inGlobStar);
    	  else
    	    this._processReaddir(prefix, read, abs, remain, index, inGlobStar);
    	};


    	GlobSync.prototype._processReaddir = function (prefix, read, abs, remain, index, inGlobStar) {
    	  var entries = this._readdir(abs, inGlobStar);

    	  // if the abs isn't a dir, then nothing can match!
    	  if (!entries)
    	    return

    	  // It will only match dot entries if it starts with a dot, or if
    	  // dot is set.  Stuff like @(.foo|.bar) isn't allowed.
    	  var pn = remain[0];
    	  var negate = !!this.minimatch.negate;
    	  var rawGlob = pn._glob;
    	  var dotOk = this.dot || rawGlob.charAt(0) === '.';

    	  var matchedEntries = [];
    	  for (var i = 0; i < entries.length; i++) {
    	    var e = entries[i];
    	    if (e.charAt(0) !== '.' || dotOk) {
    	      var m;
    	      if (negate && !prefix) {
    	        m = !e.match(pn);
    	      } else {
    	        m = e.match(pn);
    	      }
    	      if (m)
    	        matchedEntries.push(e);
    	    }
    	  }

    	  var len = matchedEntries.length;
    	  // If there are no matched entries, then nothing matches.
    	  if (len === 0)
    	    return

    	  // if this is the last remaining pattern bit, then no need for
    	  // an additional stat *unless* the user has specified mark or
    	  // stat explicitly.  We know they exist, since readdir returned
    	  // them.

    	  if (remain.length === 1 && !this.mark && !this.stat) {
    	    if (!this.matches[index])
    	      this.matches[index] = Object.create(null);

    	    for (var i = 0; i < len; i ++) {
    	      var e = matchedEntries[i];
    	      if (prefix) {
    	        if (prefix.slice(-1) !== '/')
    	          e = prefix + '/' + e;
    	        else
    	          e = prefix + e;
    	      }

    	      if (e.charAt(0) === '/' && !this.nomount) {
    	        e = path.join(this.root, e);
    	      }
    	      this._emitMatch(index, e);
    	    }
    	    // This was the last one, and no stats were needed
    	    return
    	  }

    	  // now test all matched entries as stand-ins for that part
    	  // of the pattern.
    	  remain.shift();
    	  for (var i = 0; i < len; i ++) {
    	    var e = matchedEntries[i];
    	    var newPattern;
    	    if (prefix)
    	      newPattern = [prefix, e];
    	    else
    	      newPattern = [e];
    	    this._process(newPattern.concat(remain), index, inGlobStar);
    	  }
    	};


    	GlobSync.prototype._emitMatch = function (index, e) {
    	  if (isIgnored(this, e))
    	    return

    	  var abs = this._makeAbs(e);

    	  if (this.mark)
    	    e = this._mark(e);

    	  if (this.absolute) {
    	    e = abs;
    	  }

    	  if (this.matches[index][e])
    	    return

    	  if (this.nodir) {
    	    var c = this.cache[abs];
    	    if (c === 'DIR' || Array.isArray(c))
    	      return
    	  }

    	  this.matches[index][e] = true;

    	  if (this.stat)
    	    this._stat(e);
    	};


    	GlobSync.prototype._readdirInGlobStar = function (abs) {
    	  // follow all symlinked directories forever
    	  // just proceed as if this is a non-globstar situation
    	  if (this.follow)
    	    return this._readdir(abs, false)

    	  var entries;
    	  var lstat;
    	  try {
    	    lstat = this.fs.lstatSync(abs);
    	  } catch (er) {
    	    if (er.code === 'ENOENT') {
    	      // lstat failed, doesn't exist
    	      return null
    	    }
    	  }

    	  var isSym = lstat && lstat.isSymbolicLink();
    	  this.symlinks[abs] = isSym;

    	  // If it's not a symlink or a dir, then it's definitely a regular file.
    	  // don't bother doing a readdir in that case.
    	  if (!isSym && lstat && !lstat.isDirectory())
    	    this.cache[abs] = 'FILE';
    	  else
    	    entries = this._readdir(abs, false);

    	  return entries
    	};

    	GlobSync.prototype._readdir = function (abs, inGlobStar) {

    	  if (inGlobStar && !ownProp(this.symlinks, abs))
    	    return this._readdirInGlobStar(abs)

    	  if (ownProp(this.cache, abs)) {
    	    var c = this.cache[abs];
    	    if (!c || c === 'FILE')
    	      return null

    	    if (Array.isArray(c))
    	      return c
    	  }

    	  try {
    	    return this._readdirEntries(abs, this.fs.readdirSync(abs))
    	  } catch (er) {
    	    this._readdirError(abs, er);
    	    return null
    	  }
    	};

    	GlobSync.prototype._readdirEntries = function (abs, entries) {
    	  // if we haven't asked to stat everything, then just
    	  // assume that everything in there exists, so we can avoid
    	  // having to stat it a second time.
    	  if (!this.mark && !this.stat) {
    	    for (var i = 0; i < entries.length; i ++) {
    	      var e = entries[i];
    	      if (abs === '/')
    	        e = abs + e;
    	      else
    	        e = abs + '/' + e;
    	      this.cache[e] = true;
    	    }
    	  }

    	  this.cache[abs] = entries;

    	  // mark and cache dir-ness
    	  return entries
    	};

    	GlobSync.prototype._readdirError = function (f, er) {
    	  // handle errors, and cache the information
    	  switch (er.code) {
    	    case 'ENOTSUP': // https://github.com/isaacs/node-glob/issues/205
    	    case 'ENOTDIR': // totally normal. means it *does* exist.
    	      var abs = this._makeAbs(f);
    	      this.cache[abs] = 'FILE';
    	      if (abs === this.cwdAbs) {
    	        var error = new Error(er.code + ' invalid cwd ' + this.cwd);
    	        error.path = this.cwd;
    	        error.code = er.code;
    	        throw error
    	      }
    	      break

    	    case 'ENOENT': // not terribly unusual
    	    case 'ELOOP':
    	    case 'ENAMETOOLONG':
    	    case 'UNKNOWN':
    	      this.cache[this._makeAbs(f)] = false;
    	      break

    	    default: // some unusual error.  Treat as failure.
    	      this.cache[this._makeAbs(f)] = false;
    	      if (this.strict)
    	        throw er
    	      if (!this.silent)
    	        console.error('glob error', er);
    	      break
    	  }
    	};

    	GlobSync.prototype._processGlobStar = function (prefix, read, abs, remain, index, inGlobStar) {

    	  var entries = this._readdir(abs, inGlobStar);

    	  // no entries means not a dir, so it can never have matches
    	  // foo.txt/** doesn't match foo.txt
    	  if (!entries)
    	    return

    	  // test without the globstar, and with every child both below
    	  // and replacing the globstar.
    	  var remainWithoutGlobStar = remain.slice(1);
    	  var gspref = prefix ? [ prefix ] : [];
    	  var noGlobStar = gspref.concat(remainWithoutGlobStar);

    	  // the noGlobStar pattern exits the inGlobStar state
    	  this._process(noGlobStar, index, false);

    	  var len = entries.length;
    	  var isSym = this.symlinks[abs];

    	  // If it's a symlink, and we're in a globstar, then stop
    	  if (isSym && inGlobStar)
    	    return

    	  for (var i = 0; i < len; i++) {
    	    var e = entries[i];
    	    if (e.charAt(0) === '.' && !this.dot)
    	      continue

    	    // these two cases enter the inGlobStar state
    	    var instead = gspref.concat(entries[i], remainWithoutGlobStar);
    	    this._process(instead, index, true);

    	    var below = gspref.concat(entries[i], remain);
    	    this._process(below, index, true);
    	  }
    	};

    	GlobSync.prototype._processSimple = function (prefix, index) {
    	  // XXX review this.  Shouldn't it be doing the mounting etc
    	  // before doing stat?  kinda weird?
    	  var exists = this._stat(prefix);

    	  if (!this.matches[index])
    	    this.matches[index] = Object.create(null);

    	  // If it doesn't exist, then just mark the lack of results
    	  if (!exists)
    	    return

    	  if (prefix && isAbsolute(prefix) && !this.nomount) {
    	    var trail = /[\/\\]$/.test(prefix);
    	    if (prefix.charAt(0) === '/') {
    	      prefix = path.join(this.root, prefix);
    	    } else {
    	      prefix = path.resolve(this.root, prefix);
    	      if (trail)
    	        prefix += '/';
    	    }
    	  }

    	  if (process.platform === 'win32')
    	    prefix = prefix.replace(/\\/g, '/');

    	  // Mark this as a match
    	  this._emitMatch(index, prefix);
    	};

    	// Returns either 'DIR', 'FILE', or false
    	GlobSync.prototype._stat = function (f) {
    	  var abs = this._makeAbs(f);
    	  var needDir = f.slice(-1) === '/';

    	  if (f.length > this.maxLength)
    	    return false

    	  if (!this.stat && ownProp(this.cache, abs)) {
    	    var c = this.cache[abs];

    	    if (Array.isArray(c))
    	      c = 'DIR';

    	    // It exists, but maybe not how we need it
    	    if (!needDir || c === 'DIR')
    	      return c

    	    if (needDir && c === 'FILE')
    	      return false

    	    // otherwise we have to stat, because maybe c=true
    	    // if we know it exists, but not what it is.
    	  }
    	  var stat = this.statCache[abs];
    	  if (!stat) {
    	    var lstat;
    	    try {
    	      lstat = this.fs.lstatSync(abs);
    	    } catch (er) {
    	      if (er && (er.code === 'ENOENT' || er.code === 'ENOTDIR')) {
    	        this.statCache[abs] = false;
    	        return false
    	      }
    	    }

    	    if (lstat && lstat.isSymbolicLink()) {
    	      try {
    	        stat = this.fs.statSync(abs);
    	      } catch (er) {
    	        stat = lstat;
    	      }
    	    } else {
    	      stat = lstat;
    	    }
    	  }

    	  this.statCache[abs] = stat;

    	  var c = true;
    	  if (stat)
    	    c = stat.isDirectory() ? 'DIR' : 'FILE';

    	  this.cache[abs] = this.cache[abs] || c;

    	  if (needDir && c === 'FILE')
    	    return false

    	  return c
    	};

    	GlobSync.prototype._mark = function (p) {
    	  return common$1.mark(this, p)
    	};

    	GlobSync.prototype._makeAbs = function (f) {
    	  return common$1.makeAbs(this, f)
    	};
    	return sync;
    }

    // Returns a wrapper function that returns a wrapped callback
    // The wrapper function should do some stuff, and return a
    // presumably different callback function.
    // This makes sure that own properties are retained, so that
    // decorations and such are not lost along the way.
    var wrappy_1 = wrappy$2;
    function wrappy$2 (fn, cb) {
      if (fn && cb) return wrappy$2(fn)(cb)

      if (typeof fn !== 'function')
        throw new TypeError('need wrapper function')

      Object.keys(fn).forEach(function (k) {
        wrapper[k] = fn[k];
      });

      return wrapper

      function wrapper() {
        var args = new Array(arguments.length);
        for (var i = 0; i < args.length; i++) {
          args[i] = arguments[i];
        }
        var ret = fn.apply(this, args);
        var cb = args[args.length-1];
        if (typeof ret === 'function' && ret !== cb) {
          Object.keys(cb).forEach(function (k) {
            ret[k] = cb[k];
          });
        }
        return ret
      }
    }

    var onceExports = {};
    var once$2 = {
      get exports(){ return onceExports; },
      set exports(v){ onceExports = v; },
    };

    var wrappy$1 = wrappy_1;
    once$2.exports = wrappy$1(once$1);
    onceExports.strict = wrappy$1(onceStrict);

    once$1.proto = once$1(function () {
      Object.defineProperty(Function.prototype, 'once', {
        value: function () {
          return once$1(this)
        },
        configurable: true
      });

      Object.defineProperty(Function.prototype, 'onceStrict', {
        value: function () {
          return onceStrict(this)
        },
        configurable: true
      });
    });

    function once$1 (fn) {
      var f = function () {
        if (f.called) return f.value
        f.called = true;
        return f.value = fn.apply(this, arguments)
      };
      f.called = false;
      return f
    }

    function onceStrict (fn) {
      var f = function () {
        if (f.called)
          throw new Error(f.onceError)
        f.called = true;
        return f.value = fn.apply(this, arguments)
      };
      var name = fn.name || 'Function wrapped with `once`';
      f.onceError = name + " shouldn't be called more than once";
      f.called = false;
      return f
    }

    var wrappy = wrappy_1;
    var reqs = Object.create(null);
    var once = onceExports;

    var inflight_1 = wrappy(inflight);

    function inflight (key, cb) {
      if (reqs[key]) {
        reqs[key].push(cb);
        return null
      } else {
        reqs[key] = [cb];
        return makeres(key)
      }
    }

    function makeres (key) {
      return once(function RES () {
        var cbs = reqs[key];
        var len = cbs.length;
        var args = slice(arguments);

        // XXX It's somewhat ambiguous whether a new callback added in this
        // pass should be queued for later execution if something in the
        // list of callbacks throws, or if it should just be discarded.
        // However, it's such an edge case that it hardly matters, and either
        // choice is likely as surprising as the other.
        // As it happens, we do go ahead and schedule it for later execution.
        try {
          for (var i = 0; i < len; i++) {
            cbs[i].apply(null, args);
          }
        } finally {
          if (cbs.length > len) {
            // added more in the interim.
            // de-zalgo, just in case, but don't call again.
            cbs.splice(0, len);
            process.nextTick(function () {
              RES.apply(null, args);
            });
          } else {
            delete reqs[key];
          }
        }
      })
    }

    function slice (args) {
      var length = args.length;
      var array = [];

      for (var i = 0; i < length; i++) array[i] = args[i];
      return array
    }

    var glob_1;
    var hasRequiredGlob;

    function requireGlob () {
    	if (hasRequiredGlob) return glob_1;
    	hasRequiredGlob = 1;
    	// Approach:
    	//
    	// 1. Get the minimatch set
    	// 2. For each pattern in the set, PROCESS(pattern, false)
    	// 3. Store matches per-set, then uniq them
    	//
    	// PROCESS(pattern, inGlobStar)
    	// Get the first [n] items from pattern that are all strings
    	// Join these together.  This is PREFIX.
    	//   If there is no more remaining, then stat(PREFIX) and
    	//   add to matches if it succeeds.  END.
    	//
    	// If inGlobStar and PREFIX is symlink and points to dir
    	//   set ENTRIES = []
    	// else readdir(PREFIX) as ENTRIES
    	//   If fail, END
    	//
    	// with ENTRIES
    	//   If pattern[n] is GLOBSTAR
    	//     // handle the case where the globstar match is empty
    	//     // by pruning it out, and testing the resulting pattern
    	//     PROCESS(pattern[0..n] + pattern[n+1 .. $], false)
    	//     // handle other cases.
    	//     for ENTRY in ENTRIES (not dotfiles)
    	//       // attach globstar + tail onto the entry
    	//       // Mark that this entry is a globstar match
    	//       PROCESS(pattern[0..n] + ENTRY + pattern[n .. $], true)
    	//
    	//   else // not globstar
    	//     for ENTRY in ENTRIES (not dotfiles, unless pattern[n] is dot)
    	//       Test ENTRY against pattern[n]
    	//       If fails, continue
    	//       If passes, PROCESS(pattern[0..n] + item + pattern[n+1 .. $])
    	//
    	// Caveat:
    	//   Cache all stats and readdirs results to minimize syscall.  Since all
    	//   we ever care about is existence and directory-ness, we can just keep
    	//   `true` for files, and [children,...] for directories, or `false` for
    	//   things that don't exist.

    	glob_1 = glob;

    	var rp = fs_realpath;
    	var minimatch = minimatch_1;
    	minimatch.Minimatch;
    	var inherits = inherits_browserExports;
    	var EE = require$$3__default["default"].EventEmitter;
    	var path = require$$4__default["default"];
    	var assert = require$$5__default["default"];
    	var isAbsolute = require$$4__default["default"].isAbsolute;
    	var globSync = requireSync();
    	var common$1 = common;
    	var setopts = common$1.setopts;
    	var ownProp = common$1.ownProp;
    	var inflight = inflight_1;
    	var childrenIgnored = common$1.childrenIgnored;
    	var isIgnored = common$1.isIgnored;

    	var once = onceExports;

    	function glob (pattern, options, cb) {
    	  if (typeof options === 'function') cb = options, options = {};
    	  if (!options) options = {};

    	  if (options.sync) {
    	    if (cb)
    	      throw new TypeError('callback provided to sync glob')
    	    return globSync(pattern, options)
    	  }

    	  return new Glob(pattern, options, cb)
    	}

    	glob.sync = globSync;
    	var GlobSync = glob.GlobSync = globSync.GlobSync;

    	// old api surface
    	glob.glob = glob;

    	function extend (origin, add) {
    	  if (add === null || typeof add !== 'object') {
    	    return origin
    	  }

    	  var keys = Object.keys(add);
    	  var i = keys.length;
    	  while (i--) {
    	    origin[keys[i]] = add[keys[i]];
    	  }
    	  return origin
    	}

    	glob.hasMagic = function (pattern, options_) {
    	  var options = extend({}, options_);
    	  options.noprocess = true;

    	  var g = new Glob(pattern, options);
    	  var set = g.minimatch.set;

    	  if (!pattern)
    	    return false

    	  if (set.length > 1)
    	    return true

    	  for (var j = 0; j < set[0].length; j++) {
    	    if (typeof set[0][j] !== 'string')
    	      return true
    	  }

    	  return false
    	};

    	glob.Glob = Glob;
    	inherits(Glob, EE);
    	function Glob (pattern, options, cb) {
    	  if (typeof options === 'function') {
    	    cb = options;
    	    options = null;
    	  }

    	  if (options && options.sync) {
    	    if (cb)
    	      throw new TypeError('callback provided to sync glob')
    	    return new GlobSync(pattern, options)
    	  }

    	  if (!(this instanceof Glob))
    	    return new Glob(pattern, options, cb)

    	  setopts(this, pattern, options);
    	  this._didRealPath = false;

    	  // process each pattern in the minimatch set
    	  var n = this.minimatch.set.length;

    	  // The matches are stored as {<filename>: true,...} so that
    	  // duplicates are automagically pruned.
    	  // Later, we do an Object.keys() on these.
    	  // Keep them as a list so we can fill in when nonull is set.
    	  this.matches = new Array(n);

    	  if (typeof cb === 'function') {
    	    cb = once(cb);
    	    this.on('error', cb);
    	    this.on('end', function (matches) {
    	      cb(null, matches);
    	    });
    	  }

    	  var self = this;
    	  this._processing = 0;

    	  this._emitQueue = [];
    	  this._processQueue = [];
    	  this.paused = false;

    	  if (this.noprocess)
    	    return this

    	  if (n === 0)
    	    return done()

    	  var sync = true;
    	  for (var i = 0; i < n; i ++) {
    	    this._process(this.minimatch.set[i], i, false, done);
    	  }
    	  sync = false;

    	  function done () {
    	    --self._processing;
    	    if (self._processing <= 0) {
    	      if (sync) {
    	        process.nextTick(function () {
    	          self._finish();
    	        });
    	      } else {
    	        self._finish();
    	      }
    	    }
    	  }
    	}

    	Glob.prototype._finish = function () {
    	  assert(this instanceof Glob);
    	  if (this.aborted)
    	    return

    	  if (this.realpath && !this._didRealpath)
    	    return this._realpath()

    	  common$1.finish(this);
    	  this.emit('end', this.found);
    	};

    	Glob.prototype._realpath = function () {
    	  if (this._didRealpath)
    	    return

    	  this._didRealpath = true;

    	  var n = this.matches.length;
    	  if (n === 0)
    	    return this._finish()

    	  var self = this;
    	  for (var i = 0; i < this.matches.length; i++)
    	    this._realpathSet(i, next);

    	  function next () {
    	    if (--n === 0)
    	      self._finish();
    	  }
    	};

    	Glob.prototype._realpathSet = function (index, cb) {
    	  var matchset = this.matches[index];
    	  if (!matchset)
    	    return cb()

    	  var found = Object.keys(matchset);
    	  var self = this;
    	  var n = found.length;

    	  if (n === 0)
    	    return cb()

    	  var set = this.matches[index] = Object.create(null);
    	  found.forEach(function (p, i) {
    	    // If there's a problem with the stat, then it means that
    	    // one or more of the links in the realpath couldn't be
    	    // resolved.  just return the abs value in that case.
    	    p = self._makeAbs(p);
    	    rp.realpath(p, self.realpathCache, function (er, real) {
    	      if (!er)
    	        set[real] = true;
    	      else if (er.syscall === 'stat')
    	        set[p] = true;
    	      else
    	        self.emit('error', er); // srsly wtf right here

    	      if (--n === 0) {
    	        self.matches[index] = set;
    	        cb();
    	      }
    	    });
    	  });
    	};

    	Glob.prototype._mark = function (p) {
    	  return common$1.mark(this, p)
    	};

    	Glob.prototype._makeAbs = function (f) {
    	  return common$1.makeAbs(this, f)
    	};

    	Glob.prototype.abort = function () {
    	  this.aborted = true;
    	  this.emit('abort');
    	};

    	Glob.prototype.pause = function () {
    	  if (!this.paused) {
    	    this.paused = true;
    	    this.emit('pause');
    	  }
    	};

    	Glob.prototype.resume = function () {
    	  if (this.paused) {
    	    this.emit('resume');
    	    this.paused = false;
    	    if (this._emitQueue.length) {
    	      var eq = this._emitQueue.slice(0);
    	      this._emitQueue.length = 0;
    	      for (var i = 0; i < eq.length; i ++) {
    	        var e = eq[i];
    	        this._emitMatch(e[0], e[1]);
    	      }
    	    }
    	    if (this._processQueue.length) {
    	      var pq = this._processQueue.slice(0);
    	      this._processQueue.length = 0;
    	      for (var i = 0; i < pq.length; i ++) {
    	        var p = pq[i];
    	        this._processing--;
    	        this._process(p[0], p[1], p[2], p[3]);
    	      }
    	    }
    	  }
    	};

    	Glob.prototype._process = function (pattern, index, inGlobStar, cb) {
    	  assert(this instanceof Glob);
    	  assert(typeof cb === 'function');

    	  if (this.aborted)
    	    return

    	  this._processing++;
    	  if (this.paused) {
    	    this._processQueue.push([pattern, index, inGlobStar, cb]);
    	    return
    	  }

    	  //console.error('PROCESS %d', this._processing, pattern)

    	  // Get the first [n] parts of pattern that are all strings.
    	  var n = 0;
    	  while (typeof pattern[n] === 'string') {
    	    n ++;
    	  }
    	  // now n is the index of the first one that is *not* a string.

    	  // see if there's anything else
    	  var prefix;
    	  switch (n) {
    	    // if not, then this is rather simple
    	    case pattern.length:
    	      this._processSimple(pattern.join('/'), index, cb);
    	      return

    	    case 0:
    	      // pattern *starts* with some non-trivial item.
    	      // going to readdir(cwd), but not include the prefix in matches.
    	      prefix = null;
    	      break

    	    default:
    	      // pattern has some string bits in the front.
    	      // whatever it starts with, whether that's 'absolute' like /foo/bar,
    	      // or 'relative' like '../baz'
    	      prefix = pattern.slice(0, n).join('/');
    	      break
    	  }

    	  var remain = pattern.slice(n);

    	  // get the list of entries.
    	  var read;
    	  if (prefix === null)
    	    read = '.';
    	  else if (isAbsolute(prefix) ||
    	      isAbsolute(pattern.map(function (p) {
    	        return typeof p === 'string' ? p : '[*]'
    	      }).join('/'))) {
    	    if (!prefix || !isAbsolute(prefix))
    	      prefix = '/' + prefix;
    	    read = prefix;
    	  } else
    	    read = prefix;

    	  var abs = this._makeAbs(read);

    	  //if ignored, skip _processing
    	  if (childrenIgnored(this, read))
    	    return cb()

    	  var isGlobStar = remain[0] === minimatch.GLOBSTAR;
    	  if (isGlobStar)
    	    this._processGlobStar(prefix, read, abs, remain, index, inGlobStar, cb);
    	  else
    	    this._processReaddir(prefix, read, abs, remain, index, inGlobStar, cb);
    	};

    	Glob.prototype._processReaddir = function (prefix, read, abs, remain, index, inGlobStar, cb) {
    	  var self = this;
    	  this._readdir(abs, inGlobStar, function (er, entries) {
    	    return self._processReaddir2(prefix, read, abs, remain, index, inGlobStar, entries, cb)
    	  });
    	};

    	Glob.prototype._processReaddir2 = function (prefix, read, abs, remain, index, inGlobStar, entries, cb) {

    	  // if the abs isn't a dir, then nothing can match!
    	  if (!entries)
    	    return cb()

    	  // It will only match dot entries if it starts with a dot, or if
    	  // dot is set.  Stuff like @(.foo|.bar) isn't allowed.
    	  var pn = remain[0];
    	  var negate = !!this.minimatch.negate;
    	  var rawGlob = pn._glob;
    	  var dotOk = this.dot || rawGlob.charAt(0) === '.';

    	  var matchedEntries = [];
    	  for (var i = 0; i < entries.length; i++) {
    	    var e = entries[i];
    	    if (e.charAt(0) !== '.' || dotOk) {
    	      var m;
    	      if (negate && !prefix) {
    	        m = !e.match(pn);
    	      } else {
    	        m = e.match(pn);
    	      }
    	      if (m)
    	        matchedEntries.push(e);
    	    }
    	  }

    	  //console.error('prd2', prefix, entries, remain[0]._glob, matchedEntries)

    	  var len = matchedEntries.length;
    	  // If there are no matched entries, then nothing matches.
    	  if (len === 0)
    	    return cb()

    	  // if this is the last remaining pattern bit, then no need for
    	  // an additional stat *unless* the user has specified mark or
    	  // stat explicitly.  We know they exist, since readdir returned
    	  // them.

    	  if (remain.length === 1 && !this.mark && !this.stat) {
    	    if (!this.matches[index])
    	      this.matches[index] = Object.create(null);

    	    for (var i = 0; i < len; i ++) {
    	      var e = matchedEntries[i];
    	      if (prefix) {
    	        if (prefix !== '/')
    	          e = prefix + '/' + e;
    	        else
    	          e = prefix + e;
    	      }

    	      if (e.charAt(0) === '/' && !this.nomount) {
    	        e = path.join(this.root, e);
    	      }
    	      this._emitMatch(index, e);
    	    }
    	    // This was the last one, and no stats were needed
    	    return cb()
    	  }

    	  // now test all matched entries as stand-ins for that part
    	  // of the pattern.
    	  remain.shift();
    	  for (var i = 0; i < len; i ++) {
    	    var e = matchedEntries[i];
    	    if (prefix) {
    	      if (prefix !== '/')
    	        e = prefix + '/' + e;
    	      else
    	        e = prefix + e;
    	    }
    	    this._process([e].concat(remain), index, inGlobStar, cb);
    	  }
    	  cb();
    	};

    	Glob.prototype._emitMatch = function (index, e) {
    	  if (this.aborted)
    	    return

    	  if (isIgnored(this, e))
    	    return

    	  if (this.paused) {
    	    this._emitQueue.push([index, e]);
    	    return
    	  }

    	  var abs = isAbsolute(e) ? e : this._makeAbs(e);

    	  if (this.mark)
    	    e = this._mark(e);

    	  if (this.absolute)
    	    e = abs;

    	  if (this.matches[index][e])
    	    return

    	  if (this.nodir) {
    	    var c = this.cache[abs];
    	    if (c === 'DIR' || Array.isArray(c))
    	      return
    	  }

    	  this.matches[index][e] = true;

    	  var st = this.statCache[abs];
    	  if (st)
    	    this.emit('stat', e, st);

    	  this.emit('match', e);
    	};

    	Glob.prototype._readdirInGlobStar = function (abs, cb) {
    	  if (this.aborted)
    	    return

    	  // follow all symlinked directories forever
    	  // just proceed as if this is a non-globstar situation
    	  if (this.follow)
    	    return this._readdir(abs, false, cb)

    	  var lstatkey = 'lstat\0' + abs;
    	  var self = this;
    	  var lstatcb = inflight(lstatkey, lstatcb_);

    	  if (lstatcb)
    	    self.fs.lstat(abs, lstatcb);

    	  function lstatcb_ (er, lstat) {
    	    if (er && er.code === 'ENOENT')
    	      return cb()

    	    var isSym = lstat && lstat.isSymbolicLink();
    	    self.symlinks[abs] = isSym;

    	    // If it's not a symlink or a dir, then it's definitely a regular file.
    	    // don't bother doing a readdir in that case.
    	    if (!isSym && lstat && !lstat.isDirectory()) {
    	      self.cache[abs] = 'FILE';
    	      cb();
    	    } else
    	      self._readdir(abs, false, cb);
    	  }
    	};

    	Glob.prototype._readdir = function (abs, inGlobStar, cb) {
    	  if (this.aborted)
    	    return

    	  cb = inflight('readdir\0'+abs+'\0'+inGlobStar, cb);
    	  if (!cb)
    	    return

    	  //console.error('RD %j %j', +inGlobStar, abs)
    	  if (inGlobStar && !ownProp(this.symlinks, abs))
    	    return this._readdirInGlobStar(abs, cb)

    	  if (ownProp(this.cache, abs)) {
    	    var c = this.cache[abs];
    	    if (!c || c === 'FILE')
    	      return cb()

    	    if (Array.isArray(c))
    	      return cb(null, c)
    	  }

    	  var self = this;
    	  self.fs.readdir(abs, readdirCb(this, abs, cb));
    	};

    	function readdirCb (self, abs, cb) {
    	  return function (er, entries) {
    	    if (er)
    	      self._readdirError(abs, er, cb);
    	    else
    	      self._readdirEntries(abs, entries, cb);
    	  }
    	}

    	Glob.prototype._readdirEntries = function (abs, entries, cb) {
    	  if (this.aborted)
    	    return

    	  // if we haven't asked to stat everything, then just
    	  // assume that everything in there exists, so we can avoid
    	  // having to stat it a second time.
    	  if (!this.mark && !this.stat) {
    	    for (var i = 0; i < entries.length; i ++) {
    	      var e = entries[i];
    	      if (abs === '/')
    	        e = abs + e;
    	      else
    	        e = abs + '/' + e;
    	      this.cache[e] = true;
    	    }
    	  }

    	  this.cache[abs] = entries;
    	  return cb(null, entries)
    	};

    	Glob.prototype._readdirError = function (f, er, cb) {
    	  if (this.aborted)
    	    return

    	  // handle errors, and cache the information
    	  switch (er.code) {
    	    case 'ENOTSUP': // https://github.com/isaacs/node-glob/issues/205
    	    case 'ENOTDIR': // totally normal. means it *does* exist.
    	      var abs = this._makeAbs(f);
    	      this.cache[abs] = 'FILE';
    	      if (abs === this.cwdAbs) {
    	        var error = new Error(er.code + ' invalid cwd ' + this.cwd);
    	        error.path = this.cwd;
    	        error.code = er.code;
    	        this.emit('error', error);
    	        this.abort();
    	      }
    	      break

    	    case 'ENOENT': // not terribly unusual
    	    case 'ELOOP':
    	    case 'ENAMETOOLONG':
    	    case 'UNKNOWN':
    	      this.cache[this._makeAbs(f)] = false;
    	      break

    	    default: // some unusual error.  Treat as failure.
    	      this.cache[this._makeAbs(f)] = false;
    	      if (this.strict) {
    	        this.emit('error', er);
    	        // If the error is handled, then we abort
    	        // if not, we threw out of here
    	        this.abort();
    	      }
    	      if (!this.silent)
    	        console.error('glob error', er);
    	      break
    	  }

    	  return cb()
    	};

    	Glob.prototype._processGlobStar = function (prefix, read, abs, remain, index, inGlobStar, cb) {
    	  var self = this;
    	  this._readdir(abs, inGlobStar, function (er, entries) {
    	    self._processGlobStar2(prefix, read, abs, remain, index, inGlobStar, entries, cb);
    	  });
    	};


    	Glob.prototype._processGlobStar2 = function (prefix, read, abs, remain, index, inGlobStar, entries, cb) {
    	  //console.error('pgs2', prefix, remain[0], entries)

    	  // no entries means not a dir, so it can never have matches
    	  // foo.txt/** doesn't match foo.txt
    	  if (!entries)
    	    return cb()

    	  // test without the globstar, and with every child both below
    	  // and replacing the globstar.
    	  var remainWithoutGlobStar = remain.slice(1);
    	  var gspref = prefix ? [ prefix ] : [];
    	  var noGlobStar = gspref.concat(remainWithoutGlobStar);

    	  // the noGlobStar pattern exits the inGlobStar state
    	  this._process(noGlobStar, index, false, cb);

    	  var isSym = this.symlinks[abs];
    	  var len = entries.length;

    	  // If it's a symlink, and we're in a globstar, then stop
    	  if (isSym && inGlobStar)
    	    return cb()

    	  for (var i = 0; i < len; i++) {
    	    var e = entries[i];
    	    if (e.charAt(0) === '.' && !this.dot)
    	      continue

    	    // these two cases enter the inGlobStar state
    	    var instead = gspref.concat(entries[i], remainWithoutGlobStar);
    	    this._process(instead, index, true, cb);

    	    var below = gspref.concat(entries[i], remain);
    	    this._process(below, index, true, cb);
    	  }

    	  cb();
    	};

    	Glob.prototype._processSimple = function (prefix, index, cb) {
    	  // XXX review this.  Shouldn't it be doing the mounting etc
    	  // before doing stat?  kinda weird?
    	  var self = this;
    	  this._stat(prefix, function (er, exists) {
    	    self._processSimple2(prefix, index, er, exists, cb);
    	  });
    	};
    	Glob.prototype._processSimple2 = function (prefix, index, er, exists, cb) {

    	  //console.error('ps2', prefix, exists)

    	  if (!this.matches[index])
    	    this.matches[index] = Object.create(null);

    	  // If it doesn't exist, then just mark the lack of results
    	  if (!exists)
    	    return cb()

    	  if (prefix && isAbsolute(prefix) && !this.nomount) {
    	    var trail = /[\/\\]$/.test(prefix);
    	    if (prefix.charAt(0) === '/') {
    	      prefix = path.join(this.root, prefix);
    	    } else {
    	      prefix = path.resolve(this.root, prefix);
    	      if (trail)
    	        prefix += '/';
    	    }
    	  }

    	  if (process.platform === 'win32')
    	    prefix = prefix.replace(/\\/g, '/');

    	  // Mark this as a match
    	  this._emitMatch(index, prefix);
    	  cb();
    	};

    	// Returns either 'DIR', 'FILE', or false
    	Glob.prototype._stat = function (f, cb) {
    	  var abs = this._makeAbs(f);
    	  var needDir = f.slice(-1) === '/';

    	  if (f.length > this.maxLength)
    	    return cb()

    	  if (!this.stat && ownProp(this.cache, abs)) {
    	    var c = this.cache[abs];

    	    if (Array.isArray(c))
    	      c = 'DIR';

    	    // It exists, but maybe not how we need it
    	    if (!needDir || c === 'DIR')
    	      return cb(null, c)

    	    if (needDir && c === 'FILE')
    	      return cb()

    	    // otherwise we have to stat, because maybe c=true
    	    // if we know it exists, but not what it is.
    	  }
    	  var stat = this.statCache[abs];
    	  if (stat !== undefined) {
    	    if (stat === false)
    	      return cb(null, stat)
    	    else {
    	      var type = stat.isDirectory() ? 'DIR' : 'FILE';
    	      if (needDir && type === 'FILE')
    	        return cb()
    	      else
    	        return cb(null, type, stat)
    	    }
    	  }

    	  var self = this;
    	  var statcb = inflight('stat\0' + abs, lstatcb_);
    	  if (statcb)
    	    self.fs.lstat(abs, statcb);

    	  function lstatcb_ (er, lstat) {
    	    if (lstat && lstat.isSymbolicLink()) {
    	      // If it's a symlink, then treat it as the target, unless
    	      // the target does not exist, then treat it as a file.
    	      return self.fs.stat(abs, function (er, stat) {
    	        if (er)
    	          self._stat2(f, abs, null, lstat, cb);
    	        else
    	          self._stat2(f, abs, er, stat, cb);
    	      })
    	    } else {
    	      self._stat2(f, abs, er, lstat, cb);
    	    }
    	  }
    	};

    	Glob.prototype._stat2 = function (f, abs, er, stat, cb) {
    	  if (er && (er.code === 'ENOENT' || er.code === 'ENOTDIR')) {
    	    this.statCache[abs] = false;
    	    return cb()
    	  }

    	  var needDir = f.slice(-1) === '/';
    	  this.statCache[abs] = stat;

    	  if (abs.slice(-1) === '/' && stat && !stat.isDirectory())
    	    return cb(null, false, stat)

    	  var c = true;
    	  if (stat)
    	    c = stat.isDirectory() ? 'DIR' : 'FILE';
    	  this.cache[abs] = this.cache[abs] || c;

    	  if (needDir && c === 'FILE')
    	    return cb()

    	  return cb(null, c, stat)
    	};
    	return glob_1;
    }

    requireGlob();

    const MetroOptions = {
        removeCloakTimeout: 1000
    };

    class MetroUI {
        version = "5.0.0"
        status = "pre-alpha"
        plugins = {}
        options = {}

        constructor(options = {}) {
            this.options = merge({}, MetroOptions, options);

            this.info();
            this.init();
            this.observe();
        }

        info(){
            console.info(`Metro UI - v${this.version}-${this.status}`);
            console.info(`Include: Query, Datetime, String, Html.`);
        }

        init(){
            globalize();

            const plugins = $("[data-role]");

            plugins.each((_, elem)=>{
                const roles = elem
                    .getAttribute("data-role")
                    .replace(",", " ")
                    .split(" ")
                    .map(r => r.trim())
                    .filter(v => !!v);
                for(let role of roles) {
                    this.makePlugin(elem, role, {});
                }
            });

            $(()=>{
                const body = $("body");
                if (body.hasClass('cloak')) {
                    body.addClass('remove-cloak');
                    setTimeout( () => {
                        body.removeClass('cloak remove-cloak');
                    },this.options.removeCloakTimeout);
                }
            });
        }

        observe(){
            const that = this;
            const observerConfig = {
                childList: true,
                attributes: true,
                subtree: true
            };
            const observerCallback = function(mutations){
                mutations.map(function(mutation){
                    // console.info(mutation)
                    const elem = mutation.target;
                    const $elem = $(elem);

                    if (mutation.type === 'attributes') {
                        const attr = mutation.attributeName;
                        const newValue = $elem.attr(attr), oldValue = mutation.oldValue;

                        if (mutation.attributeName !== "data-role") {
                            const roleName = $elem.attr('data-role');
                            if (roleName) {
                                for(let role of roleName.split(" ")) {
                                    if ($elem.hasAttr(`data-role-${name}`) && $elem.attr(`data-role-${name}`) === true) {
                                        that.getPlugin(elem, role).updateAttr(attr, newValue, oldValue);
                                    }
                                }
                            }
                        }
                    } else if (mutation.type === 'childList'){
                        if (mutation.addedNodes.length) {
                            const nodes = mutation.addedNodes;

                            if (nodes.length) {
                                for(let node of nodes) {
                                    const $node = $(node);
                                    if ($node.hasAttr("data-role")) {
                                        that.makePlugin(node, $node.attr('data-role'));
                                    }
                                }
                            }
                        }
                    }
                });
            };
            const observer = new MutationObserver(observerCallback);
            observer.observe($("html")[0], observerConfig);
        }

        getPlugin(elem, name){
            return this.plugins[btoa(`${name}::${JSON.stringify(elem)}`)]
        }

        makePlugin(elem, name, options){
            const pluginId = btoa(`${name}::${JSON.stringify(elem)}`);

            if ($(elem).hasAttr(`data-role-${name}`) && $(elem).attr(`data-role-${name}`) === true) {
                return this.plugins[pluginId]
            }

            const _class = Registry.getClass(name);

            if (!_class) {
                throw new Error(`Can't create component ${name}`)
            }

            const plugin = new _class(elem, options);
            this.plugins[pluginId] = plugin;
            elem.setAttribute(`data-role-${name}`, true);
            return plugin
        }

        destroyPlugin(elem, name){
            const pluginId = btoa(`${name}::${JSON.stringify(elem)}`);
            const plugin = this.plugins[pluginId];
            if (!plugin) return
            plugin.destroy();
            plugin.component.remove();
            delete this.plugins[pluginId];
        }
    }

    globalThis.Metro = new MetroUI();

})(require$$0, require$$4, require$$3, require$$5);
