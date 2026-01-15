/**
 * `t-lang`
 * Displays contents only if the document language matches one of its attributes.
 */
export class TLang extends HTMLElement {
  constructor() {
    super();
    // Binding the listener once so it can be removed if the element is destroyed
    this._onLangChange = () => this.render();
  }

  connectedCallback() {
    this.render();
    document.body.addEventListener("lang-change", this._onLangChange);
  }

  disconnectedCallback() {
    document.body.removeEventListener("lang-change", this._onLangChange);
  }

  render() {
    const currentLang = document.documentElement.lang.toLowerCase();
    const isMatched = this.hasAttribute(currentLang);
    if (isMatched) {
      this.removeAttribute("hidden");
      this.setAttribute("aria-hidden", "false");
    } else {
      this.setAttribute("hidden", "");
      this.setAttribute("aria-hidden", "true");
    }
  }
}

window.customElements.define("t-lang", TLang);
