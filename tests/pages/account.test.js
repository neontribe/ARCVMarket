import { expect } from "chai";
import { Selector } from "testcafe";

const el = Selector((selector) => document.querySelector(selector));

const url = "http://localhost:8081/account";

fixture`Account Page`.page(url);

test("Account page exists", async (t) => {
    await t
        .typeText("#userName", "email@example.com")
        .typeText("#userPassword", "secretpass")
        .click("button")
        .click("#radio-0")
        .click("button#continue");
    const pagePath = await t.eval(() => window.location);
    expect(pagePath.pathname).to.include("/account");
});

test("Header text is correct", async (t) => {
    await t
        .typeText("#userName", "email@example.com")
        .typeText("#userPassword", "secretpass")
        .click("button")
        .click("#radio-0")
        .click("button#continue");
    const header = await el("main#account .content h1").innerText;
    expect(header).to.equal("Requested Payments");
});

test("Requested payments accordion exists", async (t) => {
    await t
        .typeText("#userName", "email@example.com")
        .typeText("#userPassword", "secretpass")
        .click("button")
        .click("#radio-0")
        .click("button#continue");
    const paymentsAccordion = await el("main#account .content div.accordion")
        .exists;
    expect(paymentsAccordion).to.be.ok;
});

test("Payment history list icon is present in table row", async (t) => {
    await t
        .typeText("#userName", "email@example.com")
        .typeText("#userPassword", "secretpass")
        .click("button")
        .click("#radio-0")
        .click("button#continue");
    const voucherExpander = await el(".fa-list").exists;
    expect(voucherExpander).to.be.ok;
});

test("Email history button exists", async (t) => {
    await t
        .typeText("#userName", "email@example.com")
        .typeText("#userPassword", "secretpass")
        .click("button")
        .click("#radio-0")
        .click("button#continue");
    const emailButton = await el(".content button");
    expect(emailButton).to.be.ok;
});

test("Email icon occurs on requested payment", async (t) => {
    await t
        .typeText("#userName", "email@example.com")
        .typeText("#userPassword", "secretpass")
        .click("button")
        .click("#radio-0")
        .click("button#continue");
    const emailIcon = await el("div.email").exists;
    expect(emailIcon).to.be.ok;
});

test("Voucher total is equal to amount of vouchers in accordion", async (t) => {
    await t
        .typeText("#userName", "email@example.com")
        .typeText("#userPassword", "secretpass")
        .click("button")
        .click("#radio-0")
        .click("button#continue");
    const voucherTotal = await el(".count").innerText;
    expect(voucherTotal).to.equal("2");

    await t.click("input[type=checkbox]");
    const requestedVouchers = await el(".tab-content").child(
        "div:not(.inner-thead)"
    ).count;
    expect(requestedVouchers).to.equal(2);
});

test("Page has footer", async (t) => {
    await t
        .typeText("#userName", "email@example.com")
        .typeText("#userPassword", "secretpass")
        .click("button")
        .click("#radio-0")
        .click("button#continue");

    const pagePath = await t.eval(() => window.location);
    const footer = await el("footer");
    const copyright = await el("footer p").innerText;
    const year = new Date().getFullYear();
    const privacy = await el("footer").child("a").innerText;
    expect(pagePath.href).to.equal(url);
    expect(footer).to.exist;
    expect(copyright).to.equal(`\u00A9 Copyright ${year} Alexandra Rose Charity`);
    expect(privacy).to.equal('Privacy Policy');
});

test("Page footer's privacy link works", async (t) => {
    await t
        .typeText("#userName", "email@example.com")
        .typeText("#userPassword", "secretpass")
        .click("button")
        .click("#radio-1")
        .click("button#continue");
    await t
        .click(el("footer").child("a"))
        .navigateTo("https://www.alexandrarose.org.uk/privacy-policy-for-traders");
    const pagePath = await t.eval(() => window.location);
    expect(pagePath.href).to.not.equal(url);
    expect(pagePath.href).to.equal("https://www.alexandrarose.org.uk/privacy-policy-for-traders");
});
