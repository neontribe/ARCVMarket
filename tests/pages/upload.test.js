import { expect } from 'chai';
import { Selector } from 'testcafe';

const el = Selector(selector => document.querySelector(selector));

const url = 'http://localhost:8081';

fixture `Upload Page`
    .page(url);

test('Header text is correct', async t => {
	await t
		.typeText('#userName', 'email@example.com')
	    .typeText('#userPassword', 'secretpass')
	    .pressKey('enter')
	;
	const uploadButton = await el('a[href*="/upload"');

	await t
		.click(uploadButton)
	;
	const header = await el('main#upload .content h1').innerText;
    expect(header).to.equal('Upload voucher codes');
});