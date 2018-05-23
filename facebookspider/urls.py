"""facebookspider URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.11/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.conf.urls import url, include
    2. Add a URL to urlpatterns:  url(r'^blog/', include('blog.urls'))
"""
from django.conf.urls import url
from . import view

urlpatterns = [
    url(r'^index$', view.index),
    url(r'^history$', view.history),
    url(r'^historyfirst$', view.historyfirst),
    url(r'^data$', view.data),
    url(r'^dataright$', view.dataright),
    url(r'^chart$', view.chart),
    url(r'^login$', view.login),
    # url(r'^drawChart$', view.drawChart),
    url(r'^output$', view.output),
    url(r'^search$', view.search),
    url(r'^query1$', view.query1),
    url(r'^continuedetailed$', view.continuedetailed),
    url(r'^query2$', view.query2),
    url(r'^query3$', view.query3),
    url(r'^queryfenye$', view.queryfenye),
    url(r'^searchlist$', view.searchlist),
    url(r'^searchurl$', view.searchurl),
    url(r'^detailed$', view.detailed),
    url(r'^deleteurl$', view.deleteurl),
    url(r'^deletekeyword$', view.deletekeyword),
    url(r'^toshow$', view.toshow),
    url(r'^searchfriends$', view.searchfriends),
    url(r'^friends$', view.friends),
    url(r'^historysearch$', view.historysearch),
    url(r'^searchgroups$', view.searchgroups),
    url(r'^groups$', view.groups),
    url(r'^searchlikes$', view.searchlikes),
    url(r'^likes$', view.likes),

]
