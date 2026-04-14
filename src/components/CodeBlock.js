"use client";

import { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

const languageMap = {
  javascript: "javascript",
  typescript: "typescript",
  python: "python",
  java: "java",
  sql: "sql",
  html: "html",
  css: "css",
  react: "jsx",
  nextjs: "jsx",
  nodejs: "javascript",
  bash: "bash",
  shell: "bash",
  powershell: "powershell",
  docker: "docker",
  json: "json",
  yaml: "yaml",
  markdown: "markdown",
  prisma: "graphql",
  graphql: "graphql",
  php: "php",
  ruby: "ruby",
  go: "go",
  rust: "rust",
  csharp: "csharp",
  cpp: "cpp",
  vue: "javascript",
  express: "javascript",
  tailwind: "css",
};

const customTheme = {
  ...oneDark,
  'pre[class*="language-"]': {
    ...oneDark['pre[class*="language-"]'],
    background: "transparent",
  },
  'code[class*="language-"]': {
    ...oneDark['code[class*="language-"]'],
    background: "transparent",
  },
};

export default function CodeBlock({ code, language, maxHeight, showCopy = false }) {
  const [copied, setCopied] = useState(false);

  const syntaxLang = languageMap[language] || "text";

  async function handleCopy() {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="relative group">
      {showCopy && (
        <button
          onClick={handleCopy}
          className="absolute top-2 right-2 px-2 py-1 rounded text-xs bg-[#21262d] border border-[#30363d] text-[#8b949e] hover:text-[#d2a8ff] hover:border-[#d2a8ff] opacity-0 group-hover:opacity-100 transition-all z-10"
        >
          {copied ? "Copiado!" : "Copiar"}
        </button>
      )}
      <SyntaxHighlighter
        language={syntaxLang}
        style={customTheme}
        customStyle={{
          margin: 0,
          padding: "12px",
          borderRadius: "8px",
          fontSize: "12px",
          lineHeight: "1.6",
          maxHeight: maxHeight || "none",
          overflow: "hidden",
          background: "#0d1117",
          border: "none",
        }}
        wrapLongLines={true}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}
