/**
 * Created by gilli on 2018/1/22.
 */
var init15;
var init16;
//请求列表内容(大标题)
function sendAjax11(){
    var ajaxGet = $.get("/searchlist", {
        user: userName0
    }, function (data) {
        var result = JSON.parse(data);
        console.log(result);

        if($('#list_error')){
            $('#list_error').remove();
        }

        if(result['list'].length > 0){
            console.log(result['list'].length);
            for(var i=0;i<result['list'].length;i++){
                (function () {
                    var list_title = document.createElement('li');
                    list_title.className = 'list-title';
                    $('#tipUl')[0].appendChild(list_title);

                    //var list_icon = document.createElement('i');
                    //list_icon.className = 'fa fa-tags';
                    //list_icon.setAttribute('aria-hidden','true');
                    //list_title.appendChild(list_icon);
                    var list_icon = document.createElement('i');
                    list_title.appendChild(list_icon);
                    //根据type的状态改变标签颜色
                    switch (result['list'][i]['sign']){
                        case 'f':
                            $('.list-title').eq(i).css('border-left','7px solid red');
                            list_icon.className = 'fa fa-circle-o-notch fa-spin';

                            var list_iconDes = document.createElement('span');
                            list_iconDes.className ='list_iconDes';
                            list_iconDes.innerHTML = '待抓取';
                            list_title.appendChild(list_iconDes);
                            break;
                        case 't':
                            $('.list-title').eq(i).css('border-left','7px solid lawngreen');
                            list_icon.className = 'fa fa-check';

                            var list_iconDes = document.createElement('span');
                            list_iconDes.className ='list_iconDes';
                            list_iconDes.innerHTML = '已抓取';
                            list_title.appendChild(list_iconDes);

                            //var t0 =result['list'][i]['url'];
                            //t0 = t0.replace(/&/g,'%26');
                            //console.log(t0)
                            //list_name.addEventListener('click', function () {
                            //
                            //    var jumpUrl1 = '/toshow?url='+t0+'&name='+userName0+'&type='+type0;
                            //    console.log(jumpUrl1);
                            //    window.open(jumpUrl1);
                            //});

                            break;
                    }




                    var list_name = document.createElement('a');
                    var tmpListName =result['list'][i]['keyword'];
                    list_name.innerHTML = result['list'][i]['keyword'].replace(/%3B/g,';');
                    list_name.setAttribute('title',result['list'][i]['keyword'].replace(/%3B/g,';'));
                    list_title.appendChild(list_name);

                    var list_del = document.createElement('i');
                    list_title.appendChild(list_del);
                    list_del.setAttribute('title','删除该项内容');
                    list_del.className = 'fa fa-trash-o small';

                    list_del.addEventListener('click', function () {
                        list_del.parentNode.remove();
                        console.log(list_name.innerHTML);

                        sendAjax12(tmpListName);
                    });


                    list_name.addEventListener('click', function () {
                        //alert(list_name.innerHTML);
                        $(this).DialogShow({
                            'id': 'somedialog',  //传入id，可以控制样式
                            'dialogFx': '1',     //传入显示和隐藏的参数
                        });
                        if(init16){
                            init16.abort();
                            console.log('init16 clear');
                        }

                        init16 = sendAjax9(tmpListName);
                    });


                    if($('.list-title').length <12 ){
                        $('.menu-wrap').css('overflow','hidden');
                    }else {
                        $('.menu-wrap').css('overflow','scroll');
                    }
                })();
            }


        }else {
            var list_error = document.createElement('h1');
            list_error.id = 'list_error';
            list_error.innerHTML = '暂无待抓取数据.';
            $('#tipUl')[0].appendChild(list_error);
        }
    });
}

//请求标题内容（小标题）
function sendAjax9(k){

    if($('#list-ul')){
        $('#list-ul').remove();
    }
    if($('#list_error')){
        $('#list_error').remove();
    }



    var ajaxGet = $.get("/searchurl", {
        user: userName0,
        keyword:k
}, function (data) {
        var result = JSON.parse(data);
        console.log(result);

        //删除原来的列表


        if(result['list'].length>0){
            console.log(result['list'].length);
            // 生成待抓取列表
            var list_ul = document.createElement('ul');
            list_ul.className = 'list-ul';
            list_ul.id = 'list-ul';
            $('#dialog__content')[0].appendChild(list_ul);

            for(var i=0;i<result['list'].length;i++){
                (function () {
                    var list_li = document.createElement('li');
                    list_li.className = 'tipLi';
                    list_ul.appendChild(list_li);

                    var list_icon = document.createElement('i');
                    list_li.appendChild(list_icon);


                    var list_img = document.createElement('img');
                    list_img.className = 'tipImg';
                    list_li.appendChild(list_img);
                    list_img.setAttribute('src','static/images/defaultPhoto.jpg');
                    if(result['list'][i].hasOwnProperty('path')){
                        if (result['list'][i]['path'] == '') {
                            //newImg.setAttribute('src', 'static/images/defaultPhoto.jpg');

                            var imgTmp = new Image(); //创建一个Image对象，实现图片的预下载
                            imgTmp.src = result['list'][i]['picture'];
                            imgTmp.onload = function () {
                                list_img.setAttribute("src", imgTmp.src);
                            };

                        } else {
                            list_img.setAttribute('src', result['list'][i]['path']);
                        }
                    }else {
                        list_img.setAttribute('src', result['list'][i]['path']);
                    }



                    //var list_img = document.createElement('img');
                    //list_img.className = 'tipImg';
                    //list_li.appendChild(list_img);
                    //list_img.setAttribute('src','static/images/defaultPhoto.jpg');
                    //var imgTmp = new Image(); //创建一个Image对象，实现图片的预下载
                    //imgTmp.src = result['list'][i]['picture'];
                    //imgTmp.onload = function () {
                    //    list_img.setAttribute("src", imgTmp.src);
                    //};




                    var list_span = document.createElement('span');
                    list_span.className = 'tipName';
                    list_li.appendChild(list_span);

                    var list_name = document.createElement('a');
                    list_name.innerHTML = result['list'][i]['name'];
                    list_span.appendChild(list_name);

                    var list_inputUrl = document.createElement('input');
                    list_inputUrl.className = 'list_inputUrl';
                    list_li.appendChild(list_inputUrl);
                    list_inputUrl.setAttribute('type','hidden');
                    list_inputUrl.setAttribute('value',result['list'][i]['url']);

                    var list_inputFlag = document.createElement('input');
                    list_inputFlag.className = 'list_inputFlag';
                    list_li.appendChild(list_inputFlag);
                    list_inputFlag.setAttribute('type','hidden');
                    list_inputFlag.setAttribute('value',result['list'][i]['type']);

                    var list_del = document.createElement('i');
                    list_li.appendChild(list_del);
                    list_del.setAttribute('title','删除该项内容');
                    list_del.className = 'fa fa-trash-o';

                    //根据type的状态改变标签颜色
                    switch (result['list'][i]['type']){
                        case 'f':
                            $('.tipLi').eq(i).css('border-left','7px solid red');
                            list_icon.className = 'fa fa-circle-o-notch fa-spin';

                            var list_iconDes = document.createElement('span');
                            list_iconDes.className ='list_iconDes';
                            list_iconDes.innerHTML = '待抓取';
                            list_li.appendChild(list_iconDes);
                            break;
                        case 't':
                            $('.tipLi').eq(i).css('border-left','7px solid lawngreen');
                            list_icon.className = 'fa fa-check';

                            var list_iconDes = document.createElement('span');
                            list_iconDes.className ='list_iconDes';
                            list_iconDes.innerHTML = '已抓取';
                            list_li.appendChild(list_iconDes);
                            list_name.setAttribute('title','显示详细信息');

                            var t0 =result['list'][i]['url'];
                            t0 = t0.replace(/&/g,'%26');
                            console.log(t0)
                            list_name.addEventListener('click', function () {

                                var jumpUrl1 = '/toshow?url='+t0+'&name='+userName0+'&type='+type0;
                                setCookie('url',encodeURIComponent(t0),'name',userName0,'type',type0);
                                console.log(jumpUrl1);
                                window.open(jumpUrl1);
                            });

                            break;
                        case 'now':
                            $('.tipLi').eq(i).css('border-left','7px solid orange');
                            list_icon.className = 'fa fa-refresh fa-spin';

                            var list_iconDes = document.createElement('span');
                            list_iconDes.className ='list_iconDes';
                            list_iconDes.innerHTML = '正在抓';
                            list_li.appendChild(list_iconDes);
                            list_del.remove();
                            break;
                    }


                    list_del.addEventListener('click', function () {
                        list_del.parentNode.remove();
                        console.log(list_inputUrl.value);

                        sendAjax10(list_inputUrl.value);
                    });


                    var list_clear = document.createElement('div');
                    list_clear.className = 'clear';
                    list_li.appendChild(list_clear);


                })();
            }

            var list_clear = document.createElement('div');
            list_clear.className = 'clear';
            list_ul.appendChild(list_clear);

            if($('.dialog__content').eq(0).height()> $('#list-ul').height()){
                $('.dialog__content').eq(0).css('overflow','hidden');
            }else {
                $('.dialog__content').eq(0).css('overflow','scroll');
            }

        }else {
            var list_error = document.createElement('h1');
            list_error.id = 'list_error';
            list_error.innerHTML = '暂无待抓取数据';
            $('#dialog__content')[0].appendChild(list_error);
        }
        //<li class="tipLi">
        //    <img class="tipImg" src="http://static.simpledesktops.com/uploads/desktops/2015/06/02/image_1.png.295x184_q100.png">
        //    <span class="tipName"><a>Ann Sandy Chan</a></span>
        //<p class="tipDes"><a>在Self employed工作 浙江省温州市 曾经就读于武汉工程学院14届</a></p>
        //<div class="clear"></div>
        //    </li>
    });
    return ajaxGet;
}
//删除小列表内容
function sendAjax10(url){
    var ajaxGet = $.get("/deleteurl", {
        url:url,
        user: userName0
    }, function (data) {
        var result = JSON.parse(data);
        console.log(result);
    });
}
//删除大列表内容
function sendAjax12(key){
    var ajaxGet = $.get("/deletekeyword", {
        keyword:key,
        user: userName0
    }, function (data) {
        var result = JSON.parse(data);
        console.log(result);
    });
}


//封装自己Cookie的增删改查函数
function setCookie(key1, value1,key2,value2,key3,value3) {
    document.cookie = ' '+key1 + '=' + value1 + ' '+key2 + '=' + value2 + ' '+key3 + '=' + value3;
    console.log('cookie is :' + document.cookie);
}
function removeCookie(key) {
    setCookie(key, '', -1);//这里只需要把Cookie保质期退回一天便可以删除
}
function getCookie(key) {
    //console.log('cookie is :' + document.cookie);
    var cookieArr = document.cookie.split(' ');
    for(var i = 0; i < cookieArr.length; i++) {
        var arr = cookieArr[i].split('=');
        if(arr[0] === key) {
            return arr[1];
        }
    }
    return false;
}
$(document).ready(function () {

//设置打开抓取列表按钮
    $('#open-button').click(function () {

        if(init15){
            init15.abort();
            console.log('init15 clear')
        }


        //清空ul
        $('#tipUl')[0].innerHTML = '';
        init15 = sendAjax11();

    });


    //
    $(function(){

        $(".action").click(function(){

            $(this).DialogShow({

                'id': 'somedialog',

                'dialogFx': '0'

            });

        });

    });

    $(".dialog__overlay").click(function(){

        $(this).DialogShow({

            'id': 'somedialog',

            'dialogFx': '0',

        });

    });


});