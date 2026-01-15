import { getTranslation } from "./util.js";

const template = document.createElement("template");
template.innerHTML = `
  <style>
    label {
      background: var(--t-select_label_background);
      border: var(--t-select_label_border);
      margin: var(--t-select_label_margin);
      padding: var(--t-select_label_padding);
    }
    select {
      background: var(--t-select_select_background);
      border: var(--t-select_select_border);
      margin: var(--t-select_select_margin);
      padding: var(--t-select_select_padding);
    }
  </style>

  <form>
    <label for="translation">
      <slot name="label"></slot>
    </label>
    <select id="translation"></select>
  </form>
`;

export class TSelect extends HTMLElement {
  static get observedAttributes() {
    return [
      "current-language-code",
      "current-language-direction",
      "path-to-translation-definitions",
      "skip-initial-translation-load",
      "disable-json-translations",
      "disable-language-label-translations",
    ];
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    // Defaults
    this._currentLanguageCode = "en";
    this._currentLanguageDirection = "ltr";
    this._translationDefinitions = [];
    this._pathToTranslationDefinitions = "translation-definitions.json";
    this._skipInitialTranslationLoad = false;
    this._disableJsonTranslations = false;
    this._disableLanguageLabelTranslations = false;
    this._ready = false;

    // Cache nodes
    this._select = this.shadowRoot.getElementById("translation");

    // Bind handlers
    this._onChange = this._onChange.bind(this);
  }

  // --- Lifecycle ---
  async connectedCallback() {
    this._select.addEventListener("change", this._onChange);

    // mirror Lit behavior: documentElement.lang wins if set
    const docLang = document.documentElement.lang;
    if (docLang) this.currentLanguageCode = docLang;

    if (!this.skipInitialTranslationLoad) {
      await this._initializeTranslations();
    }

    this._ready = true;
    this._render();
  }

  disconnectedCallback() {
    this._select.removeEventListener("change", this._onChange);
  }

  attributeChangedCallback(name, oldVal, newVal) {
    if (oldVal === newVal) return;

    switch (name) {
      case "current-language-code":
        this._currentLanguageCode = newVal ?? "en";
        break;
      case "current-language-direction":
        this._currentLanguageDirection = newVal ?? "ltr";
        break;
      case "path-to-translation-definitions":
        this._pathToTranslationDefinitions =
          newVal ?? "translation-definitions.json";
        break;
      case "skip-initial-translation-load":
        this._skipInitialTranslationLoad = newVal !== null;
        break;
      case "disable-json-translations":
        this._disableJsonTranslations = newVal !== null;
        break;
      case "disable-language-label-translations":
        this._disableLanguageLabelTranslations = newVal !== null;
        break;
    }

    this._render();
  }

  // --- Properties (public API) ---
  get currentLanguageCode() {
    return this._currentLanguageCode;
  }
  set currentLanguageCode(v) {
    this._currentLanguageCode = String(v ?? "en");
    this.setAttribute("current-language-code", this._currentLanguageCode);
    this._render();
  }

  get currentLanguageDirection() {
    return this._currentLanguageDirection;
  }
  set currentLanguageDirection(v) {
    this._currentLanguageDirection = String(v ?? "ltr");
    this.setAttribute(
      "current-language-direction",
      this._currentLanguageDirection,
    );
    this._render();
  }

  get translationDefinitions() {
    return this._translationDefinitions;
  }
  set translationDefinitions(v) {
    this._translationDefinitions = Array.isArray(v) ? v : [];
    this._render();
  }

  get pathToTranslationDefinitions() {
    return this._pathToTranslationDefinitions;
  }
  set pathToTranslationDefinitions(v) {
    this._pathToTranslationDefinitions = String(
      v ?? "translation-definitions.json",
    );
    this.setAttribute(
      "path-to-translation-definitions",
      this._pathToTranslationDefinitions,
    );
  }

  get skipInitialTranslationLoad() {
    return this._skipInitialTranslationLoad;
  }
  set skipInitialTranslationLoad(v) {
    const bool = Boolean(v);
    this._skipInitialTranslationLoad = bool;
    if (bool) this.setAttribute("skip-initial-translation-load", "");
    else this.removeAttribute("skip-initial-translation-load");
  }

  get disableJsonTranslations() {
    return this._disableJsonTranslations;
  }
  set disableJsonTranslations(v) {
    const bool = Boolean(v);
    this._disableJsonTranslations = bool;
    if (bool) this.setAttribute("disable-json-translations", "");
    else this.removeAttribute("disable-json-translations");
  }

  get disableLanguageLabelTranslations() {
    return this._disableLanguageLabelTranslations;
  }
  set disableLanguageLabelTranslations(v) {
    const bool = Boolean(v);
    this._disableLanguageLabelTranslations = bool;
    if (bool) this.setAttribute("disable-language-label-translations", "");
    else this.removeAttribute("disable-language-label-translations");
  }

  get ready() {
    return this._ready;
  }

  // --- Internals ---
  async _initializeTranslations() {
    const path =
      this._pathToTranslationDefinitions || "translation-definitions.json";
    const url = path.startsWith("/") ? path : `/${path}`;

    const response = await fetch(url);
    if (!response.ok) throw new Error("Could not find JSON");
    this.translationDefinitions = await response.json();
  }

  _render() {
    if (!this.shadowRoot) return;

    // Simple loading state: disable select + show single placeholder option
    if (!this._ready) {
      this._select.innerHTML = `<option value="">...</option>`;
      this._select.value = "";
      this._select.disabled = true;
      return;
    }

    this._select.disabled = false;

    // Build options
    const defs = Array.isArray(this._translationDefinitions)
      ? this._translationDefinitions
      : [];
    const current = this._currentLanguageCode;

    this._select.innerHTML = defs
      .map((t) => {
        const selected = t.languageCode === current ? "selected" : "";

        // Instead of using the <t-translate> component which browsers strip out:
        const labelText = this._disableLanguageLabelTranslations
          ? String(t.label ?? "")
          : getTranslation(t.label, t.label); // Fetch from window.translation if it exists

        return `<option value="${this._escapeAttr(t.languageCode)}" ${selected}>
              ${this._escapeHtml(labelText)}
            </option>`;
      })
      .join("");

    // Ensure the select reflects the current value after DOM update
    this._select.value = current;
  }

  _escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  _escapeAttr(str) {
    // good enough for value attributes
    return this._escapeHtml(str);
  }

  async _onChange(e) {
    const val = e.target.value;
    await this.setLanguage(val);

    this.dispatchEvent(
      new CustomEvent("change", {
        detail: { languageCode: val },
        bubbles: true,
        composed: true,
      }),
    );
  }

  async setLanguage(languageCode) {
    const def = (this._translationDefinitions || []).find(
      (d) => d.languageCode === languageCode,
    );
    if (!def) return;

    // update internal state
    this._currentLanguageCode = languageCode;
    this._currentLanguageDirection = def.languageDirection;

    // reflect attributes (keeps external bindings in sync)
    this.setAttribute("current-language-code", this._currentLanguageCode);
    this.setAttribute(
      "current-language-direction",
      this._currentLanguageDirection,
    );

    // update global attrs
    document.documentElement.lang = languageCode;
    document.documentElement.dir = def.languageDirection;
    document.body.dispatchEvent(new CustomEvent("lang-change"));

    if (this._disableJsonTranslations) {
      this._render(); // sync select value
      return;
    }

    try {
      const res = await fetch(
        `${window.location.origin}/translation.${languageCode}.json`,
      );
      const json = await res.json();
      window.translation = json;
      document.body.dispatchEvent(new CustomEvent("lang-ready"));
      this._render(); // ensure select reflects state
    } catch (err) {
      console.error("t-select: Fetch error", err);
    }
  }
}

customElements.define("t-select", TSelect);
