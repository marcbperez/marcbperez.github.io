import Prism from "https://esm.sh/prismjs";
import htm from "https://esm.sh/htm";
import { h, render } from "https://esm.sh/preact";
import { useLayoutEffect } from "https://esm.sh/preact/hooks";
import { useStoredState } from "./hooks/useStoredState.js";

const html = htm.bind(h);

export function CodeHighlighter() {
  const dark = "https://esm.sh/prismjs/themes/prism-okaidia.min.css";
  const light = "https://esm.sh/prismjs/themes/prism-solarizedlight.min.css";

  const updateCss = () => {
    // Resolve the theme.
    let theme = read("theme") || "detect";
    if (theme === "detect") {
      theme = matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark" : "light";
    }
    // Set Prism's CSS element.
    let cssLink = document.getElementById("code-highlighter-theme");
    if (!cssLink) {
      cssLink = document.createElement("link");
      cssLink.rel = "stylesheet";
      cssLink.id = "code-highlighter-theme";
      document.head.appendChild(cssLink);
    }
    // Set Prism's theme.
    cssLink.href = theme === "dark" ? dark : light;
  }

  const { read } = useStoredState("themeform", updateCss);

  useLayoutEffect(() => {
    updateCss();

    // Set the highlighter for each code element.
    [...document.querySelectorAll("code")].forEach(code => {
      const highlighter = (
        code.parentElement.nodeName === "PRE" &&
        code.parentElement.getAttribute("class")
      )
        ? `language-${code.parentElement.getAttribute("class")}`
        : "language-markup";
      code.classList.add(highlighter);
      code.setAttribute("data-prismjs-copy", "📋");
      code.setAttribute("data-prismjs-copy-success", "✅");
      code.setAttribute("data-prismjs-copy-error", "❌");
    });
    // Highlight the code elements.
    try {
      Prism.highlightAll();
    } catch (error) { }
  }, []);

  return null;
}

render(html`<${CodeHighlighter} />`, document.getElementById("code-highlighter"));
