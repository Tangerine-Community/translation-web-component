export class TOption extends HTMLOptionElement {
  constructor() {
    super();
    this._onMutation = () => this.render();
  }

  connectedCallback() {
    // 1. Browser protection
    this.setAttribute("translate", "no");

    // 2. Capture default text via dataset if not already set
    Promise.resolve().then(() => {
      if (!this.dataset.default) {
        this.dataset.default = this.innerText.trim();
      }
      this.render();
    });

    // 3. Self-contained observer
    this._observer = new MutationObserver(this._onMutation);
    this._observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["lang"],
    });
  }

  render() {
    // Current document language (e.g., "fr")
    const currentLang = (document.documentElement.lang || "en")
      .toLowerCase()
      .split("-")[0];

    // Dataset keys are camelCased (e.g., data-en -> dataset.en)
    // We access the key dynamically using bracket notation
    const translation = this.dataset[currentLang];
    const defaultValue = this.dataset.default;

    const targetText = translation || defaultValue;

    if (targetText && this.innerText !== targetText) {
      this.innerText = targetText;
    }
  }

  disconnectedCallback() {
    if (this._observer) {
      this._observer.disconnect();
    }
  }
}

window.customElements.define("t-option", TOption, { extends: "option" });
