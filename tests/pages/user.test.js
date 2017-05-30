import { expect } from 'chai';
import { Selector } from 'testcafe';

const el = Selector(selector => document.querySelector(selector));

const url = 'http://localhost:8081';

fixture `User Page`
    .page(url);

test('Header text is correct', async t => {
	await t
	    .typeText('#userName', 'email@example.com')
	    .typeText('#userPassword', 'secretpass')
	    .pressKey('enter')
	;
	const userLink = await el('a[href*="/user"');

	await t
		.click(userLink)
	;
	const header = await el('main#user .content h1').innerText;
    expect(header).to.equal('Choose a trader account:');
});

test('The correct amout of traders exist', async t => {
	await t
	    .typeText('#userName', 'email@example.com')
	    .typeText('#userPassword', 'secretpass')
	    .pressKey('enter')
	;
	const userLink = await el('a[href*="/user"');

	await t
		.click(userLink)
	;
	const traders = await el('.form-group').find('div.multiple-choice').count;
	expect(traders).to.equal(3);
});

test('Submit button exists', async t => {
	await t
	    .typeText('#userName', 'email@example.com')
	    .typeText('#userPassword', 'secretpass')
	    .pressKey('enter')
	;
	const userLink = await el('a[href*="/user"');

	await t
		.click(userLink)
	;
	const submitButton = await el('button#submitVoucher').exists;
	expect(submitButton).to.be.ok;
});