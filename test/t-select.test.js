import { expect } from "chai";
import sinon from "sinon";
import "../t-select.js";
import "../t-translate.js";

// Helper to replace 'fixture'
async function createFixture(html) {
  const container = document.createElement("div");
  container.innerHTML = html;
  document.body.appendChild(container);
  // Wait two ticks to ensure the Custom Element upgrades AND
  // the async connectedCallback (fetch) has a chance to start/resolve
  await new Promise((resolve) => setTimeout(resolve, 0));
  await new Promise((resolve) => setTimeout(resolve, 0));
  return container.children.length === 1
    ? container.firstElementChild
    : container;
}

// Helper to replace 'elementUpdated'
function nextFrame() {
  return new Promise((resolve) => requestAnimationFrame(() => resolve()));
}

describe("TSelect Component", () => {
  let fetchStub;

  beforeEach(() => {
    fetchStub = sinon.stub(window, "fetch");

    // Default catch-all
    fetchStub.resolves({
      ok: true,
      json: async () => [],
    });

    // Specific mock for definitions
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
    document.body.innerHTML = ""; // Clean up DOM
    document.documentElement.lang = "en"; // Reset global state
    document.documentElement.dir = "ltr";
  });

  it("renders with the default label", async () => {
    const el = await createFixture(
      `<t-select>
        <t-translate slot="label">Language</t-translate>
      </t-select>`,
    );

    const translateEl = el.querySelector('t-translate[slot="label"]');
    expect(translateEl, "t-translate should exist").to.not.be.null;
    expect(translateEl.textContent.trim()).to.equal("Language");
  });

  it("updates the document language when a selection is made", async () => {
    const el = await createFixture(`
      <t-select>
        <t-translate slot="label">Language</t-translate>
      </t-select>
    `);

    // Wait for the internal render to populate the select options
    await nextFrame();

    const select = el.shadowRoot.querySelector("select");
    expect(select, "select element should exist").to.not.be.null;

    // Simulate user selection
    select.value = "es";
    select.dispatchEvent(new Event("change"));

    // Wait for the async setLanguage logic and the resulting lang-change event
    await nextFrame();
    await nextFrame();

    expect(document.documentElement.lang).to.equal("es");
    expect(document.documentElement.dir).to.equal("ltr");
  });
});
