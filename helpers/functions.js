export const wrapRoute = fn => (...args) => Promise
    .resolve(fn(...args))
    .catch(args[2])