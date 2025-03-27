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
              const argument = node.arguments[0];
              return [
                fixer.removeRange([node.range[0], argument.range[0]]),
                fixer.removeRange([argument.range[1], node.range[1]]),
                isFunctionalNode(argument)
                  ? fixer.removeRange([
                      argument.params[0].range[1],
                      argument.params[1].range[1],
                    ])
                  : null,
              ].filter((i) => !!i);
            },
          });
        }
      },
    };
  },
};
