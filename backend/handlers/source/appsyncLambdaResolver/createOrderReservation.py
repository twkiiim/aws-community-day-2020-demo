import json
import stripe
from model import OrderModel

stripe.api_key = 'sk_test_vMra7VjK8wMO6WQVqoA1lA0l005aYAjFwK'

def createOrderReservation(input):

    order = OrderModel()
    order.init()

    paymentIntent = stripe.PaymentIntent.create(
      amount=1099,
      currency='jpy',
      metadata={
        'orderId': str(order.id),
      },
    )
    
    order.paymentId = paymentIntent.id
    order.itemId = input['itemId']
    order.title = input['title']
    order.subtitle = input['subtitle']
    order.price = input['price']
    order.save()
    
    result = {}
    result['paymentIntent'] = paymentIntent
    result['order'] = order.to_dict()

    return result