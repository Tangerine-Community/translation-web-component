export class TLang extends HTMLElement {
  constructor() {
    super();
    this._onMutation = () => this.render();
  }

  connectedCallback() {
    this._observer = new MutationObserver(this._onMutation);
    this._observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["lang"],
    });
    this.render();
  }

  render() {
    const currentLang = (document.documentElement.lang || "en")
      .toLowerCase()
      .split("-")[0];
    const isMatch = this.dataset[currentLang] !== undefined;
    this.hidden = !isMatch;
    this.setAttribute("aria-hidden", (!isMatch).toString());
    if (isMatch && this.style.display === "none") {
      this.style.display = "";
    }
  }
  disconnectedCallback() {
    if (this._observer) this._observer.disconnect();
  }
}

window.customElements.define("t-lang", TLang);