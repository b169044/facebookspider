/**
 * Created by gilli on 2018/4/26.
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
    $('.headName')[0].innerHTML = name1 +'的群组';

    var ulGroups = $('.ul-zan')[0];
    //list
    console.log(result_all['groups'].length);
    for(var i=0; i<result_all['groups'].length;i++){
        (function () {
            //创建子标签
            var liGroups = document.createElement('li');
            liGroups.className = 'li-zan';
            ulGroups.appendChild(liGroups);

            var newDiv = document.createElement('div');
            liGroups.appendChild(newDiv);
            newDiv.className = 'edge';

            var newDiv2 = document.createElement('div');
            newDiv.appendChild(newDiv2);
            newDiv2.className = 'desktop';

            //label-pic
            var labelpic = document.createElement('div');
            newDiv2.appendChild(labelpic);
            labelpic.className = 'label-pic';


            var labelpicPart1 = document.createElement('div');
            labelpic.appendChild(labelpicPart1);
            labelpicPart1.className = 'label-pic-part';


            var labelpicPart2 = document.createElement('div');
            labelpic.appendChild(labelpicPart2);
            labelpicPart2.className = 'label-pic-part';


            var labelpicPart3 = document.createElement('div');
            labelpic.appendChild(labelpicPart3);
            labelpicPart3.className = 'label-pic-part';


            var labelpicPart4 = document.createElement('div');
            labelpic.appendChild(labelpicPart4);
            labelpicPart4.className = 'label-pic-part';


            var imgPic =document.createElement('img');
            imgPic.setAttribute('src','static/images/defaultPhoto.jpg');
            labelpicPart1.appendChild(imgPic);

            var imgPic2 =document.createElement('img');
            imgPic2.setAttribute('src','static/images/defaultPhoto.jpg');
            labelpicPart2.appendChild(imgPic2);

            var imgPic3 =document.createElement('img');
            imgPic3.setAttribute('src','static/images/defaultPhoto.jpg');
            labelpicPart3.appendChild(imgPic3);

            var imgPic4 =document.createElement('img');
            imgPic4.setAttribute('src','static/images/defaultPhoto.jpg');
            labelpicPart4.appendChild(imgPic4);



            //label-content
            var labelContent= document.createElement('div');
            newDiv2.appendChild(labelContent);
            labelContent.className = 'label-content';

            var pLabelName= document.createElement('p');
            pLabelName.className = 'label-name';
            pLabelName.innerHTML = result_all['groups'][i]['name'];
            labelContent.appendChild(pLabelName);

            var pLabelCount =  document.createElement('p');
            pLabelCount.className = 'label-group-count';
            pLabelCount.innerHTML = result_all['groups'][i]['members'];
            labelContent.appendChild(pLabelCount);

            var pLabelDes =  document.createElement('p');
            pLabelDes.className = 'label-group-des';
            pLabelDes.innerHTML = result_all['groups'][i]['abstract'];
            labelContent.appendChild(pLabelDes);
        })()
    }

});