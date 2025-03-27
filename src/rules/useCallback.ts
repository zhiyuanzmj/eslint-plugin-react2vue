import type {
  RuleContext,
  RuleListener,
} from "@typescript-eslint/utils/ts-eslint";

export default {
  meta: {
    type: "layout",
    fixable: "code",
    messages: {
      useCallback: "remove useCallback",
    },
    schema: [],
  },
  create(context: RuleContext<"useCallback", []>): RuleListener {
    return {
      CallExpression(node) {
        if (
          node.callee.type === "Identifier" &&
          node.callee.name === "useCallback"
        ) {
          context.report({
            node: node.callee,
            messageId: "useCallback",
            fix(fixer) {
              return [
                fixer.removeRange([node.range[0], node.arguments[0].range[0]]),
                fixer.removeRange([node.arguments[0].range[1], node.range[1]]),
              ];
            },
          });
        }
      },
    };
  },
};
