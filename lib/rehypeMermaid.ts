import { visit } from "unist-util-visit";
import { execSync } from "child_process";
import { tmpdir } from "os";
import { join } from "path";
import { writeFileSync, readFileSync, unlinkSync } from "fs";
import type { Plugin } from "unified";
import type { Root, Element } from "hast";


// By default, we will set transparent background. 
// className allows you to add a class to the wrapper of both light and dark images.
// This can be useful if you need to do anything with them downstream, i.e. in mdxComponents.
// 
interface MermaidOptions {
    background?: string;
    className?: string;
}

// Walks over the document tree and replaces Mermaid diagram code blocks with inline SVG images
// for both light and dark theme.
// 
const rehypeMermaid: Plugin<[MermaidOptions?], Root> = (options = {}) => {
    return (tree) => {
        visit(tree, "element", (node: Element) => {
            // We only care about code blocks with language-mermaid.
            // Filter out the elements and return if this is not a code block we're interested in.
            if (
                node.tagName !== "pre" ||
                !Array.isArray(node.children) ||
                node.children.length === 0 ||
                node.children[0].type !== "element" ||
                node.children[0].tagName !== "code" ||
                // @ts-ignore it freaks out because number does not support `includes`
                !node.children[0].properties?.className?.includes("language-mermaid")
            ) {
                return;
            }

            try {
                const codeNode = node.children[0] as Element;

                // Get the mermaid diagram source code from the code block.
                // This is the same for both light and dark mode.
                const mermaidCode = codeNode.children[0].type === "text" ? codeNode.children[0].value : "";

                // Create a temp directory that we'll use to store both the code input files and output files.
                // The reason we need this is that we're going to shell out to mermaid-cli (mmdc)
                // 
                const tempDir = tmpdir();
                const inputFile = join(tempDir, `diagram-${Date.now()}.mmd`);
                const outputLightFile = join(tempDir, `diagram-light-${Date.now()}.svg`);
                const outputDarkFile = join(tempDir, `diagram-dark-${Date.now()}.svg`);

                // Write mermaid content to temp file
                writeFileSync(inputFile, mermaidCode, "utf-8");

                try {
                    // Generate light mode SVG
                    const backgroundArg = options.background ? `-b "${options.background}"` : "-b transparent";
                    const configArg = '-p puppeteer.config.json';
                    execSync(
                        `npx -p @mermaid-js/mermaid-cli mmdc -i "${inputFile}" -o "${outputLightFile}" ${backgroundArg} ${configArg}`,
                        { stdio: "pipe" }
                    );

                    // Generate dark mode SVG
                    execSync(
                        `npx -p @mermaid-js/mermaid-cli mmdc -i "${inputFile}" -o "${outputDarkFile}" ${backgroundArg} --theme dark ${configArg}`,
                        { stdio: "pipe" }
                    );

                    // Read generated SVGs
                    const lightSvgContent = readFileSync(outputLightFile, "utf-8");
                    const darkSvgContent = readFileSync(outputDarkFile, "utf-8");

                    // Create data URLs
                    const lightDataUrl = `data:image/svg+xml;base64,${Buffer.from(lightSvgContent).toString('base64')}`;
                    const darkDataUrl = `data:image/svg+xml;base64,${Buffer.from(darkSvgContent).toString('base64')}`;

                    // Now that we have the SVG sources, let's inject them into the nodes
                    
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
        });

        return tree;
    };
};

export default rehypeMermaid; 