export const DB = process.env.db || (() => { throw new Error(); })();
