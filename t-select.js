import { html, css, LitElement } from "lit";

/**
 * `t-select`
 * Modern Lit 3 - Standard JavaScript (No Decorators)
 */
export class TSelect extends LitElement {
  // 1. Define properties using the static getter (Universal JS)
  static get properties() {
    return {
      label: { type: String },
      currentLanguageCode: { type: String, attribute: "current-language-code" },
      currentLanguageDirection: {
        type: String,
        attribute: "current-language-direction",
      },
      translationDefinitions: { type: Array },
      pathToTranslationDefinitions: { type: String },
      basePath: { type: String },
      skipInitialTranslationLoad: { type: Boolean },
      disableJsonTranslations: { type: Boolean },
      disableLanguageLabelTranslations: { type: Boolean },
      ready: { type: Boolean, state: true }, // Internal state
    };
  }

  constructor() {
    super();
    // Default values
    this.label = "Language";
    this.currentLanguageCode = "en";
    this.currentLanguageDirection = "ltr";
    this.translationDefinitions = [];
    this.pathToTranslationDefinitions = "./translation-definitions.json";
    this.basePath = "./";
    this.skipInitialTranslationLoad = false;
    this.disableJsonTranslations = false;
    this.disableLanguageLabelTranslations = false;
    this.ready = false;
  }

  static styles = css`
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
  `;

  async connectedCallback() {
    super.connectedCallback();

    const docLang = document.documentElement.lang;
    if (docLang) {
      this.currentLanguageCode = docLang;
    }

    if (!this.skipInitialTranslationLoad) {
      await this._initializeTranslations();
    }
    this.ready = true;
  }

  async _initializeTranslations() {
    try {
      if (!this.disableJsonTranslations) {
        const res = await fetch(this.pathToTranslationDefinitions);
        this.translationDefinitions = await res.json();
      }

      // Only set language if window.translation isn't already populated
      if (!window.translation) {
        await this.setLanguage(this.currentLanguageCode);
      }
    } catch (e) {
      console.error("t-select: Initialization failed", e);
    }
  }

  render() {
    if (!this.ready) return html`<span>...</span>`;

    return html`
      <form>
        <label for="translation">
          <t-translate>${this.label}</t-translate>
        </label>
        <select
          id="translation"
          .value="${this.currentLanguageCode}"
          @change="${this._onTranslationSelect}"
        >
          ${this.translationDefinitions.map(
            (t) => html`
            <option
              value="${t.languageCode}"
              ?selected="${t.languageCode === this.currentLanguageCode}"
            >
              ${
                this.disableLanguageLabelTranslations
                  ? t.label
                  : html`<t-translate>${t.label}</t-translate>`
              }
            </option>
          `,
          )}
        </select>
      </form>
    `;
  }

  async _onTranslationSelect(e) {
    // 1. Use e.target for better compatibility
    const val = e.target.value;

    // 2. Perform the async work
    await this.setLanguage(val);

    // 3. Dispatch the event AFTER state is updated
    this.dispatchEvent(
      new CustomEvent("change", {
        detail: { languageCode: val },
        bubbles: true,
        composed: true,
      }),
    );
  }

  async setLanguage(languageCode) {
    const def = this.translationDefinitions.find(
      (d) => d.languageCode === languageCode,
    );
    if (!def) return;

    // Update internal properties FIRST
    this.currentLanguageCode = languageCode;
    this.currentLanguageDirection = def.languageDirection;

    // Update global attributes
    document.documentElement.lang = languageCode;
    document.documentElement.dir = def.languageDirection;

    document.body.dispatchEvent(new CustomEvent("lang-change"));

    if (this.disableJsonTranslations) {
      this.requestUpdate(); // Force Lit to sync visually
      return;
    }

    const path = def.filePath
      ? `${this.basePath}${def.filePath}`
      : `${this.basePath}/translation.${languageCode}.json`;

    try {
      const res = await fetch(path);
      const json = await res.json();

      // Update the global translation object
      window.translation = json;

      // Signal to the rest of the app
      document.body.dispatchEvent(new CustomEvent("lang-ready"));

      // IMPORTANT: Trigger a re-render so Lit syncs the <select> value
      this.requestUpdate();
    } catch (e) {
      console.error(`t-select: Fetch error`, e);
    }
  }
}

// Explicitly define the custom element at the bottom
customElements.define("t-select", TSelect);
