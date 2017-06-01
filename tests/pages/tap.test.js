import { expect } from 'chai';
import { Selector } from 'testcafe';

const el = Selector(selector => document.querySelector(selector));

const url = 'http://localhost:8081';

fixture `Type Page`
    .page(url);

test('Page has h1', async t => {
    await t
        .typeText('#userName', 'email@example.com')
        .typeText('#userPassword', 'secretpass')
        .click('button')
        .click("#radio-0")
        .pressKey('enter')
    ;

    const pageTitle = await el('main#tap h1').innerText;

    expect(pageTitle).to.equal('Type a voucher code');
});

test('Page has masthead with logo, nav, profile bar and toolbar', async t => {
    await t
        .typeText('#userName', 'email@example.com')
        .typeText('#userPassword', 'secretpass')
        .click('button')
        .click("#radio-0")
        .pressKey('enter')
    ;

    const logo = await el('header .logo').exists;
    const primaryNavItems = await el('header nav').find('li').count;
    const profileBar = await el('header~.profile-bar');
    const toolbar = await el('header~.toolbar').find('a').count;

    expect(primaryNavItems).to.equal(3);
    expect(profileBar).to.exist;
    expect(toolbar).to.equal(4);
    expect(logo).to.be.ok;
});

test('I can change my trader', async t => {
    await t
        .typeText('#userName', 'email@example.co.uk')
        .typeText('#userPassword', 'secretpass')
        .click('button')
        .click('input#radio-0')
        .pressKey('enter')
    ;
    const traderLink = await el('.profile-bar a');

    await t
        .click(traderLink)
    ;
    const secondTrader = await el('input#radio-1');

    await t
        .click(secondTrader)
        .pressKey('enter')
    ;
    const traderName = await el('.profile-bar div').child('strong').innerText;
    expect(traderName).to.contain('Barry Thistlethorn');
});

test('I can type and submit a voucher code', async t => {
    await t
        .typeText('#userName', 'email@example.co.uk')
        .typeText('#userPassword', 'secretpass')
        .click('button')
        .click('input#radio-0')
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
        .typeText('#userName', 'email@example.co.uk')
        .typeText('#userPassword', 'secretpass')
        .click('button')
        .click('input#radio-0')
        .pressKey('enter')
    ;

    const voucherCount = await el('#app > div.wrapper > div.toolbar > div.count').innerText;

    expect(voucherCount).to.contain('2 vouchers waiting');
});
