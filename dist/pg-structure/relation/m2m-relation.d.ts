import { RelationNameFunctions, BuiltinRelationNameFunctions } from "../../types/index";
import ForeignKey from "../constraint/foreign-key";
import Table from "../entity/table";
import Relation, { RelationConstructorArgs } from "../base/relation";
/**
 * Table type to exclude it's name from generated name, alias or adjectives.
 *
 * @example
 * const sourceAlias = m2m.getSourceAliasWithout({ target }); // Generates source alias and replace target table name from it.
 */
declare type M2MWithout = "any" | "source" | "join" | "target";
/** @ignore */
interface M2MRelationConstructorArgs extends RelationConstructorArgs {
    foreignKey: ForeignKey;
    targetForeignKey: ForeignKey;
}
/**
 * Class which represent a many to many relationship which resembles `belongsToMany` or `hasManyThrough` relations in ORMs (Object Relational Mappers).
 * Provides attributes and methods for details of the relationship.
 *
 * Actually there isn't such a thing called **many to many relationship** or **through constraint** in the database engine.
 * They are concepts to describe records which may be related more than one record on both sides.
 * For example an invoice may contain more than one product and a product may related to more than one invoice.
 * Those relationships are solved using a **join table**.
 *
 * Since those relations are not present in database engine, they are extracted by estimation/interpretation.
 * Many non-join tables in a database could have more than one foreign keys,
 * and they may not meant to be join tables, but they still appear to have through relationships.
 *
 * <span id="exampleSchema"></span>Below is a database schema as an example:
 * ![Database Schema](/images/schema-through.png)
 *
 * Some definitions used in descriptions for {@link M2MRelation}.
 * * ** Source Table: ** Table which this relationship belongs to.
 * * ** Join Table: ** Table that contains common fields from two or more other tables.
 * * ** Target Table: ** Table that is related to base table through a join table.
 * <br><br>
 * Product table has 3 foreign keys. Product table is not meant to be a many to many join table.
 * However product could have been join table for `size & vendor`, `color & vendor` and `size & color`. As a result size,
 * color and vendor tables would have many to many relationships.
 * @example
 * // Example tables have single primary key and and examples first relation. So zero index ([0]) is used. Use all array elements if necessary.
 * // product ----< line_item >---- cart
 * // (source)        (join)       (target)
 *
 * const relation             = product.m2mRelations[0];              // RELATION:    product ---< line_item >--- cart
 * const foreignKey           = relation.foreignKey;                  // FOREIGNKEY:           ^-- product_has_carts
 * const targetForeignKey     = relation.targetForeignKey;            // FOREIGNKEY:       cart_has_products --^
 * const sourceTable          = relation.sourceTable;                 // TABLE:       product
 * const targetTable          = relation.targetTable;                 // TABLE:       cart
 * const sourceJoinFKColumn   = relation.foreignKey.columns[0];       // COLUMN:      product_id  (from line_item table)
 * const targetJoinFKColumn   = relation.targetForeignKey.columns[0]; // COLUMN:      cart_id     (from line_item table)
 * const sourcePKColumn       = relation.sourceTable.primaryKeys[0];  // COLUMN:      id          (from product table)
 * const targetPKColumn       = relation.targetTable.primaryKeys[0];  // COLUMN:      id          (from cart table)
 */
export default class M2MRelation extends Relation {
    /** @ignore */
    constructor(args: M2MRelationConstructorArgs);
    /**
     * Suggested name for {@link Relation relation}.
     *
     * @see {@link ../relation-names.md Relation Names}
     */
    get name(): string;
    /**
     * Retunrs name for the relation using given naming function.
     *
     * @param relationNameFunctions are custom functions or name of the builtin functions to generate names with.
     * @returns name for the relation using naming function.
     */
    getName(relationNameFunctions: RelationNameFunctions | BuiltinRelationNameFunctions): string;
    /**
     * Informational text representation of the relation.
     *
     * @example
     * const info = relation.info; // [public.product]――― line_item_product ――⥷ [public.line_item] ⭃―― line_item_cart ―――[public.cart]
     */
    get info(): string;
    /**
     * {@link Table} which this relation belongs to.
     *
     * @example
     * const relation = product.M2MRelationRelations[0];  // RELATION:    product ---< line_item >--- cart
     * const source   = relation.sourceTable;             // TABLE:       product
     */
    get sourceTable(): Table;
    /**
     * Join {@link Table} of this relationship. This table contains foreign key columns referring both
     * {@link M2MRelation.sourceTable sourceTable} and {@link M2MRelation.targetTable targetTable}.
     *
     * @example
     * const relation  = product.M2MRelationRelations[0]; // RELATION:    product ---< line_item >--- cart
     * const joinTable = relation.joinTable;              // TABLE:       line_item
     */
    get joinTable(): Table;
    /**
     * {@link Table} which this relation is referring to (Through a join table).
     *
     * @example
     * const relation = product.M2MRelationRelations[0];  // RELATION:    product ---< line_item >--- cart
     * const target   = relation.targetTable;             // TABLE:       cart
     */
    get targetTable(): Table;
    /**
     * {@link ForeignKey Foreign key} between {@link M2MRelation.sourceTable source table} and {@link M2MRelation.joinTable join table}.
     *
     * @example
     * const relation             = product.M2MRelationRelations[0];        // RELATION:    product ---< line_item >--- cart
     * const foreignKey           = relation.sourceForeignKey;              // CONSTRAINT:           ^-- product_has_carts
     * const sourceJoinFKColumn   = relation.sourceForeignKey.columns[0];   // COLUMN:      product_id (from line_item table)
     */
    readonly foreignKey: ForeignKey;
    /**
     * {@link ForeignKey Foreign key} between {@link M2MRelation.joinTable join table} and {@link M2MRelation.targetTable target table}.
     *
     * @example
     * const relation             = product.M2MRelationRelations[0];      // RELATION:    product ---< line_item >--- cart
     * const targetForeignKey     = relation.targetForeignKey;            // CONSTRAINT:       cart_has_products --^
     * const targetJoinFKColumn   = relation.targetForeignKey.columns[0]; // COLUMN:      cart_id (from line_item table)
     */
    readonly targetForeignKey: ForeignKey;
    /** @ignore */
    protected getWithout(string: string, without?: M2MWithout | M2MWithout[]): string;
    /**
     * Returns source table name after replacing given tables' names from it.
     *
     * @param without is type or types of tables to exclude names of.
     * @returns source table name after given tables' names replaced.
     */
    getSourceNameWithout(without: M2MWithout | M2MWithout[]): string;
    /**
     * Returns join table name after replacing given tables' names from it.
     *
     * @param without is type or types of tables to exclude names of.
     * @returns join table name after given tables' names replaced.
     */
    getJoinNameWithout(without: M2MWithout | M2MWithout[]): string;
    /**
     * Returns target table name after replacing given tables' names from it.
     *
     * @param without is type or types of tables to exclude names of.
     * @returns target table name after given tables' names replaced.
     */
    getTargetNameWithout(without: M2MWithout | M2MWithout[]): string;
    /**
     * Returns source table alias after replacing given tables' names from it.
     *
     * @param without is type or types of tables to exclude names of.
     * @returns source table alias after given tables' names replaced.
     */
    getSourceAliasWithout(without: M2MWithout | M2MWithout[]): string;
    /**
     * Returns join table alias after replacing given tables' names from it.
     *
     * @param without is type or types of tables to exclude names of.
     * @returns join table alias after given tables' names replaced.
     */
    getJoinAliasWithout(without: M2MWithout | M2MWithout[]): string;
    /**
     * Returns target table alias after replacing given tables' names from it.
     *
     * @param without is type or types of tables to exclude names of.
     * @returns target table alias after given tables' names replaced.
     */
    getTargetAliasWithout(without: M2MWithout | M2MWithout[]): string;
    /** Source table name */
    get sourceName(): string;
    /** Join table name. */
    get joinName(): string;
    /** Target table name */
    get targetName(): string;
    /** Source table alias */
    get sourceAlias(): string;
    /** Join table alias */
    get joinAlias(): string;
    /** Target table alias */
    get targetAlias(): string;
    /** Source table adjective */
    get sourceAdjective(): string | undefined;
    /** Join table adjective */
    get joinAdjective(): string | undefined;
    /** Target table adjective */
    get targetAdjective(): string | undefined;
}
export {};
//# sourceMappingURL=m2m-relation.d.ts.map