window.onload = function () {



//    console.log(myDate.toLocaleString( ));
    setInterval(function () {
        var myDate = new Date();
        document.getElementById("date").innerHTML = myDate.toLocaleString();
    }, 1000);

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
                if(length == 0){
                    var h2_new = document.createElement("h2");
                    h2_new.innerHTML = "当前暂未抓取到新的好友...";
                    document.getElementsByClassName("scroller")[0].appendChild(h2_new);
                }else {
                    var perSecond = 600 / length;
                    console.log(perSecond);
                    var number = 0;
                    init4 = setInterval(function () {
                        //动态一条一条增加信息
                        if(result['list'][number]){
                            var li_new = document.createElement("li");
                            $(".feeds")[0].appendChild(li_new);
                            var div_icon = document.createElement("div");
                            div_icon.className = "feedsIcon";
                            li_new.appendChild(div_icon);
                            var img_icon = document.createElement("img");
                            div_icon.appendChild(img_icon);
                            if( result["list"][number].hasOwnProperty("picture")){
                                img_icon.setAttribute("src", result["list"][number]["picture"]);
                            }

                            var div_des = document.createElement("div");
                            div_des.className = "feedsDes";
                            li_new.appendChild(div_des);
                            if(result["list"][number].hasOwnProperty("name")){
                                div_des.innerHTML = result["list"][number]["name"];
                            }

                            $(".feeds li").css('opacity','0');
                            setTimeout(function () {
                                $(".feeds li").css('opacity','1');
                            },10);

                            number++;
                            //动态一条条删除顶部信息
                            if (number > 16) {
                                $(".feeds li:first").css('opacity','1');
                                setTimeout(function () {
                                    $(".feeds li:first").css('opacity','0');
                                },10);
                                setTimeout(function () {
                                    $(".feeds li:first").remove();
                                },800);
                            }
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

                try {
                    if (init) {
                        clearInterval(init);
                        console.log("clear");
                    }
                    document.getElementsByClassName("scroller")[0].innerHTML = "";
                    if (this.id == 0) {


                        //if (init1) {
                        //    init1.abort();
                        //    console.log("clear init1");
                        //}
                        init3 = sendAjax();
                        init2 = setInterval(function () {
                            sendAjax();
                        }, 600000);
                        flag=0;
                        flag2 =0;
                        init1 = sendAjax2();
                        init5 = setInterval(function () {
                            sendAjax2();
                        }, 600000);

                        $(".tab-content").css("overflow","hidden");


                    }

                    if (this.id == 1) {
                        $(".tab-content").css("overflow-y","scroll");
                        $(".tab-content").css("overflow-x","hidden");
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
                        if (init5) {
                            clearInterval(init5);
                            console.log("clear init5");
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

                        var btn_date = document.createElement("button");
                        btn_date.innerHTML = "查询";
                        btn_date.id = "btn_date";
                        div_date.appendChild(btn_date);

                        //查询开始
                        btn_date.addEventListener("click", function () {
                            console.log("from" + $('#datepick1').val() + "  to  " + $('#datepick2').val());
                            //设置页码flag
                            flag_page =0;
                            //清空列表
                            if($(".feeds")[0]){
                                $(".feeds")[0].remove();
                            }
                            //清空分页自增计时器
                            if(init9){
                                clearInterval(init9);
                                console.log('init9 clear');
                            }
                            if(init6){
                               init6.abort();
                                console.log('init6 clear');
                            }
                            //清空错误提示
                            if($("#h1_nodata")){
                                $("#h1_nodata").remove();
                            }

                            //等待提示
                            var newTip = document.createElement('h1');
                            newTip.className = 'h1_tip';
                            newTip.id = 'h1_tip';
                            newTip.innerHTML = '请等待约15秒...';
                            document.getElementsByClassName("scroller")[0].appendChild(newTip);
                            setTimeout(function () {
                                newTip.remove();
                            },14500);
                            //分页
                            var newPaging = create_paging();
                            document.getElementsByClassName("scroller")[0].appendChild(newPaging);

                            defaultFunction();
                            jumpPage(1);
                            console.log(currentNumber);
                            //发送数据请求
                            init6 = sendAjax3();
                            tmpPage =1;
                            autoAddPage();
                            //<ul class="container" id="page_container">
                            //    <li class="default" id="page_start">start</li>
                            //    <li class="default" id="page_last">last</li>
                            //    <!--<li class="page active">1</li>-->
                            //    <li class="default" id="page_next">next</li>
                            //    <li class="default" id="page_end">end</li>
                            //    <div id="clear"></div>
                            //    </ul>
                        })

                    } else {
//                        alert("nothing to claer");
                    }

                } catch (e) {
                    console.log("clear false");
                }


            });
        }

        //清空

    }

    function selectCountry() {
        $.cxSelect.defaults.url = 'static/js/cityData.min.json';

        $('#global_location').cxSelect({

            url: 'static/js/globalData.min.json',

            selects: ['country', 'state', 'city'],

            nodata: 'none'

        });

        $("#select_def").click(function () {
//            console.log($("#select_def").options);
            $("#select_def  option[value='新加坡']").attr("selected", true);

        });


    }


    //创建分页
    function create_paging(){
        currentNumber =1;
        maxNumber=0;
        if($("#page_container")){
            $("#page_container").remove();
        }

        var ul_page = document.createElement('ul');
        ul_page.className='page_container';
        ul_page.id = 'page_container';

        var li_start = document.createElement('li');
        li_start.className = 'default';
        li_start.id = 'page_start';
        li_start.innerHTML = 'beginning';
        ul_page.appendChild(li_start);

        var li_last = document.createElement('li');
        li_last.className = 'default';
        li_last.id = 'page_last';
        li_last.innerHTML = 'previous';
        ul_page.appendChild(li_last);

        var li_next = document.createElement('li');
        li_next.className = 'default';
        li_next.id = 'page_next';
        li_next.innerHTML = 'next';
        ul_page.appendChild(li_next);

        var li_end = document.createElement('li');
        li_end.className = 'default';
        li_end.id = 'page_end';
        li_end.innerHTML = 'last';
        ul_page.appendChild(li_end);

        //var li_max = document.createElement('li');
        //li_max.className = 'default';
        //li_max.id = 'page_max';
        //li_max.innerHTML = 1;
        //ul_page.appendChild(li_max);

        var div_clear = document.createElement('div');
        div_clear.id = 'clear';
        ul_page.appendChild(div_clear);
        return ul_page;
    }
    //请求单页面结果
    function sendAjax4(i){
        var ajaxGet = $.get("/history",{num:i}, function (data) {
            var result = JSON.parse(data);
            tmpResult = result;
            console.log(result);

            if($(".feeds")[0]){
                $(".feeds")[0].remove();
            }
            if($("#h1_loading")){
                $("#h1_loading").remove();
            }

            var ul_new = document.createElement("ul");
            ul_new.className = "feeds";
            document.getElementsByClassName("scroller")[0].appendChild(ul_new);
            for(var i =0;i<result["list"].length;i++){
                var li_new = document.createElement("li");
                $(".feeds")[0].appendChild(li_new);
                var div_icon = document.createElement("div");
                div_icon.className = "feedsIcon";
                li_new.appendChild(div_icon);
                var img_icon = document.createElement("img");
                div_icon.appendChild(img_icon);
                img_icon.setAttribute("src", result["list"][i]["picture"]);
                var div_des = document.createElement("div");
                div_des.className = "feedsDes";
                li_new.appendChild(div_des);
                div_des.innerHTML = result["list"][i]["name"];
            }
            $(".feeds li").css('opacity','0');
            setTimeout(function () {
                $(".feeds li").css('opacity','1');
            },10);
            //恢复可点击按钮
            $("#page_next").removeClass('disabled');
            $("#page_next").css('color','black');
            $("#page_last").removeClass('disabled');
            $("#page_last").css('color','black');
        });
        console.log("this is ajax "+i);
    }
    //请求分页数
    function sendAjax5(){
        var ajaxGet = $.get("/pagenum",{num:tmpPage+1}, function (data) {
            var result = JSON.parse(data);
            console.log(result);
            if(result['num'] >0){
                makeNum(tmpPage+1,1);
                //maxNumber = tmpPage+1;
                //$("#page_max")[0].innerHTML = maxNumber;
                //console.log($("#page_max")[0].innerHTML);
                //console.log(maxNumber);
                tmpPage++;

            }else if(result['num'] == 0){
                console.log("retry!");
            }

            else {
                if(init9){
                    clearInterval(init9);
                    console.log('init9 clear in paging');
                }
            }
        });
    }

    function makeNum(num,flag){
        maxNumber =num;
        var newNum = document.createElement("li");
        newNum.className = 'page';
        newNum.id = 'page '+num;
        newNum.innerHTML = num;
        newNum.setAttribute('onselectstart','return false;')

        $("#page_container")[0].appendChild(newNum);
        $("#clear").remove();
        var newClear = document.createElement('div');
        newClear.id = 'clear';
        $("#page_container")[0].appendChild(newClear);


        newNum.addEventListener('click', function (event) {
            if(num ==1 && flag_page == 0){
                flag_page=1;
                setTimeout(function () {
                    sendAjax4(num);
                },15000);
            }else {
                sendAjax4(num);
            }

            if(arguments.length =1){
                currentNumber =num;
                console.log('this is number '+ num);
                var allpage = document.getElementsByClassName('page');
                for(var i=0;i<allpage.length;i++){
                    allpage[i].className = 'page';
                }
                newNum.className = 'page selected';
            }
        })

    }

    function jumpPage(num){

        if(num > maxNumber){
            makeNum(num);
            document.getElementById('page '+num).click();

        } else if(num <= maxNumber){
            if(num <1){
                document.getElementById('page 1').click();
                currentNumber =1;
            }else{
                var thisId = 'page '+num;
                document.getElementById(thisId).click();
                //currentNumber =num;
            }

        }


    }

    function defaultFunction(){
        $("#page_container")[0].setAttribute('onselectstart','return false;');
        $("#page_next")[0].addEventListener('click', function () {
            //if(tmpResult["list"].length == 0){
            //    alert("没有内容可以显示了！");
            //}else {
            //    jumpPage(currentNumber+1);
            //}
            //$("#page_next")[0].setAttribute('disabled','true');
            $("#page_next").addClass('disabled');
            $("#page_next").css('color','grey');

            var ajax_next = $.get("/history",{num:currentNumber+1}, function (data) {
                var result = JSON.parse(data);
                if(result["list"].length >0){
                    if($(".feeds")[0]){
                        $(".feeds")[0].remove();
                    }
                    var h1_loading = document.createElement('h1');
                    h1_loading.id = 'h1_loading';
                    h1_loading.innerHTML = '正在加载中，请稍后...';
                    document.getElementsByClassName("scroller")[0].appendChild(h1_loading);
                    console.log(result["list"].length);
                    jumpPage(currentNumber+1);
                } else if(result["list"].length == 0){
                    alert("没有内容可以显示了！");
                    setTimeout(function () {
                        $("#page_next").removeClass('disabled');
                        $("#page_next").css('color','black');
                    },2000);
                }
            });

        });
        $("#page_next")[0].setAttribute('onselectstart','return false;');

        $("#page_last")[0].addEventListener('click', function () {

            $("#page_last").addClass('disabled');
            $("#page_last").css('color','grey');

            var ajax_last = $.get("/history",{num:currentNumber-1}, function (data) {
                var result = JSON.parse(data);
                if(result["list"].length >0){
                    if($(".feeds")[0]){
                        $(".feeds")[0].remove();
                    }
                    var h1_loading = document.createElement('h1');
                    h1_loading.id = 'h1_loading';
                    h1_loading.innerHTML = '正在加载中，请稍后...';
                    document.getElementsByClassName("scroller")[0].appendChild(h1_loading);

                    console.log(result["list"].length);
                    jumpPage(currentNumber-1);
                } else if(result["list"].length == 0){
                    //alert("没有内容可以显示了！");
                    setTimeout(function () {
                        $("#page_last").removeClass('disabled');
                        $("#page_last").css('color','black');
                    },2000);
                }

            });

        });
        $("#page_last")[0].setAttribute('onselectstart','return false;');
        $("#page_start")[0].addEventListener('click', function () {
            jumpPage(1);
        });
        $("#page_start")[0].setAttribute('onselectstart','return false;');
        $("#page_end")[0].addEventListener('click', function () {
            jumpPage(maxNumber);
        });
        $("#page_end")[0].setAttribute('onselectstart','return false;');
    }

    function autoAddPage(){
        setTimeout(function () {
            init9 = setInterval(function () {
                sendAjax5();
            },500);
        },15000);

        //while(initFlag == 0){
        //    var sendAjax = sendAjax5(initNum);
        //
        //    if( sendAjax== true){
        //        console.log('add page ' + (initNum+1));
        //        initNum++;
        //    }else if(sendAjax == false){
        //        console.log('add page enough');
        //        initFlag =1;
        //    }else {
        //        sendAjax.abort();
        //        console.log("当前为0");
        //
        //        //var tmpInt = setInterval(function () {
        //        //}, 100);
        //        //setTimeout(function () {
        //        //    clearInterval(tmpInt);
        //        //    console.log("retry to add page!");
        //        //}, 500);
        //    }
        //}
    }

    //start
    tabSwitch();
    selectCountry();
    //login();

};


