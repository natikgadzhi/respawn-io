import type { Paragraph, Root, Text } from "mdast";
import type { Plugin } from "unified";
import { visit } from "unist-util-visit";

const OPEN = /^%%\s*/;
const CLOSE = /\s*%%$/;

const remarkDek: Plugin<[], Root> = () => {
  return (tree) => {
    visit(tree, "paragraph", (node: Paragraph) => {
      const { children } = node;
      if (children.length === 0) return;

      const first = children[0];
      const last = children[children.length - 1];
      if (first.type !== "text" || last.type !== "text") return;

      const firstText = first as Text;
      const lastText = last as Text;
      if (!OPEN.test(firstText.value) || !CLOSE.test(lastText.value)) return;

      firstText.value = firstText.value.replace(OPEN, "");
      lastText.value = lastText.value.replace(CLOSE, "");

      node.data = node.data ?? {};
      const hProps = (node.data.hProperties ?? {}) as Record<string, unknown>;
      hProps.className = [...(Array.isArray(hProps.className) ? hProps.className : []), "dek"];
      node.data.hProperties = hProps;
    });
  };
};

export default remarkDek;
