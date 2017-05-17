import { expect } from 'chai';
import { Selector } from 'testcafe';

const el = Selector(selector => document.querySelector(selector));

const AccountURL = 'http://localhost:8081';

// change the port number to your node's choice of port
fixture `Account Page`
	.page(AccountURL);

//doesn't seem to be picking up these tests 
test('Account Page has a "content" div', async t => {
	const pageWelcome = await el('main div.content h1').innerText;

	expect(pageWelcome).to.equal('Hello, Market Stall Name.');
});

test('Account page "Add vouchers" button navigates to "/tap"', async t => {
	await t
		.click('main div.content a.link button');

	const addLocation = await t.eval(() => window.location);
	expect(addLocation.pathname).eql('/tap');
});


test('Account page "Request payment" button navigates to "/payment"', async t => {
    await t
        .click('main div.content a.link button');

    const addLocation = await t.eval(() => window.location);
    expect(addLocation.pathname).eql('/payment');
});



