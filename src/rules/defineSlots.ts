import { getReferences, isFunctionalNode } from "./utils";
import type { TSESTree } from "@typescript-eslint/types";
import type {
  RuleContext,
  RuleListener,
} from "@typescript-eslint/utils/ts-eslint";

export default {
  meta: {
    type: "layout",
    fixable: "code",
    messages: {
      defineSlots: "covert to defineSlots",
    },
    schema: [],
  },
  create(context: RuleContext<"defineSlots", []>): RuleListener {
    return {
      BlockStatement(node) {
        if (isFunctionalNode(node.parent)) {
          const {
            params: [props],
          } = node.parent;
          if (props?.type === "ObjectPattern") {
            const index = props.properties.findIndex(
              (prop) =>
                prop.type === "Property" &&
                prop.key.type === "Identifier" &&
                prop.key.name === "children",
            );
            const children = props.properties[index]?.value as
              | TSESTree.Identifier
              | undefined;
            const defineSlotsText = "const slots = defineSlots()";
            if (
              children &&
              context.sourceCode.getText(node.body[0]) !== defineSlotsText
            ) {
              const references = getReferences(
                context.sourceCode.getScope(children),
                children,
              );
              references.forEach(({ identifier }) => {
                context.report({
                  node: identifier,
                  messageId: "defineSlots",
                  fix(fixer) {
                    return fixer.replaceText(identifier, "<slots.default />");
                  },
                });
              });
              context.report({
                node: children,
                messageId: "defineSlots",
                fix(fixer) {
                  return [
                    fixer.insertTextBefore(
                      node.body[0],
                      `${defineSlotsText}\n`,
                    ),
                    fixer.removeRange(
                      props.properties[index - 1]
                        ? [
                            props.properties[index - 1].range[1],
                            children.range[1],
                          ]
                        : props.properties[index + 1]
                          ? [
                              children.range[0],
                              props.properties[index + 1].range[0],
                            ]
                          : children.range,
                    ),
                  ];
                },
              });
            }
          }
        }
      },
    };
  },
};
