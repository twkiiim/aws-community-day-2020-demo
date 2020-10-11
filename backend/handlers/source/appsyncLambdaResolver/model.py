import enum
import uuid
import datetime
import pytz

from pynamodb.models import Model
from pynamodb.attributes import UnicodeAttribute, NumberAttribute, BooleanAttribute
from pynamodb.constants import STREAM_NEW_AND_OLD_IMAGE

import os
ddb_table_name = os.environ['DYNAMODB_ORDER_TABLE_NAME']

local_tz = pytz.timezone('Asia/Tokyo')

ORDER_STATUS_INITIALIZED = 'INITIALIZED'
ORDER_STATUS_SUCCEEDED = 'SUCCEEDED'
ORDER_STATUS_FAILED = 'FAILED'

TRANSACTION_STATUS_INITIALIZED = 'INITIALIZED'
TRANSACTION_STATUS_BEING_PROCESSED = 'BEING_PROCESSED'
TRANSACTION_STATUS_DONE = 'DONE'


class OrderModel(Model):

    class Meta:
        table_name = ddb_table_name
        region = 'ap-northeast-1'
        read_capacity_units = 1
        write_capacity_units = 1

    id = UnicodeAttribute(hash_key=True)
    status = UnicodeAttribute(null=False)
    transactionStatus = UnicodeAttribute(null=False)
    paymentId = UnicodeAttribute(null=False)
    createdAt = UnicodeAttribute(null=False)

    itemId = NumberAttribute(null=False)
    title = UnicodeAttribute(null=False)
    subtitle = UnicodeAttribute(null=False)
    price = NumberAttribute(null=False)
    


    def __init__(self, **kwargs):
        super().__init__(**kwargs)
    
    def init(self):
        now = datetime.datetime.utcnow().replace(tzinfo=pytz.utc).astimezone(local_tz).strftime('%Y-%m-%d %H:%M:%S')

        self.id = str(uuid.uuid4())
        self.status = ORDER_STATUS_INITIALIZED
        self.transactionStatus = TRANSACTION_STATUS_INITIALIZED
        self.createdAt = now
    
    def setOrderStatusSucceeded(self):
        self.status = ORDER_STATUS_SUCCEEDED
        self.transactionStatus = TRANSACTION_STATUS_BEING_PROCESSED

    def setOrderStatusFailed(self):
        self.status = ORDER_STATUS_FAILED
    
    def setOrderTransctionDone(self):
        self.transactionStatus = TRANSACTION_STATUS_DONE

    def to_dict(self):
        rval = {}
        for key in self.attribute_values:
            rval[key] = self.__getattribute__(key)
        return rval

    def save(self):
        super().save()
