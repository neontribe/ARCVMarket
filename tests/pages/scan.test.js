import { expect } from 'chai';
import { Selector } from 'testcafe';

const el = Selector(selector => document.querySelector(selector));

const url = 'http://localhost:8081';

fixture `Scan Page`
    .page(url);

test('Header text is correct', async t => {
    await t
        .typeText('#userName', 'email@example.com')
        .typeText('#userPassword', 'secretpass')
        .pressKey('enter')
        .click("#radio-0")
        .pressKey('enter')
    ;
    const scanButton = await el('a[href*="/scan"');

    await t
        .click(scanButton)
    ;
    const header = await el('main#scan .content h1').innerText;
    expect(header).to.equal('Scan a voucher code');
});