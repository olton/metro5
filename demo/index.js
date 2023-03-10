globalThis.calendarDrawDayTest = (date, cell) => {
    if (date.day() % 2 === 0) {
        cell.addClass("bg-red fg-white")
    }
}

globalThis.templateData = {
    skills: ["javascript", "html", "css"],
    showSkills: true
};

import {Metro5} from "../src/core/metro"
import "../icons/mif.css"
import * as CommonCss from "../src/common"
import * as Components from "../src/components"

globalThis.Metro = new Metro5({
    removeCloakTimeout: 1000,
    onInit: ()=>{
        // console.log(Validator.validate("123", "length=5 integer"))
        // const storage = new Components.MetroStorage({key: "Metro5"})
        // storage.setItem("key", "val")
        // $("#skills").html(Components.TemplateEngine.compile(`
        //     My skills:
        //     <hr>
        //     <%if(this.showSkills) {%>
        //     <ul>
        //     <%for(var i = 0; i < this.skills.length; i++) {%>
        //         <li><%this.skills[i]%></li>
        //     <%}%>
        //     </ul>
        //     <br/><strong>Total: </strong><%this.skills.length%> main skills
        //     <%} else {%>
        //         <p>none</p>
        //     <%}%>
        // `, {
        //     skills: ["javascript", "html", "css", "php", "oracle", "mysql", "java", "pascal", "c/c++", "kotlin"],
        //     showSkills: true
        // }))
    }
})

globalThis.createToastTest = (o) => {
    Metro5.toast.create("Toast Message!", o)
}
