export const to_array = (str, sep = ",") => str.split(",").filter( v => v.trim() ).map( v => +v )