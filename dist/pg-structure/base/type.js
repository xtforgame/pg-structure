"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_object_1 = __importDefault(require("./db-object"));
class Type extends db_object_1.default {
    /** @ignore */
    constructor(args) {
        super(args);
        this.oid = args.oid;
        this.arrayOid = args.arrayOid;
        this.classOid = args.classOid;
        this.schema = args.schema;
        this.internalName = args.internalName;
        this.shortName = args.shortName || args.name;
        this.category = args.category;
        this.hasLength = args.hasLength || false;
        this.hasScale = args.hasScale || false;
        this.hasPrecision = args.hasPrecision || false;
    }
    /**
     * Full name of the object with '.' notation including [[Schema]] name.
     *
     * @example
     * const fullName = type.fullName; // public.phone_number
     */
    get fullName() {
        return `${this.schema.name}.${this.name}`;
    }
}
exports.default = Type;
//# sourceMappingURL=type.js.map