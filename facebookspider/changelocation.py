#-*- coding: UTF-8 -*-
#更改地区
#存一个地区值，每个while开始时从地区值里读当前要访问的地区
#保证新值每个都是有索引的

import pymongo

client = pymongo.MongoClient(host="222.22.65.179", port=27017)
db = client["singapore"]
db.authenticate("yufei", "xjtu@2017")
coll = db["location"]
# coll.remove({})
# coll.insert({'location':'singapore','locationcn':'新加坡','error':'t'})
print coll.find_one()