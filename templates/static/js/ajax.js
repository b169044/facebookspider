//请求正在抓取信息
function sendAjax() {
    var ajaxGet = $.get("/data", {
        country: $(".country")[0].value,
        state: $(".state")[0].value,
        city: $(".city")[0].value
    }, function (data) {
//		console.log(data);
        var result = JSON.parse(data);
//		console.log(result);
//            alert(result["friends"]);

        try {
            //清空
            document.getElementsByClassName("scroller")[0].innerHTML = "";
            //创建ul节点
            //var holder1 = document.createElement("div");
            //holder1.className = "holder";
            //document.getElementsByClassName("scroller")[0].appendChild(holder1);

            var ul_new = document.createElement("ul");
            ul_new.className = "feeds";
            document.getElementsByClassName("scroller")[0].appendChild(ul_new);

            //var holder2 = document.createElement("div");
            //holder2.className = "holder";
            //document.getElementsByClassName("scroller")[0].appendChild(holder2);

            //间隔逐条展示
            var length = result["list"].length;
            console.log(length);
            if (length == 0) {
                var h2_new = document.createElement("h2");
                h2_new.innerHTML = "当前不存在抓取信息";
                document.getElementsByClassName("scroller")[0].appendChild(h2_new);
            } else {
                var perSecond = 300 / length;
                console.log(perSecond);
                var number = 0;
                init4 = setInterval(function () {
                    //动态一条一条增加信息
                    var li_new = document.createElement("li");
                    $(".feeds")[0].appendChild(li_new);
                    var div_icon = document.createElement("div");
                    div_icon.className = "feedsIcon";
                    li_new.appendChild(div_icon);
                    var img_icon = document.createElement("img");
                    div_icon.appendChild(img_icon);
                    if (result["list"][number].hasOwnProperty("picture")) {
                        img_icon.setAttribute("src", result["list"][number]["picture"]);
                    }

                    var div_des = document.createElement("div");
                    div_des.className = "feedsDes";
                    li_new.appendChild(div_des);
                    div_des.innerHTML = result["list"][number]["name"];
                    number++;
                    //动态一条条删除顶部信息
                    if (number > 16) {
                        $(".feeds li:first").remove();
                    }
                }, perSecond * 1000);
            }


            //全部一次性展示
            //for (var i = 0; i < result["list"].length; i++) {
            //	var li_new = document.createElement("li");
            //	$(".feeds")[0].appendChild(li_new);
            //	var div_icon = document.createElement("div");
            //	div_icon.className = "feedsIcon";
            //	li_new.appendChild(div_icon);
            //	var img_icon = document.createElement("img");
            //	div_icon.appendChild(img_icon);
            //	img_icon.setAttribute("src", result["list"][i]["picture"]);
            //
            //	var div_des = document.createElement("div");
            //	div_des.className = "feedsDes";
            //	li_new.appendChild(div_des);
            //	div_des.innerHTML = result["list"][i]["name"];
            //}
        } catch (e) {
            document.getElementsByClassName("scroller")[0].innerHTML = "";
            var h2_new = document.createElement("h2");
            h2_new.id = "message";
            document.getElementsByClassName("scroller")[0].appendChild(h2_new);
            document.getElementById("message").innerHTML = result["error"];
        }


        //$(function () {
        //	$("div.holder").jPages({
        //		containerID: "feeds",
        //		previous: "←左",
        //		next: "右→",
        //		perPage: 20
        //	});
        //});
    });
//alert($(".country")[0].value+" "+$(".state")[0].value+" "+$(".city")[0].value);
//if(e == 0){
//	xmlhttp.close();
//}else{
//	xmlhttp.open("GET","/data?country="+$(".country")[0].value+"&state="+$(".state")[0].value+"&city="+$(".city")[0].value,true);
//	xmlhttp.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
//	xmlhttp.send();
//}

    //ajaxGet.abort();
    return ajaxGet;
}
//请求分页数据
function sendAjax4(i) {
    //表示当前不可请求别的分页操作
    flag_Page = 0;
    var ajaxGet = $.get("/history", {
        num: i,
        tstart: $('#datepick1').val(),
        tend: $('#datepick2').val(),
        city: rtnWord
    }, function (data) {
        var result = JSON.parse(data);
        console.log(result);

        if ($(".feeds")[0]) {
            $(".feeds")[0].remove();
        }
        if ($("#h1_loading")) {
            $("#h1_loading").remove();
        }
        //添加分页数据
        var ul_new = document.createElement("ul");
        ul_new.className = "feeds";
        document.getElementsByClassName("scroller")[0].appendChild(ul_new);
        for (var i = 0; i < result["list"].length; i++) {
            (function () {
                var li_new = document.createElement("li");
                li_new.setAttribute('title', result["list"][i]["url"]);
                $(".feeds")[0].appendChild(li_new);
                var div_icon = document.createElement("div");
                div_icon.className = "feedsIcon";
                li_new.appendChild(div_icon);
                var img_icon1 = document.createElement("img");
                div_icon.appendChild(img_icon1);
                if (result["list"][i].hasOwnProperty("picture")) {
                    img_icon1.setAttribute("src", 'static/images/defaultPhoto.jpg');
                    var img1234 = new Image(); //创建一个Image对象，实现图片的预下载
                    img1234.src = result["list"][i]["picture"];
                    img1234.onload = function () {
                        img_icon1.setAttribute("src", img1234.src);
                    };
                }
                var div_des = document.createElement("div");
                div_des.className = "feedsDes";
                li_new.appendChild(div_des);
                div_des.innerHTML = result["list"][i]["name"];
            })();

        }
        //为ul中的li标签添加 添加到抓取队列 的事件
        var thisLi = new Object();

        $('.feeds').eq(0).click(function (e) {
            //alert('1');
            //冒泡点击li，获取title和list的index
            if(ulEvent(e,thisLi)){
                console.log(thisLi.thisIndex+":"+thisLi.thisTitle);
                //console.log(result["list"][thisLi.thisIndex]["name"]);

                var confirm1 = confirm('是否添加 '+result["list"][thisLi.thisIndex]["name"] + ' 到抓取列表？');
                if (confirm1) {
                    console.log('添加到抓取列表！');
                    var checkedArr = new Array();
                    checkedArr.push(result['list'][thisLi.thisIndex]);

                    console.log(checkedArr);
                    init15 = sendAjax8_2(checkedArr,result['list'][thisLi.thisIndex]["name"]);

                    var notification = new NotificationFx({
                        message: '<p>已经加入待抓取队列,鼠标单击屏幕右侧按钮查看。</p>',
                        layout: 'growl',
                        effect: 'genie',
                        type: 'notice', // notice, warning or error
                        onClose: function () {
                            //bttn.disabled = false;
                        }
                    });
                    // show the notification
                    notification.show();

                } else {
                    console.log('不添加到抓取列表！');
                }

            }

        });




        //为所有的li列表的出现添加动画，重点是动画！！！
        $(".feeds li").css('opacity', '0');
        setTimeout(function () {
            $(".feeds li").css('opacity', '1');
        }, 10);

        //设置flag，表示当前分页请求成功，可以请求其他分页
        flag_Page = 1;

        //加载好恢复li标签为可点击状态
        var allPageBtn = $("#nav_list_demo_pag1 li");
        if (allPageBtn.hasClass('disabled')) {
            console.log('have class disabled');
            allPageBtn.removeClass('disabled');
        }

    });
    console.log("this is ajax " + i);
}
//请求4个展板的数字信息
function sendAjax2() {
    console.log("start send ajax2");
    //传入参数：城市名，城市中文名，最小时间间隔
    var ajaxGet = $.get("/dataright", {
        //country: $(".country")[0].value,
        //state: $(".state")[0].value,
        //city: $(".city")[0].value
        city: rtnWord,
        citycn: curr,
        min: startTime
    }, function (data) {
        //console.log(data);
        var result = JSON.parse(data);
        console.log(result);

        //每次请求对比数据的增值动态显示
        console.log("start");
        //设置改变后的主页数
        if (init7) {
            clearInterval(init7);
            console.log("clear init7" + " " + count_pages + " " + result["count"]);
            document.getElementById("counts").innerHTML = count_pages;
        }
        //设置改变后的好友数
        if (init8) {
            clearInterval(init8);
            console.log("clear init8" + " " + count_friends + " " + result["friends"]);
            document.getElementById("friends").innerHTML = count_friends;
        }

        //后续持续发送请求，请求时间与正在抓取一致
        init5 = setTimeout(function () {
            init14 = sendAjax2();
        }, startTime * 60000);


        //动态刷新记分板

        //动态刷新主页数的计分版

        //第一次获取两个的值，count为当前数值，count2为10分钟之前的数值
        if (result["count"] > result["count2"] && flag == 0) {
            flag = 1;
            count_pages = result["count"];
            document.getElementById("counts").innerHTML = result["count2"];
            //var persec = 600000 / (result["count"] - result["count2"]);
            var persec = startTime * 60000 / (result["count"] - result["count2"]);
            console.log(result["count"] + "  " + persec + " " + result["count2"]);
            init7 = setInterval(function () {
                try {
                    document.getElementById("counts").innerHTML++;
                }
                catch (e) {
                    alert("error");
                }
            }, persec);
            //document.getElementById("counts").innerHTML =result["count"];
        }
        if (result["count"] == result["count2"] && flag == 0) {
            document.getElementById("counts").innerHTML = result["count2"];
        }

        //后续获取的新count，基于上一次请求的count递增数据
        if (result["count"] > count_pages && flag == 1) {
            var tmp = result["count"] - count_pages;
            //var persecond = 600000 / tmp;
            var persecond = startTime * 60000 / tmp;
            console.log(result["count"] + "  " + count_pages + " " + persecond);
            count_pages = result["count"];
            init7 = setInterval(function () {
                try {
                    console.log("test1");
                    document.getElementById("counts").innerHTML++;
                }
                catch (e) {
                    alert("error");
                }
            }, persecond);
        }


        //动态刷新主好友数的计分版
        if (result["friends"] > result["friends2"] && flag2 == 0) {
            flag2 = 1;
            count_friends = result["friends"];
            document.getElementById("friends").innerHTML = result["friends2"];
            //var persec2 = 600000 / (result["friends"] - result["friends2"]);
            var persec2 = startTime * 60000 / (result["friends"] - result["friends2"]);
            console.log(result["friends"] + "  " + persec2 + " " + result["friends2"]);
            init8 = setInterval(function () {
                try {
                    document.getElementById("friends").innerHTML++;
                }
                catch (e) {
                    alert("error");
                }
            }, persec2);
        }

        if (result["friends"] == result["friends2"] && flag2 == 0) {
            document.getElementById("friends").innerHTML = result["friends2"];
        }

        if (result["friends"] > count_friends && flag2 == 1) {
            var tmp1 = result["friends"] - count_friends;
            //var persecond1 = 600000 / tmp1;
            var persecond1 = startTime * 60000 / tmp1;
            console.log(result["friends"] + "  " + count_friends + " " + persecond1);
            count_friends = result["friends"];
            init8 = setInterval(function () {
                try {
                    console.log("test2");
                    document.getElementById("friends").innerHTML++;
                }
                catch (e) {
                    alert("error");
                }
            }, persecond1);
        }

        //设置蓝色展板内容（位置）
        try {
            if (result["location"] == 0) {
                document.getElementById("location").innerHTML = '请选择';
            } else {
                document.getElementById("location").innerHTML = result["location"];
            }
        }
        catch (e) {
            alert("error");
        }

        $("#location").innerHTML = result["location"];
    })
}
//请求历史数据信息
function sendAjax3() {
    //参数：城市名，城市中文名，开始时间，结束时间
    var ajaxGet = $.get("/historyfirst", {
        //country: $(".country")[0].value, state: $(".state")[0].value, city: $(".city")[0].value
        city: rtnWord, citycn: curr
        , tstart: $('#datepick1').val(), tend: $('#datepick2').val()
    }, function (data) {
        //console.log(data);
        var result = JSON.parse(data);
        console.log(result);
        console.log('historyfirst: page end!');

        //设置loading提示
        if ($("#h1_loading")) {
            $("#h1_loading").remove();
        }

        if (!result['error']) {
            console.log('正常');
            if (result['n'] > 0) {
                console.log('一共' + result['n'] + '页');
                //开始分页
                var newPage = document.createElement('div');
                newPage.id = 'demo_pag1';
                document.getElementsByClassName("scroller")[0].appendChild(newPage);
                $(function () {
                    //init
                    $("#demo_pag1").bs_pagination({
                        totalPages: result['n'],
                        currentPage: 1,
                        rowsPerPage: 50,
                        maxRowsPerPage: 100,
                        totalRows: 0,
                        visiblePageLinks: 5,
                        showGoToPage: true,
                        showRowsPerPage: false,
                        showRowsInfo: true,
                        showRowsDefaultInfo: true,
                        //当页面发生变化时执行的函数，即为换页操作
                        onChangePage: function (event, data) {
                            if ($(".feeds")[0]) {
                                $(".feeds")[0].remove();
                            }
                            //等待提示
                            var newTip = document.createElement('h1');
                            newTip.className = 'h1_loading';
                            newTip.id = 'h1_loading';
                            newTip.innerHTML = 'Loading...';
                            document.getElementsByClassName("scroller")[0].appendChild(newTip);
                            //等待中禁用li标签
                            var allPageBtn = $("#nav_list_demo_pag1 li");
                            console.log('allPageBtn.length ' + allPageBtn.length);
                            allPageBtn.addClass('disabled');
                            //init11 = sendAjax5();

                            //如果当前页面加载好了，flag_page才会等于1，li标签才不会禁用，才能执行换页操作
                            if (flag_Page == 1) {
                                //请求换页数据
                                init9 = sendAjax4(data.currentPage);
                                // your code here e.g.
                                console.log('Current page is: ' + data.currentPage);
                            }
                        }
                    });
                    //设置跳转页面按钮
                    $("#goto_page_demo_pag1")[0].setAttribute('placeholder', '跳转');
                    //第一次加载显示第一页，请求第一页的数据，只执行一次
                    var newTip = document.createElement('h1');
                    newTip.className = 'h1_loading';
                    newTip.id = 'h1_loading';
                    newTip.innerHTML = 'Loading...';
                    document.getElementsByClassName("scroller")[0].appendChild(newTip);
                    init9 = sendAjax4(1);
                });
                //创建导出按钮
                var btn_output = document.createElement("button");
                btn_output.innerHTML = "导出";
                btn_output.id = "btn_output";
                btn_output.className = 'button button-primary button-small';
                document.getElementsByClassName("portlet paddingless")[0].appendChild(btn_output);
                //导出开始
                btn_output.addEventListener('click', function () {
                    if (init10) {
                        init10.abort();
                        console.log("clear init10");
                    }
                    if (result['n'] > 20) {
                        var conf_output = confirm('您现在将要导出' + result['n'] * 50 + "条数据,由于数据量过大，仅供导出前1000条数据（约为5-10MB），请问是否继续？");
                    } else {
                        var conf_output = confirm('您现在将要导出' + result['n'] * 50 + "条数据（约为5-10MB），请问是否继续？");
                    }
                    if (conf_output) {
                        console.log("from" + $('#datepick1').val() + "  to  " + $('#datepick2').val());
                        init10 = sendAjax5();
                    } else {
                        console.log('不输出');
                    }
                })

            }
            //if(init9){
            //	clearInterval(init9);
            //	console.log('init9 clear');
            //}
        }

        if (result['error']) {
            console.log('不正常');
            if ($("#h1_tip")) {
                $("#h1_tip").remove();
            }

            var h1_nodata = document.createElement('h1');
            h1_nodata.id = 'h1_nodata';
            h1_nodata.innerHTML = result['error'];
            document.getElementsByClassName("scroller")[0].appendChild(h1_nodata);
        }

    });
    return ajaxGet;
}
//请求导出
function sendAjax5() {
    //主要用来以get的方式传递两个日期参数
    var f = document.createElement("form"); // 创建 HTML 表单元素，必须是form
    document.getElementsByClassName("scroller")[0].appendChild(f);// 界面body元素追加一个 form
    var i = document.createElement("input");// 追加一个 input 用于传递参数
    i.type = "hidden";  // 等同于setAttribute("type","hidden");
    i.value = $('#datepick1').val();
    i.name = "tstart";
    f.appendChild(i);

// 第二个input
    var i1 = document.createElement("input");// 追加一个 input 用于传递参数
    i1.type = "hidden";  // 等同于setAttribute("type","hidden");
    i1.value = $('#datepick2').val();
    i1.name = "tend";
    f.appendChild(i1);
    f.action = "/output";
    f.method = "GET";
    f.target = "_blank";
    f.submit();
}
//请求地区翻译
function sendAjax6(str) {
    var appid = '2015063000000001';
    var key = '12345678';
    var salt = (new Date).getTime();
    var query = str;
// 多个query可以用\n连接  如 query='apple\norange\nbanana\npear'
    var from = 'zh';
    var to = 'en';
    var str1 = appid + query + salt + key;
    var sign = MD5(str1);
    var ajaxGet = $.ajax({
        url: 'http://api.fanyi.baidu.com/api/trans/vip/translate',
        type: 'get',
        dataType: 'jsonp',
        data: {
            q: query,
            appid: appid,
            salt: salt,
            from: from,
            to: to,
            sign: sign
        },
        //ajax成功后的回掉函数
        success: function (data) {
            console.log("success:translate");

            rtnWord = data['trans_result'][0].dst;
            //小写
            rtnWord = rtnWord.toLowerCase();
            console.log(rtnWord);
            //执行搜索功能，默认点击 正在抓取 为执行搜索
            $(".nav-tabs li")[0].click();
        }
    });
    return ajaxGet;
}
//请求搜索记录
function sendAjax_historysearch(){
    //发送ajax请求，获取返回的数据列表
    var ajaxGet = $.get("/historysearch", {
        user:userName0
    }, function (data) {
        var result = JSON.parse(data);
        console.log(result);
        if(result['historysearch'].length > 0 ){
            $('.select-history')[0].innerHTML = '';
            //var optionDefault = document.createElement('option');
            //optionDefault.innerHTML = '请选择';
            //optionDefault.setAttribute('value','请选择');
            ////optionDefault.setAttribute('selected','selected');
            //$('.select-history')[0].append(optionDefault);

            for(var i = 0; i < result['historysearch'].length; i++){
                var option = document.createElement('option');
                option.innerHTML = result['historysearch'][i];
                option.setAttribute('value',result['historysearch'][i]);
                $('.select-history')[0].append(option);
            }
        }else {
            console.log('暂无搜索记录');
        }
        //var optiontest = document.createElement('option');
        //optiontest.innerHTML = 'test';
        //$('.select-history')[0].append(optiontest);
    });

    return ajaxGet;
}
//主页的正在抓取和查询历史数据中添加到抓取列表
function sendAjax8_2(arr,title) {
    var jsonArr = {};
    jsonArr['list'] = arr;
    console.log('title:'+ title);
    console.log('user:'+ userName0);
    var ajaxGet = $.get("/detailed", {
        list: JSON.stringify(jsonArr),
        user: userName0,
        keyword: title
    }, function (data) {
        var result = JSON.parse(data);
        console.log(result);
    });
    return ajaxGet;
}

//全局变量，所有init为setTimeOut对象和setInterval对象，用于终止控制
var init;
var init1;
var init2;
var init3;
var init4;
var init5;
var init6;
var init7;
var init8;
var init9;
var init10;
var init11;
var init12;
var init13;
var init14;
var init15;
var init16;
var flag = 0;
var flag2 = 0;
var count_pages = 0;
var count_friends = 0;
var currentCountry;
var flag3 = 0;
var flag_Page = 0;
var curr;
var rtnWord;
var flag_Pic = 0;
var startTime = 10;
var flag_ajax1 = 1;
var flag_country_list =0;
var img_sleep;
var flag_history_sel = true;

//设置国家城市选择中show按钮
$("#btn_showInfo").on("click", function () {

    if (init11) {
        init11.abort();
        console.log("init 11 CLEAR");
    }

    //判断是否完整选择，并且获取最下级地区名称
    if ($(".country")[0].value != 0) {
        //获取最后的城市
        if ($(".city")[0].value != '') {
            if ($(".city")[0].value == 0) {
                alert("请完整选择！");
                return;
            }
            curr = $(".city")[0].value;
        } else if ($(".state")[0].value != '') {
            if ($(".state")[0].value == 0) {
                alert("请完整选择！");
                return;
            }
            curr = $(".state")[0].value;
        } else {
            if ($(".country")[0].value == 0) {
                alert("请完整选择！");
                return;
            }
            curr = $(".country")[0].value;
        }
        //alert("now is :" + curr);

        //判断是否需要切换地区
        if (flag3 == 0) {
            //第一次不用切换地区
            flag3 = 1;
            //currentCountry = $(".country")[0].value + $(".state")[0].value + $(".city")[0].value;
            currentCountry = $(".country")[0].value + $(".state")[0].value + $(".city")[0].value;
            console.log("currCountry:" + currentCountry);
            init11 = sendAjax6(curr);

        } else {
            //不是第一次，则需要询问是否切换地区
            if (currentCountry != $(".country")[0].value + $(".state")[0].value + $(".city")[0].value) {
                show_confirm();
            }
        }
    }
    //询问你是否切换地区
    function show_confirm() {
        var result = confirm('当前正在抓取数据，请问是否更换地区？');
        if (result) {
            console.log('更换！');
            currentCountry = $(".country")[0].value + $(".state")[0].value + $(".city")[0].value;
            init11 = sendAjax6(curr);
            //$(".nav-tabs li")[0].click();

        } else {
            console.log('不更换！');
        }
    }

});

//设置点击抓取时间冒泡ul
function ulEvent(e,li) {
    var target = e.target;
    while (target.nodeType === 1 && target.tagName !== 'LI') {
        target = target.parentNode
    }
    //alert(target.tagName);
    if(target.tagName == 'LI'){
        li.thisTitle = target.getAttribute("title");
        li.thisIndex = $(target).index();
        console.log(target.getAttribute("title") +" " +$(target).index());
        return true;
    }else {
        return false;
    }

}
//设置点击正在抓取冒泡ul
function ulEvent_2(e,li) {
    var target = e.target;
    while (target.nodeType === 1 && target.tagName !== 'LI') {
        target = target.parentNode
    }
    //alert(target.tagName);
    if(target.tagName == 'LI'){
        //li.thisTitle = target.getAttribute("title");
        //li.thisLi= $(target);
        var thisobj = new Object();
        thisobj['path'] = '';
        thisobj['url'] = target.getAttribute("title");
        var thisIcon = $(target).children('.feedsIcon')[0];
        var thisImg = thisIcon.firstChild;
        thisobj['name'] = $(target).children('.feedsDes')[0].innerHTML;
        //console.log(thisIcon);
        //console.log(thisImg);
        thisobj['picture'] = thisImg.src;
        //console.log(thisobj);
        li.thisObj = thisobj;
        li.thisName = thisobj['name'];
        //console.log(target.getAttribute("title") +" " +$(target).index());
        return true;
    }else {
        return false;
    }

}