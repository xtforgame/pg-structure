/* eslint-disable no-plusplus */
import { ArgumentMode, Volatility, ParallelSafety } from "../../types/index";
import { ArgumentModeLetter } from "../../types/query-result";
import Schema from "../schema";
import DbObject, { DbObjectConstructorArgs } from "./db-object";
import Type from "./type";
import Db from "../db";

/** @ignore */
export interface SequenceConstructorArgs extends DbObjectConstructorArgs {
  oid: number;
  schema: Schema;
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
  argumentNames: string[] | null; // Note that subscripting is 1-based
  argumentModes: string | null; // If all the arguments are IN arguments, this field will be null.
  signature: string;
  comment: string;
}

/**
 * Class which represent a PostgreSQL ({@link Func function}.
 * Provides attributes and methods for details of the function.
 * Class name is `Func` instead of `Sequence`, because `Sequence` is a reserved word in JavaScript,
 * and cannot be used as a class name.
 */
export default class Sequence extends DbObject {
  /** @ignore */
  public constructor(args: SequenceConstructorArgs) {
    super(args);
    const { db } = args.schema;
    this.oid = args.oid;
    this.schema = args.schema;
    this.source = args.source;
    this.language = args.language;
    this.estimatedCost = args.estimatedCost;
    this.estimatedRows = args.estimatedRows;
    this.isLeakProof = args.isLeakProof;
    this.isStrict = args.isStrict;
    this.parallelSafety = args.parallelSafety;
    this.volatility = args.volatility;
  }

  /** Object identifier for the {@link Sequence} */
  public readonly oid: number;

  /** [[Schema]] of the object. */
  public readonly schema: Schema;

  /** Source definition of the function. */
  public readonly source: string;

  /** Language name of the function. */
  public readonly language: string;

  /** Estimated execution cost (in units of cpu_operator_cost); if proretset, this is cost per row returned */
  public readonly estimatedCost: number;

  /** Estimated number of result rows (zero if not proretset) */
  public readonly estimatedRows: number;

  /** The function has no side effects. No information about the arguments is conveyed except via the return value. Any function that might throw an error depending on the values of its arguments is not leak-proof. */
  public readonly isLeakProof: boolean;

  /** Whether function returns null if any call argument is null. */
  public readonly isStrict: boolean;

  /** whether the function can be safely run in parallel mode. */
  public readonly parallelSafety: ParallelSafety;

  /** Whether the function's result depends only on its input arguments, or is affected by outside factors. */
  public readonly volatility: Volatility;

  /**
   * Full name of the object with '.' notation including [[Schema]] name.
   *
   * @example
   * const fullName = func.fullName; // public.some_func
   */
  public get fullName(): string {
    return `${this.schema.name}.${this.name}`;
  }
}
