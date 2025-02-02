/**
 * Build styles
 */
require("./index.css").toString();

/**
 * Inline Code Tool for the Editor.js
 *
 * Allows to wrap inline fragment and style it somehow.
 */
class InlineCode {
  /**
   * Class name for term-tag
   *
   * @type {string}
   */
  static get CSS() {
    return "cdx-inline-code";
  }

  /**
   * Get Tool icon's title
   * @return {string}
   */
  static get title() {
    return "Code";
  }

  /**
   * Get Tool icon's SVG
   * @return {string}
   */
  get toolboxIcon() {
    return `<svg width="15" height="15" viewBox="0 -1 14 14" xmlns="http://www.w3.org/2000/svg" > <path d="M3.177 6.852c.205.253.347.572.427.954.078.372.117.844.117 1.417 0 .418.01.725.03.92.02.18.057.314.107.396.046.075.093.117.14.134.075.027.218.056.42.083a.855.855 0 0 1 .56.297c.145.167.215.38.215.636 0 .612-.432.934-1.216.934-.457 0-.87-.087-1.233-.262a1.995 1.995 0 0 1-.853-.751 2.09 2.09 0 0 1-.305-1.097c-.014-.648-.029-1.168-.043-1.56-.013-.383-.034-.631-.06-.733-.064-.263-.158-.455-.276-.578a2.163 2.163 0 0 0-.505-.376c-.238-.134-.41-.256-.519-.371C.058 6.76 0 6.567 0 6.315c0-.37.166-.657.493-.846.329-.186.56-.342.693-.466a.942.942 0 0 0 .26-.447c.056-.2.088-.42.097-.658.01-.25.024-.85.043-1.802.015-.629.239-1.14.672-1.522C2.691.19 3.268 0 3.977 0c.783 0 1.216.317 1.216.921 0 .264-.069.48-.211.643a.858.858 0 0 1-.563.29c-.249.03-.417.076-.498.126-.062.04-.112.134-.139.291-.031.187-.052.562-.061 1.119a8.828 8.828 0 0 1-.112 1.378 2.24 2.24 0 0 1-.404.963c-.159.212-.373.406-.64.583.25.163.454.342.612.538zm7.34 0c.157-.196.362-.375.612-.538a2.544 2.544 0 0 1-.641-.583 2.24 2.24 0 0 1-.404-.963 8.828 8.828 0 0 1-.112-1.378c-.009-.557-.03-.932-.061-1.119-.027-.157-.077-.251-.14-.29-.08-.051-.248-.096-.496-.127a.858.858 0 0 1-.564-.29C8.57 1.401 8.5 1.185 8.5.921 8.5.317 8.933 0 9.716 0c.71 0 1.286.19 1.72.574.432.382.656.893.671 1.522.02.952.033 1.553.043 1.802.009.238.041.458.097.658a.942.942 0 0 0 .26.447c.133.124.364.28.693.466a.926.926 0 0 1 .493.846c0 .252-.058.446-.183.58-.109.115-.281.237-.52.371-.21.118-.377.244-.504.376-.118.123-.212.315-.277.578-.025.102-.045.35-.06.733-.013.392-.027.912-.042 1.56a2.09 2.09 0 0 1-.305 1.097c-.2.323-.486.574-.853.75a2.811 2.811 0 0 1-1.233.263c-.784 0-1.216-.322-1.216-.934 0-.256.07-.47.214-.636a.855.855 0 0 1 .562-.297c.201-.027.344-.056.418-.083.048-.017.096-.06.14-.134a.996.996 0 0 0 .107-.396c.02-.195.031-.502.031-.92 0-.573.039-1.045.117-1.417.08-.382.222-.701.427-.954z" /> </svg>`;
  }

  /**
   */
  constructor({ api }) {
    this.api = api;

    /**
     * Toolbar Button
     *
     * @type {HTMLElement|null}
     */
    this.button = null;

    /**
     * Tag represented the term
     *
     * @type {string}
     */
    this.tag = "CODE";

    /**
     * CSS classes
     */
    this.iconClasses = {
      base: this.api.styles.inlineToolButton,
      active: this.api.styles.inlineToolButtonActive,
    };
  }

  /**
   * Specifies Tool as Inline Toolbar Tool
   *
   * @return {boolean}
   */
  static get isInline() {
    return true;
  }

  /**
   * Create button element for Toolbar
   *
   * @return {HTMLElement}
   */
  render() {
    this.button = document.createElement("button");
    this.button.type = "button";
    this.button.classList.add(this.iconClasses.base);
    this.button.innerHTML = this.toolboxIcon;

    return this.button;
  }

  /**
   * Wrap/Unwrap selected fragment
   *
   * @param {Range} range - selected fragment
   */
  surround(range) {
    if (!range) {
      return;
    }

    let termWrapper = this.api.selection.findParentTag(
      this.tag,
      InlineCode.CSS
    );

    /**
     * If start or end of selection is in the highlighted block
     */
    if (termWrapper) {
      this.unwrap(termWrapper);
    } else {
      this.wrap(range);
    }
  }

  /**
   * Wrap selection with term-tag
   *
   * @param {Range} range - selected fragment
   */
  wrap(range) {
    /**
     * Create a wrapper for highlighting
     */
    let span = document.createElement(this.tag);

    span.classList.add(InlineCode.CSS);

    /**
     * SurroundContent throws an error if the Range splits a non-Text node with only one of its boundary points
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Range/surroundContents}
     *
     * // range.surroundContents(span);
     */
    span.appendChild(range.extractContents());
    range.insertNode(span);

    /**
     * Expand (add) selection to highlighted block
     */
    this.api.selection.expandToTag(span);
  }

  /**
   * Unwrap term-tag
   *
   * @param {HTMLElement} termWrapper - term wrapper tag
   */
  unwrap(termWrapper) {
    /**
     * Expand selection to all term-tag
     */
    this.api.selection.expandToTag(termWrapper);

    let sel = window.getSelection();
    let range = sel.getRangeAt(0);

    let unwrappedContent = range.extractContents();

    /**
     * Remove empty term-tag
     */
    termWrapper.parentNode.removeChild(termWrapper);

    /**
     * Insert extracted content
     */
    range.insertNode(unwrappedContent);

    /**
     * Restore selection
     */
    sel.removeAllRanges();
    sel.addRange(range);
  }

  /**
   * Check and change Term's state for current selection
   */
  checkState() {
    const termTag = this.api.selection.findParentTag(this.tag, InlineCode.CSS);

    this.button.classList.toggle(this.iconClasses.active, !!termTag);
  }

  /**
   * Get Tool icon's SVG
   * @return {string}
   */
  get toolboxIcon() {
    return '<svg width="18" height="18" t="1634186782289" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5019" width="200" height="200"><path d="M106.057143 830.171429v-193.828572c0-43.885714-36.571429-80.457143-80.457143-80.457143H0v-84.114285h25.6c43.885714 0 80.457143-36.571429 80.457143-80.457143V193.828571c0-87.771429 73.142857-157.257143 160.914286-157.257142h54.857142v106.057142H266.971429c-29.257143 0-54.857143 21.942857-54.857143 51.2v215.771429c0 43.885714-29.257143 87.771429-73.142857 98.742857 43.885714 14.628571 73.142857 54.857143 73.142857 98.742857v215.771429c0 29.257143 25.6 51.2 54.857143 51.2h54.857142V987.428571H266.971429c-87.771429 0-160.914286-69.485714-160.914286-157.257142z m811.885714-197.485715v193.828572c0 87.771429-73.142857 157.257143-160.914286 157.257143h-54.857142V877.714286h54.857142c29.257143 0 54.857143-21.942857 54.857143-51.2v-215.771429c0-43.885714 29.257143-87.771429 73.142857-98.742857-43.885714-14.628571-73.142857-54.857143-73.142857-98.742857v-219.428572c0-29.257143-25.6-51.2-54.857143-51.2h-54.857142V36.571429h54.857142c87.771429 0 160.914286 69.485714 160.914286 157.257142v193.828572c0 43.885714 36.571429 80.457143 80.457143 80.457143h25.6v84.114285h-25.6c-43.885714 3.657143-80.457143 36.571429-80.457143 80.457143z" p-id="5020"></path></svg>';
  }

  /**
   * Sanitizer rule
   * @return {{span: {class: string}}}
   */
  static get sanitize() {
    return {
      code: {
        class: InlineCode.CSS,
      },
    };
  }
}

module.exports = InlineCode;
