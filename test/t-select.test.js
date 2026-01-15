import { html, fixture, expect, elementUpdated } from "@open-wc/testing";
import sinon from "sinon";
import "../t-select.js";

describe("TSelect Component", () => {
  let fetchStub;

  beforeEach(() => {
    fetchStub = sinon.stub(window, "fetch");

    // 1. CREATE A CATCH-ALL DEFAULT:
    // This prevents the "reading 'json' of undefined" error
    fetchStub.resolves({
      ok: true,
      json: async () => [],
    });

    // 2. Then define your specific mocks as before:
    fetchStub.withArgs(sinon.match(/translation-definitions.json/)).resolves({
      ok: true,
      json: async () => [
        { languageCode: "en", languageDirection: "ltr", label: "English" },
        { languageCode: "es", languageDirection: "ltr", label: "Spanish" },
      ],
    });
  });

  afterEach(() => {
    fetchStub.restore();
  });

  it("renders with the default label", async () => {
    // We create the element AFTER the stub is ready
    const el = await fixture(
      html`<t-select label="Choose Language"></t-select>`,
    );

    // Wait for Lit's async render cycles
    await elementUpdated(el);
    await el.updateComplete;

    // Use a more robust way to find the element
    const translateEl = el.shadowRoot.querySelector("t-translate");

    expect(translateEl, "t-translate should exist in shadowRoot").to.not.be
      .null;
    expect(translateEl.innerText).to.contain("Choose Language");
  });

  it("updates the document language when a selection is made", async () => {
    const el = await fixture(html`<t-select></t-select>`);
    await elementUpdated(el);

    const select = el.shadowRoot.querySelector("select");
    expect(select, "select element should exist").to.not.be.null;

    // Simulate user selection
    select.value = "es";
    select.dispatchEvent(new Event("change"));

    // Wait for the async setLanguage and re-render
    await elementUpdated(el);

    expect(document.documentElement.lang).to.equal("es");
    expect(document.documentElement.dir).to.equal("ltr");
  });
});
