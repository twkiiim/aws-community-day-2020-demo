import random

def handler(event, context):
    print(event)

    randVal = random.random()
    if randVal > 0.01:
        return 'cancel delivery success.'
    else:
        raise Exception('delivery cancel (randomly) failed')