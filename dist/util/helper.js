"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const json5_1 = __importDefault(require("json5"));
const pg_1 = require("pg");
const path_1 = require("path");
const fast_memoize_1 = __importDefault(require("fast-memoize"));
const m2m_relation_1 = __importDefault(require("../pg-structure/relation/m2m-relation"));
const memoize_serializer_1 = __importDefault(require("./memoize-serializer"));
const { readFile, readdir } = fs_1.default.promises;
/**
 * Extracts JSON5 between given tokens such as `[pg-structure]` and `[/pg-structure]` tags,
 * converts it to object and returns created object.
 *
 * @ignore
 * @param token is the token to search.
 * @param input is th string to extract JSON from.
 * @returns object created from JSON. Undefined if no input is provided or no token is found.
 * @example
 * let meta = extractJSON('Some comment [pg]{"type": "post"}[/pg]', "pg"); // meta = { type: 'post' }
 * let othr = extractJSON('Some comment [xx]{"type": "post"}[/xx]', "xx"); // othr = { type: 'post' }
 */
function extractJSON(token, input) {
    /* istanbul ignore next */
    if (!token) {
        throw new Error("Token is required.");
    }
    if (!input) {
        return undefined;
    }
    const reJSON = new RegExp(`\\s*?\\[${token}]((.|[\\s])+?)\\[\\/${token}]\\s*?`, "im");
    const json = reJSON.exec(input);
    return json ? json5_1.default.parse(json[1]) : undefined;
}
exports.extractJSON = extractJSON;
/**
 * Replaces JSON between given tokens such as `[pg-structure]` and `[/pg-structure]` tags including tags.
 *
 * @ignore
 * @param token is the token to search.
 * @param input is the string to replace JSON part.
 * @returns new string. Undefined if no input is provided.
 * @example
 * let meta = replaceJSON('Some comment [pg]{"type": "post"}[/pg]', "pg"); // meta = Some content
 * let othr = replaceJSON('Some comment [xx]{"type": "post"}[/xx]', "xx"); // othr = Some content
 */
function replaceJSON(token, input) {
    /* istanbul ignore next */
    if (!token) {
        throw new Error("Token is required.");
    }
    if (!input) {
        return undefined;
    }
    const reJSON = new RegExp(`\\s*?\\[${token}]((.|[\\s])+?)\\[\\/${token}]\\s*?`, "im");
    return input.replace(reJSON, "");
}
exports.replaceJSON = replaceJSON;
/**
 * Parses enum labels defined in PostgreSQL and returns as an array of string values. PostgreSQL returns enum values
 * as comma separated values between curly braces. If string contains a comma, it wraps string with double quotes.
 * fk function considers fk situation.
 *
 * @ignore
 * @param values are enum values.
 * @returns enum labels as an array. If column is not an enum returns null.
 */
function parseEnumValues(values) {
    /* istanbul ignore next */
    if (Array.isArray(values)) {
        return values;
    }
    // Strip curly braces: {}
    const valuesWithoutCurlyBraces = values.substr(1, values.length - 2);
    // Split by comma considering quoted strings which includes comma.
    return (valuesWithoutCurlyBraces.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || []).map((value) => {
        // Strip quotes at start and end of string;
        return value.charAt(0) === '"' && value.charAt(value.length - 1) === '"' ? value.substr(1, value.length - 2) : value;
    });
}
exports.parseEnumValues = parseEnumValues;
/**
 * Returns case type (CamelCase or snake_case) of the given string. Please note, fk function
 * uses simple checks and does not check comprehensively considering all language variations.
 *
 * @ignore
 * @param input is the string to get case type for.
 * @returns case type of the string.
 */
function caseTypeOf(input) {
    const alphaName = input.replace(/\d/g, "");
    return alphaName.charAt(0).toUpperCase() === alphaName.charAt(0) ? "camelCase" /* CamelCase */ : "snakeCase" /* SnakeCase */;
}
exports.caseTypeOf = caseTypeOf;
/**
 * Returns major part of the given version string.
 *
 * @ignore
 * @param version is the version to get major number from.
 * @returns major version of given version.
 */
function majorVersionOf(version) {
    return Number(version.replace(/\..+$/, ""));
}
exports.majorVersionOf = majorVersionOf;
/**
 * Returns sorted query versions available which are less than or equal to provided server version.
 *
 * @ignore
 * @returns sorted versions.
 * @example
 * getQueryVersionFor(11); // ["11", "9"]
 */
async function getQueryVersionFor(serverVersion) {
    const major = majorVersionOf(serverVersion);
    const dirs = await readdir(path_1.join(__dirname, "../../module-files/sql"));
    return dirs.filter((dir) => Number.isInteger(Number(dir)) && major >= Number(dir)).sort((a, b) => Number(b) - Number(a));
}
exports.getQueryVersionFor = getQueryVersionFor;
/**
 * Executes given sql file and assign callback function an error events for the query.
 *
 * @ignore
 * @param file is SQL file
 * @param client is node-postgres client to query database.
 * @param schemas is PostgreSQL schemas to be used in query.
 * @param eventCallback is callback to call on 'row' event.
 * @returns void promise
 */
async function executeSqlFile(queryVersions, file, client, schemas) {
    let sql;
    // Find first compatible version of the sql file.
    // eslint-disable-next-line no-restricted-syntax
    for (const queryVersion of queryVersions) {
        try {
            const filePath = path_1.join(__dirname, "../../module-files/sql", queryVersion, `${file}.sql`);
            sql = await readFile(filePath, "utf8"); // eslint-disable-line no-await-in-loop
            break; // End if found.
        }
        catch (error) {
            /* istanbul ignore if */
            if (error.code !== "ENOENT")
                throw error;
        }
    }
    if (!sql)
        throw new Error(`Cannot find ${file}.sql in versions less than server version: ${queryVersions.join(", ")}`);
    const result = await client.query(sql, [schemas]);
    return result.rows;
}
exports.executeSqlFile = executeSqlFile;
/**
 * Returns whether given argument is a PostgreSQL client or pool.
 * @returns boolean
 */
function isPgClient(pgClientOrConfig) {
    return typeof pgClientOrConfig.query === "function" && typeof pgClientOrConfig.connect === "function";
}
/**
 * Returns pg client. If given object is already pg client returns it directly, otherwise creates pg object
 * based on given options.
 *
 * @ignore
 * @param is pg client or Connection parameters.
 * @returns pg client.
 */
async function getPgClient(pgClientOrConfig) {
    let closeConnectionAfter = false;
    if (isPgClient(pgClientOrConfig)) {
        if (!pgClientOrConfig._connected) {
            await pgClientOrConfig.connect();
            closeConnectionAfter = true;
        }
        return { client: pgClientOrConfig, closeConnectionAfter };
    }
    const client = new pg_1.Client(pgClientOrConfig);
    await client.connect();
    return { client, closeConnectionAfter: true };
}
exports.getPgClient = getPgClient;
/**
 * Returns given value after replacing type cast.
 *
 * @ignore
 * @param defaultWithTypeCast is default value with type cast.
 * @returns default value without type cast.
 * @example
 * replaceTypeCast("'George'::character varying"); // 'George'
 */
function replaceTypeCast(defaultWithTypeCast) {
    if (defaultWithTypeCast === null || typeof defaultWithTypeCast === "boolean" || typeof defaultWithTypeCast === "number") {
        return defaultWithTypeCast;
    }
    return defaultWithTypeCast.replace(/^('.*?')::.+$/, "$1");
}
exports.replaceTypeCast = replaceTypeCast;
/**
 * Checks whether given ddefault value is a serial type.
 *
 * @ignore
 * @param defaultValue is the default value to test whether it is serial type.
 * @returns whether default value is a serial.
 */
function isSerial(defaultValue) {
    return defaultValue !== null && defaultValue.startsWith("nextval");
}
exports.isSerial = isSerial;
/**
 * Removes quotes around given string and returns it.
 *
 * @ignore
 * @param input is string to remove quotes from.
 * @returns unquoted string.
 */
function unquote(input) {
    let result = input;
    const reg = /['"]/;
    if (!result) {
        return "";
    }
    if (reg.test(result.charAt(0))) {
        result = result.substr(1);
    }
    if (reg.test(result.charAt(result.length - 1))) {
        result = result.substr(0, result.length - 1);
    }
    return result;
}
exports.unquote = unquote;
/**
 * Parses SQL type name returned from `format_type(type_oid, typemod)` PostgrSQL System Information Function.
 * such as `character varying(20)`, `numeric(3,2)`, `extra_modules."extra-domain"[]`, `timestamp(0) without time zone` etc.
 *
 * @ignore
 * @param sqlType is SQL type name returned from `format_type` PostgrSQL System Information Function.
 * @returns type details.
 */
function parseSQLType(db, sqlType) {
    let builtInType;
    const modifierRegExp = /\((.+?)\)/;
    const match = modifierRegExp.exec(sqlType); // Match modifiers such as (1,2) or (2)
    const modifiers = match ? match[1].split(",").map((n) => parseInt(n, 10)) : [];
    const parts = sqlType
        .replace("[]", "") // Remove [] from arrays
        .replace(modifierRegExp, "") // Remove modifier numbers (1), (1,2)
        .split(".");
    const schemaName = parts.length === 2 ? unquote(parts[0]) : undefined;
    const typeName = unquote(parts.length === 2 ? parts[1] : parts[0]);
    if (!schemaName)
        builtInType = db.systemTypes.getMaybe(typeName, { key: "internalName" }) || db.systemTypes.getMaybe(typeName);
    const schema = builtInType ? builtInType.schema : db.schemas.get(schemaName || "public");
    if (typeName === "numeric") {
        // console.log(typeName, builtInType?.name, builtInType?.hasPrecision, builtInType?.hasScale, builtInType?.hasLength);
        // console.log(typeName, builtInType);
    }
    return {
        schema,
        typeName,
        length: builtInType && builtInType.hasLength ? modifiers[0] : undefined,
        precision: builtInType && builtInType.hasPrecision ? modifiers[0] : undefined,
        scale: builtInType && builtInType.hasScale ? modifiers[1] : undefined,
    };
}
exports.parseSQLType = parseSQLType;
/**
 * Finds and returns duplicate names from given Indexable array.
 *
 * @ignore
 * @param accessor is one of the attribute names of the Table class which is type of [[IndexableArray]].
 * @returns duplicate names.
 */
function getDuplicateNames(indexableArray) {
    const seen = {};
    const duplicates = [];
    indexableArray.forEach((element) => {
        const { name } = element;
        const count = seen[name] || 0;
        if (count === 1) {
            duplicates.push(name);
        }
        seen[name] = count + 1;
    });
    return duplicates;
}
exports.getDuplicateNames = getDuplicateNames;
// Memoize uses JSON.stringify to cache arguments. DB objects has circular data structures which cannot be serialized. Below are manually memoized functions:
/**
 * Memoized function to get foreign keys from source table to target table.
 * @hidden
 */
exports.getForeignKeysTo = fast_memoize_1.default((source, target) => source.foreignKeys.filter((fk) => fk.referencedTable === target), {
    serializer: memoize_serializer_1.default,
});
/**
 * Creates a summary table in markdown format for all relations in database.
 *
 * @ignore
 * @returns markdown table.
 *
 * @example
 * pgStructure({ database: "db", user: "user", password: "password" }).then(db => {
 *  console.log(getRelationsMarkdown(db));
 *  console.log(db.relationNameCollisions);
 * });
 */
function getRelationsMarkdown(db, fk = false) {
    let result = [
        `| Tables | Type | Short | Descriptive |   | ${fk ? "Foreign Key |" : ""}`,
        `| ------ | ---- | ----- |------------ | - | ${fk ? "--- |" : ""}`,
    ];
    db.tables.forEach((t) => {
        const rels = t.relations.map((r) => {
            const tables = `${r.sourceTable.name}_ → ${r instanceof m2m_relation_1.default ? " ... →" : ""} _${r.targetTable.name}`;
            const type = r.constructor.name.replace("Relation", "");
            const short = r.getName("short");
            const descriptive = r.getName("descriptive");
            const diff = short === descriptive ? "" : "•";
            return `| _${tables}_ | ${type} | **${short}** | **${descriptive}** | ${diff} | ${fk ? `_${r.foreignKey.name}_ |` : ""}`;
        });
        result = result.concat(rels);
    });
    return result.join("\n");
}
exports.getRelationsMarkdown = getRelationsMarkdown;
//# sourceMappingURL=helper.js.map