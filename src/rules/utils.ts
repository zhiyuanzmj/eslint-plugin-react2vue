import type { TSESTree } from "@typescript-eslint/types";
import type { Scope } from "@typescript-eslint/utils/ts-eslint";

export function isFunctionalNode(
  node: TSESTree.Node,
): node is
  | TSESTree.FunctionDeclaration
  | TSESTree.FunctionExpression
  | TSESTree.ArrowFunctionExpression {
  return (
    node.type === "FunctionDeclaration" ||
    node.type === "FunctionExpression" ||
    node.type === "ArrowFunctionExpression"
  );
}

export function getReferences(
  scope: Scope.Scope,
  id: TSESTree.Identifier,
): Scope.Reference[] {
  return scope.childScopes.reduce(
    (acc, scope) => (acc.push(...getReferences(scope, id)), acc),
    scope.references.filter(
      (ref) => ref.identifier !== id && ref.resolved?.identifiers.includes(id),
    ),
  );
}
