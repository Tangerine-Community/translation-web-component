/**
 * combTranslations
 * Processes a string of markup, filtering <t-lang> elements based on the languageCode,
 * and unwrapping them to return a clean string.
 */
export function combTranslations(markup, languageCode) {
  // 1. Setup Defaults
  const targetLang = (
    languageCode ||
    document.documentElement.lang ||
    "en"
  ).toLowerCase();

  // 2. Use Template for safe parsing
  const template = document.createElement("template");
  template.innerHTML = markup;

  // 3. Find all t-lang tags and filter them
  const nodes = template.content.querySelectorAll("t-lang");
  nodes.forEach((node) => {
    if (node.hasAttribute(targetLang)) {
      // Keep the content, remove the wrapper
      unwrap(node);
    } else {
      // Remove entirely if it doesn't match the current language
      node.remove();
    }
  });

  return template.innerHTML;
}

/**
 * unwrap
 * Replaces an element with its own children in the DOM tree.
 */
function unwrap(el) {
  const parent = el.parentNode;
  if (!parent) return;

  // Move all children out of the element and place them before the element
  while (el.firstChild) {
    parent.insertBefore(el.firstChild, el);
  }
  // Remove the now-empty element
  parent.removeChild(el);
}

/**
 * getTranslation
 * A helper to get a string from the global translation object.
 * Useful for the <option> label issue we discussed.
 */
export function getTranslation(key, fallback = "") {
  if (window.translation && window.translation[key]) {
    return window.translation[key];
  }
  return fallback || key;
}
