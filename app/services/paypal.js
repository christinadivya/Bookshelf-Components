var paypal = require('paypal-rest-sdk');
var env_const = require('../config/const.json');
paypal.configure({
  'mode': 'sandbox', //sandbox or live
  'client_id': 'ASALN5Gf_iBzLut2vB415U6eHcZAX-RAf-REgR9Hk5bcROBmnhQMn2f6AbkvjxokCtRs-gSlDd1F5BPW',
  'client_secret': 'EOhHLHvkdwcYccwD6T0Gmwg71EPHOdVFPCTgeyXr4xrzGDH1zncgYpdxeE_S_WSPQPaHs1T_cwazc_l6'
});

module.exports.createCard = function(card_data, callback) {
 paypal.creditCard.create(card_data, callback)
};

// Direct paypal payment

module.exports.createPayment = function(data,callback) {
	var payReq = JSON.stringify({
  intent:'sale',
  payer:{
    payment_method:'paypal'
  },
  redirect_urls:{
    return_url:env_const.rootUrl+'member/process',
    cancel_url:env_const.rootUrl+'member/cancel'
  },
  transactions:[{
  	
    amount:{
      total:data.amount,
      currency:'GBP'
    },
    description:'This is the payment transaction description.'
  }]
});
	paypal.payment.create(payReq, function(error, payment){
  var links = {};

  if(error){
    console.error(JSON.stringify(error));
  } else {
    // Capture HATEOAS links
    payment.links.forEach(function(linkObj){
      links[linkObj.rel] = {
        href: linkObj.href,
        method: linkObj.method
      };
    })

    // If redirect url present, redirect user
    if (links.hasOwnProperty('approval_url')){
      //REDIRECT USER TO links['approval_url'].href
      callback ({success: links['approval_url']})
      
    } else {
    	callback ({error: 'no redirect URI present'})
      
    }
  }
});
};

module.exports.paymentExecute = function(paymentId,payerId, callback) {
  paypal.payment.execute(paymentId, payerId,callback);
};

// Card Payment

module.exports.payment = function(data, callback) {
	var payment_data = {
            intent: 'sale',
            payer: {
              payment_method: 'credit_card',
						  funding_instruments: [{
						  credit_card_token: {
						    credit_card_id: data.cardId,
						    payer_id: data.payerId
						  }
						}]
            },
            transactions: [{
            	
			            
              amount: {
                total: data.amount,
                currency: 'GBP'                
              },
              description: 'This is the payment transaction description.' 
            }]
          };
 paypal.payment.create(payment_data, callback)
};



module.exports.refund = function(saleId,amount, callback) {
  var data = {
    "amount": {
        "currency": "GBP",
        "total": amount
    }
}
paypal.sale.refund(saleId, data, callback);
};











  

