import { expect } from 'chai';
import { Selector } from 'testcafe';

const el = Selector(selector => document.querySelector(selector));

const url = 'http://localhost:8081/user';

fixture `User Page`
    .page(url);

test('Header text is correct', async t => {
    await t
        .typeText('#userName', 'email@example.com')
        .typeText('#userPassword', 'secretpass')
        .click('button')
        .click("#radio-0")
        .click('button#submitVoucher')
    ;
    const header = await el('main#user .content h1').innerText;
    expect(header).to.equal('Choose a trader to manage');
});

test('The correct amout of traders exist', async t => {
    await t
        .typeText('#userName', 'email@example.com')
        .typeText('#userPassword', 'secretpass')
        .click('button')
        .click("#radio-0")
        .click('button#submitVoucher')
    ;
    const traders = await el('.form-group').find('div.multiple-choice').count;
    expect(traders).to.equal(2);
});

test('Submit button exists', async t => {
    await t
        .typeText('#userName', 'email@example.com')
        .typeText('#userPassword', 'secretpass')
        .click('button')
        .click("#radio-0")
        .click('button#submitVoucher')
    ;
    const submitButton = await el('button#submitVoucher').exists;
    expect(submitButton).to.be.ok;
});