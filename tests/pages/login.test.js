import { expect } from "chai";
import { Selector } from "testcafe";

const el = Selector((selector) => document.querySelector(selector));

const url = "http://localhost:8081";

fixture`Login Page`.page(url);

test("Logo exists", async (t) => {
    const logo = await el("header .logo").exists;
    expect(logo).to.be.ok;
});

test("Header text is correct", async (t) => {
    const header = await el(".content h1").innerText;
    expect(header).to.equal("Log In");
});

test("Must fill both input boxes to log in successfully", async (t) => {
    await t.typeText("#userName", "email@example.com").click("button");
    const pagePath = await t.eval(() => document.documentURI);
    expect(pagePath).to.equal(url + "/login?redirect=%2F");
});

test("Privacy policy link exists", async (t) => {
    const privacyLink = await el("#privacy").exists;
    expect(privacyLink).to.be.ok;
});

test("Privacy link navigates to right page", async (t) => {
    await t
        .click("#privacy")
        .navigateTo(
            "https://www.alexandrarose.org.uk/privacy-policy-for-traders/"
        );
    const pagePath = await t.eval(() => window.location);
    expect(pagePath.href).to.not.equal(url);
    expect(pagePath.href).to.equal(
        "https://www.alexandrarose.org.uk/privacy-policy-for-traders/"
    );
});

test("Can log in", async (t) => {
    await t
        .typeText("#userName", "email@example.com")
        .typeText("#userPassword", "secretpass")
        .click("button")
        .click("#radio-0")
        .pressKey("enter");
    const pagePath = await t.eval(() => document.documentURI);
    expect(pagePath).to.equal(url + "/");
});

test("Can log out", async (t) => {
    await t
        .typeText("#userName", "email@example.com")
        .typeText("#userPassword", "secretpass")
        .click("button")
        .click("#radio-0")
        .pressKey("enter");
    const logout = await el(".wrapper .profile-bar").child(1);

    await t.click(logout);
    const pagePath = await t.eval(() => document.documentURI);
    expect(pagePath).to.equal(url + "/login");
    const privacyLink = await el("#privacy").exists;
    expect(privacyLink).to.be.ok;
});

test("User remains logged in on page refresh", async (t) => {
    await t
        .typeText("#userName", "email@example.com")
        .typeText("#userPassword", "secretpass")
        .click("button")
        .click("#radio-0")
        .pressKey("enter");

    await t.eval(() => location.reload);

    const pagePath = await t.eval(() => document.documentURI);
    expect(pagePath).to.equal(url + "/");
});

test("User is logged out on refresh if localStorage information is cleared.", async (t) => {
    await t
        .typeText("#userName", "email@example.com")
        .typeText("#userPassword", "secretpass")
        .click("button")
        .click("#radio-0")
        .pressKey("enter");

    await t.eval(() => {
        localStorage.clear();
        location.reload();
    });

    const pagePath = await t.eval(() => document.documentURI);
    expect(pagePath).to.equal(url + "/login?redirect=%2F");
});
