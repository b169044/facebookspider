#-*- coding: UTF-8 -*-
import pymongo
import time
from datetime import datetime
import sys
reload(sys)
sys.setdefaultencoding('utf8')

client = pymongo.MongoClient(host="127.0.0.1", port=27017)
db = client["singapore"]
db.authenticate("yufei", "xjtu@2017")
coll = db["facebook2"]
a = coll.find()
print a.count()
coll = db["singaporeredyurl"]
coll.ensure_index('url', unique=True)
str1 = '全部好友'
for i in a:
    try:
        for j in i['friendsList'][str1.decode()]:
            a = {}
            a['name'] = j['name']
            a['picture'] = j['picture']
            a['url'] = j['url']
            a['time'] = i['time']
            a['sign'] = 'f'
            try:
                coll.insert(a)
            except:
                print '重复'
                pass
    except:
        print '出错'
        print i['friendsList']
