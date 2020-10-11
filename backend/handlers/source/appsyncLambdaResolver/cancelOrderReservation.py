from model import OrderModel

def cancelOrderReservation(orderId):
    order = OrderModel.get(orderId)
    order.setOrderStatusFailed()
    order.save()

    return order.to_dict()