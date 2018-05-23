# -*-coding:utf-8-*-
import pymongo
import time
import sys
import datetime
import json
from django.http import HttpResponse
reload(sys)
sys.setdefaultencoding('utf8')
def data(request):
    location = 'singapore'
    client = pymongo.MongoClient(host="222.22.65.179", port=27017)
    db = client["singapore"]
    db.authenticate("yufei", "xjtu@2017")
    coll = db["facebookurl"]
    count = coll.find().count()
    coll = db["redyurl"]
    friends = coll.find().count()
    coll = db["facebook2"]
    t = time.localtime(time.time() - 300)
    now = datetime.datetime.now()
    # time.strftime('%Y-%m-%d %H:%M:%S', t)
    items = coll.find({'time': {'$gte': time.strftime('%Y-%m-%d %H:%M:%S', t)}})
    if items.count() == 0:
        result = {'location': location, 'count': count, 'friends': friends, 'error': '程序暂停', 'time': now}
        return HttpResponse(json.dumps(result))
    list = []
    str = '全部好友'
    for i in items:
        try:
            for j in i['friendsList'][str.decode()]:
                list.append(j)
                if (len(list) >= 200):
                    break
            if (len(list) >= 200):
                break
        except:
            pass
    result = {'location': location, 'count': count, 'friends': friends, 'list': list, 'time': now}
    return HttpResponse("aabb")