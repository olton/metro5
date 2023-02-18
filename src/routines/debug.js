export const debug = (...args) => {
    !args.length ? console.log('Hi!') : args.length === 1 ? console.log(JSON.stringify(args[0], null, 2)) : console.log(...args)
}