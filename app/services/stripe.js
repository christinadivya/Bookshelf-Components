var stripe = require("stripe")(
    "sk_test_9gKJOmIXsWKNLpfqRPSg9I4k"
  );
  var currency = "gbp";
  
  module.exports.createAccount = function(email, country, callback) {
    return stripe.accounts.create({
        managed: true,
        country: country,
        email: email,
        
    },callback);
  };
  
  module.exports.createCharge = function(charge, callback) {
    
    charge.amount = parseFloat(charge.amount)*100;
    return stripe.charges.create({
        amount: charge.amount,
        currency: currency,
        source: charge.source, // Token id
        description: "Charge for test@example.com",
       
      }, callback);
  };
  
  module.exports.createExternalAccount = function(accId, bTokenId, callback) {
    return stripe.accounts.createExternalAccount(
      accId,
      {external_account: bTokenId},
      callback
    );
  };
  
  
  
  module.exports.refund = function(chargeId,amount, callback) {
    return stripe.refunds.create({
      charge: chargeId,
      amount: amount    
      },callback);
  };
  
  module.exports.transfers = function(transfer, callback) {
    return stripe.transfers.create({
        amount: transfer.amount,
        currency: currency,
        destination: transfer.accId,//acount id
        description: "Transfer for Completed booking services",
        
      },callback);
  };
  
  module.exports.createReversal = function(transferId, callback) {
    return stripe.transfers.createReversal({
        transferId,      
        },callback);
  };
  
  
  
  
  
  
  
  