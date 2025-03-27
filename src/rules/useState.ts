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
      useState: "convert to ref",
    },
    schema: [],
  },
  create(context: RuleContext<"useState", []>): RuleListener {
    return {
      VariableDeclarator(node) {
        if (
          node.init?.type !== "CallExpression" ||
          node.id.type !== "ArrayPattern"
        )
          return;
        const {
          id: { elements },
          init,
        } = node;
        if (
          init.callee.type === "Identifier" &&
          init.callee.name === "useState" &&
          elements[0]?.type === "Identifier"
        ) {
          const name = elements[0].name;
          if (elements[1]?.type === "Identifier") {
            const references = getReferences(
              context.sourceCode.getScope(elements[1]),
              elements[1],
            );
            references.forEach(({ identifier }) => {
              context.report({
                node: identifier,
                messageId: "useState",
                fix(fixer) {
                  return identifier.parent.type === "CallExpression" &&
                    identifier.parent.callee === identifier
                    ? fixer.replaceText(
                        identifier.parent,
                        `${name}.value = ${context.sourceCode.getText(identifier.parent.arguments[0])}`,
                      )
                    : fixer.replaceText(
                        identifier,
                        `val => ${name}.value = val`,
                      );
                },
              });
            });
          }
          context.report({
            node: node.id,
            messageId: "useState",
            fix(fixer) {
              return fixer.replaceTextRange(node.id.range, name);
            },
          });
          context.report({
            node: init.callee,
            messageId: "useState",
            fix(fixer) {
              return fixer.replaceText(init.callee, "ref");
            },
          });

          const references = getReferences(
            context.sourceCode.getScope(elements[0]),
            elements[0],
          );
          references.forEach(({ identifier }) => {
            context.report({
              node: identifier,
              messageId: "useState",
              fix(fixer) {
                return fixer.insertTextAfter(
                  identifier,
                  `${identifier.parent.type === "Property" && identifier.parent.shorthand ? `: ${identifier.name}` : ""}.value`,
                );
              },
            });
          });
        }
      },
    };
  },
};
