import { html, fixture, expect, elementUpdated } from "@open-wc/testing";
import sinon from "sinon";
import "../t-select.js";
import "../t-translate.js";

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
    const el = await fixture(
      html`<t-select>
        <t-translate slot="label">Language</t-translate>
      </t-select>`,
    );

    // Give the custom elements (t-select and t-translate)
    // a moment to fully "upgrade" and render.
    await new Promise((resolve) => setTimeout(resolve, 0));

    const translateEl = el.querySelector('t-translate[slot="label"]');

    expect(translateEl, "t-translate should exist").to.not.be.null;

    // Use textContent instead of innerText for better reliability in tests
    expect(translateEl.textContent.trim()).to.equal("Language");
  });

  it("updates the document language when a selection is made", async () => {
    const el = await fixture(html`<t-select>
      <t-translate slot="label">Language</t-translate>
    </t-select>`);
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
