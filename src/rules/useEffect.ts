import type {
  RuleContext,
  RuleListener,
} from "@typescript-eslint/utils/ts-eslint";

export default {
  meta: {
    type: "layout",
    fixable: "code",
    messages: {
      useEffect: "covert to watchEffect",
    },
    schema: [],
  },
  create(context: RuleContext<"useEffect", []>): RuleListener {
    return {
      CallExpression(node) {
        if (
          node.callee.type === "Identifier" &&
          node.callee.name === "useEffect"
        ) {
          context.report({
            node: node.callee,
            messageId: "useEffect",
            fix(fixer) {
              return fixer.replaceText(node.callee, "watchEffect");
            },
          });
          if (node.arguments[1]) {
            context.report({
              node: node.arguments[1],
              messageId: "useEffect",
              fix(fixer) {
                return fixer.removeRange([
                  node.arguments[0].range[1],
                  node.arguments[1].range[1],
                ]);
              },
            });
          }
        }
      },
    };
  },
};
