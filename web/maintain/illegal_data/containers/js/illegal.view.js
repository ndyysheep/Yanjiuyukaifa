var module="illegal";
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

        //editables element samples

        $('#firstname').editable({
            validate: function (value) {
                if ($.trim(value) == '') return 'This field is required';
            }
        });



        $('#capture_time').editable({

            Combodate:{
                format: 'yyyy-mm-dd HH:mm:ss',
                viewformat: 'yyyy-mm-dd HH:mm:ss',

            },
            datetimepicker: {
                minuteStep: 1,
                secondStep: 1,
                showSeconds: true,
                rtl : Metronic.isRTL(),
                todayBtn: 'linked',
                weekStart: 1
            }
        });



        var getUrlParam=function(name){
            //获取url中的参数
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
            var r = window.location.search.substr(1).match(reg);  //匹配目标参数
            if (r != null) return decodeURI(r[2]); return null; //返回参数值，如果是中文传递，就用decodeURI解决乱码，否则用unescape
        }
        $('#illegal_record_view_div #DeviceId').editable({
            url: ' ../../monitor_file_servlet_action?action=edit_record',
            type: 'text',
            pk:''+getUrlParam("id")+''
        });
        $('#illegal_record_view_div #car_code').editable({
            url: ' ../../monitor_file_servlet_action?action=edit_record',
            type: 'text',
            pk:''+getUrlParam("id")+''
        });

        $('#illegal_record_view_div #capture_time').editable({
            rtl : Metronic.isRTL(),
            url: ' ../../monitor_file_servlet_action?action=edit_record',
            type: 'text',
            pk:''+getUrlParam("id")+''
        });



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
        initMonitorRecordView();
    }
    /*-----------------------------------针对View页面的入口函数 结束-----------------------------*/

    var initMonitorRecordView=function(){
        var id=getUrlParam("id");
        console.log("运行");
        var data={};
        data.action="view_illegal_record";
        data.id=id;
        $.post("../../"+module+"_"+sub+"_servlet_action",data,function(json){
            console.log(JSON.stringify(json));
            if(json.result_code==0){
                var list=json.aaData;
                if(list!=undefined && list.length>0){
                    for(var i=0;i<list.length;i++){
                        var record=list[i];
                        $("#small_title").text("车辆序号:"+record.id);
                        $("#illegal_record_view_div  #car_code").text(record.car_code);
                        $("#illegal_record_view_div  #vehicle_type").text(record.vehicle_type);
                        $("#illegal_record_view_div  #illegal_status").text(explainIllegalCode(record.illegal_status));
                        $("#illegal_record_view_div  #capture_time").text(record.capture_time);
                        $("#illegal_record_view_div #speed").text(record.speed);
                        $("#illegal_record_view_div #lane_name").text(record.lane_name);
                        $(".tiles .name").text(record.id);
                        $(".tiles #image_container").attr("src",record.image_url);
                        $(".tiles #url_container").attr("href",record.image_url);

                    }
                }


            }
        })
    }

    //数据解析模块
    var explainIllegalCode = function(code) {
        if(code == 1)
        {
            return "违停";
        }
        else if(code == 2)
        {
            return "闯红灯";
        }
        else if(code == 3)
        {
            return "压双黄线";
        }
        else if(code == 4)
        {
            return "逆行";
        }
        else if(code == 0)
        {
            return "正常行驶";
        }
        else
        {
            return "数据错误";
        }


    }

    var explainIllegalCode_Contrary = function(code) {
        if(code === "违停")
        {
            return 1;
        }
        else if(code === "闯红灯")
        {
            return 2;
        }
        else if(code === "压双黄线")
        {
            return 3;
        }
        else if(code === "逆行")
        {
            return 4;
        }
        else if(code === "正常行驶")
        {
            return 0;
        }
        else
        {
            return 9;
        }


    }
    //数据解析模块--结束


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
