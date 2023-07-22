(function () {
    'use strict';

    const between = (val, bottom, top, equals) => equals === true ? val >= bottom && val <= top : val > bottom && val < top;

    const clearName = n => n ? n.replaceAll("-", "") : "";
    const clearStr = s => s.replace(/[\n\r]+|[\s]{2,}/g, ' ').trim();

    const copy2clipboard = (text, success, fail) => {
        navigator.clipboard.writeText(text).then(function() {
            if (typeof success === "function") {
                success.apply(null, [text]);
            }
        }, function(err) {
            if (typeof fail === "function") {
                fail.apply(null, [text]);
            }
        });
    };

    const debug = (v) => {
        console.log(JSON.stringify(v, null, 2));
    };

    const encURI = s => encodeURI(s).replace(/%5B/g, '[').replace(/%5D/g, ']');

    const isFunc = f => {
        if (typeof f === 'function') return f
        if (typeof f === 'string') {
            let ns = f.split(".");
            let i, context = window;

            for(i = 0; i < ns.length; i++) {
                context = context[ns[i]];
            }

            if (typeof context === 'function') return context
        }
        return false
    };

    const exec$1 = (f, args, context) => {
        let result;
        if (f === undefined || f === null) {return false;}

        let func = isFunc(f);

        if (func === false) {
            func = new Function("a", f);
        }

        try {
            result = func.apply(context, args ? Object.values(args) : []);
            return result;
        } catch (err) {
            throw err;
        }
    };

    const getStyle = (element, pseudo) => window.getComputedStyle($(element)[0], pseudo);
    const getStyleOne = (el, property, pseudo) => getStyle(el, pseudo).getPropertyValue(property);
    const getInlineStyles = element => {
        let i, l, styles = {}, el = $(element)[0];
        for (i = 0, l = el.style.length; i < l; i++) {
            let s = el.style[i];
            styles[s] = el.style[s];
        }

        return styles
    };

    const inViewport$1 = el => {
        const rect = el.getBoundingClientRect();

        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    };

    const undef$1 = val => typeof val === "undefined" || val === null;

    const isTag = (val) => /^<\/?[\w\s="/.':;#-\/\?]+>/gi.test(val);

    const isUrl = (val) => /^(\.\/|\.\.\/|ftp|http|https):\/\/(\w+:?\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@\-\/]))?/.test(val);

    const isType = (obj, type) => {
        if (undef$1(obj)) {
            return false;
        }

        if (typeof obj === type) {
            return obj;
        }

        const t = (""+type).toLowerCase();

        if (t === 'tag' && isTag(obj)) {
            return obj;
        }

        if (t === 'url' && isUrl(obj)) {
            return obj;
        }

        if (t === 'array' && Array.isArray(obj)) {
            return obj;
        }

        // ???
        // if (this.isTag(obj) || this.isUrl(obj)) {
        //     return false;
        // }

        if (typeof window[obj] === t) {
            return window[obj];
        }

        if (typeof obj === 'string' && !obj.includes(".")) {
            return false;
        }

        if (typeof obj === 'string' && /[/\s([]+/gm.test(obj)) {
            return false;
        }

        if (typeof obj === "number" && t !== "number") {
            return false;
        }

        const ns = obj.split(".");
        let context = window;

        for(let i = 0; i < ns.length; i++) {
            context = context[ns[i]];
        }

        return typeof context === t ? context : false;
    };

    const isObject = item => (item && typeof item === 'object' && !Array.isArray(item));
    const isObjectType = item => isType(item, "object");

    const md5 = (string) => {
        const RotateLeft = (lValue, iShiftBits) => (lValue<<iShiftBits) | (lValue>>>(32-iShiftBits));

        const AddUnsigned = (lX,lY) => {
            let lX4,lY4,lX8,lY8,lResult;
            lX8 = (lX & 0x80000000);
            lY8 = (lY & 0x80000000);
            lX4 = (lX & 0x40000000);
            lY4 = (lY & 0x40000000);
            lResult = (lX & 0x3FFFFFFF)+(lY & 0x3FFFFFFF);
            if (lX4 & lY4) {
                return (lResult ^ 0x80000000 ^ lX8 ^ lY8);
            }
            if (lX4 | lY4) {
                if (lResult & 0x40000000) {
                    return (lResult ^ 0xC0000000 ^ lX8 ^ lY8);
                } else {
                    return (lResult ^ 0x40000000 ^ lX8 ^ lY8);
                }
            } else {
                return (lResult ^ lX8 ^ lY8);
            }
        };

        const F = (x,y,z) => (x & y) | ((~x) & z);
        const G = (x,y,z) => (x & z) | (y & (~z));
        const H = (x,y,z) => (x ^ y ^ z);
        const I = (x,y,z) => (y ^ (x | (~z)));

        const FF = (a,b,c,d,x,s,ac) => {
            a = AddUnsigned(a, AddUnsigned(AddUnsigned(F(b, c, d), x), ac));
            return AddUnsigned(RotateLeft(a, s), b);
        };

        const GG = (a,b,c,d,x,s,ac) => {
            a = AddUnsigned(a, AddUnsigned(AddUnsigned(G(b, c, d), x), ac));
            return AddUnsigned(RotateLeft(a, s), b);
        };

        const HH = (a,b,c,d,x,s,ac) => {
            a = AddUnsigned(a, AddUnsigned(AddUnsigned(H(b, c, d), x), ac));
            return AddUnsigned(RotateLeft(a, s), b);
        };

        const II = (a,b,c,d,x,s,ac) => {
            a = AddUnsigned(a, AddUnsigned(AddUnsigned(I(b, c, d), x), ac));
            return AddUnsigned(RotateLeft(a, s), b);
        };

        const ConvertToWordArray = (string) => {
            let lWordCount, lMessageLength = string.length;
            let lNumberOfWords_temp1=lMessageLength + 8;
            let lNumberOfWords_temp2=(lNumberOfWords_temp1-(lNumberOfWords_temp1 % 64))/64;
            let lNumberOfWords = (lNumberOfWords_temp2+1)*16;
            let lWordArray=Array(lNumberOfWords-1);
            let lBytePosition = 0;
            let lByteCount = 0;
            while ( lByteCount < lMessageLength ) {
                lWordCount = (lByteCount-(lByteCount % 4))/4;
                lBytePosition = (lByteCount % 4)*8;
                lWordArray[lWordCount] = (lWordArray[lWordCount] | (string.charCodeAt(lByteCount)<<lBytePosition));
                lByteCount++;
            }
            lWordCount = (lByteCount-(lByteCount % 4))/4;
            lBytePosition = (lByteCount % 4)*8;
            lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80<<lBytePosition);
            lWordArray[lNumberOfWords-2] = lMessageLength<<3;
            lWordArray[lNumberOfWords-1] = lMessageLength>>>29;
            return lWordArray;
        };

        const WordToHex = (lValue) => {
            let WordToHexValue="",WordToHexValue_temp="",lByte,lCount;
            for (lCount = 0; lCount<=3; lCount++) {
                lByte = (lValue>>>(lCount*8)) & 255;
                WordToHexValue_temp = "0" + lByte.toString(16);
                WordToHexValue = WordToHexValue + WordToHexValue_temp.substr(WordToHexValue_temp.length-2,2);
            }
            return WordToHexValue;
        };

        const Utf8Encode = (string) => {
            string = string.replace(/\r\n/g,"\n");
            let utftext = "";

            for (let n = 0; n < string.length; n++) {
                let c = string.charCodeAt(n);
                if (c < 128) {
                    utftext += String.fromCharCode(c);
                }
                else if((c > 127) && (c < 2048)) {
                    utftext += String.fromCharCode((c >> 6) | 192);
                    utftext += String.fromCharCode((c & 63) | 128);
                }
                else {
                    utftext += String.fromCharCode((c >> 12) | 224);
                    utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                    utftext += String.fromCharCode((c & 63) | 128);
                }
            }

            return utftext;
        };

        let x=[];
        let k,AA,BB,CC,DD,a,b,c,d;
        let S11=7, S12=12, S13=17, S14=22;
        let S21=5, S22=9 , S23=14, S24=20;
        let S31=4, S32=11, S33=16, S34=23;
        let S41=6, S42=10, S43=15, S44=21;

        string = Utf8Encode(string);

        x = ConvertToWordArray(string);

        a = 0x67452301; b = 0xEFCDAB89; c = 0x98BADCFE; d = 0x10325476;

        for (k=0;k<x.length;k+=16) {
            AA=a; BB=b; CC=c; DD=d;
            a=FF(a,b,c,d,x[k], S11,0xD76AA478);
            d=FF(d,a,b,c,x[k+1], S12,0xE8C7B756);
            c=FF(c,d,a,b,x[k+2], S13,0x242070DB);
            b=FF(b,c,d,a,x[k+3], S14,0xC1BDCEEE);
            a=FF(a,b,c,d,x[k+4], S11,0xF57C0FAF);
            d=FF(d,a,b,c,x[k+5], S12,0x4787C62A);
            c=FF(c,d,a,b,x[k+6], S13,0xA8304613);
            b=FF(b,c,d,a,x[k+7], S14,0xFD469501);
            a=FF(a,b,c,d,x[k+8], S11,0x698098D8);
            d=FF(d,a,b,c,x[k+9], S12,0x8B44F7AF);
            c=FF(c,d,a,b,x[k+10],S13,0xFFFF5BB1);
            b=FF(b,c,d,a,x[k+11],S14,0x895CD7BE);
            a=FF(a,b,c,d,x[k+12],S11,0x6B901122);
            d=FF(d,a,b,c,x[k+13],S12,0xFD987193);
            c=FF(c,d,a,b,x[k+14],S13,0xA679438E);
            b=FF(b,c,d,a,x[k+15],S14,0x49B40821);
            a=GG(a,b,c,d,x[k+1], S21,0xF61E2562);
            d=GG(d,a,b,c,x[k+6], S22,0xC040B340);
            c=GG(c,d,a,b,x[k+11],S23,0x265E5A51);
            b=GG(b,c,d,a,x[k], S24,0xE9B6C7AA);
            a=GG(a,b,c,d,x[k+5], S21,0xD62F105D);
            d=GG(d,a,b,c,x[k+10],S22,0x2441453);
            c=GG(c,d,a,b,x[k+15],S23,0xD8A1E681);
            b=GG(b,c,d,a,x[k+4], S24,0xE7D3FBC8);
            a=GG(a,b,c,d,x[k+9], S21,0x21E1CDE6);
            d=GG(d,a,b,c,x[k+14],S22,0xC33707D6);
            c=GG(c,d,a,b,x[k+3], S23,0xF4D50D87);
            b=GG(b,c,d,a,x[k+8], S24,0x455A14ED);
            a=GG(a,b,c,d,x[k+13],S21,0xA9E3E905);
            d=GG(d,a,b,c,x[k+2], S22,0xFCEFA3F8);
            c=GG(c,d,a,b,x[k+7], S23,0x676F02D9);
            b=GG(b,c,d,a,x[k+12],S24,0x8D2A4C8A);
            a=HH(a,b,c,d,x[k+5], S31,0xFFFA3942);
            d=HH(d,a,b,c,x[k+8], S32,0x8771F681);
            c=HH(c,d,a,b,x[k+11],S33,0x6D9D6122);
            b=HH(b,c,d,a,x[k+14],S34,0xFDE5380C);
            a=HH(a,b,c,d,x[k+1], S31,0xA4BEEA44);
            d=HH(d,a,b,c,x[k+4], S32,0x4BDECFA9);
            c=HH(c,d,a,b,x[k+7], S33,0xF6BB4B60);
            b=HH(b,c,d,a,x[k+10],S34,0xBEBFBC70);
            a=HH(a,b,c,d,x[k+13],S31,0x289B7EC6);
            d=HH(d,a,b,c,x[k], S32,0xEAA127FA);
            c=HH(c,d,a,b,x[k+3], S33,0xD4EF3085);
            b=HH(b,c,d,a,x[k+6], S34,0x4881D05);
            a=HH(a,b,c,d,x[k+9], S31,0xD9D4D039);
            d=HH(d,a,b,c,x[k+12],S32,0xE6DB99E5);
            c=HH(c,d,a,b,x[k+15],S33,0x1FA27CF8);
            b=HH(b,c,d,a,x[k+2], S34,0xC4AC5665);
            a=II(a,b,c,d,x[k], S41,0xF4292244);
            d=II(d,a,b,c,x[k+7], S42,0x432AFF97);
            c=II(c,d,a,b,x[k+14],S43,0xAB9423A7);
            b=II(b,c,d,a,x[k+5], S44,0xFC93A039);
            a=II(a,b,c,d,x[k+12],S41,0x655B59C3);
            d=II(d,a,b,c,x[k+3], S42,0x8F0CCC92);
            c=II(c,d,a,b,x[k+10],S43,0xFFEFF47D);
            b=II(b,c,d,a,x[k+1], S44,0x85845DD1);
            a=II(a,b,c,d,x[k+8], S41,0x6FA87E4F);
            d=II(d,a,b,c,x[k+15],S42,0xFE2CE6E0);
            c=II(c,d,a,b,x[k+6], S43,0xA3014314);
            b=II(b,c,d,a,x[k+13],S44,0x4E0811A1);
            a=II(a,b,c,d,x[k+4], S41,0xF7537E82);
            d=II(d,a,b,c,x[k+11],S42,0xBD3AF235);
            c=II(c,d,a,b,x[k+2], S43,0x2AD7D2BB);
            b=II(b,c,d,a,x[k+9], S44,0xEB86D391);
            a=AddUnsigned(a,AA);
            b=AddUnsigned(b,BB);
            c=AddUnsigned(c,CC);
            d=AddUnsigned(d,DD);
        }

        let temp = WordToHex(a)+WordToHex(b)+WordToHex(c)+WordToHex(d);

        return temp.toLowerCase();
    };

    const medias = {
        FS: "(min-width: 0px)",
        XS: "(min-width: 360px)",
        SM: "(min-width: 576px)",
        MD: "(min-width: 768px)",
        LG: "(min-width: 992px)",
        XL: "(min-width: 1200px)",
        XXL: "(min-width: 1452px)"
    };

    const media_mode = {
        FS: "fs",
        XS: "xs",
        SM: "sm",
        MD: "md",
        LG: "lg",
        XL: "xl",
        XXL: "xxl"
    };

    globalThis.METRO_MEDIA = [];

    const media = query => window.matchMedia(query).matches;
    const mediaModes = () => globalThis.METRO_MEDIA;

    const mediaExist = media => globalThis.METRO_MEDIA.includes(media);

    const inMedia = media => globalThis.METRO_MEDIA.includes(media) && globalThis.METRO_MEDIA.indexOf(media) === globalThis.METRO_MEDIA.length - 1;

    for(let key in medias) {
        if (media(medias[key])) {
            globalThis.METRO_MEDIA.push(media_mode[key]);
        }
    }

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

    const noop = () => {};
    const noop_arg = f => f;
    const noop_true = () => true;
    const noop_false = () => false;

    const numberFormat = function(num, decimalLength = 0, wholeLength = 0, thousandDivider = ", ", decimalDivider = ".") {
        const re = '\\d(?=(\\d{' + (wholeLength || 3) + '})+' + (decimalLength > 0 ? '\\D' : '$') + ')',
            _num = num.toFixed(Math.max(0, ~~decimalLength));

        return (decimalDivider ? _num.replace('.', decimalDivider) : _num).replace(new RegExp(re, 'g'), '$&' + (thousandDivider || ','));
    };

    const objectLength = (obj) => {
        if (typeof obj !== "object") return null
        return Object.keys(obj).length;
    };

    const panic = msg => {
        throw new Error(`Panic! ${msg}`)
    };

    function required$1 (val, msg = "Value required!") {
       if (typeof val === 'undefined')
           panic(msg);
    }

    const shuffleArray$1 = (a = []) => {
        let _a = [...a];
        let i = _a.length, t, r;

        while (0 !== i) {
            r = Math.floor(Math.random() * i);
            i -= 1;
            t = _a[i];
            _a[i] = _a[r];
            _a[r] = t;
        }

        return _a;
    };

    const to_array = (str, sep = ",") => str.split(sep).map( v => v.trim() );

    const uniqueId = (length=16) => parseInt(Math.ceil(Math.random() * Date.now()).toPrecision(length).toString().replace(".", ""));

    const nvl$2 = (val, ifNull) => undef$1(val) ? ifNull : val;

    const compare = (curr, next, dir = "asc") => {
        let result = 0;

        if (curr < next) {
            result = dir === "asc" ? -1 : 1;
        }
        if (curr > next) {
            result = dir === "asc" ? 1 : -1;
        }
        return result
    };

    const parse = (v, {format = "default", formatMask, locale = "en-US"}) => {
        let result;

        switch (format) {
            case "number": result = Number(v); break;
            case "integer":
            case "int": result = parseInt(v); break;
            case "float": result = parseFloat(v); break;
            case "date": result = formatMask ? Datetime.from(v, formatMask, locale) : datetime(v); break;
            case "money": result = parseFloat(v.replace(/[^0-9-.]/g, '')); break;
            case "card": result = v.replace(/[^0-9]/g, ''); break;
            default: result = v.toLowerCase();
        }

        return result
    };

    const clientXY = function(e){
        return {
            x: e.changedTouches ? e.changedTouches[0].clientX : e.clientX,
            y: e.changedTouches ? e.changedTouches[0].clientY : e.clientY
        };
    };

    const screenXY = function(e){
        return {
            x: e.changedTouches ? e.changedTouches[0].screenX : e.screenX,
            y: e.changedTouches ? e.changedTouches[0].screenY : e.screenY
        };
    };

    const pageXY = function(e){
        return {
            x: e.changedTouches ? e.changedTouches[0].pageX : e.pageX,
            y: e.changedTouches ? e.changedTouches[0].pageY : e.pageY
        };
    };

    const createStyleSheet$1 = function(media){
        const style = document.createElement("style");

        if (media) {
            style.setAttribute("media", media);
        }

        style.appendChild(document.createTextNode(""));

        document.head.appendChild(style);

        return style.sheet;
    };

    const addCssRule$1 = function(sheet, selector, rules, index){
        sheet.insertRule(selector + "{" + rules + "}", index);
    };

    const not$1 = function (val){
        return typeof val !== "undefined" && val !== null && (""+val).trim() !== ""
    };

    const bool$1 = function (val) {
        switch (val) {
            case "0":
            case "false":
            case "not":
            case "no":
            case false:
            case 0: return false
            default: return true
        }
    };

    const encodeURI$1 = function(str){
        return encodeURI$1().replace(/%5B/g, '[').replace(/%5D/g, ']');
    };

    const updateURIParameter = function(uri, key, value) {
        const re = new RegExp("([?&])" + key + "=.*?(&|$)", "i");
        const separator = uri.indexOf('?') !== -1 ? "&" : "?";
        if (uri.match(re)) {
            return uri.replace(re, '$1' + key + "=" + value + '$2');
        }
        else {
            return uri + separator + key + "=" + value;
        }
    };

    const getURIParameter = function(url, name){
        if (!url) url = window.location.href;
        /* eslint-disable-next-line */
        name = name.replace(/[\[\]]/g, "\\$&");
        const regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    };

    const cleanPreCode = function(selector){
        const els = Array.prototype.slice.call(document.querySelectorAll(selector), 0);

        els.forEach(function(el){
            const txt = el.textContent
                .replace(/^[\r\n]+/, "")
                .replace(/\s+$/g, "");

            if (/^\S/gm.test(txt)) {
                el.textContent = txt;
                return;
            }

            let mat, str, re = /^[\t ]+/gm, len, min = 1e3;

            while (mat = re.exec(txt)) {
                len = mat[0].length;

                if (len < min) {
                    min = len;
                    str = mat[0];
                }
            }

            if (min === 1e3)
                return;

            el.textContent = txt.replace(new RegExp("^" + str, 'gm'), "").trim();
        });
    };

    const github = async function(repo){
        try {
            const response = await fetch(`https://api.github.com/repos/${repo}`);
            if (!response.ok) {
                panic(`We cann't retrive info from GitHub for repo ${repo}`);
            }
            return await response.json()
        } catch (e) {
            panic(e.message);
        }
    };

    var Routines = /*#__PURE__*/Object.freeze({
        __proto__: null,
        between: between,
        clearName: clearName,
        clearStr: clearStr,
        copy2clipboard: copy2clipboard,
        debug: debug,
        encURI: encURI,
        exec: exec$1,
        isFunc: isFunc,
        getStyle: getStyle,
        getStyleOne: getStyleOne,
        getInlineStyles: getInlineStyles,
        inViewport: inViewport$1,
        isObject: isObject,
        isObjectType: isObjectType,
        md5: md5,
        media: media,
        medias: medias,
        media_mode: media_mode,
        mediaExist: mediaExist,
        mediaModes: mediaModes,
        inMedia: inMedia,
        merge: merge,
        noop: noop,
        noop_false: noop_false,
        noop_true: noop_true,
        noop_arg: noop_arg,
        numberFormat: numberFormat,
        objectLength: objectLength,
        panic: panic,
        required: required$1,
        shuffleArray: shuffleArray$1,
        to_array: to_array,
        undef: undef$1,
        uniqueId: uniqueId,
        nvl: nvl$2,
        isTag: isTag,
        isType: isType,
        isUrl: isUrl,
        compare: compare,
        parse: parse,
        clientXY: clientXY,
        screenXY: screenXY,
        pageXY: pageXY,
        createStyleSheet: createStyleSheet$1,
        addCssRule: addCssRule$1,
        not: not$1,
        bool: bool$1,
        encodeURI: encodeURI$1,
        updateURIParameter: updateURIParameter,
        getURIParameter: getURIParameter,
        cleanPreCode: cleanPreCode,
        github: github
    });

    globalThis.METRO5_COMPONENTS_REGISTRY = {};

    const Registry = {
        register(name, _class){
            name = name.replaceAll("-", "");
            if (METRO5_COMPONENTS_REGISTRY[name]) {
                return
            }
            METRO5_COMPONENTS_REGISTRY[name] = _class;
        },

        unregister(name, _class){
            name = name.replaceAll("-", "");
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

        components(){
            return Object.keys(METRO5_COMPONENTS_REGISTRY)
        },

        dump(){
            debug(Registry.components());
        },

        required(...names){
            const keys = Registry.components();
            for (let name of names) {
                if (!keys.includes(name)) {
                    panic(`Component ${name} required!`);
                }
            }
        }
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

    const M$1 = {
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

    const C$1 = {
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

    class Datetime$1 {
        constructor() {
            const args = [].slice.call(arguments);
            this.value = new (Function.prototype.bind.apply(Date,  [this].concat(args) ) );
            this.locale = "en";
            this.weekStart = Datetime$1.locales["en"].weekStart;
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
            return val instanceof Datetime$1;
        }

        static now(asDate = false){
            return datetime$1()[asDate ? "val" : "time"]();
        }

        static parse(str = required()){
            return datetime$1(Date.parse(str));
        }

        static setLocale(name = required(), locale = required()){
            Datetime$1.locales[name] = locale;
        }

        static getLocale(name = "en"){
            return isset(Datetime$1.locales[name], false) ? Datetime$1.locales[name] : Datetime$1.locales["en"];
        }

        static align(date, align){
            let _date = datetime$1(date),
                result, temp;

            switch (align) {
                case C$1.s:  result = _date.ms(0); break; //second
                case C$1.m:  result = Datetime$1.align(_date, C$1.s)[C$1.s](0); break; //minute
                case C$1.h:  result = Datetime$1.align(_date, C$1.m)[C$1.m](0); break; //hour
                case C$1.D:  result = Datetime$1.align(_date, C$1.h)[C$1.h](0); break; //day
                case C$1.M:  result = Datetime$1.align(_date, C$1.D)[C$1.D](1); break; //month
                case C$1.Y:  result = Datetime$1.align(_date, C$1.M)[C$1.M](0); break; //year
                case C$1.W:  {
                    temp = _date.weekDay();
                    result = Datetime$1.align(date, C$1.D).addDay(-temp);
                    break; // week
                }
                default: result = _date;
            }
            return result;
        }

        static alignEnd(date, align){
            let _date = datetime$1(date),
                result, temp;

            switch (align) {
                case C$1.ms: result = _date.ms(999); break; //second
                case C$1.s:  result = Datetime$1.alignEnd(_date, C$1.ms); break; //second
                case C$1.m:  result = Datetime$1.alignEnd(_date, C$1.s)[C$1.s](59); break; //minute
                case C$1.h:  result = Datetime$1.alignEnd(_date, C$1.m)[C$1.m](59); break; //hour
                case C$1.D:  result = Datetime$1.alignEnd(_date, C$1.h)[C$1.h](23); break; //day
                case C$1.M:  result = Datetime$1.alignEnd(_date, C$1.D)[C$1.D](1).add(1, C$1.M).add(-1, C$1.D); break; //month
                case C$1.Y:  result = Datetime$1.alignEnd(_date, C$1.D)[C$1.M](11)[C$1.D](31); break; //year
                case C$1.W:  {
                    temp = _date.weekDay();
                    result = Datetime$1.alignEnd(_date, 'day').addDay(6 - temp);
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

        useLocale(val, override){
            this.locale = override ? val : !isset(Datetime$1.locales[val], false) ? "en" : val;
            this.weekStart = Datetime$1.getLocale(this.locale).weekStart;
            return this;
        }

        clone(){
            const c = datetime$1(this.value);
            c.locale = this.locale;
            c.weekStart = this.weekStart;
            c.mutable = this.mutable;
            return c;
        }

        align(to){
            if (this.mutable) {
                this.value = Datetime$1.align(this, to).val();
                return this;
            }

            return this.clone().immutable(false).align(to).immutable(!this.mutable);
        }

        alignEnd(to){
            if (this.mutable) {
                this.value = Datetime$1.alignEnd(this, to).val();
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

            return datetime$1(val);
        }

        year2(){
            return +(""+this.year()).substr(-2);
        }

        /* Get + Set */

        _set(m, v){
            const fn = "set" + (this.utcMode && m !== "t" ? "UTC" : "") + M$1[m];
            if (this.mutable) {
                this.value[fn](v);
                return this;
            }
            const clone = this.clone();
            clone.value[fn](v);
            return clone;
        }

        _get(m){
            const fn = "get" + (this.utcMode && m !== "t" ? "UTC" : "") + M$1[m];
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
                case C$1.h: return this.time(this.time() + (val * 60 * 60 * 1000));
                case C$1.m: return this.time(this.time() + (val * 60 * 1000));
                case C$1.s: return this.time(this.time() + (val * 1000));
                case C$1.ms: return this.time(this.time() + (val));
                case C$1.D: return this.day(this.day() + val);
                case C$1.W: return this.day(this.day() + val * 7);
                case C$1.M: return this.month(this.month() + val);
                case C$1.Y: return this.year(this.year() + val);
            }
        }

        addHour(v){return this.add(v,C$1.h);}
        addMinute(v){return this.add(v,C$1.m);}
        addSecond(v){return this.add(v, C$1.s);}
        addMs(v){return this.add(v, C$1.ms);}
        addDay(v){return this.add(v,C$1.D);}
        addWeek(v){return this.add(v,C$1.W);}
        addMonth(v){return this.add(v, C$1.M);}
        addYear(v){return this.add(v, C$1.Y);}

        format(fmt, locale){
            const format = fmt || DEFAULT_FORMAT;
            const names = Datetime$1.getLocale(locale || this.locale);
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

    const datetime$1 = (...args) => args && args[0] instanceof Datetime$1 ? args[0] : new Datetime$1(...args);

    const fnFormat$5 = Datetime$1.prototype.format;

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

    Object.assign(Datetime$1.prototype, buddhistMixin);

    const createCalendar = (date, iso) => {
        let _date = date instanceof Datetime$1 ? date.clone().align("month") : datetime$1(date);
        let ws = iso === 0 || iso ? iso : date.weekStart;
        let wd = ws ? _date.isoWeekDay() : _date.weekDay();
        let names = Datetime$1.getLocale(_date.locale);
        let now = datetime$1(), i;

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

    Object.assign(Datetime$1.prototype, {
        // 1 - Monday, 0 - Sunday
        calendar(weekStart){
            return createCalendar(this, weekStart);
        }
    });

    const fnFormat$4 = Datetime$1.prototype.format;

    Object.assign(Datetime$1.prototype, {
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

    Object.assign(Datetime$1.prototype, {
        same(d){
            return this.time() === datetime$1(d).time();
        },

        /*
        * align: year, month, day, hour, minute, second, ms = default
        * */
        compare(d, align, operator = "="){
            const date = datetime$1(d);
            const curr = datetime$1(this.value);
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
            const date = datetime$1(d);
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

    Object.assign(Datetime$1.prototype, {
        isLeapYear(){
            const year = this.year();
            return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
        }
    });

    Object.assign(Datetime$1.prototype, {
        dayOfYear(){
            const dayCount = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
            const month = this.month();
            const day = this.day();
            return dayCount[month] + day + ((month > 1 && this.isLeapYear()) ? 1 : 0);
        }
    });

    Object.assign(Datetime$1.prototype, {
        daysInMonth(){
            const curr = datetime$1(this.value);
            return curr.add(1, 'month').day(1).add(-1, 'day').day();
        },

        daysInYear(){
            return this.isLeapYear() ? 366 : 365;
        },

        daysInYearMap(){
            const result = [];
            const curr = datetime$1(this.value);

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
            const names = Datetime$1.getLocale(locale || this.locale);

            map.forEach((v, i) => result[names[shortName ? 'monthsShort' : 'months'][i]] = v);

            return result;
        }
    });

    Object.assign(Datetime$1.prototype, {
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

    Object.assign(Datetime$1, {
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
                const names = Datetime$1.getLocale(locale || 'en');

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
                return datetime$1();
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

            return datetime$1(year, month-1, day, hour, minute, second, ms);
        }
    });

    const fnFormat$3 = Datetime$1.prototype.format;

    Object.assign(Datetime$1.prototype, {
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

    const fnFormat$2 = Datetime$1.prototype.format;
    const fnAlign$1 = Datetime$1.align;
    const fnAlignEnd$1 = Datetime$1.alignEnd;

    Object.assign(Datetime$1, {
        align(d, align) {
            let date = datetime$1(d), result, temp;

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
            let date = datetime$1(d), result, temp;

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

    Object.assign(Datetime$1.prototype, {
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

    Object.assign(Datetime$1, {
        max(){
            let arr = [].slice.call(arguments);
            return arr.map((el) => datetime$1(el)).sort((a, b) => b.time() - a.time())[0];
        }
    });

    Object.assign(Datetime$1.prototype, {
        max(){
            return Datetime$1.max.apply(this, [this].concat([].slice.call(arguments)));
        }
    });

    Object.assign(Datetime$1, {
        min(){
            let arr = [].slice.call(arguments);
            return arr.map((el) => datetime$1(el)).sort((a, b) => a.time() - b.time())[0];
        }
    });

    Object.assign(Datetime$1.prototype, {
        min(){
            return Datetime$1.min.apply(this, [this].concat([].slice.call(arguments)));
        }
    });

    const fnAlign = Datetime$1.align;
    const fnAlignEnd = Datetime$1.alignEnd;
    const fnAdd = Datetime$1.prototype.add;

    Object.assign(Datetime$1, {
        align(d, align){
            let date = datetime$1(d), result;

            switch(align) {
                case "quarter":  result = Datetime$1.align(date, 'day').day(1).month(date.quarter() * 3 - 3); break; //quarter
                default: result = fnAlign.apply(this, [date, align]);
            }

            return result;
        },

        alignEnd(d, align){
            let date = datetime$1(d), result;

            switch(align) {
                case "quarter":  result = Datetime$1.align(date, 'quarter').add(3, 'month').add(-1, 'ms'); break; //quarter
                default: result = fnAlignEnd.apply(this, [date, align]);
            }

            return result;
        }
    });

    Object.assign(Datetime$1.prototype, {
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

    Object.assign(Datetime$1, {
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

            _arr =  arr.map((el) => datetime$1(el)).sort((a, b) => a.valueOf() - b.valueOf());

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

    const fnFormat$1 = Datetime$1.prototype.format;

    Object.assign(Datetime$1.prototype, {
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

    const fnFormat = Datetime$1.prototype.format;

    Object.assign(Datetime$1.prototype, {
        // TODO Need optimisation
        weekNumber (weekStart) {
            let nYear, nday, newYear, day, daynum, weeknum;

            weekStart = +weekStart || 0;
            newYear = datetime$1(this.year(), 0, 1);
            day = newYear.weekDay() - weekStart;
            day = (day >= 0 ? day : day + 7);
            daynum = Math.floor(
                (this.time() - newYear.time() - (this.utcOffset() - newYear.utcOffset()) * 60000) / 86400000
            ) + 1;

            if(day < 4) {
                weeknum = Math.floor((daynum + day - 1) / 7) + 1;
                if(weeknum > 52) {
                    nYear = datetime$1(this.year() + 1, 0, 1);
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
            const curr = datetime$1(this.value);
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

    Object.assign(Datetime$1.prototype, {
        strftime(fmt, locale){
            const format = fmt || DEFAULT_FORMAT_STRFTIME;
            const names = Datetime$1.getLocale(locale || this.locale);
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
                return datetime$1(that.value).day(that.day() - ((that.weekDay() + 6) % 7) + 3);
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

    Object.assign(Datetime$1, {
        isToday(date){
            const d = datetime$1(date).align("day");
            const c = datetime$1().align('day');

            return d.time() === c.time();
        }
    });

    Object.assign(Datetime$1.prototype, {
        isToday(){
            return Datetime$1.isToday(this);
        },

        today(){
            const now = datetime$1();

            if (!this.mutable) {
                return now;
            }
            return this.val(now.val());
        }
    });

    Object.assign(Datetime$1, {
        isTomorrow(date){
            const d = datetime$1(date).align("day");
            const c = datetime$1().align('day').add(1, 'day');

            return d.time() === c.time();
        }
    });

    Object.assign(Datetime$1.prototype, {
        isTomorrow(){
            return Datetime$1.isTomorrow(this);
        },

        tomorrow(){
            if (!this.mutable) {
                return this.clone().immutable(false).add(1, 'day').immutable(!this.mutable);
            }
            return this.add(1, 'day');
        }
    });

    Object.assign(Datetime$1.prototype, {
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

    Object.assign(Datetime$1, {
        timestamp(){
            return new Date().getTime() / 1000;
        }
    });

    Object.assign(Datetime$1.prototype, {
        unix(val) {
            let _val;

            if (!arguments.length || (not(val))) {
                return Math.floor(this.valueOf() / 1000)
            }

            _val = val * 1000;

            if (this.mutable) {
                return this.time(_val);
            }

            return datetime$1(this.value).time(_val);
        },

        timestamp(){
            return this.unix();
        }
    });

    Object.assign(Datetime$1, {
        isYesterday(date){
            const d = datetime$1(date).align("day");
            const c = datetime$1().align('day').add(-1, 'day');

            return d.time() === c.time();
        }
    });

    Object.assign(Datetime$1.prototype, {
        isYesterday(){
            return Datetime$1.isYesterday(this);
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

    Object.assign(Datetime$1, {
        timeLapse(d) {
            let old = datetime$1(d),
                now = datetime$1(),
                val = now - old;

            return getResult(val)
        }
    });

    Object.assign(Datetime$1.prototype, {
        timeLapse() {
            let val = datetime$1() - +this;
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

    Object.assign(Datetime$1, ParseTimeMixin);

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

    const slice = function (s) {
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
      return _pad(s, pad, len, true);
    };
    const rpad = function (s) {
      let pad = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : ' ';
      let len = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
      return _pad(s, pad, len, false);
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
    const re$2 = {
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

          if (re$2.not_type.test(ph.type) && re$2.not_primitive.test(ph.type) && arg instanceof Function) {
            arg = arg();
          }

          if (re$2.numeric_arg.test(ph.type) && typeof arg !== 'number' && isNaN(arg)) {
            throw new TypeError(sprintf('[sprintf] expecting number but found %T'));
          }

          if (re$2.number.test(ph.type)) {
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

          if (re$2.json.test(ph.type)) {
            output += arg;
          } else {
            if (re$2.number.test(ph.type) && (!is_positive || ph.sign)) {
              sign = is_positive ? '+' : '-';
              arg = arg.toString().replace(re$2.sign, '');
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
        if ((match = re$2.text.exec(_fmt)) !== null) {
          parse_tree.push(match[0]);
        } else if ((match = re$2.modulo.exec(_fmt)) !== null) {
          parse_tree.push('%');
        } else if ((match = re$2.placeholder.exec(_fmt)) !== null) {
          if (match[2]) {
            arg_names |= 1;
            let field_list = [],
                replacement_field = match[2],
                field_match = [];

            if ((field_match = re$2.key.exec(replacement_field)) !== null) {
              field_list.push(field_match[1]);

              while ((replacement_field = replacement_field.substring(field_match[0].length)) !== '') {
                if ((field_match = re$2.key_access.exec(replacement_field)) !== null) {
                  field_list.push(field_match[1]);
                } else if ((field_match = re$2.index_access.exec(replacement_field)) !== null) {
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
      slice,
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
        index(sel, global = true){
            let el, _index = -1;

            if (this.length === 0) {
                return _index
            }

            if (undef(sel)) {
                el = this[0];
            } else if (typeof sel === "string") {
                el = $(sel)[0];
            } else if (isArrayLike(sel)) {
                el = sel[0];
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

        in(/*Query*/ set){
            let inSet = false;
            this.each(function(){
                if (!inSet && set.is(this)) inSet = true;
            });
            return inSet
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
                this.fire( name )
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

            // TODO check this
            //if (!instanceMap.has(key) && instanceMap.size !== 0) {
                //console.error(`Query doesn't allow more than one instance per element. Bound instance: ${Array.from(instanceMap.keys())[0]}.`)
                //return
            //}

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
                const displayState = getComputedStyle(el, null)['display'];
                $(el).data('display-state', displayState);
                el.style.display = 'none';
                if (typeof cb === "function") {
                    cb.apply(el, [el]);
                }
            })
        },

        show(cb){
            return this.each((_, el) => {
                const display = $(el).data('display-state');
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

            if (this.selector === 'document' || (this.selector && this.selector.nodeType === 9)) {
                this[0] = document;
                this.length = 1;
                return
            }

            if (this.selector instanceof HTMLElement) {
                this.push(this.selector);
                return
            }

            if (typeof this.selector === "object" && isArrayLike(this.selector)) {
                each(this.selector, (key, val) => {
                    this.push(val instanceof Query ? val[0] : val);
                });
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
        offset: function(val){
            if (this.length === 0) return

            if (undef(val)) {
                if (this.length === 0) return undefined;
                const rect = this[0].getBoundingClientRect();
                return {
                    top: rect.top + scrollY,
                    left: rect.left + scrollX
                };
            }

            return this.each(function(){ //?
                const el = $(this);
                let top = val.top, left = val.left;
                const position = getComputedStyle(this).position;
                const offset = el.offset();

                if (position === "static") {
                    el.css("position", "relative");
                }

                if (["absolute", "fixed"].indexOf(position) === -1) {
                    top = top - offset.top;
                    left = left - offset.left;
                }

                el.css({
                    top: top,
                    left: left
                });
            });
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

    const Serialize = {
        serializeForm: function(form){
            const _form = $(form)[0], q = [];

            if (!_form || _form.nodeName !== "FORM") {
                console.warn("Element is not a HTMLFromElement");
                return;
            }

            for (let i = _form.elements.length - 1; i >= 0; i = i - 1) {
                if (_form.elements[i].name === "") {
                    continue;
                }
                switch (_form.elements[i].nodeName) {
                    case 'INPUT':
                        switch (_form.elements[i].type) {
                            case 'checkbox':
                            case 'radio':
                                if (_form.elements[i].checked) {
                                    q.push(_form.elements[i].name + "=" + encodeURIComponent(_form.elements[i].value));
                                }
                                break;
                            case 'file':
                                break;
                            default: q.push(_form.elements[i].name + "=" + encodeURIComponent(_form.elements[i].value));
                        }
                        break;
                    case 'TEXTAREA':
                        q.push(_form.elements[i].name + "=" + encodeURIComponent(_form.elements[i].value));
                        break;
                    case 'SELECT':
                        switch (_form.elements[i].type) {
                            case 'select-one':
                                q.push(_form.elements[i].name + "=" + encodeURIComponent(_form.elements[i].value));
                                break;
                            case 'select-multiple':
                                for (let j = _form.elements[i].options.length - 1; j >= 0; j = j - 1) {
                                    if (_form.elements[i].options[j].selected) {
                                        q.push(_form.elements[i].name + "=" + encodeURIComponent(_form.elements[i].options[j].value));
                                    }
                                }
                                break;
                        }
                        break;
                    case 'BUTTON':
                        switch (_form.elements[i].type) {
                            case 'reset':
                            case 'submit':
                            case 'button':
                                q.push(_form.elements[i].name + "=" + encodeURIComponent(_form.elements[i].value));
                                break;
                        }
                        break;
                }
            }
            return q;
        },

        serializeObject(obj){
            const q = [];
            for(let key in obj) {
                q.push(`${key}=${encodeURIComponent(obj[key])}`);
            }
            return q
        },

        serialize(o, joinWith ){
            let result;

            if (o.nodeName && o.nodeName === 'FORM') {
                result = Serialize.serializeForm(o);
            } else if (Array.isArray(o)) {
                result = o;
            } else if (toType(o) === 'object') {
                result = Serialize.serializeObject(o);
            } else {
                result = [];
            }

            return joinWith ? result.join(joinWith) : result
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
    const $$4 = query;

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
        html: $$4('html'),
        doctype: $$4("doctype"),
        head: $$4('head'),
        body: $$4('body'),
        document: $$4('document'),
        window: $$4('window'),
        meta: name => !name ? $$4("meta") : $$4("meta[name=$name]".replace("$name", name)),
        metaBy: name => !name ? $$4.meta : $$4("meta[$name]".replace("$name", name)),
        charset: val => {
            if (val) {
                const m = $$4('meta[charset]');
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
        coalesce,
        serialize: Serialize.serialize
    });

    Query$1.use({
        data(key, val){
            let elem, data;

            if (this.length === 0) {
                return
            }

            elem = this[0];

            if (!arguments.length) {
                data = $$4.dataset.get(elem);
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
                return $$4.dataset.get(elem, key) || $$4.dataset.attr(elem, key)
            }

            return this.each( function() {
                $$4.dataset.set( this, key, val );
            })
        },

        removeData( key ) {
            return this.each( function() {
                $$4.dataset.remove( this, key );
            })
        }
    });

    let _$ = globalThis.$;

    query.use({
        global(){
            _$ = globalThis.$;
            globalThis.$ = $$4;
        },
        noConflict(){
            if ( globalThis.$ === $$4 ) {
                globalThis.$ = _$;
            }
            return $$4
        }
    });

    const $$3 = query;

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

    class Input$1 extends TagEmpty {
        tag = "input"

        selfAttributes() {
            return [
                "accept", "align", "alt", "autocomplete", "autofocus", "border", "checked", "disabled", "form", "formaction",
                "formenctype", "formmethod", "formnovalidate", "formtarget", "list", "max", "maxlength", "min", "multiple",
                "name", "pattern", "placeholder", "size", "src", "step", "type", "value"
            ]
        }
    }

    const input = (options = {}) => new Input$1(options);
    const input2 = (value = '', options = {}) => new Input$1({...options, value});

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

    class Table$1 extends Tag {
        tag = 'table'

        selfAttributes() {
            return [
                "align", "background", "bgcolor", "border", "bordercolor", "cellpadding",
                "cellspacing", "cols", "frame", "height", "rules", "summary", "width"
            ]
        }
    }

    const table = (children = '', options = {}) => new Table$1(children, options);

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

    class Form$1 extends Tag {
        tag = 'form'

        selfAttributes() {
            return ["accept-charset", "action", "autocomplete", "enctype", "method", "name", "novalidate", "target"]
        }
    }

    const form = (children = '', options = {}) => new Form$1(children, options);

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

    const mark = (children = '', options = {}) => new Mark(children, options);

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

    const q$2 = (children = '', options = {}) => new Quoted(children, options);

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

    class Textarea$1 extends Tag {
        tag = 'textarea'

        selfAttributes() {
            return ["autofocus", "cols", "form", "maxlength", "name", "placeholder", "rows", "wrap"]
        }
    }

    const textarea = (children = '', options = {}) => new Textarea$1(children, options);

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
        Input: Input$1,
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
        Table: Table$1,
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
        Form: Form$1,
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
        mark: mark,
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
        q: q$2,
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
        Textarea: Textarea$1,
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

    const Z$1 = ["translateX", "translateY", "translateZ", "rotate", "rotateX", "rotateY", "rotateZ", "scale", "scaleX", "scaleY", "scaleZ", "skew", "skewX", "skewY"], B$1 = ["opacity", "zIndex"], N$1 = ["opacity", "volume"], V$1 = ["scrollLeft", "scrollTop"], R$1 = ["backgroundColor", "color"], G = ["opacity"], J$1 = (e, t) => {
      const o = /^(\*=|\+=|-=)/.exec(e);
      if (!o)
        return e;
      const s = re$1(e) || 0, n = parseFloat(t), r = parseFloat(e.replace(o[0], ""));
      switch (o[0][0]) {
        case "+":
          return n + r + s;
        case "-":
          return n - r + s;
        case "*":
          return n * r + s;
      }
    }, K$1 = (e, t, o) => typeof e[t] < "u" ? V$1.includes(t) ? t === "scrollLeft" ? e === window ? pageXOffset : e.scrollLeft : e === window ? pageYOffset : e.scrollTop : e[t] || 0 : e.style[t] || getComputedStyle(e, o)[t], O$1 = (e, t, o, s, n = !1) => {
      t = oe$1(t), n && (o = parseInt(o)), e instanceof HTMLElement ? typeof e[t] < "u" ? e[t] = o : e.style[t] = t === "transform" || t.toLowerCase().includes("color") ? o : o + s : e[t] = o;
    }, W$1 = (e, t, o) => {
      P$1(t, (s, n) => {
        O$1(e, s, n[0] + n[2] * o, n[3], n[4]);
      });
    }, D$1 = (e) => {
      if (!e instanceof HTMLElement)
        return;
      const t = e.style.transform || "", o = /(\w+)\(([^)]*)\)/g, s = /* @__PURE__ */ new Map();
      let n;
      for (; n = o.exec(t); )
        s.set(n[1], n[2]);
      return s;
    }, I$1 = (e) => Array.from(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(e || "#000000")).slice(1).map((t) => parseInt(t, 16)), k$1 = (e, t) => getComputedStyle(e)[t].replace(/[^\d.,]/g, "").split(",").map((o) => parseInt(o)), v = (e, t, o) => {
      let s = [], n = D$1(e);
      P$1(t, (r, i) => {
        let f = i[0];
        i[1];
        let d = i[2], a = i[3];
        r.includes("rotate") || r.includes("skew") ? a === "" && (a = "deg") : r.includes("scale") ? a = "" : a = "px", a === "turn" ? s.push(`${r}(${i[1] * o + a})`) : s.push(`${r}(${f + d * o + a})`);
      }), n.forEach((r, i) => {
        t[i] === void 0 && s.push(`${i}(${r})`);
      }), O$1(e, "transform", s.join(" "));
    }, ee$1 = function(e, t, o) {
      P$1(t, function(s, n) {
        let r = [0, 0, 0];
        for (let i = 0; i < 3; i++)
          r[i] = Math.floor(n[0][i] + n[2][i] * o);
        O$1(e, s, `rgb(${r.join(",")})`);
      });
    }, q$1 = (e) => {
      const t = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
      return e[0] === "#" && e.length === 4 ? "#" + e.replace(t, (o, s, n, r) => s + s + n + n + r + r) : e[0] === "#" ? e : "#" + e;
    }, H$1 = function(e, t, o) {
      W$1(e, t.props, o), v(e, t.transform, o), ee$1(e, t.color, o);
    }, te$1 = (e, t, o = "normal") => {
      const s = {
        props: {},
        transform: {},
        color: {}
      };
      let n, r, i, f, d = D$1(e);
      return P$1(t, (a, c) => {
        const g = Z$1.includes(a), w = B$1.includes(a), u = R$1.includes(a);
        if (Array.isArray(c) && c.length === 1 && (c = c[0]), Array.isArray(c) ? (n = u ? I$1(q$1(c[0])) : b$1(c[0]), r = u ? I$1(q$1(c[1])) : b$1(c[1])) : (g ? n = d.get(a) || 0 : u ? n = k$1(e, a) : n = K$1(e, a), n = u ? n : b$1(n), r = u ? I$1(c) : b$1(J$1(c, Array.isArray(n) ? n[0] : n))), G.includes(a) && n[0] === r[0] && (n[0] = r[0] > 0 ? 0 : 1), o === "reverse" && ([r, n] = [n, r]), f = e instanceof HTMLElement && r[1] === "" && !w && !g ? "px" : r[1], u) {
          i = [0, 0, 0];
          for (let h = 0; h < 3; h++)
            i[h] = r[h] - n[h];
        } else
          i = r[0] - n[0];
        g ? s.transform[a] = [n[0], r[0], i, f] : u ? s.color[a] = [n, r, i, f] : s.props[a] = [n[0], r[0], i, f, !N$1.includes(a)];
      }), s;
    }, $$2 = (e, t, o) => {
      let s;
      if (typeof e == "function")
        s = e;
      else if (/^[a-z]+[\w.]*[\w]$/i.test(e)) {
        const n = e.split(".");
        s = global;
        for (let r = 0; r < n.length; r++)
          s = s[n[r]];
      } else
        s = new Function("a", e);
      return s.apply(o, t);
    }, ne$1 = (e) => typeof e > "u" || e === void 0 || e === null, oe$1 = (e) => e.replace(/-([a-z])/g, (t) => t[1].toUpperCase()), P$1 = (e, t) => {
      let o = 0;
      if (se$1(e))
        [].forEach.call(e, function(s, n) {
          t.apply(s, [n, s]);
        });
      else
        for (let s in e)
          e.hasOwnProperty(s) && t.apply(e[s], [s, e[s], o++]);
      return e;
    }, se$1 = (e) => Array.isArray(e) || typeof e == "object" && "length" in e && typeof e.length == "number", re$1 = (e, t) => {
      const o = /[+-]?\d*\.?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?(%|px|pt|em|rem|in|cm|mm|ex|ch|pc|vw|vh|vmin|vmax|deg|rad|turn)?$/.exec(e);
      return typeof o[1] < "u" ? o[1] : t;
    }, b$1 = (e) => {
      const t = [0, ""];
      return e = "" + e, t[0] = parseFloat(e), t[1] = e.match(/[\d.\-+]*\s*(.*)/)[1] || "", t;
    };
    function z(e, t, o) {
      return Math.min(Math.max(e, t), o);
    }
    const m = {
      linear: () => (e) => e
    };
    m.default = m.linear;
    const _$1 = {
      Sine: () => (e) => 1 - Math.cos(e * Math.PI / 2),
      Circ: () => (e) => 1 - Math.sqrt(1 - e * e),
      Back: () => (e) => e * e * (3 * e - 2),
      Bounce: () => (e) => {
        let t, o = 4;
        for (; e < ((t = Math.pow(2, --o)) - 1) / 11; )
          ;
        return 1 / Math.pow(4, 3 - o) - 7.5625 * Math.pow((t * 3 - 2) / 22 - e, 2);
      },
      Elastic: (e = 1, t = 0.5) => {
        const o = z(e, 1, 10), s = z(t, 0.1, 2);
        return (n) => n === 0 || n === 1 ? n : -o * Math.pow(2, 10 * (n - 1)) * Math.sin((n - 1 - s / (Math.PI * 2) * Math.asin(1 / o)) * (Math.PI * 2) / s);
      }
    };
    ["Quad", "Cubic", "Quart", "Quint", "Expo"].forEach((e, t) => {
      _$1[e] = () => (o) => Math.pow(o, t + 2);
    });
    Object.keys(_$1).forEach((e) => {
      const t = _$1[e];
      m["easeIn" + e] = t, m["easeOut" + e] = (o, s) => (n) => 1 - t(o, s)(1 - n), m["easeInOut" + e] = (o, s) => (n) => n < 0.5 ? t(o, s)(n * 2) / 2 : 1 - t(o, s)(n * -2 + 2) / 2;
    });
    const l = {
      fx: !0,
      elements: {}
    }, ie$1 = {
      id: null,
      el: null,
      draw: {},
      dur: 1e3,
      ease: "linear",
      loop: 0,
      pause: 0,
      dir: "normal",
      defer: 0,
      onFrame: () => {
      },
      onDone: () => {
      }
    }, Q$1 = function(e) {
      return new Promise(function(t) {
        let o, { id: s, el: n, draw: r, dur: i, ease: f, loop: d, onFrame: a, onDone: c, pause: g, dir: w, defer: u } = Object.assign({}, ie$1, e), h = {}, S = "linear", j = [], x = m.linear, C, M = w === "alternate" ? "normal" : w, U = !1, y = s || +(performance.now() * Math.pow(10, 14));
        if (ne$1(n))
          throw new Error("Unknown element!");
        if (typeof n == "string" && (n = document.querySelector(n)), typeof r != "function" && typeof r != "object")
          throw new Error("Unknown draw object. Must be a function or object!");
        (i === 0 || !l.fx) && (i = 1), w === "alternate" && typeof d == "number" && (d *= 2), typeof f == "string" ? (C = /\(([^)]+)\)/.exec(f), S = f.split("(")[0], j = C ? C[1].split(",").map((T) => parseFloat(T)) : [], x = m[S]) : typeof f == "function" ? x = f : x = m.linear, l.elements[y] = {
          element: n,
          id: null,
          stop: 0,
          pause: 0,
          loop: 0
        };
        const A = () => {
          typeof r == "object" && (h = te$1(n, r, M)), o = performance.now(), l.elements[y].loop += 1, l.elements[y].id = requestAnimationFrame(X);
        }, F = () => {
          cancelAnimationFrame(l.elements[y].id), delete l.elements[s], $$2(c, null, n), $$2(t, [this], n);
        }, X = (T) => {
          let E, p;
          const Y = l.elements[y].stop;
          if (Y > 0) {
            Y === 2 && (typeof r == "function" ? r.bind(n)(1, 1) : H$1(n, h, 1)), F();
            return;
          }
          p = (T - o) / i, p > 1 && (p = 1), p < 0 && (p = 0), E = x.apply(null, j)(p), typeof r == "function" ? r.bind(n)(p, E) : H$1(n, h, E), $$2(a, [p, E], n), p < 1 && (l.elements[y].id = requestAnimationFrame(X)), parseInt(p) === 1 && (d ? (w === "alternate" && (M = M === "normal" ? "reverse" : "normal"), typeof d == "boolean" ? setTimeout(function() {
            A();
          }, g) : d > l.elements[y].loop ? setTimeout(function() {
            A();
          }, g) : F()) : w === "alternate" && !U ? (M = M === "normal" ? "reverse" : "normal", U = !0, A()) : F());
        };
        u > 0 ? setTimeout(() => {
          A();
        }, u) : A();
      });
    }, ae$1 = function(e, t = !0) {
      l.elements[e].stop = t === !0 ? 2 : 1;
    };
    async function L$1(e, t) {
      for (let o = 0; o < e.length; o++) {
        const s = e[o];
        s.loop = !1, await Q$1(s);
      }
      typeof t == "boolean" && t ? await L$1(e, t) : typeof t == "number" && (t--, t > 0 && await L$1(e, t));
    }
    l.animate = Q$1;
    l.stop = ae$1;
    l.chain = L$1;
    l.easing = m;

    class d {
      constructor(t = 0, n = 0, s = 0) {
        this.h = t, this.s = n, this.v = s;
      }
      toString() {
        return `hsv(${this.h},${this.s},${this.v})`;
      }
    }
    class ee {
      constructor(t = 0, n = 0, s = 0) {
        this.h = t, this.s = n, this.l = s;
      }
      toString() {
        return `hsl(${this.h},${this.s},${this.l})`;
      }
    }
    class te {
      constructor(t = 0, n = 0, s = 0, r = 0) {
        this.h = t, this.s = n, this.l = s, this.a = r;
      }
      toString() {
        return `hsla(${this.h},${this.s},${this.l},${this.a})`;
      }
    }
    class C {
      constructor(t = 0, n = 0, s = 0) {
        this.r = t, this.g = n, this.b = s;
      }
      toString() {
        return `rgb(${this.r},${this.g},${this.b})`;
      }
    }
    class j {
      constructor(t = 0, n = 0, s = 0, r = 0) {
        this.r = t, this.g = n, this.b = s, this.a = r;
      }
      toString() {
        return `rgba(${this.r},${this.g},${this.b},${this.a})`;
      }
    }
    class ne {
      constructor(t = 0, n = 0, s = 0, r = 0) {
        this.c = t, this.m = n, this.y = s, this.k = r;
      }
      toString() {
        return `cmyk(${this.c},${this.m},${this.y},${this.k})`;
      }
    }
    const _ = {
      HEX: "hex",
      RGB: "rgb",
      RGBA: "rgba",
      HSV: "hsv",
      HSL: "hsl",
      HSLA: "hsla",
      CMYK: "cmyk",
      UNKNOWN: "unknown"
    }, D = {
      angle: 30,
      algorithm: 1,
      step: 0.1,
      distance: 5,
      tint1: 0.8,
      tint2: 0.4,
      shade1: 0.6,
      shade2: 0.3,
      alpha: 1
    }, I = function(e) {
      if (M(e) && typeof e != "string")
        return e;
      if (typeof e != "string")
        throw new Error("Value is not a string!");
      if (e[0] === "#" && e.length === 4) {
        const t = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
        return "#" + e.replace(t, (n, s, r, l) => s + s + r + r + l + l);
      }
      return e[0] === "#" ? e : "#" + e;
    }, se = (e) => {
      if (!M(e))
        return;
      const t = b(e);
      return (t.r * 299 + t.g * 587 + t.b * 114) / 1e3 < 128;
    }, ue = (e) => !se(e), V = (e) => e instanceof d, W = (e) => e instanceof ee, R = (e) => e instanceof te, Y = (e) => e instanceof C, S = (e) => e instanceof j, K = (e) => e instanceof ne, F = (e) => /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(e), M = (e) => e ? F(e) || Y(e) || S(e) || V(e) || W(e) || R(e) || K(e) : !1, N = (e) => F(e) ? _.HEX : Y(e) ? _.RGB : S(e) ? _.RGBA : V(e) ? _.HSV : W(e) ? _.HSL : R(e) ? _.HSLA : K(e) ? _.CMYK : _.UNKNOWN, fe = (e, t) => !M(e) || !M(t) ? !1 : B(e) === B(t), he = (e) => e.toString(), T = (e) => {
      const t = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(
        I(e)
      ), n = [
        parseInt(t[1], 16),
        parseInt(t[2], 16),
        parseInt(t[3], 16)
      ];
      return t ? new C(...n) : null;
    }, U = (e) => "#" + ((1 << 24) + (e.r << 16) + (e.g << 8) + e.b).toString(16).slice(1), k = (e) => {
      const t = new d();
      let n, s, r;
      const l = e.r / 255, i = e.g / 255, f = e.b / 255, a = Math.max(l, i, f), u = Math.min(l, i, f), h = a - u;
      return r = a, a === 0 ? s = 0 : s = 1 - u / a, a === u ? n = 0 : a === l && i >= f ? n = 60 * ((i - f) / h) : a === l && i < f ? n = 60 * ((i - f) / h) + 360 : a === i ? n = 60 * ((f - l) / h) + 120 : a === f ? n = 60 * ((l - i) / h) + 240 : n = 0, t.h = n, t.s = s, t.v = r, t;
    }, w = (e) => {
      let t, n, s;
      const r = e.h, l = e.s * 100, i = e.v * 100, f = Math.floor(r / 60), a = (100 - l) * i / 100, u = (i - a) * (r % 60 / 60), h = a + u, o = i - u;
      switch (f) {
        case 0:
          t = i, n = h, s = a;
          break;
        case 1:
          t = o, n = i, s = a;
          break;
        case 2:
          t = a, n = i, s = h;
          break;
        case 3:
          t = a, n = o, s = i;
          break;
        case 4:
          t = h, n = a, s = i;
          break;
        case 5:
          t = i, n = a, s = o;
          break;
      }
      return new C(
        Math.round(t * 255 / 100),
        Math.round(n * 255 / 100),
        Math.round(s * 255 / 100)
      );
    }, re = (e) => {
      const t = new ne(), n = e.r / 255, s = e.g / 255, r = e.b / 255;
      return t.k = Math.min(1 - n, 1 - s, 1 - r), t.c = 1 - t.k === 0 ? 0 : (1 - n - t.k) / (1 - t.k), t.m = 1 - t.k === 0 ? 0 : (1 - s - t.k) / (1 - t.k), t.y = 1 - t.k === 0 ? 0 : (1 - r - t.k) / (1 - t.k), t.c = Math.round(t.c * 100), t.m = Math.round(t.m * 100), t.y = Math.round(t.y * 100), t.k = Math.round(t.k * 100), t;
    }, ae = (e) => {
      const t = Math.floor(255 * (1 - e.c / 100) * (1 - e.k / 100)), n = Math.ceil(255 * (1 - e.m / 100) * (1 - e.k / 100)), s = Math.ceil(255 * (1 - e.y / 100) * (1 - e.k / 100));
      return new C(t, n, s);
    }, X = (e) => {
      let t, n, s, r;
      return t = e.h, s = (2 - e.s) * e.v, n = e.s * e.v, s === 0 ? n = 0 : (r = s <= 1 ? s : 2 - s, r === 0 ? n = 0 : n /= r), s /= 2, new ee(t, n, s);
    }, Q = (e) => {
      let t, n, s, r;
      return t = e.h, r = e.l * 2, n = e.s * (r <= 1 ? r : 2 - r), s = (r + n) / 2, r + n === 0 ? n = 0 : n = 2 * n / (r + n), new d(t, n, s);
    }, H = (e) => new C(
      Math.round(e.r / 51) * 51,
      Math.round(e.g / 51) * 51,
      Math.round(e.b / 51) * 51
    ), le = (e) => {
      const t = H(e);
      return new j(t.r, t.g, t.b, e.a);
    }, oe = (e) => U(H(T(e))), ce = (e) => k(H(b(e))), de = (e) => X(k(H(b(e)))), be = (e) => re(H(ae(e))), J = (e) => F(e) ? oe(e) : Y(e) ? H(e) : S(e) ? le(e) : V(e) ? ce(e) : W(e) ? de(e) : K(e) ? be(e) : e, O = (e, t = "rgb", n = 1) => {
      let s;
      switch (t.toLowerCase()) {
        case "hex":
          s = B(e);
          break;
        case "rgb":
          s = b(e);
          break;
        case "rgba":
          s = $$1(e, n);
          break;
        case "hsl":
          s = q(e);
          break;
        case "hsla":
          s = L(e, n);
          break;
        case "hsv":
          s = A(e);
          break;
        case "cmyk":
          s = P(e);
          break;
        default:
          s = e;
      }
      return s;
    }, B = (e) => typeof e == "string" ? I(e) : U(b(e)), b = (e) => {
      if (Y(e))
        return e;
      if (S(e))
        return new C(e.r, e.g, e.b);
      if (V(e))
        return w(e);
      if (W(e) || R(e))
        return w(Q(e));
      if (F(e))
        return T(e);
      if (K(e))
        return ae(e);
      throw new Error("Unknown color format!");
    }, $$1 = (e, t) => {
      if (S(e))
        return t && (e.a = t), e;
      const n = b(e);
      return new j(n.r, n.g, n.b, t);
    }, A = (e) => k(b(e)), q = (e) => X(k(b(e))), L = (e, t = 1) => {
      if (R(e))
        return t && (e.a = t), e;
      let n = X(k(b(e)));
      return n.a = t, new te(n.h, n.s, n.l, n.a);
    }, P = (e) => re(b(e)), ge = (e) => {
      const t = b(e), n = N(e).toLowerCase(), s = Math.round(t.r * 0.2125 + t.g * 0.7154 + t.b * 0.0721), r = new C(s, s, s);
      return O(r, n);
    }, ve = (e, t = 10) => ie(e, -1 * Math.abs(t)), ie = (e, t = 10) => {
      let n, s, r = t > 0;
      const l = function(i, f) {
        let a, u, h;
        const o = i.slice(1), x = parseInt(o, 16);
        return a = (x >> 16) + f, a > 255 ? a = 255 : a < 0 && (a = 0), h = (x >> 8 & 255) + f, h > 255 ? h = 255 : h < 0 && (h = 0), u = (x & 255) + f, u > 255 ? u = 255 : u < 0 && (u = 0), "#" + (u | h << 8 | a << 16).toString(16);
      };
      n = N(e).toLowerCase(), n === _.RGBA && e.a;
      do
        s = l(B(e), t), r ? t-- : t++;
      while (s.length < 7);
      return O(s, n);
    }, pe = (e, t, n = 1) => {
      const s = A(e), r = N(e).toLowerCase();
      let l = s.h;
      for (l += t; l >= 360; )
        l -= 360;
      for (; l < 0; )
        l += 360;
      return s.h = l, O(s, r, n);
    }, me = (e, t, n, s) => {
      const r = Object.assign({}, D, s);
      let l;
      const i = [];
      let f, a, u, h, o;
      if (f = A(e), u = f.h, h = f.s, o = f.v, V(f) === !1)
        return console.warn("The value is a not supported color format!"), !1;
      function x(c, y) {
        let v;
        switch (y) {
          case "hex":
            v = c.map(function(m) {
              return B(m);
            });
            break;
          case "rgb":
            v = c.map(function(m) {
              return b(m);
            });
            break;
          case "rgba":
            v = c.map(function(m) {
              return $$1(m, r.alpha);
            });
            break;
          case "hsl":
            v = c.map(function(m) {
              return q(m);
            });
            break;
          case "hsla":
            v = c.map(function(m) {
              return L(m, r.alpha);
            });
            break;
          case "cmyk":
            v = c.map(function(m) {
              return P(m);
            });
            break;
          default:
            v = c;
        }
        return v;
      }
      function G(c, y, v) {
        return Math.max(y, Math.min(c, v));
      }
      function p(c, y, v) {
        return c < y ? y : c > v ? v : c;
      }
      function g(c, y) {
        for (c += y; c >= 360; )
          c -= 360;
        for (; c < 0; )
          c += 360;
        return c;
      }
      switch (t) {
        case "monochromatic":
        case "mono":
          if (r.algorithm === 1)
            a = w(f), a.r = p(
              Math.round(a.r + (255 - a.r) * r.tint1),
              0,
              255
            ), a.g = p(
              Math.round(a.g + (255 - a.g) * r.tint1),
              0,
              255
            ), a.b = p(
              Math.round(a.b + (255 - a.b) * r.tint1),
              0,
              255
            ), i.push(k(a)), a = w(f), a.r = p(
              Math.round(a.r + (255 - a.r) * r.tint2),
              0,
              255
            ), a.g = p(
              Math.round(a.g + (255 - a.g) * r.tint2),
              0,
              255
            ), a.b = p(
              Math.round(a.b + (255 - a.b) * r.tint2),
              0,
              255
            ), i.push(k(a)), i.push(f), a = w(f), a.r = p(Math.round(a.r * r.shade1), 0, 255), a.g = p(Math.round(a.g * r.shade1), 0, 255), a.b = p(Math.round(a.b * r.shade1), 0, 255), i.push(k(a)), a = w(f), a.r = p(Math.round(a.r * r.shade2), 0, 255), a.g = p(Math.round(a.g * r.shade2), 0, 255), a.b = p(Math.round(a.b * r.shade2), 0, 255), i.push(k(a));
          else if (r.algorithm === 2)
            for (i.push(f), l = 1; l <= r.distance; l++)
              o = G(o - r.step, 0, 1), h = G(h - r.step, 0, 1), i.push({ h: u, s: h, v: o });
          else if (r.algorithm === 3)
            for (i.push(f), l = 1; l <= r.distance; l++)
              o = G(o - r.step, 0, 1), i.push({ h: u, s: h, v: o });
          else
            o = G(f.v + r.step * 2, 0, 1), i.push({ h: u, s: h, v: o }), o = G(f.v + r.step, 0, 1), i.push({ h: u, s: h, v: o }), i.push(f), h = f.s, o = f.v, o = G(f.v - r.step, 0, 1), i.push({ h: u, s: h, v: o }), o = G(f.v - r.step * 2, 0, 1), i.push({ h: u, s: h, v: o });
          break;
        case "complementary":
        case "complement":
        case "comp":
          i.push(f), u = g(f.h, 180), i.push(new d(u, h, o));
          break;
        case "double-complementary":
        case "double-complement":
        case "double":
          i.push(f), u = g(u, 180), i.push(new d(u, h, o)), u = g(u, r.angle), i.push(new d(u, h, o)), u = g(u, 180), i.push(new d(u, h, o));
          break;
        case "analogous":
        case "analog":
          u = g(u, r.angle), i.push(new d(u, h, o)), i.push(f), u = g(f.h, 0 - r.angle), i.push(new d(u, h, o));
          break;
        case "triadic":
        case "triad":
          for (i.push(f), l = 1; l < 3; l++)
            u = g(u, 120), i.push(new d(u, h, o));
          break;
        case "tetradic":
        case "tetra":
          i.push(f), u = g(f.h, 180), i.push(new d(u, h, o)), u = g(f.h, -1 * r.angle), i.push(new d(u, h, o)), u = g(u, 180), i.push(new d(u, h, o));
          break;
        case "square":
          for (i.push(f), l = 1; l < 4; l++)
            u = g(u, 90), i.push(new d(u, h, o));
          break;
        case "split-complementary":
        case "split-complement":
        case "split":
          u = g(u, 180 - r.angle), i.push(new d(u, h, o)), i.push(f), u = g(f.h, 180 + r.angle), i.push(new d(u, h, o));
          break;
        default:
          console.warn("Unknown scheme name");
      }
      return x(i, n);
    }, E = function(e) {
      const t = e.toLowerCase();
      let n = t.replace(/[^\d.,]/g, "").split(",").map((s) => t.includes("hs") ? parseFloat(s) : parseInt(s));
      return t[0] === "#" ? I(t) : t.includes("rgba") ? new j(n[0], n[1], n[2], n[3]) : t.includes("rgb") ? new C(n[0], n[1], n[2]) : t.includes("cmyk") ? new ne(n[0], n[1], n[2], n[3]) : t.includes("hsv") ? new d(n[0], n[1], n[2]) : t.includes("hsla") ? new te(n[0], n[1], n[2], n[3]) : t.includes("hsl") ? new ee(n[0], n[1], n[2]) : t;
    }, Z = (e = "hex", t = 1) => {
      const n = (f, a) => Math.floor(f + Math.random() * (a + 1 - f));
      let s, r, l, i;
      return r = n(0, 255), l = n(0, 255), i = n(0, 255), s = "#" + ((1 << 24) + (r << 16) + (l << 8) + i).toString(16).slice(1), e === "hex" ? s : O(s, e, t);
    };
    class Be {
      /**
       * Private method for setting value. Do not use outside
       * @param {*} color
       * @private
       */
      _setValue(t) {
        t || (t = "#000000"), typeof t == "string" && (t = E(t)), t && M(t) ? this._value = t : this._value = void 0;
      }
      /**
       * Private method for setting options
       * @param options
       * @private
       */
      _setOptions(t) {
        this._options = Object.assign({}, D, t);
      }
      /**
       * Constructor
       * @param {*} color. Set color value. Value must one of: hex, RGB, RGBA, HSL, HSLA, HSV, CMYK.
       * @param {Object} options
       */
      constructor(t = "#000000", n = null) {
        this._setValue(t), this._setOptions(n);
      }
      /**
       * Getter. Get options
       * @returns {{shade1: number, shade2: number, tint1: number, tint2: number, distance: number, alpha: number, angle: number, step: number, algorithm: number}}
       */
      get options() {
        return this._options;
      }
      /**
       * Setter. Set options. Will override default options
       * @param options
       */
      set options(t) {
        this._setOptions(t);
      }
      /**
       * Getter. Return current color value.
       * @returns {*}
       */
      get value() {
        return this._value ? this._value : void 0;
      }
      /**
       * Setter. Set color value. Value must one of: hex, RGB, RGBA, HSL, HSLA, HSV, CMYK.
       * @param {*} color
       */
      set value(t) {
        this._setValue(t);
      }
      /**
       * Convert current color to RGB
       * @returns {this | undefined}
       */
      toRGB() {
        if (this._value)
          return this._value = b(this._value), this;
      }
      /**
       * Getter.  Get color in RGB format
       * @returns {RGB | undefined}
       */
      get rgb() {
        return this._value ? b(this._value) : void 0;
      }
      /**
       * Convert current value to RGBA
       * @param alpha - Alpha chanel value.
       * @returns {this | undefined}
       */
      toRGBA(t) {
        if (this._value)
          return S(this._value) ? t && (this._value = $$1(this._value, t)) : this._value = $$1(
            this._value,
            t || D.alpha
          ), this;
      }
      /**
       * Getter. Get value in RGBA format. For alpha chanel value used options.alpha
       * @returns {RGBA | undefined}
       */
      get rgba() {
        return this._value ? S(this._value) ? this._value : $$1(this._value, this._options.alpha) : void 0;
      }
      /**
       * Convert current value to HEX
       * @returns {this | undefined}
       */
      toHEX() {
        if (this._value)
          return this._value = B(this._value), this;
      }
      /**
       * Getter. Get value as HEX
       * @returns {string | undefined}
       */
      get hex() {
        return this._value ? B(this._value) : void 0;
      }
      /**
       * Convert current value to HSV
       * @returns {this | undefined}
       */
      toHSV() {
        if (this._value)
          return this._value = A(this._value), this;
      }
      /**
       * Getter. Get value as HSV
       * @returns {HSV | undefined}
       */
      get hsv() {
        return this._value ? A(this._value) : void 0;
      }
      /**
       * Convert current value to HSL
       * @returns {this | undefined}
       */
      toHSL() {
        if (this._value)
          return this._value = q(this._value), this;
      }
      /**
       * Getter. Get value as HSL
       * @returns {HSL | undefined}
       */
      get hsl() {
        return this._value ? q(this._value) : void 0;
      }
      /**
       * Convert current value to HSV
       * @param alpha
       * @returns {this | undefined}
       */
      toHSLA(t) {
        if (this._value)
          return R(this._value) ? t && (this._value = L(this._value, t)) : this._value = L(this._value, t), this;
      }
      /**
       * Getter. Get value as HSLA. For alpha used options.alpha
       * @returns {HSLA | undefined}
       */
      get hsla() {
        return this._value ? R(this._value) ? this._value : L(this._value, this._options.alpha) : void 0;
      }
      /**
       * Convert current value to CMYK
       * @returns {this | undefined}
       */
      toCMYK() {
        if (this._value)
          return this._value = P(this._value), this;
      }
      /**
       * Getter. Get value as CMYK
       * @returns {CMYK | undefined}
       */
      get cmyk() {
        return this._value ? P(this._value) : void 0;
      }
      /**
       * Convert color value to websafe value
       * @returns {this | undefined}
       */
      toWebsafe() {
        if (this._value)
          return this._value = J(this._value), this;
      }
      /**
       * Getter. Get value as websafe.
       * @returns {HSLA | undefined}
       */
      get websafe() {
        return this._value ? J(this._value) : void 0;
      }
      /**
       * Get stringify color value
       * @returns {string} This function return string presentation of color. Example: for RGB will return rgb(x, y, z)
       */
      toString() {
        return this._value ? he(this._value) : void 0;
      }
      /**
       * Darken color for requested percent value
       * @param {int} amount - Value must between 0 and 100. Default value is 10
       * @returns {this | undefined}
       */
      darken(t = 10) {
        if (this._value)
          return this._value = ve(this._value, t), this;
      }
      /**
       * Darken color for requested percent value
       * @param {int} amount - Value must between 0 and 100. Default value is 10
       * @returns {this | undefined}
       */
      lighten(t = 10) {
        if (this._value)
          return this._value = ie(this._value, t), this;
      }
      /**
       * Return true, if current color id dark
       * @returns {boolean|undefined}
       */
      isDark() {
        return this._value ? se(this._value) : void 0;
      }
      /**
       * Return true, if current color id light
       * @returns {boolean|undefined}
       */
      isLight() {
        return this._value ? ue(this._value) : void 0;
      }
      /**
       * Change value on wheel with specified angle
       * @param {int} angle - Value between -360 and 360
       */
      hueShift(t) {
        if (this._value)
          return this._value = pe(this._value, t), this;
      }
      /**
       * Convert color value to grayscale value
       * @returns {this | undefined}
       */
      grayscale() {
        if (!(!this._value || this.type === _.UNKNOWN))
          return this._value = ge(
            this._value,
            ("" + this.type).toLowerCase()
          ), this;
      }
      /**
       * Getter. Get color type
       * @returns {string}
       */
      get type() {
        return N(this._value);
      }
      /**
       * Create specified  color scheme for current color value
       * @param {string} name - Scheme name
       * @param {string} format - Format for returned values
       * @param {Object} options - Options for generated schema, will override default options
       * @returns {Array | undefined}
       */
      getScheme(t, n, s) {
        return this._value ? me(this._value, t, n, s) : void 0;
      }
      /**
       * Check if color is equal to comparison color
       * @param {*} color
       * @returns {boolean}
       */
      equal(t) {
        return fe(this._value, t);
      }
      random(t, n) {
        this._value = Z(t, n);
      }
      static isColor(t) {
        const n = E(t);
        return M(n);
      }
      static randomColor(t, n) {
        return Z(t, n);
      }
    }

    const globalize = () => {
        globalThis.Color = Be;
        globalThis.Animation = l;
        globalThis.Datetime = Datetime$1;
        globalThis.datetime = datetime$1;
        globalThis.Str = Str;
        globalThis.string = str;
        globalThis.$ = $$3;
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

    const en_US = {
        "calendar": {
            "months": [
                "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December",
                "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
            ],
            "days": [
                "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday",
                "Su", "Mo", "Tu", "We", "Th", "Fr", "Sa",
                "Sun", "Mon", "Tus", "Wen", "Thu", "Fri", "Sat"
            ],
            "time": {
                "hours": "HOURS",
                "minutes": "MINS",
                "seconds": "SECS",
                "month": "MON",
                "day": "DAY",
                "year": "YEAR",
                "months": "MONS",
                "days": "DAYS",
                "years": "YEARS"
            },
            "weekStart": 0
        },
        "buttons": {
            "ok": "OK",
            "cancel": "Cancel",
            "done": "Done",
            "today": "Today",
            "now": "Now",
            "clear": "Clear",
            "help": "Help",
            "yes": "Yes",
            "no": "No",
            "random": "Random",
            "save": "Save",
            "reset": "Reset"
        },
    };

    const ua_UK = {
        "calendar": {
            "months": [
                "Сіяень", "Лютий", "Березень", "Квітень", "Травень", "червень", "Липень", "Серпень", "Вересень", "Жовтень", "Листопад", "Шрудень",
                "Січ", "Лют", "Бер", "Кві", "Тра", "Чер", "Лип", "Сер", "Вер", "Жов", "Лис", "Гру"
            ],
            "days": [
                "Неділя", "Понеділок", "Вівторок", "Середа", "Четвер", "П'ятниця", "Субота",
                "Нд", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб",
                "Нед", "Пон", "Вів", "Сер", "Чет", "Птн", "Суб"
            ],
            "time": {
                "hours": "Години",
                "minutes": "Мінути",
                "seconds": "Сек",
                "month": "Місяць",
                "day": "День",
                "year": "Рік",
                "months": "Місяців",
                "days": "Днів",
                "years": "Років"
            },
            "weekStart": 0
        },
        "buttons": {
            "ok": "OK",
            "cancel": "Відміна",
            "done": "Кінець",
            "today": "Сьогодні",
            "now": "Тепер",
            "clear": "Очистити",
            "help": "Допомога",
            "yes": "Так",
            "no": "Ні",
            "random": "Випадково",
            "save": "Зберегти",
            "reset": "Відновити"
        },
    };

    const registerLocales = (locales) => {
        locales['en-US'] = en_US;
        locales['ua-UK'] = ua_UK;
    };

    const upgradeDatetime = (locales) => {
        Datetime.getLocale = function(locale = "en-US"){
            let data;

            if (!locales[locale]) {
                locale = "en-US";
            }

            data = locales[locale]['calendar'];

            return {
                months: data.months.filter( function(el, i){ return i < 12} ),
                monthsShort: data.months.filter( function(el, i){ return i > 11} ),
                weekdays: data.days.filter( function(el, i){ return i < 7} ),
                weekdaysShort: data.days.filter( function(el, i){ return i > 13} ),
                weekdaysMin: data.days.filter( function(el, i){ return i > 6 && i < 14} ),
                weekStart: data.weekStart
            }
        };
    };

    globalThis.METRO_GLOBAL_EVENTS = [];

    const GlobalEvents = {
        setEvent(fn, ctx = null){
            if (METRO_GLOBAL_EVENTS.includes(fn)) return
            METRO_GLOBAL_EVENTS.push(fn.bind(ctx));
            return METRO_GLOBAL_EVENTS.length
        },

        deleteEvent(fn){
            const index = METRO_GLOBAL_EVENTS.indexOf(fn);
            if (index === -1) return
            delete METRO_GLOBAL_EVENTS[index];
        },

        getGlobalEvents(){
            return METRO_GLOBAL_EVENTS
        },

        sizeOfGlobalEvents(){
            return METRO_GLOBAL_EVENTS.length
        }
    };

    let HotkeyManagerDefaultOptions = {

    };

    const specialKeys = {
        8: "backspace", 9: "tab", 13: "return", 16: "shift", 17: "ctrl", 18: "alt", 19: "pause",
            20: "capslock", 27: "esc", 32: "space", 33: "pageup", 34: "pagedown", 35: "end", 36: "home",
            37: "left", 38: "up", 39: "right", 40: "down", 45: "insert", 46: "del",
            96: "0", 97: "1", 98: "2", 99: "3", 100: "4", 101: "5", 102: "6", 103: "7",
            104: "8", 105: "9", 106: "*", 107: "+", 109: "-", 110: ".", 111 : "/",
            112: "f1", 113: "f2", 114: "f3", 115: "f4", 116: "f5", 117: "f6", 118: "f7", 119: "f8",
            120: "f9", 121: "f10", 122: "f11", 123: "f12", 144: "numlock", 145: "scroll", 188: ",", 190: ".",
            191: "/", 224: "meta"
    };

    const shiftNums = {
        "~":"`", "!":"1", "@":"2", "#":"3", "$":"4", "%":"5", "^":"6", "&":"7",
            "*":"8", "(":"9", ")":"0", "_":"-", "+":"=", ":":";", "\"":"'", "<":",",
            ">":".",  "?":"/",   "|":"\\"
    };

    class HotkeyManager {
        options = null
        hotkeys = []

        constructor(options) {
            this.options = merge({}, HotkeyManagerDefaultOptions, options);
            this.#createEvents();
        }

        #findKey(elem, key){
            for(let b of this.hotkeys) {
                if (b.elem === elem && b.key === key) {
                    return b
                }
            }
            return undefined
        }

        #findElement(key){
            const elements = [];
            for(let b of this.hotkeys) {
                if (b.key === key) {
                    elements.push(b.elem);
                }
            }
            return elements
        }

        register(elem, key, repeat = false){
            const keyExist = this.#findKey(elem, key);
            if (!keyExist) {
                this.hotkeys.push({
                    elem,
                    key,
                    repeat: JSON.parse(repeat)
                });
            }
            return this
        }

        #getModifier(e){
            const m = [];
            if (e.altKey) {m.push("alt");}
            if (e.ctrlKey || e.metaKey) {m.push("ctrl");}
            if (e.shiftKey) {m.push("shift");}
            return m;
        }

        #getKey(e){
            let key, k = e.keyCode, char = String.fromCharCode( k ).toLowerCase();
            if( e.shiftKey ){
                key = shiftNums[ char ] ? shiftNums[ char ] : char;
            }
            else {
                key = specialKeys[ k ] === undefined
                    ? char
                    : specialKeys[ k ];
            }

            return this.#getModifier(e).length ? this.#getModifier(e).join("+") + "+" + key : key;
        }

        #createEvents(){
            document.addEventListener("keydown", (event) => {
                const key = this.#getKey(event);
                const elements = this.#findElement(key);

                if (elements.length === 0) return

                event.preventDefault();

                for(let el of elements) {
                    const node = this.#findKey(el, key);
                    if (event.repeat && node.repeat === false) return
                    el.click();
                }
            });
        }
    }

    const MetroOptions = {
        removeCloakTimeout: 100,
        replaceHint: false,
    };

    class Metro5$1 {
        version = "0.59.7"
        status = "pre-alpha"
        options = {}
        hotkeyManager = new HotkeyManager()
        static locales = {}
        static plugins = {};

        constructor(options = {}) {
            this.options = merge({}, MetroOptions, options);

            this.info();
            this.init();
            this.observe();

            if (typeof this.options.onInit === 'function') {
                this.options.onInit.apply(this, []);
            }
        }

        info(){
            console.info(`Metro 5 - v${this.version}-${this.status}`);
            console.info(`Includes: Query, Datetime, String, Html, Animation, Color.`);
        }

        init(){
            globalize();
            registerLocales(Metro5$1.locales);
            upgradeDatetime(Metro5$1.locales);

            const plugins = $("[data-role]");
            const hotkeys = $("[data-hotkey]");

            plugins.each((_, elem)=>{
                const roles = to_array($(elem).attr("data-role"));
                for(let role of roles) {
                    Metro5$1.makePlugin(elem, role, {});
                }
            });

            hotkeys.each((_, elem) => {
                this.hotkeyManager.register(
                    elem,
                    $(elem).attr("data-hotkey"),
                    $(elem).attr("data-hotkey-repeat") || false
                );
            });

            if (this.options.replaceHint) {
                const needHint = $("[title], [data-hint-text]");
                needHint.each((_, el) => {
                    Metro5$1.makePlugin(el, "hint");
                });
            }

            $(()=>{
                const body = $("body");
                if (body.hasClass('cloak')) {
                    body.addClass('remove-cloak');
                    setTimeout( () => {
                        body.removeClass('cloak remove-cloak');
                    },this.options.removeCloakTimeout);
                }
            });

            $.each(GlobalEvents.getGlobalEvents(), (_, fn) => {
                if (typeof fn !== "function") {return}
                fn.apply(null, []);
            });

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
                                        Metro5$1.getPlugin(elem, role).updateAttr(attr, newValue, oldValue);
                                    }
                                }
                            }
                        }

                        if (mutation.attributeName === "data-hotkey") {
                            that.hotkeyManager.register(
                                elem,
                                newValue,
                                $elem.attr("data-hotkey-repeat") || false);
                        }
                    } else if (mutation.type === 'childList'){
                        if (mutation.addedNodes.length) {
                            const nodes = mutation.addedNodes;

                            if (nodes.length) {
                                for (let node of nodes) {
                                    const $node = $(node);
                                    if ($node.attr("data-role")) {
                                        const roles = to_array($node.attr("data-role"), ",");
                                        $.each(roles, (i, r) => {
                                            Metro5$1.makePlugin(node, r);
                                        });
                                    }
                                    $.each($node.find("[data-role"), (i, el) => {
                                        const roles = to_array($(el).attr("data-role"), ",");
                                        $.each(roles, (i, r) => {
                                            Metro5$1.makePlugin(el, r);
                                        });
                                    });

                                    if ($node.attr("data-hotkey")) {
                                        that.hotkeyManager.register(node, $node.attr("data-hotkey"), $node.attr("data-hotkey-repeat") || false);
                                    }
                                    $.each($node.find("[data-hotkey]"), (i, el) => {
                                        that.hotkeyManager.register(el, $(el).attr("data-hotkey"), $(el).attr("data-hotkey-repeat") || false);
                                    });
                                }
                            }
                        }
                    }
                });
            };
            const observer = new MutationObserver(observerCallback);
            observer.observe($("html")[0], observerConfig);
        }

        static getPlugin(elem, name){
            const pluginId = md5(`${clearName(name)}::${$(elem).id()}`);
            return Metro5$1.plugins[pluginId]
        }

        static makePlugin(elem, name, options){
            let elemId = $(elem).id();
            name = clearName(name);
            if (!elemId) {
                elemId = `${name}${uniqueId(16)}--auto`;
                $(elem).id(elemId);
            }
            const pluginId = md5(`${name}::${$(elem).id()}`);
            if ($(elem).hasAttr(`data-role-${name}`) && $(elem).attr(`data-role-${name}`) === true) {
                return Metro5$1.plugins[pluginId]
            }
            const _class = Registry.getClass(name);
            if (!_class) {
                throw new Error(`Can't create component ${name}. Component Class does not exist!`)
            }
            const plugin = new _class(elem, options);
            Metro5$1.plugins[pluginId] = plugin;
            elem.setAttribute(`data-role-${name}`, true);
            return plugin
        }

        static destroyPlugin(elem, name){
            const pluginId = md5(`${clearName(name)}::${$(elem).id()}`);
            const plugin = this.plugins[pluginId];
            if (!plugin) return
            plugin.destroy();
            delete Metro5$1.plugins[pluginId];
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
            Registry.dump();
        }

        static getLocale(locale, part){
            if (!Metro5$1.locales[locale]) locale = 'en-US';
            const loc = Metro5$1.locales[locale];
            return part ? loc[part] : loc
        }

        static dispatchEvent(elem, eventName, detail = {}, options = {cancelable: true, bubbles: true}){
            return elem.dispatchEvent(new CustomEvent(name, { ...options, detail }))
        }
    }

    globalThis.Metro5 = Metro5$1;

    const ComponentDefaultOptions = {

    };

    class Component {
        constructor(elem, name, options) {
            this.options = merge({}, ComponentDefaultOptions, options);
            this.elem = elem;
            this.element = $(elem);
            this.component = this.element;
            this.name = name || `component`;

            this.setOptionsFromAttributes();
        }

        setOptionsFromAttributes(){
            const element = this.element, o = this.options;
            const data = element.data();

            $.each(data, function(key, value){
                if (key === 'data-role') return
                key = new Str(key.substring(5)).camelCase().value;
                if (key in o) {
                    try {
                        o[key] = JSON.parse(value);
                    } catch (e) {
                        o[key] = value;
                    }
                }
            });
        }

        fireEvent(eventName, data){
            const element = this.element, o = this.options;
            const event = str(eventName).camelCase().capitalize().value;

            element.fire(event.toLowerCase(), data);

            return exec$1(o["on"+event], data, element[0]);
        }

        /**
         *
         * @param {Object} events {eventName: data, ...}
         * @returns {number}
         */
        fireEvents(events){
            if (!events || !isObject(events) || !objectLength(events)) {
                panic(`Events not defined`);
            }

            for (let o in events) {
                this.fireEvent(o, events[o]);
            }

            return objectLength(events)
        }

        dispatchEvent(name, detail = {}, options = {cancelable: true, bubbles: true}){
            return this.elem.dispatchEvent(new CustomEvent(name, { ...options, detail }))
        }

        updateAttr(attr, newVal, oldVal){}

        destroy(){
            this.component.remove();
        }
    }

    let AccordionDefaultOptions = {
        showMarker: true,
        markerPosition: "left",
        singleFrame: true,
        duration: 100,
        frameHeight: 0,
        onFrameOpen: f => f,
        onFrameClose: f => f,
        onBeforeFrameOpen: f => true,
        onBeforeFrameClose: f => true,
        onCreate: f => f
    };

    class Accordion extends Component {
        frames = []
        constructor(elem, options = {}) {
            if (typeof globalThis["metroAccordionSetup"] !== 'undefined') {
                AccordionDefaultOptions = merge({}, AccordionDefaultOptions, globalThis["metroAccordionSetup"]);
            }
            super(elem, "accordion", merge({}, AccordionDefaultOptions, options));
            this.createStruct();
            this.createEvents();
        }

        createStruct(){
            const o = this.options;

            this.element.addClass("accordion");

            if (o.showMarker) {
                this.element.addClass("marker-on");
            }

            $.each(this.element.children(), function(index) {
                const div = $(this);
                const title = div.attr("title") || `Frame ${index+1}`;
                const frame = $(`
                <div class="accordion__frame">
                    <div class="accordion__frame__heading">${title}</div>
                    <div class="accordion__frame__content"></div>
                </div>
            `).insertBefore(div);


                const content = frame.find(".accordion__frame__content").append(div);
                frame.find(".accordion__frame__heading");


                div.attr("title", "");

                if (div.hasClass("active")) {
                    frame.addClass("active");
                    div.removeClass("active");
                    if (o.frameHeight) {
                        content.css({
                            height: o.frameHeight
                        });
                    }
                } else {
                    content.css({
                        height: 0
                    });
                }
            });

            this.frames = this.element.children();
        }

        createEvents(){
            const that = this, el = this.element; this.options;

            el.on("click", ".accordion__frame__heading", function(e){
                const frame = $(this).closest(".accordion__frame");
                if (frame.hasClass("active")) {
                    that.closeFrame(frame);
                } else {
                    that.openFrame(frame);
                }
                e.preventDefault();
            });
        }

        openFrame(frame){
            const o = this.options;
            const fr = $(frame);

            if (fr.hasClass("active")) return
            if (typeof o.onBeforeFrameOpen === 'function' && !o.onBeforeFrameOpen.apply(this, [fr[0]])) return

            if (o.singleFrame) {
                this.closeAll();
            }

            fr.addClass("active");

            const content = fr.find(".accordion__frame__content");

            Animation.animate({
                el: content[0],
                draw: {
                    height: [0, o.frameHeight ? o.frameHeight : content[0].scrollHeight]
                },
                dur: o.duration
            });

            this.fireEvent("frame-open", {
                frame
            });
        }
        closeFrame(frame){
            const o = this.options;
            const fr = $(frame);

            if (!fr.hasClass("active")) return
            if (typeof o.onBeforeFrameClose === 'function' && !o.onBeforeFrameClose.apply(this, [fr[0]])) return

            fr.removeClass("active");

            const content = fr.find(".accordion__frame__content");

            Animation.animate({
                el: content[0],
                draw: {
                    height: 0
                },
                dur: o.duration
            });

            this.fireEvent("frame-close", {
                frame
            });
        }
        closeAll(){
            const openedFrames = this.element.children(".active");
            openedFrames.each((_, f)=>{
                this.closeFrame(f);
            });
        }
    }

    Registry.register("accordion", Accordion);

    const ActivitiesDefaultOptions = {
        type: "simple",
        style: "default"
    };

    class Activity extends Component {
        constructor(elem, options = {}) {
            super(elem, "activity", merge({}, ActivitiesDefaultOptions, options));
            this.createStruct();
        }

        createStruct(){
            const element = this.element, o = this.options;

            element.addClass("activity-type-"+o.type);

            const metro = () => {
                element.html(`
                <div class="activity-element-circle"></div>
                <div class="activity-element-circle"></div>
                <div class="activity-element-circle"></div>
                <div class="activity-element-circle"></div>
                <div class="activity-element-circle"></div>
            `);
            };
            const square = () => {
                element.html(`
                <div class="activity-element-square"></div>
                <div class="activity-element-square"></div>
                <div class="activity-element-square"></div>
                <div class="activity-element-square"></div>
            `);
            };
            const cycle = () => {
                element.html(`
                <div class="activity-element-circle"></div>
            `);
            };
            const ring = () => {
                element.html(`
                <div class="activity-element-wrap">
                    <div class="activity-element-circle"></div>
                </div>
                <div class="activity-element-wrap">
                    <div class="activity-element-circle"></div>
                </div>
                <div class="activity-element-wrap">
                    <div class="activity-element-circle"></div>
                </div>
                <div class="activity-element-wrap">
                    <div class="activity-element-circle"></div>
                </div>
                <div class="activity-element-wrap">
                    <div class="activity-element-circle"></div>
                </div>
            `);
            };
            const atom = () => {
                element.html(`
                <div class="activity-wrapper">
                    <div class="activity-element-electron"></div>
                    <div class="activity-element-electron"></div>
                    <div class="activity-element-electron"></div>
                </div>
            `);
            };
            const bars = () => {
                element.html(`
                <div class="activity-wrapper">
                    <span class="activity-element-bar"></span>
                    <span class="activity-element-bar"></span>
                    <span class="activity-element-bar"></span>
                    <span class="activity-element-bar"></span>
                    <span class="activity-element-bar"></span>
                    <span class="activity-element-bar"></span>
                </div>
            `);
            };
            const simple = () => {
                element.html(`
                <svg class="circular">
                    <circle class="path" cx="32" cy="32" r="20" fill="none" stroke-width="2" stroke-miterlimit="10"/>
                </svg>
            `);
            };

            switch (o.type) {
                case 'metro': metro(); break;
                case 'square': square(); break;
                case 'cycle': cycle(); break;
                case 'ring': ring(); break;
                case 'atom': atom(); break;
                case 'bars': bars(); break;
                default: simple();
            }

            let style = 'activity-style-';

            if (o.style === 'default') {
                style += $.dark ? 'light' : 'dark';
            } else {
                style += o.style;
            }

            element.addClass(style);
        }
    }

    Registry.register("activity", Activity);

    let AdblockHunterDefaultOptions = {
        deferred: 0,
        bait: "adblock-bite adsense google-adsense dblclick advert topad top_ads topAds textads sponsoredtextlink_container show_ads right-banner rekl mpu module-ad mid_ad mediaget horizontal_ad headerAd contentAd brand-link bottombanner bottom_ad_block block_ad bannertop banner-right banner-body b-banner b-article-aside__banner b-advert adwrapper adverts advertisment advertisement:not(body) advertise advert_list adtable adsense adpic adlist adleft adinfo adi adholder adframe addiv ad_text ad_space ad_right ad_links ad_body ad_block ad_Right adTitle adText",
        checkLocalhost: true,
        checkCount: 10,
        checkInterval: 1000,
        onBite: f => f,
        onFishingStart: f => f,
        onFishingDone: f => f
    };

    class AdblockHunter extends Component {
        constructor(elem, options) {
            if (typeof globalThis["metroAdblockHunterSetup"] !== 'undefined') {
                AdblockHunterDefaultOptions = merge({}, AdblockHunterDefaultOptions, globalThis["metroAdblockHunterSetup"]);
            }
            super(elem, "adblock-hunter", merge({}, AdblockHunterDefaultOptions, options));
            this.createBait();
            setTimeout(()=>{
                this.fishing();
            }, this.options.deferred);
        }

        createBait(){
            const o = this.options;
            const html = this.element.html().trim();
            const classes = o.bait + (html ? html : "");
            this.element
                .addClass(shuffleArray$1(classes.split(" ")).join(" "))
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
                .append($("<a href='https://dblclick.net'>").html('dblclick.net'));
        }

        fishing(){
            const o = this.options;
            let checkCount = o.checkCount;
            let interval;

            this.fireEvent("fishing-start");

            const done = () => {
                clearInterval(interval);
                this.fireEvent("fishing-done");
                this.element.remove();
            };
            const run = () => {
                let a = $(".adsense.google-adsense.dblclick.advert.adblock-bite");
                let b = a.find("a");

                if (!o.checkLocalhost && $.localhost) {
                    done();
                    return
                }

                if (!a.length || !b.length || a.css("display") === 'none' || b.css("display") === "none") {
                    this.fireEvent("bite");
                    done();
                } else {
                    checkCount--;
                    if (checkCount === 0) {
                        done();
                    }
                }
            };

            interval = setInterval(run, o.checkInterval);
        }
    }

    Registry.register("adblock-hunter", AdblockHunter);

    let AppbarDefaultOptions = {
        expand: false,
        expandPoint: "",
        duration: 100,
        themeToggle: true,
        theme: "auto",
        onMenuOpen: noop,
        onMenuClose: noop,
    };

    class Appbar extends Component {
        hamburger = null
        menu = null
        schemeToggle = null
        constructor(elem, options) {
            if (typeof globalThis["metroAppbarSetup"] !== "undefined") {
                AppbarDefaultOptions = merge({}, AppbarDefaultOptions, globalThis["metroAppbarSetup"]);
            }
            super(elem, "appbar", merge({}, AppbarDefaultOptions, options));
            setTimeout(()=>{ // TODO Why theme toggle not create without this?
                this.createStruct();
                this.createEvents();
            });
        }

        createStruct(){
            const element = this.element, o = this.options;
            element.addClass("appbar");

            if (o.themeToggle) {
                this.themeToggle = $(`
                <div class="appbar-item theme-toggle-wrapper">
                    <div data-role="theme-toggle" data-theme="${o.theme}"></div>
                </div>
            `);
                element.prepend(this.themeToggle);
            }

            this.hamburger = element.find(".hamburger");
            if (!this.hamburger.length) {
                this.hamburger = $(`
                <button class="hamburger chevron-down">
                    <span class="line"></span>                
                    <span class="line"></span>                
                    <span class="line"></span>                
                </button>
            `);
                element.prepend(this.hamburger);
            }

            this.menu = element.find(".appbar-menu");

            if (this.menu.length === 0) {
                this.hamburger.css("display", "none");
            }

            if (this.hamburger.css('display') === 'block') {
                this.menu.css({height: 0}).addClass("collapsed");
                this.hamburger.removeClass("hidden");
            } else {
                this.hamburger.addClass("hidden");
            }

            if (o.expand === true) {
                element.addClass("appbar-expand");
                this.hamburger.addClass("hidden");
            } else {
                if (o.expandPoint && mediaExist(o.expandPoint)) {
                    element.addClass("appbar-expand");
                    this.hamburger.addClass("hidden");
                    this.menu.css({height: "auto"});
                }
            }
            this.resize();
        }
        createEvents(){
            this.element.on("click", ".hamburger", () => {
                if (this.menu.length === 0) return;
                if (this.menu.hasClass("collapsed")) {
                    this.openMenu();
                } else {
                    this.closeMenu();
                }
            });

            $(window).on("resize", () => {
                this.resize();
            }, {ns: this.element.id()});
        }

        resize(){
            const o = this.options;

            if (o.expand !== true) {
                if (o.expandPoint && mediaExist(o.expandPoint)) {
                    this.element.addClass("appbar-expand");
                } else {
                    this.element.removeClass("appbar-expand");
                }
            }

            if (this.menu.length === 0) return;

            if (this.hamburger.css('display') !== 'block') {
                this.hamburger.addClass("hidden");
                this.menu.css({
                    overflow: "visible",
                    height: "auto"
                });
            } else {
                this.hamburger.removeClass("hidden");
                this.menu.css({
                    overflow: "hidden",
                    height: 0
                });
            }
        }

        openMenu(){
            const o = this.options;
            const menu = this.menu[0];
            Animation.animate({
                el: menu,
                draw: {
                    height: [0, menu.scrollHeight]
                },
                dur: o.duration,
                onDone: () => {
                    this.menu.removeClass("collapsed").css({height: "auto"});
                    this.hamburger.addClass("active");
                    this.fireEvent("menuOpen");
                }
            });
        }
        closeMenu(){
            const o = this.options;
            const menu = this.menu[0];
            this.menu.css({height: menu.scrollHeight});
            Animation.animate({
                el: menu,
                draw: {
                    height: [0]
                },
                dur: o.duration,
                onDone: () => {
                    this.menu.addClass("collapsed");
                    this.hamburger.removeClass("active");
                    this.fireEvent("menuClose");
                }
            });
        }
    }

    Registry.register("appbar", Appbar);

    let DropdownDefaultOptions = {
        toggle: "",
        duration: 100,
        dropFilter: "",
        onDropdown: noop,
        onDropup: noop,
        onClick: e => {
            e.preventDefault();
            e.stopPropagation();
        },
    };

    class Dropdown extends Component {
        toggle = null
        closed = false
        constructor(elem, options) {
            super(elem, "dropdown", merge({}, DropdownDefaultOptions, options));
            this.createStruct();
            this.createEvents();
        }

        createStruct(){
            const element = this.element, o = this.options;

            this.element.addClass("dropdown");

            this.toggle = o.toggle ?
                $(o.toggle) :
                element.siblings(".dropdown-toggle").length ?
                    element.siblings(".dropdown-toggle") :
                    panic(`No toggle defined!`);

            element.css({
                height: 0
            });

            this.closed = true;
        }
        createEvents(){
            this.toggle.on("click", (e) => {
                if (!this.closed) {
                    this.close();
                } else {
                    this.open();
                }
                e.preventDefault();
                e.stopPropagation();
            });

            this.element.on("click", this.options.onClick);
        }

        open(el){
            if (!el) { el = this.elem; }
            const dropdown = Metro5.getPlugin(el, "dropdown");
            if (!dropdown) return;
            let height = dropdown.elem.scrollHeight;
            if (!dropdown.closed || dropdown.element.hasClass("keep-closed")) return
            const parents = dropdown.element.parents('[data-role*=dropdown]');
            $('[data-role*=dropdown]').each((i, el) => {
                const $el = $(el);
                if ($el.in(parents) || $el.is(dropdown.element)) {
                    return
                }
                const pl = Metro5.getPlugin(el, "dropdown");
                pl.close();
            });

            let draw;

            if (dropdown.element.hasClass('horizontal')) {
                let children_width = 0;
                let children_height = 0;
                $.each(dropdown.element.children('li'), function(i){
                    const el = $(this);
                    children_width += el.outerWidth(true);
                    if (dropdown.element.hasClass("tools-menu")) {
                        children_height = dropdown.element.hasClass("compact") ? 40 : 60;
                    } else {
                        if (i === 0) children_height = el[0].scrollHeight;
                        else {
                            if (children_height > el[0].scrollHeight) {
                                children_height = el[0].scrollHeight;
                            }
                        }
                    }
                });
                dropdown.element.css('height', children_height);
                draw = {
                    width: [0, children_width]
                };
            } else {
                draw = {
                    height: [0, height]
                };
            }

            exec$1(dropdown.options.onDropdown, [dropdown.elem]);

            Animation.animate({
                el: dropdown.elem,
                draw,
                dur: dropdown.options.duration,
                onDone: () => {
                    dropdown.element.parent().addClass("dropped-container");
                    dropdown.element.addClass("dropped");
                    dropdown.element.css("height", "auto");
                    dropdown.toggle.addClass("dropped-toggle");
                    dropdown.closed = false;
                }
            });
        }

        close(el){
            if (!el) { el = this.elem; }
            const dropdown = Metro5.getPlugin(el, "dropdown");
            if (!dropdown) return
            if (dropdown.closed || dropdown.element.hasClass("keep-open")) return

            dropdown.element.css({
                height: dropdown.element.height()
            });
            exec$1(dropdown.options.onDropup, [dropdown.elem]);

            Animation.animate({
                el: dropdown.elem,
                draw: {
                    height: [0]
                },
                dur: dropdown.options.duration,
                onDone: () => {
                    dropdown.element.parent().removeClass("dropped-container");
                    dropdown.element.removeClass("dropped");
                    dropdown.toggle.removeClass("dropped-toggle");
                    dropdown.closed = true;
                }
            });
        }
    }

    Registry.register("dropdown", Dropdown);
    GlobalEvents.setEvent(()=>{
        $(window).on("click", function(e){
            $('[data-role-dropdown]').each((i, el) => {
                const pl = Metro5.getPlugin(el, "dropdown");
                if (pl) pl.close();
            });
        });
    });

    let GravatarDefaultOptions = {
        email: "",
        size: 64,
        default: "mp",
        onCreate: f => f
    };

    class Gravatar extends Component {
        image = null
        constructor(elem, options) {
            super(elem, "gravatar", merge({}, GravatarDefaultOptions, options));
            this.createStruct();
            this.getGravatar();
        }

        createStruct(){
            if (this.elem.tagName !== "IMG") {
                this.element.html(`
                <img/>
            `);
                this.image = this.element.children();
            } else {
                this.image = this.element;
            }
        }

        getImagePath(email, size, def = "mp"){
            if (!email.trim()) return ""
            const _def = encURI(def) || '404';
            return "//www.gravatar.com/avatar/" + md5((email.toLowerCase()).trim()) + '?size=' + size + '&d=' + _def;
        }

        getGravatar(){
            const o = this.options;
            this.image.attr("src", this.getImagePath(o.email, o.size, o.default));
        }

        email(new_val){
            if (!new_val) return this.options.email
            this.options.email = new_val;
            this.getGravatar();
            return this
        }

        size(new_val){
            if (!new_val) return this.options.size
            this.options.size = new_val;
            this.getGravatar();
            return this
        }

        updateAttr(attr, newVal, oldVal) {
            switch (attr) {
                case "data-email": {
                    this.options.email = newVal;
                    break
                }
                case "data-size": {
                    this.options.size = newVal;
                    break
                }
            }
            this.getGravatar();
        }
    }

    Registry.register("gravatar", Gravatar);

    let ThemeToggleDefaultOptions = {
        theme: "auto"
    };

    const sun  = "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIj8+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB3aWR0aD0iNTAiIGhlaWdodD0iNTAiIHZpZXdCb3g9IjAgMCA1MCA1MCI+CiAgICA8cGF0aCBmaWxsPSIjYWRiYWE5IiBkPSJNIDI0LjkwNjI1IDMuOTY4NzUgQSAxLjAwMDEgMS4wMDAxIDAgMCAwIDI0Ljc4MTI1IDQgQSAxLjAwMDEgMS4wMDAxIDAgMCAwIDI0IDUgTCAyNCAxMSBBIDEuMDAwMSAxLjAwMDEgMCAxIDAgMjYgMTEgTCAyNiA1IEEgMS4wMDAxIDEuMDAwMSAwIDAgMCAyNC45MDYyNSAzLjk2ODc1IHogTSAxMC42NTYyNSA5Ljg0Mzc1IEEgMS4wMDAxIDEuMDAwMSAwIDAgMCAxMC4xNTYyNSAxMS41NjI1IEwgMTQuNDA2MjUgMTUuODEyNSBBIDEuMDAwMSAxLjAwMDEgMCAxIDAgMTUuODEyNSAxNC40MDYyNSBMIDExLjU2MjUgMTAuMTU2MjUgQSAxLjAwMDEgMS4wMDAxIDAgMCAwIDEwLjc1IDkuODQzNzUgQSAxLjAwMDEgMS4wMDAxIDAgMCAwIDEwLjY1NjI1IDkuODQzNzUgeiBNIDM5LjAzMTI1IDkuODQzNzUgQSAxLjAwMDEgMS4wMDAxIDAgMCAwIDM4LjQzNzUgMTAuMTU2MjUgTCAzNC4xODc1IDE0LjQwNjI1IEEgMS4wMDAxIDEuMDAwMSAwIDEgMCAzNS41OTM3NSAxNS44MTI1IEwgMzkuODQzNzUgMTEuNTYyNSBBIDEuMDAwMSAxLjAwMDEgMCAwIDAgMzkuMDMxMjUgOS44NDM3NSB6IE0gMjUgMTUgQyAxOS40ODYgMTUgMTUgMTkuNDg2IDE1IDI1IEMgMTUgMzAuNTE0IDE5LjQ4NiAzNSAyNSAzNSBDIDMwLjUxNCAzNSAzNSAzMC41MTQgMzUgMjUgQyAzNSAxOS40ODYgMzAuNTE0IDE1IDI1IDE1IHogTSA0LjcxODc1IDI0IEEgMS4wMDQzODQ5IDEuMDA0Mzg0OSAwIDAgMCA1IDI2IEwgMTEgMjYgQSAxLjAwMDEgMS4wMDAxIDAgMSAwIDExIDI0IEwgNSAyNCBBIDEuMDAwMSAxLjAwMDEgMCAwIDAgNC45MDYyNSAyNCBBIDEuMDAxMDk4IDEuMDAxMDk4IDAgMCAwIDQuODEyNSAyNCBBIDEuMDA0Mzg0OSAxLjAwNDM4NDkgMCAwIDAgNC43MTg3NSAyNCB6IE0gMzguNzE4NzUgMjQgQSAxLjAwNDM4NDkgMS4wMDQzODQ5IDAgMCAwIDM5IDI2IEwgNDUgMjYgQSAxLjAwMDEgMS4wMDAxIDAgMSAwIDQ1IDI0IEwgMzkgMjQgQSAxLjAwMDEgMS4wMDAxIDAgMCAwIDM4LjkwNjI1IDI0IEEgMS4wMDEwOTggMS4wMDEwOTggMCAwIDAgMzguODEyNSAyNCBBIDEuMDA0Mzg0OSAxLjAwNDM4NDkgMCAwIDAgMzguNzE4NzUgMjQgeiBNIDE1IDMzLjg3NSBBIDEuMDAwMSAxLjAwMDEgMCAwIDAgMTQuNDA2MjUgMzQuMTg3NSBMIDEwLjE1NjI1IDM4LjQzNzUgQSAxLjAwMDEgMS4wMDAxIDAgMSAwIDExLjU2MjUgMzkuODQzNzUgTCAxNS44MTI1IDM1LjU5Mzc1IEEgMS4wMDAxIDEuMDAwMSAwIDAgMCAxNS4wOTM3NSAzMy44NzUgQSAxLjAwMDEgMS4wMDAxIDAgMCAwIDE1IDMzLjg3NSB6IE0gMzQuNjg3NSAzMy44NzUgQSAxLjAwMDEgMS4wMDAxIDAgMCAwIDM0LjE4NzUgMzUuNTkzNzUgTCAzOC40Mzc1IDM5Ljg0Mzc1IEEgMS4wMDAxIDEuMDAwMSAwIDEgMCAzOS44NDM3NSAzOC40Mzc1IEwgMzUuNTkzNzUgMzQuMTg3NSBBIDEuMDAwMSAxLjAwMDEgMCAwIDAgMzQuODc1IDMzLjg3NSBBIDEuMDAwMSAxLjAwMDEgMCAwIDAgMzQuNzgxMjUgMzMuODc1IEEgMS4wMDAxIDEuMDAwMSAwIDAgMCAzNC42ODc1IDMzLjg3NSB6IE0gMjQuOTA2MjUgMzcuOTY4NzUgQSAxLjAwMDEgMS4wMDAxIDAgMCAwIDI0Ljc4MTI1IDM4IEEgMS4wMDAxIDEuMDAwMSAwIDAgMCAyNCAzOSBMIDI0IDQ1IEEgMS4wMDAxIDEuMDAwMSAwIDEgMCAyNiA0NSBMIDI2IDM5IEEgMS4wMDAxIDEuMDAwMSAwIDAgMCAyNC45MDYyNSAzNy45Njg3NSB6Ii8+Cjwvc3ZnPgo=";
    const moon = "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIj8+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB3aWR0aD0iNTAiIGhlaWdodD0iNTAiIHZpZXdCb3g9IjAgMCA1MCA1MCI+CiAgICA8cGF0aCBkPSJNIDE2IDYgQyAxNS40NDggNiAxNSA2LjQ0OCAxNSA3IEwgMTUgOCBMIDE0IDggQyAxMy40NDggOCAxMyA4LjQ0OCAxMyA5IEMgMTMgOS41NTIgMTMuNDQ4IDEwIDE0IDEwIEwgMTUgMTAgTCAxNSAxMSBDIDE1IDExLjU1MiAxNS40NDggMTIgMTYgMTIgQyAxNi41NTIgMTIgMTcgMTEuNTUyIDE3IDExIEwgMTcgMTAgTCAxOCAxMCBDIDE4LjU1MiAxMCAxOSA5LjU1MiAxOSA5IEMgMTkgOC40NDggMTguNTUyIDggMTggOCBMIDE3IDggTCAxNyA3IEMgMTcgNi40NDggMTYuNTUyIDYgMTYgNiB6IE0gMjguMzEyNSAxMi45Njg3NSBMIDI3IDEzLjE1NjI1IEMgMjAuMTU2IDE0LjEzNTI1IDE1IDIwLjA4NyAxNSAyNyBDIDE1IDM0LjcyIDIxLjI4IDQxIDI5IDQxIEMgMzUuOTExIDQxIDQxLjg2Mjc1IDM1Ljg0NSA0Mi44NDM3NSAyOSBMIDQzLjAzMTI1IDI3LjY4NzUgTCA0MS43MTg3NSAyNy44NzUgQyA0MS4wNTk3NSAyNy45NjkgNDAuNTEgMjggNDAgMjggQyAzMy4zODMgMjggMjggMjIuNjE3IDI4IDE2IEMgMjggMTUuNDkgMjguMDMyIDE0LjkzOTI1IDI4LjEyNSAxNC4yODEyNSBMIDI4LjMxMjUgMTIuOTY4NzUgeiBNIDggMTggQyA3LjQ0OCAxOCA3IDE4LjQ0OCA3IDE5IEMgNi40NDggMTkgNiAxOS40NDggNiAyMCBDIDYgMjAuNTUyIDYuNDQ4IDIxIDcgMjEgQyA3IDIxLjU1MiA3LjQ0OCAyMiA4IDIyIEMgOC41NTIgMjIgOSAyMS41NTIgOSAyMSBDIDkuNTUyIDIxIDEwIDIwLjU1MiAxMCAyMCBDIDEwIDE5LjQ0OCA5LjU1MiAxOSA5IDE5IEMgOSAxOC40NDggOC41NTIgMTggOCAxOCB6Ii8+Cjwvc3ZnPgo=";

    class ThemeToggle extends Component {
        image = null
        theme = "light"

        constructor(elem, options) {
            super(elem, 'theme-toggle', merge({}, ThemeToggleDefaultOptions, options) );
            this.createStruct();
            this.createEvents();
        }

        createStruct(){
            const o = this.options;
            this.element.addClass("theme-toggle").html(`<img/>`);
            this.image = this.element.children();
            if (o.theme === "auto") {
                this.theme = $.dark ? "dark" : "light";
            } else {
                this.theme = o.theme === "dark" ? "dark" : "light";
            }
            this.showToggle();
        }

        showToggle(){
            const html = $("html");
            if (this.theme === 'light') {
                html.removeClass("dark-mode");
                this.image.attr("src", moon);
            } else {
                html.addClass("dark-mode");
                this.image.attr("src", sun);
            }
        }

        createEvents(){
            this.element.on("click", ()=>{
                this.theme = this.theme === 'light' ? 'dark' : 'light';
                this.showToggle();
            });
        }

        theme(newVal){
            if (!newVal) return this.theme
            this.theme = newVal === "dark" ? "dark" : "light";
            this.showToggle();
        }

        updateAttr(attr, newVal, oldVal) {
            switch (attr) {
                case "data-theme": {
                    this.options.theme = newVal;
                    this.showToggle();
                    break
                }
            }
        }
    }

    Registry.register("theme-toggle", ThemeToggle);

    let HamburgerDefaultOptions = {
        active: "default", // chevron-up, chevron-down, arrow-left, arrow-right
        onHamburgerClick: noop
    };

    class Hamburger extends Component {
        constructor(elem, options) {
            super(elem, "hamburger", merge({}, HamburgerDefaultOptions, options));
            this.createStruct();
            this.createEvents();
        }

        createStruct(){
            const element = this.element, o = this.options;

            element.addClass("hamburger");

            if (o.active !== "default") {
                element.addClass(o.active);
            }

            element.html(`
            <span class="line"></span>
            <span class="line"></span>
            <span class="line"></span>
        `);
        }

        createEvents(){
            const element = this.element;

            element.on("click", ()=>{
                //this.fireEvent("HamburgerClick")
                element.toggleClass("active");
            });
        }
    }

    Registry.register("hamburger", Hamburger);

    let AudioButtonDefaultOptions = {
        volume: 0.5,
        src: "",
        onAudioStart: noop,
        onAudioEnd: noop,
    };

    class AudioButton extends Component {
        audio = null
        canPlay = false
        constructor(elem, options) {
            if (typeof globalThis["metroAudioButtonSetup"] !== "undefined") {
                AudioButtonDefaultOptions = merge({}, AudioButtonDefaultOptions, globalThis["metroAudioButtonSetup"]);
            }
            super(elem, "audio-button", merge({}, AudioButtonDefaultOptions, options));
            this.createStruct();
            this.createEvents();
        }

        createStruct(){
            const o = this.options;
            this.audio = new Audio(o.src);
            this.audio.volume = o.volume;
        }

        createEvents(){
            this.audio.addEventListener('loadeddata', () => {
                this.canPlay = true;
            });

            this.audio.addEventListener('ended', () => {
                this.fireEvent("audioEnd", {
                    src: this.options.src,
                    audio: this.audio
                });
            });

            this.element.on("click", () => {
                this.play();
            }, {ns: this.element.id()});
        }

        play(cb){
            const o = this.options;

            if (!this.canPlay) return

            this.audio.pause();
            this.audio.currentTime = 0;
            this.audio.play();

            exec$1(cb, [o.src, this.audio]);
        }

        stop(cb){
            const o = this.options;

            this.audio.pause();
            this.audio.currentTime = 0;

            exec$1(cb, [o.src, this.audio]);
        }

        updateAttr(attr, newVal, oldVal) {
            switch (attr) {
                case "data-src": {
                    this.options.src = newVal;
                    this.audio.src = newVal;
                    break
                }
                case "data-volume": {
                    this.audio.volume = newVal;
                    break
                }
            }
        }
    }

    Registry.register("audiobutton", AudioButton);

    Metro5.playSound = (src, volume = 0.5, cb) => {
        const audio = new Audio(src);
        audio.volume = volume;

        audio.addEventListener('loadeddata', function(){
            audio.pause();
            audio.currentTime = 0;
            audio.play();
        });

        audio.addEventListener('ended', function(){
            exec$1(cb, [src, audio]);
        });
    };

    let ButtonGroupDefaultOptions = {
        singleButton: true,
        activeClass: "active",
        onButtonClick: noop,
    };

    class ButtonGroup extends Component {
        constructor(elem, options) {
            if (typeof globalThis["metroButtonGroupSetup"] !== "undefined") {
                ButtonGroupDefaultOptions = merge({}, ButtonGroupDefaultOptions, globalThis["metroButtonGroupSetup"]);
            }
            super(elem, "button-group", merge({}, ButtonGroupDefaultOptions, options));
            this.createStruct();
            this.createEvents();
        }

        createStruct(){
            const element = this.element, o = this.options;

            element.addClass("button-group");

            const buttons = element.children();
            const active_buttons = element.children(".active");

            if (buttons.length === 0) return

            if (o.singleButton && active_buttons.length === 0) {
                $(buttons[0]).addClass("js-active").addClass(o.activeClass);
            }

            if (o.singleButton && active_buttons.length > 1) {
                active_buttons.removeClass("js-active").removeClass(o.activeClass);
                $(buttons[0]).addClass("js-active").addClass(o.activeClass);
            }
        }

        createEvents(){
            const that = this, o = this.options, buttons = this.element.children();

            buttons.on("click", function(e) {
                const el = $(this);

                that.fireEvent("buttonClick", {
                    button: this,
                    active: el.hasClass(o.activeClass)
                });

                if (o.singleButton && el.hasClass("active")) {
                    return
                }

                if (o.singleButton) {
                    buttons.removeClass(o.activeClass).removeClass("js-active");
                    el.addClass(o.activeClass).addClass("js-active");
                } else {
                    el.toggleClass(o.activeClass).toggleClass("js-active");
                }
            });
        }
    }

    Registry.register("buttongroup", ButtonGroup);

    let CalendarDefaultOptions = {
        startFrom: "days",
        headerFormat: "dddd, MMM DD",
        timeFormat: 24,
        showHeader: true,
        showFooter: true,
        locale: "en-US",
        inputFormat: "",
        buttons: "today, clear",
        minYear: 0,
        maxYear: 0,
        weekStart: 1,
        showWeekNumber: true,
        showOutsideDays: true,
        showGhost: true,
        wide: false,
        multiSelect: false,
        outsideClickSwitchMonth: false,
        selected: "",
        special: "",
        excluded: "",
        minDate: "",
        maxDate: "",
        compact: false,
        animateCell: true,

        onDayClick: noop,
        onDrawDay: noop,
        onDrawMonth: noop,
        onDrawYear: noop,
        onNextMonth: noop,
        onPrevMonth: noop,
        onNextYear: noop,
        onPrevYear: noop,
    };

    class Calendar extends Component {
        draw = null
        current = null
        today = null
        selected = []
        minDate = null
        maxDate = null

        constructor(elem, options) {
            if (typeof globalThis["metroCalendarSetup"] !== "undefined") {
                CalendarDefaultOptions = merge({}, CalendarDefaultOptions, globalThis["metroCalendarSetup"]);
            }
            super(elem, 'calendar', merge({}, CalendarDefaultOptions, options));
            setTimeout(() => {
                this.createStruct();
                this.createEvents();
            });
        }

        dates2array(str){
            const o = this.options;
            if (!str) return []
            const dates = typeof str === "string" ? to_array(str, ",") : isArrayLike(str) ? Array.from(str) : [];
            const result = [];
            $.each(dates, function(){
                let _d, date = this;
                try {
                    _d = (o.inputFormat ? Datetime.from(date, o.inputFormat) : datetime(date)).align('day').format('YYYY-MM-DD');
                } catch (e) {
                    return
                }
                result.push(_d);
            });
            return result
        }

        createStruct(){
            const element = this.element, o = this.options;
            const now = datetime().align("day");

            element.addClass("calendar");
            if (o.wide) {
                element.addClass("calendar-wide");
            }

            if (o.compact) {
                element.addClass("compact");
            }

            this.draw = o.startFrom;
            this.today = now.clone();
            this.current = now.clone();

            if (o.minDate) {
                this.minDate = (o.inputFormat ? Datetime.from(o.minDate, o.inputFormat) : datetime(o.minDate)).align('day').format('YYYY-MM-DD');
            }

            if (o.maxDate) {
                this.maxDate = (o.inputFormat ? Datetime.from(o.maxDate, o.inputFormat) : datetime(o.maxDate)).align('day').format('YYYY-MM-DD');
            }

            this.selected = this.dates2array(o.selected);
            this.special = this.dates2array(o.special);
            this.excluded = this.dates2array(o.excluded);

            this.drawCalendar();
        }
        createEvents(){
            const that = this, element = this.element, o = this.options;

            element.on("click", ".next-month, .prev-month", function (){
                const el = $(this);
                if (el.hasClass("next-month")) {
                    that.current.addMonth(1);
                    that.fireEvent("nextMonth", {
                        date: that.current
                    });
                } else {
                    that.current.addMonth(-1);
                    that.fireEvent("prevYear", {
                        date: that.current
                    });
                }
                that.drawCalendar();
            });

            element.on("click", ".next-year, .prev-year", function (){
                const el = $(this);
                if (el.hasClass("next-year")) {
                    that.current.addYear(1);
                    that.fireEvent("nextYear", {
                        date: that.current
                    });
                } else {
                    that.current.addYear(-1);
                    that.fireEvent("prevYear", {
                        date: that.current
                    });
                }
                that.drawCalendar();
            });

            element.on("click", ".curr-month", function(){
                that.draw = "months";
                that.drawCalendar();
            });

            element.on("click", ".curr-year", function(){
                that.draw = "years";
                that.drawCalendar();
            });

            element.on("click", ".button.today", function(){
                that.current = datetime();
                that.drawCalendar();
            });

            element.on("click", ".button.clear", function(){
                that.selected = [];
                that.current = datetime();
                that.drawCalendar();
            });

            element.on("click", ".button.cancel", function(){
                that.current = datetime();
                that.drawCalendar();
            });

            element.on("click", ".button.done", function(){
                that.current = datetime();
                that.drawCalendar();
            });

            element.on("click", ".next-year-group, .prev-year-group", function(){
                const el = $(this);
                if (el.hasClass("next-year-group")) {
                    that.current.addYear(9);
                } else {
                    that.current.addYear(-9);
                }
                that.drawCalendar();
            });

            element.on("click", ".years > .year", function(){
                that.current.year($(this).text());
                that.draw = "months";
                that.drawCalendar();
            });

            element.on("click", ".months > .month", function(){
                that.current.month($(this).attr("data-month"));
                that.draw = "days";
                that.drawCalendar();
            });

            element.on("click", ".days .day", function(){
                const day = $(this);
                const date = day.data("day");
                const selectedIndex = that.selected.indexOf(date);

                that.fireEvent("dayClick", {
                    date,
                    cell: day
                });

                if (day.hasClass("disabled")) return

                if (o.outsideClickSwitchMonth && day.hasClass("outside")) {
                    that.current = datetime(date);
                    that.drawCalendar();
                    return
                }

                if (day.hasClass("excluded")) {
                    return
                }

                if (o.multiSelect === true) {
                    if (selectedIndex !== -1) {
                        delete that.selected[selectedIndex];
                        day.removeClass("selected");
                    } else {
                        that.selected.push(date);
                        day.addClass("selected");
                    }
                } else {
                    that.selected = [date];
                    element.find(".day.selected").removeClass("selected");
                    day.addClass("selected");
                }
            });

            element.on("click", ".week-days .week-day", function(){
                if (o.multiSelect !== true) return

                const day = $(this);
                const ii = [];

                let index = day.index();

                for (let i = 0; i < 7; i++) {
                    ii.push(index);
                    index += o.showWeekNumber ? 8 : 7;
                }

                const days = element.find(".days .day").filter((el)=>{
                    const $el = $(el);
                    return ii.includes($el.index()) && !$el.hasClass("outside disabled excluded");
                });

                $.each(days, (_, el) => {
                    const $el = $(el);
                    const day = $el.data('day');

                    if (!that.selected.includes(day)) {
                        that.selected.push(day);
                        $el.addClass("selected");
                    } else {
                        $el.removeClass("selected");
                        delete that.selected[that.selected.indexOf(day)];
                    }
                });
            });

            element.on("click", ".week-number", function(){
                if (o.multiSelect !== true) return

                const day = $(this);
                const weekNum = day.text();
                const dayIndex = day.index();

                if (weekNum === "#") return

                const days = element.find(".day").filter((el)=>{
                    const $el = $(el);
                    const elIndex = $el.index();
                    return between(elIndex, dayIndex, dayIndex + 8, false) && !$el.hasClass("outside disabled excluded");
                });

                $.each(days, function () {
                    const $el = $(this);
                    const day = $el.data('day');

                    if (that.selected.indexOf(day) === -1) {
                        that.selected.push(day);
                        $el.addClass("selected");
                    } else {
                        $el.removeClass("selected");
                        delete that.selected[that.selected.indexOf(day)];
                    }
                });
            });
        }

        drawDays(){
            const element = this.element, o = this.options;
            let content = element.find(".calendar-content");
            const calendar = datetime(this.current.year(), this.current.month(), this.current.day()).useLocale(o.locale, true).calendar(o.weekStart);
            const locale = Metro5.getLocale(o.locale, "calendar");
            const now = datetime();

            console.log(o.locale);

            if (!content.length) {
                content = $("<div>").addClass("calendar-content").appendTo(element);
            }

            if (o.showWeekNumber) {
                content.addClass("-week-numbers");
            }

            content.clear();

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

                cell.data('day', day);

                if (o.animateCell) cell.addClass("to-animate");

                if (outsideDate) {
                    cell.addClass("outside");
                    if (!o.showOutsideDays) {
                        cell.empty();
                    }
                }

                if (calendar.weekends.includes(day)) {
                    cell.addClass("weekend");
                }

                if (calendar.week.includes(day)) {
                    cell.addClass("weekday");
                }

                if (day === calendar['today']) {
                    cell.html(`<span class="today-day">${cell.text()}</span>`).addClass("today");
                }

                if (o.showGhost && date.day() === now.day()) {
                    cell.addClass("coincidental");
                }

                if (this.selected.includes(day)) {
                    cell.addClass("selected");
                }

                if (this.special.includes(day)) {
                    cell.addClass("special");
                }

                if (this.excluded.includes(day)) {
                    cell.addClass("excluded");
                }

                if (this.minDate && datetime(day).compare(this.minDate, 'day', "<")) {
                    cell.addClass("excluded");
                }

                if (this.maxDate && datetime(day).compare(this.maxDate, 'day', ">")) {
                    cell.addClass("excluded");
                }

                this.fireEvent("drawDay", {
                    date,
                    cell
                });
            });

            this.animateContent(".day");
        }

        drawMonths(){
            const element = this.element, o = this.options;
            let content = element.find(".calendar-content");
            const locale = Metro5.getLocale(o.locale, "calendar")["months"];

            if (!content.length) {
                content = $("<div>").addClass("calendar-content").appendTo(element);
            }

            content.clear();

            const toolbar = $("<div>").addClass("calendar-toolbar").appendTo(content);

            /**
             * Calendar toolbar
             */

            $("<span>").addClass("prev-year").html("&lsaquo;").appendTo(toolbar);
            $("<span>").addClass("curr-year").html(this.current.year()).appendTo(toolbar);
            $("<span>").addClass("next-year").html("&rsaquo;").appendTo(toolbar);

            const months = $("<div>").addClass("months");
            content.append( months );

            for(let i = 12; i < 24; i++) {
                const month = $("<div>")
                    .attr("data-month", `${i - 12}`)
                    .addClass("month")
                    .addClass(i - 12 === this.today.month() ? "current-month" : "")
                    .html(`<span class="current-month-today">${locale[i]}</span>`);

                months.append( month );

                if (o.animateCell) month.addClass("to-animate");

                this.fireEvent("drawMonth", {
                    month: i - 12,
                    cell: month[0]
                });
            }

            this.animateContent(".months .month");

        }

        drawYears(){
            const element = this.element, o = this.options;
            let content = element.find(".calendar-content");

            if (!content.length) {
               content = $("<div>").addClass("calendar-content").appendTo(element);
            }

            content.clear();

            const toolbar = $("<div>").addClass("calendar-toolbar").appendTo(content);

            $("<span>").addClass("prev-year-group").html("&lsaquo;").appendTo(toolbar);
            $("<span>").addClass("curr-year").html((this.current.year() - 4) + " - " + (this.current.year() + 4)).appendTo(toolbar);
            $("<span>").addClass("next-year-group").html("&rsaquo;").appendTo(toolbar);

            const years = $("<div>").addClass("years");
            content.append( years );

            for (let i = this.current.year() - 4; i <= this.current.year() + 4; i++){
                const year = $("<div>")
                    .attr("data-year", i)
                    .addClass("year")
                    .addClass(i === this.today.year() ? "current-year" : "")
                    .html(`<span class="current-year-today">${i}</span>`);

                years.append( year );

                if (o.animateCell) year.addClass("to-animate");

                if (o.minYear && i < o.minYear ) {
                    year.addClass("disabled");
                }

                if (o.maxYear && i > o.maxYear) {
                    year.addClass("disabled");
                }

                this.fireEvent("drawYear", {
                    year: i,
                    cell: year[0]
                });
            }

            this.animateContent(".years .year");
        }

        drawHeader(){
            const element = this.element, o = this.options;
            let header = element.find(".calendar-header");
            if (!header.length) {
                header = $("<div>").addClass("calendar-header").appendTo(element);
            }
            header.clear();
            $(`<div data-role='clock' data-format="${o.timeFormat}">`).addClass("header-time").appendTo(header);
            $("<div>").addClass("header-year").html(this.today.year()).appendTo(header);
            $("<div>").addClass("header-day").html(this.today.format(o.headerFormat, o.locale)).appendTo(header);
            if (o.showHeader === false) {
                header.hide();
            }
        }

        drawFooter(){
            const element = this.element, o = this.options;
            const locale = Metro5.getLocale(o.locale, "buttons");
            let footer = element.find(".calendar-footer");
            if (!o.buttons.trim()) {
                footer.hide();
                return
            }
            if (footer.length === 0) {
                footer = $("<div>").addClass("calendar-footer").appendTo(element);
            }
            footer.clear();
            $.each(to_array(o.buttons, ","), (i, btn) => {
                const button = $("<button>").attr("type", "button").addClass(`button ${btn}`).html(locale[btn]).appendTo(footer);
                if (btn === 'cancel' || btn === 'done') {
                    button.addClass("js-dialog-close");
                }
            });
            if (o.showFooter === false) {
                footer.hide();
            }
        }

        drawCalendar(){
            this.drawHeader();
            switch (this.draw) {
                case "months": this.drawMonths(); break;
                case "years": this.drawYears(); break;
                default: this.drawDays();
            }
            this.drawFooter();
        }

        animateContent(target, cls){
            const element = this.element; this.options;
            const content = element.find(".calendar-content");

            cls = cls || "to-animate";

            content.find(target).each( (k, el) => {
                const day = $(el);
                setTimeout(() => {
                    day.removeClass(cls);
                }, 10 * k);
            });
        }

        getSelectedDays(){
            return this.selected
        }

        getSpecialDays(){
            return this.special
        }

        getExcludedDays(){
            return this.excluded
        }

        getCalendar(){
            return datetime(this.current.year(), this.current.month(), this.current.day()).useLocale(o.locale).calendar(o.weekStart);
        }
    }

    Registry.register("calendar", Calendar);

    let ClockDefaultOptions = {
        hidden: false,
        format: 24,
        onTick: noop,
        onSecond: noop,
        onMinute: noop,
        onHour: noop
    };

    class Clock extends Component {
        tickInterval = null
        secondInterval = null
        time = null

        constructor(elem, options) {
            if (typeof globalThis["metroClockSetup"] !== "undefined") {
                ClockDefaultOptions = merge({}, ClockDefaultOptions, globalThis["metroClockSetup"]);
            }
            super(elem, "clock", merge({}, ClockDefaultOptions, options));
            this.createStruct();
            this.tick();
            this.second();

            this.tickInterval = setInterval(()=>{
                this.tick();
            }, 500);

            this.secondInterval = setInterval(()=>{
                this.second();
            }, 1000);
        }

        createStruct(){
            const element = this.element, o = this.options;

            if (o.hidden) {
                element.hide();
            }

            element.html(`
            <span class="hour">00</span>
            :
            <span class="minute">00</span>
            :
            <span class="second">00</span>
            <span class="ampm"></span>
        `);

            if (+(o.format) !== 12) {
                element.find(".ampm").hide();
            }
        }

        tick(){
            const element = this.element, o = this.options;
            const timestamp = datetime();

            element.find(".hour").html(string(o.format === 24 ? timestamp.hour() : timestamp.hour12()).lpad('0', 2).value);
            element.find(".minute").html(string(timestamp.minute()).lpad('0', 2).value);
            element.find(".second").html(string(timestamp.second()).lpad('0', 2).value);
            element.find(".ampm").html(timestamp.hour()>=12 ? 'pm' : 'am');
        }

        second(){
            this.fireEvent("second", {
                time: this.time
            });
        }
    }

    Registry.register("clock", Clock);

    let ToastDefaultOptions = {
        callback: noop,
        timeout: 3000,
        distance: 20,
        position: "bottom",
        className: ""
    };

    class Toast {
        options = null

        constructor(options) {
            if (!undef$1(globalThis["metroToastSetup"])) {
                ToastDefaultOptions = merge({}, ToastDefaultOptions, globalThis["metroToastSetup"]);
            }
            this.options = merge({}, ToastDefaultOptions, options);
        }

        create(message, options = {}){
            const toast = $("<div>").addClass("toast").html(message).appendTo("body");
            const width = toast.outerWidth();

            this.options = merge({}, this.options, options);

            toast.css({
                opacity: 0
            });

            if (this.options.position === "top") {
                toast.addClass("show-top").css({
                    top: this.options.distance
                });
            } else {
                toast.css({
                    bottom: this.options.distance
                });
            }

            if (this.options.className) {
                toast.addClass(this.options.className);
            }

            toast.css({
                'left': '50%',
                'margin-left': -(width / 2)
            });

            Animation.animate({
                el: toast[0],
                draw: {
                    opacity: [0, 1]
                },
                dur: 100,
                onDone: () => {
                    setTimeout(()=>{
                        this.#destroy(toast);
                    }, this.options.timeout);
                }
            });
        }

        #destroy(toast, cb){
            required$1(toast);

            Animation.animate({
                el: toast[0],
                draw: {
                    opacity: [1, 0]
                },
                dur: 100,
                onDone: () => {
                    exec$1(cb, {
                        message: toast.html()
                    });
                    toast.remove();
                }
            });
        }
    }

    Registry.register("toast", Toast);

    let TokenizerDefaultOptions = {
        splitter: "",
        tag: "span",
        space: "&nbsp;",
        useTokenSymbol: true,
        useTokenIndex: true,
        onToken: noop,
        onTokenize: noop,
    };

    class Tokenizer extends Component {
        originalText = null
        constructor(elem, options) {
            if (typeof globalThis["metroTokenizerSetup"] !== "undefined") {
                TokenizerDefaultOptions = merge({}, TokenizerDefaultOptions, globalThis["metroTokenizerSetup"]);
            }
            super(elem, "tokenizer", merge({}, TokenizerDefaultOptions, options));
            this.createStruct();
        }

        createStruct(){
            const element = this.element, o = this.options;

            this.originalText = element.text();
            element.clear().attr("aria-label", this.originalText);

            $.each(this.originalText.split(o.splitter), (i, t)=>{
                const isSpace = t === " ";
                const token = $(`<${o.tag}>`).attr("aria-hidden", true).html(isSpace ? o.space : t);
                const index = i + 1;

                token
                    .addClass(isSpace && o.useTokenSymbol ? "" : "ts-"+t.replace(" ", "_"))
                    .addClass(isSpace && o.useTokenIndex ? "" : "ti-" + (index));

                if (!isSpace) {
                    token.addClass(index % 2 === 0 ? "te-even" : "te-odd");
                }

                if (o.prepend) {
                    token.prepend($(o.prepend).length ? $(o.prepend) : $("<span>").html(o.prepend));
                }

                if (o.append) {
                    token.append($(o.append).length ? $(o.append) : $("<span>").html(o.append));
                }

                element.append(token);

                this.fireEvent("token", {
                    token: t,
                    elem: token[0]
                });
            });

            this.fireEvent("tokenize", {
                elem: this.elem
            });
        }
    }

    Registry.register("tokenizer", Tokenizer);

    let HtmlContainerDefaultOptions = {
        method: "get",
        cors: "",
        cache: "default",
        credentials: "same-origin",
        contentType: 'application/json',
        src: null,
        insertMode: "default", // replace, append, prepend
    };

    class HtmlContainer extends Component {
        constructor(elem, options) {
            if (typeof globalThis["metroHtmlContainerSetup"] !== "undefined") {
                HtmlContainerDefaultOptions = merge({}, HtmlContainerDefaultOptions, globalThis["metroHtmlContainerSetup"]);
            }
            super(elem, "htmlcontainer", merge({}, HtmlContainerDefaultOptions, options));
            this.createStruct();
        }

        createStruct(){
            this.element; const o = this.options;

            if (!o.src) return

            this.fetchHtml();
        }

        async fetchHtml(){
            const element = this.element, o = this.options;

            const response = await fetch(o.src, {
                method: o.method,
                mode: o.cors,
                cache: o.cache,
                credentials: o.credentials,
                headers: {
                    'Content-Type': o.contentType
                }
            });
            const text = await response.text();

            let _data = $(text);

            if (_data.length === 0) {
                _data = $("<div>").html(text);
            }

            switch (o.insertMode) {
                case "prepend": element.prepend(_data.script()); break;
                case "append": element.append(_data.script()); break;
                case "replace": _data.script().insertBefore(element); element.remove(); break;
                default: {
                    element.html(_data.script().outerHTML());
                }
            }
        }
    }

    Registry.register("htmlcontainer", HtmlContainer);

    let CookieDefaultOptions = {
        path: "/",
        expires: null,
        maxAge: null,
        domain: null,
        secure: false,
        samesite: null
    };

    if (typeof globalThis['metroCookiesSetup'] !== "undefined") {
        CookieDefaultOptions = merge({}, CookieDefaultOptions, globalThis['metroCookiesSetup']);
    }

    const Cookies = {
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
    };

    Metro5.cookies = Cookies;

    let CookieDisclaimerDefaultOptions = {
        name: 'cookies_accepted',
        acceptButton: '.cookie-accept-button',
        cancelButton: '.cookie-cancel-button',
        duration: "30days",
        acceptButtonName: "Accept",
        cancelButtonName: "Cancel",
        onAccept: noop,
        onDecline: noop
    };

    class CookieDisclaimer extends Component {
        disclaimer = null
        constructor(elem, options) {
            if (typeof globalThis['metroCookieDisclaimerSetup'] !== "undefined") {
                CookieDisclaimerDefaultOptions = merge({}, CookieDisclaimerDefaultOptions, globalThis['metroCookieDisclaimerSetup']);
            }
            super(elem, "cookiedisclaimer", merge({}, CookieDisclaimerDefaultOptions, options));

            this.createStruct();
            this.createEvents();
        }

        createStruct(){
            const element = this.element, o = this.options;

            element.addClass("cookie-disclaimer-block").hide();

            if (Cookies.getCookie(o.name)) {
                return ;
            }

            let buttons = element.find(`${o.acceptButton}, ${o.cancelButton}`);
            if (!buttons.length) {
                const buttons_block = $("<div>")
                    .addClass("cookie-disclaimer-actions")
                    .append( $('<button>').addClass('button cookie-accept-button').html(o.acceptButtonName) )
                    .append( $('<button>').addClass('button cookie-cancel-button ml-1').html(o.cancelButtonName) );
                buttons_block.appendTo(element);
            }

            element.show();
        }

        createEvents(){
            const element = this.element, o = this.options;

            element.on("click", o.acceptButton, () => {
                element.hide();

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
                });

                Cookies.setCookie(o.name, true, dur);

                this.fireEvent("accept");
            });

            element.on("click", o.cancelButton, () => {
                element.hide();
                this.fireEvent("decline");
            });
        }
    }

    Registry.register("cookiedisclaimer", CookieDisclaimer);

    let CounterDefaultOptions = {
        prefix: "",
        suffix: "",
        duration: 3000,
        startOnViewport: true,
    };

    class Counter extends Component {
        started = false
        from = null
        to = null
        constructor(elem, options) {
            if (typeof globalThis["metroCounterSetup"] !== "undefined") {
                CounterDefaultOptions = merge({}, CounterDefaultOptions, globalThis["metroCounterSetup"]);
            }
            super(elem, "counter", merge({}, CounterDefaultOptions, options));
            this.createStruct();
            this.createEvents();
            this.run();
        }

        createStruct(){
            const element = this.element;
            const [a, b] = element.text().split(",");
            this.from = undef$1(b) ? 0 : +a;
            this.to = undef$1(b) ? +a : +b;
            element.clear();
        }

        createEvents(){
            const element = this.element, o = this.options;

            $(window).on("scroll", () => {
                if (!this.started && o.startOnViewport === true && inViewport$1(element[0])) {
                    this.run();
                }
            }, {ns: this.id});
        }

        run(){
            const elem = this.elem, o = this.options;

            if (this.started) return
            if (!inViewport$1(this.elem)) return

            this.started = true;

            Animation.animate({
                el: this.elem,
                draw: {
                    innerHTML: [this.from, this.to],
                    opacity: [0, 1]
                },
                dur: o.duration,
                onFrame: () => {
                    elem.innerHTML = `${o.prefix} ${numberFormat(+elem.innerHTML)} ${o.suffix}`;
                }
            });
        }
    }

    Registry.register("counter", Counter);

    const Validator = {
        required: function(val){
            if (Array.isArray(val)) {
                return val.length > 0 ? val : false;
            } else {
                return val ? val.trim() : false;
            }
        },
        length: function(val, len){
            if (Array.isArray(val)) {return val.length === parseInt(len);}
            if (isNaN(len) || len <= 0) {
                return false;
            }
            return val.trim().length === parseInt(len);
        },
        minlength: function(val, len){
            if (Array.isArray(val)) {return val.length >= parseInt(len);}
            if (isNaN(len) || len <= 0) {
                return false;
            }
            return val.trim().length >= parseInt(len);
        },
        maxlength: function(val, len){
            if (Array.isArray(val)) {return val.length <= parseInt(len);}
            if (isNaN(len) || len <= 0) {
                return false;
            }
            return val.trim().length <= parseInt(len);
        },
        min: function(val, min_value){
            if (isNaN(min_value)) {
                return false;
            }
            if (!this.number(val)) {
                return false;
            }
            if (isNaN(val)) {
                return false;
            }
            return Number(val) >= Number(min_value);
        },
        max: function(val, max_value){
            if (max_value || isNaN(max_value)) {
                return false;
            }
            if (!this.number(val)) {
                return false;
            }
            if (isNaN(val)) {
                return false;
            }
            return Number(val) <= Number(max_value);
        },
        email: function(val){
            /* eslint-disable-next-line */
            return /^[a-z0-9\u007F-\uffff!#$%&'*+\/=?^_`{|}~-]+(?:\.[a-z0-9\u007F-\uffff!#$%&'*+\/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z]{2,}$/i.test(val);
        },
        domain: function(val){
            /* eslint-disable-next-line */
            return /^((xn--)?[a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,}$/.test(val);
        },
        url: function(val){
            /* eslint-disable-next-line */
            const regexp    = /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z0-9\u00a1-\uffff][a-z0-9\u00a1-\uffff_-]{0,62})?[a-z0-9\u00a1-\uffff]\.)+(?:[a-z\u00a1-\uffff]{2,}\.?))(?::\d{2,5})?(?:[/?#]\S*)?$/i;
            return regexp.test(val);
        },
        date: function(val, format, locale){
            try {
                if (!format) {
                    datetime(val);
                } else {
                    Datetime.from(val, format, locale);
                }
                return true;
            } catch (e) {
                return false;
            }
        },
        number: function(val){
            return !isNaN(val);
        },
        integer: function(val){
            return !isNaN(val) && Number.isInteger(+val);
        },
        float: function(val){
            return !isNaN(val) && !Number.isInteger(+val);
        },
        digits: function(val){
            return /^\d+$/.test(val);
        },
        hexcolor: function(val){
            /* eslint-disable-next-line */
            return /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(val);
        },
        color: function(val){ // TODO check it
            if (undef$1(val)) return false;
            return Color.isColor(val);
        },
        pattern: function(val, pat){
            if (undef$1(val)) return false;
            if (undef$1(pat)) return false;
            const reg = new RegExp(pat);
            return reg.test(val);
        },
        compare: function(val, val2){
            return val === val2;
        },
        not: function(val, not_this){
            return val !== not_this;
        },
        notequals: function(val, val2){
            if (undef$1(val)) return false;
            if (undef$1(val2)) return false;
            return val.trim() !== val2.trim();
        },
        equals: function(val, val2){
            if (undef$1(val)) return false;
            if (undef$1(val2)) return false;
            return val.trim() === val2.trim();
        },
        custom: function(val, func){
            if (isFunc(func) === false) {
                return false;
            }
            return exec$1(func, [val]);
        },

        validate(val, functions = ""){
            const result = {};
            $.each(to_array(functions, " "), (i, f) => {
                const rule = f.split("=");
                const fn = rule[0]; rule.shift();
                const ab = rule.join("=");
                if (['compare', 'equals', 'notequals'].includes(fn)) {
                    const val2 = $(`[name=${ab}]`).val();
                    result[fn] = this[fn].apply(null, [val, val2]);
                } else if (fn === "custom") {
                    result[fn] = this.custom(val, fn);
                } else {
                    result[fn] = this[fn].apply(null, [val, ab]);
                }
            });
            return result
        },

        validateElement(el, functions){
            const $el = $(el);

            if (!functions) {
                functions = $el.attr("data-validate");
            }

            if ($el.attr("type").toLowerCase() === 'checkbox' && functions.includes("required")) {
                return {
                    "required": $el.is(":checked")
                }
            }

            else if ($el.attr("type").toLowerCase() === "radio"  && functions.includes("required")) {
                const name = $el.attr("name");
                const checks = $("input[name=" + name.replace("[", "\\\[").replace("]", "\\\]") + "]:checked");
                return {
                    "required": checks.length
                }
            }

            else
            return this.validate($el.val(), functions)
        },

        checkResult(result){
            for(let key in result) {
                if (result[key] === false) {
                    return false
                }
            }
            return true
        }
    };

    let FormDefaultOptions = {
        interactive: true,
        submitTimeout: 200,
        onBeforeReset: noop_true,
        onBeforeSubmit: noop_true,
        onResetForm: noop,
        onSubmitForm: noop,
        onValidateForm: noop,
        onInValidateForm: noop,
    };

    class Form extends Component {
        constructor(elem, options) {
            if (typeof globalThis["metroFormSetup"] !== "undefined") {
                FormDefaultOptions = merge({}, FormDefaultOptions, globalThis["metroFormSetup"]);
            }
            super(elem, "form", merge({}, FormDefaultOptions, options));
            this.createStruct();
        }

        createStruct(){
            const that = this, elem = this.elem, element = this.element, o = this.options;
            const inputs = element.find("[data-validate]");

            element
                .attr("novalidate", 'novalidate');

            $.each(inputs, (i, el) => {
                const input = $(el);
                if (o.interactive) {
                    input.on("change input propertychange cut paste copy drop", function(){
                        that.resetState(this);
                        const result = Validator.validateElement(this);
                        that.setInputState(this, Validator.checkResult(result));
                    });
                }
            });

            this._onsubmit = null;
            this._onreset = null;

            if (elem.onsubmit !== null) {
                this._onsubmit = element[0].onsubmit;
                elem.onsubmit = null;
            }

            if (elem.onreset !== null) {
                this._onreset = element[0].onreset;
                elem.onreset = null;
            }

            elem.onsubmit = function(){
                return that.submit();
            };

            elem.onreset = function(){
                return that.reset();
            };
        }

        isControl(el){
            const parent = $(el).parent();
            return parent.hasClass("input") ||
                   parent.hasClass("select") ||
                   parent.hasClass("checkbox") ||
                   parent.hasClass("radio") ||
                   parent.hasClass("textarea") ||
                   parent.hasClass("switch") ||
                   parent.hasClass("spinner")
        }

        setInputState(el, state){
            const input = $(el);
            const target = this.isControl(input) ? input.parent() : input;
            if (!state) {
                target.addClass("invalid");
            } else {
                target.addClass("valid");
            }
        }

        resetState(el){
            const input = $(el);
            const target = this.isControl(input) ? input.parent() : input;
            target.removeClass("invalid valid");
        }

        submit(){
            const element = this.element, o = this.options;
            const inputs = element.find("[data-validate]");
            const submit = element.find("input[type=submit], button[type=submit]");
            const formData = $.serialize(this.elem);
            let validData = true;

            submit.attr("disabled", "disabled").addClass("disabled");

            $.each(inputs, (_, el)=>{
                this.resetState(el);
                const result = Validator.validateElement(el);
                const state = Validator.checkResult(result);
                this.setInputState(el, state);
                if (!state) {
                    validData = false;
                }
            });

            submit.removeAttr("disabled").removeClass("disabled");

            if (!validData) {
                this.fireEvent("InValidate", formData);
                return
            }

            if (!exec$1(o.onBeforeSubmit, [formData])) {
                this.fireEvent("inValidate", formData);
                return
            }

            this.fireEvent("validate", formData);

            setTimeout(()=>{
                exec$1(o.onSubmitForm, [formData], this.elem);
                this.fireEvent("submitForm", formData);
                if (this._onsubmit !==  null) exec$1(this._onsubmit, [formData], this.elem);
            }, o.submitTimeout);
        }

        reset(){
            const o = this.options;
            if (!exec$1(o.onBeforeReset, [this.elem])) return
            $.each(this.element.find("[data-validate]"), (i, el) => {
                this.resetState(el);
            });
            if (this._onreset !==  null) exec$1(this._onreset, null, this.element[0]);
            exec$1(o.onResetForm, [this.elem]);
        }
    }

    Registry.register("form", Form);

    let AnalogClockDefaultOptions = {
        size: 100
    };

    class AnalogClock extends Component {
        tickInterval = null
        constructor(elem, options) {
            if (typeof globalThis["metroAnalogClockSetup"] !== "undefined") {
                AnalogClockDefaultOptions = merge({}, AnalogClockDefaultOptions, globalThis["metroAnalogClockSetup"]);
            }
            super(elem, "analogclock", merge({}, AnalogClockDefaultOptions, options));
            this.createStruct();
            this.createEvents();
        }

        createStruct(){
            const element = this.element, o = this.options;
            element.addClass("analog-clock").css({
                width: o.size,
                height: o.size
            });
            element.html(`
            <div class="analog-clock__m12-6"></div>
            <div class="analog-clock__m3-9"></div>
            <div class="analog-clock__m1-7"></div>
            <div class="analog-clock__m2-8"></div>
            <div class="analog-clock__m4-10"></div>
            <div class="analog-clock__m5-11"></div>
            <div class="analog-clock__inner"></div>
            <div class="analog-clock__dot"></div>
            <div class="analog-clock__hour"></div>
            <div class="analog-clock__minute"></div>
            <div class="analog-clock__second"></div>
        `);
            this.tick();
            this.tickInterval = setInterval(()=>{
                this.tick();
            }, 1000);
        }
        createEvents(){}

        tick(){
            const element = this.element;

            const d = new Date(); //object of date()
            const hr = d.getHours();
            const min = d.getMinutes();
            const sec = d.getSeconds();
            const hr_rotation = 30 * hr + min / 2; //converting current time
            const min_rotation = 6 * min;
            const sec_rotation = 6 * sec;

            element.find(".analog-clock__hour")[0].style.transform = `rotate(${hr_rotation}deg)`;
            element.find(".analog-clock__minute")[0].style.transform = `rotate(${min_rotation}deg)`;
            element.find(".analog-clock__second")[0].style.transform = `rotate(${sec_rotation}deg)`;
        }
    }

    Registry.register("analogclock", AnalogClock);

    let ProgressDefaultOptions = {
        value: 0,
        buffer: 0,
        useBuffer: false,
        useLoad: false,
        type: "default", // default, line
        variant: "default", // default, small
        showValue: false,
        valuePosition: "free", // center, free
        showLabel: false,
        labelPosition: "before", // before, after
        labelTemplate: "",
        onValueChange: noop,
        onBufferChange: noop,
        onComplete: noop,
        onBuffered: noop,
    };

    class Progress extends Component {
        value = 0
        buffer = 0

        constructor(elem, options) {
            if (!undef$1(globalThis["metroProgressSetup"])) {
                ProgressDefaultOptions = merge({}, ProgressDefaultOptions, globalThis["metroProgressSetup"]);
            }

            super(elem, "progress", merge({}, ProgressDefaultOptions, options));

            this.createStruct();
        }

        createStruct(){
            const element = this.element, o = this.options;
            element.clear();
            element.addClass("progress");

            if (o.type === "line") {
                element.addClass("line");
            } else {
                element.append($("<div>").addClass("bar"));

                if (o.useBuffer) {
                    element.append($("<div>").addClass("buffer"));
                }
                if (o.useLoad) {
                    element.append($("<div>").addClass("load"));
                }
            }

            if (o.variant === "small") {
                element.addClass("small");
            }

            if (o.type !== 'line') {
                const value = $("<span>").addClass("value").appendTo(element);
                if (o.valuePosition === "center") value.addClass("centered");
                if (o.showValue === false) value.hide();
            }

            if (o.showLabel === true) {
                const label = $("<span>").addClass("progress-label").html(o.labelTemplate === "" ? o.value+"%" : o.labelTemplate.replace("%VAL%", o.value));
                if (o.labelPosition === 'before') {
                    label.insertBefore(element);
                } else {
                    label.insertAfter(element);
                }
            }

            this.val(o.value);
            this.buff(o.buffer);
        }

        val(newVal){
            const element = this.element, o = this.options;

            if (o.type === "line") {
                return undefined
            }

            if (undef$1(newVal)) {
                return this.value
            }

            const value = element.find(".value");
            const bar  = element.find(".bar");

            this.value = parseInt(newVal, 10);

            bar.css("width", this.value + "%");
            value.html(this.value+"%");

            if (o.valuePosition === "free") {
                const diff = element.width() - bar.width();
                const valuePosition = value.width() > diff ? {left: "auto", right: diff + 'px'} : {left: this.value + '%'};
                value.css(valuePosition);
            }

            if (o.showLabel === true) {
                const label = element[o.labelPosition === "before" ? "prev" : "next"](".progress-label");
                if (label.length) {
                    label.html(o.labelTemplate === "" ? this.value+"%" : o.labelTemplate.replace("%VAL%", this.value));
                }
            }

            this.fireEvent("ValueChange", {
                value: this.value
            });

            if (this.value === 100) {
                this.fireEvent("Complete");
            }
        }
        buff(newVal){
            const element = this.element, o = this.options;

            if (o.type === "line") {
                return undefined
            }

            if (undef$1(newVal)) {
                return this.value
            }

            const buffer  = element.find(".buffer");

            this.buffer = parseInt(newVal, 10);

            buffer.css("width", this.buffer + "%");

            this.fireEvent("BufferChange", this.buffer);

            if (this.buffer === 100) {
                this.fireEvent("Buffered");
            }
        }

        updateAttr(attr, newVal, oldVal) {
            switch (attr) {
                case "data-value": this.val(newVal); break;
                case "data-buffer": this.buff(newVal); break;
            }
        }

        destroy() {
            super.destroy();
        }
    }

    Registry.register("progress", Progress);

    let InputMaskDefaultOptions = {
        pattern: ".",
        mask: "",
        placeholder: "_",
        editableStart: 0,
        threshold: 300,
        onChar: noop,
    };

    class InputMask extends Component {
        placeholder = ""
        mask = ""
        maskArray = []
        pattern = null
        thresholdTimer = null

        constructor(elem, options) {
            if (!undef$1(globalThis["metroInputMaskSetup"])) {
                InputMaskDefaultOptions = merge({}, InputMaskDefaultOptions, globalThis["metroInputMaskSetup"]);
            }
            super(elem, "input-mask", merge({}, InputMaskDefaultOptions, options));
            this.createStruct();
            this.createEvents();
        }

        createStruct(){
            this.element; const o = this.options;

            if (!o.mask) {
                throw new Error('You must provide a pattern for masked input.')
            }

            if (typeof o.placeholder !== 'string' || o.placeholder.length > 1) {
                throw new Error('Mask placeholder should be a single character or an empty string.')
            }

            this.placeholder = o.placeholder;
            this.mask = (""+o.mask);
            this.maskArray = this.mask.split("");
            this.pattern = new RegExp("^"+o.pattern+"+$");

            this.value();
        }

        createEvents(){
            const that = this, element = this.element, o = this.options;
            const editableStart = o.editableStart;
            const id = this.element.id();

            const checkEditableChar = (pos)=>{
                return pos < this.mask.length && this.mask.charAt(pos) === this.placeholder;
            };

            const findNextEditablePosition = (pos)=>{
                let i, a = this.maskArray;

                for (i = pos; i <= a.length; i++) {
                    if (a[i] === this.placeholder) {
                        return i;
                    }
                }
                return pos;
            };

            const findFirstEditablePosition = () => {
                let i, a = this.maskArray;

                for (i = 0; i < a.length; i++) {
                    if (a[i] === this.placeholder) {
                        return i;
                    }
                }
                return a.length;
            };

            const setPosition = (pos)=>{
                this.elem.setSelectionRange(pos, pos);
            };

            const clearThresholdInterval = ()=>{
                clearInterval(this.thresholdTimer);
                this.thresholdTimer = null;
            };

            element.on("change", ()=>{
                const elem = this.elem;
                if (elem.value === "") {
                    elem.value = that.mask;
                    setPosition(editableStart);
                }
            }, {ns: id});

            element.on("focus click", ()=>{
                setPosition(findFirstEditablePosition());
            }, {ns: id});

            element.on("keydown", (e)=>{
                const elem = this.elem;
                const pos = elem.selectionStart;
                const val = elem.value;
                const code = e.code, key = e.key;

                if (code === "ArrowRight" || code === "End") {
                    return true;
                } else {
                    if (pos >= this.mask.length && (["Backspace", "Home", "ArrowLeft", "ArrowUp"].indexOf(code) === -1)) {
                        // Don't move over mask length
                        e.preventDefault();
                    } else if (code === "Home" || code === "ArrowUp") {
                        // Goto editable start position
                        e.preventDefault();
                        setPosition(editableStart);
                    } else if (code === "ArrowLeft") {
                        if (pos - 1 < editableStart) {
                            // Don't move behind a editable start position
                            e.preventDefault();
                        }
                    } else if (code === "Backspace") {
                        e.preventDefault();
                        if (pos - 1 >= editableStart) {
                            if (checkEditableChar(pos - 1)) {
                                if (elem.value.charAt(pos - 1) !== that.placeholder) {
                                    // Replace char if it is not a mask placeholder
                                    elem.value = val.substr(0, pos - 1) + that.placeholder + val.substr(pos);
                                }
                            }
                            // Move to prev char position
                            setPosition(pos - 1);
                        }
                    } else if (code === "Space") {
                        e.preventDefault();
                        setPosition(pos + 1);
                    } else if (!this.pattern.test(key)) {
                        e.preventDefault();
                    } else {
                        e.preventDefault();
                        if (checkEditableChar(pos)) {
                            elem.value = val.substr(0, pos) + (o.onChar === noop ? key : exec$1(o.onChar, [key], this)) + val.substr(pos + 1);
                            setPosition(findNextEditablePosition(pos + 1));
                        }
                    }
                }
            }, {ns: id});

            element.on("keyup", function(){
                const el = this;

                clearThresholdInterval();

                that.thresholdTimer = setInterval(function(){
                    clearThresholdInterval();
                    setPosition(findNextEditablePosition(el.selectionStart));
                }, that.threshold);
            }, {ns: id});

        }

        value(){
            const that = this, elem = this.elem;
            const a = new Array(this.mask.length);
            let val;
            if (!elem.value) {
                elem.value = this.mask;
            } else {
                val = elem.value;
                $.each(this.maskArray, function(i, v){
                    if (val[i] !== v && !that.pattern.test(val[i])) {
                        a[i] = that.placeholder;
                    } else {
                        a[i] = val[i];
                    }
                });
                this.elem.value = a.join("");
            }
        }
    }

    Registry.register("inputmask", InputMask);

    let SwitchDefaultOptions = {
        transition: true,
        caption: "",
        captionPosition: "right",
        textOn: "",
        textOff: "",
        showOnOff: false,
    };

    class Switch extends Component {
        constructor(elem, options) {
            if (!undef$1(globalThis["metroSwitchSetup"])) {
                SwitchDefaultOptions = merge({}, SwitchDefaultOptions, globalThis["metroSwitchSetup"]);
            }
            super(elem, "switch", merge({}, SwitchDefaultOptions, options));
            this.createStruct();
            this.createEvents();
        }

        createStruct(){
            const element = this.element, o = this.options;
            const check = $("<span>").addClass("check");
            const caption = $("<span>").addClass("caption").html(o.caption);

            element.attr("type", "checkbox");

            const container = element.wrap(
                $("<label>").addClass(`switch`)
            );

            this.component = container;

            check.appendTo(container);
            caption.appendTo(container);

            if (o.transition === true) {
                container.addClass("transition-on");
            }

            if (o.captionPosition === 'left') {
                container.addClass("caption-left");
            }

            element[0].className = '';
        }

        createEvents(){
            const element = this.element;

            if (element.attr("readonly") !== undefined) {
                element.on("click", (e)=>{
                    e.preventDefault();
                });
            }
        }

        destroy() {
            this.component.remove();
        }
    }

    Registry.register("switch", Switch);

    class MetroStorage {
        key = ""
        storage = null
        constructor(props = {}) {
            this.key = !undef$1(props.key) ? props.key : "Metro5";
            this.storage = !undef$1(props.storageType) ? window[props.storageType] : window["localStorage"];
        }

        set key(newKey){
            this.key = newKey;
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
            return nvl$2(result, defaultValue);
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
            this.storage.removeItem(this.key + ":" + key);
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

    Registry.register("storage", MetroStorage);

    const TemplateEngine = {
        compile(html, options, conf){
            let ReEx, re = '<%(.+?)%>',
                reExp = /(^( )?(var|if|for|else|switch|case|break|{|}|;))(.*)?/g,
                code = 'with(obj) { var r=[];\n',
                cursor = 0,
                result,
                match;
            const add = function(line, js) {
                /* jshint -W030 */
                js? (code += line.match(reExp) ? line + '\n' : 'r.push(' + line + ');\n') :
                    (code += line !== '' ? 'r.push("' + line.replace(/"/g, '\\"') + '");\n' : '');
                return add;
            };

            if (conf) {
                if (($.hasProp(conf, 'beginToken'))) {
                    re = re.replace('<%', conf.beginToken);
                }
                if (($.hasProp(conf,'endToken'))) {
                    re = re.replace('%>', conf.endToken);
                }
            }

            ReEx = new RegExp(re, 'g');
            match = ReEx.exec(html);

            while(match) {
                add(html.slice(cursor, match.index))(match[1], true);
                cursor = match.index + match[0].length;
                match = ReEx.exec(html);
            }
            add(html.substr(cursor, html.length - cursor));
            code = (code + 'return r.join(""); }').replace(/[\r\t\n]/g, ' ');
            /* jshint -W054 */

            try {
                result = new Function('obj', code).apply(options, [options]);
            } catch(err) {
                console.error("'" + err.message + "'", " in \n\nCode:\n", code, "\n");
            }

            return result;
        }
    };

    let TemplateDefaultOptions = {
        templateData: null,
        beginToken: "<%",
        endToken: "%>",
        onCompile: noop,
    };

    class Template extends Component {
        template = ""
        data = {}
        constructor(elem, options) {
            if (!undef$1(globalThis["metroTemplateSetup"])) {
                TemplateDefaultOptions = merge({}, TemplateDefaultOptions, globalThis["metroTemplateSetup"]);
            }
            super(elem, "template", merge({}, TemplateDefaultOptions, options));
            this.createStruct();
        }

        createStruct(){
            const element = this.element, o = this.options;
            this.template = element.html();
            this.data = isObjectType(o.templateData) || {};
            this.compile();
        }

        compile(){
            const element = this.element;
            const template = this.template
                .replace(/(&lt;%)/gm, "<%")
                .replace(/(%&gt;)/gm, "%>")
                .replace(/(&lt;)/gm, "<")
                .replace(/(&gt;)/gm, ">");

            element.html(TemplateEngine.compile(template, this.data));
        }

        buildWith(data){
            const _data = isObjectType(data);
            if (!_data) return
            this.data = _data;
            this.compile();
        }
    }

    Registry.register("template", Template);

    let LightboxDefaultOptions = {
        sourceTag: "img",
        loop: true,
        onDrawImage: noop,
    };

    class Lightbox extends Component {
        sourceTag = "img"
        component = null
        lightbox = null
        overlay = null
        items = null

        constructor(elem, options) {
            if (!undef$1(globalThis["metroLightboxSetup"])) {
                LightboxDefaultOptions = merge({}, LightboxDefaultOptions, globalThis["metroLightboxSetup"]);
            }
            super(elem, "lightbox", merge({}, LightboxDefaultOptions, options));
            this.createStruct();
            this.createEvents();
        }

        createStruct(){
            const element = this.element, o = this.options;
            let lightbox, overlay;

            this.sourceTag = o.sourceTag;

            overlay = $(".lightbox-overlay");

            if (overlay.length === 0) {
                overlay = $("<div>").addClass("lightbox-overlay").appendTo("body").hide();
            }

            lightbox = $("<div>").addClass("lightbox").appendTo("body").hide();

            $("<span>").addClass("lightbox__prev").appendTo(lightbox);
            $("<span>").addClass("lightbox__next").appendTo(lightbox);
            $("<span>").addClass("lightbox__closer").appendTo(lightbox);
            $("<div>").addClass("lightbox__image").appendTo(lightbox);

            this.component = lightbox;
            this.lightbox = lightbox;
            this.overlay = overlay;

            this.items = element.find(this.sourceTag);
        }

        createEvents(){
            const that = this, element = this.element; this.options;
            const lightbox = this.component;

            element.on("click", this.sourceTag, function(){
                that.open(this);
            });

            lightbox.on("click", ".lightbox__closer", function(){
                that.close();
            });

            lightbox.on("click", ".lightbox__prev", function(){
                that.prev();
            });

            lightbox.on("click", ".lightbox__next", function(){
                that.next();
            });
        }

        _goto(el){
            const that = this; this.options;
            const $el = $(el);
            const img = $("<img>");
            let src, imageContainer, imageWrapper, activity;

            imageContainer = this.lightbox.find(".lightbox__image");

            imageContainer.find(".lightbox__image-wrapper").remove();
            imageWrapper = $("<div>")
                .addClass("lightbox__image-wrapper")
                .attr("data-title", ($el.attr("alt") || $el.attr("data-title") || ""))
                .appendTo(imageContainer);

            activity = $("<div>").appendTo(imageWrapper);

            Metro5.makePlugin(activity[0], "activity", {
                type: "cycle",
                style: "color"
            });

            this.current = el;

            if (el.tagName === "IMG" || el.tagName === "DIV") {
                src = $el.attr("data-original") || $el.attr("src");
                img.attr("src", src);
                img[0].onload = function(){
                    const port = this.height > this.width;
                    img.addClass(port ? "lightbox__image-portrait" : "lightbox__image-landscape");
                    img.attr("alt", $el.attr("alt"));
                    img.appendTo(imageWrapper);
                    activity.remove();
                    that.fireEvent("drawImage", {
                        image: img[0],
                        item: imageWrapper[0]
                    });
                };
            }
        }

        _index(el){
            let index = -1;

            this.items.each(function(i){
                if (this === el) {
                    index = i;
                }
            });

            return index;
        }

        next(){
            let index, current = this.current;

            index = this._index(current);

            if (index + 1 >= this.items.length) {
                if (this.options.loop) {
                    index = -1;
                } else {
                    return;
                }
            }

            this._goto(this.items[index + 1]);
        }

        prev(){
            let index, current = this.current;

            index = this._index(current);

            if (index - 1 < 0) {
                if (this.options.loop) {
                    index = this.items.length;
                } else {
                    return;
                }
            }

            this._goto(this.items[index - 1]);
        }

        open(el){
            // this._setupItems();

            this._goto(el);

            this.overlay.show();
            this.lightbox.show();

            return this;
        }

        close(){
            this.overlay.hide();
            this.lightbox.hide();
        }
    }

    Registry.register("lightbox", Lightbox);

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
    };

    class Countdown extends Component {
        breakpoint = null
        leftTime = null
        blinkInterval = null
        tickInterval = null
        current = {
            d: 0, h: 0, m: 0, s: 0
        }

        constructor(elem, options) {
            if (!undef$1(globalThis["metroCountdownSetup"])) {
                CountdownDefaultOptions = merge({}, CountdownDefaultOptions, globalThis["metroCountdownSetup"]);
            }
            super(elem, "countdown", merge({}, CountdownDefaultOptions, options));
            setTimeout(()=>{
                this.createStruct();
                this.createEvents();
            });
        }

        createStruct(){
            const that = this, element = this.element, o = this.options;
            const parts = ["days", "hours", "minutes", "seconds"];
            const dm = 24*60*60*1000;
            const now = datetime().time();
            const locale = Metro5.getLocale(o.locale, "calendar");
            let delta_days, digit;

            this.setBreakpoint();

            element.addClass("countdown");

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
                    this.element.find(".-old-digit").remove();
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
                element.attr("data-date", val);
                o.date = val;
            } else if (typeof val === 'object') {
                const keys = ["days", "hours", "minutes", "seconds"];
                $.each(keys, function(i, v){
                    if (!undef$1(val[v])) {
                        element.attr("data-"+v, val[v]);
                        o[v] = val[v];
                    }
                });
            }

            this.reset();
        }
        tick(){
            const element = this.element;
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
            this.element.toggleClass("blink");
            this.fireEvent("blink", {
                time: this.current,
                left: this.leftTime
            });
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
                    .addClass("-old-digit");

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
                    .html(value);

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
            const locale = Metro5.getLocale(loc);
            if (!loc) return
            o.locale = loc;
            $.each(parts, function(){
                const cls = ".part." + this;
                const part = element.find(cls);
                part.attr("data-label", locale["calendar"]["time"][this]);
            });
        }
    }

    Registry.register("countdown", Countdown);

    const CHECKBOX_STATES = {
        UNCHECKED: -1,
        INDETERMINATE: 0,
        CHECKED: 1,
    };

    const CHECKBOX_CAPTION_POSITION = {
        LEFT: 'left',
        RIGHT: 'right',
    };

    let CheckboxDefaultOptions = {
        states: 2,
        caption: "",
        captionPosition: "right",
        initialState: CHECKBOX_STATES.UNCHECKED,
        readOnly: false,
        onChangeState: noop
    };

    class Checkbox extends Component {
        state = -1
        constructor(elem, options) {
            if (!undef$1(globalThis["metroCheckboxSetup"])) {
                CheckboxDefaultOptions = merge({}, CheckboxDefaultOptions, globalThis["metroCheckboxSetup"]);
            }
            super(elem, "checkbox", merge({}, CheckboxDefaultOptions, options));
            this.createStruct();
            this.createEvents();
        }

        createStruct(){
            const element = this.element, elem = this.elem, o = this.options;
            const check = $("<span>").addClass("check");
            const caption = $("<span>").addClass("caption").html(o.caption);

            element.attr("type", "checkbox");

            const checkbox = element.wrap(
                $("<label>")
                    .addClass("checkbox")
                    .addClass("transition-on")
                    .addClass(o.captionPosition === CHECKBOX_CAPTION_POSITION.LEFT ? "caption-left" : "caption-right")
            );

            check.appendTo(checkbox);
            caption.appendTo(checkbox);

            this.state = elem.checked ? CHECKBOX_STATES.CHECKED : o.initialState;

            this.drawState();
        }

        createEvents(){
            const element = this.element, o = this.options;

            if (element.attr("readonly") !== undefined || o.readOnly === true) {
                element.on("click", function(e){
                    e.preventDefault();
                });
            } else {
                element.on("click", (e) => {
                    if (o.states === 1) {
                        e.preventDefault();
                    } else if (o.states === 2) {
                        this.state = this.state === -1 ? 1 : -1;
                    } else {
                        this.state += 1;
                        if (this.state === 2) {
                            this.state = -1;
                        }
                    }
                    this.drawState();
                    this.fireEvent("ChangeState", {
                        state: this.state
                    });
                });

                element.on("change", ()=>{
                    // TODO
                });
            }
        }

        drawState(){
            const element = this.element, elem = this.elem, o = this.options;
            if (o.states === 1) {
                elem.checked = this.state === 0 || this.state === 1;
                if (this.state === 0) {
                    elem.indeterminate = true;
                }
            } else if (o.states === 2) {
                elem.checked = this.state === 1;
            } else {
                if (this.state === -1) {
                    elem.indeterminate = false;
                    elem.checked = false;
                    element.attr("data-indeterminate", false);
                } else if (this.state === 0) {
                    element.attr("data-indeterminate", true);
                    elem.indeterminate = true;
                    elem.checked = true;
                } else {
                    element.attr("data-indeterminate", false);
                    elem.indeterminate = false;
                    elem.checked = true;
                }
            }
        }

        getState(){
            return this.state
        }

        setState(state){
            this.state = state;
            this.drawState();
        }
    }

    Registry.register("checkbox", Checkbox);

    const RADIO_CAPTION_POSITION = {
        LEFT: "left",
        RIGHT: "right"
    };

    let RadioDefaultOptions = {
        caption: "",
        captionPosition: RADIO_CAPTION_POSITION.RIGHT,
        onChangeState: noop
    };

    class Radio extends Component {
        constructor(elem, options) {
            if (!undef$1(globalThis['metroRadioSetup'])) {
                RadioDefaultOptions = merge({}, RadioDefaultOptions, globalThis['metroRadioSetup']);
            }
            super(elem, "radio", merge({}, RadioDefaultOptions, options));
            this.createStruct();
            this.createEvents();
        }

        createStruct(){
            const element = this.element, o = this.options;
            const check = $("<span>").addClass("check");
            const caption = $("<span>").addClass("caption").html(o.caption);

            element.attr("type", "radio");

            const radio = element.wrap(
                $("<label>").addClass("radio").addClass("transition-on")
            );

            if (o.captionPosition === RADIO_CAPTION_POSITION.LEFT) {
                radio.addClass("caption-left");
            }

            check.appendTo(radio);
            caption.appendTo(radio);
        }

        createEvents(){
            const element = this.element, o = this.options;

            if (element.attr("readonly") !== undefined || o.readOnly === true) {
                element.on("click", function(e){
                    e.preventDefault();
                });
            } else {
                this.fireEvent("ChangeState", {
                    state: this.elem.checked
                });
            }
        }
    }

    Registry.register("radio", Radio);

    let TextareaDefaultOptions = {
        label: "",
        charsCounter: null,
        charsCounterTemplate: "$1",
        defaultValue: "",
        prepend: "",
        append: "",
        clearButton: true,
        autoSize: true,
        maxHeight: 0,
        onChange: noop,
    };

    class Textarea extends Component {
        textarea = null
        fake = null

        constructor(elem, options) {
            if (!undef$1(globalThis["metroTextareaSetup"])) {
                TextareaDefaultOptions = merge({}, TextareaDefaultOptions, globalThis["metroTextareaSetup"]);
            }
            super(elem, "textarea", merge({}, TextareaDefaultOptions, options));
            this.createStruct();
            this.createEvents();
        }

        createStruct(){
            const element = this.element; this.elem; const o = this.options;
            const fakeTextarea = $("<textarea>").addClass("fake-textarea");

            const textarea = element.wrap(
                $("<label>").addClass("textarea")
            );

            fakeTextarea.appendTo(textarea);

            if (!element[0].readOnly && o.clearButton) {
                $("<button>")
                    .addClass("button input-clear-button")
                    .attr("tabindex", -1)
                    .attr("type", "button")
                    .appendTo(textarea);
            }

            if (element.attr('dir') === 'rtl' ) {
                textarea.addClass("rtl").attr("dir", "rtl");
            }

            if (o.prepend) {
                $("<div>").html(o.prepend).addClass("prepend").appendTo(textarea);
            }

            if (o.append) {
                const append = $("<div>").html(o.append).addClass("append").appendTo(textarea);
                element.find(".input-clear-button").css({
                    right: append.outerWidth() + 4
                });
            }

            if (o.defaultValue && element.val().trim() === "") {
                element.val(o.defaultValue);
            }

            if (o.label) {
                const label = $("<label>").addClass("label-for-input").html(o.label).insertBefore(textarea);
                if (element.attr("id")) {
                    label.attr("for", element.attr("id"));
                }
                if (element.attr("dir") === "rtl") {
                    label.addClass("rtl");
                }
            }

            if (o.autoSize === true) {
                textarea.addClass("autosize no-scroll-vertical");

                setTimeout(()=>{
                    this.resize();
                }, 100);
            }

            fakeTextarea.val(element.val());

            this.textarea = textarea;
            this.fake = fakeTextarea;
        }

        createEvents(){
            const that = this, element = this.element, o = this.options;
            const chars_counter = $(o.charsCounter);

            this.textarea.on("click", ".input-clear-button", () => {
                element.val(o.defaultValue ? o.defaultValue : "").trigger('change').trigger('keyup');
                element[0].focus();
            });

            if (o.autoSize) {
                element.on("change input propertychange cut paste copy drop keyup", () => {
                    this.fake.val(this.elem.value);
                    this.resize();
                });
            }

            element.on("blur", ()=>{this.textarea.removeClass("focused");});
            element.on("focus", ()=>{this.textarea.addClass("focused");});

            element.on("keyup", () => {
                if (chars_counter.length) {
                    if (chars_counter[0].tagName === "INPUT") {
                        chars_counter.val(this.length());
                    } else {
                        chars_counter.html(o.charsCounterTemplate.replace("$1", this.length()));
                    }
                }

                that.fireEvent("Change", {
                    val: element.val(),
                    length: that.length()
                });
            });
        }

        resize(){
            const element = this.element, o = this.options;
            const currentHeight = this.fake[0].scrollHeight;

            if (o.maxHeight && currentHeight >= o.maxHeight) {
                this.textarea.removeClass("no-scroll-vertical");
                return ;
            }

            if (o.maxHeight && currentHeight < o.maxHeight) {
                this.textarea.addClass("no-scroll-vertical");
            }

            this.fake[0].style.cssText = 'height:auto;';
            this.fake[0].style.cssText = 'height:' + this.fake[0].scrollHeight + 'px';

            element[0].style.cssText = 'height:' + this.fake[0].scrollHeight + 'px';
        }

        clear(){
            this.element.val("").trigger('change').trigger('keyup').focus();
        }

        toDefault(){
            this.element.val(this.options.defaultValue ? this.options.defaultValue : "").trigger('change').trigger('keyup').focus();
        }

        length(){
            const characters = this.elem.value.split('');
            return characters.length;
        }

        destroy() {
            this.textarea.remove();
        }
    }

    Registry.register("textarea", Textarea);

    const KEY_CONTROL_CODES = {
        BACKSPACE: 8,
        TAB: 9,
        ENTER: 13,
        SHIFT: 16,
        CTRL: 17,
        ALT: 18,
        BREAK: 19,
        CAPS: 20,
        ESCAPE: 27,
        SPACE: 32,
        PAGEUP: 33,
        PAGEDOWN: 34,
        END: 35,
        HOME: 36,
        LEFT_ARROW: 37,
        UP_ARROW: 38,
        RIGHT_ARROW: 39,
        DOWN_ARROW: 40,
        COMMA: 188
    };

    let InputDefaultOptions = {
        label: "",

        autocomplete: null,
        autocompleteUrl: null,
        autocompleteUrlMethod: "GET",
        autocompleteUrlKey: null,
        autocompleteListHeight: 200,

        history: false,
        historyPreset: "",
        preventSubmit: false,
        defaultValue: "",
        size: "default",
        margin: "",
        padding: "",
        prepend: "",
        append: "",
        searchButton: false,
        clearButton: true,
        revealButton: true,
        customButtons: [],
        searchButtonClick: 'submit',

        onAutocompleteSelect: noop,
        onHistoryChange: noop,
        onHistoryUp: noop,
        onHistoryDown: noop,
        onClearClick: noop,
        onRevealClick: noop,
        onSearchButtonClick: noop,
        onEnterClick: noop,
    };

    class Input extends Component {
        history = []
        autocomplete = []
        historyIndex = -1
        autocompleteList = null
        input = null

        constructor(elem, options) {
            if (!undef$1(globalThis["metroInputSetup"])) {
                InputDefaultOptions = merge({}, InputDefaultOptions, globalThis["metroInputSetup"]);
            }
            super(elem, "input", merge({}, InputDefaultOptions, options));
            this.createStruct();
            this.createEvents();
        }

        createStruct(){
            const element = this.element, o = this.options;
            const input = element.wrap(
                $("<label>").addClass("input")
            );

            if (element.attr("type") === undefined) {
                element.attr("type", "text");
            }

            if (element.attr('type') === 'password') {
                element.attr("autocomplete", "on");
            }

            if (o.historyPreset) {
                $.each(to_array(o.historyPreset, "|"), (_, el) => {
                    this.history.push(el);
                });
                this.historyIndex = this.history.length - 1;
            }

            const buttonsGroup = $("<div>").addClass("button-group").appendTo(input);

            if (element.val().trim() === "") {
                element.val(o.defaultValue);
            }

            if (o.clearButton && !element[0].readOnly) {
                $("<button>").addClass("button input-clear-button").attr("tabindex", -1).attr("type", "button").html("&#x2715;").appendTo(buttonsGroup);
            }
            if (element.attr('type') === 'password' && o.revealButton) {
                $("<button>").addClass("button input-reveal-button").attr("tabindex", -1).attr("type", "button").html("&#x1F441;").appendTo(buttonsGroup);
            }
            if (o.searchButton === true) {
                $("<button>").addClass("button input-search-button").attr("tabindex", -1).attr("type", o.searchButtonClick === 'submit' ? "submit" : "button").html("").appendTo(buttonsGroup);
            }

            if (o.prepend) {
                $("<div>").html(o.prepend).addClass("prepend").appendTo(input);
            }
            if (o.append) {
                $("<div>").html(o.append).addClass("append").appendTo(input);
            }

            if (typeof o.customButtons === "string") {
                o.customButtons = isObjectType(o.customButtons);
            }
            if (typeof o.customButtons === "object" && objectLength(o.customButtons)) {
                $.each(o.customButtons, (_, item)=>{
                    const customButton = $("<button>");

                    customButton
                        .addClass("button input-custom-button")
                        .addClass(item.className)
                        .attr("tabindex", -1)
                        .attr("type", "button")
                        .html(item.html);

                    if (item.attr && typeof item.attr === 'object') {
                        $.each(item.attr, function(k, v){
                            customButton.attr(string(k).dashedName().value, v);
                        });
                    }

                    customButton.data("action", item.onclick).appendTo(buttonsGroup);
                });
            }

            if (element.attr('data-exclaim')) {
                input.attr('data-exclaim', element.attr('data-exclaim'));
            }

            if (element.attr('dir') === 'rtl' ) {
                input.addClass("rtl").attr("dir", "rtl");
            }

            if (o.size !== "default") {
                input.css({
                    width: o.size,
                });
            }
            if (o.margin) {
                input.css({
                    margin: o.margin,
                });
            }
            if (o.padding) {
                input.css({
                    padding: o.padding,
                });
            }

            if (o.label) {
                const label = $("<label>").addClass("label-for-input").html(o.label).insertBefore(input);
                if (element.attr("id")) {
                    label.attr("for", element.attr("id"));
                }
                if (element.attr("dir") === "rtl") {
                    label.addClass("rtl");
                }
            }

            if (!undef$1(o.autocomplete) || !undef$1(o.autocompleteUrl)) {
                this.autocompleteList = $("<div>").addClass("autocomplete-list").css({
                    maxHeight: o.autocompleteListHeight,
                    display: "none"
                }).appendTo(input);
            }

            if (o.autocomplete) {
                const autocomplete_obj = isObjectType(o.autocomplete);

                if (autocomplete_obj !== false) {
                    this.autocomplete = autocomplete_obj;
                } else {
                    this.autocomplete = to_array(o.autocomplete, "|");
                }
            }

            if (o.autocompleteUrl) {
                fetch(o.autocompleteUrl, {
                    method: o.autocompleteUrlMethod
                }).then((response) => {
                    return response.text()
                }).then((data) => {
                    let newData = [];

                    try {
                        newData = JSON.parse(data);
                        if (o.autocompleteUrlKey) {
                            newData = newData[o.autocompleteUrlKey];
                        }
                    } catch (e) {
                        newData = data.split("\n");
                    }

                    this.autocomplete = this.autocomplete.concat(newData);
                });
            }

            this.input = input;
        }

        createEvents(){
            const that = this, element = this.element, o = this.options;

            this.input.on("click", ".input-clear-button", () => {
                const curr = element.val();
                element.val(o.defaultValue ? o.defaultValue : "").fire('clear').fire('change').fire('keyup')[0].focus();
                if (this.autocompleteList) {
                    this.autocompleteList.css({
                        display: "none"
                    });
                }

                that.fireEvent("clearClick", {
                    prev: curr,
                    val: element.val()
                });
            });

            this.input.on("click", ".input-reveal-button", () => {
                if (element.attr('type') === 'password') {
                    element.attr('type', 'text');
                } else {
                    element.attr('type', 'password');
                }

                this.fireEvent("revealClick", {
                    val: element.val()
                });
            });

            this.input.on("click", ".input-search-button", () => {
                if (o.searchButtonClick !== 'submit') {
                    this.fireEvent("searchButtonClick", {
                        val: element.val()
                    });
                } else {
                    const form = this.input.closest("form");
                    if (form.length) {
                        form.submit();
                    }
                }
            });

            this.input.on("click", ".input-custom-button", function(){
                const button = $(this);
                const action = button.data("action");
                exec$1(action, [element.val(), button], this);
            });


            element.on("keyup", (e) => {
                const val = element.val().trim();

                if (o.history && e.keyCode === KEY_CONTROL_CODES.ENTER && val !== "") {
                    element.val("");
                    this.history.push(val);
                    this.historyIndex = this.history.length - 1;

                    this.fireEvent("historyChange", {
                        val: val,
                        history: this.history,
                        historyIndex: this.historyIndex
                    });

                    if (o.preventSubmit === true) {
                        e.preventDefault();
                    }
                }

                if (o.history && e.keyCode === KEY_CONTROL_CODES.UP_ARROW) {
                    this.historyIndex--;
                    if (this.historyIndex >= 0) {
                        element.val("");
                        element.val(that.history[that.historyIndex]);

                        this.fireEvent("historyDown", {
                            val: element.val(),
                            history: this.history,
                            historyIndex: this.historyIndex
                        });
                    } else {
                        this.historyIndex = 0;
                    }
                    e.preventDefault();
                }

                if (o.history && e.keyCode === KEY_CONTROL_CODES.DOWN_ARROW) {
                    this.historyIndex++;
                    if (this.historyIndex < this.history.length) {
                        element.val("");
                        element.val(this.history[this.historyIndex]);

                        this.fireEvent("historyUp", {
                            val: element.val(),
                            history: this.history,
                            historyIndex: this.historyIndex
                        });
                    } else {
                        this.historyIndex = this.history.length - 1;
                    }
                    e.preventDefault();
                }
            });

            element.on("keydown", (e) => {
                if (e.keyCode === KEY_CONTROL_CODES.ENTER) {
                    this.fireEvent("enter-click", {
                        val: element.val()
                    });
                }
                if (e.ctrlKey && e.keyCode === 32) {
                    that.drawAutocompleteList(this.elem.value.toLowerCase());
                }
            });

            element.on("blur", () => {
                this.input.removeClass("focused");
            });

            element.on("focus", () => {
                this.input.addClass("focused");
            });

            element.on("input", () => {
                that.drawAutocompleteList(this.elem.value.toLowerCase());
            });

            this.input.on("click", ".autocomplete-list .item", function(){
                const val = $(this).attr("data-autocomplete-value");
                element.val(val);
                that.autocompleteList.css({
                    display: "none"
                });
                element.trigger("change");
                that.fireEvent("autocompleteSelect", {
                    value: val
                });
            });
        }

        drawAutocompleteList(val){
            this.element;
            let items;

            if (!this.autocompleteList) {
                return;
            }

            this.autocompleteList.clear();

            items = this.autocomplete.filter(function(item){
                return item.toLowerCase().includes(val);
            });

            this.autocompleteList.css({
                display: items.length > 0 ? "block" : "none"
            });

            $.each(items, (_, v) => {
                const index = v.toLowerCase().indexOf(val);
                const item = $("<div>").addClass("item").attr("data-autocomplete-value", v);
                let content;

                if (index === 0) {
                    content = "<strong>"+v.substr(0, val.length)+"</strong>"+v.substr(val.length);
                } else {
                    content = v.substr(0, index) + "<strong>"+v.substr(index, val.length)+"</strong>"+v.substr(index + val.length);
                }

                item.html(content).appendTo(this.autocompleteList);

                this.fireEvent("draw-autocomplete-item", {
                    item: item
                });
            });
        }

        getHistory(){
            return this.history;
        }

        getHistoryIndex(){
            return this.historyIndex;
        }

        setHistoryIndex(val){
            this.historyIndex = val >= this.history.length ? this.history.length - 1 : val;
        }

        setHistory(history, append) {
            const that = this; this.options;
            if (undef$1(history)) return;
            if (!Array.isArray(history) && typeof history === 'string') {
                history = to_array(history, "|");
            }
            if (append === true) {
                $.each(history, function () {
                    that.history.push(this);
                });
            } else {
                this.history = history;
            }
            this.historyIndex = this.history.length - 1;
        }

        clear(){
            this.element.val('');
        }

        toDefault(){
            this.element.val(this.options.defaultValue ? this.options.defaultValue : "");
        }

        destroy() {
            this.input.remove();
        }
    }

    Registry.register("input", Input);
    GlobalEvents.setEvent(()=>{
        $(document).on("click", function(){
            $('.input .autocomplete-list').hide(); // ???
        });
    });

    Registry.required("dropdown");

    let TabsDefaultOptions = {
        appendButton: true,
        tabsPosition: "left",
        customButtons: null,
        activateNewTab: true,
        onAppendButtonClick: noop,
        onTabCreate: noop_arg,
        onTabAppend: noop,
        onTabActivate: noop,
        onTabDeactivate: noop,
        onTabBeforeClose: noop_true,
        onTabClose: noop,
    };

    class Tabs extends Component {
        tabs = []
        invisibleTabsHolderToggle = null
        invisibleTabsHolderPlugin = null

        constructor(elem, options) {
            super(elem, "tabs", merge({}, TabsDefaultOptions, options));

            this.#createStruct();
            this.#createEvents();
        }

        #createStruct(){
            const element = this.element, o = this.options;

            this.component = $("<div>").addClass("tabs__container").insertBefore(element);

            element.addClass("tabs").appendTo(this.component);
            element.addClass("tabs-position-" + o.tabsPosition);

            const items = element.children("li:not(.tabs__custom)");

            let activeTabExists = false;

            items.each((index, el) => {
                const $el = $(el), html = $el.html(), active = $el.hasClass("active");

                const tab = this.#createTab(html, $el.attr("data-icon"), $el.attr("data-image"), $el.attr("data-close") !== "false", $el.attr('data-data'));

                if (active) {
                    activeTabExists = true;
                    tab.addClass("active");
                    exec$1(o.onTabActivate, [tab[0]]);
                }

                element.append(tab);
                exec$1(o.onTabAppend, [tab[0]]);

                $el.remove();
            });

            if (!activeTabExists) {
                const tab = this.element.children(".tabs__item").first();
                tab.addClass("active");
                exec$1(o.onTabActivate, [tab[0]]);
            }

            if (o.appendButton) {
                element.append( $("<li>").addClass("tabs__append").html(`<span class="tabs__service-button tabs__append-button">+</span>`) );
            }

            const serviceContainer = $("<li>").addClass("tabs__service").appendTo(element);
            serviceContainer.append(
                $("<div>").addClass("tabs__service-button").html(`
                <span class="icon-chevron-down dropdown-toggle"></span>
                <ul class="dropdown-menu tabs__invisible_tab_holder"></ul>
            `)
            );
            this.invisibleTabsHolderToggle = serviceContainer.find(".tabs__service-button");
            this.invisibleTabsHolderPlugin = Metro5.makePlugin(serviceContainer.find(".tabs__invisible_tab_holder")[0], "dropdown", {
                onDropdown: el => {
                    const toggleRect = this.invisibleTabsHolderToggle[0].getBoundingClientRect();
                    $(el).css({
                        top: toggleRect.y + toggleRect.height + 10,
                        left: toggleRect.x - $(el).width() + toggleRect.width + 4
                    });
                },
                onClick: e => {
                    const parent = $(e.target.parentNode);
                    if (parent.hasClass("tabs__item__closer")) {
                        this.#closeButtonClick(e);
                    } else {
                        this.#activateTab(parent[0]);
                    }
                    e.preventDefault();
                    e.stopPropagation();
                }
            });
            this.invisibleTabsHolderToggle.hide();

            this.#organizeTabs();
        }

        #closeButtonClick(e){
            const that = this, element = this.element, o = this.options;

            const tab = $(e.target).closest(".tabs__item");
            const parent = tab.closest("ul");

            if (!o.onTabBeforeClose(tab[0])) {
                return
            }

            if (tab.hasClass("active")) {
                const prev = tab.prev(".tabs__item"), next = tab.next(".tabs__item");
                if (prev.length) {
                    that.#activateTab(prev[0]);
                } else if (next.length) {
                    that.#activateTab(next[0]);
                } else if (parent.hasClass("tabs__invisible_tab_holder") && parent.children(".tabs__item").length === 1) {
                    if (element.children(".tabs__item").length) {
                        that.#activateTab(element.children(".tabs__item").last()[0]);
                    }
                }
            }

            that.#closeTab(tab[0]);

            if (parent.hasClass("tabs__invisible_tab_holder") && parent.children(".tabs__item").length === 0) {
                this.invisibleTabsHolderPlugin.close();
                this.invisibleTabsHolderToggle.hide();
            }

            e.preventDefault();
            e.stopPropagation();
        }

        #createEvents(){
            const that = this, element = this.element, o = this.options;

            element.on("click", ".tabs__item__closer", this.#closeButtonClick.bind(this));

            element.on("click", ".tabs__item", (e) => {
                const tab = $(e.target).closest(".tabs__item");

                if (tab.hasClass("active")) {
                    return
                }

                that.#activateTab(tab[0]);
            });

            element.on("click", ".tabs__append-button", (e)=>{
                e.preventDefault();
                e.stopPropagation();

                exec$1(o.onAppendButtonClick, [element[0]]);
            });

            $(window).on("resize", (e)=>{
                const toggleRect = this.invisibleTabsHolderToggle[0].getBoundingClientRect();
                this.invisibleTabsHolderPlugin.element.css({
                    top: toggleRect.y + toggleRect.height + 10,
                    left: toggleRect.x - this.invisibleTabsHolderPlugin.element.width() + toggleRect.width + 4
                });
                this.#organizeTabs();
            });
        }

        #organizeTabs(){
            const element = this.element;
            const tabsWidth = this.elem.getBoundingClientRect().width;
            const holder = this.invisibleTabsHolderPlugin.element;
            const addTabButton = element.find(".tabs__append");

            holder.children(".tabs__item").each((index, el)=>{
                const tab = $(el);

                if (addTabButton.length) {
                    tab.insertBefore(addTabButton);
                } else {
                    tab.appendTo(element);
                }
            });

            element.children(".tabs__item").each((index, el)=>{
                const tab = $(el);
                const tabRect = el.getBoundingClientRect();
                if (tabRect.left + tabRect.width + 50 > tabsWidth) {
                    tab.appendTo(holder);
                }
            });

            if (holder.children().length) {
                this.invisibleTabsHolderToggle.show(function(){
                    $(this).css({
                        display: "flex"
                    });
                });
            } else {
                this.invisibleTabsHolderToggle.hide();
            }
        }

        #closeTab(tab){
            exec$1(this.options.onTabClose, [$(tab)[0]]);
            $(tab).remove();

            this.#organizeTabs();

            return this
        }

        #activateTab(tab){
            const element = this.element, o = this.options;

            element.find(".tabs__item").each((index, el)=>{
                const t = $(el);
                if (t.hasClass("active")) {
                    o.onTabDeactivate(el);
                    t.removeClass("active");
                }
            });

            $(tab).addClass("active");
            exec$1(o.onTabActivate, [$(tab)[0]]);

            return this
        }

        #createTab(caption, icon, image, canClose, data){
            const item = $("<li>").addClass("tabs__item");

            if (icon || image) {
                item.append(
                    $("<span>")
                        .addClass("tabs__item__icon")
                        .html(icon ? `<span class="${icon}">` : `<img src="${image}" alt="">`)
                );
            }

            item.append( $("<span>").addClass("tabs__item__caption").html(caption) );

            if (canClose)  {
                item.append( $("<span>").addClass("tabs__item__closer").html(`<span>✕</span>`) );
            }

            item.data(data);

            exec$1(this.options.onTabCreate, [$(item)[0]]);

            return item
        }

        addTab({caption, icon, image, canClose = true, data}){
            const element = this.element, o = this.options;
            const tab = this.#createTab(caption, icon, image, canClose, data);

            this.invisibleTabsHolderPlugin.element.append(tab);

            this.#organizeTabs();
            if (o.activateNewTab) this.#activateTab(tab[0]);
            else {
                const items = element.children(".tabs__item");
                if (items.length === 1) {
                    this.#activateTab(items[0]);
                }
            }

            exec$1(o.onTabAppend, [tab[0]]);

            return this
        }

        getActiveTab(){
            return this.component.find(".tabs__item.active")[0]
        }

        getActiveTabIndex(){
            return this.component.find(".tabs__item").index(".active", false)
        }

        getTabByIndex(index){
            return this.component.find(".tabs__item").get(index)
        }

        getTabByTitle(caption){
            if (!caption) {
                return undefined
            }
            const tabs = this.component.find(".tabs__item");
            for(let tab of tabs) {
                if ($(tab).find(".caption").html() === caption) {
                    return tab
                }
            }
            return undefined
        }

        setTab(el, {caption, icon, image, data}){
            let tab = typeof el === "number" ? this.getTabByIndex(el) : $(el);

            if (caption) tab.find(".tabs__item__caption").html(caption);
            if (icon) tab.find(".tabs__item__icon > span").clearClasses().addClass(icon);
            if (image) tab.find(".tabs__item__icon > img").attr("src", image);

            tab.data(data);

            return this
        }

        closeAllTabs(){
            this.component.find(".tabs__item").each((index, tab) => {
                this.#closeTab(tab);
            });
            return this
        }

        closeInactiveTabs(){
            this.component.find(".tabs__item").each((index, tab) => {
                if (!$(tab).hasClass("active")) this.#closeTab(tab);
            });
            return this
        }

        closeOtherTabs(el){
            let _tab = typeof el === "number" ? this.getTabByIndex(el) : $(el);
            this.component.find(".tabs__item").each((index, tab) => {
                if (_tab[0] !== tab) this.#closeTab(tab);
            });
            return this
        }

        closeTab(el){
            let tab = typeof el === "number" ? this.getTabByIndex(el) : $(el);
            this.#closeTab(tab);
            return this
        }

        activateTab(el){
            let tab = typeof el === "number" ? this.getTabByIndex(el) : $(el);
            this.#activateTab(tab);
            return this
        }

        destroy() {
            this.component.remove();
        }
    }

    Registry.register("tabs", Tabs);

    let TableDefaultOptions = {
        onDrawRow: noop_arg,
        onDrawCell: noop_arg,
        onDrawCellData: noop_arg,
    };

    class Table extends Component {
        _origin = []
        _items = []
        _filters = []
        _search = null
        _sort = null
        _head = []
        _foot = []
        _view = []

        constructor(elem, options) {
            if (typeof globalThis["metroTableSetup"] !== "undefined") {
                TableDefaultOptions = merge({}, TableDefaultOptions, globalThis["metroTableSetup"]);
            }
            super(elem, "table", merge({}, TableDefaultOptions, options));
            this.element.addClass("table");
            this.setupHeader();
            this.draw();
        }

        #parseHeaderFromHtml(){
            const header = this.element.find("thead");
            const headerCells = header.find("th");
            $.each(headerCells, (i, _cell) => {
                const cell = $(_cell);
                this._head.push({
                    name: cell.attr("data-name") || cell.text() || `Field${i+1}`,
                    caption: cell.html() || `Field${i+1}`,
                    sortable: JSON.parse(cell.attr("data-sortable") || false),
                    sortDir: cell.attr("data-sort-dir") || "none",
                    format: cell.attr("data-format") || "none",
                    locale: cell.attr("data-locale") || "en-US",
                    size: cell.attr("data-size") || "default",
                    show: JSON.parse(cell.attr("data-show") || true),
                    template: cell.attr("data-template") || ""
                });
            });
            return this
        }

        #parseHeaderFromObject(header){
            $.each(header, (i, cell) => {
                this._head.push({
                    name: cell.name || `Field${i+1}`,
                    caption: cell.caption || cell.name || `Field${i+1}`,
                    sortable: cell.sortable || false,
                    sortDir: cell.sortDir || "none",
                    format: cell.format || "none",
                    locale: cell.locale || "en-US",
                    size: cell.size || "default",
                    show: cell.show || true,
                    template: cell.template || ""
                });
            });
            return this
        }

        setupHeader(header){
            if (undef$1(header)) {
                this.#parseHeaderFromHtml();
            } else {
                this.#parseHeaderFromObject(header);
            }
        }

        #parseBody(){
            const body = this.element.find("tbody");
            $.each(body.find("tr"), (trIndex, tr) => {
                const tdArray = [];
                $.each(tr.find("td"), (tdIndex, td) => {
                    tdArray.push({
                        className: td[0].className,
                        cellData: td.html()
                    });
                });
                this._origin.push(tdArray);
            });
            return this
        }

        items(){
            return this._items
        }

        origin(){
            return this._origin
        }

        filters(...fns){
            this._filters = [...fns];
            return this
        }

        search(fn){
            this._search = fn;
            return this
        }

        sort(fn){
            this._sort = fn;
            return this
        }

        draw(){
            this._drawHead();
            this._drawBody();
            this._drawFoot();
        }

        _drawHead(){
            const element = this.element; this.options;
            const header = element.find("thead").clear();
            const headerRow = $("<tr>").appendTo(header);

            $.each(this._head, (i, h) => {
                $("<th>").attr("data-name", h.name).html(h.caption).appendTo(headerRow);
            });

            return this
        }

        _drawBody(){
            // const element = this.element, o = this.options
            // const body = element.find("tbody").clear()
            //
            // for(let row of this._items) {
            //     const data = Array.isArray(row) ? row : Object.values(row)
            //     const tr = $("<tr>"), _tr = tr[0]
            //     let tdIndex = 0
            //     for(let cell of data) {
            //         const td = $("<td>"), _td = td[0]
            //         const head = this._head[tdIndex]
            //         td.html(exec(o.onDrawCellData, [cell, head]))
            //         tr.append(exec(o.onDrawCell, [_td, head]))
            //         tdIndex++
            //     }
            //     body.append(exec(o.onDrawRow, [_tr]))
            // }
        }

        _drawFoot(){

        }
    }

    Registry.register("table", Table);

    let PanelDefaultOptions = {
        id: "",
        caption: "Panel",
        icon: "",
        collapsible: true,
        collapsed: false,
        duration: 100,
        width: "auto",
        height: "auto",
        closeable: false,
        customButtons: null,
        saveState: false,

        onCollapse: noop,
        onExpand: noop,
    };

    class Panel extends Component {
        collapsed = false

        constructor(elem, options) {
            if (!undef$1(globalThis["metroPanelSetup"])) {
                PanelDefaultOptions = merge({}, PanelDefaultOptions, globalThis["metroPanelSetup"]);
            }
            super(elem, "panel", merge({}, PanelDefaultOptions, options));
            this.createStruct();
        }

        createStruct(){
            const element = this.element, o = this.options;
            const panel = $("<div>").addClass("panel");
            const caption = $("<div>").addClass("panel-title");
            const content = $("<div>").addClass("panel-content");
            const contentInner = $("<div>").addClass("panel-content-inner").appendTo(content);

            if (o.id) {
                panel.id(o.id);
            }

            panel.insertBefore(element);

            // Create caption
            if (o.icon) $("<span>").addClass("icon").html(o.icon).appendTo(caption);
            $("<div>").addClass("caption").html(o.caption).appendTo(caption);

            const customButtons = isObjectType(o.customButtons);
            if (customButtons) {
                const customButtonsContainer = $("<div>").addClass("custom-buttons").appendTo(caption);
                $.each(customButtons, (i, b) => {
                    const btn = $("<button>")
                        .prop("type", "button")
                        .addClass("button btn-custom")
                        .addClass(b.className)
                        .html(b.caption)
                        .appendTo(customButtonsContainer);
                    btn.on("click", b.onclick.bind(this));
                });
            }

            const serviceButtonsContainer = $("<div>").addClass("service-buttons").appendTo(caption);
            if (o.collapsible) {
                const btn = $("<button>").addClass("button btn-custom dropdown-toggle").html("&#x2195;").appendTo(serviceButtonsContainer);
                btn.on("click", () => {
                    this.#collapse(this.collapsed ? content[0].scrollHeight : 0);
                });
            }
            if (o.closeable) {
                const btn = $("<button>").addClass("button btn-custom dropdown-toggle").html("╳").appendTo(serviceButtonsContainer);
                btn.on("click", () => {
                    this.destroy();
                });
            }

            // Create content
            element.appendTo(contentInner);

            // Create panel
            panel.append(caption, content);

            this.component = panel;

            if (o.saveState) {
                const id = element.id();
                if (!id || id.endsWith('--auto')) {
                    panic(`To use saveState please define the ID for the element!`);
                } else {
                    const storage = new MetroStorage();
                    const collapsed = storage.getItem(`panel:${element.id()}:state`, false);
                    if (collapsed) {
                        this.collapse();
                    } else {
                        this.expand();
                    }
                }
            }

            if (o.collapsed) {
                this.collapse();
            }
        }

        #saveState(){
            const element = this.element, o = this.options;
            const id = element.id();
            if (!o.saveState) {
                return this
            }
            if (!id || id.endsWith('--auto')) {
                panic(`To use saveState please define the ID for the element!`);
            }
            const storage = new MetroStorage();
            storage.setItem(`panel:${element.id()}:state`, this.collapsed);
        }

        #collapse(height){
            Animation.animate({
                el: this.component.find('.panel-content')[0],
                draw: {
                    height
                },
                dur: this.options.duration,
                onDone: () => {
                    this.collapsed = height === 0;
                    this.component.addClass(this.collapsed ? "panel-collapsed" : "panel-expanded");
                    this.#saveState();
                    this.fireEvent(this.collapsed ? "collapse" : "expand", {
                        component: this.component
                    });
                }
            });
        }

        collapse(){
            this.#collapse(0);
        }

        expand(){
            this.#collapse(this.component.find('.panel-content')[0].scrollHeight);
        }
    }

    Registry.register("panel", Panel);

    let CollapseDefaultOptions = {
        toggle: null,
        collapsed: false,
        duration: 100,
        saveState: false,
        onExpand: noop,
        onCollapse: noop,
    };

    class Collapse extends Component {
        constructor(elem, options) {
            if (!undef$1(globalThis["metroCollapseSetup"])) {
                CollapseDefaultOptions = merge({}, CollapseDefaultOptions, globalThis["metroCollapseSetup"]);
            }

            super(elem, "collapse", merge({}, CollapseDefaultOptions, options));

            this.createStruct();
            this.createEvents();
        }

        createStruct(){
            const element = this.element, o = this.options;
            this.element.css({
                overflow: "hidden"
            });
            this.collapsed = false;

            this.toggler = this.options.toggle ?
                $(this.options.toggle)
                : this.element.siblings('.collapse-toggle').length > 0 ?
                    this.element.siblings('.collapse-toggle')
                    : this.element.siblings('a:nth-child(1)');

            if (o.saveState) {
                const id = element.id();
                if (!id || id.endsWith('--auto')) {
                    panic(`To use saveState please define the ID for the element!`);
                } else {
                    const storage = new MetroStorage();
                    const collapsed = storage.getItem(`collapse:${id}:state`, false);
                    if (collapsed) {
                        this.collapse();
                    } else {
                        this.expand();
                    }
                }
            }

            if (o.collapsed) {
                this.collapse();
            }
        }

        createEvents(){
            this.toggler.on("click", () => {
                this.toggle();
            });
        }

        #saveState(){
            const element = this.element, o = this.options;
            const id = element.id();
            if (!o.saveState) {
                return this
            }
            if (!id || id.endsWith('--auto')) {
                panic(`To use saveState please define the ID for the element!`);
            }
            const storage = new MetroStorage();
            storage.setItem(`collapse:${element.id()}:state`, this.collapsed);
        }

        #collapse(height){
            Animation.animate({
                el: this.elem,
                draw: {
                    height
                },
                dur: this.options.duration,
                onDone: () => {
                    this.collapsed = height === 0;
                    this.component.addClass(this.collapsed ? "element-collapsed" : "element-expanded");
                    this.#saveState();
                    this.fireEvent(this.collapsed ? "collapse" : "expand", {
                        component: this.component
                    });
                }
            });
        }

        collapse(){
            this.#collapse(0);
        }

        expand(){
            this.#collapse(this.elem.scrollHeight);
        }

        toggle(){
            if (this.collapsed) {
                this.expand();
            } else {
                this.collapse();
            }
        }

        updateAttr(attr, newVal, oldVal) {
            switch (attr) {
                case "data-collapsed": {
                    if (newVal === "true") {
                        this.collapse();
                    } else {
                        this.expand();
                    }
                    break;
                }
                case "data-duration": {
                    this.options.duration = newVal;
                    break;
                }
            }
        }

        destroy() {
            this.toggler.off("click");
        }
    }

    Registry.register("collapse", Collapse);

    let DragDefaultOptions = {
        dragger: null,
        dragArea: "parent",
        boundaryRestriction: true,
        canDrag: true,
        onDragStart: noop,
        onDragEnd: noop,
        onDragMove: noop,
    };

    class Drag extends Component {
        dragger = null

        constructor(elem, options) {
            if (typeof globalThis["metroDragSetup"] !== "undefined") {
                DragDefaultOptions = merge({}, DragDefaultOptions, globalThis["metroDragSetup"]);
            }

            super(elem, "drag", merge({}, DragDefaultOptions, options));

            this.createStruct();
            this.createEvents();
        }

        createStruct(){
            const element = this.element, o = this.options;
            const offset = element.offset();

            element.css({
                position: "absolute"
            });

            this.dragger = o.dragger ? $(o.dragger) : element;
            this.dragger[0].ondragstart = () => false;

            if (o.dragArea === 'document' || o.dragArea === 'window') {
                o.dragArea = "body";
            }

            this.dragArea = o.dragArea === 'parent' ? element.parent() : $(o.dragArea);
            if (o.dragArea !== 'parent') {
                element.appendTo(this.dragArea);
                element.css({
                    top: offset.top,
                    left: offset.left
                });
            }
        }

        createEvents(){
            const element = this.element, o = this.options;
            const id = element.id();
            const position = {
                x: 0,
                y: 0
            };

            this.dragger.on("mousedown touchstart", (startEvent) => {
                const coord = o.dragArea !== "parent" ? element.offset() : element.position(),
                    shiftX = pageXY(startEvent).x - coord.left,
                    shiftY = pageXY(startEvent).y - coord.top;

                const moveElement = (event) => {
                    let top = pageXY(event).y - shiftY;
                    let left = pageXY(event).x - shiftX;

                    if (o.boundaryRestriction) {
                        if (top < 0) top = 0;
                        if (left < 0) left = 0;

                        if (top > this.dragArea.outerHeight() - element.outerHeight()) top = this.dragArea.outerHeight() - element.outerHeight();
                        if (left > this.dragArea.outerWidth() - element.outerWidth()) left = this.dragArea.outerWidth() - element.outerWidth();
                    }

                    position.y = top;
                    position.x = left;

                    element.css({
                        left: left,
                        top: top
                    });

                    this.dispatchEvent("reposition", {left, top});
                };

                if (this.options.canDrag === false) {
                    return ;
                }

                if (startEvent.which && startEvent.which !== 1) {
                    return ;
                }

                this.drag = true;

                element.addClass("element-draggable");

                moveElement(startEvent);

                this.fireEvent("drag-start", {
                    element: element[0],
                    position: position,
                });

                $(document).on("mousemove touchmove", (moveEvent) => {
                    moveEvent.preventDefault();
                    moveElement(moveEvent);
                    this.fireEvent("drag-move", {
                        element: element[0],
                        position: position,
                    });
                }, {ns: id, passive: false});

                $(document).on("mouseup touchend", () => {
                    element.removeClass("element-draggable");

                    if (this.drag) {
                        $(document).off("mousemove touchmove", {ns: id});
                        $(document).off("mouseup touchend", {ns: id});
                    }

                    this.drag = false;
                    this.move = false;

                    this.fireEvent("drag-end", {
                        element: element[0],
                        position: position,
                    });

                }, {ns: id});
            });
        }

        on(){
            this.options.canDrag = true;
        }

        off(){
            this.options.canDrag = false;
        }

        updateAttr(attr, newVal, oldVal) {
            switch (attr) {
                case "data-can-drag": {
                    this.options.canDrag = newVal;
                    break
                }
            }
        }

        destroy() {
            this.dragger.off("mousedown touchstart", {ns: this.element.id()});
        }
    }

    Registry.register("drag", Drag);

    let HintDefaultOptions = {
        deferred: 100,
        hintHide: 5000,
        hintText: "",
        hintPosition: "top",
        hintOffset: 4,
        hintSize: 0,
        onHintShow: noop,
        onHintClose: noop,
    };

    class Hint extends Component {
        hint = null
        over = false
        interval = null
        size = null
        hintText = null

        constructor(elem, options) {
            if (typeof globalThis["metroHintSetup"] !== "undefined") {
                HintDefaultOptions = merge({}, HintDefaultOptions, globalThis["metroHintSetup"]);
            }

            super(elem, "hint", merge({}, HintDefaultOptions, options));
            this.hintText = this.options.hintText || this.element.attr("title");
            this.createEvents();
        }

        createEvents(){
            const element = this.element, o = this.options;

            element.on("touchstart mouseenter", (e) => {
                this.over = true;
                this.#createHint();
                if (this.interval) return
                this.interval = setTimeout(() => {
                    this.#removeHint();
                }, +o.hintHide);
            });

            element.on("touchend mouseleave", (e) => {
                this.over = false;
                this.#removeHint();
            });

            $(window).on("scroll", () => {
                if (this.hint !== null) this.#setPosition(this.hint);
            }, {ns: element.id()});

            element.on("reposition", (event) => {
                if (this.hint !== null) this.#setPosition(this.hint);
            });
        }

        #createHint(){
            const elem = this.elem, element = this.element, o = this.options;
            const hint = $("<div>").addClass("hint").html(this.hintText);

            element.attr("title", null);

            if (o.hintSize) {
                hint.css({
                    width: o.hintSize
                });
            }

            $(".hint:not(.permanent-hint)").remove();

            if (elem.tagName === 'TD' || elem.tagName === 'TH') {
                const wrapper = $("<div/>").css("display", "inline-block").html(element.html());
                element.html(wrapper);
                this.element = wrapper;
            }

            hint.appendTo($("body"));

            this.#setPosition(hint.visible(false));

            this.size = {
                width: hint.outerWidth(),
                height: hint.outerHeight()
            };

            this.fireEvent("hint-show", {
                hint: hint[0]
            });

            this.hint = hint;
        }

        #removeHint(){
            this.element; this.options;

            if (this.hint === null) return

            this.hint.remove();
            this.hint = null;
            this.fireEvent("hint-close");

            clearInterval(this.interval);
            this.interval = null;
        }

        #setPosition(hint){
            setTimeout(() => {
                const width = this.size.width,
                    height = this.size.height,
                    o = this.options,
                    element = this.element,
                    offset = element.offset(),
                    scrollLeft = $(window).scrollLeft(),
                    scrollTop = $(window).scrollTop();

                if (o.hintPosition === "bottom") {
                    hint.addClass('bottom');
                    hint.css({
                        top: offset.top - scrollTop + element.outerHeight() + o.hintOffset,
                        left: offset.left + element.outerWidth()/2 - width/2  - scrollLeft
                    });
                } else if (o.hintPosition === "right") {
                    hint.addClass('right');
                    hint.css({
                        top: offset.top + element.outerHeight()/2 - height/2 - scrollTop,
                        left: offset.left + element.outerWidth() - scrollLeft + o.hintOffset
                    });
                } else if (o.hintPosition === "left") {
                    hint.addClass('left');
                    hint.css({
                        top: offset.top + element.outerHeight()/2 - height/2 - scrollTop,
                        left: offset.left - width - scrollLeft - o.hintOffset
                    });
                } else {
                    hint.addClass('top');
                    hint.css({
                        top: offset.top - scrollTop - height - o.hintOffset,
                        left: offset.left - scrollLeft + element.outerWidth()/2 - width/2
                    });
                }
                hint.visible(true);
            });
        }

        destroy() {
            const element = this.element;

            element.off("touchstart mouseenter");
            element.off("touchend mouseleave");
            $(window).off("scroll", {ns: element.id()});
        }
    }

    Registry.register("hint", Hint);

    let NotifyDefaultOptions = {
        width: 220,
        timeout: 5000,
        duration: 200,
        distance: "max",
        ease: "linear",
        canClose: true,
        position: "right"
    };

    class Notify {
        options = null
        container = null

        constructor(options) {
            if (!undef$1(globalThis["metroNotifySetup"])) {
                NotifyDefaultOptions = merge({}, NotifyDefaultOptions, globalThis["metroNotifySetup"]);
            }
            this.options = merge({}, NotifyDefaultOptions, options);
            this.#createContainer();
            this.#createEvents();
        }

        #createEvents(){
            this.container.on("click", ".notify__closer", (event) => {
                this.destroy($(event.target).parent()[0]);
            });
        }

        #createContainer(){
            let el = $(".notify-container");
            if (el.length) {return el}
            this.container = $("<div>").addClass("notify-container").addClass(`position-${this.options.position}`).appendTo("body");
        }

        create({message, title = "", keepOpen = false, className = ""} = {}){
            required$1(message, `Empty message for notify!`);

            const o = this.options;

            const notify = $("<div>").addClass("notify").css({ width: o.width });

            if (className) {
                notify.addClass(className);
            }

            if (title) {
                $("<div>").addClass("notify__title").html(title).appendTo(notify);
            }

            $("<div>").addClass("notify__message").html(message).appendTo(notify);

            if (o.canClose) {
                $("<span>").addClass("notify__closer").html("╳").appendTo(notify);
            }

            this.container.append(notify);

            const distance = o.distance === "max" || isNaN(o.distance) ? $(window).height() : o.distance;

            Animation.animate({
                el: notify[0],
                draw: {
                    marginTop: [distance, 0],
                    opacity: [0, 1]
                },
                dur: o.duration,
                ease: o.ease,
                onDone: () => {
                    setTimeout(() => {
                        if (keepOpen) {
                            return
                        }
                        this.destroy(notify);
                    }, o.timeout);
                }
            });
        }

        destroy(notify){
            if (notify) {
                const el = $(notify);
                Animation.animate({
                    el: el[0],
                    draw: {
                        opacity: [1, 0]
                    },
                    dur: this.options.duration,
                    onDone: () => {
                        el.remove();
                    }
                });
            }
        }
    }

    // Metro5.Notify = new Notify()
    Registry.register("notify", Notify);

    globalThis.Metro = new Metro5$1();
    globalThis.Metro5.Routines = Routines;

    globalThis.Notify = new Notify();
    globalThis.Toast = new Toast();

})();
