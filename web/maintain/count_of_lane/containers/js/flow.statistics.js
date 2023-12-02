var module="flow";
var sub="data";
var check = 0;
document.domain="localhost";
/*================================================================================*/
jQuery(document).ready(function() {
    // initiate layout and plugins
    Metronic.init(); // init metronic core components
    Layout.init(); // init current layout
    Demo.init(); // init demo features
    ComponentsPickers.init();//选择时间
    Page.init();//页面初始化

});

var Page = function() {
    /*----------------------------------------入口函数  开始----------------------------------------*/
    var initPageControl=function(){
        pageId = $("#page_id").val();

        if(pageId==="flow_data_statistics"){
            $(".sub-menu #flow_data_statistics").addClass("active");
            //打印页面,进程图表初始化
            initFlowStatistics();
            //设置页面监听
            initFlowStatisticsControl();

        }
    };
    /*----------------------------------------入口函数  结束----------------------------------------*/

    var chartData=[];
    var chartDataExtra = [];
    var chartDataFlowType = [];
    /*----------------------------------------业务函数  开始----------------------------------------*/
    /*------------------------------针对各个页面的入口  开始------------------------------*/


    /*------------------------------针对各个页面的入口 结束------------------------------*/


    //统计初始化模块-----开始
    var initFlowStatistics = function(time_from,time_to){

        $.ajaxSettings.async=false;
        initFlowRecordForStatistics(time_from,time_to);
        $.ajaxSettings.async=true;
        initChartSets();
        initChartSetsExtra();

    }
    //统计初始化模块-----结束

    //页面控制模块-----开始
    var initFlowStatisticsControl = function(){
        onPageListenerForStatisitcs();
        $("#time_submit_button").click(function(){onTimeLimitSubmit()})
    }
    //页面控制模块-----结束

    //页面监听操作函数-----开始
    var onPageListenerForStatisitcs = function(){

        //自定义变量,用于获取元素并改变元素的样式
        var barContainer = document.getElementById("warning");
        var beginContainer = document.getElementById("time_from");
        var endContainer = document.getElementById("time_to");

        //自定义变量,用于获取元素并监听
        var beginListener = undefined;
        var endListener =  undefined;



        //监听开始年月日
        $("#time_from").change(function(){
            beginListener=$("#time_from").val();
            console.log(beginListener);
            if(endListener!==undefined)
            {
                if(beginListener>endListener)
                {
                    barContainer.style.display="block";
                    beginContainer.style.borderColor="#a94442";
                }
                else
                {
                    barContainer.style.display="none";
                    beginContainer.style.borderColor="#d6e9c6";
                }
            }
        });

        //监听结束年月日
        $("#time_to").change(function(){
            endListener=($("#time_to").val());
            console.log(beginListener);
            console.log(endListener);
            console.log(beginListener>endListener);
            if(beginListener!==undefined)
            {
                if(beginListener>endListener)
                {
                    barContainer.style.display="block";
                    endContainer.style.borderColor="#a94442";
                }
                else
                {
                    barContainer.style.display="none";
                    endContainer.style.borderColor="#d6e9c6";

                }
            }
        });

    }

    var onTimeLimitSubmit = function(){

        var forTimeCheck=[$("#time_from_minute").val(),$("#time_to_minute").val()];

        for(var i=0;i<forTimeCheck.length;i++)
        {
            if(parseInt(forTimeCheck[i])<10)
            {
                forTimeCheck[i]="0"+forTimeCheck[i];
            }
        }

        var time_from = $("#time_from").val();
        var time_to = $("#time_to").val();

        if(time_from !== "")
        {
            time_from+=" "+forTimeCheck[0];
        }

        if(time_to !== "")
        {
            time_to+=" "+forTimeCheck[1];
        }


        //自定义变量,用于获取元素并改变元素的样式
        var barContainer = document.getElementById("warning");
        var beginMinuteContainer = document.getElementById("time_from_minute");
        var endMinuteContainer = document.getElementById("time_to_minute");

        if(time_from>time_to||time_from===""||time_to==="")
        {
            barContainer.style.display="block";
            beginMinuteContainer.style.borderColor="#a94442";
            endMinuteContainer.style.borderColor="#a94442";
        }
        else
        {
            console.log(time_from);
            barContainer.style.display="none";
            beginMinuteContainer.style.borderColor="#d6e9c6";
            endMinuteContainer.style.borderColor="#d6e9c6";
            initFlowStatistics(time_from,time_to);
        }


    }
    //页面监听操作函数-----结束

    //图表信息交互模块-----开始
    var initFlowRecordForStatistics =function(time_from,time_to){
        var url = "../../flow_data_servlet_action";
        var data={};
        data.action="flow_statistics";
        if(time_from!=undefined&&time_to!=undefined)
        {
            data.time_from = time_from;
            data.time_to=time_to;
        }

        $.post(url,data,function(json){
            if(json.result_code==0){
                console.log(JSON.stringify(json));

                var list = json.hour_aaData;
                if(list!==undefined&&list.length>0){
                    changeResultDataToChartForFlowSum(list);
                }
                list = json.aaData;
                if(list!==undefined&&list.length>0){
                    changeToChartForFlowNum(list);
                }



            }else{
                alert("与后端交互错误!"+json.result_Msg);
            }

        });


    }
    //图表信息交互模块-----结束

    //图表的初始化函数-----开始
    var initChartSets = function(){

        var chart = AmCharts.makeChart("chart_1", {
            "type": "serial",
            "theme": "light",
            "pathToImages": Metronic.getGlobalPluginsPath() + "amcharts/amcharts/images/",
            "autoMargins": false,
            "marginLeft": 30,
            "marginRight": 8,
            "marginTop": 10,
            "marginBottom": 26,

            "fontFamily": 'Open Sans',
            "color":    '#888',

            "dataProvider": chartData,
            "valueAxes": [{
                "axisAlpha": 0,
                "position": "left"
            }],
            "startDuration": 1,
            "graphs": [{
                "alphaField": "alpha",
                "balloonText": "<span style='font-size:13px;'>[[title]] in [[category]]:<b>[[value]]</b> [[additional]]</span>",
                "dashLengthField": "dashLengthColumn",
                "fillAlphas": 1,
                "type": "column",
                "title":"sum",
                "valueField": "sum"
            }, {
                "balloonText": "<span style='font-size:13px;'>[[title]] in [[category]]:<b>[[value]]</b> [[additional]]</span>",
                "bullet": "round",
                "dashLengthField": "dashLengthLine",
                "lineThickness": 3,
                "bulletSize": 7,
                "bulletBorderAlpha": 1,
                "bulletColor": "#FFFFFF",
                "useLineColorForBulletBorder": true,
                "bulletBorderThickness": 3,
                "fillAlphas": 0,
                "lineAlpha": 1,
                "title":"sum",
                "valueField": "sum"
            }],
            "categoryField": "lane_name",
            "categoryAxis": {
                "gridPosition": "start",
                "axisAlpha": 0,
                "tickLength": 0
            }
        });

        $('#chart_1').closest('.portlet').find('.fullscreen').click(function() {
            chart.invalidateSize();
        });

    }

    var initChartSetsExtra = function(){

        var chart = AmCharts.makeChart("chart_2", {
            "type": "serial",
            "theme": "light",
            "pathToImages": Metronic.getGlobalPluginsPath() + "amcharts/amcharts/images/",
            "autoMargins": false,
            "marginLeft": 30,
            "marginRight": 8,
            "marginTop": 10,
            "marginBottom": 26,

            "fontFamily": 'Open Sans',
            "color":    '#888',

            "dataProvider": chartDataExtra,
            "valueAxes": [{
                "axisAlpha": 0,
                "position": "left"
            }],
            "startDuration": 1,
            "graphs": [{
                "alphaField": "alpha",
                "balloonText": "<span style='font-size:13px;'>[[title]] in [[category]]:<b>[[value]]</b> [[additional]]</span>",
                "dashLengthField": "dashLengthColumn",
                "fillAlphas": 1,
                "title": "num",
                "type": "column",
                "valueField": "num"
            }, {
                "balloonText": "<span style='font-size:13px;'>[[title]] in [[category]]:<b>[[value]]</b> [[additional]]</span>",
                "bullet": "round",
                "dashLengthField": "dashLengthLine",
                "lineThickness": 3,
                "bulletSize": 7,
                "bulletBorderAlpha": 1,
                "bulletColor": "#FFFFFF",
                "useLineColorForBulletBorder": true,
                "bulletBorderThickness": 3,
                "fillAlphas": 0,
                "lineAlpha": 1,
                "title": "num",
                "valueField": "num"
            }],
            "categoryField": "lane_name",
            "categoryAxis": {
                "gridPosition": "start",
                "axisAlpha": 0,
                "tickLength": 0
            }
        });

        $('#chart_2').closest('.portlet').find('.fullscreen').click(function() {
            chart.invalidateSize();
        });

    }

    var initChartSample7 = function() {
        var chart = AmCharts.makeChart("chart_7", {
            "type": "pie",
            "theme": "light",

            "fontFamily": 'Open Sans',

            "color":    '#888',

            "dataProvider":chartDataFlowType,
            "valueField": "num",
            "titleField": "flow_type",
            "outlineAlpha": 0.4,
            "depth3D": 15,
            "balloonText": "[[title]]<br><span style='font-size:14px'><b>[[value]]</b> ([[percents]]%)</span>",
            "angle": 30,
            "exportConfig": {
                menuItems: [{
                    icon: '/lib/3/images/export.png',
                    format: 'png'
                }]
            }
        });

        jQuery('.chart_7_chart_input').off().on('input change', function() {
            var property = jQuery(this).data('property');
            var target = chart;
            var value = Number(this.value);
            chart.startDuration = 0;

            if (property == 'innerRadius') {
                value += "%";
            }

            target[property] = value;
            chart.validateNow();
        });

        $('#chart_7').closest('.portlet').find('.fullscreen').click(function() {
            chart.invalidateSize();
        });
    }
    //图表的初始化函数-----结束

    //图表处理函数-----开始
    var changeResultDataToChartForFlowSum =function(list){

        chartData = [];

        for(var i=0;i<list.length;i++)
        {
            var json = {"lane_name":list[i].lane_name,"sum":list[i].num};
            chartData.push(json);
        }
        console.log(chartData);
    }

    var  changeToChartForFlowNum =function(list){

        chartDataExtra = [];

        for(var i=0;i<list.length;i++)
        {
            var json = {"lane_name":list[i].lane_name,"num":list[i].num};
            chartDataExtra.push(json);
        }
        console.log(chartDataExtra);
    }

    //图标处理函数-----结束


    //Page return 开始
    return {
        init: function() {
            initPageControl();
        }
    }
}();//Page