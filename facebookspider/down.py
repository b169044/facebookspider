#-*- coding: UTF-8 -*-
import urllib2
import os

# 下载图片
u=['https://scontent-sea1-1.xx.fbcdn.net/v/t1.0-1/p100x100/21231987_907777646041968_4190903079994133167_n.jpg?oh=9710fa3a4ea65047d21613046b6ccc85&oe=5AC22379',
   'https://scontent-sea1-1.xx.fbcdn.net/v/t1.0-1/p74x74/13133347_265978470416155_6293405909792742478_n.jpg?oh=af3ddd2a27438add2796e661dca361c8&oe=5AE30F7E',
   'https://scontent-sea1-1.xx.fbcdn.net/v/t1.0-1/p100x100/11221965_891518724276938_1612789207587717359_n.jpg?oh=8467a3a6e7894e5d9584dfec1df0b30e&oe=5AD5F3AA',
   'https://scontent-sea1-1.xx.fbcdn.net/v/t1.0-1/p100x100/13434823_1300511793307441_9051313677091812561_n.jpg?oh=bbddd3664dcb8519df8f806c378c4ce8&oe=5A938348',
   'https://scontent-sea1-1.xx.fbcdn.net/v/t1.0-1/p100x100/18519831_10155380175107372_8807488897697528144_n.jpg?oh=c8c86d802e2f31d5873625c919e3f5a7&oe=5A940401']
i=0
proxy = urllib2.ProxyHandler({'http': '127.0.0.1:8123','https': '127.0.0.1:8123'})
opener = urllib2.build_opener(proxy)
urllib2.install_opener(opener)
p = os.getcwd()
p = p.replace('\\facebookspider', '').replace('\\', '/')
path = 'query1'
path2 = p + '/facebookspider/templates/static/images/'
os.chdir(path2)
isExists = os.path.exists(path)
if not isExists:
    print '创建' + path
    os.mkdir(path)
while i<len(u):
        path = 'query1'
        b=u[i]
        b2 = b.replace('/', '').replace('http:', '').replace('https:', '').replace('?', '')
        f = urllib2.urlopen(b)
        data = f.read()
        path = path + '/' + b2 + '.jpg'
        with open(path , "wb") as imgfile:
            imgfile.write(data)
        a = path


        print a
        i +=1


