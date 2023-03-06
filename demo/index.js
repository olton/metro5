import {Metro5} from "../src/core/metro"
import "../icons/mif.css"
import * as CommonCss from "../src/common"
import * as Components from "../src/components"
import {Validator} from "../src/components";

globalThis.Metro = new Metro5({
    removeCloakTimeout: 1000,
    onInit: ()=>{
        $(".hamburgers .hamburger").on("click", function() {
            $(this).toggleClass("active")
        })
        // console.log(Validator.validate("123", "length=5 integer"))
    }
})

