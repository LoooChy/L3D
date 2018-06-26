
var LQY = function () {

}

LQY.prototype = {
    //加载部分html
    loadPartHtml: function loadPartHtml(htmlUrl, jsUrl, target, flag, fn) {
        $.ajaxSetup({
            cache: true
        });
        target.load(htmlUrl, function (e) {
            if (flag) {
                $.ajax({
                    url: jsUrl,
                    type: 'GET',
                    success: function success() {
                        fn();
                    },
                    dataType: 'script'
                });
            } else {
                fn();
            }
        });
    },
    //添加class
    addClass: function addClass(obj, cls) {
        var obj_class = obj.className,
            blank = obj_class != '' ? ' ' : '';
        added = obj_class + blank + cls;
        obj.className = added;
    },
    //删除class
    removeClass: function removeClass(obj, cls) {
        var obj_class = ' ' + obj.className + ' ';
        obj_class = obj_class.replace(/(\s+)/gi, ' '), removed = obj_class.replace(' ' + cls + ' ', ' ');
        removed = removed.replace(/(^\s+)|(\s+$)/g, '');
        obj.className = removed;
    },
    //是否有某个class
    hasClass: function hasClass(obj, cls) {
        var obj_class = obj.className,
            obj_class_lst = obj_class.split(/\s+/);
        x = 0;
        for (x in obj_class_lst) {
            if (obj_class_lst[x] == cls) {
                return true;
            }
        }
        return false;
    },
    //简易版深拷贝
    deepCopy: function deepCopy(obj) {
        return JSON.parse(JSON.stringify(obj));
    },
    //删除数组中的某个元素
    deleteArr: function deleteArr(arr, item) {
        for (var i = arr.length; i >= 0; i--) {
            if (arr[i] === item) {
                arr.splice(i, 1);
            }
        }
        return arr;
    },
    //数组去重
    arrUnique: function arrUnique(arr) {
        var a = [],
            b = {};
        for (var i = 0; i < arr.length; i++) {
            if (!b[arr[i]]) {
                a.push(arr[i]);
                b[arr[i]] = 1;
            }
        }
        return a;
    },
    //数组排序,flag==true升序,flag==false降序
    arrSort: function (arr, flag) {
        var compare = function (x, y) {
            if (x < y) {
                if (flag) {
                    return -1;
                } else {
                    return 1;
                }

            } else if (x > y) {
                if (flag) {
                    return 1;
                } else {
                    return -1;
                }
            } else {
                return 0;
            }
        }
        return arr.sort(compare)
    },
    //对象数组按照value值排序,flag==true升序,flag==false降序
    objArrSort: function (arr, obj, flag) {
        var compare = function (prop) {
            return function (obj1, obj2) {
                var val1 = obj1[prop];
                var val2 = obj2[prop];
                if (!isNaN(Number(val1)) && !isNaN(Number(val2))) {
                    val1 = Number(val1);
                    val2 = Number(val2);
                }
                if (val1 < val2) {
                    if (flag) {
                        return -1;
                    } else {
                        return 1;
                    }
                } else if (val1 > val2) {
                    if (flag) {
                        return 1;
                    } else {
                        return -1;
                    }
                } else {
                    return 0;
                }
            }
        }
        return arr.sort(compare(obj))
    },
    //DOM选择器
    select: function (obj) {
        return document.querySelector(obj)
    },
    selectAll: function (obj) {
        return document.querySelectorAll(obj)
    },

    //递归，不完全，没写完，可以按照需求更改(原始数据，需要递归的子集，需要查找的key，空数组)
    recursion: function (data, children, name, arr) {
        for (var i = 0; i < data.length; i++) {
            for (var key in data[i]) {
                if (key == name) {
                    arr.push(data[i][key])
                }
            }
        }
    },
    //正则(值，正则表达式)
    regexp: function (val, regexp) {
        return regexp.test(val);
    },

    //是否存在某个值(值，被检测的内容)
    isExist: function (val, item) {
        return val.indexOf(item) != -1;
    },
    //严格判断类型
    typeof: function (obj) {
        var type = Object.prototype.toString.call(obj);
        var a = /]/;
        var b = /\[/
        var c = /object /
        type = type.replace(a, '')
        type = type.replace(b, '')
        type = type.replace(c, '')
        return type
    },
    //css相关，不常用，知道原理就行
    matirix: function (obj) {
        var obj = {
            type: "translate",
            x: 0,
            y: 0,
            deg: 0
        }
        var origin = ''
        switch (obj.type) {
            case "translate":
                origin = 'matrix(' + 1 + ',' + 0 + ',' + 0 + ',' + 1 + ',' + 0 + ',' + 0 + ',' + !!obj.x ? obj.x : 0 + ',' + !!obj.y ? obj.y : 0 + ')';
                break;
            case "scale":
                origin = 'matrix(' + !!obj.x ? obj.x : 0 + ',' + 0 + ',' + 0 + ',' + !!obj.x ? obj.x : 0 + ',' + 0 + ',' + 0 + ',' + 0 + ',' + 0 + ')';
                break;
            case "rotate":
                origin = 'matrix(' + !!obj.deg ? Math.cos(obj.deg) : 0 + ',' + !obj.deg ? Math.sin(obj.deg) : 0 + ',' + !obj.deg ? -Math.sin(obj.deg) : 0 + ',' + !obj.deg ? Math.cos(obj.deg) : 0 + ',' + 0 + ',' + 0 + ')';
                break;
            default:
                origin = 'matrix(' + 1 + ',' + 0 + ',' + 0 + ',' + 1 + ',' + 0 + ',' + 0 + ',' + 0 + ',' + 0 + ')'
        }
    },
    


}

let L = new LQY()
export default L
