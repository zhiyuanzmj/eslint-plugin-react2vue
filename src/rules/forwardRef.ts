import { isFunctionalNode } from "./utils";
import type {
  RuleContext,
  RuleListener,
} from "@typescript-eslint/utils/ts-eslint";

export default {
  meta: {
    type: "layout",
    fixable: "code",
    messages: {
      forwardRef: "remove forwardRef",
    },
    schema: [],
  },
  create(context: RuleContext<"forwardRef", []>): RuleListener {
    return {
      CallExpression(node) {
        if (
          node.callee.type === "Identifier" &&
          node.callee.name === "forwardRef"
        ) {
          context.report({
            node: node.callee,
            messageId: "forwardRef",
            fix(fixer) {
              return [
                fixer.removeRange([node.range[0], node.arguments[0].range[0]]),
                fixer.removeRange([node.arguments[0].range[1], node.range[1]]),
                isFunctionalNode(node.arguments[0])
                  ? fixer.remove(node.arguments[0].params[1])
                  : null,
              ].filter((i) => !!i);
            },
          });
        }
      },
    };
  },
};
