import {Component} from "../../core/component.js";
import {isObjectType, merge, noop, undef} from "../../routines/index.js";
import {Registry} from "../../core/registry.js";

export const TemplateEngine = {
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
}

let TemplateDefaultOptions = {
    templateData: null,
    beginToken: "<%",
    endToken: "%>",
    onCompile: noop,
}

export class Template extends Component {
    template = ""
    data = {}
    constructor(elem, options) {
        if (!undef(globalThis["metroTemplateSetup"])) {
            TemplateDefaultOptions = merge({}, TemplateDefaultOptions, globalThis["metroTemplateSetup"])
        }
        super(elem, "template", merge({}, TemplateDefaultOptions, options));
        this.createStruct()
    }

    createStruct(){
        const element = this.element, o = this.options;
        this.template = element.html()
        this.data = isObjectType(o.templateData) || {}
        this.compile()
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
        const _data = isObjectType(data)
        if (!_data) return
        this.data = _data
        this.compile()
    }
}

Registry.register("template", Template)