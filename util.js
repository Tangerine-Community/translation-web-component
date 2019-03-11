
export function combTranslations(markup, languageCode) {
  let template = document.createElement('template')
  template.innerHTML = markup
  languageCode = !languageCode ? window.document.lang : languageCode
  languageCode = !languageCode ? 'en' : languageCode
  template.content.querySelectorAll('t-lang').forEach(node => {
    if (!node.hasAttribute(languageCode)) {
      node.remove() 
    } else {
      unwrap(node)
    }
  })
  return template.innerHTML
}

function unwrap(el) {
  // get the element's parent node
  var parent = el.parentNode;
  // move all children out of the element
  while (el.firstChild) parent.insertBefore(el.firstChild, el);
  // remove the empty element
  parent.removeChild(el);
}
