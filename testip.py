# -*- coding: utf-8 -*-
import json
import os
import urllib2
proxy = urllib2.ProxyHandler({'http': '127.0.0.1:8123', 'https': '127.0.0.1:8123'})
opener = urllib2.build_opener(proxy)
urllib2.install_opener(opener)
print urllib2.urlopen('http://www.google.com')

