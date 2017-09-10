export const DB = process.env.DB || (() => { throw new Error(); })();
