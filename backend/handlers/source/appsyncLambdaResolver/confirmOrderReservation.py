from model import OrderModel

def confirmOrderReservation(orderId):
    order = OrderModel.get(orderId)
    order.setOrderStatusSucceeded()
    order.save()
    
    return order.to_dict()