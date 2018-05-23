#-*- coding: UTF-8 -*-

# import json
# import sys
# reload(sys)
# sys.setdefaultencoding('utf8')
# import codecs
#
# f = codecs.open('globalData.min.json', 'r','gbk')
# f1 = open('country.txt', 'w')
#
# a=json.loads(f.read())
# for i in a:
#     print i['n']
#     f1.write(i['n']+' ')

# -*- coding: UTF-8 -*-
import urllib2
import os
import pymongo
# url='https://scontent-sea1-1.xx.fbcdn.net/v/t1.0-1/c0.17.100.100/p100x100/1743501_10201658534495021_300181536_n.jpg?oh=ddad91d732aa740f9438176aa63a5d80&oe=5AD3AA2F'
# u = url.replace('/','').replace('http:','').replace('https:','').replace('?','')
# print u
# f = urllib2.urlopen(url)
# data = f.read()
#
#
# p = os.getcwd()
# p = p.replace('\\facebookspider','').replace('\\','/')
# path ='https://www.facebook.com/jasline.lee.31?fref=pb&hc_location=friends_tab'.split('?')[0].split('/')[-1]
# path2 =p+'/facebookspider/templates/static/images/'
# print path2
# os.chdir(path2)
# print path
# isExists=os.path.exists(path)
# if not isExists:
#     print '1'
#     os.mkdir(path)
# with open(path+'/'+u +'.jpg', "wb") as imgfile:
#     imgfile.write(data)

client = pymongo.MongoClient(host="222.22.65.179", port=27017)
db = client["singapore"]
db.authenticate("yufei", "xjtu@2017")
coll = db["singaporefacebook2"]
u='https://www.facebook.com/derrick.tan.520?fref=pb&hc_location=friends_tab'
print coll.find_one({'url':u})['time']
print coll.find_one({'url':u})['name']
print coll.find_one({'url':u})['picture']
print coll.find_one({'url':u})['info']['contact']
print coll.find_one({'url':u})

#coll.remove({'url':'https://www.facebook.com/cody.rhodes.3152130?ref=br_rs'})
#coll.update({"url": 'https://www.facebook.com/cody.rhodes.1840070?ref=br_rs'}, {"$set": {"path": ''}})
# for i in coll.find({'keyword':'cody'}):
#     print i



# client = pymongo.MongoClient(host="222.22.65.179", port=27017)
# # client = pymongo.MongoClient(host="127.0.0.1", port=27017)
# db = client["singapore"]
# db.authenticate("yufei", "xjtu@2017")
# coll = db['singaporefacebook2']
# for i in coll.find({'url':'https://www.facebook.com/tim.slayee?fref=pb&hc_location=friends_tab'}).limit(10):
#     print i


#coll.ensure_index([('info','text'),('name','text')])

# str= "就读于：St. Hilda's Secondary School\n所在地：新加坡\n单身\n来自：新加坡\n"
# a={ }
# a['info']={ }
# a['info']['education']=''
# a['info']['work'] = ''
# a['info']['family'] = ''
# a['info']['location'] = ''
# a['info']['other'] = ''
# for i in str.split('\n'):
#     if ('就读' in i or '学习' in i):
#         a['info']['education'] += i+'\n'
#     elif('工作' in i):
#         a['info']['work'] += i + '\n'
#     elif('所在地' in i or '来自' in i):
#         a['info']['location'] += i + '\n'
#     elif ('结婚' in i):
#         a['info']['family'] += i + '\n'
#     elif(len(i)>0):
#         a['info']['other'] += i + '\n'
# if (len(a['info']['education'])) == 0:
#     a['info']['education'] = '无'
# if (len(a['info']['work'])) == 0:
#     a['info']['work'] = '无'
# if (len(a['info']['family'])) == 0:
#     a['info']['family'] = '无'
# if (len(a['info']['location'])) == 0:
#     a['info']['location'] = '无'
# if (len(a['info']['other'])) == 0:
#     a['info']['other'] = '无'
# print a['info']['education']
# print '----------'
# print a['info']['work']
# print '----------'
# print a['info']['family']
# print '----------'
# print a['info']['location']
# print '----------'
# print a['info']['other']
# print '----------'
# print a

