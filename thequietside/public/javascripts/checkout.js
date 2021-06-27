Stripe.setPublishableKey('pk_test_51HzY60FejuzBXp5nkV0HrLhEilovzHCKFcseWWIWy3eeY8xNCfLE3LmM56yzNLWlmCYTpVhkRR9DcPS0QjorXhRC00dfgzFx8J');

var $form= $('#checkout-form');

$form.submit(function(event){
    $('#charge-error').addClass('hidden');
    $form.find('button').prop('disabled', true);
    Stripe.card.createToken({
        number: $('#card-number').val(),
        cvc: $('#card-cvc').val(),
        exp_month: $('#card-expiry-month').val(),
        exp_year: $('#card-expiry-year').val(),
        name: $('#card-name').val()
      }, stripeResponseHandler);
      return false;
});

function stripeResponseHandler(status, response){
    if (response.error) { // Problem!

        // Show the errors on the form
        $('#charge-error').text(response.error.message);
        $('#charge-error').removeClass('hidden');
        $form.find('button').prop('disabled', false); // Re-enable submission
    
      } else { // Token was created!
    
        // Get the token ID:
        var token = response.id;
    
        // Insert the token into the form so it gets submitted to the server:
        $form.append($('<input type="hidden" name="stripeToken" />').val(token));
    
        // Submit the form:
        $form.get(0).submit();
    
      }

}
