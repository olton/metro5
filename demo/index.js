import {Metro5} from "../src/core/metro"
import "../icons/mif.css"
import * as CommonCss from "../src/common"
import * as Components from "../src/components"

globalThis.Metro5 = Metro5
globalThis.Metro = new Metro5({
    removeCloakTimeout: 1000,
    onInit: ()=>{
        $(".hamburger").on("click", function() {
            $(this).toggleClass("active")
        })
    }
})

