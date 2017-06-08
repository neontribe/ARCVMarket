import { expect } from 'chai';
import { Selector } from 'testcafe';

const el = Selector(selector => document.querySelector(selector));

const url = 'http://localhost:8081';

fixture `User Page`
    .page(url);

test('Clicking the logo does not redirect me', async t => {
    await t
        .typeText('#userName', 'email@example.com')
        .typeText('#userPassword', 'secretpass')
        .click('button')
    ;
    const logo = await el('.logo');

    await t
        .click(logo)
    ;
    const pagePath = await t.eval(() => window.location);
    expect(pagePath.pathname).eql('/user');
});

test('Header text is correct', async t => {
    await t
        .typeText('#userName', 'email@example.com')
        .typeText('#userPassword', 'secretpass')
        .click('button')
    ;
    const header = await el('main#user .content h1').innerText;
    expect(header).to.equal('Choose a trader to manage');
});

test('The correct amount of traders exist', async t => {
    await t
        .typeText('#userName', 'email@example.com')
        .typeText('#userPassword', 'secretpass')
        .click('button')
    ;
    const traders = await el('.form-group').find('div.multiple-choice').count;
    expect(traders).to.equal(2);
});

test('Submit button exists', async t => {
    await t
        .typeText('#userName', 'email@example.com')
        .typeText('#userPassword', 'secretpass')
        .click('button')
    ;
    const submitButton = await el('button#continue').exists;
    expect(submitButton).to.be.ok;
});
