import { expect } from "chai";
import { Selector } from "testcafe";

const el = Selector((selector) => document.querySelector(selector));

const url = "http://localhost:8081/payment";

fixture`Payment Page`.page(url);

test("Pending vouchers is consistent throughout app", async (t) => {
    await t
        .typeText("#userName", "email@example.com")
        .typeText("#userPassword", "secretpass")
        .click("button")
        .click("#radio-0")
        .click("button#continue");
    const paymentVoucherCount = await el("h1").child("strong").innerText;
    const addVoucherPage = await el("nav > ul").child(0).child("a");

    await t.click(addVoucherPage);
    const navVoucherCount = await el(".count > a > strong").innerText;
    expect(paymentVoucherCount && navVoucherCount).to.contain("2");
});

test("Voucher list show/hide expander is present", async (t) => {
    await t
        .typeText("#userName", "email@example.com")
        .typeText("#userPassword", "secretpass")
        .click("button")
        .click("#radio-0")
        .click("button#continue");
    const voucherExpander = await el(".expandable").exists;
    expect(voucherExpander).to.be.ok;
});

test("Voucher code list exists", async (t) => {
    await t
        .typeText("#userName", "email@example.com")
        .typeText("#userPassword", "secretpass")
        .click("button")
        .click("#radio-0")
        .click("button#continue");
    const voucherList = await el("#registeredVouchers").exists;
    expect(voucherList).to.be.ok;
});

test("Payment button works", async (t) => {
    await t
        .typeText("#userName", "email@example.com")
        .typeText("#userPassword", "secretpass")
        .click("button")
        .click("#radio-0")
        .click("button#continue");
    const paymentButton = await el(".content button#requestPayment");

    await t.click(paymentButton);
    const pagePath = await t.eval(() => window.location);
    expect(pagePath.pathname).eql("/account");
});
