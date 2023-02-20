export const shuffleArray = (a = []) => {
    let _a = [...a];
    let i = _a.length, t, r

    while (0 !== i) {
        r = Math.floor(Math.random() * i)
        i -= 1
        t = _a[i]
        _a[i] = _a[r]
        _a[r] = t
    }

    return _a;
}