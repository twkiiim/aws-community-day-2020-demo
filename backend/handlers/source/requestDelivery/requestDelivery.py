import random

def handler(event, context):

    randVal = random.random()
    if randVal > 0.01:
        return 'request delivery success'
    else:
        raise Exception('delivery request (randomly) failed')