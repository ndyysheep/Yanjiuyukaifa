var module="flow";
var sub="data";
var check = 0;

jQuery(document).ready(function() {
// initiate layout and plugins
    Metronic.init(); // init metronic core components
    Layout.init(); // init current layout
    Demo.init(); // init demo features
    FormEditable.init();
    Page.init();//页面初始化
});

var FormEditable = function () {

    $.mockjaxSettings.responseTime = 500;

    var log = function (settings, response) {
        var s = [],
            str;
        s.push(settings.type.toUpperCase() + ' url = "' + settings.url + '"');
        for (var a in settings.data) {
            if (settings.data[a] && typeof settings.data[a] === 'object') {
                str = [];
                for (var j in settings.data[a]) {
                    str.push(j + ': "' + settings.data[a][j] + '"');
                }
                str = '{ ' + str.join(', ') + ' }';
            } else {
                str = '"' + settings.data[a] + '"';
            }
            s.push(a + ' = ' + str);
        }
        s.push('RESPONSE: status = ' + response.status);

        if (response.responseText) {
            if ($.isArray(response.responseText)) {
                s.push('[');
                $.each(response.responseText, function (i, v) {
                    s.push('{value: ' + v.value + ', text: "' + v.text + '"}');
                });
                s.push(']');
            } else {
                s.push($.trim(response.responseText));
            }
        }
        s.push('--------------------------------------\n');
        $('#console').val(s.join('\n') + $('#console').val());
    }

    var initAjaxMock = function () {
        //ajax mocks

        $.mockjax({
            url: '/post',
            response: function (settings) {
                log(settings, this);
            }
        });

        $.mockjax({
            url: '/error',
            status: 400,
            statusText: 'Bad Request',
            response: function (settings) {
                this.responseText = 'Please input correct value';
                log(settings, this);
            }
        });

        $.mockjax({
            url: '/status',
            status: 500,
            response: function (settings) {
                this.responseText = 'Internal Server Error';
                log(settings, this);
            }
        });

        $.mockjax({
            url: '/groups',
            response: function (settings) {
                this.responseText = [{
                    value: 0,
                    text: 'Guest'
                }, {
                    value: 1,
                    text: 'Service'
                }, {
                    value: 2,
                    text: 'Customer'
                }, {
                    value: 3,
                    text: 'Operator'
                }, {
                    value: 4,
                    text: 'Support'
                }, {
                    value: 5,
                    text: 'Admin'
                }
                ];
                log(settings, this);
            }
        });

    }

    var initEditables = function () {

        //set editable mode based on URL parameter
        if (Metronic.getURLParameter('mode') == 'inline') {
            $.fn.editable.defaults.mode = 'inline';
            $('#inline').attr("checked", true);
            jQuery.uniform.update('#inline');
        } else {
            $('#inline').attr("checked", false);
            jQuery.uniform.update('#inline');
        }

        //global settings
        $.fn.editable.defaults.inputclass = 'form-control';
        $.fn.editable.defaults.url = '/post';






        var getUrlParam=function(name){
            //获取url中的参数
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
            var r = window.location.search.substr(1).match(reg);  //匹配目标参数
            if (r != null) return decodeURI(r[2]); return null; //返回参数值，如果是中文传递，就用decodeURI解决乱码，否则用unescape
        }





        var illegalStatus = [];
        $.each({
            "0":"正常行驶",
            "1":"违停",
            "2":"闯红灯",
            "3":"压双黄线",
            "4":"逆行",
            "9":"数据错误"

        }, function (k, v) {
            illegalStatus.push({
                id: k,
                text: v
            });
        });

        $('#illegal_status').editable({
            inputclass: 'form-control input-medium',
            source: illegalStatus
        });

        $('#address').editable({
            url: '/post',
            value: {
                city: "San Francisco",
                street: "Valencia",
                building: "#24"
            },
            validate: function (value) {
                if (value.city == '') return 'city is required!';
            },
            display: function (value) {
                if (!value) {
                    $(this).empty();
                    return;
                }
                var html = '<b>' + $('<div>').text(value.city).html() + '</b>, ' + $('<div>').text(value.street).html() + ' st., bld. ' + $('<div>').text(value.building).html();
                $(this).html(html);
            }
        });
    }

    return {
        //main function to initiate the module
        init: function () {

            // inii ajax simulation
            initAjaxMock();

            // init editable elements
            initEditables();

            // init editable toggler
            $('#enable').click(function () {
                $('#user .editable').editable('toggleDisabled');
            });

            // init
            $('#inline').on('change', function (e) {
                if ($(this).is(':checked')) {
                    window.location.href = 'form_editable.html?mode=inline';
                } else {
                    window.location.href = 'form_editable.html';
                }
            });

            // handle editable elements on hidden event fired
            $('#user .editable').on('hidden', function (e, reason) {
                if (reason === 'save' || reason === 'nochange') {
                    var $next = $(this).closest('tr').next().find('.editable');
                    if ($('#autoopen').is(':checked')) {
                        setTimeout(function () {
                            $next.editable('show');
                        }, 300);
                    } else {
                        $next.focus();
                    }
                }
            });


        }

    };

}();

var Page = function(){
    /*----------------------------------------入口函数  开始----------------------------------------*/
    var initPageControl=function() {
        initMonitorView();
    };
    /*----------------------------------------入口函数  结束----------------------------------------*/

    /*-----------------------------------针对View页面的入口函数 开始-----------------------------*/
    var initMonitorView = function() {
        initFlowRecordView();
    }
    /*-----------------------------------针对View页面的入口函数 结束-----------------------------*/

    var initFlowRecordView=function(){
        var id=getUrlParam("id");
        console.log("运行");
        var data={};
        data.action="get_flow_record";
        data.id=id;
        $.post("../../"+module+"_"+sub+"_servlet_action",data,function(json){
            console.log(JSON.stringify(json));
            if(json.result_code==0){
                var list=json.aaData;
                if(list!=undefined && list.length>0){
                    for(var i=0;i<list.length;i++){
                        var record=list[i];
                        $("#small_title").text("记录序号:"+record.id);
                        $("#record_view_div #lane_name").text(record.lane_name);
                        $("#record_view_div  #total_num").text(record.total_num);
                        $("#record_view_div  #start_time").text(record.start_time);
                        $("#record_view_div  #end_time").text(record.end_time);
                        $("#record_view_div  #speed_limit").text(record.speed_limit);
                        $("#record_view_div  #speed_limit_for_others").text(record.speed_limit_for_others);
                        $(".tiles .name").text(record.id);

                    }
                }


            }
        })
    }


    var getUrlParam=function(name){
        //获取url中的参数
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
        var r = window.location.search.substr(1).match(reg);  //匹配目标参数
        if (r != null) return decodeURI(r[2]); return null; //返回参数值，如果是中文传递，就用decodeURI解决乱码，否则用unescape
    }
    //Page return 开始
    return {
        init: function() {
            initPageControl();
        }
    }
}();
