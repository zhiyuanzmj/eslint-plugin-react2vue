import type {
  RuleContext,
  RuleListener,
} from "@typescript-eslint/utils/ts-eslint";

export default {
  meta: {
    type: "layout",
    fixable: "code",
    messages: {
      useImperativeHandle: "covert to defineExpose",
    },
    schema: [],
  },
  create(context: RuleContext<"useImperativeHandle", []>): RuleListener {
    return {
      CallExpression(node) {
        if (
          node.callee.type === "Identifier" &&
          node.callee.name === "useImperativeHandle"
        ) {
          context.report({
            node: node.callee,
            messageId: "useImperativeHandle",
            fix(fixer) {
              return fixer.replaceText(node.callee, "defineExpose");
            },
          });
          if (node.arguments[0]) {
            context.report({
              node: node.arguments[0],
              messageId: "useImperativeHandle",
              fix(fixer) {
                return fixer.replaceTextRange(
                  [node.arguments[0].range[0], node.arguments[1].range[0]],
                  "computed(",
                );
              },
            });
          }
          if (node.arguments[2]) {
            context.report({
              node: node.arguments[2],
              messageId: "useImperativeHandle",
              fix(fixer) {
                return fixer.replaceTextRange(
                  [node.arguments[1].range[1], node.arguments[2].range[1]],
                  ")",
                );
              },
            });
          }
        }
      },
    };
  },
};
