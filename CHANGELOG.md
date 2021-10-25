# CHANGELOG

## v1.1.1
- Replace hardcoded Language label in t-select with dynamic label property.
- Refactor t-number's Bengali number translation feature to use a simple find and replace. 

## v1.1.0
- Add `<t-select>` element for reusable language selection widget.
- In `<t-translate>`, sanitize HTML from fragements for better compatibility with templating libraries and remove outer whitespace to allow for HTML whitespace formatting. 

## v1.0.0
- Add `<t-translate>` and shorthand `<t-t>` for translating from JSON object assigned to `window.translation`. 
- Remove unnecessary dependency on Polymer for `<t-lang>`. Should make things just a little faster to load and lighter on memory usage.
- Add `<t-number>` element for translating numbers, bengali support only at the moment.

## v0.1.1
- Fix bug in combTranslations that would retrieve the default document element language

## v0.1.0
- Added exported `combTranslations` function in `translation-web-component/util.js` for removing translation markup given a specified language code. This is useful for situations where you may be binding translations to a template that removes markup from data to prevent XSS attacks (Angular, Polymer, LitElement, etc.)
