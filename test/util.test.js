import { expect } from "@open-wc/testing";
import { combTranslations } from "../util.js";

describe("util.js: combTranslations", () => {
  it("should keep only the matching language and unwrap it", () => {
    const markup = `<div>
      <t-lang en>Hello</t-lang>
      <t-lang es>Hola</t-lang>
    </div>`;

    const result = combTranslations(markup, "en");

    // Check that 'en' content exists but the tag is gone
    expect(result).to.contain("Hello");
    expect(result).to.not.contain("<t-lang");
    // Check that 'es' content is completely gone
    expect(result).to.not.contain("Hola");
  });

  it("should handle nested t-lang tags correctly", () => {
    const markup = `
      <t-lang en>
        English Header
        <t-lang en>Sub-content</t-lang>
        <t-lang es>Contenido secundario</t-lang>
      </t-lang>
    `;

    const result = combTranslations(markup, "en");

    expect(result).to.contain("English Header");
    expect(result).to.contain("Sub-content");
    expect(result).to.not.contain("Contenido secundario");
  });

  it("should fall back to document.documentElement.lang if no code provided", () => {
    document.documentElement.lang = "es";
    const markup = `<t-lang en>Hi</t-lang><t-lang es>Oli</t-lang>`;

    const result = combTranslations(markup);
    expect(result).to.equal("Oli");
  });

  it("should return an empty string if markup is empty", () => {
    expect(combTranslations("", "en")).to.equal("");
  });

  describe("util.js: Accessibility Sanity Check", () => {
    it("should remove aria-hidden elements that don't match the language", () => {
      const markup = `
      <div>
        <t-lang en aria-hidden="false">Visible</t-lang>
        <t-lang es aria-hidden="true">Hidden</t-lang>
      </div>
    `;

      const result = combTranslations(markup, "en");

      // The unwrapped 'en' text should be there
      expect(result).to.contain("Visible");
      // The 'es' content should be purged entirely from the markup string
      expect(result).to.not.contain("Hidden");
      expect(result).to.not.contain('aria-hidden="true"');
    });

    it("should ensure the final output is clean text without aria attributes", () => {
      const markup = `<t-lang en aria-hidden="false">Clean Content</t-lang>`;
      const result = combTranslations(markup, "en");

      // Check that we didn't accidentally leave an aria-hidden="false"
      // on a parent div or as a stray attribute string
      expect(result).to.equal("Clean Content");
    });
  });
});
