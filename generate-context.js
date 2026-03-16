import fs from "fs";
import path from "path";

const OUT_FILE = "mcp-context.md";
const IGNORE_DIRS = ["node_modules", "dist", ".git", ".vscode"];
const IGNORE_FILES = [
  "package-lock.json",
  OUT_FILE,
  "mcp-server.js",
  "generate-context.js",
  ".env",
  ".env.local",
];

function getAllFiles(dirPath, arrayOfFiles = []) {
  if (!fs.existsSync(dirPath)) return arrayOfFiles;

  const files = fs.readdirSync(dirPath);

  files.forEach((file) => {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      if (!IGNORE_DIRS.includes(file)) {
        arrayOfFiles = getAllFiles(fullPath, arrayOfFiles);
      }
    } else {
      if (!IGNORE_FILES.includes(file)) {
        arrayOfFiles.push(fullPath);
      }
    }
  });

  return arrayOfFiles;
}

function generateDump() {
  const rootDir = process.cwd();
  // Filter for relevant source code files to bundle
  const allFiles = getAllFiles(rootDir).filter((f) => {
    const relPath = path.relative(rootDir, f).replace(/\\/g, "/");
    return (
      relPath.startsWith("src/") ||
      relPath === "package.json" ||
      relPath === "README.md" ||
      relPath === "index.html" ||
      relPath === "vite.config.js" ||
      relPath === "tailwind.config.js" ||
      relPath === "app_description.md"
    );
  });

  let dumpContent = `# FinCalc Rebuild Project Context Dump\n\n`;
  dumpContent += `This file contains the complete source code and structural context for the FinCalc Rebuild application, which can be provided to an LLM or an AI Agent in another project.\n\n`;

  for (const file of allFiles) {
    const relPath = path.relative(rootDir, file).replace(/\\/g, "/");
    
    // Determine the markdown language for syntax highlighting
    const ext = path.extname(file).toLowerCase();
    let lang = "";
    if (ext === ".js" || ext === ".jsx") lang = "javascript";
    else if (ext === ".ts" || ext === ".tsx") lang = "typescript";
    else if (ext === ".css") lang = "css";
    else if (ext === ".html") lang = "html";
    else if (ext === ".json") lang = "json";
    else if (ext === ".md") lang = "markdown";

    dumpContent += `## ${relPath}\n\n`;
    dumpContent += "```" + lang + "\n";
    try {
      const content = fs.readFileSync(file, "utf8");
      dumpContent += content;
    } catch (e) {
      dumpContent += `[Error reading file: ${e.message}]\n`;
    }
    dumpContent += "\n```\n\n";
  }

  fs.writeFileSync(OUT_FILE, dumpContent);
  console.log(`Successfully generated project context to ${OUT_FILE}`);
}

generateDump();
