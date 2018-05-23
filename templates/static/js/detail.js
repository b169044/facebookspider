/**
 * Created by LEGO on 2018/1/24.
 */
$(document).ready(function () {
    //function sendAjax11(){
    //    console.log(url0);
    //    var ajaxGet = $.get("/searchfriends", {
    //        url: url0,
    //    }, function (data) {
    //        var result = JSON.parse(data);
    //        console.log(result);
    //});
    //}
    //sendAjax11();
    //console.log($('.ul_friends li').length);
    $('#button_more').click(function () {
        if ($('.ul_friends li').length > 0) {
            var t0 = url1;
            t0 = t0.replace(/&/g, '%26');
            var p0 = pic1;
            p0 = p0.replace(/&/g, '%26');
            var jumpUrl1 = '/friends?url=' + t0 + '&name=' + userName0 + '&picture=' + p0 + '&name1=' + name1 + '&type=' + type0;
            console.log(jumpUrl1);
            window.open(jumpUrl1);
        } else {
            alert('没有更多好友!');
        }
    });


    $('#button_more_2').click(function () {
        if ($('.ul_friends li').length > 0) {
            var t0 = url1;
            t0 = t0.replace(/&/g, '%26');
            var p0 = pic1;
            p0 = p0.replace(/&/g, '%26');
            var jumpUrl1 = '/groups?url=' + t0 + '&name=' + userName0 + '&picture=' + p0 + '&name1=' + name1 + '&type=' + type0;
            console.log(jumpUrl1);
            window.open(jumpUrl1);
        } else {
            alert('没有更多好友!');
        }
    });


    $('#button_more_3').click(function () {
        if ($('.ul_friends li').length > 0) {
            var t0 = url1;
            t0 = t0.replace(/&/g, '%26');
            var p0 = pic1;
            p0 = p0.replace(/&/g, '%26');
            var jumpUrl1 = '/likes?url=' + t0 + '&name=' + userName0 + '&picture=' + p0 + '&name1=' + name1 + '&type=' + type0;
            console.log(jumpUrl1);
            window.open(jumpUrl1);
        } else {
            alert('没有更多好友!');
        }
    });

    var cookie_url = decodeURIComponent(getCookie('url'));
    var cookie_name = getCookie('name');
    var cookie_type = getCookie('type');
    console.log(cookie_url + ';' + cookie_name + ';' + cookie_type);

    //需要传入的值：picutre,name1,info,
    // 好友：num,friendlist,
    // 右侧帖子：{% for item in tweet %}{{ picture }}{{ item.time }}
    //{{ item.text }}{{ item.arialabel }}{{ item.video }}{% for i in item.picture %}

    //请求detailed页的所有详细信息
    function sendajax_content() {
        var ajaxGet = $.get("/searchdetailed", {
            url: cookie_url,
            name: cookie_name,
            type: cookie_type
        }, function (data) {
            var result = JSON.parse(data);
            console.log(result);
        });
    }

    //获取后台传的所有参数
    console.log(result_all);
    userName0 = result_all['name'];
    var url1 = result_all['url'];
    type0 = result_all['type'];
    var pic1 = result_all['picture'];
    var name1 = result_all['name1'];
    var tweet = eval(result_all['tweet']);
    var friendsList = result_all['friendsList'];
    var Info = result_all['info'];
    var groups = result_all['groups'];
    var likes = result_all['likes'];
    var num = result_all['num'];
    //赋值所有参数
    $('#input-index-type,#input-search-type,#input-chart-type').val(type0);
    $('#input-index-name,#input-search-name,#input-chart-name').val(userName0);
    $('#head-img').attr('src', pic1);
    $('.headName')[0].innerHTML = name1;
    console.log(typeof Info);
    var divInfo = $('.introHeadline')[0];
    if(typeof Info == 'string'){
        divInfo.innerHTML = Info;
    }else {
        console.log(Info);
        for(var item in Info){
            var divPerInfo = document.createElement('div');
            divPerInfo.className = 'div-per-info';
            divInfo.appendChild(divPerInfo);

            var spanKeyInfo = document.createElement('span');
            spanKeyInfo.className = 'span-key-info';
            spanKeyInfo.innerHTML = item + ' : ';
            divPerInfo.appendChild(spanKeyInfo);

            var spanValInfo = document.createElement('span');
            spanValInfo.className = 'span-val-info';
            spanValInfo.innerHTML = Info[item];
            divPerInfo.appendChild(spanValInfo);
        }
    }
    $('.span-friends-count')[0].innerHTML = '我的好友 ' + '共' + num + '位';
    $('.span-groups-count')[0].innerHTML = ' 我的群组 ' + '共' + groups + '位';
    $('.span-likes-count')[0].innerHTML = ' 我赞过的用户 ' + '共' + likes + '位';
    $('#userName').html(userName0);
    //给friendlist赋值
    var ul_friends = $('.ul_friends')[0];
    for (var i = 0; i < friendsList.length; i++) {
        var li_friends = document.createElement('li');
        ul_friends.appendChild(li_friends);
        var img_friends = document.createElement('img');
        img_friends.className = 'img_friends';
        img_friends.setAttribute('src', friendsList[i]);
        li_friends.appendChild(img_friends);
    }

    //给tweet赋值

    for (var i = 0; i < tweet.length; i++) {
        var post = document.createElement('div');
        post.className = 'rightPost';
        $('.rightInfo')[0].appendChild(post);

        //postDes
        var postDes = document.createElement('div');
        postDes.className = 'postDes';
        post.appendChild(postDes);

        var imgDes = document.createElement('img');
        imgDes.setAttribute('src', pic1);
        postDes.appendChild(imgDes);

        var postInfo = document.createElement('div');
        postInfo.className = 'postInfo';
        postDes.appendChild(postInfo);

        var postName = document.createElement('span');
        postName.className = 'postName';
        postName.innerHTML = tweet[i]['location'];
        postInfo.appendChild(postName);

        var postTime = document.createElement('span');
        postTime.className = 'postTime';
        postTime.innerHTML = tweet[i]['time'];
        postInfo.appendChild(postTime);

        var iconDes = document.createElement('i');
        iconDes.className = 'fa fa-globe fa-2x';
        postInfo.appendChild(iconDes);

        var brDes = document.createElement('br');
        postInfo.appendChild(brDes);

        var clearDes = document.createElement('div');
        clearDes.className = 'clear';
        postDes.appendChild(clearDes);


        //postText
        var postText = document.createElement('div');
        postText.className = 'postText';
        post.appendChild(postText);

        var pText = document.createElement('p');
        pText.innerHTML = tweet[i]['text'];
        postText.appendChild(pText);

        var pVideo = document.createElement('p');
        pVideo.innerHTML = tweet[i]['video'];
        postText.appendChild(pVideo );

        var pArialabel= document.createElement('p');
        pArialabel.innerHTML = tweet[i]['arialabel'];
        postText.appendChild(pArialabel);

        //postPic
        var postPic = document.createElement('div');
        postPic.className = 'postPic';
        post.appendChild(postPic);

        var postPicUl = document.createElement('ul');
        postPicUl.className = 'postPicUl';
        postPic.appendChild(postPicUl);
        console.log(tweet[i]['picture'].length);

        for(var j=0; j<tweet[i]['picture'].length; j++){
            var postPicLi = document.createElement('li');
            postPicUl.appendChild(postPicLi);

            var postPicImg = document.createElement('img');
            postPicImg.setAttribute('src',tweet[i]['picture'][j]);
            postPicLi.appendChild(postPicImg);
        }



    }

    var clearPost = document.createElement('div');
    clearPost.className = 'clear';
    $('.rightInfo')[0].appendChild(clearPost);


    //{% for item in tweet %}
    //<div class="rightPost">
    //    <div class="postDes">
    //    <img src={{ picture }}>
    //<div class="postInfo">
    //    <span class="postName">{{ item.location }}</span>
    //<span class="postTime">{{ item.time }}</span>
    //<i class="fa fa-globe fa-2x"></i>
    //    <br/>
    //
    //    </div>
    //    <div class="clear"></div>
    //    </div>
    //
    //    <div class="postText">
    //
    //    <p>{{ item.text }}<br/>
    //
    //</p>
    //{{ item.arialabel }}
    //{{ item.video }}
    //</div>
    //
    //
    //{% for i in item.picture %}
    //<div class="postPic">
    //    <ul class="postPicUl">
    //    <li>
    //    <img src={{ i}}>
    //</li>
    //</ul>
    //</div>
    //{% endfor %}
    //
    //
    //</div>
    //{% endfor %}


});