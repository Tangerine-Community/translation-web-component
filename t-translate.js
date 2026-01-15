export class TTranslate extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    // 1. Create a hidden slot to "hold" the Light DOM markers safely
    // 2. Add a span to show our translation
    this.shadowRoot.innerHTML = `
      <style>:host { display: inline; }</style>
      <slot id="source" style="display: none;"></slot>
      <span id="output"></span>
    `;

    this._onLangChange = () => {
      this.shadowRoot.getElementById("output").textContent = "...";
    };
    this._onLangReady = () => {
      this.updateTranslation();
    };

    document.body.addEventListener("lang-change", this._onLangChange);
    document.body.addEventListener("lang-ready", this._onLangReady);

    // Initial render
    this.updateTranslation();
  }

  updateTranslation() {
    // Get the text from the hidden slot (where Lit's markers live)
    const slot = this.shadowRoot.getElementById("source");
    const assignedNodes = slot.assignedNodes({ flatten: true });
    const originalText = assignedNodes
      .map((node) => node.textContent)
      .join("")
      .trim();

    // Translate and put into the output span
    const translated = this.t(originalText);
    this.shadowRoot.getElementById("output").textContent = translated;
  }

  t(fragment) {
    if (!window.translation || !fragment) return fragment;
    return window.translation[fragment] || fragment;
  }

  disconnectedCallback() {
    document.body.removeEventListener("lang-change", this._onLangChange);
    document.body.removeEventListener("lang-ready", this._onLangReady);
  }
}

window.customElements.define("t-translate", TTranslate);
