/**
 * `t-lang`
 * Displays contents only if the document language matches one of its attributes.
 */
class TLang extends HTMLElement {
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

    if (currentLang.length > 0) {
      // Use .hasAttribute() for a more reliable check
      if (this.hasAttribute(currentLang)) {
        this.style.display = "inline";
        this.setAttribute("aria-hidden", "false");
      } else {
        this.style.display = "none";
        this.setAttribute("aria-hidden", "true");
      }
    }
  }
}

window.customElements.define("t-lang", TLang);
