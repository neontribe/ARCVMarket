import { expect } from 'chai';
import { Selector } from 'testcafe';

const el = Selector(selector => document.querySelector(selector));

const url = 'http://localhost:8081/scan';

fixture `Scan Page`
    .page(url);

test('Page has h1', async t => {
    await t
        .typeText('#userName', 'email@example.com')
        .typeText('#userPassword', 'secretpass')
        .click('button')
        .click("#radio-0")
        .pressKey('enter')
        .click('#scanTool')
    ;

    const pageTitle = await el('main#scan h1').innerText;

    expect(pageTitle).to.equal('Scan a voucher code');
});

test('Page has masthead with logo, nav, profile bar and toolbar', async t => {
    await t
        .typeText('#userName', 'email@example.com')
        .typeText('#userPassword', 'secretpass')
        .click('button')
        .click("#radio-0")
        .pressKey('enter')
        .click('#scanTool')
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

test('Traders name is present', async t => {
    await t
        .typeText('#userName', 'email@example.co.uk')
        .typeText('#userPassword', 'secretpass')
        .click('button')
    ;
    const firstTraderName = await el('label[for=radio-0').innerText;

    await t
        .click('input#radio-0')
        .pressKey('enter')
    ;
    const currentTraderName = await el('.profile-bar div').child('strong').innerText;
    expect(firstTraderName && currentTraderName).to.contain('Kristy Corntop');
});

test('I can scan and submit a voucher code', async t => {
    await t
        .typeText('#userName', 'email@example.co.uk')
        .typeText('#userPassword', 'secretpass')
        .click('button')
        .click('input#radio-0')
        .pressKey('enter')
        .click('#scanTool')
    ;

    const sponsorCode = await el('#sponsorBox').value;

    // Scan a code and submit.
    await t
        .click(el('#sponsorBox'))
        .typeText(el('#sponsorBox'), 'NEW12345678',{speed: 0.9})
        .click('#submitVoucher')
        // Check the sponsor and voucher boxes are clear again.
        .expect(el('#sponsorBox').value, '')
    ;

});

test('Correct error appears when I submit an invalid voucher', async t => {
    await t
        .typeText('#userName', 'email@example.co.uk')
        .typeText('#userPassword', 'secretpass')
        .click('button')
        .click('input#radio-0')
        .pressKey('enter')
        .click('#scanTool')
    ;
    const sponsorBox = await el('#sponsorBox');

    await t
        .click(sponsorBox)
        .pressKey('backspace backspace backspace')
        .typeText(sponsorBox, 'INV')
        .typeText(el('#voucherBox'), '123')
    ;
    const submitButton = await el('#submitVoucher');

    await t
        .click(submitButton)
    ;
    const errorMessage = await el('.content div.message').innerText;
    expect(errorMessage).to.contain('[xXx] Please enter a valid voucher code.');
});

test('Correct error appears when I submit a duplicate voucher', async t => {
    await t
        .typeText('#userName', 'email@example.co.uk')
        .typeText('#userPassword', 'secretpass')
        .click('button')
        .click('input#radio-0')
        .pressKey('enter')
        .click('#scanTool')
    ;
    const sponsorBox = await el('#sponsorBox');

    await t
        .click(sponsorBox)
        .pressKey('backspace backspace backspace')
        .typeText(el('#sponsorBox'), 'FAL')
        .typeText(el('#voucherBox'), '1')
    ;
    const submitButton = await el('#submitVoucher');

    await t
        .click(submitButton)
    ;
    const errorMessage = await el('.message').innerText;
    expect(errorMessage).to.contain('[xXx] That voucher may have been used already.');
});

test('Page displays number of recorded vouchers', async t => {
    await t
        .typeText('#userName', 'email@example.co.uk')
        .typeText('#userPassword', 'secretpass')
        .click('button')
        .click('input#radio-0')
        .pressKey('enter')
        .click('#scanTool')
    ;
    const voucherCount = await el('.count').innerText;

    expect(voucherCount).to.contain('2 vouchers waiting');
});

test('Voucher link is working', async t => {
    await t
        .typeText('#userName', 'email@example.co.uk')
        .typeText('#userPassword', 'secretpass')
        .click('button')
        .click('input#radio-0')
        .pressKey('enter')
        .click('#scanTool')
    ;
    const voucherLink = await el('.count');

    await t
        .click(voucherLink)
    ;
    const pagePath = await t.eval(() => window.location);
    expect(pagePath.pathname).eql('/payment');
})
