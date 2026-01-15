var b = Object.defineProperty;
var s = (a, t) => b(a, "name", { value: t, configurable: !0 });
function p(a, t) {
  const e = (t || document.documentElement.lang || "en").toLowerCase(), n = document.createElement("template");
  return n.innerHTML = a, n.content.querySelectorAll("t-lang").forEach((i) => {
    i.hasAttribute(e) ? _(i) : i.remove();
  }), n.innerHTML;
}
s(p, "combTranslations");
function _(a) {
  const t = a.parentNode;
  if (t) {
    for (; a.firstChild; )
      t.insertBefore(a.firstChild, a);
    t.removeChild(a);
  }
}
s(_, "unwrap");
function m(a, t = "") {
  return window.translation && window.translation[a] ? window.translation[a] : t || a;
}
s(m, "getTranslation");
const g = document.createElement("template");
g.innerHTML = `
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
const c = class c extends HTMLElement {
  static get observedAttributes() {
    return [
      "current-language-code",
      "current-language-direction",
      "path-to-translation-definitions",
      "skip-initial-translation-load",
      "disable-json-translations",
      "disable-language-label-translations"
    ];
  }
  constructor() {
    super(), this.attachShadow({ mode: "open" }), this.shadowRoot.appendChild(g.content.cloneNode(!0)), this._currentLanguageCode = "en", this._currentLanguageDirection = "ltr", this._translationDefinitions = [], this._pathToTranslationDefinitions = "translation-definitions.json", this._skipInitialTranslationLoad = !1, this._disableJsonTranslations = !1, this._disableLanguageLabelTranslations = !1, this._ready = !1, this._select = this.shadowRoot.getElementById("translation"), this._onChange = this._onChange.bind(this);
  }
  // --- Lifecycle ---
  async connectedCallback() {
    this._select.addEventListener("change", this._onChange);
    const t = document.documentElement.lang;
    t && (this.currentLanguageCode = t), this.skipInitialTranslationLoad || await this._initializeTranslations(), this._ready = !0, this._render();
  }
  disconnectedCallback() {
    this._select.removeEventListener("change", this._onChange);
  }
  attributeChangedCallback(t, e, n) {
    if (e !== n) {
      switch (t) {
        case "current-language-code":
          this._currentLanguageCode = n ?? "en";
          break;
        case "current-language-direction":
          this._currentLanguageDirection = n ?? "ltr";
          break;
        case "path-to-translation-definitions":
          this._pathToTranslationDefinitions = n ?? "translation-definitions.json";
          break;
        case "skip-initial-translation-load":
          this._skipInitialTranslationLoad = n !== null;
          break;
        case "disable-json-translations":
          this._disableJsonTranslations = n !== null;
          break;
        case "disable-language-label-translations":
          this._disableLanguageLabelTranslations = n !== null;
          break;
      }
      this._render();
    }
  }
  // --- Properties (public API) ---
  get currentLanguageCode() {
    return this._currentLanguageCode;
  }
  set currentLanguageCode(t) {
    this._currentLanguageCode = String(t ?? "en"), this.setAttribute("current-language-code", this._currentLanguageCode), this._render();
  }
  get currentLanguageDirection() {
    return this._currentLanguageDirection;
  }
  set currentLanguageDirection(t) {
    this._currentLanguageDirection = String(t ?? "ltr"), this.setAttribute(
      "current-language-direction",
      this._currentLanguageDirection
    ), this._render();
  }
  get translationDefinitions() {
    return this._translationDefinitions;
  }
  set translationDefinitions(t) {
    this._translationDefinitions = Array.isArray(t) ? t : [], this._render();
  }
  get pathToTranslationDefinitions() {
    return this._pathToTranslationDefinitions;
  }
  set pathToTranslationDefinitions(t) {
    this._pathToTranslationDefinitions = String(
      t ?? "translation-definitions.json"
    ), this.setAttribute(
      "path-to-translation-definitions",
      this._pathToTranslationDefinitions
    );
  }
  get skipInitialTranslationLoad() {
    return this._skipInitialTranslationLoad;
  }
  set skipInitialTranslationLoad(t) {
    const e = !!t;
    this._skipInitialTranslationLoad = e, e ? this.setAttribute("skip-initial-translation-load", "") : this.removeAttribute("skip-initial-translation-load");
  }
  get disableJsonTranslations() {
    return this._disableJsonTranslations;
  }
  set disableJsonTranslations(t) {
    const e = !!t;
    this._disableJsonTranslations = e, e ? this.setAttribute("disable-json-translations", "") : this.removeAttribute("disable-json-translations");
  }
  get disableLanguageLabelTranslations() {
    return this._disableLanguageLabelTranslations;
  }
  set disableLanguageLabelTranslations(t) {
    const e = !!t;
    this._disableLanguageLabelTranslations = e, e ? this.setAttribute("disable-language-label-translations", "") : this.removeAttribute("disable-language-label-translations");
  }
  get ready() {
    return this._ready;
  }
  // --- Internals ---
  async _initializeTranslations() {
    const t = this._pathToTranslationDefinitions || "translation-definitions.json", e = t.startsWith("/") ? t : `/${t}`, n = await fetch(e);
    if (!n.ok) throw new Error("Could not find JSON");
    this.translationDefinitions = await n.json();
  }
  _render() {
    if (!this.shadowRoot) return;
    if (!this._ready) {
      this._select.innerHTML = '<option value="">...</option>', this._select.value = "", this._select.disabled = !0;
      return;
    }
    this._select.disabled = !1;
    const t = Array.isArray(this._translationDefinitions) ? this._translationDefinitions : [], e = this._currentLanguageCode;
    this._select.innerHTML = t.map((n) => {
      const o = n.languageCode === e ? "selected" : "", i = this._disableLanguageLabelTranslations ? String(n.label ?? "") : m(n.label, n.label);
      return `<option value="${this._escapeAttr(n.languageCode)}" ${o}>
              ${this._escapeHtml(i)}
            </option>`;
    }).join(""), this._select.value = e;
  }
  _escapeHtml(t) {
    const e = document.createElement("div");
    return e.textContent = t, e.innerHTML;
  }
  _escapeAttr(t) {
    return this._escapeHtml(t);
  }
  async _onChange(t) {
    const e = t.target.value;
    await this.setLanguage(e), this.dispatchEvent(
      new CustomEvent("change", {
        detail: { languageCode: e },
        bubbles: !0,
        composed: !0
      })
    );
  }
  async setLanguage(t) {
    const e = (this._translationDefinitions || []).find(
      (n) => n.languageCode === t
    );
    if (e) {
      if (this._currentLanguageCode = t, this._currentLanguageDirection = e.languageDirection, this.setAttribute("current-language-code", this._currentLanguageCode), this.setAttribute(
        "current-language-direction",
        this._currentLanguageDirection
      ), document.documentElement.lang = t, document.documentElement.dir = e.languageDirection, document.body.dispatchEvent(new CustomEvent("lang-change")), this._disableJsonTranslations) {
        this._render();
        return;
      }
      try {
        const o = await (await fetch(
          `${window.location.origin}/translation.${t}.json`
        )).json();
        window.translation = o, document.body.dispatchEvent(new CustomEvent("lang-ready")), this._render();
      } catch (n) {
        console.error("t-select: Fetch error", n);
      }
    }
  }
};
s(c, "TSelect");
let r = c;
customElements.define("t-select", r);
const u = class u extends HTMLElement {
  constructor() {
    super(), this._onLangChange = () => this.render();
  }
  connectedCallback() {
    this.render(), document.body.addEventListener("lang-change", this._onLangChange);
  }
  disconnectedCallback() {
    document.body.removeEventListener("lang-change", this._onLangChange);
  }
  render() {
    const t = document.documentElement.lang.toLowerCase();
    this.hasAttribute(t) ? (this.removeAttribute("hidden"), this.setAttribute("aria-hidden", "false")) : (this.setAttribute("hidden", ""), this.setAttribute("aria-hidden", "true"));
  }
};
s(u, "TLang");
let l = u;
window.customElements.define("t-lang", l);
const h = class h extends HTMLElement {
  constructor() {
    super(), this.attachShadow({ mode: "open" });
  }
  connectedCallback() {
    this.shadowRoot.innerHTML = `
      <style>:host { display: inline; }</style>
      <slot id="source" style="display: none;"></slot>
      <span id="output"></span>
    `, this._onLangChange = () => {
      this.shadowRoot.getElementById("output").textContent = "...";
    }, this._onLangReady = () => {
      this.updateTranslation();
    }, document.body.addEventListener("lang-change", this._onLangChange), document.body.addEventListener("lang-ready", this._onLangReady), this.updateTranslation();
  }
  updateTranslation() {
    const n = this.shadowRoot.getElementById("source").assignedNodes({ flatten: !0 }).map((i) => i.textContent).join("").trim(), o = this.t(n);
    this.shadowRoot.getElementById("output").textContent = o;
  }
  t(t) {
    return !window.translation || !t ? t : window.translation[t] || t;
  }
  disconnectedCallback() {
    document.body.removeEventListener("lang-change", this._onLangChange), document.body.removeEventListener("lang-ready", this._onLangReady);
  }
};
s(h, "TTranslate");
let d = h;
window.customElements.define("t-translate", d);
export {
  l as TLang,
  r as TSelect,
  d as TTranslate,
  p as combTranslations,
  m as getTranslation
};
