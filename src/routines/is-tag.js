export const isTag = (val) => /^<\/?[\w\s="/.':;#-\/\?]+>/gi.test(val)
