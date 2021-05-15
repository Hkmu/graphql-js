import { Maybe } from '../jsutils/Maybe';
import { ReadOnlyObjMap } from '../jsutils/ObjMap';

import { GraphQLError } from '../error/GraphQLError';
import {
  FieldNode,
  DirectiveNode,
  VariableDefinitionNode,
} from '../language/ast';

import { GraphQLDirective } from '../type/directives';
import { GraphQLSchema } from '../type/schema';
import { GraphQLField, GraphQLInputType } from '../type/definition';

export type VariableValues = {
  readonly sources: ReadOnlyObjMap<{
    readonly variable: VariableDefinitionNode;
    readonly type: GraphQLInputType;
    readonly value: unknown;
  }>;
  readonly coerced: ReadOnlyObjMap<unknown>;
};

type VariableValuesOrErrors =
  | { variableValues: VariableValues; errors?: never }
  | { errors: ReadonlyArray<GraphQLError>; variableValues?: never };

/**
 * Prepares an object map of variableValues of the correct type based on the
 * provided variable definitions and arbitrary input. If the input cannot be
 * parsed to match the variable definitions, a GraphQLError will be thrown.
 *
 * Note: The returned value is a plain Object with a prototype, since it is
 * exposed to user code. Care should be taken to not pull values from the
 * Object prototype.
 */
export function getVariableValues(
  schema: GraphQLSchema,
  varDefNodes: ReadonlyArray<VariableDefinitionNode>,
  inputs: { [key: string]: unknown },
  options?: { maxErrors?: number },
): VariableValuesOrErrors;

/**
 * Prepares an object map of argument values given a list of argument
 * definitions and list of argument AST nodes.
 *
 * Note: The returned value is a plain Object with a prototype, since it is
 * exposed to user code. Care should be taken to not pull values from the
 * Object prototype.
 */
export function getArgumentValues(
  def: GraphQLField<unknown, unknown> | GraphQLDirective,
  node: FieldNode | DirectiveNode,
  variableValues?: Maybe<VariableValues>,
): { [key: string]: unknown };

/**
 * Prepares an object map of argument values given a directive definition
 * and a AST node which may contain directives. Optionally also accepts a map
 * of variable values.
 *
 * If the directive does not exist on the node, returns undefined.
 *
 * Note: The returned value is a plain Object with a prototype, since it is
 * exposed to user code. Care should be taken to not pull values from the
 * Object prototype.
 */
export function getDirectiveValues(
  directiveDef: GraphQLDirective,
  node: {
    readonly directives?: ReadonlyArray<DirectiveNode>;
  },
  variableValues?: Maybe<VariableValues>,
): undefined | { [key: string]: unknown };
