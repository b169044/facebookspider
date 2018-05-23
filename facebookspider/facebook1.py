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


account = [
    {
        'TEST_ACCOUNT': "zzuhenryzhang@163.com",
        'TEST_PASSWORD': "li88637129"
    }

    ,
    {
        'TEST_ACCOUNT': "18801223681",
        'TEST_PASSWORD': "zzuxjtu@2016"
    }
    ,
    {
        'TEST_ACCOUNT': "david16wu@sina.com",
        'TEST_PASSWORD': "zzuxjtu@2016"
    }
    ,
    {
        'TEST_ACCOUNT': "15029232068",
        'TEST_PASSWORD': "xjtu@2017"
    }
    ,
    {
        'TEST_ACCOUNT': "mikewolfberg@163.com",
        'TEST_PASSWORD': "zzuxjtu@2016"
    }
    ,
    {
        'TEST_ACCOUNT': "13772172676",
        'TEST_PASSWORD': "zzuxjtu@2016"
    }
    ,
    {
        'TEST_ACCOUNT': "gillianpierop@outlook.com",
        'TEST_PASSWORD': "zzuxjtu@2016"
    }

]

account2 = [

    {
        'TEST_ACCOUNT': "374545365@qq.com",
        'TEST_PASSWORD': "zzuxjtu@2016"
    } 
 ,
    {
        'TEST_ACCOUNT': "b169044@163.com",
        'TEST_PASSWORD': "li88637129"
    }

    ,
    {
        'TEST_ACCOUNT': "gillianpierop@outlook.com",
        'TEST_PASSWORD': "zzuxjtu@2016"
    }
    ,
    {
        'TEST_ACCOUNT': "13080908669",
        'TEST_PASSWORD': "versou315"
    }
    ,
    {
        'TEST_ACCOUNT': "18392886202",
        'TEST_PASSWORD': "zzuxjtu@2016"
    }
]

ips=[
    '34.217.101.157',
    '54.202.13.67',
    '34.217.106.42',
    '35.161.249.178',
    '35.163.58.161',
    '144.202.15.37'

]

import time
import sys
reload(sys)
sys.setdefaultencoding('utf8')

class FacebookSearch(object):

    def __init__(self,x):
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
        #display = Display(visible=0, size=(1280, 936))
        #display.start()
        chrome_options = webdriver.ChromeOptions()
        chrome_options.add_argument('disable-infobars')
        chrome_options.add_argument('no-sandbox')
        agent = headers[random.randint(0, 4)]['User-Agent']
        print agent
        chrome_options.add_argument('user-agent='+ agent)
        prefs = {"profile.default_content_setting_values.notifications": 2}
        chrome_options.add_experimental_option("prefs", prefs)
        self.driver = webdriver.Chrome(chrome_options=chrome_options)

        self.driver.get("http://www.facebook.com/")

        facebookUsername  = account[x]['TEST_ACCOUNT']
        facebookPassword  = account[x]['TEST_PASSWORD']
        emailFieldID      = "email"
        passFieldID       = "pass"
        loginButton       = "loginbutton"

        emailFieldElement  = WebDriverWait(self.driver, 5).until(lambda driver: driver.find_element_by_id(emailFieldID))
        passFieldElement   = WebDriverWait(self.driver, 5).until(lambda driver: driver.find_element_by_id(passFieldID))
        loginButtonElement = WebDriverWait(self.driver, 5).until(lambda driver: driver.find_element_by_id(loginButton))

        emailFieldElement.clear()
        emailFieldElement.send_keys(facebookUsername)
        passFieldElement.clear()
        passFieldElement.send_keys(facebookPassword)
        loginButtonElement.click()
        print 'facebook login ok. '+facebookUsername
        time.sleep(3)

#无权访问此人的主页
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




    def getPerson(self,home_page):
        driver = self.driver
        friendsClassXpath = "//div[@id='pagelet_timeline_medley_friends']/child::div[1]/child::div[2]//descendant::a"

        if '?' not in home_page:
            friends_parameter = "?sk=friends"
        else:
            friends_parameter = "&sk=friends"
        friends_page = home_page+friends_parameter
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

    def getFriends(self,friends_class):
        driver = self.driver
        #下拉加载完好友列表
        js = "var q=document.documentElement.scrollTop=100000000"
        start = datetime.datetime.now()
        n=0
        while 1:
            try:
                driver.find_element_by_id('pagelet_timeline_medley_photos')
                print '加载完'+time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(time.time()))
                break
            except TimeoutException:
                print '页面刷新'
                driver.refresh()
                time.sleep(3)
            except:
                driver.execute_script(js)
                end = datetime.datetime.now()
                d = round((end - start).seconds)
                if (d>600):
                    print '网络异常'
                    driver.refresh()
                    time.sleep(3)
                    n +=1
                    start = datetime.datetime.now()
                if (n>=1):
                    print '退出循环'
                    return { }
        # 获取所有用户头像、姓名和主页
        message_list = []
        messageLiElement=driver.find_elements_by_class_name('_698')
        print friends_class+'开始'+time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(time.time()))
        a=0
        for li in messageLiElement:
            page=BeautifulSoup(li.get_attribute('innerHTML'), "lxml")
            a = a + 1
            # 获取用户头像
            img = page.find('img')
            img_url = img.get('src')
            # 获取用户姓名
            current_name_text = img.get('aria-label')
            # 获取用户主页
            url=page.find('a')
            home_page_url = url.get('href')
            message_list.append({"picture":img_url,"url":home_page_url,"name":current_name_text})
        print str(a)+'结束' + time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(time.time()))
        return message_list



    def getInfo(self,home_page):
        driver = self.driver
        if '?' not in home_page:
            info_parameter = "?sk=about"
        else:
            info_parameter = "&sk=about"
        info_page = home_page + info_parameter +'&section=contact-info'
        while 1:
            try:
                driver.get(info_page)
                time.sleep(3)
                page = BeautifulSoup(driver.page_source, "lxml")
                data = {'info':'','picture':'','name':''}
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

    def findlocation(self,location):
        try:
            driver = self.driver
            u = 'https://www.facebook.com/search/str/'+location+'/keywords_places/'
            driver.get(u)
            time.sleep(3)
            page = BeautifulSoup(driver.page_source, "lxml")
            ul = page.find("ul", {"class": "uiList _4kg _6-i _6-h _6-j"})
            if len(ul) == 0:
                print '暂不支持该地区'
                return 'f'
            span = ul.find_all("span", {"class": "_1wu_"})
            for j in span:
                url = j.find("a").get("href")
                print url
                a = url.split('/')
                if a[3] == 'pages' and len(a[5]) == 15:
                    print a[5]
                    return str(a[5])
            print '暂不支持该地区'
            return 'f'
        except TimeoutException:
            return 'f'

    def initurl(self,location,locationcn,num):
        try:
            driver = self.driver
            u = 'https://www.facebook.com/search/people/?q='+location
            driver.get(u)
            time.sleep(2)
            js = "var q=document.documentElement.scrollTop=100000000"
            driver.execute_script(js)
            time.sleep(2)
            page = BeautifulSoup(driver.page_source, "lxml")
            div = page.find_all("div", {"class": "_4p2o"})
            if len(div) == 0:
                print '未找到结果'
                return
            client = pymongo.MongoClient(host="127.0.0.1", port=27017)
            db = client["singapore"]
            db.authenticate("yufei", "xjtu@2017")
            coll = db[location + "redyurl"]
            coll.ensure_index('url', unique=True)
            for i in div:
                div2 = i.find("div", {"class": "_pac"})
                text1 = div2.get_text()
                if location in text1 or locationcn in text1:
                    divname = i.find("div", {"class": "_ajw"})
                    a = divname.find("a")
                    b={}
                    b['name'] = a.get_text()
                    b['url'] = a.get("href")
                    divpicture = i.find("div", {"class": "clearfix"})
                    b['picture'] = divpicture.find("img").get("src")
                    b['time'] = time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(time.time()))
                    b['sign'] = 'f'
                    try:
                        coll.insert(b)
                    except:
                        pass
                    continue
                div3 = i.find_all("div", {"class": "_ajw"})
                for j in div3:
                    text2 = j.get_text()
                    try:
                        a2 = j.find("a").get("href")
                    except:
                        a2=''
                    if location in text2 or locationcn in text2 or str(num) in a2:
                        divname = i.find("div", {"class": "_ajw"})
                        a = divname.find("a")
                        b = {}
                        b['name'] = a.get_text()
                        b['url'] = a.get("href")
                        divpicture = i.find("div", {"class": "clearfix"})
                        b['picture'] = divpicture.find("img").get("src")
                        b['time'] = time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(time.time()))
                        b['sign'] = 'f'
                        try:
                            coll.insert(b)
                        except:
                            pass
                        break
            client.close()
            return
        except TimeoutException:
            return

    def deldriver(self):
        self.driver.quit()




def search():

    i = 2
    jj = 5
    f = open('log4.16.txt', 'a')
    client = pymongo.MongoClient(host="222.22.65.179", port=27017)
    db = client["singapore"]
    db.authenticate("yufei", "xjtu@2017")
    # 选择账号并登录
    start = datetime.datetime.now()
    print start
    f.write(str(start) + '\n')
    print str(i) + ' 账号:' + account[i]['TEST_ACCOUNT']
    f.write(str(i) + ' 账号:' + account[i]['TEST_ACCOUNT'] + '\n')
    search1 = FacebookSearch(i)
    # 参数初始化
    count = 0
    havefriend = 0
    t = 4
    error = 0
    spider = True
    coll = db["ip"]
    coll.remove({})
    if t == 0:
        coll.insert({'ip': ips[5]})
    else:
        coll.insert({'ip': ips[t - 1]})
    while (spider):
        # 获取地区名
        coll = db["location"]
        loca = coll.find_one()
        location = loca['location']  # 英文
        locationcn = loca['locationcn']  # 中文
        e = loca['error']
        print location
        if e == 't':
            # 判断地区是否可抓取
            coll = db["num"]
            coll.ensure_index('location', unique=True)
            lo = coll.find_one({'location': location})
            if lo == None:
                print 'findlocation'
                num = search1.findlocation(location)
                if num == 'f':
                    print '暂不支持该地区'
                    coll = db["location"]
                    coll.update({"location": location}, {"$set": {"error": '暂不支持该地区'}})
                    continue
                else:
                    coll.insert({'location': location, 'num': num})
            else:
                num = lo['num']
            # 判断是否有待抓链接
            coll = db[location + "redyurl"]
            coll.ensure_index('url', unique=True)
            n = coll.find({'sign': 'f'})
            if n.count() == 0:
                print 'initurl'
                search1.initurl(location, locationcn, num)
            redyurl = coll.find_one({'sign': 'f'})
            if redyurl == None:
                print '未找到结果'
                coll = db["location"]
                coll.update({"location": location}, {"$set": {"error": '未找到结果'}})
                continue
            coll.update({"url": redyurl['url']}, {"$set": {"sign": 't'}})
            print redyurl['url']
            f.write(redyurl['url'] + '\n')
            begin = datetime.datetime.now()
            print begin
            f.write(str(begin) + '\n')
            coll = db[location + "facebookurl"]
            coll.ensure_index('url', unique=True)
            sign = coll.find({"url": redyurl['url']})
            if sign.count() <= 0:
                synopsis = search1.location(redyurl['url'])
                if synopsis == False or type(synopsis) == type(None) or synopsis == '出错':
                    print '出错'
                    f.write('出错' + '\n')
                    error += 1
                    if error > 7:
                        search1.deldriver()
                        if jj == len(account2):
                            exit()
                        else:
                            f.write('出错账号'+account[i]['TEST_ACCOUNT'] + '\n')
                            account[i] = account2[jj]
                            search1 = FacebookSearch(i)
                            jj +=1
                            error = 0
                            continue
                elif len(synopsis) == 0:
                    error = 0
                    print '无数据'
                    f.write('无数据' + '\n')
                    time.sleep(3)
                elif locationcn in synopsis or location in synopsis.lower():
                    error = 0
                    havefriend = havefriend + 1
                    person = search1.getInfo(redyurl['url'])
                    #info_person = synopsis + '\n' + person['info']
                    time.sleep(3)
                    info_friend = search1.getPerson(redyurl['url'])
                    binfo = { }
                    try:
                        binfo['contact'] = person['info'].split('基本信息')[0].split('联系方式')[1]
                    except:
                        binfo['contact'] = ''
                    try:
                        binfo['basic'] = person['info'].split('基本信息')[1]  # 包含性别 性取向
                    except:
                        binfo['basic'] = ''
                    binfo['education'] = ''
                    binfo['work'] = ''
                    binfo['family'] = ''
                    binfo['location'] = ''
                    binfo['other'] = ''
                    for i in synopsis.split('\n'):
                        if ('就读' in i or '学习' in i):
                            binfo['education'] += i + '\n'
                        elif ('工作' in i):
                            binfo['work'] += i + '\n'
                        elif ('所在地' in i or '来自' in i):
                            binfo['location'] += i + '\n'
                        elif ('结婚' in i):
                            binfo['family'] += i + '\n'
                        elif (len(i) > 0):
                            binfo['other'] += i + '\n'
                    info = {'info': binfo, 'friendsList': info_friend, 'url': redyurl['url'],
                            'time': time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(time.time())),
                            'location': location, 'picture': person['picture'], 'name': person['name']}
                    a = {}
                    a['url'] = redyurl['url']
                    coll = db[location + "facebookurl"]
                    try:
                        coll.insert(a)
                    except:
                        pass
                    coll = db[location + "facebook2"]
                    coll.insert(info)
                    str1 = '全部好友'
                    coll = db[location + "redyurl"]
                    num = 0
                    if type(info_friend) != type('a') and len(info_friend) > 0:
                        for j in info_friend[str1.decode()]:
                            num += 1
                            a = {}
                            a['name'] = j['name']
                            a['picture'] = j['picture']
                            a['url'] = j['url']
                            a['time'] = time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(time.time()))
                            a['sign'] = 'f'
                            try:
                                coll.insert(a)
                            except:
                                pass
                        print location + '111' + time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(time.time()))
                        f.write(str(num) + location + '111' + time.strftime('%Y-%m-%d %H:%M:%S',
                                                                            time.localtime(time.time())) + '\n')
                    else:
                        print location + '222' + time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(time.time()))
                        f.write(
                            location + '222' + time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(time.time())) + '\n')
                else:
                    error = 0
                    havefriend = havefriend + 1
                    person = search1.getInfo(redyurl['url'])
                    #info_person = synopsis + '\n' + person['info']
                    binfo = { }
                    try:
                        binfo['contact'] = person['info'].split('基本信息')[0].split('联系方式')[1]
                    except:
                        binfo['contact'] = ''
                    try:
                        binfo['basic'] = person['info'].split('基本信息')[1]  # 包含性别 性取向
                    except:
                        binfo['basic'] = ''
                    binfo['education'] = ''
                    binfo['work'] = ''
                    binfo['family'] = ''
                    binfo['location'] = ''
                    binfo['other'] = ''
                    for i in synopsis.split('\n'):
                        if ('就读' in i or '学习' in i):
                            binfo['education'] += i + '\n'
                        elif ('工作' in i):
                            binfo['work'] += i + '\n'
                        elif ('所在地' in i or '来自' in i):
                            binfo['location'] += i + '\n'
                        elif ('结婚' in i):
                            binfo['family'] += i + '\n'
                        elif (len(i) > 0):
                            binfo['other'] += i + '\n'
                    info = {'info': binfo, 'friendsList': {}, 'url': redyurl['url'],
                            'time': time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(time.time())),
                            'location': 'no' + location, 'picture': person['picture'], 'name': person['name']}
                    a = {}
                    a['url'] = redyurl['url']
                    coll = db[location + "facebookurl"]
                    try:
                        coll.insert(a)
                    except:
                        print 'mongo contact'
                    coll = db[location + "facebook2"]
                    coll.insert(info)
                    print 'no' + location + time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(time.time()))
                    f.write('no' + location + time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(time.time())) + '\n')
            end = datetime.datetime.now()
            count = count + 1
            d = round((end - start).seconds / 3600, 2)
            print '共耗时' + str(end - begin)
            f.write('共耗时' + str(end - begin) + '\n')
            print d
            time.sleep(10)
        else:
            end = datetime.datetime.now()
            d = round((end - start).seconds / 3600, 2)
            time.sleep(10)
        if (d >= 4):
            print '程序结束 ' + str(count) + ' ' + str(havefriend)
            f.write('程序结束 ' + str(count) + ' ' + str(havefriend) + '\n')
            t += 1
            search1.deldriver()
            f.close()
            client.close()
            # exit()
            time.sleep(1800)
            dir = 'shawdowsocks.json'
            ip = ips[t - 1]
            client = pymongo.MongoClient(host="222.22.65.179", port=27017)
            db = client["singapore"]
            db.authenticate("yufei", "xjtu@2017")
            coll = db["ip"]
            coll.remove({})
            coll.insert({'ip': ip})
            if (t == 6):
                t = 0
            with open(dir, "r") as f:
                data = json.load(f)
                data['server'] = ip
            with open(dir, "w") as dump_f:
                json.dump(data, dump_f)

            os.system('sudo sslocal -c shawdowsocks.json -d restart')
            os.system('export http_proxy="http://127.0.0.1:8123/"')
            os.system('export https_proxy="http://127.0.0.1:8123/"')
            os.system('echo 3 > /proc/sys/vm/drop_caches')
            os.system('echo 1 > /proc/sys/vm/drop_caches')
            os.system('echo 3 > /proc/sys/vm/drop_caches')
            if i == 6:
                i = 0
            else:
                i += 1
            search1 = FacebookSearch(i)
            print '继续抓取' + time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(time.time()))
            f = open('log4.16.txt', 'a')
            f.write('继续抓取' + time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(time.time())) + '\n')
            f.write(str(i) + ' 账号:' + account[i]['TEST_ACCOUNT'] + '\n')
            f.write(' ip:' + str(ip))
            start = datetime.datetime.now()
            count = 0
            havefriend = 0





if __name__ == "__main__":
    search()


