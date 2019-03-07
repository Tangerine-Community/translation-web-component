import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';

/**
 * `t-lang`
 * 
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
class TLang extends PolymerElement {
  static get template() {
    return html`
      <slot></slot>
    `;
  }
  
  connectedCallback() {
    super.connectedCallback()
    this.render()
    document.body.addEventListener('lang-change', this.render.bind(this))
  }

  render() {
    if (document.documentElement.lang.length > 0) {
      if (!this.attributes.hasOwnProperty(document.documentElement.lang.toLowerCase())) {
        this.style.setProperty('display', 'none')
      } else {
        this.style.setProperty('display', 'inline')
      }
    }
  }

}

window.customElements.define('t-lang', TLang);
