globalThis.calendarDrawDayTest = (date, cell) => {
    if (date.day() % 2 === 0) {
        cell.addClass("bg-red fg-white")
    }
}

globalThis.templateData = {
    skills: ["javascript", "html", "css"],
    showSkills: true
};

import {Metro5} from "../src/index.js"
import "../icons/mif.css"
import * as CommonCss from "../src/common"
import * as Components from "../src/components"

globalThis.Metro = new Metro5({
    removeCloakTimeout: 1000,
    onInit: ()=>{
    }
})

globalThis.createToastTest = (o) => {
    Metro5.toast.create("Toast Message!", o)
}
