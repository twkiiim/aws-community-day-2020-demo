import stripe
import json

stripe.api_key = 'sk_test_vMra7VjK8wMO6WQVqoA1lA0l005aYAjFwK'


class obj_helper(object):
    def __init__(self, d):
        for a, b in d.items():
            if isinstance(b, (list, tuple)):
               setattr(self, a, [obj_helper(x) if isinstance(x, dict) else x for x in b])
            else:
               setattr(self, a, obj_helper(b) if isinstance(b, dict) else b)



def handler(event, context):

  # In case the webhook event is triggered by Stripe service in real,
  # the code would look like try-except block.
  # Since we're manually calling this webhook event by client for demo purpose,
  # I took a little tricky approach by using obj_helper 
  # that converts the event data from dict type to object.
  # 
  # -----------------------------------------------------------------------------
  # 
  # try:
  #   payload = json.loads(event['body'])
  #   stripeEvent = stripe.Event.construct_from(payload, stripe.api_key)
  # except ValueError as e:
  #   raise Exception('invalid client request - stripe.api_key does not match')
  # 
  # -----------------------------------------------------------------------------
  # 
  # Here we go with obj_helper()
  
  print(event)
  payload = event
  stripeEvent = obj_helper(payload)

  if stripeEvent.type == 'payment_intent.succeeded':
    paymentIntent = stripeEvent.data.object
    
    paymentId = paymentIntent.id
    clientSecret = paymentIntent.client_secret
    orderId = json.loads(paymentIntent.metadata)['orderId']

    print(paymentId)
    print(clientSecret)
    print(orderId)
    
    print('PaymentIntent was successful!')
    
    return {
      'paymentId': paymentId,
      'clientSecret': clientSecret,
      'orderId': orderId
    }
  
  elif stripeEvent.type == 'payment_intent.payment_failed':    
    print('PaymentIntent was failed!')
    raise Exception('Payment failed')
  
  return Exception('Unknown event')