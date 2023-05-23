window.calendarDrawDayTest = (date, cell) => {
    if (date.day() % 2 === 0) {
        cell.addClass("bg-red fg-white")
    }
}

window.templateData = {
    skills: ["javascript", "html", "css"],
    showSkills: true
};

import {Metro5} from "../src/index.js"
import "../src/icons/mif.css"
import * as CommonCss from "../src/common"
import * as Components from "../src/components"
import * as Routines from "../src/routines"

import tableUrl from './data/table.json?url'

window.Metro = new Metro5({
    removeCloakTimeout: 1000,
    onInit: ()=>{
        console.log("Metro5 Initialed.")
    }
})

window.createToastTest = (o) => {
    Metro5.toast.create("Toast Message!", o)
}

let fileIndex = 0;

window.addTab = function () {
    const tabs = Metro5.getPlugin("#tabs1", "tabs");
    tabs.addTab({
        icon: "mif-document-file-css",
        caption: `noname${fileIndex}.css`,
        canClose: true
    });
    fileIndex++;
};

const ds = new Components.Dataset(tableUrl)
// const ds = new Components.Dataset("https://metroui.org.ua/data/table.json")
// console.log(ds)
console.log(ds.filter(
    (row) => {
        return row[3] < 30
    }
).sortBy("salary", "desc").items())