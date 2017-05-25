import { expect } from 'chai';
import { Selector } from 'testcafe';

const el = Selector(selector => document.querySelector(selector));

const url = 'http://localhost:8081/tap';

fixture `Type Page`
    .page(url);

test('Page has h1', async t => {
    await t
        .typeText('#userName', 'arc+greta@neontribe.co.uk')
        .typeText('#userPassword', 'market_pass')
        .pressKey('enter')
    ;
    const pageTitle = await el('main#tap h1').innerText;
    expect(pageTitle).to.equal('Type a voucher code');
});

test('Page has masthead with logo and 2 nav', async t => {
    await t
        .typeText('#userName', 'arc+greta@neontribe.co.uk')
        .typeText('#userPassword', 'market_pass')
        .pressKey('enter')
    ;
    const logo = await el('header .logo').exists;
    const primaryNavItems = await el('header nav').find('li').count;
    const secondNavItems = await el('header+nav').find('a').count;

    expect(primaryNavItems).to.equal(3);
    expect(secondNavItems).to.equal(3);
    expect(logo).to.be.ok;
});

test('I can type and submit a voucher code ', async t => {
    await t
        .typeText('#userName', 'arc+greta@neontribe.co.uk')
        .typeText('#userPassword', 'market_pass')
        .pressKey('enter')
    ;
    const sponsorCode = await el('#sponsorBox').value;
    expect(sponsorCode).eql('RVP');

    // Type a code and submit.
    await t
        .click(el('#sponsorBox'))
        .pressKey('backspace backspace backspace')
        .typeText(el('#sponsorBox'), 'NEW')
        .typeText(el('#voucherBox'), '12345678')
        .click('#submitVoucher')
        // Check the box is clear again.
        .expect(el('#voucherBox').value, '')
    ;

});

test('Page displays number of recorded vouchers', async t => {
    await t
        .typeText('#userName', 'arc+greta@neontribe.co.uk')
        .typeText('#userPassword', 'market_pass')
        .pressKey('enter')
    ;
    const pageTitle = await el('main#tap form p').innerText;

    expect(pageTitle).to.contain('You have added 2 vouchers.');
});
