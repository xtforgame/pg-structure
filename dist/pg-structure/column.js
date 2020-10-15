"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const indexable_array_1 = __importDefault(require("indexable-array"));
const src_1 = require("@typescript-plus/fast-memoize-decorator/dist/src");
const db_object_1 = __importDefault(require("./base/db-object"));
const entity_1 = __importDefault(require("./base/entity"));
const table_1 = __importDefault(require("./entity/table"));
const helper_1 = require("../util/helper");
const view_1 = __importDefault(require("./entity/view"));
/**
 * Class which represent a column. Provides attributes and methods for details of the column.
 */
class Column extends db_object_1.default {
    /** @ignore */
    constructor(args) {
        super(args);
        this.parent = args.parent;
        const { schema: typeSchema, typeName, length, precision, scale } = helper_1.parseSQLType(this.db, args.sqlType);
        this.notNull = args.notNull;
        // if (typeName === "numeric") console.log(args.name);
        this.type =
            typeSchema.typesIncludingEntities.getMaybe(typeName, { key: "internalName" }) || typeSchema.typesIncludingEntities.get(typeName);
        this.length = length;
        this.precision = precision;
        this.scale = scale;
        this.arrayDimension = args.arrayDimension || 0;
        this.defaultWithTypeCast = args.defaultWithTypeCast;
        this.attributeNumber = args.attributeNumber;
    }
    /**
     * {@link Entity} this column belongs to if it belongs to a {@link Table table} or {@link View view}.
     *
     * @example
     * const entity = column.entity; // Entity instance
     */
    get entity() {
        return this.parent instanceof entity_1.default ? this.parent : undefined;
    }
    /**
     * {@link Table} this column belongs to if it belongs to a {@link Table table}.
     *
     * @example
     * const table = column.table; // Table instance
     */
    get table() {
        return this.parent instanceof table_1.default ? this.parent : undefined;
    }
    /**
     * {@link View} this column belongs to if it belongs to a {@link View view}.
     *
     * @example
     * const table = column.view; // Table instance
     */
    get view() {
        return this.parent instanceof view_1.default ? this.parent : undefined;
    }
    /**
     * Full name of the object with '.' notation including [[Schema]] name.
     *
     * @example
     * const fullName = column.fullName; // public.member.name
     */
    get fullName() {
        return `${this.parent.fullName}.${this.name}`;
    }
    /** Whether this column has `nextval()` default value or one of `serial` (auto incremented) types. */
    get isSerial() {
        return helper_1.isSerial(this.defaultWithTypeCast);
    }
    /**
     * Default value without typecast. Default values includes single quotes except sql functions and numeric values.
     *
     * Numeric values are returned as string too. Please see: https://github.com/brianc/node-postgres/issues/1300
     *
     * @see [[Column.defaultWithTypeCast]] for default values with typecast as returned by PostgreSQL
     * @example
     * const table = db('crm').schema('public').table('contact');
     * const defaultName = table.get("name").default;                     // "'George'"
     * const defaultNameWithCast = table.get("name").defaultWithTypeCast; // "'George'::character varying"
     * const defaultAge = table.get("age").default;                       // 20
     * const defaultStamp = table.get("created_at").default;              // "now()"
     */
    get default() {
        return helper_1.replaceTypeCast(this.defaultWithTypeCast);
    }
    /**
     * [[IndexableArray]] of {@link ForeignKey foreign keys} which column is part of.
     */
    get foreignKeys() {
        return this.entity instanceof table_1.default
            ? this.entity.foreignKeys.filter((e) => e.columns.has(this.name))
            : indexable_array_1.default.throwingFrom([], "name");
    }
    /**
     * IndexableArray of {@link Index indexes}, which column is part of.
     */
    get indexes() {
        return this.entity instanceof table_1.default
            ? this.entity.indexes.filter((e) => e.columns.has(this.name))
            : indexable_array_1.default.throwingFrom([], "name");
    }
    /**
     * Whether this column is part of a {@link ForeignKey foreign key}.
     * Please note that a foreign key may contain more than one column and a column may part of more than one
     * {@link ForeignKey foreign key}.
     */
    get isForeignKey() {
        return this.foreignKeys.length > 0;
    }
    /**
     * Whether column is part of a {@link PrimaryKey primary key}. Please note that a primary key may contain more than one column.
     */
    get isPrimaryKey() {
        return this.table instanceof table_1.default && this.table.primaryKey ? this.table.primaryKey.columns.has(this.name) : false;
    }
    /**
     * All referenced columns in all {@link ForeignKey foreign keys} by this column.
     */
    get referencedColumns() {
        return (this.foreignKeys
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            .map((fk) => fk.referencedColumnsBy.find((by) => by.column === this).references)
            .filter(Boolean));
    }
    /**
     * {@link Schema} this column belongs to.
     */
    get schema() {
        return this.parent.schema;
    }
    /**
     * [[IndexableArray]] of unique {@link Index indexes}, which column is part of. Excludes primary key indexes. PostgreSQL already creates a unique index for unique
     * {@link Constraint constraints}. So there is no need to look for unique constraints which will result duplicates.
     *
     * @see [[Column.uniqueIndexes]] for all unique indexes including primary key indexes.
     */
    get uniqueIndexesNoPk() {
        return this.uniqueIndexes.filter((e) => !e.isPrimaryKey);
    }
    /**
     * [[IndexableArray]] of unique {@link Index indexes}, which column is part of. PostgreSQL already creates a unique index for unique
     * {@link Constraint constraints}. So there is no need to look for unique constraints which will result duplicates.
     *
     * @see [[Column.uniqueIndexesNoPk]] for unique indexes excluding primary key indexes.
     */
    get uniqueIndexes() {
        return this.indexes.filter((e) => e.isUnique);
    }
}
__decorate([
    src_1.Memoize(),
    __metadata("design:type", indexable_array_1.default),
    __metadata("design:paramtypes", [])
], Column.prototype, "foreignKeys", null);
__decorate([
    src_1.Memoize(),
    __metadata("design:type", indexable_array_1.default),
    __metadata("design:paramtypes", [])
], Column.prototype, "indexes", null);
__decorate([
    src_1.Memoize(),
    __metadata("design:type", indexable_array_1.default),
    __metadata("design:paramtypes", [])
], Column.prototype, "referencedColumns", null);
__decorate([
    src_1.Memoize(),
    __metadata("design:type", indexable_array_1.default),
    __metadata("design:paramtypes", [])
], Column.prototype, "uniqueIndexesNoPk", null);
__decorate([
    src_1.Memoize(),
    __metadata("design:type", indexable_array_1.default),
    __metadata("design:paramtypes", [])
], Column.prototype, "uniqueIndexes", null);
exports.default = Column;
//# sourceMappingURL=column.js.map