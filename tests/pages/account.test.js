import { expect } from 'chai';
import { Selector } from 'testcafe';

const el = Selector(selector => document.querySelector(selector));

const url = 'http://localhost:8081/account';

fixture `Account Page`
    .page(url);

test('Account page exists', async t => {
    await t
        .typeText('#userName', 'email@example.com')
        .typeText('#userPassword', 'secretpass')
        .click('button')
        .click("#radio-0")
        .click('button#continue')
    ;
    const pagePath = await t.eval(() => window.location);
    expect(pagePath.pathname).to.include('/account');
});

test('Header text is correct', async t => {
    await t
        .typeText('#userName', 'email@example.com')
        .typeText('#userPassword', 'secretpass')
        .click('button')
        .click("#radio-0")
        .click('button#continue')
    ;
    const header = await el('main#account .content h1').innerText;
    expect(header).to.equal('Requested Payments');
});

test('Requested payments accordion exists', async t => {
    await t
        .typeText('#userName', 'email@example.com')
        .typeText('#userPassword', 'secretpass')
        .click('button')
        .click("#radio-0")
        .click('button#continue')
    ;
    const paymentsAccordion = await el('main#account .content div.accordion').exists;
    expect(paymentsAccordion).to.be.ok;
});

test('Download button exists', async t => {
    await t
        .typeText('#userName', 'email@example.com')
        .typeText('#userPassword', 'secretpass')
        .click('button')
        .click("#radio-0")
        .click('button#continue')
    ;
    const downloadButton = await el('.content button');
    expect(downloadButton).to.be.ok;
});
