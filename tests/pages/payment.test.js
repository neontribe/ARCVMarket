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
    const paymentNavButton = await el('a[href*="/payment"');

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
    ;
    const paymentNavButton = await el('a[href*="/payment"');

    await t
    	.click(paymentNavButton)
    ;
	const voucherList = await el('#registeredVouchers').exists;
	expect(voucherList).to.be.ok;
});

test('Download and Payment buttons exist', async t => {
	await t
        .typeText('#userName', 'email@example.com')
        .typeText('#userPassword', 'secretpass')
        .pressKey('enter')
    ;
    const paymentNavButton = await el('a[href*="/payment"');

    await t
    	.click(paymentNavButton)
    ;
    const downloadButton = await el('button.left').exists;
    const paymentButton = await el('button.right').exists;
    expect(downloadButton && paymentButton).to.be.ok;
});

test('Instructions component occurs on payments page', async t => {
    await t
        .typeText('#userName', 'email@example.com')
        .typeText('#userPassword', 'secretpass')
        .pressKey('enter')
    ;
    const paymentNavButton = await el('a[href*="/payment"');

    await t
        .click(paymentNavButton)
    ;
    const instructionsComp = VueSelector('Instructions').exists;
    expect(instructionsComp).to.be.ok;
});