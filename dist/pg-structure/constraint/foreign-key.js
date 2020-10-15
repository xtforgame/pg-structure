"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const indexable_array_1 = __importDefault(require("indexable-array"));
const constraint_1 = __importDefault(require("../base/constraint"));
/**
 * Class which represent a foreign key. Provides attributes and methods for details of the foreign key.
 */
class ForeignKey extends constraint_1.default {
    /** @ignore */
    constructor(args) {
        super(args);
        this.onUpdate = args.onUpdate;
        this.onDelete = args.onDelete;
        this.matchType = args.matchType;
        this.index = args.index;
        this.columns = indexable_array_1.default.throwingFrom(args.columns, "name");
        this.table = args.table;
    }
    /**
     * This is [[Table]] instance this {@link ForeignKey foreign key} refers to.
     */
    get referencedTable() {
        // it's not possible to have an foreign key on a materialized view, so
        // `index.table` will always be defined
        return this.index.table;
    }
    /**
     * {@link IndexableArray Indexable array} of {@link Column columns} this {@link ForeignKey foreign key} refers. {@link Column Columns} are in order their ordinal position
     * within the {@link ForeignKey foreign key}.
     */
    get referencedColumns() {
        return this.index.columns;
    }
    /**
     * Array of columns this {@link ForeignKey foreign key} has and refers to.
     */
    get referencedColumnsBy() {
        return this.columns.mapToArray((column, i) => ({ column, references: this.referencedColumns[i] }));
    }
    /**
     * List of other foreign keys which has same source table and target table.
     */
    get correspondingForeignKeys() {
        return this.table.getForeignKeysTo(this.referencedTable).filter((fk) => fk !== this);
    }
    /**
     * Full name of the {@link Constraint constraint} including table name.
     */
    get fullName() {
        return `${this.schema.name}.${this.table.name}.${this.name}`;
    }
    /**
     * [[Schema]] of the {@link Constraint constraint}'s table defined in.
     */
    get schema() {
        return this.table.schema;
    }
}
exports.default = ForeignKey;
//# sourceMappingURL=foreign-key.js.map