import { expect } from "chai";
import { Selector } from "testcafe";

const el = Selector((selector) => document.querySelector(selector));

const url = "http://localhost:8081/privacy-policy";

fixture`Privacy Policy Page`.page(url);

test("Logo exists", async (t) => {
    const logo = await el("header .logo").exists;
    expect(logo).to.be.ok;
});

test("Header text is correct", async (t) => {
    const header = await el(".content h1").innerText;
    expect(header).to.equal(
        "Rosie – the Rose Voucher Recording System for Traders"
    );
});

test("Correct number of sections", async (t) => {
    const sectionCount = await el(".content").find("section").count;
    expect(sectionCount).to.equal(2);
});
