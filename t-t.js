import { TTranslate } from './t-translate.js'

/**
 * `t-t`
 * A shorthand proxy for <t-translate>
 * 
 * @customElement
 * @demo demo/index.html
 */
class Tt extends TTranslate { }

window.customElements.define('t-t', Tt);
