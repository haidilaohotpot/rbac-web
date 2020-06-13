window.app = {

    /* 开发环境 */
    apiServerUrl: "http://localhost:8088",                                   // 接口服务接口地址
    webServerUrl: "http://localhost:8080/",                              // 门户网站地址
    cookieDomain: "",                                                       // cookie 域

    /* 生产环境 */
    // apiServerUrl: "http://api.rbac.wonder4work.com",                      // 接口服务接口地址
    // webServerUrl: "http://web.rbac.wonder4work.com",                      // 门户网站地址
    // cookieDomain: ".rbac.wonder4work.com;",

    ctx: "",

    userIsLogin:false,
    userInfo:{},
    permissionTree:[],

    getCookie: function (cname) {
        var name = cname + "=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            // console.log(c)
            while (c.charAt(0) == ' ') c = c.substring(1);
            if (c.indexOf(name) != -1){
                return c.substring(name.length, c.length);
            }
        }
        return "";
    },


    setCookie: function(name, value) {
        var Days = 365;
        var exp = new Date();
        exp.setTime(exp.getTime() + Days*24*60*60*1000);
        var cookieContent = name + "="+ encodeURIComponent (value) + ";path=/;";
        if (this.cookieDomain != null && this.cookieDomain != undefined && this.cookieDomain != '') {
            cookieContent += "domain=" + this.cookieDomain;
        }
        document.cookie = cookieContent + cookieContent;
        // document.cookie = name + "="+ encodeURIComponent (value) + ";path=/;domain=" + cookieDomain;//expires=" + exp.toGMTString();
    },


    deleteCookie: function(name) {
        document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    },

    getUrlParam(paramName) {
        var reg = new RegExp("(^|&)" + paramName + "=([^&]*)(&|$)");    //构造一个含有目标参数的正则表达式对象
        var r = window.location.search.substr(1).match(reg);            //匹配目标参数
        if (r != null) return decodeURI(r[2]); return null;             //返回参数值
    },


    // 处理权限树数据结构 变为普通数组
    getPermissionArrData(permissionList){
        var menuArr = [];
        var spread  = function(menus) {
            for (var i=0; i < menus.length; i++ ) {
                var menu = menus[i]
                if (menu.children) {
                    spread(menu.children)
                    delete menu.children
                }
                menuArr.push(menu)
            }
        };
        spread(permissionList);
        return menuArr;
    },

    permissionListFormat(permisisonList){

        var list = [];
        permisisonList.forEach(function (item) {
            var data = {};
            data.id = item.permissionId;
            data.title = item.name;
            data.url = item.url;
            data.icon = item.icon;
            data.parentId = item.parentId;
            data.status = item.status;
            data.type = item.type;
            data.updateTime = item.updateTime;
            data.checked = item.checked;
            data.spread = true;
            list.push(data);
        });
        return list;
    },

    buildTree(lists,id,parentId) {
        var idList = {},
            treeList = [];
        for (var i = 0, len = lists.length; i < len; i++) {
            //生成一个以id为键的对象
            idList[lists[i][id]] = lists[i]
        }
        for (var j = 0, len1 = lists.length; j < len1; j++) {
            var aVal = lists[j];
            var aValParent = idList[aVal[parentId]];
            //如果aValParent存在；就说明当前的aVal是aValParent的孩子
            if (aValParent) {
                if ('children' in aValParent) {
                    aValParent.checked = false;
                    aValParent['children'].push(aVal)
                } else {
                    aValParent['children'] = [];
                    aValParent['children'].push(aVal)
                }
            } else {
                treeList.push(aVal)
            }
        }
        return treeList

    },


    login(){

        var username = document.getElementById("username").value;
        var password = document.getElementById("password").value;

        if (username == null || username == undefined || username == '') {
            alert("用户名不能为空");
            return;
        } else if (password == null || password == undefined || password == '') {
            alert("密码不能为空");
            return;
        } else if (password.length < 6) {
            alert("密码不能少于6位");
            return;
        }

        var userBO = {
            username: username,
            password: password
        };

        axios.defaults.withCredentials = true;
        axios.post(app.apiServerUrl+'/pass/login',userBO,{headers:{
                    token:"wonder4work"
                }}).then(function (response) {
                // console.log(response)
                if (response.data.status == 200){
                    alert("登录成功");
                    window.location.href = 'html/user/index.html';
                }else {
                    alert(response.data.msg);
                }});
    },


    logout(){
        axios.defaults.withCredentials = true;
        axios.post(app.apiServerUrl+'/pass/logout',null,{headers:{
                token:"wonder4work"
            }}).then(function (response) {
            // console.log(response)
            if (response.data.status == 200){
                alert("退出成功");
                window.location.href = '/rbac-web/login.html';
            }else {
                alert(response.data.msg);
            }});
    }

};
