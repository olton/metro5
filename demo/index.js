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

// const ds = new Components.MemoryDataset({source: tableUrl})
// ds.run().then(()=>{
//     console.log(ds.filter(
//         (row) => {
//             return row[0] <= 20
//         }
//     ).sortBy("id").page(2, 10))
// })
//
// const json = new Components.JsonDataset({source: "https://jsonplaceholder.typicode.com/photos"})
// json.run().then(()=>{
//     console.log(
//         json.filter( row => {
//             return row.albumId === 1
//         }).search("deserunt").items()
//     )
// })
//

let photosPage = 1, photosLimit = 10
const rds = new Components.RemoteDataset({
    source:"https://jsonplaceholder.typicode.com/photos?_page=$1&_limit=$2"
})
rds.page([photosPage, photosLimit]).run().then(()=>{
    console.log(rds.items())
    drawPhotos(rds.items())
})
function drawPhotos(photos){
    if (photos.length === 0) {
        alert(`No more photos available!`)
    } else {
        $("#rds").clear()
        for(let photo of photos) {
            $("<img>").addClass("").attr("src", photo.url).appendTo("#rds")
        }
    }
}

window.rdsPrevPhotos = () => {
    photosPage--
    if (photosPage < 1) photosPage = 1
    rds.page([photosPage, photosLimit]).run().then(()=>{
        drawPhotos(rds.items())
    })
}
window.rdsNextPhotos = () => {
    photosPage++
    rds.page([photosPage, photosLimit]).run().then(()=>{
        drawPhotos(rds.items())
    })
}
