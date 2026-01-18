/**
 * `t-lang`
 * 
 *
 * @customElement
 * @demo demo/index.html
 */
class TLang extends HTMLElement {
  
  connectedCallback() {
    this.render()
    document.body.addEventListener('lang-change', this.render.bind(this))
  }

  render() {
    if (document.documentElement.lang.length > 0) {
      if (
        this.attributes.hasOwnProperty(
          document.documentElement.lang.toLowerCase(),
        )
      ) {
        this.style.setProperty("display", "inline");
        this.setAttribute("aria-hidden", "false");
      } else {
        this.style.setProperty("display", "none");
        this.setAttribute("aria-hidden", "true");
      }
    }
  }
}

window.customElements.define('t-lang', TLang);
