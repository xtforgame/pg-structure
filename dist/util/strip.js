"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Strips given string from source string.
 *
 * @ignore
 * @param source is the source string to be cleaned.
 * @param prefix is the string to delete.
 * @returns cleaned string.
 */
function strip(source, strings) {
    let result = source;
    const stringArray = Array.isArray(strings) ? strings : [strings];
    stringArray.forEach((string) => {
        const prefixRx = new RegExp(`^${string}[_\\s-]+`);
        const middleRx = new RegExp(`${string}[_\\s-]+`);
        const suffixRx = new RegExp(`[_\\s-]*${string}$`);
        if (result.match(prefixRx)) {
            result = result.replace(prefixRx, "");
        }
        else if (result.match(middleRx)) {
            result = result.replace(middleRx, "");
        }
        else {
            result = result.replace(suffixRx, "");
        }
    });
    return result;
}
exports.default = strip;
//# sourceMappingURL=strip.js.map