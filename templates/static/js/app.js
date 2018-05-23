/**
 * Created by gilli on 2017/7/3.
 */


function BrowserType() {
//    var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
//    if (userAgent.indexOf("Edge") > -1) {
////                alert("edge!");
//        var inputAll = document.getElementsByClassName("frontBar");
//        var buttonAll = document.getElementsByClassName("searchButton");
//        for (var i = 0; i < inputAll.length; i++) {
//            inputAll[i].style.top = -7.7 + "px";
//            buttonAll[i].style.position = "relative";
//            buttonAll[i].style.top = 15 + "px";
//        }
//    }

}
//搜索结果中分页请求实现
function sendAjax4_2(i) {
    //分页flag,默认加载第一页
    flag_Page = 0;
    //标签单选按钮选择框id的设置
    var labelId = 0;
    //全选,反选功能 check的flag
    var selFlag = true;
    //传递ajax参数：keyword = ?,keyword2 = ?,num = ?
    keyword = keyword + '&num=' + i;
    console.log(keyword);

    //第一页特殊处理
    if (i == 1) {
        if ($(".edge")) {
            $(".edge").remove();
        }
        if ($("#h1_loading")) {
            $("#h1_loading").remove();
        }
        //删除所有按钮
        if ($("#newSpan12_2")) {
            $("#newSpan12_2").remove();
        }

        //创建按钮空间
        var newSpan12_2 = document.createElement('div');
        $("#span12_main2")[0].appendChild(newSpan12_2);
        newSpan12_2.className = 'span12';
        newSpan12_2.id = 'newSpan12_2';
        //创建搜索按钮
        var searchButton = document.createElement('button');
        searchButton.className = 'button button-royal button-giant sButton';
        searchButton.id = 'searchButton_2';
        searchButton.innerHTML = '搜索';
        newSpan12_2.appendChild(searchButton);
        //创建全选按钮
        var selAllButton = document.createElement('button');
        selAllButton.className = 'button button-royal button-giant selAllButton';
        selAllButton.id = 'selAllButton';
        selAllButton.innerHTML = '全选';
        newSpan12_2.appendChild(selAllButton);
        //展示搜索结果
        for (var i = 0; i < tmpResult['list'].length; i++) {
            (function () {
                //test
                var t1 = tmpResult['list'][i]['name'] + '';
                var t2 = tmpResult['list'][i]['url'] + '';
                var t5 = tmpResult['list'][i]['headline'] + '';
                //创建子标签
                var newDiv = document.createElement('div');
                $('#span12_main2')[0].appendChild(newDiv);
                newDiv.className = 'edge';

                var newDiv2 = document.createElement('div');
                newDiv.appendChild(newDiv2);
                newDiv2.className = 'desktop';


                var newA = document.createElement('a');
                newDiv2.appendChild(newA);

                var newImg = document.createElement('img');
                newA.appendChild(newImg);


                if (tmpResult['list'][i]['path'] == '') {
                    newImg.setAttribute('src', 'static/images/defaultPhoto.jpg');

                    var imgTmp = new Image(); //创建一个Image对象，实现图片的预下载
                    imgTmp.src = tmpResult['list'][i]['picture'];
                    imgTmp.onload = function () {
                        newImg.setAttribute("src", imgTmp.src);
                    };

                } else {
                    newImg.setAttribute('src', tmpResult['list'][i]['path']);
                }

                var newP = document.createElement('p');
                newDiv2.appendChild(newP);
                newP.className = 'headline';

                var newA2 = document.createElement('a');
                newP.appendChild(newA2);
                newA2.innerHTML = t5;

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

        //获取所有单选标签
        var arr = document.querySelectorAll('.regular-radio');

        //给单选标签添加点击事件，check
        arr.forEach(function (r) {
            var isChecked = false;
            r.addEventListener('click', function () {
                if (this.checked == true && isChecked == false) {
                    isChecked = true;
                } else {
                    this.checked = false;
                    isChecked = false;
                }
            })
        });

        //添加列表按钮功能实现
        $('#searchButton_2').click(function () {
            if (init10) {
                init10.abort();
                console.log('init10 clear');
            }


            var checkedArr = new Array();
            for (var i = 0; i < arr.length; i++) {
                if (arr[i].checked) {
                    console.log(arr[i]);
                    //checkedArr.push(arr[i].value);
                    checkedArr.push(tmpResult['list'][i]);
                    //console.log(arr[i].value);
                }
            }
            if (checkedArr.length < 1) {
                var notification = new NotificationFx({
                    message: '<p>未获取对象，请单击个人标签右上角选中！</p>',
                    layout: 'growl',
                    effect: 'genie',
                    type: 'warning', // notice, warning or error
                    onClose: function () {
                        //bttn.disabled = false;
                    }
                });

                // show the notification
                notification.show();
            } else {
                console.log(checkedArr);
                init10 = sendAjax8(checkedArr);

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
            }


        });

        $('#selAllButton')[0].addEventListener('click', function () {
            if (selFlag == true) {
                arr.forEach(function (r) {
                    r.checked = true;
                });
                selFlag = false;
            } else {
                arr.forEach(function (r) {
                    r.checked = false;
                });
                selFlag = true;
            }

        });


        flag_Page = 1;
        //加载好恢复li标签
        var allPageBtn = $("#nav_list_demo_pag1 li");
        if (allPageBtn.hasClass('disabled')) {
            console.log('have class disabled');
            allPageBtn.removeClass('disabled');
        }
    } else {
        //其他页发送分页请求
        var ajaxGet = $.get("/queryfenye", keyword, function (data) {
            var result = JSON.parse(data);
            console.log(result);
            //删除所有搜索结果
            if ($(".edge")) {
                $(".edge").remove();
            }
            if ($("#h1_loading")) {
                $("#h1_loading").remove();
            }
            //删除所有按钮
            if ($("#newSpan12_2")) {
                $("#newSpan12_2").remove();
            }

            //创建按钮空间
            var newSpan12_2 = document.createElement('div');
            $("#span12_main2")[0].appendChild(newSpan12_2);
            newSpan12_2.className = 'span12';
            newSpan12_2.id = 'newSpan12_2';
            //创建搜索按钮
            var searchButton = document.createElement('button');
            searchButton.className = 'button button-royal button-giant sButton';
            searchButton.id = 'searchButton_2';
            searchButton.innerHTML = '搜索';
            newSpan12_2.appendChild(searchButton);
            //创建全选按钮
            var selAllButton = document.createElement('button');
            selAllButton.className = 'button button-royal button-giant selAllButton';
            selAllButton.id = 'selAllButton';
            selAllButton.innerHTML = '全选';
            newSpan12_2.appendChild(selAllButton);
            //展示搜索结果
            for (var i = 0; i < result['list'].length; i++) {
                (function () {
                    //test
                    var t1 = result['list'][i]['name'] + '';
                    var t2 = result['list'][i]['url'] + '';
                    var t5 = result['list'][i]['headline'] + '';
                    //创建子标签
                    var newDiv = document.createElement('div');
                    $('#span12_main2')[0].appendChild(newDiv);
                    newDiv.className = 'edge';

                    var newDiv2 = document.createElement('div');
                    newDiv.appendChild(newDiv2);
                    newDiv2.className = 'desktop';


                    var newA = document.createElement('a');
                    newDiv2.appendChild(newA);

                    var newImg = document.createElement('img');
                    newA.appendChild(newImg);


                    if (result['list'][i]['path'] == '') {
                        newImg.setAttribute('src', 'static/images/defaultPhoto.jpg');

                        var imgTmp = new Image(); //创建一个Image对象，实现图片的预下载
                        imgTmp.src = result['list'][i]['picture'];
                        imgTmp.onload = function () {
                            newImg.setAttribute("src", imgTmp.src);
                        };

                    } else {
                        newImg.setAttribute('src', result['list'][i]['path']);
                    }

                    var newP = document.createElement('p');
                    newDiv2.appendChild(newP);
                    newP.className = 'headline';

                    var newA2 = document.createElement('a');
                    newP.appendChild(newA2);
                    newA2.innerHTML = t5;

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

            //获取所有单选标签
            var arr = document.querySelectorAll('.regular-radio');

            //给单选标签添加点击事件，check
            arr.forEach(function (r) {
                var isChecked = false;
                r.addEventListener('click', function () {
                    if (this.checked == true && isChecked == false) {
                        isChecked = true;
                    } else {
                        this.checked = false;
                        isChecked = false;
                    }
                })
            });

            //添加列表按钮功能实现
            $('#searchButton_2').click(function () {
                if (init10) {
                    init10.abort();
                    console.log('init10 clear');
                }


                var checkedArr = new Array();
                for (var i = 0; i < arr.length; i++) {
                    if (arr[i].checked) {
                        console.log(arr[i]);
                        //checkedArr.push(arr[i].value);
                        checkedArr.push(result['list'][i]);
                        //console.log(arr[i].value);
                    }
                }
                if (checkedArr.length < 1) {
                    var notification = new NotificationFx({
                        message: '<p>未获取对象，请单击个人标签右上角选中！</p>',
                        layout: 'growl',
                        effect: 'genie',
                        type: 'warning', // notice, warning or error
                        onClose: function () {
                            //bttn.disabled = false;
                        }
                    });

                    // show the notification
                    notification.show();
                } else {
                    console.log(checkedArr);
                    init10 = sendAjax8(checkedArr);

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
                }


            });

            $('#selAllButton')[0].addEventListener('click', function () {
                if (selFlag == true) {
                    arr.forEach(function (r) {
                        r.checked = true;
                    });
                    selFlag = false;
                } else {
                    arr.forEach(function (r) {
                        r.checked = false;
                    });
                    selFlag = true;
                }

            });


            flag_Page = 1;

            //加载好恢复li标签
            var allPageBtn = $("#nav_list_demo_pag1 li");
            if (allPageBtn.hasClass('disabled')) {
                console.log('have class disabled');
                allPageBtn.removeClass('disabled');
            }

        });
        console.log("this is ajax " + i);
    }


}
//搜索按钮功能实现
function sendAjax7(n, k, k2) {
    //请求的url
    var url;
    //请求的参数,keyword1,(keyword2)
    var key;
    //标签单选按钮选择框id的设置
    var labelId = 0;
    //全选,反选功能 check的flag
    var selFlag = true;


    //切换搜索类型
    switch (n) {
        case 0:
            url = '/query1';
            key = 'keyword=' + k;

            break;
        case 1:
            url = '/query2';
            key = 'keyword=' + k;
            break;
        case 2:
            k = k.replace(/;/g, '%3B');
            url = '/query3';
            key = 'keyword=' + k + '&keyword2=' + k2;
            break;
    }

    keyword = key;
    keyword1 = k;
    keyword2 = k2;
    console.log(key);
    if ($('#span12_main2')) {
        $('#span12_main2').remove();
    }

    if (init11) {
        init11.abort();
        console.log('init11 clear!');
    }

    //创建最大父空间
    var newSpan12 = document.createElement('div');
    $("#motherRow")[0].appendChild(newSpan12);
    newSpan12.className = 'span12';
    newSpan12.id = 'span12_main2';
    //创建按钮空间
    var newSpan12_2 = document.createElement('div');
    newSpan12.appendChild(newSpan12_2);
    newSpan12_2.className = 'span12';
    newSpan12_2.id = 'newSpan12_2';
    //创建搜索按钮
    var searchButton = document.createElement('button');
    searchButton.className = 'button button-royal button-giant sButton';
    searchButton.id = 'searchButton_2';
    searchButton.innerHTML = '搜索';
    newSpan12_2.appendChild(searchButton);
    //创建全选人
    var selAllButton = document.createElement('button');
    selAllButton.className = 'button button-royal button-giant selAllButton';
    selAllButton.id = 'selAllButton';
    selAllButton.innerHTML = '全选';
    newSpan12_2.appendChild(selAllButton);
    //等待提示
    var h1_loading = document.createElement('h1');
    h1_loading.id = 'h1_loading';
    h1_loading.innerHTML = '正在查询中,请稍后...';
    newSpan12_2.appendChild(h1_loading);


    var ajaxGet = $.get(url, key, function (data) {
            if ($("#h1_loading")) {
                $("#h1_loading").remove();
            }

            var result = JSON.parse(data);
            tmpResult = result;
            console.log(result);
            //图片加载flag

            var init_img;

            console.log(result['sign']);
            tmpListFlag = result['sign'];

            //队列校正
            init11 = sendAjax0();
            //错误处理
            if (!result['list'] && result['error']) {
                var h2_error = document.createElement('h2');
                h2_error.id = 'h2_error';
                h2_error.innerHTML = result['error'];
                newSpan12.appendChild(h2_error);
                //正确处理
            } else {
                console.log(result['list'].length);
                //query1
                if (n == 0) {
                    if (result['list'].length > 0) {
                        if ($(".edge")) {
                            $(".edge").remove();
                        }
                        if ($("#h1_loading")) {
                            $("#h1_loading").remove();
                        }
                        //删除所有按钮
                        if ($("#newSpan12_2")) {
                            $("#newSpan12_2").remove();
                        }

                        //创建按钮空间
                        var newSpan12_2 = document.createElement('div');
                        $("#span12_main2")[0].appendChild(newSpan12_2);
                        newSpan12_2.className = 'span12';
                        newSpan12_2.id = 'newSpan12_2';
                        //创建搜索按钮
                        var searchButton = document.createElement('button');
                        searchButton.className = 'button button-royal button-giant sButton';
                        searchButton.id = 'searchButton_2';
                        searchButton.innerHTML = '搜索';
                        newSpan12_2.appendChild(searchButton);
                        //创建全选按钮
                        var selAllButton = document.createElement('button');
                        selAllButton.className = 'button button-royal button-giant selAllButton';
                        selAllButton.id = 'selAllButton';
                        selAllButton.innerHTML = '全选';
                        newSpan12_2.appendChild(selAllButton);


                        var flag_img = new Array(result['list'].length);
                        flag_img.fill(0);
                        var flag_img2 = new Array(result['list'].length);
                        flag_img2.fill(0);
                        console.log(flag_img);
                        console.log(flag_img2);

                        //展示搜索结果
                        for (var i = 0; i < result['list'].length; i++) {
                            (function () {
                                //test
                                var t1 = result['list'][i]['name'] + '';
                                var t2 = result['list'][i]['url'] + '';
                                var t5 = result['list'][i]['headline'] + '';
                                //创建子标签
                                var newDiv = document.createElement('div');
                                $('#span12_main2')[0].appendChild(newDiv);
                                newDiv.className = 'edge';

                                var newDiv2 = document.createElement('div');
                                newDiv.appendChild(newDiv2);
                                newDiv2.className = 'desktop';


                                var newA = document.createElement('a');
                                newDiv2.appendChild(newA);

                                var newImg = document.createElement('img');
                                newA.appendChild(newImg);


                                if (result['list'][i]['path'] == '') {
                                    newImg.setAttribute('src', 'static/images/defaultPhoto.jpg');

                                    var imgTmp = new Image(); //创建一个Image对象，实现图片的预下载
                                    imgTmp.src = result['list'][i]['picture'];
                                    imgTmp.onload = function () {
                                        newImg.setAttribute("src", imgTmp.src);
                                    };

                                } else {
                                    var ii=i;
                                    console.log("!!!:"+flag_img[i]+" :"+flag_img2[i]);
                                    init_img = setTimeout(function () {
                                        flag_img2[ii] = 1;
                                    }, 21000);
                                    newImg.setAttribute('src', 'static/images/defaultPhoto.jpg');

                                    var imgTmp1 = new Image(); //创建一个Image对象，实现图片的预下载
                                    imgTmp1.src = result['list'][i]['path'];
                                    imgTmp1.onerror = function () {
                                        console.log("---:"+flag_img[ii]+" :"+flag_img2[ii]);
                                        if (flag_img[ii] == 1 || flag_img2[ii] == 1) {
                                            return;
                                        }
                                        setTimeout(function () {
                                            imgTmp1.src = imgTmp1.src;
                                        }, 3000);
                                    };
                                    imgTmp1.onload = function () {
                                        console.log("by path");
                                        newImg.setAttribute('src', imgTmp1.src);
                                        flag_img[ii] = 1;
                                    };

                                    var imgTmp2 = new Image();
                                    imgTmp2.src = result['list'][i]['picture'];
                                    imgTmp2.onload = function () {
                                        console.log("by picture");
                                        newImg.setAttribute("src", imgTmp2.src);
                                        flag_img[ii] = 1;
                                    };

                                    //console.log(flagImg);


                                    //newImg.setAttribute('src', result['list'][i]['path']);

                                    //if(imgTmp1.fileSize > 0 || (imgTmp1.width > 0 && imgTmp1.height >0) ){
                                    //    newImg.setAttribute("src", imgTmp1.src);
                                    //    console.log("1");
                                    //}else {
                                    //    console.log("2");
                                    //}

                                    //imgTmp1.onload = function () {
                                    //    newImg.setAttribute("src", imgTmp1.src);
                                    //};
                                    //newImg.setAttribute('src', result['list'][i]['path']);
                                }

                                var newP = document.createElement('p');
                                newDiv2.appendChild(newP);
                                newP.className = 'headline';

                                var newA2 = document.createElement('a');
                                newP.appendChild(newA2);
                                newA2.innerHTML = t5;

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

                        //获取所有单选标签
                        var arr = document.querySelectorAll('.regular-radio');

                        //给单选标签添加点击事件，check
                        arr.forEach(function (r) {
                            var isChecked = false;
                            r.addEventListener('click', function () {
                                if (this.checked == true && isChecked == false) {
                                    isChecked = true;
                                } else {
                                    this.checked = false;
                                    isChecked = false;
                                }
                            })
                        });

                        //添加列表按钮功能实现
                        $('#searchButton_2').click(function () {
                            if (init10) {
                                init10.abort();
                                console.log('init10 clear');
                            }


                            var checkedArr = new Array();
                            for (var i = 0; i < arr.length; i++) {
                                if (arr[i].checked) {
                                    console.log(arr[i]);
                                    //checkedArr.push(arr[i].value);
                                    checkedArr.push(result['list'][i]);
                                    //console.log(arr[i].value);
                                }
                            }
                            if (checkedArr.length < 1) {
                                var notification = new NotificationFx({
                                    message: '<p>未获取对象，请单击个人标签右上角选中！</p>',
                                    layout: 'growl',
                                    effect: 'genie',
                                    type: 'warning', // notice, warning or error
                                    onClose: function () {
                                        //bttn.disabled = false;
                                    }
                                });

                                // show the notification
                                notification.show();
                            } else {
                                console.log(checkedArr);
                                init10 = sendAjax8(checkedArr);

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
                            }


                        });
                        //设置全选按钮
                        $('#selAllButton')[0].addEventListener('click', function () {
                            if (selFlag == true) {
                                arr.forEach(function (r) {
                                    r.checked = true;
                                });
                                selFlag = false;
                            } else {
                                arr.forEach(function (r) {
                                    r.checked = false;
                                });
                                selFlag = true;
                            }

                        });
                    }
                }

                // query2,query3创建分页
                else if (result['list'].length > 0 && result['n'] > 0) {
                    console.log('一共' + result['n'] + '页');
                    //创建分页结构
                    var newPage = document.createElement('div');
                    newPage.id = 'demo_pag1';
                    newSpan12.appendChild(newPage);
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
                            onChangePage: function (event, data) {

                                if ($(".edge")) {
                                    $(".edge").remove();
                                }
                                //等待提示
                                var newTip = document.createElement('h1');
                                newTip.className = 'h1_loading';
                                newTip.id = 'h1_loading';
                                newTip.innerHTML = 'Loading...';
                                newSpan12.appendChild(newTip);

                                //等待中禁用li标签
                                var allPageBtn = $("#nav_list_demo_pag1 li");
                                console.log('allPageBtn.length ' + allPageBtn.length);
                                allPageBtn.addClass('disabled');
                                //init11 = sendAjax5();
                                if (flag_Page == 1) {
                                    init9 = sendAjax4_2(data.currentPage);
                                    // your code here e.g.
                                    console.log('Current page is: ' + data.currentPage);
                                }
                            }
                        });
                        //更改CSS样式
                        if ($("#goto_page_demo_pag1")[0]) {
                            $("#goto_page_demo_pag1")[0].setAttribute('placeholder', '跳转');
                        }
                        //第一次加载显示第一页
                        var newTip = document.createElement('h1');
                        newTip.className = 'h1_loading';
                        newTip.id = 'h1_loading';
                        newTip.innerHTML = 'Loading...';
                        newSpan12.appendChild(newTip);
                        init9 = sendAjax4_2(1);

                    });
                }

            }


        }
    );
}
//添加到抓取列表
function sendAjax8(arr) {
    var jsonArr = {};
    jsonArr['list'] = arr;
    console.log(userName0);
    console.log(keyword1 + ':' + keyword2);
    //var url_this = keyword + '&list=' +JSON.stringify(jsonArr) + '&user=' + userName0;
    //console.log(url_this);
    var ajaxGet = $.get("/detailed", {
        list: JSON.stringify(jsonArr),
        user: userName0,
        keyword: keyword1,
        keyword2: keyword2
    }, function (data) {
        var result = JSON.parse(data);
        console.log(result);
    });
    return ajaxGet;
}
//队列校正ajax,判断是否继续
function sendAjax0() {
    console.log(tmpListFlag);
    if (tmpListFlag == 't') {
        var ajaxGet = $.get("/continuedetailed", {
            user: userName0
        }, function (data) {
            var result = JSON.parse(data);
            console.log(result);
        });
        return ajaxGet;
    }

}
var init10;
var flag_Page = 0;
var init9;
var init11;
var keyword;
var keyword1;
var keyword2;
var tmpResult;
var tmpListFlag;
$(document).ready(function () {
    //获取当前浏览器的类型
    BrowserType();
    //alert(document.body.offsetHeight);

    //从这里往下都是以前写的静态搜索页面的动画js

    var titleName = $('#searchTitle')[0].getElementsByTagName("li");
    var tabContent = $('#searchContent')[0].getElementsByTagName("input");
    var tabDes = $('#searchDes')[0].getElementsByTagName("div");
    var lastId = 0;


    //var openIco = $('#openIcon');
    //var closeIco = $('#closeIcon');

    var btmP = $('#btmPic');
    var liWidth = titleName[0].offsetWidth;
    console.log(liWidth);

    var nowIndex = 0;

    $("#searchButton").hover(function () {
        $("#sBar").css("background-color", "#0f9ae0");
    }, function () {
        $("#sBar").css("background-color", "lightskyblue");
    });

    for (var i = 0; i < titleName.length; i++) {
        titleName[i].id = i;
        titleName[i].onclick = function () {
            nowIndex = parseInt(this.id);
            for (var j = 0; j < titleName.length; j++) {
                titleName[j].className = "";
                tabDes[j].style.display = "none";
            }

            $('#switch').css('display', 'none');

            for (var k = 0; k < tabContent.length; k++) {
                tabContent[k].style.display = 'none';
            }
            switch (parseInt(this.id)) {
                case 0:
                    tabContent[this.id].style.display = 'block';
                    break;
                case 1:
                    tabContent[this.id].style.display = 'block';
                    break;
                case 2:
                    tabContent[this.id].style.display = 'block';
                    //tabContent[parseInt(this.id)+1].style.display ='block';
                    $('#switch').css('display', 'block');
                    break;
            }

            this.className = "select";
            tabDes[this.id].style.display = "block";
            if (this.id == 0) {
                if (this.id > lastId) {
                    document.getElementById('scrollBar').style.width = liWidth * 2 + 'px';
                    setTimeout(function () {
                        document.getElementById('scrollBar').style.left = 160 + 0 + 'px';
                    }, 200);
                    setTimeout(function () {
                        document.getElementById('scrollBar').style.width = liWidth + 'px';
                    }, 200);
                } else if (this.id < lastId) {
                    //console.log(this.id);
                    //document.getElementById('scrollBar').style.width= 383+'px';
                    setTimeout(function () {
                        document.getElementById('scrollBar').style.left = 160 + 0 + 'px';
                    }, 0);

                    setTimeout(function () {
                        document.getElementById('scrollBar').style.width = liWidth * 2 + 'px';
                    }, 0);
                    //document.getElementById('scrollBar').style.left =0+'px';
                    //document.getElementById('scrollBar').style.width= 191.5+'px';
                    setTimeout(function () {
                        document.getElementById('scrollBar').style.left = 160 + 0 + 'px';
                    }, 200);

                    setTimeout(function () {
                        document.getElementById('scrollBar').style.width = liWidth + 'px';
                    }, 200);
                }


            }
            else if (this.id == 1) {
                if (this.id > lastId) {
                    document.getElementById('scrollBar').style.width = liWidth * 2 + 'px';
                    setTimeout(function () {
                        document.getElementById('scrollBar').style.left = 160 + liWidth + 'px';
                    }, 200);
                    setTimeout(function () {
                        document.getElementById('scrollBar').style.width = liWidth + 'px';
                    }, 200);
                } else if (this.id < lastId) {
                    //document.getElementById('scrollBar').style.width= 383+'px';
                    setTimeout(function () {
                        document.getElementById('scrollBar').style.left = 160 + liWidth + 'px';
                    }, 0);

                    setTimeout(function () {
                        document.getElementById('scrollBar').style.width = liWidth * 2 + 'px';
                    }, 0);
                    setTimeout(function () {
                        document.getElementById('scrollBar').style.left = 160 + liWidth + 'px';
                    }, 200);

                    //document.getElementById('scrollBar').style.left =191.5+'px';
                    setTimeout(function () {
                        document.getElementById('scrollBar').style.width = liWidth + 'px';
                    }, 200);
                    //document.getElementById('scrollBar').style.width= 191.5+'px';

                }
            }
            else if (this.id == 2) {
                if (this.id > lastId) {
                    document.getElementById('scrollBar').style.width = liWidth * 2 + 'px';
                    setTimeout(function () {
                        document.getElementById('scrollBar').style.left = 160 + liWidth * 2 + 'px';
                    }, 200);
                    setTimeout(function () {
                        document.getElementById('scrollBar').style.width = liWidth + 'px';
                    }, 200);
                } else if (this.id < lastId) {
                    //document.getElementById('scrollBar').style.width= 383+'px';
                    setTimeout(function () {
                        document.getElementById('scrollBar').style.left = 160 + liWidth * 2 + 'px';
                    }, 0);

                    setTimeout(function () {
                        document.getElementById('scrollBar').style.width = liWidth * 2 + 'px';
                    }, 0);
                    //document.getElementById('scrollBar').style.left =383+'px';
                    //document.getElementById('scrollBar').style.width= 191.5+'px';
                    setTimeout(function () {
                        document.getElementById('scrollBar').style.left = liWidth * 2 + 'px';
                    }, 200);
                    setTimeout(function () {
                        document.getElementById('scrollBar').style.width = liWidth + 'px';
                    }, 200);
                }
            }
            else if (this.id == 3) {
                if (this.id > lastId) {
                    document.getElementById('scrollBar').style.width = liWidth * 2 + 'px';
                    setTimeout(function () {
                        document.getElementById('scrollBar').style.left = liWidth * 3 + 'px';
                    }, 200);
                    setTimeout(function () {
                        document.getElementById('scrollBar').style.width = liWidth + 'px';
                    }, 200);
                } else if (this.id < lastId) {
                    //document.getElementById('scrollBar').style.width= 383+'px';
                    setTimeout(function () {
                        document.getElementById('scrollBar').style.left = liWidth * 3 + 'px';
                    }, 0);

                    setTimeout(function () {
                        document.getElementById('scrollBar').style.width = liWidth * 2 + 'px';
                    }, 0);

                    setTimeout(function () {
                        document.getElementById('scrollBar').style.left = liWidth * 3 + 'px';
                    }, 200);

                    setTimeout(function () {
                        document.getElementById('scrollBar').style.width = liWidth + 'px';
                    }, 200);
                }
            } else if (this.id == 4) {
                if (this.id > lastId) {
                    document.getElementById('scrollBar').style.width = liWidth * 2 + 'px';
                    setTimeout(function () {
                        document.getElementById('scrollBar').style.left = liWidth * 4 + 'px';
                    }, 200);
                    setTimeout(function () {
                        document.getElementById('scrollBar').style.width = liWidth + 'px';
                    }, 200);
                } else if (this.id < lastId) {
                    //document.getElementById('scrollBar').style.width= 383+'px';
                    setTimeout(function () {
                        document.getElementById('scrollBar').style.left = liWidth * 4 + 'px';
                    }, 0);

                    setTimeout(function () {
                        document.getElementById('scrollBar').style.width = liWidth * 2 + 'px';
                    }, 0);

                    setTimeout(function () {
                        document.getElementById('scrollBar').style.left = liWidth * 4 + 'px';
                    }, 200);

                    setTimeout(function () {
                        document.getElementById('scrollBar').style.width = liWidth + 'px';
                    }, 200);
                }
            }

            lastId = this.id;

        }
    }


    var screenHeight = document.documentElement.clientHeight;

    $('#input1').bind('keydown', function (event) {
        if (event.keyCode == "13") {
            $('#searchButton').trigger('click');
        }
    });
    $('#input2').bind('keydown', function (event) {
        if (event.keyCode == "13") {
            $('#searchButton').trigger('click');
        }
    });
    $('#input31').bind('keydown', function (event) {
        if (event.keyCode == "13") {
            $('#searchButton').trigger('click');
        }
    });


    //当点击搜索按钮时触发的逻辑
    $('#searchButton').on('click', function () {

        //判断查询类型
        //如果是在线查询
        if (nowIndex == 0) {
            console.log($('#input1').val());
            sendAjax7(0, $('#input1').val());
        } else if (nowIndex == 1) {
            //如果是本地查询
            console.log($('#input2').val())
            sendAjax7(1, $('#input2').val());
        } else {
            //如果是关键字查询
            console.log($('#input31').val() + " " + $('#checkbox').val());
            sendAjax7(2, $('#input31').val(), $('#checkbox').val());
        }

        //搜索框上移动画
        $(".logoIcon:first").css('height', '0');
        $(".searchDes:first").css('height', '0');
        setTimeout(function () {
            $(".logoIcon:first").css('display', 'none');
            $(".searchDes:first").css('display', 'none');
            $(".mainContent:first").css('height', '190px');
            $(".mainContent:first").css('margin', '0 auto');

        }, 200);


    })

});