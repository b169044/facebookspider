#-*- coding: UTF-8 -*-
import pymongo
import datetime
from pylab import *


client = pymongo.MongoClient(host="222.22.65.179", port=27017)
db = client["singapore"]
db.authenticate("yufei", "xjtu@2017")
start= '2017-12-28 09:00:00'
end = '2017-12-29 18:00:00'
f = []
c = []
times=[]
while cmp(start,end)==-1:
    t1 = datetime.datetime.strptime(start, '%Y-%m-%d %H:%M:%S')
    t2 = t1+datetime.timedelta(hours=1)
    times.append(t2.strftime('%Y-%m-%d %H:%M:%S'))
    print t2
    coll = db["redyurl"]
    friends = coll.find({'time': {"$gte": t1.strftime('%Y-%m-%d %H:%M:%S'), "$lte": t2.strftime('%Y-%m-%d %H:%M:%S')}}).count()
    f.append(friends)
    coll = db["facebook2"]
    count = coll.find({'time': {"$gte": t1.strftime('%Y-%m-%d %H:%M:%S'), "$lte": t2.strftime('%Y-%m-%d %H:%M:%S')}}).count()
    c.append(count)
    start = t2.strftime('%Y-%m-%d %H:%M:%S')
client.close()
print f
print c
print times

# f=[22858, 11038, 24076, 20341, 19392, 16750, 30457, 29205, 15473, 29492, 20814, 24380, 13246, 2535]
# # c=[54, 52, 72, 65, 0, 0, 20, 64, 65, 48, 38, 0, 24, 45, 45, 74, 18, 1, 52, 75, 82, 72, 0, 19, 63, 61, 53, 26, 0, 42, 39, 44, 64, 2, 10, 84, 84, 73, 41, 0, 56, 70, 60, 55, 5, 17, 50, 60, 54, 38, 0, 29, 46, 44, 27, 11, 19, 66, 57, 30, 32, 0, 41, 45, 56, 56, 14, 11, 52, 34, 58, 29, 0]
# times=['2017-12-26 15:10:00', '2017-12-26 20:40:00', '2017-12-27 02:10:00', '2017-12-27 07:40:00', '2017-12-27 13:10:00', '2017-12-27 18:40:00', '2017-12-28 00:10:00', '2017-12-28 05:40:00', '2017-12-28 11:10:00', '2017-12-28 16:40:00', '2017-12-28 22:10:00', '2017-12-29 03:40:00', '2017-12-29 09:10:00', '2017-12-29 14:40:00']

names = times
x = range(len(names))
plt.plot(x, f, marker='o', mec='r', mfc='w',label='friends')
# plt.plot(x, c, marker='*', ms=10,label='persons')
plt.legend()  # 让图例生效
plt.xticks(x, names, rotation=45)
plt.margins(0)
plt.subplots_adjust(bottom=0.15)
plt.xlabel("time") #X轴标签
plt.ylabel("count") #Y轴标签
plt.title("facebook spider") #标题

plt.show()