(function () {
    'use strict';

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

    const shuffleArray$1 = function () {
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

    const shuffle = s => shuffleArray$1(toStr(s).split("")).join("");

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

    const lpad$1 = function (s) {
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
    const re$1 = {
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

          if (re$1.not_type.test(ph.type) && re$1.not_primitive.test(ph.type) && arg instanceof Function) {
            arg = arg();
          }

          if (re$1.numeric_arg.test(ph.type) && typeof arg !== 'number' && isNaN(arg)) {
            throw new TypeError(sprintf('[sprintf] expecting number but found %T'));
          }

          if (re$1.number.test(ph.type)) {
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

          if (re$1.json.test(ph.type)) {
            output += arg;
          } else {
            if (re$1.number.test(ph.type) && (!is_positive || ph.sign)) {
              sign = is_positive ? '+' : '-';
              arg = arg.toString().replace(re$1.sign, '');
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
        if ((match = re$1.text.exec(_fmt)) !== null) {
          parse_tree.push(match[0]);
        } else if ((match = re$1.modulo.exec(_fmt)) !== null) {
          parse_tree.push('%');
        } else if ((match = re$1.placeholder.exec(_fmt)) !== null) {
          if (match[2]) {
            arg_names |= 1;
            let field_list = [],
                replacement_field = match[2],
                field_match = [];

            if ((field_match = re$1.key.exec(replacement_field)) !== null) {
              field_list.push(field_match[1]);

              while ((replacement_field = replacement_field.substring(field_match[0].length)) !== '') {
                if ((field_match = re$1.key_access.exec(replacement_field)) !== null) {
                  field_list.push(field_match[1]);
                } else if ((field_match = re$1.index_access.exec(replacement_field)) !== null) {
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
      lpad: lpad$1,
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
            result = func.apply(context, args);
            return result;
        } catch (err) {
            throw err;
        }
    };

    const panic = msg => {
        throw new Error(`Panic! ${msg}`)
    };

    const objectLength = (obj) => {
        if (typeof obj !== "object") return null
        return Object.keys(obj).length;
    };

    const defaultComponentOptions = {

    };

    class Component {
        constructor(elem, name, options) {
            this.options = merge({}, defaultComponentOptions, options);
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

        updateAttr(attr, newVal, oldVal){

        }
        destroy(){
            this.element.remove();
        }
    }

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

    let AccordionDefaultOptions = {
        deferred: 0,
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
            setTimeout(()=>{
                this.createStruct();
                this.createEvents();
                this.fireEvent("create", {});
            }, this.options.deferred);
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
        deferred: 0,
        type: "simple",
        style: "default"
    };

    class Activity extends Component {
        constructor(elem, options = {}) {
            super(elem, "activity", merge({}, ActivitiesDefaultOptions, options));

            setTimeout(()=>{
                this.createStruct();
            }, this.options.deferred);
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

    const shuffleArray = (a = []) => {
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
        deferred: 0
    };

    class Appbar extends Component {
        constructor(elem, options) {
            if (typeof globalThis["metroAppbarSetup"] !== "undefined") {
                AppbarDefaultOptions = merge({}, AppbarDefaultOptions, globalThis["metroAppbarSetup"]);
            }
            super(elem, "appbar", merge({}, AppbarDefaultOptions, options));
            setTimeout(()=>{
                this.createStruct();
                this.createEvents();
            }, this.options.deferred);
        }

        createStruct(){}
        createEvents(){}
    }

    Registry.register("appbar", Appbar);

    const encURI = s => encodeURI(s).replace(/%5B/g, '[').replace(/%5D/g, ']');

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

    let GravatarDefaultOptions = {
        deferred: 0,
        email: "",
        size: 64,
        default: "mp",
        onCreate: f => f
    };

    class Gravatar extends Component {
        image = null
        constructor(elem, options) {
            super(elem, "gravatar", merge({}, GravatarDefaultOptions, options));
            setTimeout(()=>{
                this.createStruct();
                this.getGravatar();
            }, this.options.deferred);
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
            this.showToggle();
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

    const lpad = function(str, pad, length){
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
                case C$1.s:  result = _date.ms(0); break; //second
                case C$1.m:  result = Datetime.align(_date, C$1.s)[C$1.s](0); break; //minute
                case C$1.h:  result = Datetime.align(_date, C$1.m)[C$1.m](0); break; //hour
                case C$1.D:  result = Datetime.align(_date, C$1.h)[C$1.h](0); break; //day
                case C$1.M:  result = Datetime.align(_date, C$1.D)[C$1.D](1); break; //month
                case C$1.Y:  result = Datetime.align(_date, C$1.M)[C$1.M](0); break; //year
                case C$1.W:  {
                    temp = _date.weekDay();
                    result = Datetime.align(date, C$1.D).addDay(-temp);
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
                case C$1.ms: result = _date.ms(999); break; //second
                case C$1.s:  result = Datetime.alignEnd(_date, C$1.ms); break; //second
                case C$1.m:  result = Datetime.alignEnd(_date, C$1.s)[C$1.s](59); break; //minute
                case C$1.h:  result = Datetime.alignEnd(_date, C$1.m)[C$1.m](59); break; //hour
                case C$1.D:  result = Datetime.alignEnd(_date, C$1.h)[C$1.h](23); break; //day
                case C$1.M:  result = Datetime.alignEnd(_date, C$1.D)[C$1.D](1).add(1, C$1.M).add(-1, C$1.D); break; //month
                case C$1.Y:  result = Datetime.alignEnd(_date, C$1.D)[C$1.M](11)[C$1.D](31); break; //year
                case C$1.W:  {
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
            const names = Datetime.getLocale(locale || this.locale);
            const year = this.year(), year2 = this.year2(), month = this.month(), day = this.day(), weekDay = this.weekDay();
            const hour = this.hour(), minute = this.minute(), second = this.second(), ms = this.ms();
            const matches = {
                YY: year2,
                YYYY: year,
                M: month + 1,
                MM: lpad(month + 1, 0, 2),
                MMM: names.monthsShort[month],
                MMMM: names.months[month],
                D: day,
                DD: lpad(day, 0, 2),
                d: weekDay,
                dd: names.weekdaysMin[weekDay],
                ddd: names.weekdaysShort[weekDay],
                dddd: names.weekdays[weekDay],
                H: hour,
                HH: lpad(hour, 0, 2),
                m: minute,
                mm: lpad(minute,0, 2),
                s: second,
                ss: lpad(second,0, 2),
                sss: lpad(ms,0, 3)
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
                hh: lpad(h12, 0, 2)
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
                WW: lpad(wn, 0, 2),
                WWW: wni,
                WWWW: lpad(wni, 0, 2)
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
            const aDay = lpad(day, 0, 2),
                aMonth = lpad(month + 1, 0, 2),
                aHour = lpad(hour, 0, 2),
                aHour12 = lpad(hour12, 0, 2),
                aMinute = lpad(minute, 0, 2),
                aSecond = lpad(second, 0, 2),
                aMs = lpad(ms, 0, 3);

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
                '%j': lpad(this.dayOfYear(), 0, 3),
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
    const dt$1 = (children = '', options = {}) => new Dt(children, options);
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
        dt: dt$1,
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

    const Z$1 = ["translateX", "translateY", "translateZ", "rotate", "rotateX", "rotateY", "rotateZ", "scale", "scaleX", "scaleY", "scaleZ", "skew", "skewX", "skewY"], B$1 = ["opacity", "zIndex"], N$1 = ["opacity", "volume"], V$1 = ["scrollLeft", "scrollTop"], R$1 = ["backgroundColor", "color"], G$1 = ["opacity"], J$1 = (e, t) => {
      const o = /^(\*=|\+=|-=)/.exec(e);
      if (!o)
        return e;
      const s = re(e) || 0, n = parseFloat(t), r = parseFloat(e.replace(o[0], ""));
      switch (o[0][0]) {
        case "+":
          return n + r + s;
        case "-":
          return n - r + s;
        case "*":
          return n * r + s;
      }
    }, K$1 = (e, t, o) => typeof e[t] < "u" ? V$1.includes(t) ? t === "scrollLeft" ? e === window ? pageXOffset : e.scrollLeft : e === window ? pageYOffset : e.scrollTop : e[t] || 0 : e.style[t] || getComputedStyle(e, o)[t], O$1 = (e, t, o, s, n = !1) => {
      t = oe(t), n && (o = parseInt(o)), e instanceof HTMLElement ? typeof e[t] < "u" ? e[t] = o : e.style[t] = t === "transform" || t.toLowerCase().includes("color") ? o : o + s : e[t] = o;
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
    }, I$1 = (e) => Array.from(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(e || "#000000")).slice(1).map((t) => parseInt(t, 16)), k$1 = (e, t) => getComputedStyle(e)[t].replace(/[^\d.,]/g, "").split(",").map((o) => parseInt(o)), v$1 = (e, t, o) => {
      let s = [], n = D$1(e);
      P$1(t, (r, i) => {
        let f = i[0];
        i[1];
        let d = i[2], a = i[3];
        r.includes("rotate") || r.includes("skew") ? a === "" && (a = "deg") : r.includes("scale") ? a = "" : a = "px", a === "turn" ? s.push(`${r}(${i[1] * o + a})`) : s.push(`${r}(${f + d * o + a})`);
      }), n.forEach((r, i) => {
        t[i] === void 0 && s.push(`${i}(${r})`);
      }), O$1(e, "transform", s.join(" "));
    }, ee = function(e, t, o) {
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
      W$1(e, t.props, o), v$1(e, t.transform, o), ee(e, t.color, o);
    }, te = (e, t, o = "normal") => {
      const s = {
        props: {},
        transform: {},
        color: {}
      };
      let n, r, i, f, d = D$1(e);
      return P$1(t, (a, c) => {
        const g = Z$1.includes(a), w = B$1.includes(a), u = R$1.includes(a);
        if (Array.isArray(c) && c.length === 1 && (c = c[0]), Array.isArray(c) ? (n = u ? I$1(q$1(c[0])) : b(c[0]), r = u ? I$1(q$1(c[1])) : b(c[1])) : (g ? n = d.get(a) || 0 : u ? n = k$1(e, a) : n = K$1(e, a), n = u ? n : b(n), r = u ? I$1(c) : b(J$1(c, Array.isArray(n) ? n[0] : n))), G$1.includes(a) && n[0] === r[0] && (n[0] = r[0] > 0 ? 0 : 1), o === "reverse" && ([r, n] = [n, r]), f = e instanceof HTMLElement && r[1] === "" && !w && !g ? "px" : r[1], u) {
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
    }, ne = (e) => typeof e > "u" || e === void 0 || e === null, oe = (e) => e.replace(/-([a-z])/g, (t) => t[1].toUpperCase()), P$1 = (e, t) => {
      let o = 0;
      if (se(e))
        [].forEach.call(e, function(s, n) {
          t.apply(s, [n, s]);
        });
      else
        for (let s in e)
          e.hasOwnProperty(s) && t.apply(e[s], [s, e[s], o++]);
      return e;
    }, se = (e) => Array.isArray(e) || typeof e == "object" && "length" in e && typeof e.length == "number", re = (e, t) => {
      const o = /[+-]?\d*\.?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?(%|px|pt|em|rem|in|cm|mm|ex|ch|pc|vw|vh|vmin|vmax|deg|rad|turn)?$/.exec(e);
      return typeof o[1] < "u" ? o[1] : t;
    }, b = (e) => {
      const t = [0, ""];
      return e = "" + e, t[0] = parseFloat(e), t[1] = e.match(/[\d.\-+]*\s*(.*)/)[1] || "", t;
    };
    function z$1(e, t, o) {
      return Math.min(Math.max(e, t), o);
    }
    const m = {
      linear: () => (e) => e
    };
    m.default = m.linear;
    const _ = {
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
        const o = z$1(e, 1, 10), s = z$1(t, 0.1, 2);
        return (n) => n === 0 || n === 1 ? n : -o * Math.pow(2, 10 * (n - 1)) * Math.sin((n - 1 - s / (Math.PI * 2) * Math.asin(1 / o)) * (Math.PI * 2) / s);
      }
    };
    ["Quad", "Cubic", "Quart", "Quint", "Expo"].forEach((e, t) => {
      _[e] = () => (o) => Math.pow(o, t + 2);
    });
    Object.keys(_).forEach((e) => {
      const t = _[e];
      m["easeIn" + e] = t, m["easeOut" + e] = (o, s) => (n) => 1 - t(o, s)(1 - n), m["easeInOut" + e] = (o, s) => (n) => n < 0.5 ? t(o, s)(n * 2) / 2 : 1 - t(o, s)(n * -2 + 2) / 2;
    });
    const l = {
      fx: !0,
      elements: {}
    }, ie = {
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
        let o, { id: s, el: n, draw: r, dur: i, ease: f, loop: d, onFrame: a, onDone: c, pause: g, dir: w, defer: u } = Object.assign({}, ie, e), h = {}, S = "linear", j = [], x = m.linear, C, M = w === "alternate" ? "normal" : w, U = !1, y = s || +(performance.now() * Math.pow(10, 14));
        if (ne(n))
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
          typeof r == "object" && (h = te(n, r, M)), o = performance.now(), l.elements[y].loop += 1, l.elements[y].id = requestAnimationFrame(X);
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
    }, ae = function(e, t = !0) {
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
    l.stop = ae;
    l.chain = L$1;
    l.easing = m;

    class v {
      constructor(e = 0, s = 0, n = 0) {
        this.h = e, this.s = s, this.v = n;
      }
      toString() {
        return `hsv(${this.h},${this.s},${this.v})`;
      }
    }
    class q {
      constructor(e = 0, s = 0, n = 0) {
        this.h = e, this.s = s, this.l = n;
      }
      toString() {
        return `hsl(${this.h},${this.s},${this.l})`;
      }
    }
    class D {
      constructor(e = 0, s = 0, n = 0, r = 0) {
        this.h = e, this.s = s, this.l = n, this.a = r;
      }
      toString() {
        return `hsla(${this.h},${this.s},${this.l},${this.a})`;
      }
    }
    class M {
      constructor(e = 0, s = 0, n = 0) {
        this.r = e, this.g = s, this.b = n;
      }
      toString() {
        return `rgb(${this.r},${this.g},${this.b})`;
      }
    }
    class O {
      constructor(e = 0, s = 0, n = 0, r = 0) {
        this.r = e, this.g = s, this.b = n, this.a = r;
      }
      toString() {
        return `rgba(${this.r},${this.g},${this.b},${this.a})`;
      }
    }
    class F {
      constructor(e = 0, s = 0, n = 0, r = 0) {
        this.c = e, this.m = s, this.y = n, this.k = r;
      }
      toString() {
        return `cmyk(${this.c},${this.m},${this.y},${this.k})`;
      }
    }
    const w = {
      HEX: "hex",
      RGB: "rgb",
      RGBA: "rgba",
      HSV: "hsv",
      HSL: "hsl",
      HSLA: "hsla",
      CMYK: "cmyk",
      UNKNOWN: "unknown"
    }, T = {
      angle: 30,
      algorithm: 1,
      step: 0.1,
      distance: 5,
      tint1: 0.8,
      tint2: 0.4,
      shade1: 0.6,
      shade2: 0.3,
      alpha: 1
    }, Y = function(t) {
      if (G(t) && typeof t != "string")
        return t;
      if (typeof t != "string")
        throw new Error("Value is not a string!");
      if (t[0] === "#" && t.length === 4) {
        const e = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
        return "#" + t.replace(e, (s, n, r, f) => n + n + r + r + f + f);
      }
      return t[0] === "#" ? t : "#" + t;
    }, J = (t) => {
      if (!G(t))
        return;
      const e = g(t);
      return (e.r * 299 + e.g * 587 + e.b * 114) / 1e3 < 128;
    }, rt = (t) => !J(t), K = (t) => t instanceof v, E = (t) => t instanceof q, L = (t) => t instanceof D, I = (t) => t instanceof M, H = (t) => t instanceof O, U = (t) => t instanceof F, W = (t) => /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(t), G = (t) => t ? W(t) || I(t) || H(t) || K(t) || E(t) || L(t) || U(t) : !1, X = (t) => W(t) ? w.HEX : I(t) ? w.RGB : H(t) ? w.RGBA : K(t) ? w.HSV : E(t) ? w.HSL : L(t) ? w.HSLA : U(t) ? w.CMYK : w.UNKNOWN, it = (t, e) => !G(t) || !G(e) ? !1 : $$1(t) === $$1(e), ut = (t) => t.toString(), Z = (t) => {
      const e = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(
        Y(t)
      ), s = [
        parseInt(e[1], 16),
        parseInt(e[2], 16),
        parseInt(e[3], 16)
      ];
      return e ? new M(...s) : null;
    }, tt = (t) => "#" + ((1 << 24) + (t.r << 16) + (t.g << 8) + t.b).toString(16).slice(1), k = (t) => {
      const e = new v();
      let s, n, r;
      const f = t.r / 255, u = t.g / 255, h = t.b / 255, i = Math.max(f, u, h), a = Math.min(f, u, h), l = i - a;
      return r = i, i === 0 ? n = 0 : n = 1 - a / i, i === a ? s = 0 : i === f && u >= h ? s = 60 * ((u - h) / l) : i === f && u < h ? s = 60 * ((u - h) / l) + 360 : i === u ? s = 60 * ((h - f) / l) + 120 : i === h ? s = 60 * ((f - u) / l) + 240 : s = 0, e.h = s, e.s = n, e.v = r, e;
    }, y = (t) => {
      let e, s, n;
      const r = t.h, f = t.s * 100, u = t.v * 100, h = Math.floor(r / 60), i = (100 - f) * u / 100, a = (u - i) * (r % 60 / 60), l = i + a, c = u - a;
      switch (h) {
        case 0:
          e = u, s = l, n = i;
          break;
        case 1:
          e = c, s = u, n = i;
          break;
        case 2:
          e = i, s = u, n = l;
          break;
        case 3:
          e = i, s = c, n = u;
          break;
        case 4:
          e = l, s = i, n = u;
          break;
        case 5:
          e = u, s = i, n = c;
          break;
      }
      return new M(
        Math.round(e * 255 / 100),
        Math.round(s * 255 / 100),
        Math.round(n * 255 / 100)
      );
    }, et = (t) => {
      const e = new F(), s = t.r / 255, n = t.g / 255, r = t.b / 255;
      return e.k = Math.min(1 - s, 1 - n, 1 - r), e.c = 1 - e.k === 0 ? 0 : (1 - s - e.k) / (1 - e.k), e.m = 1 - e.k === 0 ? 0 : (1 - n - e.k) / (1 - e.k), e.y = 1 - e.k === 0 ? 0 : (1 - r - e.k) / (1 - e.k), e.c = Math.round(e.c * 100), e.m = Math.round(e.m * 100), e.y = Math.round(e.y * 100), e.k = Math.round(e.k * 100), e;
    }, st = (t) => {
      const e = Math.floor(255 * (1 - t.c / 100) * (1 - t.k / 100)), s = Math.ceil(255 * (1 - t.m / 100) * (1 - t.k / 100)), n = Math.ceil(255 * (1 - t.y / 100) * (1 - t.k / 100));
      return new M(e, s, n);
    }, j = (t) => {
      let e, s, n, r;
      return e = t.h, n = (2 - t.s) * t.v, s = t.s * t.v, n === 0 ? s = 0 : (r = n <= 1 ? n : 2 - n, r === 0 ? s = 0 : s /= r), n /= 2, new q(e, s, n);
    }, P = (t) => {
      let e, s, n, r;
      return e = t.h, r = t.l * 2, s = t.s * (r <= 1 ? r : 2 - r), n = (r + s) / 2, r + s === 0 ? s = 0 : s = 2 * s / (r + s), new v(e, s, n);
    }, C = (t) => new M(
      Math.round(t.r / 51) * 51,
      Math.round(t.g / 51) * 51,
      Math.round(t.b / 51) * 51
    ), at = (t) => {
      const e = C(t);
      return new O(e.r, e.g, e.b, t.a);
    }, ht = (t) => tt(C(Z(t))), lt = (t) => k(C(g(t))), ct = (t) => j(k(C(g(t)))), ft = (t) => et(C(st(t))), z = (t) => W(t) ? ht(t) : I(t) ? C(t) : H(t) ? at(t) : K(t) ? lt(t) : E(t) ? ct(t) : U(t) ? ft(t) : t, Q = (t, e = "rgb", s = 1) => {
      let n;
      switch (e.toLowerCase()) {
        case "hex":
          n = $$1(t);
          break;
        case "rgb":
          n = g(t);
          break;
        case "rgba":
          n = R(t, s);
          break;
        case "hsl":
          n = N(t);
          break;
        case "hsla":
          n = B(t, s);
          break;
        case "hsv":
          n = V(t);
          break;
        case "cmyk":
          n = x(t);
          break;
        default:
          n = t;
      }
      return n;
    }, $$1 = (t) => typeof t == "string" ? Y(t) : tt(g(t)), g = (t) => {
      if (I(t))
        return t;
      if (H(t))
        return new M(t.r, t.g, t.b);
      if (K(t))
        return y(t);
      if (E(t) || L(t))
        return y(P(t));
      if (W(t))
        return Z(t);
      if (U(t))
        return st(t);
      throw new Error("Unknown color format!");
    }, R = (t, e) => {
      if (H(t))
        return e && (t.a = e), t;
      const s = g(t);
      return new O(s.r, s.g, s.b, e);
    }, V = (t) => k(g(t)), N = (t) => j(k(g(t))), B = (t, e = 1) => {
      if (L(t))
        return e && (t.a = e), t;
      let s = j(k(g(t)));
      return s.a = e, new D(s.h, s.s, s.l, s.a);
    }, x = (t) => et(g(t)), ot = (t) => {
      const e = g(t), s = X(t).toLowerCase(), n = Math.round(e.r * 0.2125 + e.g * 0.7154 + e.b * 0.0721), r = new M(n, n, n);
      return Q(r, s);
    }, vt = (t, e = 10) => nt(t, -1 * Math.abs(e)), nt = (t, e = 10) => {
      let s, n, r = e > 0;
      const f = function(u, h) {
        let i, a, l;
        const c = u.slice(1), A = parseInt(c, 16);
        return i = (A >> 16) + h, i > 255 ? i = 255 : i < 0 && (i = 0), l = (A >> 8 & 255) + h, l > 255 ? l = 255 : l < 0 && (l = 0), a = (A & 255) + h, a > 255 ? a = 255 : a < 0 && (a = 0), "#" + (a | l << 8 | i << 16).toString(16);
      };
      s = X(t).toLowerCase(), s === w.RGBA && t.a;
      do
        n = f($$1(t), e), r ? e-- : e++;
      while (n.length < 7);
      return Q(n, s);
    }, gt = (t, e, s = 1) => {
      const n = V(t), r = X(t).toLowerCase();
      let f = n.h;
      for (f += e; f >= 360; )
        f -= 360;
      for (; f < 0; )
        f += 360;
      return n.h = f, Q(n, r, s);
    }, pt = (t, e, s, n) => {
      const r = Object.assign({}, T, n);
      let f;
      const u = [];
      let h, i, a, l, c;
      if (h = V(t), a = h.h, l = h.s, c = h.v, K(h) === !1)
        return console.warn("The value is a not supported color format!"), !1;
      function A(o, m) {
        let d;
        switch (m) {
          case "hex":
            d = o.map(function(_) {
              return $$1(_);
            });
            break;
          case "rgb":
            d = o.map(function(_) {
              return g(_);
            });
            break;
          case "rgba":
            d = o.map(function(_) {
              return R(_, r.alpha);
            });
            break;
          case "hsl":
            d = o.map(function(_) {
              return N(_);
            });
            break;
          case "hsla":
            d = o.map(function(_) {
              return B(_, r.alpha);
            });
            break;
          case "cmyk":
            d = o.map(function(_) {
              return x(_);
            });
            break;
          default:
            d = o;
        }
        return d;
      }
      function S(o, m, d) {
        return Math.max(m, Math.min(o, d));
      }
      function b(o, m, d) {
        return o < m ? m : o > d ? d : o;
      }
      function p(o, m) {
        for (o += m; o >= 360; )
          o -= 360;
        for (; o < 0; )
          o += 360;
        return o;
      }
      switch (e) {
        case "monochromatic":
        case "mono":
          if (r.algorithm === 1)
            i = y(h), i.r = b(
              Math.round(i.r + (255 - i.r) * r.tint1),
              0,
              255
            ), i.g = b(
              Math.round(i.g + (255 - i.g) * r.tint1),
              0,
              255
            ), i.b = b(
              Math.round(i.b + (255 - i.b) * r.tint1),
              0,
              255
            ), u.push(k(i)), i = y(h), i.r = b(
              Math.round(i.r + (255 - i.r) * r.tint2),
              0,
              255
            ), i.g = b(
              Math.round(i.g + (255 - i.g) * r.tint2),
              0,
              255
            ), i.b = b(
              Math.round(i.b + (255 - i.b) * r.tint2),
              0,
              255
            ), u.push(k(i)), u.push(h), i = y(h), i.r = b(Math.round(i.r * r.shade1), 0, 255), i.g = b(Math.round(i.g * r.shade1), 0, 255), i.b = b(Math.round(i.b * r.shade1), 0, 255), u.push(k(i)), i = y(h), i.r = b(Math.round(i.r * r.shade2), 0, 255), i.g = b(Math.round(i.g * r.shade2), 0, 255), i.b = b(Math.round(i.b * r.shade2), 0, 255), u.push(k(i));
          else if (r.algorithm === 2)
            for (u.push(h), f = 1; f <= r.distance; f++)
              c = S(c - r.step, 0, 1), l = S(l - r.step, 0, 1), u.push({ h: a, s: l, v: c });
          else if (r.algorithm === 3)
            for (u.push(h), f = 1; f <= r.distance; f++)
              c = S(c - r.step, 0, 1), u.push({ h: a, s: l, v: c });
          else
            c = S(h.v + r.step * 2, 0, 1), u.push({ h: a, s: l, v: c }), c = S(h.v + r.step, 0, 1), u.push({ h: a, s: l, v: c }), u.push(h), l = h.s, c = h.v, c = S(h.v - r.step, 0, 1), u.push({ h: a, s: l, v: c }), c = S(h.v - r.step * 2, 0, 1), u.push({ h: a, s: l, v: c });
          break;
        case "complementary":
        case "complement":
        case "comp":
          u.push(h), a = p(h.h, 180), u.push(new v(a, l, c));
          break;
        case "double-complementary":
        case "double-complement":
        case "double":
          u.push(h), a = p(a, 180), u.push(new v(a, l, c)), a = p(a, r.angle), u.push(new v(a, l, c)), a = p(a, 180), u.push(new v(a, l, c));
          break;
        case "analogous":
        case "analog":
          a = p(a, r.angle), u.push(new v(a, l, c)), u.push(h), a = p(h.h, 0 - r.angle), u.push(new v(a, l, c));
          break;
        case "triadic":
        case "triad":
          for (u.push(h), f = 1; f < 3; f++)
            a = p(a, 120), u.push(new v(a, l, c));
          break;
        case "tetradic":
        case "tetra":
          u.push(h), a = p(h.h, 180), u.push(new v(a, l, c)), a = p(h.h, -1 * r.angle), u.push(new v(a, l, c)), a = p(a, 180), u.push(new v(a, l, c));
          break;
        case "square":
          for (u.push(h), f = 1; f < 4; f++)
            a = p(a, 90), u.push(new v(a, l, c));
          break;
        case "split-complementary":
        case "split-complement":
        case "split":
          a = p(a, 180 - r.angle), u.push(new v(a, l, c)), u.push(h), a = p(h.h, 180 + r.angle), u.push(new v(a, l, c));
          break;
        default:
          console.warn("Unknown scheme name");
      }
      return A(u, s);
    }, dt = function(t) {
      const e = t.toLowerCase();
      let s = e.replace(/[^\d.,]/g, "").split(",").map((n) => e.includes("hs") ? parseFloat(n) : parseInt(n));
      return e[0] === "#" ? Y(e) : e.includes("rgba") ? new O(s[0], s[1], s[2], s[3]) : e.includes("rgb") ? new M(s[0], s[1], s[2]) : e.includes("cmyk") ? new F(s[0], s[1], s[2], s[3]) : e.includes("hsv") ? new v(s[0], s[1], s[2]) : e.includes("hsla") ? new D(s[0], s[1], s[2], s[3]) : e.includes("hsl") ? new q(s[0], s[1], s[2]) : e;
    };
    class bt {
      /**
       * Private method for setting value. Do not use outside
       * @param {*} color
       * @private
       */
      _setValue(e) {
        e || (e = "#000000"), typeof e == "string" && (e = Y(dt(e))), e && G(e) && (this._value = e);
      }
      /**
       * Private method for setting options
       * @param options
       * @private
       */
      _setOptions(e) {
        this._options = Object.assign({}, T, e);
      }
      /**
       * Constructor
       * @param {*} color. Set color value. Value must one of: hex, RGB, RGBA, HSL, HSLA, HSV, CMYK.
       * @param {Object} options
       */
      constructor(e = "#000000", s = null) {
        this._setValue(e), this._setOptions(s);
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
      set options(e) {
        this._setOptions(e);
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
      set value(e) {
        this._setValue(e);
      }
      /**
       * Convert current color to RGB
       * @returns {this | undefined}
       */
      toRGB() {
        if (this._value)
          return this._value = g(this._value), this;
      }
      /**
       * Getter.  Get color in RGB format
       * @returns {RGB | undefined}
       */
      get rgb() {
        return this._value ? g(this._value) : void 0;
      }
      /**
       * Convert current value to RGBA
       * @param alpha - Alpha chanel value.
       * @returns {this | undefined}
       */
      toRGBA(e) {
        if (this._value)
          return H(this._value) ? e && (this._value = R(this._value, e)) : this._value = R(
            this._value,
            e || T.alpha
          ), this;
      }
      /**
       * Getter. Get value in RGBA format. For alpha chanel value used options.alpha
       * @returns {RGBA | undefined}
       */
      get rgba() {
        return this._value ? H(this._value) ? this._value : R(this._value, this._options.alpha) : void 0;
      }
      /**
       * Convert current value to HEX
       * @returns {this | undefined}
       */
      toHEX() {
        if (this._value)
          return this._value = $$1(this._value), this;
      }
      /**
       * Getter. Get value as HEX
       * @returns {string | undefined}
       */
      get hex() {
        return this._value ? $$1(this._value) : void 0;
      }
      /**
       * Convert current value to HSV
       * @returns {this | undefined}
       */
      toHSV() {
        if (this._value)
          return this._value = V(this._value), this;
      }
      /**
       * Getter. Get value as HSV
       * @returns {HSV | undefined}
       */
      get hsv() {
        return this._value ? V(this._value) : void 0;
      }
      /**
       * Convert current value to HSL
       * @returns {this | undefined}
       */
      toHSL() {
        if (this._value)
          return this._value = N(this._value), this;
      }
      /**
       * Getter. Get value as HSL
       * @returns {HSL | undefined}
       */
      get hsl() {
        return this._value ? N(this._value) : void 0;
      }
      /**
       * Convert current value to HSV
       * @param alpha
       * @returns {this | undefined}
       */
      toHSLA(e) {
        if (this._value)
          return L(this._value) ? e && (this._value = B(this._value, e)) : this._value = B(this._value, e), this;
      }
      /**
       * Getter. Get value as HSLA. For alpha used options.alpha
       * @returns {HSLA | undefined}
       */
      get hsla() {
        return this._value ? L(this._value) ? this._value : B(this._value, this._options.alpha) : void 0;
      }
      /**
       * Convert current value to CMYK
       * @returns {this | undefined}
       */
      toCMYK() {
        if (this._value)
          return this._value = x(this._value), this;
      }
      /**
       * Getter. Get value as CMYK
       * @returns {CMYK | undefined}
       */
      get cmyk() {
        return this._value ? x(this._value) : void 0;
      }
      /**
       * Convert color value to websafe value
       * @returns {this | undefined}
       */
      toWebsafe() {
        if (this._value)
          return this._value = z(this._value), this;
      }
      /**
       * Getter. Get value as websafe.
       * @returns {HSLA | undefined}
       */
      get websafe() {
        return this._value ? z(this._value) : void 0;
      }
      /**
       * Get stringify color value
       * @returns {string} This function return string presentation of color. Example: for RGB will return rgb(x, y, z)
       */
      toString() {
        return this._value ? ut(this._value) : void 0;
      }
      /**
       * Darken color for requested percent value
       * @param {int} amount - Value must between 0 and 100. Default value is 10
       * @returns {this | undefined}
       */
      darken(e = 10) {
        if (this._value)
          return this._value = vt(this._value, e), this;
      }
      /**
       * Darken color for requested percent value
       * @param {int} amount - Value must between 0 and 100. Default value is 10
       * @returns {this | undefined}
       */
      lighten(e = 10) {
        if (this._value)
          return this._value = nt(this._value, e), this;
      }
      /**
       * Return true, if current color id dark
       * @returns {boolean|undefined}
       */
      isDark() {
        return this._value ? J(this._value) : void 0;
      }
      /**
       * Return true, if current color id light
       * @returns {boolean|undefined}
       */
      isLight() {
        return this._value ? rt(this._value) : void 0;
      }
      /**
       * Change value on wheel with specified angle
       * @param {int} angle - Value between -360 and 360
       */
      hueShift(e) {
        if (this._value)
          return this._value = gt(this._value, e), this;
      }
      /**
       * Convert color value to grayscale value
       * @returns {this | undefined}
       */
      grayscale() {
        if (!(!this._value || this.type === w.UNKNOWN))
          return this._value = ot(
            this._value,
            ("" + this.type).toLowerCase()
          ), this;
      }
      /**
       * Getter. Get color type
       * @returns {string}
       */
      get type() {
        return X(this._value);
      }
      /**
       * Create specified  color scheme for current color value
       * @param {string} name - Scheme name
       * @param {string} format - Format for returned values
       * @param {Object} options - Options for generated schema, will override default options
       * @returns {Array | undefined}
       */
      getScheme(e, s, n) {
        return this._value ? pt(this._value, e, s, n) : void 0;
      }
      /**
       * Check if color is equal to comparison color
       * @param {*} color
       * @returns {boolean}
       */
      equal(e) {
        return it(this._value, e);
      }
    }

    const globalize = () => {
        globalThis.Color = bt;
        globalThis.Animation = l;
        globalThis.Datetime = Datetime;
        globalThis.datetime = datetime;
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

    const MetroOptions = {
        removeCloakTimeout: 100
    };

    class Metro {
        version = "5.0.0"
        status = "pre-alpha"
        plugins = {}
        options = {}

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
            console.info(`Metro UI - v${this.version}-${this.status}`);
            console.info(`Includes: Query, Datetime, String, Html, Animation, Color.`);
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
    }

    globalThis.Metro = new Metro();

})();
