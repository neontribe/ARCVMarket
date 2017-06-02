import { expect } from 'chai';
import { Selector } from 'testcafe';
import VueSelector from 'testcafe-vue-selectors';

const el = Selector(selector => document.querySelector(selector));

const url = 'http://localhost:8081/payment';

fixture `Payment Page`
    .page(url);

test('Payments page can be accessed', async t => {
    await t
        .typeText('#userName', 'email@example.com')
        .typeText('#userPassword', 'secretpass')
        .click('button')
        .click("#radio-0")
        .click('button#continue')
    ;
    const pagePath = await t.eval(() => window.location);
    expect(pagePath.pathname).eql('/payment');
});

test('Voucher code list exists', async t => {
    await t
        .typeText('#userName', 'email@example.com')
        .typeText('#userPassword', 'secretpass')
        .click('button')
        .click("#radio-0")
        .click('button#continue')
    ;
    const voucherList = await el('#registeredVouchers').exists;
    expect(voucherList).to.be.ok;
});

test('Payment button works', async t => {
    await t
        .typeText('#userName', 'email@example.com')
        .typeText('#userPassword', 'secretpass')
        .click('button')
        .click("#radio-0")
        .click('button#continue')
    ;
    const paymentButton = await el('.content button#requestPayment')

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
        .click('button')
        .click("#radio-0")
        .click('button#continue')
    ;
    const instructionsComp = VueSelector('Instructions').exists;
    expect(instructionsComp).to.be.ok;
});
