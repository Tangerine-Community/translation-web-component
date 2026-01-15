import { html, fixture, expect, elementUpdated } from "@open-wc/testing";
import { combTranslations } from "../util.js";
import "../t-lang.js";

describe("t-lang component", () => {
  it("instantiating the element without a language should show contents", async () => {
    const element = await fixture(html`<t-lang>Hello</t-lang>`);
    expect(element.innerText.trim()).to.equal("Hello");
  });

  it("should only show one of the two languages given body tag lang attribute", async () => {
    document.documentElement.lang = "fr";
    const container = await fixture(html`
      <div>
        <t-lang en>Hello</t-lang>
        <t-lang fr>Bonjour</t-lang>
      </div>
    `);
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
    document.documentElement.lang = "en";
    document.body.dispatchEvent(new CustomEvent("lang-change"));
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
