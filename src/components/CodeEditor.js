"use client";

import { useEffect, useRef } from "react";
import { EditorView, keymap, lineNumbers, highlightActiveLineGutter, highlightActiveLine } from "@codemirror/view";
import { EditorState } from "@codemirror/state";
import { defaultKeymap, indentWithTab, history, historyKeymap } from "@codemirror/commands";
import { indentOnInput, bracketMatching, syntaxHighlighting, HighlightStyle } from "@codemirror/language";
import { tags } from "@lezer/highlight";
import { autocompletion, closeBrackets } from "@codemirror/autocomplete";
import { javascript } from "@codemirror/lang-javascript";
import { python } from "@codemirror/lang-python";
import { html } from "@codemirror/lang-html";
import { css } from "@codemirror/lang-css";
import { sql } from "@codemirror/lang-sql";
import { json } from "@codemirror/lang-json";
import { java } from "@codemirror/lang-java";
import { php } from "@codemirror/lang-php";
import { rust } from "@codemirror/lang-rust";
import { xml } from "@codemirror/lang-xml";
import { markdown } from "@codemirror/lang-markdown";

const githubDarkHighlight = HighlightStyle.define(
  [
    { tag: tags.keyword,                          color: "#ff7b72" },
    { tag: tags.controlKeyword,                   color: "#ff7b72" },
    { tag: tags.operatorKeyword,                  color: "#ff7b72" },
    { tag: tags.definitionKeyword,                color: "#ff7b72" },
    { tag: tags.moduleKeyword,                    color: "#ff7b72" },
    { tag: tags.modifier,                         color: "#ff7b72" },
    { tag: tags.string,                           color: "#a5d6ff" },
    { tag: tags.special(tags.string),             color: "#a5d6ff" },
    { tag: tags.regexp,                           color: "#a5d6ff" },
    { tag: tags.number,                           color: "#79c0ff" },
    { tag: tags.bool,                             color: "#79c0ff" },
    { tag: tags.null,                             color: "#79c0ff" },
    { tag: tags.comment,                          color: "#8b949e", fontStyle: "italic" },
    { tag: tags.lineComment,                      color: "#8b949e", fontStyle: "italic" },
    { tag: tags.blockComment,                     color: "#8b949e", fontStyle: "italic" },
    { tag: tags.function(tags.name),              color: "#d2a8ff" },
    { tag: tags.function(tags.variableName),      color: "#d2a8ff" },
    { tag: tags.definition(tags.function(tags.variableName)), color: "#d2a8ff" },
    { tag: tags.className,                        color: "#ffa657" },
    { tag: tags.definition(tags.name),            color: "#e6edf3" },
    { tag: tags.typeName,                         color: "#ffa657" },
    { tag: tags.typeOperator,                     color: "#ff7b72" },
    { tag: tags.operator,                         color: "#e6edf3" },
    { tag: tags.punctuation,                      color: "#e6edf3" },
    { tag: tags.bracket,                          color: "#e6edf3" },
    { tag: tags.variableName,                     color: "#e6edf3" },
    { tag: tags.propertyName,                     color: "#e6edf3" },
    { tag: tags.attributeName,                    color: "#7ee787" },
    { tag: tags.attributeValue,                   color: "#a5d6ff" },
    { tag: tags.tagName,                          color: "#7ee787" },
    { tag: tags.angleBracket,                     color: "#8b949e" },
    { tag: tags.self,                             color: "#79c0ff" },
    { tag: tags.constant(tags.name),              color: "#79c0ff" },
    { tag: tags.namespace,                        color: "#ffa657" },
    { tag: tags.annotation,                       color: "#ffa657" },
    { tag: tags.meta,                             color: "#8b949e" },
    { tag: tags.invalid,                          color: "#f78166" },
  ],
  { themeType: "dark" }
);

const languageExtension = (lang) => {
  switch (lang) {
    case "javascript":
    case "nodejs":
    case "nextjs":
    case "express":
    case "vue":
      return javascript();
    case "json":
      return json();
    case "typescript":
      return javascript({ typescript: true });
    case "react":
      return javascript({ jsx: true });
    case "python":
      return python();
    case "html":
    case "tailwind":
      return html();
    case "css":
      return css();
    case "sql":
    case "postgresql":
      return sql();
    case "java":
      return java();
    case "php":
      return php();
    case "rust":
      return rust();
    case "markdown":
      return markdown();
    case "xml":
    case "docker":
      return xml();
    default:
      return javascript();
  }
};

const darkTheme = EditorView.theme(
  {
    "&": {
      backgroundColor: "#0d1117",
      color: "#e6edf3",
      borderRadius: "8px",
      border: "1px solid #30363d",
      fontSize: "13px",
      fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', 'Consolas', monospace",
    },
    "&.cm-focused": {
      outline: "none",
      border: "1px solid transparent",
      boxShadow: "0 0 0 2px #d2a8ff",
    },
    ".cm-scroller": {
      fontFamily: "inherit",
      lineHeight: "1.6",
      padding: "4px 0",
    },
    ".cm-content": {
      padding: "8px 0",
      caretColor: "#d2a8ff",
    },
    ".cm-line": {
      padding: "0 12px 0 8px",
    },
    ".cm-gutters": {
      backgroundColor: "#0d1117",
      borderRight: "1px solid #21262d",
      color: "#484f58",
      minWidth: "40px",
    },
    ".cm-lineNumbers .cm-gutterElement": {
      padding: "0 12px 0 8px",
      minWidth: "32px",
    },
    ".cm-activeLineGutter": {
      backgroundColor: "#161b22",
      color: "#8b949e",
    },
    ".cm-activeLine": {
      backgroundColor: "#161b2280",
    },
    ".cm-cursor": {
      borderLeftColor: "#d2a8ff",
      borderLeftWidth: "2px",
    },
    ".cm-selectionBackground, ::selection": {
      backgroundColor: "#d2a8ff33 !important",
    },
    ".cm-matchingBracket": {
      backgroundColor: "#d2a8ff22",
      outline: "1px solid #d2a8ff66",
      borderRadius: "2px",
    },
    ".cm-tooltip": {
      backgroundColor: "#161b22",
      border: "1px solid #30363d",
      borderRadius: "6px",
    },
    ".cm-tooltip-autocomplete ul li[aria-selected]": {
      backgroundColor: "#1f1d2e",
      color: "#d2a8ff",
    },
  },
  { dark: true }
);

export default function CodeEditor({ value, onChange, language = "javascript", minHeight = "240px" }) {
  const containerRef = useRef(null);
  const viewRef = useRef(null);
  const onChangeRef = useRef(onChange);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    if (!containerRef.current) return;

    const state = EditorState.create({
      doc: value || "",
      extensions: [
        lineNumbers(),
        highlightActiveLineGutter(),
        highlightActiveLine(),
        history(),
        indentOnInput(),
        bracketMatching(),
        closeBrackets(),
        autocompletion(),
        syntaxHighlighting(githubDarkHighlight, { fallback: false }),
        keymap.of([indentWithTab, ...defaultKeymap, ...historyKeymap]),
        languageExtension(language),
        darkTheme,
        EditorView.lineWrapping,
        EditorView.updateListener.of((update) => {
          if (update.docChanged) {
            onChangeRef.current(update.state.doc.toString());
          }
        }),
        EditorView.theme({ "&": { minHeight } }),
      ],
    });

    const view = new EditorView({ state, parent: containerRef.current });
    viewRef.current = view;

    return () => {
      view.destroy();
      viewRef.current = null;
    };
  }, [language]);

  useEffect(() => {
    const view = viewRef.current;
    if (!view) return;
    const current = view.state.doc.toString();
    if (current !== value) {
      view.dispatch({
        changes: { from: 0, to: current.length, insert: value || "" },
      });
    }
  }, [value]);

  return <div ref={containerRef} className="rounded-lg overflow-hidden" />;
}
