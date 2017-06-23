function payPalPayment() {

  paypal.Button.render({

    env: 'sandbox',

    client: {
      sandbox: 'Aa4NGPesxMLXRg4_OvF_oG2dD79UhfvHbEZDiqSAESmZWTzqoOMsOFrLLLAU1qhus4Kq_a7m67MiFSSN',
      production: 'xxxxxxxxx'
    },

    commit: true, // Show a 'Pay Now' button

    payment: function(data, actions) {
      let amount = parseInt($('#qty').val()) * 10 || 10;
      return actions.payment.create({
        transactions: [
          {
            amount: {
              total: amount.toString(),
              currency: 'USD'
            }
          }
        ]
      });
    },

    onAuthorize: function(data, actions) {
      // Make a call to the REST api to execute the payment
      return actions.payment.execute().then(function() {
        window.alert('Thank you for your payment! It has been successfully processed.');
        window.location.href = 'index.html';
      });
    }

  }, '#paypal-btn');

}

$("input[name='howtopay']").change(function() {
  if ($("input[name='howtopay']:checked").val() === "0") {
    document.getElementById('submit-btn').style.display = 'block';
    document.getElementById('paypal-btn').style.display = 'none';
  } else {
    document.getElementById('submit-btn').style.display = 'none';
    document.getElementById('paypal-btn').style.display = 'block';
  }
});

$('#submit').click(function () {
  alert('Thank you for your order! It has been successfully processed');
  window.location.href = 'index.html';
  return false;
});
