export class TLang extends HTMLElement {
  constructor() {
    super();
    this._onMutation = () => this.render();
  }

  connectedCallback() {
    // 1. Self-contained observer for the <html> tag
    this._observer = new MutationObserver(this._onMutation);
    this._observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["lang"],
    });

    // 2. Initial render
    this.render();
  }

  render() {
    // Get base lang (e.g., 'fr' from 'fr-CA')
    const currentLang = (document.documentElement.lang || "en")
      .toLowerCase()
      .split("-")[0];

    // Check if the currentLang exists in the dataset (e.g., data-fr)
    // dataset[currentLang] will be "" (truthy) if the attribute exists
    const isMatch = this.dataset[currentLang] !== undefined;

    // Toggle visibility and accessibility
    this.hidden = !isMatch;
    this.setAttribute("aria-hidden", (!isMatch).toString());

    // Ensure display isn't overwritten if we want it to be inline
    if (isMatch && this.style.display === "none") {
      this.style.display = "";
    }
  }

  disconnectedCallback() {
    if (this._observer) this._observer.disconnect();
  }
}

window.customElements.define("t-lang", TLang);
