#-*- coding: UTF-8 -*-
from django.shortcuts import render
import pymongo
import time
import sys
import datetime
import json
from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponse
reload(sys)
sys.setdefaultencoding('utf8')
import os
from facebookquery import searchuser
from facebookquery import searchdetailed
# import thread
# import urllib2
# # 为线程定义一个函数
# def down():
#
#     p = os.getcwd()
#     path2 = ''
#     if '\static\images' not in p:
#         p = p.replace('\\facebookspider', '').replace('\\', '/')
#         path2 = p + '/facebookspider/templates/static/images/'
#     #     os.chdir(path2)
#
#
#     #下载图片
#     try :
#         u ='http://pic.qqtn.com/up/2018-3/2018031111040456359.jpg'
#         path = path2  + '/query2/' +  '1112.jpg'
#         print path
#         isExists = os.path.exists(path)
#         if not isExists:
#             print 2222
#             f = urllib2.urlopen(u)
#             data = f.read()
#             with open(path, "wb") as imgfile:
#                 imgfile.write(data)
#     except:
#         print 1111



@csrf_exempt
def index(request):
    if 'type' in request.POST and len(request.POST['type']) > 0:
        t = request.POST['type'].encode('utf-8')
        print t
        try:
            name = request.POST['name'].encode('utf-8')
        except:
            name = ''
        result = {'message': t,'name' :name}
        return render(request, 'index.html',result)
    else:
        return render(request, 'login.html')
@csrf_exempt
def search(request):
    if 'type' in request.POST and len(request.POST['type']) > 0:
        t = request.POST['type'].encode('utf-8')
        try:
            name = request.POST['name'].encode('utf-8')
        except:
            name = ''
        result = {'message': t,'name' :name}
        print '111'
        return render(request, 'search.html',result)
    else:
        return render(request, 'login.html')
@csrf_exempt
def chart(request):
    if 'type' in request.POST and len(request.POST['type']) > 0:
        t = request.POST['type'].encode('utf-8')
        if t=='admin':
            try:
                name = request.POST['name'].encode('utf-8')
            except:
                name = ''
            result = {'message': t, 'name': name}
            return render(request, 'chart.html',result)
        else:
            try:
                name = request.POST['name'].encode('utf-8')
            except:
                name = ''
            result = {'message': t, 'name': name}
            return render(request, 'index.html',result)
    else:
        return render(request, 'login.html')

def drawChart(request):
    if 'country' in request.GET and len(request.GET['country']) > 0 :
        country = ''
        state = ''
        city = ''
        location = request.GET['country'].encode('utf-8')
        country = request.GET['country'].encode('utf-8')
        if 'state' in request.GET and len(request.GET['state']) > 0:
            location = request.GET['state'].encode('utf-8')
            state = request.GET['state'].encode('utf-8')
            if 'city' in request.GET and len(request.GET['city']) > 0:
                location = request.GET['city'].encode('utf-8')
                city = request.GET['state'].encode('utf-8')
        if location=='新加坡':
            if 'tstart' in request.GET and len(request.GET['tstart']) and 'tend' in request.GET and len(request.GET['tend'])  > 0:
                tstart = request.GET['tstart'].encode('utf-8').replace('/','-')
                tend = request.GET['tend'].encode('utf-8').replace('/','-')
                if cmp(tstart,tend)==-1:
                    client = pymongo.MongoClient(host="222.22.65.179", port=27017)
                    db = client["singapore"]
                    db.authenticate("yufei", "xjtu@2017")
                    f = []
                    c = []
                    times = []
                    while cmp(tstart, tend) == -1:
                        t1 = datetime.datetime.strptime(tstart, '%Y-%m-%d %H')
                        t2 = t1 + datetime.timedelta(hours=1)
                        times.append(t2.strftime('%Y-%m-%d %H'))
                        coll = db["singaporeredyurl"]
                        friends = coll.find({'time': {"$gte": t1.strftime('%Y-%m-%d %H'),
                                                      "$lte": t2.strftime('%Y-%m-%d %H')}}).count()
                        f.append(friends)
                        coll = db["singaporefacebook2"]
                        count = coll.find({'time': {"$gte": t1.strftime('%Y-%m-%d %H'),
                                                    "$lte": t2.strftime('%Y-%m-%d %H')}}).count()
                        c.append(count)
                        tstart = t2.strftime('%Y-%m-%d %H')
                    client.close()
                    result = {'count': c,'friends': f,'times':times}
                    comment_json = json.dumps(result)
                    return HttpResponse(comment_json)
            else:
                result = {'location': location,'error': '请选择正确的时间区间'}
                comment_json = json.dumps(result)
                return HttpResponse(comment_json)
        else:
            result = {'location': location,'error': '暂不支持该地区'}
            comment_json = json.dumps(result)
            return HttpResponse(comment_json)


def historysearch(request): # 搜索历史
    request.encoding = 'utf-8'
    user = request.GET['user'].encode('utf-8')
    client = pymongo.MongoClient(host="222.22.65.179", port=27017)
    db = client["singapore"]
    db.authenticate("yufei", "xjtu@2017")
    coll = db["login"]
    try:
        historysearch = coll.find_one({'user': user})['historysearch']
    except:
        historysearch = []

    result = {'historysearch': historysearch}
    comment_json = json.dumps(result)
    return HttpResponse(comment_json)


def historyfirst(request):
    request.encoding = 'utf-8'
    if 'city' in request.GET and len(request.GET['city']) > 0:
        city = request.GET['city'].encode('utf-8')
        citycn = request.GET['citycn'].encode('utf-8')
        if 'tstart' in request.GET and len(request.GET['tstart']) and 'tend' in request.GET and len(request.GET['tend'])  > 0:
            tstart = request.GET['tstart'].encode('utf-8').replace('/','-')
            tend = request.GET['tend'].encode('utf-8').replace('/','-')
            if cmp(tstart,tend)==-1:
                client = pymongo.MongoClient(host="222.22.65.179", port=27017)
                db = client["singapore"]
                db.authenticate("yufei", "xjtu@2017")

                # user = request.GET['user'].encode('utf-8')
                # coll = db["login"]
                # historysearch = coll.find_one({'user': user})['historysearch']
                # historysearch.append(citycn)
                # coll.update({'user': user}, {"$set": {"historysearch": historysearch}})

                coll = db[city+"redyurl"]
                items= coll.find({'time':{"$gte":tstart,"$lte":tend}})
                count = items.count()
                if count==0:
                    result = {'location': citycn, 'error': '暂无数据'}
                    comment_json = json.dumps(result)
                    client.close()
                    return HttpResponse(comment_json)
                n =int(count/50.1 +1)
                result = {'location': citycn,'n':n}
                comment_json = json.dumps(result)
                client.close()
                return HttpResponse(comment_json)
            else:
                result = {'location': citycn, 'error': '请选择正确的时间区间'}
                comment_json = json.dumps(result)
                return HttpResponse(comment_json)
        else:
            result = {'location': citycn,'error': '请选择时间'}
            comment_json = json.dumps(result)
            return HttpResponse(comment_json)


def history(request):
    if 'num' in request.GET and len(request.GET['num']) > 0 :
        num = request.GET['num'].encode('utf-8')
        tstart = request.GET['tstart'].encode('utf-8').replace('/', '-')
        tend = request.GET['tend'].encode('utf-8').replace('/', '-')
        city = request.GET['city'].encode('utf-8')
        client = pymongo.MongoClient(host="222.22.65.179", port=27017)
        db = client["singapore"]
        db.authenticate("yufei", "xjtu@2017")
        coll = db[city+"redyurl"]
        start = (int(num) - 1) * 50
        d = coll.find({'time':{"$gte":tstart,"$lte":tend}}).limit(50).skip(start)
        l = []
        for i in d:
            a = {}
            a['name'] = i['name']
            a['picture'] = i['picture']
            a['url'] = i['url']
            a['path'] = ''
            l.append(a)
        result = {'list': l}
        comment_json = json.dumps(result)
        client.close()
        return HttpResponse(comment_json)

def data(request):
    request.encoding = 'utf-8'
    if 'city' in request.GET and len(request.GET['city']) > 0:
        city = request.GET['city'].encode('utf-8')
        citycn = request.GET['citycn'].encode('utf-8')
        min = int(request.GET['min'].encode('utf-8'))*60
        client = pymongo.MongoClient(host="222.22.65.179", port=27017)
        db = client["singapore"]
        db.authenticate("yufei", "xjtu@2017")

        user = request.GET['user'].encode('utf-8')
        coll = db["login"]
        try:
            historysearch = coll.find_one({'user': user})['historysearch']
        except:
            historysearch = []
        b = True
        for i in historysearch:
            if(i == citycn):
                b = False
                break
        if(b):
            historysearch.append(citycn)
            coll.update({'user': user}, {"$set": {"historysearch": historysearch}})

        coll = db["location"]
        lo = coll.find_one({'location': city})
        if lo == None:
            print city
            coll.remove({})
            coll.insert({'location': city, 'locationcn': citycn, 'error': 't'})
            result = {'error': '正在切换请稍后'}
            comment_json = json.dumps(result)
            client.close()
            return HttpResponse(comment_json)
        elif lo['error'] !='t':
            result = {'error': lo['error']}
            comment_json = json.dumps(result)
            client.close()
            return HttpResponse(comment_json)
        else:
            coll = db[city+"redyurl"]
            t1 = time.localtime(time.time())
            t2 = time.localtime(time.time() - min)
            a1 = coll.find({"time": {"$lte": time.strftime('%Y-%m-%d %H:%M:%S', t1)}}).count()
            a2 = coll.find({"time": {"$lte": time.strftime('%Y-%m-%d %H:%M:%S', t2)}}).count()
            number=a1-a2
            coll = db[city+"facebook2"]
            # time.strftime('%Y-%m-%d %H:%M:%S', t)
            items = coll.find({'time': {'$gte': time.strftime('%Y-%m-%d %H:%M:%S', t2)}})
            if items.count() == 0:
                result = {'location': citycn, 'error': '正在加载请耐心等待'}
                comment_json = json.dumps(result)
                client.close()
                return HttpResponse(comment_json)
            list = []
            str = '全部好友'
            for i in items:
                try:
                    for j in i['friendsList'][str.decode()]:
                        list.append(j)
                        if (len(list) >= number):
                            break
                    if (len(list) >= number):
                        break
                    a = {}
                    a['name'] = i['name']
                    a['picture'] = i['picture']
                    a['url'] = i['url']
                    a['path'] = ''
                    list.append(a)
                except:
                    pass
            result = {'location': citycn, 'list': list}
            comment_json = json.dumps(result)
            client.close()
            return HttpResponse(comment_json)
    else:
        result = {'error': '暂不支持该地区'}
        comment_json = json.dumps(result)
        return HttpResponse(comment_json)


def dataright(request):
    request.encoding = 'utf-8'
    if 'city' in request.GET and len(request.GET['city']) > 0:
        city = request.GET['city'].encode('utf-8')
        citycn = request.GET['citycn'].encode('utf-8')
        min = int(request.GET['min'].encode('utf-8'))*60
        client = pymongo.MongoClient(host="222.22.65.179", port=27017)
        db = client["singapore"]
        db.authenticate("yufei", "xjtu@2017")
        coll = db[city+"facebookurl"]
        count = coll.find().count()
        coll = db[city+"facebook2"]
        t = time.localtime(time.time() - min)
        a=coll.find().count()
        a2 = coll.find({'time': {'$lte': time.strftime('%Y-%m-%d %H:%M:%S', t)}}).count()
        count2=count-(a-a2)
        coll = db[city+"redyurl"]
        friends = coll.find().count()
        t1 = time.localtime(time.time())
        t2 = time.localtime(time.time() - min)
        a1 = coll.find({"time": {"$lte": time.strftime('%Y-%m-%d %H:%M:%S', t1)}}).count()
        a2 = coll.find({"time": {"$lte": time.strftime('%Y-%m-%d %H:%M:%S', t2)}}).count()
        friends2 = friends - (a1-a2)
        result = {'location': citycn, 'count': count, 'count2': count2, 'friends': friends, 'friends2': friends2}
        comment_json = json.dumps(result)
        client.close()
        return HttpResponse(comment_json)


def login(request):
    request.encoding = 'utf-8'
    if 'user' in request.POST and len(request.POST['user']) > 0 :
        user = request.POST['user'].encode('utf-8')
        password = request.POST['password'].encode('utf-8')
        client = pymongo.MongoClient(host="222.22.65.179", port=27017)
        db = client["singapore"]
        db.authenticate("yufei", "xjtu@2017")
        coll = db["login"]
        t = coll.find_one({'user':user,'password':password})
        if type(t) != type(None):
            message = t['type']
            result = {'message': message, 'name' :t['user']}
            return render(request, 'index.html', result)
        else:
            message = '登录失败'
            result = {'message': message,}
            return render(request, 'login.html', result)
    else:
        return render(request, 'login.html')


def output(request):
    if 'tstart' in request.GET and len(request.GET['tstart']) >0 and 'tend' in request.GET and len(
            request.GET['tend']) > 0:
        tstart = request.GET['tstart'].encode('utf-8').replace('/', '-')
        tend = request.GET['tend'].encode('utf-8').replace('/', '-')
        if cmp(tstart, tend) == -1:
            client = pymongo.MongoClient(host="222.22.65.179", port=27017)
            db = client["singapore"]
            db.authenticate("yufei", "xjtu@2017")
            coll = db["singaporeredyurl"]
            items = coll.find({'time': {"$gte": tstart, "$lte": tend}}).limit(1000)
            count = items.count()
            if count == 0:
                result = {'error': '暂无数据'}
                comment_json = json.dumps(result)
                client.close()
                return HttpResponse(comment_json)
            result = {'list': items}
            client.close()
            return render(request, 'output.html', result)

        else:
            result = { 'error': '请选择正确的时间区间'}
            comment_json = json.dumps(result)
            return HttpResponse(comment_json)
    else:
        result = { 'error': '请选择时间'}
        comment_json = json.dumps(result)
        return HttpResponse(comment_json)

# 在线查询
def query1(request):
    if 'keyword' in request.GET and len(request.GET['keyword'])>0 :
        keyword = request.GET['keyword'].encode('utf-8').strip()
        #username = request.GET['user'].encode('utf-8').strip()
        client = pymongo.MongoClient(host="222.22.65.179", port=27017)
        db = client["detailed"]
        db.authenticate("yufei", "xjtu@2017")
        coll = db["query1"]
        items = coll.find({'keyword':keyword})
        if items.count() ==0:
            user = searchuser(keyword)
            #searchdetailed(username)
            if user == 'f' or len(user) == 0:
                result = {'error': '未找到结果','sign':'t'}
                comment_json = json.dumps(result)
                return HttpResponse(comment_json)
            list = []
            for i in user:
                coll.insert(i)
                a = {}
                a['name'] = i['name']
                a['url'] = i['url']
                a['picture'] = i['picture']
                a['path'] = i['path']
                a['headline'] = i['headline'].replace('\n','<br/>').replace('<br/><br/>','<br/>')
                list.append(a)
            n = int(len(list)/ 100.1 + 1)
            result = {'list': list,'n':n,'sign':'t'}
            comment_json = json.dumps(result)
            client.close()
            return HttpResponse(comment_json)
        else:
            list = []
            for i in items:
                a = {}
                a['name'] = i['name']
                a['url'] = i['url']
                a['picture'] = i['picture']
                a['path'] = i['path']
                a['headline'] = i['headline'].replace('\n','<br/>').replace('<br/><br/>','<br/>')
                list.append(a)
            n = int(len(list) / 100.1 + 1)
            result = {'list': list,'n':n,'sign':'f'}
            comment_json = json.dumps(result)
            client.close()
            return HttpResponse(comment_json)
    else:
        result = {'error': '请输入请求','sign':'f'}
        comment_json = json.dumps(result)
        return HttpResponse(comment_json)

#继续抓取队列
def continuedetailed(request):
    if 'user' in request.GET and len(request.GET['user']) > 0:
        user = request.GET['user'].encode('utf-8').strip()
        searchdetailed(user)
        result = {'finish': 'finish'}
        comment_json = json.dumps(result)
        return HttpResponse(comment_json)

# 本地离线查询
def query2(request):
    if 'keyword' in request.GET and len(request.GET['keyword'])>0 :
        keyword = request.GET['keyword'].encode('utf-8').strip()
        client = pymongo.MongoClient(host="222.22.65.179", port=27017)
        db = client["singapore"]
        db.authenticate("yufei", "xjtu@2017")
        coll = db["singaporeredyurl"]
        items = coll.find({ '$text': { '$search': keyword } }).limit(100)
        count = items.count()
        n = int(count / 100.1 + 1)
        if items.count()==0:
            result = {'error': '未找到结果'}
            comment_json = json.dumps(result)
            client.close()
            return HttpResponse(comment_json)
        else:
            list = []
            for i in items:
                a = {}
                a['name'] = i['name']
                a['url'] = i['url']
                a['picture'] = i['picture']
                a['path'] = ''
                a['headline'] = ''
                list.append(a)
            result = {'list': list,'n':n}
            comment_json = json.dumps(result)
            client.close()
            return HttpResponse(comment_json)
    else:
        result = {'error': '请输入请求'}
        comment_json = json.dumps(result)
        return HttpResponse(comment_json)

# 详细信息查询（多关键字）
def query3(request):
    if 'keyword' in request.GET and len(request.GET['keyword'])>0 :
        keyword = request.GET['keyword'].encode('utf-8').strip()
        keyword2 = request.GET['keyword2'].encode('utf-8')
        client = pymongo.MongoClient(host="222.22.65.179", port=27017)
        db = client["detailed"]
        db.authenticate("yufei", "xjtu@2017")
        coll = db["searchdetailed"]
        if  keyword2 == '0':
            k = keyword.replace('；', ';').replace(';', ' ')
            items = coll.find({ '$text': { '$search': k } }).limit(100)
        else:
            k = keyword.replace('；', ';').replace(';', '\"\"')
            k = '\"' + k + '\"'
            items = coll.find({'$text': {'$search': k}}).limit(100)
        count = items.count()

        db = client["singapore"]
        db.authenticate("yufei", "xjtu@2017")
        coll = db["singaporefacebook2"]
        if  keyword2 == '0':
            k = keyword.replace('；', ';').replace(';', ' ')
            items2 = coll.find({ '$text': { '$search': k } }).limit(100-count)
        else:
            k = keyword.replace('；', ';').replace(';', '\"\"')
            k = '\"' + k + '\"'
            items2 = coll.find({'$text': {'$search': k}}).limit(100-count)
        count2 = items2.count()
        count = count+count2
        n = int(count / 100.1 + 1)
        if count==0:
            result = {'error': '未找到结果'}
            comment_json = json.dumps(result)
            client.close()
            return HttpResponse(comment_json)
        else:
            list = []
            sign ={}
            for i in items:
                a = {}
                try:
                    a['name'] = i['name']
                    a['picture'] = i['picture']
                except:
                    a['name'] = ''
                    a['picture'] = ''
                a['url'] = i['url']
                sign[a['url']] =1
                a['path'] = ''
                a['headline'] = i['info']
                list.append(a)
            for i in items2:
                if sign.has_key(i['url']):
                    continue
                else:
                    a = {}
                    try:
                        a['name'] = i['name']
                        a['picture'] = i['picture']
                    except:
                        a['name'] = ''
                        a['picture'] = ''
                    a['url'] = i['url']
                    a['path'] = ''
                    a['headline'] = i['info']
                    list.append(a)
            result = {'list': list,'n':n}
            comment_json = json.dumps(result)
            client.close()
            return HttpResponse(comment_json)
    else:
        result = {'error': '请输入请求'}
        comment_json = json.dumps(result)
        return HttpResponse(comment_json)

# 分页
def queryfenye(request):
    if 'keyword' in request.GET and len(request.GET['keyword']) > 0:
        keyword = request.GET['keyword'].encode('utf-8').strip()
        num = request.GET['num'].encode('utf-8').strip()
        start = (int(num) - 1) * 100
        if 'keyword2' in request.GET and len(request.GET['keyword2']) > 0:
            keyword2 = request.GET['keyword2'].encode('utf-8')
            client = pymongo.MongoClient(host="222.22.65.179", port=27017)
            db = client["singapore"]
            db.authenticate("yufei", "xjtu@2017")
            coll = db["singaporefacebook2"]
            if keyword2 == '0':
                k = keyword.replace('；', ';').replace(';', ' ')
                items = coll.find({'$text': {'$search': k}}).limit(100).skip(start)
            else:
                k = keyword.replace('；', ';').replace(';', '\"\"')
                k = '\"' + k + '\"'
                items = coll.find({'$text': {'$search': k}}).limit(100).skip(start)
            if items.count() == 0:
                result = {'list': []}
                comment_json = json.dumps(result)
                client.close()
                return HttpResponse(comment_json)
            else:
                list = []
                for i in items:
                    a = {}
                    try:
                        a['name'] = i['name']
                        a['picture'] = i['picture']
                    except:
                        a['name'] = ''
                        a['picture'] = ''
                    a['url'] = i['url']
                    a['path'] = ''
                    a['headline'] = i['info']
                    list.append(a)
                result = {'list': list}
                comment_json = json.dumps(result)
                client.close()
                return HttpResponse(comment_json)
        else:
            client = pymongo.MongoClient(host="222.22.65.179", port=27017)
            db = client["singapore"]
            db.authenticate("yufei", "xjtu@2017")
            coll = db["singaporeredyurl"]
            items = coll.find({'$text': {'$search': keyword}}).limit(100).skip(start)
            if items.count() == 0:
                result = {'list': []}
                comment_json = json.dumps(result)
                client.close()
                return HttpResponse(comment_json)
            else:
                list = []
                for i in items:
                    a = {}
                    a['name'] = i['name']
                    a['url'] = i['url']
                    a['picture'] = i['picture']
                    a['path'] = ''
                    a['headline'] = ''
                    list.append(a)
                result = {'list': list}
                comment_json = json.dumps(result)
                client.close()
                return HttpResponse(comment_json)
    else:
        result = {'error': '请输入请求'}
        comment_json = json.dumps(result)
        return HttpResponse(comment_json)

# 搜索详细主页(点击搜索按钮) 加入列表
def detailed(request):
    if 'list' in request.GET and len(request.GET['list'])>0 and 'user' in request.GET and len(request.GET['user'])>0 :
        user = request.GET['user'].encode('utf-8')
        list = json.loads(request.GET['list'].encode('utf-8'))
        keyword = request.GET['keyword'].encode('utf-8')
        try:
            keyword2 = request.GET['keyword2'].encode('utf-8')
            if keyword2 == '0':
                keyword = keyword.replace('；', ';')+' 并集'
            else:
                keyword = keyword.replace('；', ';')+' 交集'
        except:
            keyword = keyword.replace('；', ';')
        client = pymongo.MongoClient(host="222.22.65.179", port=27017)
        db = client["detailed"]
        db.authenticate("yufei", "xjtu@2017")
        coll = db[user]
        coll.ensure_index('url', unique=True)
        for i in list['list']:
            try:
                coll.insert({'url':i['url'],'picture':i['picture'],'name':i['name'],'path':i['path'],'type':'f','keyword':keyword})
            except:
                pass
        searchdetailed(user)
        result = {'finish': 'finish'}
        comment_json = json.dumps(result)
        client.close()
        return HttpResponse(comment_json)

#  个人中心（访问队列）keyword
def searchlist(request):
    if 'user' in request.GET and len(request.GET['user'])>0 :
        user = request.GET['user'].encode('utf-8')
        client = pymongo.MongoClient(host="222.22.65.179", port=27017)
        db = client["detailed"]
        db.authenticate("yufei", "xjtu@2017")
        coll = db[user]
        items = coll.aggregate([{"$group": {"_id": "$keyword"}}])
        list = []
        for i in items:
            a={}
            a['keyword'] = i['_id']
            sign = coll.find_one({'type':'f','keyword':a['keyword']})
            if sign == None:
                a['sign'] = 't'
            else:
                a['sign'] = 'f'
            list.append(a)
        result = {'list': list}
        comment_json = json.dumps(result)
        client.close()
        return HttpResponse(comment_json)

# 个人中心（访问队列） url
def searchurl(request):
    if 'user' in request.GET and len(request.GET['user']) > 0:
        user = request.GET['user'].encode('utf-8')
        try:
            keyword = request.GET['keyword'].encode('utf-8')
        except:
            keyword = ''
        client = pymongo.MongoClient(host="222.22.65.179", port=27017)
        db = client["detailed"]
        db.authenticate("yufei", "xjtu@2017")
        coll = db[user]
        items = coll.find({'keyword':keyword})
        list = []
        for i in items:
            a = {}
            a['url'] = i['url']
            a['type'] = i['type']
            a['picture'] = i['picture']
            a['name'] = i['name']
            a['path'] = i['path']
            list.append(a)
        result = {'list': list}
        comment_json = json.dumps(result)
        client.close()
        return HttpResponse(comment_json)


# 删除队列
def deletekeyword(request):
    if 'keyword' in request.GET and len(request.GET['keyword'])>0 and 'user' in request.GET and len(request.GET['user'])>0 :
        keyword = request.GET['keyword'].encode('utf-8')
        user = request.GET['user'].encode('utf-8')
        client = pymongo.MongoClient(host="222.22.65.179", port=27017)
        db = client["detailed"]
        db.authenticate("yufei", "xjtu@2017")
        coll = db[user]
        coll.remove({'keyword':keyword})
        result = {'finish': 'finish'}
        comment_json = json.dumps(result)
        client.close()
        return HttpResponse(comment_json)

# 删除队列某项
def deleteurl(request):
    if 'url' in request.GET and len(request.GET['url']) > 0 and 'user' in request.GET and len(
            request.GET['user']) > 0:
        url = request.GET['url'].encode('utf-8')
        user = request.GET['user'].encode('utf-8')
        client = pymongo.MongoClient(host="222.22.65.179", port=27017)
        db = client["detailed"]
        db.authenticate("yufei", "xjtu@2017")
        coll = db[user]
        coll.remove({'url': url})
        result = {'finish': 'finish'}
        comment_json = json.dumps(result)
        client.close()
        return HttpResponse(comment_json)

# 获取主页内容
def toshow(request):
    if 'url' in request.GET and len(request.GET['url'])>0 :
        url = request.GET['url'].encode('utf-8')
        try:
            name = request.GET['name'].encode('utf-8')
        except:
            name = ''
        type = request.GET['type'].encode('utf-8')
        client = pymongo.MongoClient(host="222.22.65.179", port=27017)
        db = client["detailed"]
        db.authenticate("yufei", "xjtu@2017")
        coll = db['searchdetailed']
        item = coll.find_one({'url':url})
        if item !=None:
            try:
                num = len(item['friendsList']['全部好友'.decode()])
                friendsList = []
                n = 0
                for i in item['friendsList']['全部好友'.decode()]:
                    friendsList.append(i['picture'])
                    n +=1
                    if n>=12:
                        break
            except:
                num = 0
                friendsList = []
            try:
                path =item['path']
            except:
                path = ''
            try:
                groups  = len(item['groups'])
            except:
                groups  = 0
            try:
                likes  = len(item['likes']['全部'.decode()])
            except:
                likes  = 0
            result = {'url':url,'name1': item['name'],'tweet': json.dumps(item['tweet']),'picture': item['picture'],'info': item['info']
                     ,'num': num,'friendsList': friendsList,'name': name,'type':type,'path':path,'groups':groups,'likes':likes}
            comment_json = json.dumps(result)
            client.close()
            return render(request, 'detail.html', {'result':comment_json})
        else:
            try:
                path =item['path']
            except:
                path = ''
            result = {'url':url,'name': name,'type':type,'info':'页面无法显示<br/> 该链接已经失效或页面已被移除','path':path}
            comment_json = json.dumps(result)
            client.close()
            return render(request, 'detail.html', {'result':comment_json})

# def toshow(request):
#     if 'url' in request.GET and len(request.GET['url'])>0 :
#         url = request.GET['url'].encode('utf-8')
#         try:
#             name = request.GET['name'].encode('utf-8')
#         except:
#             name = ''
#         type = request.GET['type'].encode('utf-8')
#         client = pymongo.MongoClient(host="222.22.65.179", port=27017)
#         db = client["detailed"]
#         db.authenticate("yufei", "xjtu@2017")
#         coll = db['searchdetailed']
#         item = coll.find_one({'url':url})
#         if item !=None:
#             try:
#                 num = len(item['friendsList']['全部好友'.decode()])
#                 friendsList = []
#                 n = 0
#                 for i in item['friendsList']['全部好友'.decode()]:
#                     friendsList.append(i['picture'])
#                     n +=1
#                     if n>=12:
#                         break
#             except:
#                 num = 0
#                 friendsList = []
#             try:
#                 path =item['path']
#             except:
#                 path = ''
#             try:
#                 groups  = len(item['groups'])
#             except:
#                 groups  = 0
#             try:
#                 likes  = len(item['全部'.decode()])
#             except:
#                 likes  = 0
#             result = {'url':url,'name1': item['name'],'tweet': item['tweet'],'picture': item['picture'],'info': item['info']
#                      ,'num': num,'friendsList': friendsList,'name': name,'type':type,'path':path,'groups':groups,'likes':likes}
#             comment_json = json.dumps(result)
#             client.close()
#             return HttpResponse(comment_json)
#         else:
#             try:
#                 path =item['path']
#             except:
#                 path = ''
#             result = {'url':url,'name': name,'type':type,'info':'页面无法显示<br/> 该链接已经失效或页面已被移除','path':path}
#             comment_json = json.dumps(result)
#             client.close()
#             return HttpResponse(comment_json)


# 获取好友内容
def searchfriends(request):
    if 'url' in request.GET and len(request.GET['url']) >0 :
        url = request.GET['url'].encode('utf-8')
        print url
        client = pymongo.MongoClient(host="222.22.65.179", port=27017)
        db = client["detailed"]
        db.authenticate("yufei", "xjtu@2017")
        coll = db['searchdetailed']
        item = coll.find_one({'url':url})
        if item !=None:
            result = {'friendsList': item['friendsList']}
            comment_json = json.dumps(result)
            client.close()
            return HttpResponse(comment_json)
        else:
            result = {'friendsList': []}
            comment_json = json.dumps(result)
            client.close()
            return HttpResponse(comment_json)


# 跳转到好友页面
def friends(request):
    if 'url' in request.GET and len(request.GET['url']) >0 :
        url = request.GET['url'].encode('utf-8')
        try:
            name = request.GET['name'].encode('utf-8')
        except:
            name = ''
        type = request.GET['type'].encode('utf-8')
        print type
        picture = request.GET['picture'].encode('utf-8')
        name1 = request.GET['name1'].encode('utf-8')
        result = {'url': url,'name':name,'name1':name1,'picture':picture,'type':type}
        return render(request, 'friends.html', result)

# 获取赞的内容
def searchlikes(request):
    if 'url' in request.GET and len(request.GET['url']) >0 :
        url = request.GET['url'].encode('utf-8')
        print url
        client = pymongo.MongoClient(host="222.22.65.179", port=27017)
        db = client["detailed"]
        db.authenticate("yufei", "xjtu@2017")
        coll = db['searchdetailed']
        item = coll.find_one({'url':url})
        if item !=None:
            try:
                likes = item['likes']
            except:
                likes=[]
            result = {'likes': likes}
            comment_json = json.dumps(result)
            client.close()
            return HttpResponse(comment_json)
        else:
            result = {'likes': []}
            comment_json = json.dumps(result)
            client.close()
            return HttpResponse(comment_json)


# 跳转到赞页面
def likes(request):
    if 'url' in request.GET and len(request.GET['url']) >0 :
        url = request.GET['url'].encode('utf-8')
        try:
            name = request.GET['name'].encode('utf-8')
        except:
            name = ''
        type = request.GET['type'].encode('utf-8')
        print type
        picture = request.GET['picture'].encode('utf-8')
        name1 = request.GET['name1'].encode('utf-8')
        client = pymongo.MongoClient(host="222.22.65.179", port=27017)
        db = client["detailed"]
        db.authenticate("yufei", "xjtu@2017")
        coll = db['searchdetailed']
        item = coll.find_one({'url':url})
        if item !=None:
            try:
                likes = item['likes']
            except:
                likes=[]
            result = {'url': url, 'name': name, 'name1': name1, 'picture': picture, 'type': type,'likes': likes}
            comment_json = json.dumps(result)
            client.close()
            return render(request, 'likes.html', {'result':comment_json})
        else:
            result = {'url': url, 'name': name, 'name1': name1, 'picture': picture, 'type': type, 'likes': []}
            comment_json = json.dumps(result)
            client.close()
            return render(request, 'likes.html', {'result':comment_json})


# 获取小组内容
def searchgroups(request):
    if 'url' in request.GET and len(request.GET['url']) >0 :
        url = request.GET['url'].encode('utf-8')
        print url
        client = pymongo.MongoClient(host="222.22.65.179", port=27017)
        db = client["detailed"]
        db.authenticate("yufei", "xjtu@2017")
        coll = db['searchdetailed']
        item = coll.find_one({'url':url})
        if item !=None:
            try:
                groups = item['groups']
            except:
                groups=[]
            result = {'groups': groups}
            comment_json = json.dumps(result)
            client.close()
            return HttpResponse(comment_json)
        else:
            result = {'groups': []}
            comment_json = json.dumps(result)
            client.close()
            return HttpResponse(comment_json)


# 跳转到小组页面
def groups(request):
    if 'url' in request.GET and len(request.GET['url']) >0 :
        url = request.GET['url'].encode('utf-8')
        try:
            name = request.GET['name'].encode('utf-8')
        except:
            name = ''
        type = request.GET['type'].encode('utf-8')
        picture = request.GET['picture'].encode('utf-8')
        print picture
        name1 = request.GET['name1'].encode('utf-8')
        client = pymongo.MongoClient(host="222.22.65.179", port=27017)
        db = client["detailed"]
        db.authenticate("yufei", "xjtu@2017")
        coll = db['searchdetailed']
        item = coll.find_one({'url':url})
        if item !=None:
            try:
                groups = item['groups']
            except:
                groups=[]
            result = {'url': url, 'name': name, 'name1': name1, 'picture': picture, 'type': type,'groups': groups}
            comment_json = json.dumps(result)
            client.close()
            return render(request, 'groups.html', {'result':comment_json})
        else:
            result = {'url': url, 'name': name, 'name1': name1, 'picture': picture, 'type': type, 'groups': []}
            comment_json = json.dumps(result)
            client.close()
            return render(request, 'groups.html', {'result':comment_json})