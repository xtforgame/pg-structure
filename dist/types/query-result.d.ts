import { TypeCategory, Volatility, ParallelSafety } from "./index";
/** @ignore */
export declare type EntityTypeLetter = "r" | "i" | "S" | "t" | "v" | "m" | "c" | "f" | "p" | "I";
/** @ignore */
export declare type TypeKindLetter = "b" | "c" | "d" | "e" | "p" | "r";
/** @ignore */
export declare type ActionLetter = "a" | "r" | "c" | "n" | "d";
/** @ignore */
export declare type MatchTypeLetter = "f" | "p" | "s";
/** @ignore */
export declare type ConstrainTypeLetter = "c" | "f" | "p" | "u" | "t" | "x";
/** ignore */
export declare type RelationKindLetter = "r" | "i" | "s" | "t" | "v" | "m" | "c" | "f" | "p" | "I";
/** @ignore */
export declare type FunctionKindLetter = "f" | "p" | "a" | "w";
/** @ignore */
export declare type ArgumentModeLetter = "i" | "o" | "b" | "v" | "t";
/** @ignore */
export interface SchemaQueryResult {
    oid: number;
    name: string;
    comment: string | null;
}
/** @ignore */
export interface TypeQueryResult {
    oid: number;
    arrayOid: number;
    schemaOid: number;
    classOid: number;
    kind: TypeKindLetter;
    category: TypeCategory;
    notNull: boolean;
    default: string | number | null;
    sqlType: string | null;
    name: string;
    values: string[];
    comment: string | null;
    arrayDimension: number;
    relationKind?: RelationKindLetter;
}
/** @ignore */
export interface EntityQueryResult {
    oid: number;
    schemaOid: number;
    kind: EntityTypeLetter;
    name: string;
    comment: string | null;
}
/** @ignore */
export interface ColumnQueryResult {
    parentOid: number;
    typeOid: number;
    attributeNumber: number;
    parentKind: EntityTypeLetter;
    database: string;
    name: string;
    defaultWithTypeCast: string;
    notNull: boolean;
    sqlType: string;
    arrayDimension: number;
    position: number;
    comment: string | null;
}
/** @ignore */
export interface IndexQueryResult {
    oid: number;
    tableOid: number;
    name: string;
    isUnique: boolean;
    isPrimaryKey: boolean;
    isExclusion: boolean;
    /** This is an array of indnatts values that indicate which table columns this index indexes. For example a value of 1 3 would mean that the first and the third table columns make up the index entries. Key columns come before non-key (included) columns. A zero in this array indicates that the corresponding index attribute is an expression over the table columns, rather than a simple column reference.  */
    columnPositions: number[];
    /** Expression trees (in nodeToString() representation) for index attributes that are not simple column references. This is a list with one element for each zero entry in indkey. Null if all index attributes are simple references. */
    indexExpressions: string[];
    /** Expression tree (in nodeToString() representation) for partial index predicate. Null if not a partial index. */
    partialIndexExpression: string | null;
    comment: string | null;
}
/** @ignore */
export interface ConstraintQueryResult {
    /** The table this constraint is on; 0 if not a table constraint */
    tableOid: number;
    /** The index supporting this constraint, if it's a unique, primary key, foreign key, or exclusion constraint; else 0 */
    indexOid: number;
    /** The domain this constraint is on; 0 if not a domain constraint */
    typeOid: number;
    kind: ConstrainTypeLetter;
    name: string;
    /** If a table constraint (including foreign keys, but not constraint triggers), list of the constrained columns */
    constrainedColumnPositions: number[];
    /** If a foreign key, list of the referenced columns */
    referencedColumnPositions: number[];
    onUpdate: ActionLetter;
    onDelete: ActionLetter;
    matchType: MatchTypeLetter;
    checkConstraintExpression: string;
    comment: string | null;
}
/** @ignore */
export interface FunctionQueryResult {
    oid: number;
    schemaOid: number;
    name: string;
    kind: FunctionKindLetter;
    source: string;
    language: string;
    estimatedCost: number;
    estimatedRows: number;
    isLeakProof: boolean;
    isStrict: boolean;
    parallelSafety: ParallelSafety;
    volatility: Volatility;
    returnType: number;
    returnsSet: boolean;
    variadicArgumentType: number;
    argumentTypes: number[];
    argumentNames: string[] | null;
    argumentModes: string | null;
    signature: string;
    comment: string;
}
/** @ignore */
export declare type QueryResults = [SchemaQueryResult[], SchemaQueryResult[], TypeQueryResult[], EntityQueryResult[], ColumnQueryResult[], IndexQueryResult[], ConstraintQueryResult[], FunctionQueryResult[]];
/** @ignore */
export interface SQLFileResult {
    type: TypeQueryResult[];
    entity: EntityQueryResult[];
    column: ColumnQueryResult[];
    index: IndexQueryResult[];
    constraint: ConstraintQueryResult[];
    function: FunctionQueryResult[];
}
//# sourceMappingURL=query-result.d.ts.map