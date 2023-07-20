export const nearest = function(val, precision, down = true){
    val /= precision;
    val = Math[down ? 'floor' : 'ceil'](val) * precision;
    return val;
}