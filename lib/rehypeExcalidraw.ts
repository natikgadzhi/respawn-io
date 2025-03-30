import { visit } from "unist-util-visit";
import { existsSync, readFileSync } from "fs";
import { join, dirname } from "path";
import type { Plugin } from "unified";
import type { Root } from "hast";

// Options for the Excalidraw plugin
interface ExcalidrawOptions {
  className?: string;
}

// Walks over the document tree and replaces Excalidraw wikilinks with inline SVG images
// for both light and dark theme.
const rehypeExcalidraw: Plugin<[ExcalidrawOptions?], Root> = (options = {}) => {
  return (tree, file) => {
    // Track paragraphs that contain Excalidraw diagrams
    let paragraphsToReplace = [];

    // Find paragraphs containing Excalidraw diagrams
    visit(tree, "element", (node) => {
      if (node.tagName !== "p") return;

      // Check if this paragraph has a text node with the Excalidraw pattern
      if (node.children.length === 1 && node.children[0].type === "text") {
        const textNode = node.children[0];
        const regex = /^!\[\[(.*\.excalidraw)\]\]$/;
        
        if (regex.test(textNode.value.trim())) {
          paragraphsToReplace.push(node);
        }
      }
    });

    // Process the paragraphs
    for (const paragraph of paragraphsToReplace) {
      const textNode = paragraph.children[0];
      const match = textNode.value.trim().match(/^!\[\[(.*\.excalidraw)\]\]$/);
      if (!match || !match[1]) continue;

      const diagramName = match[1];
      const parentDir = dirname(file.path);
      const assetsDir = join(parentDir, "assets");
      
      const lightSvgPath = join(assetsDir, `${diagramName}.light.svg`);
      const darkSvgPath = join(assetsDir, `${diagramName}.dark.svg`);
      
      try {
        if (existsSync(lightSvgPath) && existsSync(darkSvgPath)) {
          const lightSvgContent = readFileSync(lightSvgPath, "utf-8");
          const darkSvgContent = readFileSync(darkSvgPath, "utf-8");
          
          const lightDataUrl = `data:image/svg+xml;base64,${Buffer.from(
            lightSvgContent
          ).toString("base64")}`;
          const darkDataUrl = `data:image/svg+xml;base64,${Buffer.from(
            darkSvgContent
          ).toString("base64")}`;
          
          paragraph.tagName = "div";
          paragraph.properties = {
            className: options.className || "excalidraw-diagram"
          };
          
          paragraph.children = [
            {
              type: "element",
              tagName: "img",
              properties: {
                src: lightDataUrl,
                className: "excalidraw-light",
                alt: `Diagram: ${diagramName}`
              },
              children: []
            },
            {
              type: "element",
              tagName: "img",
              properties: {
                src: darkDataUrl,
                className: "excalidraw-dark",
                alt: `Diagram: ${diagramName}`
              },
              children: []
            }
          ];
        }
      } catch (error) {
        console.error(`Failed to process Excalidraw diagram ${diagramName}:`, error);
      }
    }

    return tree;
  };
};

export default rehypeExcalidraw;
