import { Client, ClientConfig } from "pg";
import Db from "./pg-structure/db";
import { RelationNameFunctions, BuiltinRelationNameFunctions } from "./types";
export { default as Column } from "./pg-structure/column";
export { default as Db } from "./pg-structure/db";
export { default as Index } from "./pg-structure";
export { default as Schema } from "./pg-structure/schema";
export { default as Constraint } from "./pg-structure/base/constraint";
export { default as DbObject } from "./pg-structure/base/db-object";
export { default as Entity } from "./pg-structure/base/entity";
export { default as Relation } from "./pg-structure/base/relation";
export { default as Type } from "./pg-structure/base/type";
export { default as CheckConstraint } from "./pg-structure/constraint/check-constraint";
export { default as ExclusionConstraint } from "./pg-structure/constraint/exclusion-constraint";
export { default as ForeignKey } from "./pg-structure/constraint/foreign-key";
export { default as PrimaryKey } from "./pg-structure/constraint/primary-key";
export { default as UniqueConstraint } from "./pg-structure/constraint/unique-constraint";
export { default as MaterializedView } from "./pg-structure/entity/materialized-view";
export { default as Sequence } from "./pg-structure/entity/sequence";
export { default as Table } from "./pg-structure/entity/table";
export { default as View } from "./pg-structure/entity/view";
export { default as M2MRelation } from "./pg-structure/relation/m2m-relation";
export { default as M2ORelation } from "./pg-structure/relation/m2o-relation";
export { default as O2MRelation } from "./pg-structure/relation/o2m-relation";
export { default as BaseType } from "./pg-structure/type/base-type";
export { default as CompositeType } from "./pg-structure/type/composite-type";
export { default as Domain } from "./pg-structure/type/domain";
export { default as EnumType } from "./pg-structure/type/enum-type";
export { default as PseudoType } from "./pg-structure/type/pseudo-type";
export { default as RangeType } from "./pg-structure/type/range-type";
export { default as Func } from "./pg-structure/base/func";
export { default as NormalFunction } from "./pg-structure/function/normal-function";
export { default as Procedure } from "./pg-structure/function/procedure";
export { default as AggregateFunction } from "./pg-structure/function/aggregate-function";
export { default as FunctionArgument } from "./pg-structure/function-argument";
export { default as WindowFunction } from "./pg-structure/function/window-function";
export * from "./types/index";
/** @ignore */
interface Options {
    name?: string;
    includeSchemas?: string | string[];
    excludeSchemas?: string | string[];
    includeSystemSchemas?: boolean;
    /**
     * Character to separate {@link ForeignKey.sourceAlias source alias} and {@link ForeignKey.targetAlias target alias}
     * in {@link ForeignKey foreign key} name.
     */
    foreignKeyAliasSeparator?: string;
    foreignKeyAliasTargetFirst?: boolean;
    /**
     * Optional function to generate names for relationships. If not provided, default naming functions are used.
     * All necessary information such as {@link Table table} names, {@link Column columns}, {@link ForeignKey foreign key},
     * {@link DbObject.commentData comment data} can be accessed via passed {@link Relation relation} parameter.
     *
     * It is also possible to use one of the builtin naming functions: `short`, `descriptive`.
     *
     * @example
     * const config = {
     *   relationNameFunctions: {
     *     o2m: (relation) => some_func(relation.foreignKey.name),
     *     m2o: (relation) => some_func(relation.foreignKey.name),
     *     m2m: (relation) => some_func(relation.foreignKey.name),
     *   },
     * }
     *
     * const config2 = {
     *   relationNameFunctions: "short",
     * }
     */
    relationNameFunctions?: RelationNameFunctions | BuiltinRelationNameFunctions;
    /**
     * Tag name to extract JSON data from from database object's comments. For example by default JSON data between `[pg-structure][/pg-structure]`
     * is available imn database objects. Data can be retrieved with {@link DbObject.commentData commentData} method.
     *
     * @example
     * const config = {
     *   commentDataToken: "pg-structure"
     * }
     *
     * // Assuming `[pg-structure]{ level: 3 }[/pg-structure]` is written in database table comment/description.
     * const someData = db.get("public.account").commentData; // { level: 3 }
     */
    commentDataToken?: string;
    /** Prevents pg-strucrture to close given database connection. */
    keepConnection?: boolean;
}
/**
 * Creates and returns [[Db]] object which represents given database's structure. It is possible to include or exclude some schemas
 * using options. Please note that if included schemas contain references (i.e. foreign key to other schema or type in other schema)
 * to non-included schema, throws exception.
 *
 * @param pgClientOrConfig is connection string or [node-postgres client](https://node-postgres.com/api/client) or [node-postgres client](https://node-postgres.com/api/client) configuration.
 * @param name is name of the database. This is inferred if possible from client or connection string.
 * @param commentDataToken is tag name to extract JSON data from from database object's comments. For example by default JSON data between `[pg-structure][/pg-structure]` is available imn database objects. Data can be retrieved with {@link DbObject.commentData commentData} method.
 * @param includeSchemas is pattern similar to `SQL LIKE` (i.e `public_%`) or list of schemas to include.
 * @param excludeSchemas is pattern similar to `SQL LIKE` (i.e `public_%`) or list of schemas to exclude.
 * @param includeSystemSchemas is whether to include PostgreSQL system schemas (i.e. `pg_catalog`) from database.
 * @param foreignKeyAliasSeparator is character to separate {@link ForeignKey.sourceAlias source alias} and {@link ForeignKey.targetAlias target alias} in {@link ForeignKey foreign key} name. For example: `prime_color,product`.
 * @param foreignKeyAliasTargetFirst is whether first part of the foreign key aliases contains target alias (i.e `company_employees`) or source alias (i.e. `employee_company`).
 * @param relationNameFunctions Optional functions to generate names for relationships. If not provided, default naming functions are used. All necessary information such as {@link Table table} names, {@link Column columns}, {@link ForeignKey foreign key}, {@link DbObject.commentData comment data} can be accessed via passed {@link Relation relation} parameter. It is also possible to use one of the builtin naming functions such as `short`, `descriptive`.
 * @returns [[Db]] object which represents given database's structure.
 */
export default function pgStructure(pgClientOrConfig: Client | ClientConfig | string, { name, commentDataToken, includeSchemas, excludeSchemas, includeSystemSchemas, foreignKeyAliasSeparator, foreignKeyAliasTargetFirst, relationNameFunctions, keepConnection, }?: Options): Promise<Db>;
/**
 * Deserializes given data to create [[Db]] object.
 *
 * @param serializedData is serialized data of the `Db` object.
 * @returns [[Db]] object for given serialized data.
 * @example
 * import pgStructure, { deserialize } from "pg-structure";
 * const db = await pgStructure({ database: "db", user: "u", password: "pass" });
 * const serialized = db.serialize();
 * const otherDb = deserialize(serialized);
 */
export declare function deserialize(serializedData: string): Db;
//# sourceMappingURL=index.d.ts.map