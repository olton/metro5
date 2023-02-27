export const copy2clipboard = (text, success, fail) => {
    navigator.clipboard.writeText(text).then(function() {
        if (typeof success === "function") {
            success.apply(null, [text])
        }
    }, function(err) {
        if (typeof fail === "function") {
            fail.apply(null, [text])
        }
    });
}