import { visit } from "unist-util-visit";
import { execSync } from "child_process";
import { tmpdir } from "os";
import { join } from "path";
import { writeFileSync, readFileSync, unlinkSync } from "fs";
import type { Plugin } from "unified";
import type { Root, Element } from "hast";

interface MermaidOptions {
  background?: string;
  className?: string;
  browserlessUrl?: string;
}

const rehypeMermaid: Plugin<[MermaidOptions?], Root> = (options = {}) => {
  const browserlessUrl = options.browserlessUrl || "wss://browserless-aynfx6l6dq-uw.a.run.app";
  if (!browserlessUrl) {
    throw new Error("BROWSERLESS_URL environment variable or browserlessUrl option is required");
  }

  return (tree) => {
    const promises: Promise<void>[] = [];

    // We only care about code blocks with language-mermaid.
    //
    visit(tree, "element", (node: Element) => {
      if (
        node.tagName !== "pre" ||
        !Array.isArray(node.children) ||
        node.children.length === 0 ||
        node.children[0].type !== "element" ||
        node.children[0].tagName !== "code" ||
         // @ts-ignore
        !node.children[0].properties?.className?.includes("language-mermaid")
      ) {
        return;
      }

      promises.push((async () => {
        try {
          const codeNode = node.children[0] as Element;
          const mermaidCode = codeNode.children[0].type === "text" ? codeNode.children[0].value : "";
          const tempDir = tmpdir();
          const inputFile = join(tempDir, `diagram-${Date.now()}.mmd`);
          const outputLightFile = join(tempDir, `diagram-light-${Date.now()}.svg`);
          const outputDarkFile = join(tempDir, `diagram-dark-${Date.now()}.svg`);
          const puppeteerConfigFile = join(tempDir, `puppeteer-config-${Date.now()}.json`);

          // Write mermaid content to temp file
          writeFileSync(inputFile, mermaidCode, "utf-8");

          // Create Puppeteer config for browserless.
          const puppeteerConfig = { browserWSEndpoint: browserlessUrl };
          writeFileSync(puppeteerConfigFile, JSON.stringify(puppeteerConfig), "utf-8");

          try {
            // Generate light mode SVG
            const backgroundArg = options.background ? `-b "${options.background}"` : "-b transparent";
            execSync(
              `npx -p @mermaid-js/mermaid-cli mmdc -i "${inputFile}" -o "${outputLightFile}" ${backgroundArg} -p "${puppeteerConfigFile}"`,
              { stdio: "pipe" }
            );

            // Generate dark mode SVG
            execSync(
              `npx -p @mermaid-js/mermaid-cli mmdc -i "${inputFile}" -o "${outputDarkFile}" ${backgroundArg} --theme dark -p "${puppeteerConfigFile}"`,
              { stdio: "pipe" }
            );

            // Read generated SVGs
            const lightSvgContent = readFileSync(outputLightFile, "utf-8");
            const darkSvgContent = readFileSync(outputDarkFile, "utf-8");

            // Create data URLs
            const lightDataUrl = `data:image/svg+xml;base64,${Buffer.from(lightSvgContent).toString('base64')}`;
            const darkDataUrl = `data:image/svg+xml;base64,${Buffer.from(darkSvgContent).toString('base64')}`;
            
            // Create a wrapper div
            node.tagName = "div";
            node.properties = {
              className: options.className || "mermaid-diagram"
            };
            
            // Add both light and dark mode images
            node.children = [
              {
                type: "element",
                tagName: "img",
                properties: {
                  src: lightDataUrl,
                  className: "mermaid-light"
                },
                children: []
              },
              {
                type: "element",
                tagName: "img",
                properties: {
                  src: darkDataUrl,
                  className: "mermaid-dark"
                },
                children: []
              }
            ];

          } finally {
            // Clean up temp files
            try {
              unlinkSync(inputFile);
              unlinkSync(outputLightFile);
              unlinkSync(outputDarkFile);
              unlinkSync(puppeteerConfigFile);
            } catch (e) {
              // Ignore cleanup errors
            }
          }
        } catch (error) {
          // On error, keep the original mermaid code block but add a comment
          console.error("Failed to process mermaid diagram:", error);
          node.children.unshift({
            type: "comment",
            value: `Failed to process mermaid diagram: ${error.message}`
          });
        }
      })());
    });

    return Promise.all(promises).then(() => {
      console.log("Successfully processed all Mermaid diagrams");
    }).catch(error => {
      console.error("Failed to process one or more Mermaid diagrams:", error);
    });
  };
};

export default rehypeMermaid; 