import type {
  RuleContext,
  RuleListener,
} from "@typescript-eslint/utils/ts-eslint";

export default {
  meta: {
    type: "layout",
    fixable: "code",
    messages: {
      defineComponent: "convert to defineComponent",
    },
    schema: [],
  },
  create(context: RuleContext<"defineComponent", []>): RuleListener {
    return {
      ArrowFunctionExpression: (node) => {
        if (
          node.params[0]?.type !== "ObjectPattern" ||
          node.parent.type === "CallExpression"
        )
          return;

        context.report({
          node,
          messageId: "defineComponent",
          fix(fixer) {
            return [
              fixer.insertTextBefore(node, "defineComponent("),
              fixer.insertTextAfter(node, ")"),
            ];
          },
        });
      },
      FunctionDeclaration: (node) => {
        if (node.params[0]?.type !== "ObjectPattern" || !node.id) return;

        context.report({
          node,
          messageId: "defineComponent",
          fix(fixer) {
            return [
              fixer.replaceTextRange(
                [node.range[0], node.id!.range[1]],
                `const ${context.sourceCode.getText(node.id!)} = ` +
                  `defineComponent(`,
              ),
              fixer.replaceTextRange(
                [node.params.at(-1)!.range[1], node.body.range[0]],
                `) => `,
              ),
              fixer.insertTextAfter(node, ")"),
            ];
          },
        });
      },
      FunctionExpression: (node) => {
        if (
          node.params[0]?.type !== "ObjectPattern" ||
          node.parent.type === "CallExpression"
        )
          return;

        context.report({
          node,
          messageId: "defineComponent",
          fix(fixer) {
            return [
              fixer.replaceTextRange(
                [node.range[0], node.params[0].range[0]],
                `defineComponent((`,
              ),
              fixer.replaceTextRange(
                [node.params.at(-1)!.range[1], node.body.range[0]],
                `) => `,
              ),
              fixer.insertTextAfter(node, ")"),
            ];
          },
        });
      },
    };
  },
};
