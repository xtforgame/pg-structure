import O2MRelation from "../pg-structure/relation/o2m-relation";
import M2ORelation from "../pg-structure/relation/m2o-relation";
import M2MRelation from "../pg-structure/relation/m2m-relation";
export * from "./json";
/**
 * Actions performed when the data in the foreign key referenced columns is changed.
 */
export declare const enum Action {
    Cascade = "CASCADE",
    SetNull = "SET NULL",
    SetDefault = "SET DEFAULT",
    Restrict = "RESTRICT",
    NoAction = "NO ACTION"
}
/**
 * A value inserted into the referencing column(s) is matched against the values of the referenced table and referenced columns using the given match type.
 */
export declare enum MatchType {
    Full = "FULL",
    Partial = "PARTIAL",
    Simple = "SIMPLE"
}
/**
 * Case type for database object names.
 */
export declare const enum CaseType {
    CamelCase = "camelCase",
    SnakeCase = "snakeCase"
}
/** PostgreSQL system-defined values of typcategory. See [pg_type](https://www.postgresql.org/docs/current/catalog-pg-type.html) in PostgreSQL docs. */
export declare type TypeCategory = "A" | "B" | "C" | "D" | "E" | "G" | "I" | "N" | "P" | "R" | "S" | "T" | "U" | "V" | "X";
/**
 * Type for functions to generate names for relations. All necessary information such as {@link Table table} names,
 * {@link Column columns}, {@link ForeignKey foreign key}, {@link DbObject.commentData comment data} can be accessed via passed {@link Relation relation} parameter.
 *
 * @example
 * const config = {
 *   relationNameFunctions: {
 *     o2m: (relation) => some_function(relation.targetTable.name),
 *     m2o: (relation) => some_function(relation.targetTable.name),
 *     m2m: (relation) => some_function(relation.targetTable.name),
 *   },
 * }
 */
export declare type RelationNameFunctions = {
    o2m: (relation: O2MRelation) => string;
    m2o: (relation: M2ORelation) => string;
    m2m: (relation: M2MRelation) => string;
};
/**
 * Name of the builtin relation name function.
 */
export declare type BuiltinRelationNameFunctions = "short" | "descriptive";
/**
 * Type to store a relation name collision. Keys are relation names and values are information about relations with that name.
 */
export declare type RelationNameCollision = {
    [relationName: string]: string[];
};
/**
 * Type to store relation name collisions by tables.
 *
 * @example
 * {
 *   'public.contact': {
 *     m2o: [],
 *     o2m: [
 *       {
 *         carts: [
 *           '[public.contact]――― cart_contact ――⥷ [public.cart]',
 *           '[public.contact]――― other_cart_contact ――⥷ [other_schema.cart]'
 *         ]
 *       }
 *     ],
 *     m2m: []
 *    }
 * }
 */
export declare type CollisionsByTable = {
    [tableFullName: string]: {
        m2o: RelationNameCollision[];
        o2m: RelationNameCollision[];
        m2m: RelationNameCollision[];
    };
};
/** Volatility of the PostgreSQL function. */
export declare type Volatility = "immutable" | "stable" | "volatile";
/** Parallel safety of the PostgreSQL function. */
export declare type ParallelSafety = "safe" | "unsafe" | "restricted";
/** Modes of the PostgreSQL function arguments. */
export declare type ArgumentMode = "in" | "inout" | "out" | "variadic" | "table";
//# sourceMappingURL=index.d.ts.map