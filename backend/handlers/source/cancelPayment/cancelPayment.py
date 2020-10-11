import stripe

stripe.api_key = 'sk_test_vMra7VjK8wMO6WQVqoA1lA0l005aYAjFwK'


def handler(event, context):
    print(event)
    try:
        paymentId = event['Payload']['paymentId']
    except:
        # when stripeWebhook fails
        paymentId = event['data']['object']['id']
    
    refund = stripe.Refund.create(
      payment_intent=paymentId,
    )

    print(refund)

    if refund.status == 'succeeded':
      return 'cancel payment success.'
    
    else:
      raise Exception('payment refund error')