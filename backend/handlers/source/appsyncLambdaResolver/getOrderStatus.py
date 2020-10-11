from model import OrderModel

def getOrderStatus(orderId):
    order = OrderModel.get(orderId)
    return order.to_dict()