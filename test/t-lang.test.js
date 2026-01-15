import { expect } from "chai";
import { combTranslations } from "../util.js";
import "../t-lang.js";

// Helper to replace 'fixture'
async function createFixture(html) {
  const container = document.createElement("div");
  container.innerHTML = html;
  document.body.appendChild(container);

  // Wait one tick for Custom Elements to upgrade and render
  await new Promise((resolve) => setTimeout(resolve, 0));

  // If the HTML provided a single top-level element, return that (like @open-wc does)
  return container.children.length === 1
    ? container.firstElementChild
    : container;
}

// Helper to replace 'elementUpdated'
function nextFrame() {
  return new Promise((resolve) => requestAnimationFrame(() => resolve()));
}

describe("t-lang component", () => {
  // Clean up the DOM after each test to avoid interference
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("instantiating the element without a language should show contents", async () => {
    const element = await createFixture(`<t-lang>Hello</t-lang>`);
    expect(element.innerText.trim()).to.equal("Hello");
  });

  it("should only show one of the two languages given body tag lang attribute", async () => {
    document.documentElement.lang = "fr";
    const container = await createFixture(`
      <div>
        <t-lang en>Hello</t-lang>
        <t-lang fr>Bonjour</t-lang>
      </div>
    `);
    expect(container.innerText.trim()).to.equal("Bonjour");
  });

  it('should change language shown when body fires "lang-change"', async () => {
    document.documentElement.lang = "fr";
    const container = await createFixture(`
      <div>
        <t-lang en>Hello</t-lang>
        <t-lang fr>Bonjour</t-lang>
      </div>
    `);
    expect(container.innerText.trim()).to.equal("Bonjour");

    document.documentElement.lang = "en";
    document.body.dispatchEvent(new CustomEvent("lang-change"));

    // Replace elementUpdated with a wait for the next frame
    await nextFrame();
    expect(container.innerText.trim()).to.equal("Hello");
  });
});

describe("util: combTranslations", () => {
  it("returns correct translation string", async () => {
    // You are passing a <div> wrapper here
    const markup = `<div><t-lang en>Hello</t-lang><t-lang fr>Bonjour</t-lang></div>`;

    const enResult = combTranslations(markup, "en");
    const frResult = combTranslations(markup, "fr");

    // The output SHOULD include the <div>
    expect(enResult.replace(/\s/g, "")).to.equal("<div>Hello</div>");
    expect(frResult.replace(/\s/g, "")).to.equal("<div>Bonjour</div>");
  });

  it("returns correct mixed content translation string", async () => {
    // You are passing an <h2> wrapper here
    const markup = `<h2><t-lang en>Hello</t-lang><t-lang fr>Bonjour</t-lang>Foo</h2>`;

    const enResult = combTranslations(markup, "en");

    // The output SHOULD include the <h2>
    expect(enResult.replace(/\s/g, "")).to.equal("<h2>HelloFoo</h2>");
  });
});
