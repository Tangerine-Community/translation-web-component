export class TOption extends HTMLOptionElement {
  constructor() {
    super();
    this._onMutation = () => this.render();
  }

  connectedCallback() {
    Promise.resolve().then(() => {
      if (!this.dataset.default) {
        this.dataset.default = this.innerText.trim();
      }
      this.render();
    });
    this._observer = new MutationObserver(this._onMutation);
    this._observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["lang"],
    });
  }

  render() {
    const currentLang = (document.documentElement.lang || "en")
      .toLowerCase()
      .split("-")[0];
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
