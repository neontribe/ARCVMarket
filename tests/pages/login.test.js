import { expect } from 'chai';
import { Selector } from 'testcafe';

const el = Selector(selector => document.querySelector(selector));

const url = 'http://localhost:8081';

fixture `Login Page`
    .page(url);

test('Logo exists', async t => {
    const logo = await el('header .logo').exists;
    expect(logo).to.be.ok;
});

test('Header text is correct', async t => {
    const header = await el('.content h1').innerText;
    expect(header).to.equal('Log In');
});

test('Must fill both input boxes to log in successfully', async t => {
    await t
        .typeText('#userName', 'email@example.com')
        .pressKey('enter')
    ;
    const pagePath = await t.eval(() => document.documentURI);
    expect(pagePath).to.equal('http://localhost:8081/login?redirect=%2F');
});

test('Can log in', async t => {
    await t
        .typeText('#userName', 'email@example.com')
        .typeText('#userPassword', 'secretpass')
        .pressKey('enter')
    ;
    const pagePath = await t.eval(() => document.documentURI);
    expect(pagePath).to.equal(url + '/');
});