/**
 * `t-number`
 * 
 * @customElement
 * @demo demo/index.html
 */

function toBengaliNum (t) {
  const arabicToBengaliMap = {
    0:"০",
    1:"১",
    2:"২",
    3:"৩",
    4:"৪",
    5:"৫",
    6:"৬",
    7:"৭",
    8:"৮",
    9:"৯"
  }
  return Object.keys(arabicToBengaliMap)
    .reduce((translation, key) => {
      const re = new RegExp(key, 'g');
      return translation.replace(re, arabicToBengaliMap[key])
    }, t)
}

export class TNumber extends HTMLElement {

  connectedCallback() {
    this._originalContents = `${this.innerHTML}`
    this.render()
    document.body.addEventListener('lang-change', this.render.bind(this))
  }

  render() {
    this.innerHTML = document.documentElement.lang.toLowerCase() === 'ben' || document.documentElement.lang.toLowerCase() === 'bn'
      ? toBengaliNum(this._originalContents)
      : this._originalContents
  }

}

window.customElements.define('t-number', TNumber);
