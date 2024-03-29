import { expect } from "chai";
import { Selector } from "testcafe";

const el = Selector((selector) => document.querySelector(selector));

const url = "http://localhost:8081";

fixture`Type Page`.page(url);

test("Page has h1", async (t) => {
    await t
        .typeText("#userName", "email@example.com")
        .typeText("#userPassword", "secretpass")
        .click("button")
        .click("#radio-0")
        .pressKey("enter");

    const pageTitle = await el("main#tap h1").innerText;

    expect(pageTitle).to.equal("Type a voucher code");
});

test("Page has masthead with logo, nav, profile bar and toolbar", async (t) => {
    await t
        .typeText("#userName", "email@example.com")
        .typeText("#userPassword", "secretpass")
        .click("button")
        .click("#radio-0")
        .pressKey("enter");

    const logo = await el("header .logo").exists;
    const primaryNavItems = await el("header nav").find("li").count;
    const profileBar = await el("header~.profile-bar");
    const toolbar = await el("header~.toolbar").find("a").count;

    expect(primaryNavItems).to.equal(3);
    expect(profileBar).to.exist;
    expect(toolbar).to.equal(3);
    expect(logo).to.be.ok;
});

test("Page has footer", async (t) => {
    await t
        .typeText("#userName", "email@example.com")
        .typeText("#userPassword", "secretpass")
        .click("button")
        .click("#radio-0")
        .pressKey("enter");

    const footer = await el("footer");
    const copyright = await el("footer p").innerText;
    const year = new Date().getFullYear();
    const privacy = await el("footer").child("a").innerText;
    expect(footer).to.exist;
    expect(copyright).to.equal(
        `\u00A9 Copyright ${year} Alexandra Rose Charity`
    );
    expect(privacy).to.equal("Privacy Policy");
});

test("Page footer's privacy link works", async (t) => {
    await t
        .typeText("#userName", "email@example.com")
        .typeText("#userPassword", "secretpass")
        .click("button")
        .click("#radio-0")
        .pressKey("enter");
    await t
        .click(el("footer").child("a"))
        .navigateTo(
            "https://www.alexandrarose.org.uk/privacy-policy-for-traders/"
        );
    const pagePath = await t.eval(() => window.location);
    expect(pagePath.href).to.not.equal(url);
    expect(pagePath.href).to.equal(
        "https://www.alexandrarose.org.uk/privacy-policy-for-traders/"
    );
});

test("Traders name is present", async (t) => {
    await t
        .typeText("#userName", "email@example.co.uk")
        .typeText("#userPassword", "secretpass")
        .click("button");
    const firstTraderName = await el("label[for=radio-0").innerText;

    await t.click("input#radio-0").pressKey("enter");
    const currentTraderName = await el(".profile-bar div").child("strong")
        .innerText;
    expect(firstTraderName && currentTraderName).to.contain("Kristy Corntop");
});

test("I can change my trader", async (t) => {
    await t
        .typeText("#userName", "email@example.co.uk")
        .typeText("#userPassword", "secretpass")
        .click("button")
        .click("input#radio-0")
        .pressKey("enter");
    const traderLink = await el(".profile-bar a");

    await t.click(traderLink);
    const secondTrader = await el("input#radio-1");

    await t.click(secondTrader).pressKey("enter");
    const traderName = await el(".profile-bar div").child("strong").innerText;
    expect(traderName).to.contain("Barry Thistlethorn");
});

test("I can type and submit a voucher code", async (t) => {
    await t
        .typeText("#userName", "email@example.co.uk")
        .typeText("#userPassword", "secretpass")
        .click("button")
        .click("input#radio-0")
        .pressKey("enter");

    const sponsorCode = await el("#sponsorBox").value;
    expect(sponsorCode).eql("RVNT");

    // Type a code and submit.
    await t
        .click(el("#sponsorBox"))
        .pressKey("backspace backspace backspace backspace")
        .typeText(el("#sponsorBox"), "NEW")
        .typeText(el("#voucherBox"), "12345678")
        .click("#submitVoucher");

    // Check the box is clear again.
    const voucherBoxValue = await el("#voucherBox").value;
    expect(voucherBoxValue).eql("");
});

test("Correct error appears when I submit a duplicate voucher", async (t) => {
    await t
        .typeText("#userName", "email@example.co.uk")
        .typeText("#userPassword", "secretpass")
        .click("button")
        .click("input#radio-0")
        .pressKey("enter");
    const sponsorBox = await el("#sponsorBox");

    // Added extra deletes due to unpredicatability where test runner clicks in sponsor box.
    await t
        .click(sponsorBox)
        .pressKey(
            "backspace backspace backspace backspace delete delete delete delete"
        )
        .typeText(sponsorBox, "FAL")
        .typeText(el("#voucherBox"), "1111");
    const submitVoucher = await el("button#submitVoucher");

    await t.click(submitVoucher);
    const errorMessage = await el(".message").innerText;
    expect(errorMessage).to.contain(
        "A very very very very very very very very very very very very very very " +
            "long long long long long long long long long long long long long long long long long " +
            "warning message that should appear if the trader submits an unavailable voucher."
    );
});

test("Correct error appears when I submit an invalid voucher", async (t) => {
    await t
        .typeText("#userName", "email@example.co.uk")
        .typeText("#userPassword", "secretpass")
        .click("button")
        .click("input#radio-0")
        .pressKey("enter");
    const sponsorBox = await el("#sponsorBox");

    // Added extra deletes due to unpredicatability where test runner clicks in sponsor box.
    await t
        .click(sponsorBox)
        .pressKey(
            "backspace backspace backspace backspace delete delete delete delete"
        )
        .typeText(sponsorBox, "INV")
        .typeText(el("#voucherBox"), "1234");
    const submitVoucher = await el("button#submitVoucher");

    await t.click(submitVoucher);
    const errorMessage = await el(".message").innerText;
    expect(errorMessage).to.contain(
        "That isn't a valid voucher code, please check the number and try again."
    );
});

test("I cannot type letters into the voucher input", async (t) => {
    await t
        .typeText("#userName", "email@example.co.uk")
        .typeText("#userPassword", "secretpass")
        .click("button")
        .click("input#radio-0")
        .pressKey("enter");
    const voucherBox = await el("#voucherBox");

    await t.typeText(voucherBox, "HELLO");

    const voucherBoxValue = await el("#voucherBox").value;
    expect(voucherBoxValue).eql("");
});

test("Page displays number of recorded vouchers", async (t) => {
    await t
        .typeText("#userName", "email@example.co.uk")
        .typeText("#userPassword", "secretpass")
        .click("button")
        .click("input#radio-0")
        .pressKey("enter");
    const voucherCount = await el(".count").innerText;

    expect(voucherCount).to.contain("2 vouchers successfully added");
});

test("Voucher link is working", async (t) => {
    await t
        .typeText("#userName", "email@example.co.uk")
        .typeText("#userPassword", "secretpass")
        .click("button")
        .click("input#radio-0")
        .pressKey("enter");
    const voucherLink = await el(".count");

    await t.click(voucherLink);
    const pagePath = await t.eval(() => window.location);
    expect(pagePath.pathname).eql("/payment");
});

test("The correct sponsor code for the selected trader is loaded", async (t) => {
    await t
        .typeText("#userName", "email@example.co.uk")
        .typeText("#userPassword", "secretpass")
        .click("button")
        .click("input#radio-0")
        .pressKey("enter");

    // Check the sponsor code for the first user (RVNT: see fixtures).
    const sponsorCode = await el("#sponsorBox").value;
    expect(sponsorCode).eql("RVNT");

    // Switch trader.
    const traderLink = await el(".profile-bar a");

    await t.click(traderLink);
    const secondTrader = await el("input#radio-1");

    await t.click(secondTrader).pressKey("enter");

    // Check the sponsor code for the second user
    // '' because second trader has a feature override that prevents him from acccessing tap page
    const secondUserSponsorCode = await el("#sponsorBox").value;
    expect(secondUserSponsorCode).eql("");
});

test("I cannot type numbers into the sponsor input", async (t) => {
    await t
        .typeText("#userName", "email@example.co.uk")
        .typeText("#userPassword", "secretpass")
        .click("button")
        .click("input#radio-0")
        .pressKey("enter");
    const sponsorBox = await el("#sponsorBox");

    await t
        .click(sponsorBox)
        .pressKey("backspace backspace backspace backspace")
        .typeText(sponsorBox, "1234");

    const sponsorBoxValue = await el("#sponsorBox").value;
    expect(sponsorBoxValue).eql("");
});

test("Can't reach tap page if the selected trader has a feature override property", async (t) => {
    await t
        .typeText("#userName", "email@example.co.uk")
        .typeText("#userPassword", "secretpass")
        .click("button");

    // Second trader has this feature on, see fixtures file
    const secondTraderName = await el("label[for=radio-1").innerText;
    await t.click("input#radio-1").pressKey("enter");
    const pagePath = await t.eval(() => window.location);
    const currentTraderName = await el(".profile-bar div").child("strong")
        .innerText;
    expect(secondTraderName && currentTraderName).to.contain(
        "Barry Thistlethorn"
    );
    expect(pagePath.href).to.not.equal(`${url}/`);
    expect(pagePath.href).to.equal(`${url}/scan`);
});

test("Can reach tap page if the selected trader doesn't have a feature override property", async (t) => {
    await t
        .typeText("#userName", "email@example.co.uk")
        .typeText("#userPassword", "secretpass")
        .click("button");
    // First trader doesn't have it, see fixtures file
    const firstTraderName = await el("label[for=radio-0").innerText;
    await t.click("input#radio-0").pressKey("enter");
    const pagePath = await t.eval(() => window.location);
    const currentTraderName = await el(".profile-bar div").child("strong")
        .innerText;
    const inputIcons = await el(".input-icons");
    expect(firstTraderName && currentTraderName).to.contain("Kristy Corntop");
    expect(inputIcons).to.exist;
    expect(pagePath.href).to.equal(`${url}/`);
    expect(pagePath.href).to.not.equal(`${url}/scan`);
});
