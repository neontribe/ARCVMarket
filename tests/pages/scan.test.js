import { expect } from "chai";
import { Selector } from "testcafe";

const el = Selector((selector) => document.querySelector(selector));

const url = "http://localhost:8081/scan";

fixture`Scan Page`.page(url);

test("Page has h1", async (t) => {
    await t
        .typeText("#userName", "email@example.com")
        .typeText("#userPassword", "secretpass")
        .click("button")
        .click("#radio-0")
        .pressKey("enter")
        .click("#scanTool");

    const pageTitle = await el("main#scan h1").innerText;

    expect(pageTitle).to.equal("Scan a voucher code");
});

test("Page has masthead with logo, nav, profile bar and toolbar", async (t) => {
    await t
        .typeText("#userName", "email@example.com")
        .typeText("#userPassword", "secretpass")
        .click("button")
        .click("#radio-0")
        .pressKey("enter")
        .click("#scanTool");

    const logo = await el("header .logo").exists;
    const primaryNavItems = await el("header nav").find("li").count;
    const profileBar = await el("header~.profile-bar");
    const toolbar = await el("header~.toolbar").find("a").count;

    expect(primaryNavItems).to.equal(3);
    expect(profileBar).to.exist;
    expect(toolbar).to.equal(3);
    expect(logo).to.be.ok;
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

test("Page has footer", async (t) => {
    await t
        .typeText("#userName", "email@example.com")
        .typeText("#userPassword", "secretpass")
        .click("button")
        .click("#radio-0")
        .pressKey("enter")
        .click("#scanTool");

    const pagePath = await t.eval(() => window.location);
    const footer = await el("footer");
    const copyright = await el("footer p").innerText;
    const year = new Date().getFullYear();
    const privacy = await el("footer").child("a").innerText;
    expect(pagePath.href).to.equal(url);
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

test("I can scan and submit a voucher code", async (t) => {
    await t
        .typeText("#userName", "email@example.co.uk")
        .typeText("#userPassword", "secretpass")
        .click("button")
        .click("input#radio-0")
        .pressKey("enter")
        .click("#scanTool");

    const sponsorBox = await Selector("#sponsorBox");
    const voucherBox = await Selector("#voucherBox");

    // Scan a code and submit.
    // Check the sponsor and voucher boxes aren't cleared immediately.
    await t
        .click(sponsorBox)
        .pressKey("backspace")
        .typeText(sponsorBox, "NEW12345678")
        .expect(el("#sponsorBox").value)
        .eql("NEW")
        .expect(el("#voucherBox").value)
        .eql("12345678")
        .typeText(voucherBox, "\r")
        .wait(1000)
        // Check the sponsor and voucher boxes are clear again after one second.
        .expect(el("#sponsorBox").value)
        .eql("")
        .expect(el("#voucherBox").value)
        .eql("");
});

test("Correct error appears when I submit an invalid voucher", async (t) => {
    await t
        .typeText("#userName", "email@example.co.uk")
        .typeText("#userPassword", "secretpass")
        .click("button")
        .click("input#radio-0")
        .pressKey("enter")
        .click("#scanTool");
    const sponsorBox = await el("#sponsorBox");

    // Added extra deletes due to unpredicatability where test runner clicks in sponsor box.
    await t
        .click(sponsorBox)
        .pressKey("backspace")
        .typeText(sponsorBox, "INV")
        .typeText(el("#voucherBox"), "1234", { speed: 1 });
    const submit_button = await el("#submit-voucher");

    await t.click(submit_button);
    const errorMessage = await el(".content div.message").innerText;
    expect(errorMessage).to.contain(
        "That isn't a valid voucher code, please check the number and try again."
    );
});

test("Correct error appears when I submit a duplicate voucher", async (t) => {
    await t
        .typeText("#userName", "email@example.co.uk")
        .typeText("#userPassword", "secretpass")
        .click("button")
        .click("input#radio-0")
        .pressKey("enter")
        .click("#scanTool");
    const sponsorBox = await el("#sponsorBox");

    // Added extra deletes due to unpredicatability where test runner clicks in sponsor box.
    await t
        .click(sponsorBox)
        .pressKey("backspace")
        .typeText(el("#sponsorBox"), "FAL")
        .typeText(el("#voucherBox"), "1111", { speed: 1 });
    const submit_button = await el("#submit-voucher");

    await t.click(submit_button);
    const errorMessage = await el(".message").innerText;
    expect(errorMessage).to.contain(
        "A very very very very very very very very very very very very very very " +
            "long long long long long long long long long long long long long long long long long " +
            "warning message that should appear if the trader submits an unavailable voucher."
    );
});

test("Sponsor box and voucher box inputs are cleared if typing too slow", async (t) => {
    await t
        .typeText("#userName", "email@example.co.uk")
        .typeText("#userPassword", "secretpass")
        .click("button")
        .click("input#radio-0")
        .pressKey("enter")
        .click("#scanTool");
    const sponsorBox = await el("#sponsorBox");

    // Added extra deletes due to unpredicatability where test runner clicks in sponsor box.
    await t
        .click(sponsorBox)
        .pressKey("backspace")
        .typeText(sponsorBox, "INV")
        .typeText(el("#voucherBox"), "1234")
        .expect(sponsorBox.innerText)
        .eql("")
        .expect(el("#voucherBox").value)
        .eql("");
});

test("Page displays number of recorded vouchers", async (t) => {
    await t
        .typeText("#userName", "email@example.co.uk")
        .typeText("#userPassword", "secretpass")
        .click("button")
        .click("input#radio-0")
        .pressKey("enter")
        .click("#scanTool");
    const voucherCount = await el(".count").innerText;

    expect(voucherCount).to.contain("2 vouchers successfully added");
});

test("Voucher link is working", async (t) => {
    await t
        .typeText("#userName", "email@example.co.uk")
        .typeText("#userPassword", "secretpass")
        .click("button")
        .click("input#radio-0")
        .pressKey("enter")
        .click("#scanTool");
    const voucherLink = await el(".count");

    await t.click(voucherLink);
    const pagePath = await t.eval(() => window.location);
    expect(pagePath.pathname).eql("/payment");
});

test("Can't see input icons on toolbar if I can't reach tap page", async (t) => {
    await t
        .typeText("#userName", "email@example.co.uk")
        .typeText("#userPassword", "secretpass")
        .click("button");

    // Second trader has this feature on, see fixtures file
    const secondTraderName = await el("label[for=radio-1").innerText;
    await t.click("input#radio-1").pressKey("enter");
    const pagePath = await t.eval(() => window.location);
    const inputIcons = await el(".input-icons");
    const currentTraderName = await el(".profile-bar div").child("strong")
        .innerText;
    expect(pagePath.href).to.equal(url);
    expect(secondTraderName && currentTraderName).to.contain(
        "Barry Thistlethorn"
    );
    expect(inputIcons).to.not.exist;
});
