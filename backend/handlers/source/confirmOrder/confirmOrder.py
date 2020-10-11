import requests

APPSYNC_API_ENDPOINT_URL = 'https://dpdsvjqyezfcnneh24e2i2z664.appsync-api.ap-northeast-1.amazonaws.com/graphql'
APPSYNC_API_KEY = 'da2-sdxakljb4bbwtfllytf6m5jhnm'

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
    
