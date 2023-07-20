export const createStyleSheet = function(media){
    const style = document.createElement("style");

    if (media) {
        style.setAttribute("media", media);
    }

    style.appendChild(document.createTextNode(""));

    document.head.appendChild(style);

    return style.sheet;
}

export const addCssRule = function(sheet, selector, rules, index){
    sheet.insertRule(selector + "{" + rules + "}", index);
}