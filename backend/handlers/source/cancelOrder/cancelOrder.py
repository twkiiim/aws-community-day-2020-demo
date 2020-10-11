import requests
import json
import os

APPSYNC_API_ENDPOINT_URL = os.environ['APPSYNC_API_ENDPOINT_URL']
APPSYNC_API_KEY = os.environ['APPSYNC_API_KEY']

def handler(event, context):
    print(event)
    try:
        orderId = event['Payload']['orderId']
    except:
        # when stripeWebhook fails
        orderId = json.loads(event['data']['object']['metadata'])['orderId']

    query = """
        mutation cancelOrderReservation {{
            cancelOrderReservation(id: "{orderId}") {{
                id
            }}
        }}
    """.format(orderId=orderId)

    session = requests.Session()
    response = session.request(
        url=APPSYNC_API_ENDPOINT_URL,
        headers={'x-api-key': APPSYNC_API_KEY},
        method='POST',
        json={'query': query}
    )


    respJson = response.json()
    
    if 'data' in respJson:
        print(respJson['data'])
        # print(respJson['errors'])
        return 'cancel order success.'

    elif 'errors' in respJson:
        raise Exception('An error occured during processing cancelOrder.py')
    
