
from confirmOrderReservation import confirmOrderReservation
from createOrderReservation import createOrderReservation
from cancelOrderReservation import cancelOrderReservation
from finalizeOrder import finalizeOrder
from getOrderStatus import getOrderStatus

def handler(event, context):
    print(event)
    print(context)

    arguments = event['arguments']
    fieldName = event['info']['fieldName']

    if fieldName == 'getOrderStatus':
        id = arguments['id']
        return getOrderStatus(id)
    
    elif fieldName == 'createOrderReservation':
        input = arguments['input']
        return createOrderReservation(input)
    
    elif fieldName == 'confirmOrderReservation':
        id = arguments['id']
        return confirmOrderReservation(id)
    
    elif fieldName == 'cancelOrderReservation':
        id = arguments['id']
        return cancelOrderReservation(id)
    
    elif fieldName == 'finalizeOrder':
        id = arguments['id']
        return finalizeOrder(id)
    
    return None


if __name__ == '__main__':
    event = {
        "arguments": {'input': {'paymentId': 'asdf', 'itemId': 1, 'title': 'world!!', 'subtitle': 'hello', 'price': 100}},
        "info": {
            "fieldName": "createOrder"
        }
    }

    handler(event, None)






# {
#    "arguments":{
#       "noteId":"32"
#    },
#    "identity":"None",
#    "source":"None",
#    "request":{
#       "headers":{
#          "x-forwarded-for":"106.72.9.32, 64.252.167.135",
#          "cloudfront-viewer-country":"JP",
#          "cloudfront-is-tablet-viewer":"false",
#          "via":"2.0 09fd24f6a1b0ff1b7cd860a75335700d.cloudfront.net (CloudFront)",
#          "cloudfront-forwarded-proto":"https",
#          "origin":"https://ap-northeast-1.console.aws.amazon.com",
#          "content-length":"109",
#          "accept-language":"en-US,en;q=0.9,ja;q=0.8,ko;q=0.7",
#          "host":"wspdcfaqk5flnbaqc2tqkriiee.appsync-api.ap-northeast-1.amazonaws.com",
#          "x-forwarded-proto":"https",
#          "user-agent":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.121 Safari/537.36",
#          "accept":"*/*",
#          "cloudfront-is-mobile-viewer":"false",
#          "cloudfront-is-smarttv-viewer":"false",
#          "accept-encoding":"gzip, deflate, br",
#          "referer":"https://ap-northeast-1.console.aws.amazon.com/",
#          "x-api-key":"da2-2lwo4qgoajgshozkagqhk7cfey",
#          "content-type":"application/json",
#          "sec-fetch-mode":"cors",
#          "x-amz-cf-id":"4yj-wwoeLObCCd3bcrAiA3X35gvElpBwuIE1tllk57cR6sx0dzzEhA==",
#          "x-amzn-trace-id":"Root=1-5f78bbd6-45e3708e24ede07d44058e8d",
#          "sec-fetch-dest":"empty",
#          "x-amz-user-agent":"AWS-Console-AppSync/",
#          "cloudfront-is-desktop-viewer":"true",
#          "sec-fetch-site":"cross-site",
#          "x-forwarded-port":"443"
#       }
#    },
#    "prev":"None",
#    "info":{
#       "selectionSetList":[
#          "id"
#       ],
#       "selectionSetGraphQL":"{\n  id\n}",
#       "parentTypeName":"Query",
#       "fieldName":"getNoteById",
#       "variables":{
         
#       }
#    },
#    "stash":{
      
#    }
# }