from model import OrderModel

def finalizeOrder(orderId):
    order = OrderModel.get(orderId)
    order.setOrderTransctionDone()
    order.save()
    print(order.to_dict())
    
    return order.to_dict()