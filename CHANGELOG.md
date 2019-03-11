# CHANGELOG

## v0.1.1
- Fix bug in combTranslations that would retrieve the default document element language

## v0.1.0
- Added exported `combTranslations` function in `translation-web-component/util.js` for removing translation markup given a specified language code. This is useful for situations where you may be binding translations to a template that removes markup from data to prevent XSS attacks (Angular, Polymer, LitElement, etc.)
