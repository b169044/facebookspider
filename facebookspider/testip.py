# -*- coding: utf-8 -*-
import json
import os

dir='shawdowsocks.json'
ip='45.63.18.50'
with open(dir,"r") as f:
    data=json.load(f)
    data['server']=ip
    print ip
with open(dir,"w") as dump_f:
  json.dump(data,dump_f)

os.system('sudo sslocal -c shawdowsocks.json -d restart')
print '111'