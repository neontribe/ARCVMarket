import { expect } from 'chai';
import { Selector } from 'testcafe';
import VueSelector from 'testcafe-vue-selectors';

const el = Selector(selector => document.querySelector(selector));

const url = 'http://localhost:8081';

fixture `Payment Page`
    .page(url);

test('Payments page can be accessed', async t => {
    await t
        .typeText('#userName', 'email@example.com')
        .typeText('#userPassword', 'secretpass')
        .pressKey('enter')
    ;
    const traderRadio = await el('input#radio-0');

    await t
        .click(traderRadio)
        .pressKey('enter')
    ;
    const paymentNavButton = await el('a[href*="/payment"]');

    await t
        .click(paymentNavButton)
    ;
    const pagePath = await t.eval(() => window.location);
    expect(pagePath.pathname).eql('/payment');
});

test('Voucher code list exists', async t => {
    await t
        .typeText('#userName', 'email@example.com')
        .typeText('#userPassword', 'secretpass')
        .pressKey('enter')
        .click("#radio-0")
        .pressKey('enter')
    ;
    const paymentNavButton = await el('a[href*="/payment"]');

    await t
        .click(paymentNavButton)
    ;
    const voucherList = await el('#registeredVouchers').exists;
    expect(voucherList).to.be.ok;
});

test('Payment button works', async t => {
    await t
        .typeText('#userName', 'email@example.com')
        .typeText('#userPassword', 'secretpass')
        .pressKey('enter')
        .click("#radio-0")
        .pressKey('enter')
    ;
    const paymentNavButton = await el('a[href*="/payment"]');

    await t
        .click(paymentNavButton)
    ;
    const paymentButton = await el('.content a button')

    await t
        .click(paymentButton)
    ;
    const pagePath = await t.eval(() => window.location);
    expect(pagePath.pathname).eql('/account');

});

test('Instructions component occurs on payments page', async t => {
    await t
        .typeText('#userName', 'email@example.com')
        .typeText('#userPassword', 'secretpass')
        .pressKey('enter')
        .click("#radio-0")
        .pressKey('enter')
    ;
    const paymentNavButton = await el('a[href*="/payment"]');

    await t
        .click(paymentNavButton)
    ;
    const instructionsComp = VueSelector('Instructions').exists;
    expect(instructionsComp).to.be.ok;
});