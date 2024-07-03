const COLORS = {
    reset: "\x1b[0m",
    red: "\x1b[31m",
    green: "\x1b[32m",
    yellow: "\x1b[33m",
};
export class Logger {
    static format(msg, prefix = "") {
        const start = prefix;
        const end = prefix ? COLORS.reset : "";
        return `${start}astro-compressor:${end} ${msg}`;
    }
    static info(msg) {
        console.info(this.format(msg));
    }
    static success(msg) {
        console.log(this.format(msg, COLORS.green));
    }
    static warn(msg) {
        console.warn(this.format(msg, COLORS.yellow));
    }
    static error(msg) {
        console.error(this.format(msg, COLORS.red));
    }
}
//# sourceMappingURL=logger.js.map