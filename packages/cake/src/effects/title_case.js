import {REGEXP_EXTENDED_ASCII, REGEXP_LATIN_WORD, REGEXP_WORD} from "../helpers/regexp/regexp";
import {isNull} from "@metro5/utils";
import capitalize from "./capitalize";
import lower from "./lower_case";
import toStr from "../helpers/string/to_string";

export default function title(s, noSplit){
    let _s = toStr(s)
    const regexp = REGEXP_EXTENDED_ASCII.test(_s) ? REGEXP_LATIN_WORD : REGEXP_WORD;
    const noSplitArray = Array.isArray(noSplit) ? noSplit : isNull(noSplit) ?  [] : noSplit.split();

    return s.replace(regexp, (w, i) => {
        const isNoSplit = i && noSplitArray.includes(_s[i - 1]);
        return isNoSplit ? lower(w) : capitalize(w);
    })
}
