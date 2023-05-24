export const parse = (v, {format = "default", formatMask, locale = "en-US"}) => {
    let result

    switch (format) {
        case "number": result = Number(v); break;
        case "integer":
        case "int": result = parseInt(v); break;
        case "float": result = parseFloat(v); break;
        case "date": result = formatMask ? Datetime.from(v, formatMask, locale) : datetime(v); break;
        case "money": result = parseFloat(v.replace(/[^0-9-.]/g, '')); break;
        case "card": result = v.replace(/[^0-9]/g, ''); break;
        default: result = v.toLowerCase()
    }

    return result
}