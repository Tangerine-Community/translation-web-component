
export function getTranslation(markup, languageCode) {
  let template = document.createElement('template')
  template.innerHTML = markup
  languageCode = !languageCode ? window.document.lang : languageCode
  languageCode = !languageCode ? 'en' : languageCode
  return [...template.content.childNodes].map(node => {
    switch(node.nodeName) {
      case 'T-LANG':
        // TODO support uppercase, look at attributes lower cased.
        return node.hasAttribute(languageCode) ? node.innerHTML : ''
      case '#text':
        return node.wholeText
      default:  
        return node.outerHTML
    }
  }).join('')

}
