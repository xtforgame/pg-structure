import { Table, ForeignKey } from "../..";
/**
 * Table type to exclude it's name from generated name, alias or adjectives.
 *
 * @example
 * const sourceAlias = relation.getSourceAliasWithout({ target }); // Generates source alias and replace target table name from it.
 */
export declare type RelationWithout = "any" | "source" | "target";
/** @ignore */
export interface RelationConstructorArgs {
}
/**
 * Class which represent a {@link Relation relationship}. Provides attributes and methods for details of the {@link Relation relationship}.
 * @abstract
 * @hideconstructor
 */
export default abstract class Relation {
    /** @ignore */
    constructor(args: RelationConstructorArgs);
    /** @ignore */
    abstract readonly sourceTable: Table;
    /** @ignore */
    abstract readonly targetTable: Table;
    /** @ignore */
    abstract readonly foreignKey: ForeignKey;
    /** @ignore */
    abstract readonly info: string;
    /** @ignore */
    abstract get name(): string;
    /** @ignore */
    protected getWithout(string: string, without?: RelationWithout | RelationWithout[]): string;
    /**
     * Returns source table name after replacing given tables' names from it.
     *
     * @param without is type or types of tables to exclude names of.
     * @returns source table name after given tables' names replaced.
     */
    getSourceNameWithout(without: RelationWithout | RelationWithout[]): string;
    /**
     * Returns target table name after replacing given tables' names from it.
     *
     * @param without is type or types of tables to exclude names of.
     * @returns target table name after given tables' names replaced.
     */
    getTargetNameWithout(without: RelationWithout | RelationWithout[]): string;
    /** Source table name. */
    get sourceName(): string;
    /** Target table name */
    get targetName(): string;
    /** Source table's adjective extracted from foreign key name. */
    get sourceAdjective(): string | undefined;
    /** Source table's adjective extracted from foreign key name. */
    get targetAdjective(): string | undefined;
}
//# sourceMappingURL=relation.d.ts.map