/**
 * `t-number`
 * 
 * @customElement
 * @demo demo/index.html
 */

/*
 * Function from https://github.com/sh4hids/number-to-bengali/blob/master/index.js
 */

function _toBengaliNum(t){var r={0:"০",1:"১",2:"২",3:"৩",4:"৪",5:"৫",6:"৬",7:"৭",8:"৮",9:"৯",".":".","-":"-"};if(isNaN(parseFloat(t))||isNaN(t-0))return"Invalid input type";var i="";return t.toString().split("").forEach(function(t){return i+=r[t]}),i}

// Add support for commas and decimal places.
function toBengaliNum (t) {
  return t
    .split(',')
    .map(f => f.indexOf('.') !== -1 ? f : _toBengaliNum(f))
    .join(',')
    .split('.')
    .map(f => f.indexOf(',') !== -1 ? f : _toBengaliNum(f))
    .join('.')
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
