import { expect } from 'chai';
import { Selector } from 'testcafe';

const el = Selector(selector => document.querySelector(selector));

fixture 'Home Page'
	.page 'http://localhost:8080/#/';

//doesn't seem to be picking up these tests 
test('Homepage content', async t => {
	const pageWelcome = await el('main div.content h1').innerText;

	expect(pageWelcome).to.equal('Hello, Market Stall Name.');
});

test('Add vouchers button', async t => {
	await t
		.click(main div.content a.link button);

	const addLocation = await t.eval(() => window.location);
	expect(addLocation).eql('http://localhost:8080/tap');
});