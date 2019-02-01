# \<t-lang\>
A large single translation file for an app creates a disconnect between content and context. Provide translations inline with your HTML using `<t-lang>` element. Set `<html lang="[language-code]">` on your document and in your content provide `<t-lang [language-code]>Translation content...</t-lang>`. If your app changes language after the page loads, fire the `lang-change` event with `document.body.dispatchEvent(new CustomEvent('lang-change'))` to notify the `t-lang` elements.

Example of showing a page title in English...
```html
<!doctype html>
<html lang="en">
    ...
  <body>
    <h1>
        <t-lang en>Hello</t-lang>
        <t-lang fr>Bonjour</t-lang>
    </h1>
    <button onclick="
        document.documentElement.lang = 'en'; 
        document.body.dispatchEvent(new CustomEvent('lang-change'));
        ">
        Enable English
    </button>
    <button onclick="
        document.documentElement.lang = 'fr';
        document.body.dispatchEvent(new CustomEvent('lang-change'));
        ">
        Enable French 
    </button>
  </body>
</html>
```

Now in French...
```html
<!doctype html>
<html lang="fr">
    ...
  <body>
    <h1>
        <t-lang en>Hello</t-lang>
        <t-lang fr>Bonjour</t-lang>
    </h1>
    <button onclick="
        document.documentElement.lang = 'en'; 
        document.body.dispatchEvent(new CustomEvent('lang-change'));
        ">
        Enable English
    </button>
    <button onclick="
        document.documentElement.lang = 'fr';
        document.body.dispatchEvent(new CustomEvent('lang-change'));
        ">
        Enable French 
    </button>
  </body>
</html>
```

Now with buttons to switch between the two translations...
```html
<!doctype html>
<html lang="en">
    ...
  <body>
    <h2>
        <t-lang en>Hello</t-lang>
        <t-lang fr>Bonjour</t-lang>
    </h2>
    <button onclick="
        document.documentElement.lang = 'en'; 
        document.body.dispatchEvent(new CustomEvent('lang-change'));
        ">
        Enable English
    </button>
    <button onclick="
        document.documentElement.lang = 'fr';
        document.body.dispatchEvent(new CustomEvent('lang-change'));
        ">
        Enable French 
    </button>
  </body>
</html>
```

## Install
Save to your project.
```
npm install --save t-lang
```

Import into your app.
```
import `t-lang/t-lang.js'
```

## Demo or Develop
```
git clone https://github.com/ictatrti/translation-web-component
cd translation-web-component
npm install
npm start
```

## Test 
```
git clone https://github.com/ictatrti/translation-web-component
cd translation-web-component
npm install
npm run test 
```



