import { getReferences } from "./utils";
import type {
  RuleContext,
  RuleListener,
} from "@typescript-eslint/utils/ts-eslint";

export default {
  meta: {
    type: "layout",
    fixable: "code",
    messages: {
      useMemo: "covert to computed",
    },
    schema: [],
  },
  create(context: RuleContext<"useMemo", []>): RuleListener {
    const ids: Record<string, any> = {};
    return {
      VariableDeclarator(node) {
        if (node.init?.type !== "CallExpression" || !node.id) return;
        const { id, init } = node;
        if (
          init.callee.type === "Identifier" &&
          init.callee.name === "useMemo" &&
          id?.type === "Identifier"
        ) {
          ids[id.name] = id;
          context.report({
            node: init.callee,
            messageId: "useMemo",
            fix(fixer) {
              return fixer.replaceText(init.callee, "computed");
            },
          });
          if (init.arguments[1]) {
            context.report({
              node: init.arguments[1],
              messageId: "useMemo",
              fix(fixer) {
                return fixer.removeRange([
                  init.arguments[0].range[1],
                  init.arguments[1].range[1],
                ]);
              },
            });
          }

          const references = getReferences(context.sourceCode.getScope(id), id);
          references.forEach(({ identifier }) => {
            context.report({
              node: identifier,
              messageId: "useMemo",
              fix(fixer) {
                return fixer.insertTextAfter(
                  identifier,
                  `${
                    identifier.parent.type === "Property" &&
                    identifier.parent.shorthand
                      ? `: ${identifier.name}`
                      : ""
                  }.value`,
                );
              },
            });
          });
        }
      },
    };
  },
};
