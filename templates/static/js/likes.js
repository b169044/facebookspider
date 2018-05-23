/**
 * Created by gilli on 2018/4/25.
 */
$(document).ready(function () {

    //获取后台传的所有参数
    console.log(result_all);
    userName0 = result_all['name'];
    var url1 = result_all['url'];
    type0 = result_all['type'];
    var pic1 = result_all['picture'];
    var name1 = result_all['name1'];


    //赋值所有参数
    $('#input-index-type,#input-search-type,#input-chart-type').val(type0);
    $('#input-index-name,#input-search-name,#input-chart-name').val(userName0);
    $('#userName').html(userName0);
    $('#head-img').attr('src', pic1);
    $('.headName')[0].innerHTML = name1 + '赞过的用户';
    //设置跳转导航的ID
    var nav_id = 1;
    //likes有多种子类型
    for(var item in result_all['likes']){
        (function () {
            //console.log(result_all['likes'][item]);
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

            //list
            for(var i=0;i<result_all['likes'][item].length;i++){
                (function () {
                    //创建子标签
                    var newDiv = document.createElement('div');
                    li_friendsShow.appendChild(newDiv);
                    newDiv.className = 'edge';

                    var newDiv2 = document.createElement('div');
                    newDiv.appendChild(newDiv2);
                    newDiv2.className = 'desktop';

                    //label-pic
                    var labelpic = document.createElement('div');
                    newDiv2.appendChild(labelpic);
                    labelpic.className = 'label-pic';

                    var aPic =document.createElement('a');
                    labelpic.appendChild(aPic);

                    var imgPic =document.createElement('img');
                    imgPic.setAttribute('src',result_all['likes'][item][i]['picture']);
                    aPic.appendChild(imgPic);

                    //label-content
                    var labelContent= document.createElement('div');
                    newDiv2.appendChild(labelContent);
                    labelContent.className = 'label-content';

                    var pLabelName= document.createElement('p');
                    pLabelName.className = 'label-name';
                    pLabelName.innerHTML = result_all['likes'][item][i]['name'];
                    labelContent.appendChild(pLabelName);

                    var pLabelType= document.createElement('p');
                    pLabelType.className = 'label-type';
                    pLabelType.innerHTML = result_all['likes'][item][i]['abstract'];
                    labelContent.appendChild(pLabelType);

                    var btnLikes =  document.createElement('button');
                    btnLikes.className = 'button button-primary button-circle button-smal label-btn-zan';
                    btnLikes.innerHTML = '赞';
                    labelContent.appendChild(btnLikes);

                })()
            }
            nav_id++;

        })()
    }

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