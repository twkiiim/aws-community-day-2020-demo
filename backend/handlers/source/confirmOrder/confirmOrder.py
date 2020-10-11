import requests
import os

APPSYNC_API_ENDPOINT_URL = os.environ['APPSYNC_API_ENDPOINT_URL']
APPSYNC_API_KEY = os.environ['APPSYNC_API_KEY']

def handler(event, context):
    print(event)
    orderId = event['Payload']['orderId']

    query = """
        mutation confirmOrderReservation {{
            confirmOrderReservation(id: "{orderId}") {{
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
        return 'confirm order success'

    elif 'errors' in respJson:
        raise Exception('An error occured during processing orderSucceeded.py')
    
