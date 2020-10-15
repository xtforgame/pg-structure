"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-explicit-any */
const pg_1 = require("pg");
const pg_connection_string_1 = require("pg-connection-string");
const helper_1 = require("./util/helper");
const db_1 = __importDefault(require("./pg-structure/db"));
const schema_1 = __importDefault(require("./pg-structure/schema"));
const domain_1 = __importDefault(require("./pg-structure/type/domain"));
const enum_type_1 = __importDefault(require("./pg-structure/type/enum-type"));
const base_type_1 = __importDefault(require("./pg-structure/type/base-type"));
const composite_type_1 = __importDefault(require("./pg-structure/type/composite-type"));
const table_1 = __importDefault(require("./pg-structure/entity/table"));
const view_1 = __importDefault(require("./pg-structure/entity/view"));
const materialized_view_1 = __importDefault(require("./pg-structure/entity/materialized-view"));
const sequence_1 = __importDefault(require("./pg-structure/entity/sequence"));
const column_1 = __importDefault(require("./pg-structure/column"));
const pg_structure_1 = __importDefault(require("./pg-structure"));
const primary_key_1 = __importDefault(require("./pg-structure/constraint/primary-key"));
const unique_constraint_1 = __importDefault(require("./pg-structure/constraint/unique-constraint"));
const check_constraint_1 = __importDefault(require("./pg-structure/constraint/check-constraint"));
const exclusion_constraint_1 = __importDefault(require("./pg-structure/constraint/exclusion-constraint"));
const foreign_key_1 = __importDefault(require("./pg-structure/constraint/foreign-key"));
const types_1 = require("./types");
const range_type_1 = __importDefault(require("./pg-structure/type/range-type"));
const normal_function_1 = __importDefault(require("./pg-structure/function/normal-function"));
const procedure_1 = __importDefault(require("./pg-structure/function/procedure"));
const aggregate_function_1 = __importDefault(require("./pg-structure/function/aggregate-function"));
const window_function_1 = __importDefault(require("./pg-structure/function/window-function"));
const pseudo_type_1 = __importDefault(require("./pg-structure/type/pseudo-type"));
var column_2 = require("./pg-structure/column");
exports.Column = column_2.default;
var db_2 = require("./pg-structure/db");
exports.Db = db_2.default;
var pg_structure_2 = require("./pg-structure");
exports.Index = pg_structure_2.default;
var schema_2 = require("./pg-structure/schema");
exports.Schema = schema_2.default;
var constraint_1 = require("./pg-structure/base/constraint");
exports.Constraint = constraint_1.default;
var db_object_1 = require("./pg-structure/base/db-object");
exports.DbObject = db_object_1.default;
var entity_1 = require("./pg-structure/base/entity");
exports.Entity = entity_1.default;
var relation_1 = require("./pg-structure/base/relation");
exports.Relation = relation_1.default;
var type_1 = require("./pg-structure/base/type");
exports.Type = type_1.default;
var check_constraint_2 = require("./pg-structure/constraint/check-constraint");
exports.CheckConstraint = check_constraint_2.default;
var exclusion_constraint_2 = require("./pg-structure/constraint/exclusion-constraint");
exports.ExclusionConstraint = exclusion_constraint_2.default;
var foreign_key_2 = require("./pg-structure/constraint/foreign-key");
exports.ForeignKey = foreign_key_2.default;
var primary_key_2 = require("./pg-structure/constraint/primary-key");
exports.PrimaryKey = primary_key_2.default;
var unique_constraint_2 = require("./pg-structure/constraint/unique-constraint");
exports.UniqueConstraint = unique_constraint_2.default;
var materialized_view_2 = require("./pg-structure/entity/materialized-view");
exports.MaterializedView = materialized_view_2.default;
var sequence_2 = require("./pg-structure/entity/sequence");
exports.Sequence = sequence_2.default;
var table_2 = require("./pg-structure/entity/table");
exports.Table = table_2.default;
var view_2 = require("./pg-structure/entity/view");
exports.View = view_2.default;
var m2m_relation_1 = require("./pg-structure/relation/m2m-relation");
exports.M2MRelation = m2m_relation_1.default;
var m2o_relation_1 = require("./pg-structure/relation/m2o-relation");
exports.M2ORelation = m2o_relation_1.default;
var o2m_relation_1 = require("./pg-structure/relation/o2m-relation");
exports.O2MRelation = o2m_relation_1.default;
var base_type_2 = require("./pg-structure/type/base-type");
exports.BaseType = base_type_2.default;
var composite_type_2 = require("./pg-structure/type/composite-type");
exports.CompositeType = composite_type_2.default;
var domain_2 = require("./pg-structure/type/domain");
exports.Domain = domain_2.default;
var enum_type_2 = require("./pg-structure/type/enum-type");
exports.EnumType = enum_type_2.default;
var pseudo_type_2 = require("./pg-structure/type/pseudo-type");
exports.PseudoType = pseudo_type_2.default;
var range_type_2 = require("./pg-structure/type/range-type");
exports.RangeType = range_type_2.default;
var func_1 = require("./pg-structure/base/func");
exports.Func = func_1.default;
var normal_function_2 = require("./pg-structure/function/normal-function");
exports.NormalFunction = normal_function_2.default;
var procedure_2 = require("./pg-structure/function/procedure");
exports.Procedure = procedure_2.default;
var aggregate_function_2 = require("./pg-structure/function/aggregate-function");
exports.AggregateFunction = aggregate_function_2.default;
var function_argument_1 = require("./pg-structure/function-argument");
exports.FunctionArgument = function_argument_1.default;
var window_function_2 = require("./pg-structure/function/window-function");
exports.WindowFunction = window_function_2.default;
__export(require("./types/index"));
/**
 * Returns database name.
 *
 * @ignore
 * @param pgClientOrConfig is input to get database name from.
 * @returns database name.
 */
/* istanbul ignore next */
function getDatabaseName(pgClientOrConfig) {
    if (pgClientOrConfig instanceof pg_1.Client) {
        return "database";
    }
    return (typeof pgClientOrConfig === "string" ? pg_connection_string_1.parse(pgClientOrConfig).database : pgClientOrConfig.database) || "database";
}
/**
 * Returns list of schames in database. If no patterns are given returns all schemas except system schemas.
 * Patterns are feeded to `LIKE` operator of SQL, so `%` and `_` may be used.
 *
 * @ignore
 * @param client is pg client.
 * @param include is pattern to be used in SQL query `LIKE` part.
 * @param exclude is pattern to be used in SQL query `NOT LIKE` part.
 * @param system is whether to include system schemas in result.
 * @returns array of objects describing schemas.
 */
async function getSchemas(client, { include = [], exclude = [], system = false }) {
    const where = ["NOT pg_is_other_temp_schema(oid)", "nspname <> 'pg_toast'"];
    const whereInclude = [];
    const parameters = [];
    const includedPatterns = include.concat(system && include.length > 0 ? ["information_schema", "pg_%"] : []);
    const excludedPatterns = exclude.concat(system ? [] : ["information_schema", "pg_%"]);
    includedPatterns.forEach((pattern, i) => {
        whereInclude.push(`nspname LIKE $${i + 1}`); // nspname LIKE $1
        parameters.push(pattern);
    });
    if (whereInclude.length > 0)
        where.push(`(${whereInclude.join(" OR ")})`);
    excludedPatterns.forEach((pattern, i) => {
        where.push(`nspname NOT LIKE $${i + include.length + 1}`); // nspname NOT LIKE $2
        parameters.push(pattern);
    });
    const whereQuery = `WHERE ${where.join(" AND ")}`;
    const sql = `SELECT oid, nspname AS name, obj_description(oid, 'pg_namespace') AS comment FROM pg_namespace ${whereQuery} ORDER BY nspname`;
    const result = await client.query(sql, parameters);
    return result.rows;
}
/**
 * Returns list of system schames required by pg-structure.
 * Patterns are feeded to `LIKE` operator of SQL, so `%` and `_` may be used.
 *
 * @ignore
 * @param client is pg client.
 * @returns array of objects describing schemas.
 */
async function getSystemSchemas(client) {
    const sql = `SELECT oid, nspname AS name, obj_description(oid, 'pg_namespace') AS comment FROM pg_namespace WHERE nspname IN ('pg_catalog') ORDER BY nspname`;
    return (await client.query(sql)).rows;
}
/**
 * Adds system schemas required by pg-structure.
 *
 * @ignore
 * @param db is Db object.
 */
function addSystemSchemas(db, rows) {
    rows.forEach((row) => db.systemSchemas.push(new schema_1.default({ ...row, db })));
}
/**
 * Adds schema instances to database.
 *
 * @ignore
 * @param db is Db object.
 */
function addSchemas(db, rows) {
    rows.forEach((row) => db.schemas.push(new schema_1.default({ ...row, db })));
}
const builtinTypeAliases = {
    int2: { name: "smallint" },
    int4: { name: "integer", shortName: "int" },
    int8: { name: "bigint" },
    numeric: { internalName: "decimal", hasPrecision: true, hasScale: true },
    float4: { name: "real" },
    float8: { name: "double precision" },
    varchar: { name: "character varying", hasLength: true },
    char: { name: "character", hasLength: true },
    timestamp: { name: "timestamp without time zone", hasPrecision: true },
    timestamptz: { name: "timestamp with time zone", hasPrecision: true },
    time: { name: "time without time zone", hasPrecision: true },
    timetz: { name: "time with time zone", hasPrecision: true },
    interval: { hasPrecision: true },
    bool: { name: "boolean" },
    bit: { hasLength: true },
    varbit: { name: "bit varying", hasLength: true },
};
/**
 * Adds types to database.
 *
 * @ignore
 * @param db  is DB object
 * @param rows are query result of types to be added.
 */
function addTypes(db, rows) {
    const typeKinds = { d: domain_1.default, e: enum_type_1.default, b: base_type_1.default, c: composite_type_1.default, r: range_type_1.default, p: pseudo_type_1.default }; // https://www.postgresql.org/docs/9.5/catalog-pg-type.html
    rows.forEach((row) => {
        const schema = db.systemSchemas.getMaybe(row.schemaOid, { key: "oid" }) || db.schemas.get(row.schemaOid, { key: "oid" });
        const builtinTypeData = builtinTypeAliases[row.name] ? { internalName: row.name, ...builtinTypeAliases[row.name] } : {};
        const kind = row.kind;
        const type = new typeKinds[kind]({ ...row, ...builtinTypeData, schema, sqlType: row.sqlType }); // Only domain type has `sqlType` and it's required.
        schema.typesIncludingEntities.push(type);
    });
}
/**
 * Adds entities to database.
 *
 * @ignore
 * @param db  is DB object
 * @param rows are query result of entities to be added.
 */
function addEntities(db, rows) {
    rows.forEach((row) => {
        const schema = db.schemas.get(row.schemaOid, { key: "oid" });
        /* istanbul ignore else */
        if (row.kind === "r")
            schema.tables.push(new table_1.default({ ...row, schema }));
        else if (row.kind === "v")
            schema.views.push(new view_1.default({ ...row, schema }));
        else if (row.kind === "m")
            schema.materializedViews.push(new materialized_view_1.default({ ...row, schema }));
        else if (row.kind === "S")
            schema.sequences.push(new sequence_1.default({ ...row, schema }));
    });
}
/**
 * Adds columns to database.
 *
 * @ignore
 * @param db  is DB object
 * @param rows are query result of columns to be added.
 */
function addColumns(db, rows) {
    rows.forEach((row) => {
        const parent = (row.parentKind === "c"
            ? db.typesIncludingEntities.get(row.parentOid, { key: "classOid" })
            : db.entities.get(row.parentOid, { key: "oid" }));
        parent.columns.push(new column_1.default({ parent, ...row }));
    });
}
/**
 * Adds indexes to database.
 *
 * @ignore
 * @param db  is DB object
 * @param rows are query result of indexes to be added.
 */
function addIndexes(db, rows) {
    rows.forEach((row) => {
        const parent = db.entities.get(row.tableOid, { key: "oid" });
        const index = new pg_structure_1.default({ ...row, parent });
        const indexExpressions = [...row.indexExpressions]; // Non column reference index expressions.
        row.columnPositions.forEach((position) => {
            // If position is 0, then it's an index attribute that is not simple column references. It is an expression which is stored in indexExpressions.
            const columnOrExpression = position > 0 ? parent.columns[position - 1] : indexExpressions.shift();
            index.columnsAndExpressions.push(columnOrExpression);
        });
        parent.indexes.push(index);
    });
}
/**
 * Add functions to database.
 *
 * @ignore
 * @param db is DB object.
 * @param rows are query result of functions to be added.
 */
function addFunctions(db, rows) {
    rows.forEach((row) => {
        const schema = db.schemas.get(row.schemaOid, { key: "oid" });
        /* istanbul ignore else */
        if (row.kind === "f")
            schema.normalFunctions.push(new normal_function_1.default({ ...row, schema }));
        else if (row.kind === "p")
            schema.procedures.push(new procedure_1.default({ ...row, schema }));
        else if (row.kind === "a")
            schema.aggregateFunctions.push(new aggregate_function_1.default({ ...row, schema }));
        else if (row.kind === "w")
            schema.windowFunctions.push(new window_function_1.default({ ...row, schema }));
    });
}
/**
 * Adds constraints to database.
 *
 * @ignore
 * @param db  is DB object
 * @param rows are query result of constraints to be added.
 */
function addConstraints(db, rows) {
    const actionLetterMap = {
        a: "NO ACTION" /* NoAction */,
        r: "RESTRICT" /* Restrict */,
        c: "CASCADE" /* Cascade */,
        n: "SET NULL" /* SetNull */,
        d: "SET DEFAULT" /* SetDefault */,
    };
    const matchTypeLetterMap = {
        f: types_1.MatchType.Full,
        p: types_1.MatchType.Partial,
        s: types_1.MatchType.Simple,
    };
    rows.forEach((row) => {
        const table = db.tables.getMaybe(row.tableOid, { key: "oid" });
        const index = db.indexes.getMaybe(row.indexOid, { key: "oid" });
        const domain = db.typesIncludingEntities.getMaybe(row.typeOid, { key: "oid" });
        /* istanbul ignore else */
        if (table) {
            /* istanbul ignore else */
            if (row.kind === "p")
                table.constraints.push(new primary_key_1.default({ ...row, index, table }));
            else if (row.kind === "u")
                table.constraints.push(new unique_constraint_1.default({ ...row, index, table }));
            else if (row.kind === "x")
                table.constraints.push(new exclusion_constraint_1.default({ ...row, index, table }));
            else if (row.kind === "c")
                table.constraints.push(new check_constraint_1.default({ ...row, table, expression: row.checkConstraintExpression }));
            else if (row.kind === "f") {
                const foreignKey = new foreign_key_1.default({
                    ...row,
                    table,
                    index,
                    columns: row.constrainedColumnPositions.map((pos) => table.columns.get(pos, { key: "attributeNumber" })),
                    onUpdate: actionLetterMap[row.onUpdate],
                    onDelete: actionLetterMap[row.onDelete],
                    matchType: matchTypeLetterMap[row.matchType],
                });
                table.constraints.push(foreignKey);
                foreignKey.referencedTable.foreignKeysToThis.push(foreignKey);
            }
        }
        else if (domain) {
            /* istanbul ignore else */
            if (row.kind === "c") {
                domain.checkConstraints.push(new check_constraint_1.default({ ...row, domain, expression: row.checkConstraintExpression }));
            }
        }
    });
}
/**
 * Returns results of SQL queries of meta data.
 *
 * @ignore
 */
async function getQueryResultsFromDb(serverVersion, client, includeSchemasArray, excludeSchemasArray, includeSystemSchemas) {
    const schemaRows = await getSchemas(client, { include: includeSchemasArray, exclude: excludeSchemasArray, system: includeSystemSchemas });
    const systemSchemaRows = await getSystemSchemas(client);
    const schemaOids = schemaRows.map((schema) => schema.oid);
    const schemaOidsIncludingSystem = schemaOids.concat(systemSchemaRows.map((schema) => schema.oid));
    const queryVersions = await helper_1.getQueryVersionFor(serverVersion);
    return Promise.all([
        schemaRows,
        systemSchemaRows,
        helper_1.executeSqlFile(queryVersions, "type", client, schemaOidsIncludingSystem),
        helper_1.executeSqlFile(queryVersions, "entity", client, schemaOids),
        helper_1.executeSqlFile(queryVersions, "column", client, schemaOids),
        helper_1.executeSqlFile(queryVersions, "index", client, schemaOids),
        helper_1.executeSqlFile(queryVersions, "constraint", client, schemaOids),
        helper_1.executeSqlFile(queryVersions, "function", client, schemaOids),
    ]);
}
/**
 * Adds database objects to database.
 *
 * @ignore
 * @param db  is DB object
 * @param queryResults are query results to get object details from.
 */
function addObjects(db, queryResults) {
    addSchemas(db, queryResults[0]);
    addSystemSchemas(db, queryResults[1]);
    addTypes(db, queryResults[2]);
    addEntities(db, queryResults[3]);
    addColumns(db, queryResults[4]);
    addIndexes(db, queryResults[5]);
    addConstraints(db, queryResults[6]);
    addFunctions(db, queryResults[7]);
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
async function pgStructure(pgClientOrConfig, { name, commentDataToken = "pg-structure", includeSchemas, excludeSchemas, includeSystemSchemas, foreignKeyAliasSeparator = ",", foreignKeyAliasTargetFirst = false, relationNameFunctions = "short", keepConnection = false, } = {}) {
    const { client, closeConnectionAfter } = await helper_1.getPgClient(pgClientOrConfig);
    const includeSchemasArray = Array.isArray(includeSchemas) || includeSchemas === undefined ? includeSchemas : [includeSchemas];
    const excludeSchemasArray = Array.isArray(excludeSchemas) || excludeSchemas === undefined ? excludeSchemas : [excludeSchemas];
    const serverVersion = (await client.query("SHOW server_version")).rows[0].server_version;
    const queryResults = await getQueryResultsFromDb(serverVersion, client, includeSchemasArray, excludeSchemasArray, includeSystemSchemas);
    const db = new db_1.default({ name: name || getDatabaseName(pgClientOrConfig), serverVersion }, {
        commentDataToken,
        relationNameFunctions,
        foreignKeyAliasSeparator,
        foreignKeyAliasTargetFirst,
    }, queryResults);
    addObjects(db, queryResults);
    if (!keepConnection && closeConnectionAfter)
        client.end(); // If a connected client is provided, do not close connection.
    return db;
}
exports.default = pgStructure;
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
function deserialize(serializedData) {
    const data = JSON.parse(serializedData);
    const db = new db_1.default({ name: data.name, serverVersion: data.serverVersion }, data.config, data.queryResults);
    addObjects(db, data.queryResults);
    return db;
}
exports.deserialize = deserialize;
//# sourceMappingURL=index.js.map