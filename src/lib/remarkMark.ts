import type { Parent, PhrasingContent, Root, Text } from "mdast";
import type { Plugin } from "unified";
import { visit } from "unist-util-visit";

const PATTERN = /==([^=\n]+?)==/g;

const remarkMark: Plugin<[], Root> = () => {
  return (tree) => {
    visit(tree, "text", (node: Text, index, parent: Parent | undefined) => {
      if (!parent || typeof index !== "number") return;
      if (!node.value.includes("==")) return;

      const replacements: PhrasingContent[] = [];
      let cursor = 0;
      PATTERN.lastIndex = 0;

      for (let match = PATTERN.exec(node.value); match !== null; match = PATTERN.exec(node.value)) {
        if (match.index > cursor) {
          replacements.push({ type: "text", value: node.value.slice(cursor, match.index) });
        }
        replacements.push({
          type: "emphasis",
          data: { hName: "mark" },
          children: [{ type: "text", value: match[1] }],
        });
        cursor = match.index + match[0].length;
      }

      if (replacements.length === 0) return;
      if (cursor < node.value.length) {
        replacements.push({ type: "text", value: node.value.slice(cursor) });
      }

      parent.children.splice(index, 1, ...replacements);
      return index + replacements.length;
    });
  };
};

export default remarkMark;
