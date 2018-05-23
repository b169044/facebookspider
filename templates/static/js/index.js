 window.onload = function() {
            Page.arr = Page.pushArr();
            Page.setClickPageNum();
            Page.allContent("null");
            document.getElementById("init").click();
        }
 
        var Page = {
            defaultPerPageNum: 10,
            arr: null,
            removedBlankStr: function(str) {
                var regex = /^\s*|\s*$/g;
                return str.replace(regex, "");
            },
            setTotalPageNums: function() {
                var pp = Number(Page.perPageNum('t1'));
                var pnums = Page.arr.length / pp > parseInt(Page.arr.length / pp) ? parseInt(Page.arr.length / pp) + 1 : Page.arr.length / pp;
                var div = document.getElementById('pagenum');
                div.innerHTML = "";
                for (var i = 0; i < pnums; i++) {
                    var a = document.createElement('a');
                    a.href = "#";
                    a.innerHTML = i + 1;
                    a.setAttribute('class', 'off');
                    div.appendChild(a);
                    div.innerHTML += "&nbsp;";
                }
                Page.setClickPageNum();
            },
            perPageNum: function(PerPageNum) {
                var pv = document.getElementById(PerPageNum).value;
                pv = Page.removedBlankStr(pv);
                if ("" == pv || isNaN(pv) || (new RegExp(/^[-]*[0]+.*?$/g).test(pv)) || pv < 0) {
                    pv = Page.defaultPerPageNum;
                    document.getElementById(PerPageNum).value = pv;
                }
                document.getElementById('p1').innerHTML = pv;
                return pv;
            },
            getClickPageNum: function(diva) {
                return parseFloat(diva.innerHTML);
            },
            setClickPageNum: function() {
                var divx = document.getElementById('pagenum');
                var a = divx.children;
                var len = a.length;
                for (var i = 0; i < len; i++) {
                    a[i].onclick = function() {
                        this.className = "on";
                        Page.allContent(this);
                    };
                }
            },
            pushArr: function() {
                var arr = new Array();
                var ul = document.getElementById('ul1');
                var len = ul.children.length;
                for (var i = 0; i < len; i++) {
                    arr.push(ul.children[i]);
                }
                return arr;
            },
            allContent: function(divb) {
                var ul = document.getElementById('ul1');
                ul.innerHTML = "";
                var pp = parseFloat(this.perPageNum('t1'));
                if ("null" == divb) {
                    divb = document.getElementById('pagenum').children[0];
                    divb.className = "on";
                }
                var pg = this.getClickPageNum(divb); // 1 2 3
                var ppj = pp * (pg - 1); // 0 4 8
                var end = ppj + pp; // 4 8 12
                var arr = this.arr;
                var pnums = arr.length / pp > parseInt(arr.length / pp) ? parseInt(arr.length / pp) + 1 : arr.length / pp;
                for (var i = ppj; i < end; i++) {
                    var a = arr[i];
                    if (null != a) {
                        ul.appendChild(a);
                    }
                }
            },
            doAction: function() {
                Page.perPageNum('t1');
                Page.setTotalPageNums();
                Page.allContent("null");
            }
        };