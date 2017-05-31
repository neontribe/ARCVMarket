import { expect } from 'chai';
import { Selector } from 'testcafe';

const el = Selector(selector => document.querySelector(selector));

const url = 'http://localhost:8081';

fixture `Account Page`
    .page(url);

test('Account page exists', async t => {
    await t
        .typeText('#userName', 'email@example.com')
        .typeText('#userPassword', 'secretpass')
        .pressKey('enter')
        .click("#radio-0")
        .pressKey('enter')
    ;
    const accountNavButton = await el('a[href*="/account"');

    await t
        .click(accountNavButton)
    ;
    const pagePath = await t.eval(() => window.location);
    expect(pagePath.pathname).to.include('/account');
});

test('Header text is correct', async t => {
    await t
        .typeText('#userName', 'email@example.com')
        .typeText('#userPassword', 'secretpass')
        .pressKey('enter')
        .click("#radio-0")
        .pressKey('enter')
    ;
    const accountNavButton = await el('a[href*="/account"');

    await t
        .click(accountNavButton)
    ;
    const header = await el('main#account .content h1').innerText;
    expect(header).to.equal('Requested Payments');
});

test('Requested payments accordion exists', async t => {
    await t
        .typeText('#userName', 'email@example.com')
        .typeText('#userPassword', 'secretpass')
        .pressKey('enter')
        .click("#radio-0")
        .pressKey('enter')
    ;
    const accountNavButton = await el('a[href*="/account"');

    await t
        .click(accountNavButton)
    ;
    const paymentsAccordion = await el('main#account .content div.accordion').exists;
    expect(paymentsAccordion).to.be.ok;
});

test('Logout and download buttons exist', async t => {
    await t
        .typeText('#userName', 'email@example.com')
        .typeText('#userPassword', 'secretpass')
        .pressKey('enter')
        .click("#radio-0")
        .pressKey('enter')
    ;
    const accountNavButton = await el('a[href*="/account"');

    await t
        .click(accountNavButton)
    ;
    const logoutButton = await el('.two-buttons .left');
    const downloadButton = await el('.two-buttons .right');
    expect(logoutButton && downloadButton).to.be.ok;
});