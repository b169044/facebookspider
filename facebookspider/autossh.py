#-*- coding: UTF-8 -*-
import paramiko
from selenium import webdriver
from selenium.webdriver.support.ui import WebDriverWait
import time
from bs4 import BeautifulSoup

class auto(object):
    def autossh(self,ip):
        print ip
        k = paramiko.RSAKey.from_private_key_file("C:/Users/LEGO/Desktop/yufei.pem")
        c = paramiko.SSHClient()
        c.set_missing_host_key_policy(paramiko.AutoAddPolicy())
        c.connect( hostname = ip, username = "ubuntu", pkey = k )
        command ="sudo ssserver -p 8388 -k xjtu@2017 -m rc4-md5 --user nobody -d start  ."
        stdin , stdout, stderr = c.exec_command(command)#在command命令最后加上 get_pty=True，执行多条命令 的话用；隔开，另外所有命令都在一个大的单引号范围内引用
        print (stdout.read())
        print (stderr.read())
        c.close()

    def autoip(self):
        chrome_options = webdriver.ChromeOptions()
        chrome_options.add_argument('disable-infobars')
        chrome_options.add_argument('no-sandbox')
        prefs = {"profile.default_content_setting_values.notifications": 2}
        chrome_options.add_experimental_option("prefs", prefs)
        driver = webdriver.Chrome(chrome_options=chrome_options)
        driver.get("https://www.amazon.com/ap/signin?openid.assoc_handle=aws&openid.return_to=https%3A%2F%2Fsignin.aws.amazon.com%2Foauth%3Fcoupled_root%3Dtrue%26response_type%3Dcode%26redirect_uri%3Dhttps%253A%252F%252Fconsole.aws.amazon.com%252Fconsole%252Fhome%253Fstate%253DhashArgs%252523%2526isauthcode%253Dtrue%26client_id%3Darn%253Aaws%253Aiam%253A%253A015428540659%253Auser%252Fhomepage&openid.mode=checkid_setup&openid.ns=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0&openid.identity=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0%2Fidentifier_select&openid.claimed_id=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0%2Fidentifier_select&action=&disableCorpSignUp=&clientContext=&marketPlaceId=&poolName=&authCookies=&pageId=aws.login&siteState=registered%2CZH_CN&accountStatusPolicy=P1&sso=&openid.pape.preferred_auth_policies=MultifactorPhysical&openid.pape.max_auth_age=120&openid.ns.pape=http%3A%2F%2Fspecs.openid.net%2Fextensions%2Fpape%2F1.0&server=%2Fap%2Fsignin%3Fie%3DUTF8&accountPoolAlias=&forceMobileApp=0&language=ZH_CN&forceMobileLayout=0&awsEmail=307073220%40qq.com")

        emailFieldID      = "resolving_input"
        next_button       = "next_button"
        passwordFieldID = "ap_password"
        submitFieldID = "signInSubmit-input"

        email = "307073220@qq.com"
        password = "li88637129"
        try:
            emailFieldElement = WebDriverWait(driver, 5).until(lambda driver: driver.find_element_by_id(emailFieldID))
            emailFieldElement.clear()
            emailFieldElement.send_keys(email)
            nextButtonElement = WebDriverWait(driver, 5).until(lambda driver: driver.find_element_by_id(next_button))
            nextButtonElement.click()
            time.sleep(3)
        except:
            pass

        passwordButtonElement = WebDriverWait(driver, 5).until(lambda driver: driver.find_element_by_id(passwordFieldID))
        submitButtonElement = WebDriverWait(driver, 5).until(lambda driver: driver.find_element_by_id(submitFieldID))

        passwordButtonElement.clear()
        passwordButtonElement.send_keys(password)
        submitButtonElement.click()
        time.sleep(3)

        driver.get('https://us-west-2.console.aws.amazon.com/ec2/v2/home?region=us-west-2#Instances:sort=desc:statusChecks')
        time.sleep(10)

        # try:
        #     selectButton = driver.find_element_by_xpath("//span[@class='GFGALCYDOJD']")
        #     driver.execute_script("$(arguments[0]).click()", selectButton)
        #     print 'GFGALCYDOJD22'
        # except:
        #     print '222'
        # time.sleep(2)
        try:
            selectButton = driver.find_element_by_xpath("//span[@class='GFGALCYDPJD']")
            driver.execute_script("$(arguments[0]).click()", selectButton)
            print 'GFGALCYDPJD33'
        except:
            print '333'

        time.sleep(5)

        caozuoButtonElement = WebDriverWait(driver, 5).until(lambda driver: driver.find_element_by_id('gwt-debug-menuButton'))
        caozuoButtonElement.click()
        stateButtonElement = WebDriverWait(driver, 5).until(lambda driver: driver.find_element_by_id('gwt-debug-menu-instance-state'))
        stateButtonElement.click()
        time.sleep(5)
        stopButtonElement = WebDriverWait(driver, 5).until(lambda driver: driver.find_element_by_id('gwt-debug-action-stop-instances'))
        stopButtonElement.click()
        time.sleep(15)
        caozuoButtonElement = WebDriverWait(driver, 5).until(lambda driver: driver.find_element_by_id('gwt-debug-menuButton'))
        caozuoButtonElement.click()
        stateButtonElement = WebDriverWait(driver, 5).until(lambda driver: driver.find_element_by_id('gwt-debug-menu-instance-state'))
        stateButtonElement.click()
        startButtonElement = WebDriverWait(driver, 5).until(lambda driver: driver.find_element_by_id('gwt-debug-action-start-instances'))
        startButtonElement.click()

        table = BeautifulSoup(driver.find_elements_by_xpath("//div[@class='GFGALCYDFNG']//table[@cellspacing='0']")[0].get_attribute('innerHTML'), "lxml")
        tr = table.find_all("tr")
        ip=[]
        for i in tr:
            td=i.find_all("td")[9].get_text()
            print td
            self.autossh(td)
            ip.append(td)
        print ip
        return ip









a =auto()
ip = ['54.186.169.205',
      '54.187.91.116',
      '34.211.228.60',
      '54.200.210.213',
      '18.236.106.143',
      '144.202.15.37']
for i in ip:
    a.autossh(i)