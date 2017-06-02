import { expect } from 'chai';
import { Selector } from 'testcafe';

const el = Selector(selector => document.querySelector(selector));

const url = 'http://localhost:8081/upload';

fixture `Upload Page`
    .page(url);

test('Header text is correct', async t => {
    await t
        .typeText('#userName', 'email@example.com')
        .typeText('#userPassword', 'secretpass')
        .click('button')
        .click("#radio-0")
        .click('button#continue')
    ;
    const header = await el('main#upload .content h1').innerText;
    expect(header).to.equal('Upload voucher codes');
});
