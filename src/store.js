
var store = {
    config  : {},
    user    : {},
    trader  : {},
    vouchers: [],
};

store.addVoucherCode = function(voucherCode)
{
    return this.vouchers.push(voucherCode);
};

export default store;

