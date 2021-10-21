/**
 * `t-translate`
 * 
 * @customElement
 * @demo demo/index.html
 */
export class TTranslate extends HTMLElement {

  connectedCallback() {
    this._originalContents = `${this.innerHTML}`
    this.render()
    document.body.addEventListener('lang-change', this.isChanging.bind(this))
    document.body.addEventListener('lang-ready', this.render.bind(this))
  }

  render() {
    this.innerHTML = this.t(this._originalContents)
  }

  isChanging() {
    this.innerHTML = `...`
  }

  t(fragment) {
    if (!window.translation) return fragment
    if (window.translation[fragment]) {
      return window.translation[fragment]
    } else {
      return fragment
    }
  }

}
window.customElements.define('t-translate', TTranslate);
