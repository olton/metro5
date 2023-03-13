import * as Routines from "./routines"
import {Metro5} from "./core/metro"

// globalThis.Metro5 = Metro5
globalThis.Metro = new Metro5()
globalThis.Metro5.Routines = Routines

import * as CommonCss from "./common"
import * as Components from "./components"
