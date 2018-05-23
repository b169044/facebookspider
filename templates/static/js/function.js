window.onload = function () {

//    console.log(myDate.toLocaleString( ));

    //在index中展示当前时间（绿色标签）
    setInterval(function () {
        var myDate = new Date();
        document.getElementById("date").innerHTML = myDate.toLocaleString();
    }, 1000);


    //请求正在抓取的内容
    function sendAjax() {
        console.log("send ajax1 start:" + rtnWord + " " + curr);

        //设置loading提示
        var newTip = document.createElement('h1');
        newTip.className = 'h1_loading';
        newTip.id = 'h1_loading';
        newTip.innerHTML = 'Loading...';
        document.getElementsByClassName("scroller")[0].appendChild(newTip);
        //发送ajax请求，获取返回的数据列表
        var ajaxGet = $.get("/data", {
            //country: $(".country")[0].value,
            //state: $(".state")[0].value,
            city: rtnWord,
            citycn: curr,
            min: startTime,
            //添加用户名称，方便查找搜索记录
            user:userName0
        }, function (data) {
            var result = JSON.parse(data);
            console.log(result);
//            alert(result["friends"]);

            //删除等待提示
            if ($("#h1_loading")) {
                $("#h1_loading").remove();
            }
            //删除暂无数据提示
            if ($("#h1_nodata")) {
                $("#h1_nodata").remove();
            }


            try {
                //清空
                document.getElementsByClassName("scroller")[0].innerHTML = "";

                //创建ul来存在li列表
                var ul_new = document.createElement("ul");
                ul_new.className = "feeds";
                document.getElementsByClassName("scroller")[0].appendChild(ul_new);

                //如果返回error
                if (result['error']) {
                    //把切换间隔设置成2分钟
                    startTime = 2;


                    if (result['error'] == '正在切换请稍后') {
                        flag_ajax1 = 0;
                        //startTime = 2;
                    }
                    //如果有错误，就在startTime后重新发送请求
                    if (startTime >= 10) {
                        console.log("start time 10");
                        startTime = 10;
                    }

                    //在starttime后发送ajax请求
                    init13 = setTimeout(function () {
                        init12 = sendAjax();
                    }, startTime * 60000);
                    console.log(startTime + ':start:');

                    //设置无数据提示
                    console.log('不正常:flag_ajax1 is' + flag_ajax1);
                    var h1_nodata = document.createElement('h1');
                    h1_nodata.id = 'h1_nodata';
                    h1_nodata.innerHTML = result['error'];
                    document.getElementsByClassName("scroller")[0].appendChild(h1_nodata);

                } else {
                    //如果是从正在切换中，到现在的状态
                    if (flag_ajax1 == 0) {
                        //如果没有错误，>10,再次发送请求
                        if (startTime >= 10) {
                            console.log("start time 10");
                            startTime = 10;
                            flag_ajax1 = 1;
                        } else {
                            //如果没有错误，就在startTime+1后再次发送请求
                            startTime = startTime + 1;
                            console.log("start time " + startTime);
                        }

                        //如果是正常状态
                    } else {
                        startTime = 10;
                        console.log('不用切换' + startTime);
                    }

                    //在starttime后发送ajax请求
                    init13 = setTimeout(function () {
                        init12 = sendAjax();
                    }, startTime * 60000);
                    //flag_ajax1 = 1;

                    //间隔逐条展示
                    var length = result["list"].length;
                    console.log(length);
                    //如果获得的list长度为0,提示
                    if (length == 0) {
                        var h2_new = document.createElement("h2");
                        h2_new.id = 'h2_new';
                        h2_new.innerHTML = "当前暂未抓取到新的好友...";
                        document.getElementsByClassName("scroller")[0].appendChild(h2_new);

                        //立刻取消settimeout事件，即取消若干分钟后的ajax请求
                        if (init13) {
                            clearTimeout(init13);
                            console.log("clear timeout 13");
                        }
                        //如果暂未抓取新好友，请求间隔重新设为2min，并立刻发送ajax请求
                        startTime = 2;
                        init13 = setTimeout(function () {
                            init12 = sendAjax();
                        }, startTime * 60000);

                        //如果list长度大于0
                    } else {
                        //删除 无好友提示
                        if ($("#h2_new")) {
                            $("#h2_new").remove();
                        }

                        //计算展示每条数据需要多少秒
                        var perSecond = startTime * 60 / length;
                        console.log('persecond is :' + perSecond + " starttime is" + startTime);
                        var number = 0;

                        //每隔若干秒展示数据
                        init4 = setInterval(function () {
                            //动态一条一条增加信息
                            if (result['list'][number]) {
                                var li_new = document.createElement("li");
                                li_new.setAttribute('title',result["list"][number]["url"]);
                                $(".feeds")[0].appendChild(li_new);
                                var div_icon = document.createElement("div");
                                div_icon.className = "feedsIcon";
                                li_new.appendChild(div_icon);
                                var img_icon = document.createElement("img");
                                div_icon.appendChild(img_icon);
                                //加载图片，先设置为默认，加载好了替换
                                if (result["list"][number].hasOwnProperty("picture")) {
                                    img_icon.setAttribute("src", 'static/images/defaultPhoto.jpg');
                                    var img123 = new Image(); //创建一个Image对象，实现图片的预下载
                                    img123.src = result["list"][number]["picture"];
                                    img123.onload = function () {
                                        img_icon.setAttribute("src", result["list"][number]["picture"]);
                                    };
                                }

                                var div_des = document.createElement("div");
                                div_des.className = "feedsDes";
                                li_new.appendChild(div_des);
                                if (result["list"][number].hasOwnProperty("name")) {
                                    div_des.innerHTML = result["list"][number]["name"];
                                }

                                //$(".feeds li").css('opacity', '0');
                                //setTimeout(function () {
                                //    $(".feeds li").css('opacity', '1');
                                //}, 10);

                                number++;
                                //动态一条条删除顶部信息，最多同时显示15条
                                if (number > 15) {
                                    //$(".feeds li:first").css('opacity', '1');
                                    //setTimeout(function () {
                                    //    $(".feeds li:first").css('opacity', '0');
                                    //}, 10);
                                    setTimeout(function () {
                                        $(".feeds li:first").remove();
                                    }, perSecond * 1000 - 150);
                                    //}, 800);
                                }
                            }

                        }, perSecond * 1000);


                        //为ul中的li标签添加 添加到抓取队列 的事件
                        var thisLi = new Object();

                        $('.feeds').eq(0).click(function (e) {
                            //冒泡点击li，获取title和list的index
                            if(ulEvent_2(e,thisLi)){

                                console.log(thisLi.thisObj);
                                console.log(thisLi.thisName);

                                var confirm1 = confirm('是否添加 '+ thisLi.thisName + ' 到抓取列表？');
                                if (confirm1) {
                                    console.log('添加到抓取列表！');
                                    var checkedArr = new Array();
                                    checkedArr.push(thisLi.thisObj);

                                    //console.log(checkedArr);
                                    init15 = sendAjax8_2(checkedArr,thisLi.thisName);

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
                                }else {
                                    console.log('不添加到抓取列表！');
                                }
                            }

                        });

                    }


                }

            } catch (e) {
                //直接展示错误信息
                document.getElementsByClassName("scroller")[0].innerHTML = "";
                var h2_new = document.createElement("h2");
                h2_new.id = "message";
                document.getElementsByClassName("scroller")[0].appendChild(h2_new);
                document.getElementById("message").innerHTML = result["error"];
            }
        });
        //传回ajax这个对象，以便后续析构
        return ajaxGet;
    }

    //设置 正在抓取 和 历史数据 按钮的逻辑
    function tabSwitch() {
        var tabs = $(".nav-tabs li");
        console.log(tabs);
        for (var i = 0; i < tabs.length; i++) {
            tabs[i].id = i;
            tabs[i].addEventListener('click', function () {
                for (var j = 0; j < tabs.length; j++) {
                    tabs[j].className = "";
                }
                this.className = "active";

                //try {
                if (init) {
                    clearInterval(init);
                    console.log("clear");
                }

                //清空该标签下的所有内容
                document.getElementsByClassName("scroller")[0].innerHTML = "";

                //如果是正在抓取
                if (this.id == 0) {

                    //删除，停止各种settimeout和setinterval
                    if (init3) {
                        init3.abort();
                        console.log("clear init3");
                    }

                    if (init2) {
                        clearInterval(init2);
                        console.log("clear init2");
                    }

                    if ($("#h1_nodata")) {
                        $("#h1_nodata").remove();
                    }

                    if ($("#h1_loading")) {
                        $("#h1_loading").remove();
                    }

                    if ($("#btn_output")) {
                        $("#btn_output").remove();
                    }

                    if (init4) {
                        clearInterval(init4);
                        console.log("clear init4");
                    }

                    if (init13) {
                        clearTimeout(init13);
                        console.log("clear timeout 13");
                    }

                    if (init5) {
                        clearTimeout(init5);
                        console.log("clear timeout 5");
                    }

                    if (init14) {
                        init14.abort();
                        console.log("clear init14");
                    }


                    if (init12) {
                        init12.abort();
                        console.log("clear init12");
                    }

                    //正常状况初始间隔设为10
                    startTime = 10;
                    //重置该flag为正常
                    flag_ajax1 = 1;
                    //第一次请求
                    init3 = sendAjax();
                    //后续请求:

                    //init2 = setInterval(function () {
                    //    sendAjax();
                    //}, 600000);
                    flag = 0;
                    flag2 = 0;
                    //请求四个展板的数据
                    init1 = sendAjax2();
                    //init5 = setInterval(function () {
                    //    sendAjax2();
                    //}, 600000);

                    //隐藏滚动轴
                    $(".tab-content").css("overflow", "hidden");


                }

                //如果是历史数据按钮
                if (this.id == 1) {

                    //展示滚动轴
                    $(".tab-content").css("overflow-y", "scroll");
                    $(".tab-content").css("overflow-x", "hidden");
                    //删除，停止各种settimeout和setinterval
                    if (init3) {
                        init3.abort();
                        console.log("clear init3");
                    }
                    if (init2) {
                        clearInterval(init2);
                        console.log("clear init2");
                    }

                    if (init1) {
                        init1.abort();
                        console.log("clear init1");
                    }
                    if (init4) {
                        clearInterval(init4);
                        console.log("clear init4");
                    }
                    //if (init5) {
                    //    clearInterval(init5);
                    //    console.log("clear init5");
                    //}
                    if (init13) {
                        clearTimeout(init13);
                        console.log("clear timeout 13");
                    }

                    if (init5) {
                        clearTimeout(init5);
                        console.log("clear timeout 5");
                    }


                    if (init14) {
                        init14.abort();
                        console.log("clear init14");
                    }


                    if (init12) {
                        init12.abort();
                        console.log("clear init12");
                    }

                    //新建时间选择插件

                    //<h3>DateTimePickers selected by class</h3>
                    var div_date = document.createElement("div");
                    div_date.id = "div_date";
                    document.getElementsByClassName("scroller")[0].appendChild(div_date);
                    var h3_date = document.createElement("h3");
                    h3_date.innerHTML = "请选择查询爬虫信息的时间范围";
                    div_date.appendChild(h3_date);
                    var datepick1 = document.createElement("input");
                    datepick1.id = "datepick1";
                    datepick1.className = "datapick";
                    div_date.appendChild(datepick1);
                    var datepick2 = document.createElement("input");
                    datepick2.id = "datepick2";
                    datepick2.className = "datapick";

                    div_date.appendChild(datepick2);
                    $('#datepick1').datetimepicker();
                    $('#datepick2').datetimepicker();

                    //创建查询按钮
                    var btn_date = document.createElement("button");
                    btn_date.innerHTML = "查询";
                    btn_date.id = "btn_date";
                    //class="button button-primary button-small"
                    btn_date.className = 'button button-primary button-small';
                    div_date.appendChild(btn_date);


                    //查询开始
                    btn_date.addEventListener("click", function () {
                        console.log("from" + $('#datepick1').val() + "  to  " + $('#datepick2').val());
                        //清空列表
                        if ($(".feeds")[0]) {
                            $(".feeds")[0].remove();
                        }
                        //清空错误提示
                        if ($("#h1_nodata")) {
                            $("#h1_nodata").remove();
                        }
                        //移除分页按钮
                        if ($("#demo_pag1")) {
                            $("#demo_pag1").remove();
                        }
                        if (init6) {
                            init6.abort();
                            console.log("clear init6");
                        }

                        if ($("#h1_loading")) {
                            $("#h1_loading").remove();
                        }

                        //移除导出按钮
                        if ($("#btn_output")) {
                            $("#btn_output").remove();
                        }

                        //载入提示
                        var newTip = document.createElement('h1');
                        newTip.className = 'h1_loading';
                        newTip.id = 'h1_loading';
                        newTip.innerHTML = 'Loading...';
                        document.getElementsByClassName("scroller")[0].appendChild(newTip);

                        //发送数据请求
                        init6 = sendAjax3();

                    });

                    ////导出开始
                    //btn_output.addEventListener('click', function () {
                    //    if (init10) {
                    //        init10.abort();
                    //        console.log("clear init10");
                    //    }
                    //    console.log("from" + $('#datepick1').val() + "  to  " + $('#datepick2').val());
                    //    init10 = sendAjax5();
                    //})

                } else {
//                        alert("nothing to claer");
                }

                //} catch (e) {
                //    console.log("clear false");
                //}


            });
        }

        //清空

    }
    //设置选择国家城市
    function selectCountry() {

        //设置选择的展示方式
        var div_select_country = $('#div-select-country');
        var div_select_history = $('#div-select-history');
        var li_sel_type = $('.li-sel-type');
        console.log(li_sel_type);

        //按国家列表
        li_sel_type.eq(0).click(function () {
            li_sel_type.eq(0).css('border-bottom','4px solid deepskyblue');
            li_sel_type.eq(1).css('border-bottom','4px solid lightgrey');
            div_select_country.css('display','block');
            div_select_history.css('display','none');
        });

        //按历史纪录
        li_sel_type.eq(1).click(function () {

            if (init16) {
                init16.abort();
                console.log("clear init16");
            }
            init16 = sendAjax_historysearch();

            li_sel_type.eq(0).css('border-bottom','4px solid lightgrey');
            li_sel_type.eq(1).css('border-bottom','4px solid deepskyblue');
            div_select_country.css('display','none');
            div_select_history.css('display','block');

            //添加show按钮的点击事件
            $('#btn_showInfo_history').click(function () {
                if (init11) {
                    init11.abort();
                    console.log("init 11 CLEAR");
                }
                var currCity = $('#select-history-id').val();
                curr = $('#select-history-id').val();
                init11 = sendAjax6(currCity);
            });




            //$('#select-history-id').click(function () {
            //    if (init16) {
            //        init16.abort();
            //        console.log("clear init16");
            //    }
            //    init16 = sendAjax_historysearch();
            //
            //})

        });



        //判断国家
        var allCountry = '中国 阿尔巴尼亚 阿尔及利亚 阿富汗 阿根廷 阿拉伯联合酋长国 阿鲁巴 阿曼 阿塞拜疆 阿森松岛 埃及 埃塞俄比亚 爱尔兰 爱沙尼亚 安道尔 安哥拉 安圭拉 安提瓜岛和巴布达 澳大利亚 奥地利 奥兰群岛 巴巴多斯岛 巴布亚新几内亚 巴哈马 巴基斯坦 巴拉圭 巴勒斯坦 巴林 巴拿马 巴西 白俄罗斯 百慕大 保加利亚 北马里亚纳群岛 贝宁 比利时 冰岛 波多黎各 波兰 玻利维亚 波斯尼亚和黑塞哥维那 博茨瓦纳 伯利兹 不丹 布基纳法索 布隆迪 布韦岛 朝鲜 丹麦 德国 东帝汶 多哥 多米尼加 多米尼加共和国 俄罗斯 厄瓜多尔 厄立特里亚 法国 法罗群岛 法属波利尼西亚 法属圭亚那 法属南部领地 梵蒂冈 菲律宾 斐济 芬兰 佛得角 弗兰克群岛 冈比亚 刚果 刚果民主共和国 哥伦比亚 哥斯达黎加 格恩西岛 格林纳达 格陵兰 古巴 瓜德罗普 关岛 圭亚那 哈萨克斯坦 海地 韩国 荷兰 荷属安地列斯 赫德和麦克唐纳群岛 洪都拉斯 基里巴斯 吉布提 吉尔吉斯斯坦 几内亚 几内亚比绍 加拿大 加纳 加蓬 柬埔寨 捷克共和国 津巴布韦 喀麦隆 卡塔尔 开曼群岛 科科斯群岛 科摩罗 科特迪瓦 科威特 克罗地亚 肯尼亚 库克群岛 拉脱维亚 莱索托 老挝 黎巴嫩 利比里亚 利比亚 立陶宛 列支敦士登 留尼旺岛 卢森堡 卢旺达 罗马尼亚 马达加斯加 马尔代夫 马耳他 马拉维 马来西亚 马里 马其顿 马绍尔群岛 马提尼克 马约特岛 曼岛 毛里求斯 毛里塔尼亚 美国 美属萨摩亚 美属外岛 蒙古 蒙特塞拉特 孟加拉 密克罗尼西亚 秘鲁 缅甸 摩尔多瓦 摩洛哥 摩纳哥 莫桑比克 墨西哥 纳米比亚 南非 南极洲 南乔治亚和南桑德威奇群岛 瑙鲁 尼泊尔 尼加拉瓜 尼日尔 尼日利亚 纽埃 挪威 诺福克 帕劳群岛 皮特凯恩 葡萄牙 乔治亚 日本 瑞典 瑞士 萨尔瓦多 萨摩亚 塞尔维亚,黑山 塞拉利昂 塞内加尔 塞浦路斯 塞舌尔 沙特阿拉伯 圣诞岛 圣多美和普林西比 圣赫勒拿 圣基茨和尼维斯 圣卢西亚 圣马力诺 圣皮埃尔和米克隆群岛 圣文森特和格林纳丁斯 斯里兰卡 斯洛伐克 斯洛文尼亚 斯瓦尔巴和扬马廷 斯威士兰 苏丹 苏里南 所罗门群岛 索马里 塔吉克斯坦 泰国 坦桑尼亚 汤加 特克斯和凯克特斯群岛 特里斯坦达昆哈 特立尼达和多巴哥 突尼斯 图瓦卢 土耳其 土库曼斯坦 托克劳 瓦利斯和福图纳 瓦努阿图 危地马拉 维尔京群岛，美属 维尔京群岛，英属 委内瑞拉 文莱 乌干达 乌克兰 乌拉圭 乌兹别克斯坦 西班牙 希腊 新加坡 新喀里多尼亚 新西兰 匈牙利 叙利亚 牙买加 亚美尼亚 也门 伊拉克 伊朗 以色列 意大利 印度 印度尼西亚 英国 英属印度洋领地 约旦 越南 赞比亚 泽西岛 乍得 直布罗陀 智利 中非共和国';
        var ArrCountry = allCountry.split(' ');

        //拉长展示选择标签（默认为宽度几乎为0）
        $("#select_def").click(function () {
            console.log($("#select_def").options);
            $('#input_sel').css('display', 'none');
            $("#select_def").css('width', '70%');
            $("#img_search").css('opacity', '1');
        });

        //设置点击隐藏搜索小按钮，恢复select标签
        $("#img_search").click(function () {
            $('#input_sel').css('display', 'block');
            $("#select_def").css('width', '21px');
            $("#img_search").css('opacity', '0');
            $("#select_def").val('请选择').trigger('change');
            $("#input_sel").val('');
        });

        //当输入回车时执行操作
        $('#input_sel').bind('keydown', function (event) {
            if (event.keyCode == "13") {
                var flag_country = 0;
                //alert($("#select_def")[0].value+" "+$("#input_sel")[0].value);
                for (var i = 0; i < ArrCountry.length; i++) {
                    if ($("#input_sel")[0].value == ArrCountry[i]) {
                        alert("选择国家成功！请单击show按钮.");
                        flag_country = 1;
                        $("#select_def").val($("#input_sel")[0].value).trigger('change');
                        //执行搜索功能
                        $("#btn_showInfo").trigger('click');
                        break;
                    }
                }
                if (flag_country == 0) {
                    alert('请输入正确的国家名称!');
                    $("#select_def").val('').trigger('change');
                    $("#input_sel").val('');
                }
            }
        });


        //联动
        $.cxSelect.defaults.url = 'static/js/cityData.min.json';

        $('#global_location').cxSelect({

            url: 'static/js/globalData.min.json',

            selects: ['country', 'state', 'city'],

            nodata: 'none'

        });



        var input_sel = $('#input_sel');
        var div_candi_list = $('#div-candidate-list');
        //添加候选国家列表的点击事件
        $('.ul-candidate-list').eq(0).click(function (e) {
            var thisname = liEvent(e);
            input_sel.val(thisname);
            $("#select_def").val(thisname).trigger('change');
        })

        //设置输入框的点击事件
        input_sel.focus(function () {

            div_candi_list.css('display','block');

            if(flag_country_list == 0){
                //生成候选国家列表
                for(var i = 0; i < ArrCountry.length;i++){
                    var li = document.createElement('li');
                    li.className = 'li-candidate';
                    $('.ul-candidate-list')[0].appendChild(li);
                    var div1 = document.createElement('div');
                    div1.className = 'div-candidate-name';
                    div1.innerText = ArrCountry[i];
                    li.appendChild(div1);
                    var div2 = document.createElement('div');
                    div2.className = 'div-candidate-type';
                    div2.innerText = makePy(ArrCountry[i]);
                    li.appendChild(div2);

                    var div3 = document.createElement('div');
                    div3.className = 'clear';
                    li.appendChild(div3);
                }

                var divclear = document.createElement('div');
                divclear.className = 'clear';
                $('.ul-candidate-list')[0].appendChild(divclear);

                flag_country_list = 1;
            }

        });
        input_sel.blur(function () {
            setTimeout(function () {
                div_candi_list.css('display','none');
            },500);
        });


        //设置输入框输入自动匹配
        input_sel.keyup(function () {
            if(input_sel.val() != null){
                $('.ul-candidate-list')[0].innerHTML = '';
                //alert(input_sel.val());
                for (var i = 0; i < ArrCountry.length; i++) {
                    if (ArrCountry[i].indexOf(input_sel.val()) != -1) {
                        var li = document.createElement('li');
                        li.className = 'li-candidate';
                        $('.ul-candidate-list')[0].appendChild(li);
                        var div1 = document.createElement('div');
                        div1.className = 'div-candidate-name';
                        div1.innerText = ArrCountry[i];
                        li.appendChild(div1);
                        var div2 = document.createElement('div');
                        div2.className = 'div-candidate-type';
                        div2.innerText = makePy(ArrCountry[i]);
                        li.appendChild(div2);

                        var div3 = document.createElement('div');
                        div3.className = 'clear';
                        li.appendChild(div3);
                    }
                }

                var divclear = document.createElement('div');
                divclear.className = 'clear';
                $('.ul-candidate-list')[0].appendChild(divclear);
            }
        })

    }

    //生成汉语拼音首字母
    //转字符串数组程序
    function makePy(str)
    {
        if(typeof(str) != "string")
            throw new Error(-1,"函数makePy需要字符串类型参数!");
        var arrResult = new Array();
        //将字符串转码后转为数组
        for(var i=0,len=str.length;i<len;i++)
        {
            var ch = str.charAt(i);
            arrResult.push(checkCh(ch));
        }
        var first = mkRslt(arrResult)+'';
        return first.charAt(0);
    }
    //测试程序
    function get()
    {
        alert(makePy('哈哈'));
    }

    function checkCh(ch)
    {
        var uni = ch.charCodeAt(0);
        //如果不在汉字处理范围之内,返回原字符,也可以调用自己的处理函数
        if(uni > 40869 || uni < 19968)
            return ch; //dealWithOthers(ch);
        //检查是否是多音字,是按多音字处理,不是就直接在strChineseFirstPY字符串中找对应的首字母
        return (oMultiDiff[uni]?oMultiDiff[uni]:(strChineseFirstPY.charAt(uni-19968)));
    }
    function mkRslt(arr)
    {
        var arrRslt = [""];
        for(var i=0,len=arr.length;i<len;i++)
        {
            var str = arr[i];
            var strlen = str.length;
            if(strlen == 1)
            {
                for(var k=0;k<arrRslt.length;k++)
                {
                    arrRslt[k] += str;
                }
            }
            else
            {
                var tmpArr = arrRslt.slice(0);
                arrRslt = [];
                for(k=0;k<strlen;k++)
                {
                    //复制一个相同的arrRslt
                    var tmp = tmpArr.slice(0);
                    //把当前字符str[k]添加到每个元素末尾
                    for(var j=0;j<tmp.length;j++)
                    {
                        tmp[j] += str.charAt(k);
                    }
                    //把复制并修改后的数组连接到arrRslt上
                    arrRslt = arrRslt.concat(tmp);
                }
            }
        }
        return arrRslt;
    }

    //设置选择城市的点击li冒泡事件
    function  liEvent(e){
        var target = e.target;
        while(target.nodeType === 1&&target.tagName!=='LI'){
            target = target.parentNode
        }
        if(target.tagName == 'LI'){
            //alert(target.getAttribute("class")+":" + $(target).index());
            //var thisname = $('.div-candidate-name')[$(target).index()].innerText;
            var thisname = $(target).children('.div-candidate-name')[0].innerText;
            console.log(thisname);
            return thisname;
        }
    }
    //start
    tabSwitch();
    selectCountry();
    //login();


};


