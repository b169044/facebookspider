#-*- coding: UTF-8 -*-

import time
import urllib
import datetime
from selenium import webdriver
from selenium.webdriver.support.ui import WebDriverWait
import traceback
from bs4 import BeautifulSoup
import pymongo
import random
import json
import os
from pyvirtualdisplay import Display
from selenium.common.exceptions import TimeoutException
import urllib2
import thread
account = [
    {
        'TEST_ACCOUNT': "b169044@163.com",
        'TEST_PASSWORD': "li88637129"
    }
 ,
    {
        'TEST_ACCOUNT': "15029232068",
        'TEST_PASSWORD': "xjtu@2017"
    }
    ,
    {
        'TEST_ACCOUNT': "zzuhenryzhang@163.com",
        'TEST_PASSWORD': "li88637129"
    }
]
# ips = [
#     '52.27.192.84',
#     '52.43.254.119',
#     '54.191.99.31',
#     '34.211.20.253',
#     '52.41.169.105'
# ]

import time
import sys

reload(sys)
sys.setdefaultencoding('utf8')

def download(pictures):
    proxy = urllib2.ProxyHandler({'http': '127.0.0.1:8123', 'https': '127.0.0.1:8123'})
    opener = urllib2.build_opener(proxy)
    urllib2.install_opener(opener)
    p = os.getcwd()
    path2 = p + '/templates/static/images/'
    for i in pictures:
        #下载图片
        try :
            u = i.replace('/', '').replace('http:', '').replace('https:', '').replace('?', '')
            path = path2 + 'query1/' + u + '.jpg'
            isExists = os.path.exists(path)
            if not isExists:
                f = urllib2.urlopen(i)
                data = f.read()
                with open(path, "wb") as imgfile:
                    imgfile.write(data)
        except:
            print i
            print '出错'




class FacebookSearch(object):
    # 定义静态变量实例
    __singleton = None

    @staticmethod
    def get_instance(x):
        if FacebookSearch.__singleton is None:
            FacebookSearch.__singleton = FacebookSearch(x)
        return FacebookSearch.__singleton

    def __init__(self, x):
        headers = [
            {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.87 Safari/537.36'
            },
            {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64; rv:38.0) Gecko/20100101 Firefox/38.0'
            },
            {
                'User-Agent': ' Mozilla/5.0 (Windows NT 6.2; WOW64; rv:21.0) Gecko/20100101 Firefox/21.0'
            },
            {
                'User-Agent': ' Mozilla/5.0 (Windows NT 6.1; rv:2.0.1) Gecko/20100101 Firefox/4.0.1'
            },
            {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64; Trident/7.0; .NET4.0C; .NET4.0E; .NET CLR 2.0.50727; .NET CLR 3.0.30729; .NET CLR 3.5.30729; InfoPath.3; rv:11.0) like Gecko'
            }
        ]
        display = Display(visible=0, size=(1280, 936))
        display.start()
        chrome_options = webdriver.ChromeOptions()
        chrome_options.add_argument('disable-infobars')
        chrome_options.add_argument('no-sandbox')
        chrome_options.add_argument('--proxy-server=http://127.0.0.1:8123')
        agent = headers[random.randint(0, 4)]['User-Agent']
        print agent
        chrome_options.add_argument('user-agent=' + agent)
        prefs = {"profile.default_content_setting_values.notifications": 2}
        chrome_options.add_experimental_option("prefs", prefs)
        self.driver = webdriver.Chrome(chrome_options=chrome_options)


        self.driver.get("http://www.facebook.com/")

        facebookUsername = account[x]['TEST_ACCOUNT']
        facebookPassword = account[x]['TEST_PASSWORD']
        emailFieldID = "email"
        passFieldID = "pass"
        loginButton = "loginbutton"

        emailFieldElement = WebDriverWait(self.driver, 5).until(lambda driver: driver.find_element_by_id(emailFieldID))
        passFieldElement = WebDriverWait(self.driver, 5).until(lambda driver: driver.find_element_by_id(passFieldID))
        loginButtonElement = WebDriverWait(self.driver, 5).until(lambda driver: driver.find_element_by_id(loginButton))

        emailFieldElement.clear()
        emailFieldElement.send_keys(facebookUsername)
        passFieldElement.clear()
        passFieldElement.send_keys(facebookPassword)
        loginButtonElement.click()
        print 'facebook login ok. ' + facebookUsername
        time.sleep(2)

    # 无权访问此人的主页
    def location(self, homepage):
        driver = self.driver
        n = 0
        while n < 2:
            try:
                driver.get(homepage)
                time.sleep(3)
                try:
                    page = BeautifulSoup(driver.page_source, "lxml")
                    ul = page.find_all("ul", {"class": "_6_7 clearfix"})
                    if len(ul) == 0:
                        div = page.find("div", {"class": "mvl ptm uiInterstitial uiInterstitialLarge uiBoxWhite"})
                        text = div.get_text()
                        if '无权访问此个人主页' in text:
                            print '333'
                            return '页面无法显示'
                        print '222'
                        return '出错'
                    li = page.find_all("li", {"class": "_1zw6 _md0 _5h-n _5vb9"})
                    synopsis = ''
                    for i in li:
                        synopsis += i.get_text() + '\n'
                    return synopsis
                except:
                    return False
            except TimeoutException:
                n += 1

    def getgroup(self, home_page):
        driver = self.driver
        if ('profile.php?id=') in home_page:
            home_page = home_page + '&sk=groups'
        elif ('/people/' in home_page):
            home_page = home_page.split('people')[0] + 'profile.php?id=' + home_page.split('/')[-1] + '&sk=groups'
        else:
            home_page = home_page.split('?')[0] + '/groups'
        print home_page
        try:
            driver.get(home_page)
            time.sleep(3)
        except TimeoutException:
            print 'groups网络错误1'
            driver.refresh()
            time.sleep(3)
        group=[]
        js1 = "var q=document.documentElement.scrollTop ;return(q)"
        height = driver.execute_script(js1)
        while 1:
            try:
                js = "var q=document.documentElement.scrollTop=100000000"
                driver.execute_script(js)
                Roll_height = driver.execute_script(js1)
                time.sleep(3)
                if Roll_height != height:
                    height = Roll_height
                else:
                    print 'groupfinish'
                    break
            except TimeoutException:
                print 'group网络错误'
        try:
            li = driver.find_elements_by_class_name('_153f')
            for i in li:
                dic = {}
                page = BeautifulSoup(i.get_attribute('innerHTML'), "lxml")
                div = page.find("div", {"class": "mbs fwb"})
                dic['name'] = div.get_text()
                dic['url'] = 'https://www.facebook.com' + div.find("a").get("href")
                dic['members'] = page.find("div", {"class": "mbs fcg"}).get_text()  #成员数
                dic['abstract'] = page.find("span", {"class": "_538r"}).get_text()  #简介
                group.append(dic)
                # print dic['name']
                # print dic['url']
                # print dic['members']
                # print dic['abstract']
                # print "-------------"
            return group
        except:
            return []

    def getlikes(self, home_page):
        driver = self.driver
        if('profile.php?id=') in home_page:
            home_page = home_page+'&sk=likes'
        elif ('/people/' in home_page):
            home_page = home_page.split('people')[0] + 'profile.php?id=' + home_page.split('/')[-1] + '&sk=likes'
        else:
            home_page = home_page.split('?')[0] + '/likes'
        try:
            driver.get(home_page)
            time.sleep(3)
        except :
            print 'likes网络错误1'
            driver.refresh()
            time.sleep(3)
        try:
            likes={ }
            div = driver.find_element_by_xpath("//div[@class='_3dc lfloat _ohe _5brz']")
            page = BeautifulSoup(div.get_attribute('innerHTML'), "lxml")
            a = page.find_all("a", {"class": "_3c_"})
            url = []  # 赞的类型
            for i in a:
                b={}
                b['name'] = i.get("name")
                b['url'] = i.get("href")
                if(b['name'] == '全部'):
                    continue
                url.append(b)
                # print b['name']
                # print b['url']
                # print "-------------"

            likes['全部'] = []
            js1 = "var q=document.documentElement.scrollTop ;return(q)"
            height = driver.execute_script(js1)
            while 1:
                try:
                    js = "var q=document.documentElement.scrollTop=100000000"
                    driver.execute_script(js)
                    Roll_height = driver.execute_script(js1)
                    time.sleep(3)
                    if Roll_height != height:
                        height = Roll_height
                    else:
                        print 'likesfinish'
                        break
                except TimeoutException:
                    print 'likes网络错误'

            li = driver.find_elements_by_xpath("//li[@class='_5rz _5k3a _5rz3 _153f']")
            for i in li:
                dic = {}
                page = BeautifulSoup(i.get_attribute('innerHTML'), "lxml")
                img = page.find('img')
                dic['name'] = img.get("aria-label")
                dic['picture'] = img.get("src")
                dic['url'] = page.find("a").get("href")
                dic['abstract'] = page.find("div", {"class": "fsm fwn fcg"}).get_text()  #简介
                likes['全部'].append(dic)
                # print dic['name']
                # print dic['picture']
                # print dic['url']
                # print dic['abstract']
                # print '全部'
                # print "-------------"
            # print url
            # print "-------------"
            for j in url:
                likes[j['name']] = []
                try:
                    driver.get(j['url'])
                    time.sleep(3)
                except:
                    print 'likes网络错误2'
                    driver.refresh()
                    time.sleep(3)
                li = driver.find_elements_by_xpath("//li[@class='_5rz _5k3a _5rz3 _153f']")
                for i in li:
                    dic = {}
                    page = BeautifulSoup(i.get_attribute('innerHTML'), "lxml")
                    img = page.find('img')
                    dic['name'] = img.get("aria-label")
                    dic['picture'] = img.get("src")
                    dic['url'] = page.find("a").get("href")
                    dic['abstract'] = page.find("div", {"class": "fsm fwn fcg"}).get_text()  # 简介
                    likes[j['name']].append(dic)
                    # print dic['name']
                    # print dic['picture']
                    # print dic['url']
                    # print dic['abstract']
                    # print j['name']
                    # print "-------------"

            return likes
        except:
            return {'全部':[] }


    def gettweet(self):
        driver = self.driver
        #driver.get(homepage)
        js1 = "var q=document.documentElement.scrollTop ;return(q)"
        height = driver.execute_script(js1)
        start = datetime.datetime.now()
        n = 0
        while 1:
            try:
                js = "var q=document.documentElement.scrollTop=100000000"
                driver.execute_script(js)
                Roll_height = driver.execute_script(js1)
                time.sleep(3)
                if n ==15:
                    height = Roll_height
                if Roll_height != height:
                    height = Roll_height
                    n +=1
                else:
                    print 'over111: ' + time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(time.time()))
                    div = driver.find_elements_by_xpath("//div[@class='_4-u2 mbm _4mrt _5jmm _5pat _5v3q _4-u8']")
                    tweet = []
                    for i in div:
                        page = BeautifulSoup(i.get_attribute('innerHTML'), "lxml")
                        b = {}
                        b['time'] = page.find("span", {"class": "fsm fwn fcg"}).get_text()
                        try:
                            b['text'] = page.find("div", {
                                "class": ["_5pbx userContent _22jv _3576", "_5pbx userContent _3576"]}).find(
                                "p").get_text()
                        except:
                            b['text'] = ''
                        if b['text'] == '':
                            try:
                                b['text'] = page.find("div", {"class": "mvl _52jv"}).get_text()
                            except:
                                b['text'] = ''
                        try:
                            b['location'] = page.find("span", {"class": "fwn fcg"}).get_text()
                        except:
                            b['location'] = ''

                        b['picture'] = []
                        try:
                            mtm = page.find("div", {"class": "mtm"})
                            a = mtm.find_all("a", {"ajaxify": True, "rel": True})
                            for j in a:
                                b['picture'].append(j.find("img").get("src"))
                        except:
                            pass

                        try:
                            link = page.find("a", {"class": "_6kt _6l- __c_"})
                            b['url'] = link.get("href")
                            b['arialabel'] = link.get("aria-label")
                        except:
                            b['url'] = ''
                            b['arialabel'] = ''

                        try:
                            b['video'] = page.find("div", {"class": "mtm"}).find("video").get("src")
                        except:
                            b['video'] = ''
                        tweet.append(b)
                        # print b
                        # print b['time']
                        # print b['location']
                        # print b['text']
                        # print b['picture']
                        # print b['url']
                        # print b['arialabel']
                        # print b['video']
                    return tweet
            except TimeoutException:
                print '页面刷新'
                driver.refresh()
                time.sleep(3)
                end = datetime.datetime.now()
                d = round((end - start).seconds)
                if (d > 300):
                    print '网络异常'
                    return []
            except:
                print '2出错'
                return []



    def getPerson(self, home_page):
        driver = self.driver
        friendsClassXpath = "//div[@id='pagelet_timeline_medley_friends']/child::div[1]/child::div[2]//descendant::a"

        if '?' not in home_page:
            friends_parameter = "?sk=friends"
        else:
            friends_parameter = "&sk=friends"
        friends_page = home_page + friends_parameter
        # 进行用户主页的跳转
        while 1:
            try:
                driver.get(friends_page)
                time.sleep(3)
                # 获取好友类型
                class_list = []
                try:
                    friendsClassElement = WebDriverWait(driver, 3).until(
                        lambda driver: driver.find_elements_by_xpath(friendsClassXpath))
                except Exception:
                    # traceback.print_exc()
                    return '{}'
                for friendsClass in friendsClassElement:
                    className = friendsClass.get_attribute("name")
                    classUrl = friendsClass.get_attribute("href")
                    if u"关注" in className:
                        continue
                    class_list.append({"name": className, "url": classUrl})
                # 获取所有类型好友的map
                friends_sum = {}
                for class_map in class_list:
                    name = class_map.get("name")
                    url = class_map.get("url")
                    try:
                        driver.get(url)
                        time.sleep(3)
                    except TimeoutException:
                        driver.get(url)
                        time.sleep(3)
                    friends_list = self.getFriends(name)
                    friends_sum[name] = friends_list
                    # time.sleep(3)
                return friends_sum
            except TimeoutException:
                pass

    def getFriends(self, friends_class):
        driver = self.driver
        # 下拉加载完好友列表
        js = "var q=document.documentElement.scrollTop=10000000000"
        start = datetime.datetime.now()
        n = 0
        while 1:
            try:
                driver.find_element_by_id('pagelet_timeline_medley_photos')
                print 'over' + time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(time.time()))
                break
            except TimeoutException:
                print '页面刷新'
                driver.refresh()
                time.sleep(3)
            except:
                driver.execute_script(js)
                end = datetime.datetime.now()
                d = round((end - start).seconds)
                if (d > 600):
                    print '网络异常'
                    driver.refresh()
                    time.sleep(3)
                    n += 1
                    start = datetime.datetime.now()
                if (n >= 2):
                    print '退出循环'
                    return {}
        # 获取所有用户头像、姓名和主页
        message_list = []
        messageLiElement = driver.find_elements_by_class_name('_698')
        print friends_class + '开始' + time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(time.time()))
        a = 0
        for li in messageLiElement:
            page = BeautifulSoup(li.get_attribute('innerHTML'), "lxml")
            a = a + 1
            # 获取用户头像
            img = page.find('img')
            img_url = img.get('src')
            # 获取用户姓名
            current_name_text = img.get('aria-label')
            # 获取用户主页
            url = page.find('a')
            home_page_url = url.get('href')
            message_list.append({"picture": img_url, "url": home_page_url, "name": current_name_text})
        print str(a) + '结束' + time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(time.time()))
        return message_list

    def getInfo(self, home_page):
        driver = self.driver
        if '?' not in home_page:
            info_parameter = "?sk=about"
        else:
            info_parameter = "&sk=about"
        info_page = home_page + info_parameter + '&section=contact-info'
        while 1:
            try:
                driver.get(info_page)
                time.sleep(3)
                page = BeautifulSoup(driver.page_source, "lxml")
                data = {'info': '', 'picture': '', 'name': ''}
                try:
                    message = page.find("div", {"class": "_4ms4"})
                    data['info'] += message.text
                    picture = page.find("img", {"class": "_11kf img"})
                    data['picture'] = picture.get('src')
                    name = page.find("a", {"class": "_2nlw _2nlv"})
                    data['name'] = name.get_text()
                    return data
                except:
                    return data
            except TimeoutException:
                pass

    def finduser(self, keyword):
        try:
            driver = self.driver
            u = 'https://www.facebook.com/search/people/?q='+ keyword
            driver.get(u)
            time.sleep(2)
            js1 = "var q=document.documentElement.scrollTop ;return(q)"
            height = driver.execute_script(js1)
            while 1:
                try:
                    js = "var q=document.documentElement.scrollTop=100000000"
                    driver.execute_script(js)
                    Roll_height = driver.execute_script(js1)
                    time.sleep(3)
                    if Roll_height != height:
                        height = Roll_height
                    else:
                        print '111'
                        break
                except TimeoutException:
                    print '网络错误'
                    return 'f'
            div = driver.find_elements_by_class_name('_4p2o')
            user=[]
            #设置代理参数和路径参数
            # proxy = urllib2.ProxyHandler({'http': '127.0.0.1:8123', 'https': '127.0.0.1:8123'})
            # opener = urllib2.build_opener(proxy)
            # urllib2.install_opener(opener)
            # p = os.getcwd()
            # if '\static\images' not in p:
            #     p = p.replace('\\facebookspider', '').replace('\\', '/')
            #     path2 = p + '/facebookspider/templates/static/images/'
            #     os.chdir(path2)
            # path = 'query1'
            # isExists = os.path.exists(path)
            # if not isExists:
            #     print '创建' + path
            #     os.mkdir(path)
            pictures=[]
            for i in div:
                page = BeautifulSoup(i.get_attribute('innerHTML'), "lxml")
                divname = page.find("div", {"class": "_ajw"})
                a = divname.find("a")
                b = {}
                b['name'] = a.get_text()
                b['url'] = a.get("href")
                divpicture = page.find("div", {"class": "clearfix"})
                b['picture'] = divpicture.find("img").get("src")
                #下载图片
                # try :
                #     path = 'query1'
                #     u = b['picture'].replace('/', '').replace('http:', '').replace('https:', '').replace('?', '')
                #     path = path + '/' + u + '.jpg'
                #     isExists = os.path.exists(path)
                #     if not isExists:
                #         f = urllib2.urlopen(b['picture'])
                #         data = f.read()
                #         with open(path, "wb") as imgfile:
                #             imgfile.write(data)
                #     b['path'] = 'static/images/'+path
                # except:
                #     b['path'] = ''

                u = b['picture'].replace('/', '').replace('http:', '').replace('https:', '').replace('?', '')
                path = 'static/images/query1/' + u + '.jpg'
                b['path'] = path
                b['time'] = time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(time.time()))
                b['keyword'] = keyword
                b['headline'] = page.find("div", {"class": "_glm"}).get_text()+'\n'
                glo = page.find("div", {"class": "_glo"})
                ajw = glo.find_all("div", {"class": "_ajw"})
                try:
                    for j in ajw:
                        b['headline'] += j.get_text()+'\n'
                except:
                    pass
                pictures.append(b['picture'])
                user.append(b)
            thread.start_new_thread(download, (pictures,))
            return user
        except TimeoutException:
            return 'f'



    def deldriver(self):
        self.driver.quit()


def changeip():
    client = pymongo.MongoClient(host="222.22.65.179", port=27017)
    db = client["singapore"]
    db.authenticate("yufei", "xjtu@2017")
    coll = db["ip"]
    ip = coll.find_one()['ip']

    dir = 'shawdowsocks.json'
    with open(dir, "r") as f:
        data = json.load(f)
        data['server'] = ip
    with open(dir, "w") as dump_f:
        json.dump(data, dump_f)
    os.system('sudo sslocal -c shawdowsocks.json -d restart')

    client.close()

def searchuser(keyword):
    #changeip()
    now = 0
    search = FacebookSearch.get_instance(now)
    a = search.finduser(keyword)
    if  type(a) == type(None) or len(a) == 0:
        now += 1
        if now == len(account):
            exit()
        else:
            search = FacebookSearch.get_instance(now)
    return a

def searchdetailed(user):
    print 'searchdetailed'
    now=0
    client = pymongo.MongoClient(host="222.22.65.179", port=27017)
    db = client["detailed"]
    db.authenticate("yufei", "xjtu@2017")
    coll = db[user]
    coll.ensure_index('url', unique=True)
    url = coll.find_one({'type': 'f'})
    error = 0
    while url !=None:
        u = url['url']
        db = client["detailed"]
        db.authenticate("yufei", "xjtu@2017")
        coll = db['searchdetailed']
        a = coll.find_one({'url':u})
        if a!=None:
            coll = db[user]
            coll.update({"url": u}, {"$set": {"type": 't'}})
            url = coll.find_one({'type': 'f'})
            continue

        #changeip()
        search = FacebookSearch.get_instance(now)
        synopsis = search.location(u)
        if synopsis == False or type(synopsis) == type(None) or synopsis == '出错':
            print '出错'
            error += 1
            if error > 3:
                search.deldriver()
                now +=1
                if now == len(account):
                    exit()
                else:
                    search = FacebookSearch.get_instance(now)
                    error =0
            continue
        elif synopsis == '页面无法显示':
            coll = db[user]
            coll.update({"url": u}, {"$set": {"type": 't','error':'页面无法显示'}})
            url = coll.find_one({'type': 'f'})
            continue

        db = client["singapore"]
        db.authenticate("yufei", "xjtu@2017")
        coll = db['singaporefacebook2']
        item = coll.find_one({ 'url': u})

        if item == None:
            a={}
            a['url'] = u
            a['time'] = time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(time.time()))
            a['tweet'] = search.gettweet()
            person = search.getInfo(u)
            a['picture'] = person['picture']
            a['name'] = person['name']
            # a['info'] = synopsis+'\n'+person['info']
            a['info'] = { }
            try:
                a['info']['contact'] = person['info'].split('基本信息')[0].split('联系方式')[1]
            except:
                a['info']['contact'] = ''
            try:
                a['info']['basic'] = person['info'].split('基本信息')[1]  # 包含性别 性取向
            except:
                a['info']['basic'] = ''
            a['info']['education'] = ''
            a['info']['work'] = ''
            a['info']['family'] = ''
            a['info']['location'] = ''
            a['info']['other'] = ''
            for i in synopsis.split('\n'):
                if ('就读' in i or '学习' in i):
                    a['info']['education'] += i + '\n'
                elif ('工作' in i):
                    a['info']['work'] += i + '\n'
                elif ('所在地' in i or '来自' in i):
                    a['info']['location'] += i + '\n'
                elif ('结婚' in i):
                    a['info']['family'] += i + '\n'
                elif (len(i) > 0):
                    a['info']['other'] += i + '\n'
            if (len(a['info']['education'])) == 0:
                a['info']['education'] = '无'
            if (len(a['info']['work'])) == 0:
                a['info']['work'] = '无'
            if (len(a['info']['family'])) == 0:
                a['info']['family'] = '无'
            if (len(a['info']['location'])) == 0:
                a['info']['location'] = '无'
            if (len(a['info']['other'])) == 0:
                a['info']['other'] = '无'

            a['friendsList'] = search.getPerson(u)
            a['groups'] = search.getgroup(u)
            a['likes'] = search.getlikes(u)
            db = client["detailed"]
            db.authenticate("yufei", "xjtu@2017")
            coll = db["query1"]
            p = coll.find_one({'url': u})
            if p == None:
                a['path'] = ''
            else:
                a['path'] = p['path']
            coll = db['searchdetailed']
            coll.ensure_index('url', unique=True)
            coll.insert(a)
            coll = db[user]
            coll.update({"url": u}, {"$set": {"type": 't'}})
            url = coll.find_one({'type': 'f'})
        else:
            a={}
            a['info'] = item['info']
            a['friendsList'] = item['friendsList']
            a['tweet'] = search.gettweet()
            a['groups'] = search.getgroup(u)
            a['likes'] = search.getlikes(u)
            if url['name']=='' or len(url['name'])==0:
                person = search.getInfo(u)
                a['picture'] = person['picture']
                a['name'] = person['name']
            else:
                a['picture'] = url['picture']
                a['name'] = url['name']
            a['url'] = u
            a['time'] = time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(time.time()))
            db = client["detailed"]
            db.authenticate("yufei", "xjtu@2017")
            coll = db["query1"]
            p = coll.find_one({'url': u})
            if p == None:
                a['path'] = ''
            else:
                a['path'] = p['path']
            coll = db['searchdetailed']
            coll.ensure_index('url', unique=True)
            coll.insert(a)
            coll = db[user]
            coll.update({"url": u}, {"$set": {"type": 't',"picture": a['picture'],"name":a['name']}})
            url = coll.find_one({'type': 'f'})
    client.close()
    print 'finish'





# search = FacebookSearch.get_instance(0)

# a={}
# u='https://www.facebook.com/yinjie.cen?lst=100021833075398%3A100000925063227%3A1524488759'
# synopsis = search.location(u)
# a['groups'] = search.getgroup(u)
# a['likes'] = search.getlikes(u)
# print a['groups']
# print '--------------'
# print a['likes']
# print '--------------'
# person = search.getInfo(u)
#
#
# a['info'] = {}
# a['info']['contact'] = person['info'].split('基本信息')[0].split('联系方式')[1]
# a['info']['basic'] = person['info'].split('基本信息')[1]  # 包含性别 性取向
# a['info']['education'] = ''
# a['info']['work'] = ''
# a['info']['family'] = ''
# a['info']['location'] = ''
# a['info']['other'] = ''
# for i in synopsis.split('\n'):
#     if ('就读' in i or '学习' in i):
#         a['info']['education'] += i + '\n'
#     elif ('工作' in i):
#         a['info']['work'] += i + '\n'
#     elif ('所在地' in i or '来自' in i):
#         a['info']['location'] += i + '\n'
#     elif ('结婚' in i):
#         a['info']['family'] += i + '\n'
#     elif (len(i) > 0):
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
