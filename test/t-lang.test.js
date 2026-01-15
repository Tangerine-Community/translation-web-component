import { html, fixture, expect, elementUpdated } from "@open-wc/testing";
import { combTranslations } from "../util.js";
import "../t-lang.js"; // Ensure t-lang is modernized as well

describe("t-lang component", () => {
  it("instantiating the element without a language should show contents", async () => {
    // This replaces 'BasicTestFixture'
    const element = await fixture(html`<t-lang>Hello</t-lang>`);

    // In Lit, check the rendered output.
    // If t-lang uses Shadow DOM, use shadowRoot.textContent
    expect(element.innerText.trim()).to.equal("Hello");
  });

  it("should only show one of the two languages given body tag lang attribute", async () => {
    document.documentElement.lang = "fr";

    // This replaces 'TwoLanguagesTestFixture'
    const container = await fixture(html`
      <div>
        <t-lang en>Hello</t-lang>
        <t-lang fr>Bonjour</t-lang>
      </div>
    `);

    // Check visibility logic (assuming t-lang hides itself based on lang)
    expect(container.innerText.trim()).to.equal("Bonjour");
  });

  it('should change language shown when body fires "lang-change"', async () => {
    document.documentElement.lang = "fr";
    const container = await fixture(html`
      <div>
        <t-lang en>Hello</t-lang>
        <t-lang fr>Bonjour</t-lang>
      </div>
    `);

    // Change global state
    document.documentElement.lang = "en";
    document.body.dispatchEvent(new CustomEvent("lang-change"));

    // Wait for the components to react to the event
    await elementUpdated(container);

    expect(container.innerText.trim()).to.equal("Hello");
  });
});

describe("util: combTranslations", () => {
  it("returns correct translation string", async () => {
    const container = await fixture(html`
      <div>
        <t-lang en>Hello</t-lang>
        <t-lang fr>Bonjour</t-lang>
      </div>
    `);

    const enResult = combTranslations(container.innerHTML, "en");
    const frResult = combTranslations(container.innerHTML, "fr");

    expect(enResult.replace(/\s/g, "")).to.equal("Hello");
    expect(frResult.replace(/\s/g, "")).to.equal("Bonjour");
  });

  it("returns correct mixed content translation string", async () => {
    const container = await fixture(html`
      <h2>
        <t-lang en>Hello</t-lang>
        <t-lang fr>Bonjour</t-lang>
        Foo foo foo.
      </h2>
    `);

    const enResult = combTranslations(container.innerHTML, "en");
    const frResult = combTranslations(container.innerHTML, "fr");

    expect(enResult.replace(/\s/g, "")).to.equal("HelloFoofoofoo.");
    expect(frResult.replace(/\s/g, "")).to.equal("BonjourFoofoofoo.");
  });
});
