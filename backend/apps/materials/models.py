import mongoengine as me
from datetime import datetime


class Material(me.Document):
    username = me.StringField(max_length=150, required=True, unique=True)
    email = me.EmailField(required=True, unique=True)
    first_name = me.StringField(max_length=30, required=True)
    last_name = me.StringField(max_length=30, required=True)
    password = me.StringField(required=True)
    created_at = me.DateTimeField(default=datetime.utcnow)

    meta = {'collection': 'users'}