import { html, css, LitElement } from "lit"
import { ifDefined } from 'lit-html/directives/if-defined.js';

/**
 * `t-select`
 * 
 * @customElement
 * @demo demo/index.html
 */
export class TSelect extends LitElement {

  static get properties() {
    return {
      ready: {
        type: Boolean 
      },
      currentLanguageCode: {
        type: String
      },
      translationDefinitions: {
        type: Array
      },
      pathToTranslationDefinitions: {
        type: String
      },
      basePath: {
        type: String
      },
      selectedTranslationCode: {
        type: String
      },
      skipInitialTranslationLoad: {
        type: Boolean
      },
      disableJsonTranslations: {
        type: Boolean
      },
      disableLanguageLabelTranslations: {
        type: Boolean
      },
      label: {
        type: String
      }
    }
  }

  constructor() {
    super()
    this.ready = false
    this.currentLanguageCode = 'en'
    this.translations = []
    this.pathToTranslationDefinitions = './translation-definitions.json'
    this.basePath = './'
    this.skipInitialTranslationLoad = false
    this.disableJsonTranslations = false
    this.disableLanguageLabelTranslations = false
    this.label = "Language"
  }

  render() {
    return html`
      ${!this.ready ? html`
        ...
      `:''}
      ${this.ready ? html`
        <form>
          <label for="translation">
            <t-translate>
              ${this.label} 
            </t-translate>
          </label>
          <select name="translation" value="${this.currentLanguageCode}" @change="${this.onTranslationSelect}">
            ${this.translationDefinitions.map(translation => html`
                <option
                  value="${translation.languageCode}"
                  ?selected="${translation.languageCode === this.currentLanguageCode}"
                >
                  ${this.disableLanguageLabelTranslations ? html`
                    ${translation.label}
                  ` : html`
                    <t-translate>
                    ${translation.label}
                    </t-translate>                 
                  `}
                </option>
            `)}
          </select>
        </form>
      `:''}
    `
  }

  async onTranslationSelect($event) {
    await this.setLanguage($event.srcElement.value)
    this.dispatchEvent(new CustomEvent('change'))
  }

  async setLanguage(languageCode) {
    this.currentLanguageCode = languageCode
    document.documentElement.lang = languageCode;
    document.body.dispatchEvent(new CustomEvent('lang-change'));
    if (this.disableJsonTranslations) return
    const translationDefinition = this
      .translationDefinitions
      .find(translationDefinition => translationDefinition.languageCode === languageCode)
    const translationFilePath = translationDefinition.filePath
      ? `${this.basePath}${translationDefinition.filePath}`
      : `${this.basePath}/translation.${languageCode}.json`
    const translationResponse = await fetch(translationFilePath)
    const translation = await translationResponse.json()
    window.translation = translation
    document.body.dispatchEvent(new CustomEvent('lang-ready'));
  }

  async connectedCallback() {
    super.connectedCallback()
    this.currentLanguageCode = document.documentElement.lang
    if (!this.skipInitialTranslationLoad) {
      if (!this.disableJsonTranslations) {
        const translationDefinitionsRequest = await fetch(this.pathToTranslationDefinitions)
        this.translationDefinitions = await translationDefinitionsRequest.json() 
      }
      if (!window.translations) {
        await this.setLanguage(document.documentElement.lang || 'en')
      }
    }
    this.ready = true
  }

}

TSelect.styles = [
  css`
  label {
    background: var(--t-select_label_background);
    border: var(--t-select_label_border)
    margin: var(--t-select_label_margin)
    padding: var(--t-select_label_padding)
  }
  select {
    background: var(--t-select_select_background);
    border: var(--t-select_select_border)
    margin: var(--t-select_select_margin)
    padding: var(--t-select_select_padding)
  }
`
]
window.customElements.define('t-select', TSelect);
