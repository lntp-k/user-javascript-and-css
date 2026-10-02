*://*/*

---

/* Korean-English Typography for Chrome — v2.0.1 (2026-10-02)
 * Paste this entire file into the extension's CSS field.
 * URL matching belongs in the extension settings.
 * Local font fallbacks only; no external font downloads.
 */
:root {
  --ujc-typo-sans: 'Pretendard GOV Variable', 'Pretendard Variable',
    'Pretendard', system-ui, -apple-system, 'Apple SD Gothic Neo',
    'Noto Sans KR', 'Malgun Gothic', sans-serif;
  --ujc-typo-mono: 'D2Coding', 'SFMono-Regular', 'SF Mono', Menlo,
    Monaco, Consolas, 'Liberation Mono', monospace;
  --ujc-typo-reader-size: 1.125rem;
  --ujc-typo-reader-leading: 1.7;
}

/* Inheritance covers ordinary text without overriding every span or icon. */
body {
  font-family: var(--ujc-typo-sans) !important;
}

/* Exclude dedicated renderers, explicit font choices, and editors. */
:where(p, li, dt, dd, td, th, h1, h2, h3, h4, h5, h6):not(:where(
  pre,
  pre *,
  code,
  code *,
  kbd,
  kbd *,
  samp,
  samp *,
  .katex,
  .katex *,
  .MathJax,
  .MathJax *,
  mjx-container,
  mjx-container *,
  math,
  math *,
  .math,
  .math *,
  .monaco-editor,
  .monaco-editor *,
  .CodeMirror,
  .CodeMirror *,
  .cm-editor,
  .cm-editor *,
  .ace_editor,
  .ace_editor *,
  .serif,
  .serif *,
  .font-serif,
  .font-serif *,
  [style*="font" i],
  [style*="font" i] *,
  .icon,
  .icon *,
  [class*="icon-" i],
  [class*="icon-" i] *,
  [class*="-icon" i],
  [class*="-icon" i] *,
  [contenteditable],
  [contenteditable] *
)) {
  font-family: var(--ujc-typo-sans) !important;
}

/* Reading metrics apply to document content, leaving app controls untouched.
 * Add data-typo-reader to a custom reading container when needed.
 */
:where(article, .markdown-body, .prose, .post-content, .medium-content, [data-typo-reader])
:where(p, li, dt, dd):not(:where(
  pre,
  pre *,
  code,
  code *,
  kbd,
  kbd *,
  samp,
  samp *,
  .katex,
  .katex *,
  .MathJax,
  .MathJax *,
  mjx-container,
  mjx-container *,
  math,
  math *,
  .math,
  .math *,
  .monaco-editor,
  .monaco-editor *,
  .CodeMirror,
  .CodeMirror *,
  .cm-editor,
  .cm-editor *,
  .ace_editor,
  .ace_editor *,
  .serif,
  .serif *,
  .font-serif,
  .font-serif *,
  [style*="font" i],
  [style*="font" i] *,
  .icon,
  .icon *,
  [class*="icon-" i],
  [class*="icon-" i] *,
  [class*="-icon" i],
  [class*="-icon" i] *,
  [contenteditable],
  [contenteditable] *
)) {
  font-size: var(--ujc-typo-reader-size) !important;
  line-height: var(--ujc-typo-reader-leading) !important;
  overflow-wrap: anywhere !important;
}

:where(article, .markdown-body, .prose, .post-content, .medium-content, [data-typo-reader])
:where(p, li, dt, dd):lang(ko):not(:where(
  pre,
  pre *,
  code,
  code *,
  kbd,
  kbd *,
  samp,
  samp *,
  .katex,
  .katex *,
  .MathJax,
  .MathJax *,
  mjx-container,
  mjx-container *,
  math,
  math *,
  .math,
  .math *,
  .monaco-editor,
  .monaco-editor *,
  .CodeMirror,
  .CodeMirror *,
  .cm-editor,
  .cm-editor *,
  .ace_editor,
  .ace_editor *,
  .serif,
  .serif *,
  .font-serif,
  .font-serif *,
  [style*="font" i],
  [style*="font" i] *,
  .icon,
  .icon *,
  [class*="icon-" i],
  [class*="icon-" i] *,
  [class*="-icon" i],
  [class*="-icon" i] *,
  [contenteditable],
  [contenteditable] *
)) {
  word-break: keep-all !important;
}

/* Apply monospace to syntax-highlight descendants as well.
 * Embedded math, icon fonts and editor widgets retain their own fonts.
 */
:where(pre, code, kbd, samp, pre *, code *, kbd *, samp *):not(:where(.katex, .katex *, .MathJax, .MathJax *, mjx-container,
  mjx-container *, math, math *, .math, .math *, .icon, .icon *,
  [class*="icon-" i], [class*="icon-" i] *, [class*="-icon" i],
  [class*="-icon" i] *, .monaco-editor, .monaco-editor *,
  .CodeMirror, .CodeMirror *, .cm-editor, .cm-editor *,
  .ace_editor, .ace_editor *, [style*="font" i],
  [style*="font" i] *)) {
  font-family: var(--ujc-typo-mono) !important;
}

/* Keep long code lines inside their block, including on narrow screens. */
pre:not(:where(.monaco-editor *, .CodeMirror *, .cm-editor *, .ace_editor *)) {
  max-width: 100%;
  min-width: 0;
  box-sizing: border-box;
  overflow-x: auto !important;
}

/* Site colors, backgrounds, font weights, math fonts, animations,
 * heading sizes and OS accessibility preferences are left to the site.
 */
