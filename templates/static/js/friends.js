/**
 * Created by LEGO on 2018/1/25.
 */
$(document).ready(function () {
    var init8;
    function sendAjax11() {
        //设置跳转导航的ID
        var nav_id = 1;
        var labelId = 0;
        console.log(url0);
        var t0 = url0;
        //t0 = t0.replace('&','%26');
        //console.log(url0);

        var ajaxGet = $.get("/searchfriends", {
            url: t0
        }, function (data) {
            //请求好友信息
            var result = JSON.parse(data);
            console.log(result);
            //生成每个分页的id
            var id_page=0;
            //设置每个分页显示的数量
            var each_page =12;

            var last_start_page = 0;
            var last_end_page = 0;
            var flag_first_page = true;
            //friendlist有多种子类型，
            for (var item in result['friendsList']) {

                (function () {
                    console.log(result['friendsList'][item]);
                    //创建多种子类型的导航栏
                    var li_nav = document.createElement('li');
                    $('#ul_nav')[0].appendChild(li_nav);

                    var a_nav = document.createElement('a');
                    li_nav.appendChild(a_nav);
                    if (nav_id == 1) {
                        a_nav.className = 'active';
                    }
                    a_nav.setAttribute('href', '#section' + nav_id);
                    a_nav.innerHTML = item;

                    var div_sec = document.createElement('div');
                    $("#friendsNav")[0].appendChild(div_sec);
                    div_sec.id = 'section' + nav_id;
                    div_sec.className = 'section-content';

                    var h1_sec = document.createElement('h1');
                    div_sec.appendChild(h1_sec);
                    h1_sec.className = 'h1_sec';
                    h1_sec.innerHTML = item;

                    var ul_friendsShow = document.createElement('ul');
                    div_sec.appendChild(ul_friendsShow);
                    ul_friendsShow.className = 'ul_friendsShow';

                    var li_friendsShow = document.createElement('li');
                    ul_friendsShow.appendChild(li_friendsShow);


                    //添加分页功能
                    //计算分页数
                    var num_page = Math.ceil(result['friendsList'][item].length/each_page);
                    console.log('共有'+ num_page +'页');

                    var newPage = document.createElement('div');
                    newPage.id = 'demo_pag' + id_page;
                    li_friendsShow.appendChild(newPage);
                    $(function () {
                        //init
                        $('#'+'demo_pag'+id_page).bs_pagination({
                            totalPages: num_page,
                            currentPage: 1,
                            rowsPerPage: 50,
                            maxRowsPerPage: 100,
                            totalRows: 0,
                            visiblePageLinks: 5,
                            showGoToPage: true,
                            showRowsPerPage: false,
                            showRowsInfo: true,
                            showRowsDefaultInfo: true,
                            onChangePage: function (event, data) {
                                var edges_all;

                                //冒泡点击获取该父标签下的所有edge标签
                                var target = event.target;
                                while(target.nodeType === 1&&target.tagName!=='LI'){
                                    target = target.parentNode;
                                }
                                if(target.tagName == 'LI'){
                                    edges_all = $(target).children('.edge');
                                }

                                if(flag_first_page){
                                    flag_first_page = false;
                                    last_end_page = edges_all.length;
                                }
                                //console.log(edges_all);

                                for(var i=last_start_page;i<last_end_page;i++){
                                    $(target).children('.edge').css('display','none');
                                }

                                var startNum =(data.currentPage -1)*each_page;
                                var endNum = startNum + 12;
                                last_start_page = startNum;
                                last_end_page = endNum;
                                if(endNum > edges_all.length){
                                    endNum = edges_all.length;
                                }
                                console.log('start:'+startNum + ' end:'+endNum);
                                for (i = startNum; i<endNum ;i++){
                                    $(target).children('.edge').eq(i).css('display','block');
                                }
                                ////等待中禁用li标签
                                //var allPageBtn = $("#nav_list_demo_pag1 li");
                                //console.log('allPageBtn.length ' + allPageBtn.length);
                                //allPageBtn.addClass('disabled');
                                ////init11 = sendAjax5();
                                //if (flag_Page == 1) {
                                //    init9 = sendAjax4_2(data.currentPage);
                                //    // your code here e.g.
                                //    console.log('Current page is: ' + data.currentPage);
                                //}
                            }
                        });
                        //更改CSS样式
                        if ($("#goto_page_demo_pag1")[0]) {
                            $("#goto_page_demo_pag1")[0].setAttribute('placeholder', '跳转');
                        }
                        //第一次加载显示第一页


                        //var edges_all;
                        //
                        ////冒泡点击获取该父标签下的所有edge标签
                        //var target = event.target;
                        //while(target.nodeType === 1&&target.tagName!=='LI'){
                        //    target = target.parentNode;
                        //}
                        //if(target.tagName == 'LI'){
                        //    edges_all = $(target).children('.edge');
                        //}
                        //
                        //
                        //var startNum =0;
                        //var endNum = 12;
                        ////if(endNum > edges_all.length){
                        ////    endNum = edges_all.length;
                        ////}
                        ////console.log('start:'+startNum + ' end:'+endNum);
                        //for (i = startNum; i<endNum ;i++){
                        //    $(target).children('.edge').eq(i).css('display','block');
                        //}

                    });




                    //list
                    for (var i = 0; i<result['friendsList'][item].length; i++) {
                        (function () {
                            //test
                            var t1 = result['friendsList'][item][i]['name'] + '';
                            var t2 = result['friendsList'][item][i]['url'] + '';
                            //创建子标签
                            var newDiv = document.createElement('div');
                            li_friendsShow.appendChild(newDiv);
                            newDiv.className = 'edge';

                            var newDiv2 = document.createElement('div');
                            newDiv.appendChild(newDiv2);
                            newDiv2.className = 'desktop';


                            var newA = document.createElement('a');
                            newDiv2.appendChild(newA);

                            var newImg = document.createElement('img');
                            newA.appendChild(newImg);
                            newImg.setAttribute('src', 'static/images/defaultPhoto.jpg');

                            var imgTmp = new Image(); //创建一个Image对象，实现图片的预下载
                            imgTmp.src = result['friendsList'][item][i]['picture'];
                            imgTmp.onload = function () {
                                newImg.setAttribute("src", imgTmp.src);
                            };


                            var newSpan = document.createElement('span');
                            newDiv2.appendChild(newSpan);
                            newSpan.className = 'creator';

                            var newA3 = document.createElement('a');
                            newSpan.appendChild(newA3);
                            newA3.innerHTML = t1;

                            var newDiv3 = document.createElement('div');
                            newDiv2.appendChild(newDiv3);
                            newDiv3.className = 'radioPos';

                            var newInput = document.createElement('input');
                            newDiv3.appendChild(newInput);
                            newInput.className = 'regular-radio big-radio r' + labelId;
                            newInput.id = 'radio-2-' + labelId;
                            newInput.setAttribute('type', 'radio');
                            newInput.setAttribute('name', 'r' + labelId);
                            newInput.setAttribute('value', t2);

                            var newLabel = document.createElement('label');
                            newDiv3.appendChild(newLabel);
                            newLabel.className = 'label' + labelId;
                            newLabel.setAttribute('for', 'radio-2-' + labelId);

                            labelId++;
                            //for循环结束
                        })();
                    }

                    $('#nav_item_demo_pag'+id_page+'_1').click();
                    //切换到下个类型
                    id_page++;
                    nav_id++;
                })();

            }

            //设置点击状态
            var arr = document.querySelectorAll('.regular-radio');
            console.log(arr);

            arr.forEach(function (r) {
                var isChecked = false;
                r.addEventListener('click', function () {
                    if(this.checked == true && isChecked == false){
                        isChecked = true;
                    }else {
                        this.checked = false;
                        isChecked =false;
                    }
                })
            });

            //设置添加队列功能
            $('#btn_addToList')[0].addEventListener('click', function () {

                if(init8){
                    init8.abort();
                    console.log('init8 clear');
                }
                var friendsListTmp = [];

                for(var it1 in result['friendsList']){
                    friendsListTmp = friendsListTmp.concat(result['friendsList'][it1]);
                }
                console.log(friendsListTmp);

                var checkedArr = new Array ();
                var arr1 = document.querySelectorAll('.regular-radio');
                for(var i =0;i<arr1.length;i++){
                    if(arr1[i].checked){
                        console.log(i);
                        console.log(arr1[i]);
                        console.log(result['friendsList'][item]);
                        console.log(item);
                        //checkedArr.push(arr[i].value);
                        //checkedArr.push(result['friendsList'][item][i]);
                        friendsListTmp[i]['path'] = '';
                        checkedArr.push(friendsListTmp[i]);
                        //console.log(arr[i].value);
                    }
                }
                //未选中
                if(checkedArr.length<1){
                    var notification = new NotificationFx({
                        message : '<p>未获取对象，请单击个人标签右上角选中！</p>',
                        layout : 'growl',
                        effect : 'genie',
                        type : 'warning', // notice, warning or error
                        onClose : function() {
                            //bttn.disabled = false;
                        }
                    });

                    // show the notification
                    notification.show();
                //选中一个标签
                }else if(checkedArr.length == 1){
                    console.log(checkedArr);
                    init8 = sendAjax8(checkedArr,checkedArr[0]['name']);

                    var notification = new NotificationFx({
                        message : '<p>已经加入待抓取队列,鼠标单击屏幕右侧按钮查看!</p>',
                        layout : 'growl',
                        effect : 'genie',
                        type : 'notice', // notice, warning or error
                        onClose : function() {
                            //bttn.disabled = false;
                        }
                    });

                    // show the notification
                    notification.show();
                 //选中多个标签
                }else {
                    //设置所有标签为未选中的状态
                    for(var j=0;j<arr.length;j++){
                        arr[j].checked = false;
                    }

                    var notification = new NotificationFx({
                        message : '<p>只能抓取一个好友，请重新选择！</p>',
                        layout : 'growl',
                        effect : 'genie',
                        type : 'notice', // notice, warning or error
                        onClose : function() {
                            //bttn.disabled = false;
                        }
                    });

                    // show the notification
                    notification.show();
                }



            });

            //设置导航动画，即切换好友所属标签时导航栏的动画效果
            var navHeight= $("#navHeight").offset().top;
            var navFix=$("#nav-wrap");
            $(window).scroll(function(){
                if($(this).scrollTop()>navHeight){
                    navFix.addClass("navFix");
                }
                else{
                    navFix.removeClass("navFix");
                }
            })
            $('.nav-wrap').navScroll({
                mobileDropdown: true,
                mobileBreakpoint: 768,
                scrollSpy: true
            });

            $('.click-me').navScroll({
                navHeight: 0
            });

            $('.nav-wrap').on('click', '.nav-mobile', function (e) {
                e.preventDefault();
                $('.nav-wrap ul').slideToggle('fast');
            });
        });
    }
    function sendAjax8(arr,title){
        var jsonArr = {};
        jsonArr['list'] = arr;
        console.log(userName0);
        console.log(typeof (arr));
        var ajaxGet = $.get("/detailed", {
            list: JSON.stringify(jsonArr),
            user: userName0,
            keyword:title
        }, function (data) {


            //console.log(data);
            var result = JSON.parse(data);
            console.log(result);
        });
        return ajaxGet;
    }

    sendAjax11();






});