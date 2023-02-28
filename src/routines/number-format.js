export const numberFormat = function(num, decimalLength = 0, wholeLength = 0, thousandDivider = ", ", decimalDivider = ".") {
    const re = '\\d(?=(\\d{' + (wholeLength || 3) + '})+' + (decimalLength > 0 ? '\\D' : '$') + ')',
        _num = num.toFixed(Math.max(0, ~~decimalLength));

    return (decimalDivider ? _num.replace('.', decimalDivider) : _num).replace(new RegExp(re, 'g'), '$&' + (thousandDivider || ','));
};
