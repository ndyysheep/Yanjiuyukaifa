var module="analysis";
var sub="data";
var check = 0;
document.domain="localhost";

jQuery(document).ready(function() {
    // initiate layout and plugins
    Metronic.init(); // init metronic core components
    Layout.init(); // init current layout
    Demo.init(); // init demo features
    ComponentsPickers.init();//选择时间
    Page.init();//页面初始化

});
/* ================================================================================ */

//关于页面的控件生成等操作都放在Page里
var Page = function() {
    /*----------------------------------------入口函数  开始----------------------------------------*/
    var initPageControl=function(){
        pageId = $("#page_id").val();
        if(pageId==="daily_report"){
            $(".sub-menu #daily_report").addClass("active");
            //设备列表页面
            $.ajaxSettings.async=false;
            initAnalysisList();
            $.ajaxSettings.async=true;

            initAnalysisStatistics();
        }

        if(pageId==="daily_statistics_print"){
            //打印页面
            initDailyAnalysisPrint();
        }
        if(pageId==="analysis_print_word"){
            //Word打印页面
            initMonitorPrint_Word();
        }

    };
    /*----------------------------------------入口函数  结束----------------------------------------*/
    //全局变量数组
    var resultList=[];
    var illegalInput = [];

    //统计用--开始
    //用于统计违法类型
    var chartDataIllegalType=[];
    //统计违法总数
    var chartDataIllegalTotal = [];
    //统计近7天各个路段违法情况
    var chartDataExtra = [];
    //储存路段信息
    var laneStore =[];
    //统计用--结束
    /*----------------------------------------业务函数  开始----------------------------------------*/
    /*------------------------------针对各个页面的入口  开始------------------------------*/
    var initAnalysisList=function(){

        initDailyDate();
        initAnalysisListControlEvent();
        initAnalysisRecordList();
    }

    var initDailyAnalysisPrint = function(){
        initDailyAnalysisRecordForPrint();
    }

    var initMonitorPrint_Word = function(){
        initAnalysisRecordForPrint_Word();
    }
    //统计初始化模块-----开始
    var initAnalysisStatistics = function(time_from,time_to){

        $.ajaxSettings.async=false;
        initAnalysisRecordForStatistics(time_from,time_to);
        $.ajaxSettings.async=true;
        initChartSets();
        initChartSetsForIllegalTotal();
        InitChart3ForALL();


    }
    //统计初始化模块-----结束



    /*------------------------------针对各个页面的入口 结束------------------------------*/

    //事件处理初始化--开始
    var initAnalysisListControlEvent=function(){

        onPageAttachment($("#date_selector"));
        //导出信息
        $('#export_button').click(function() {myExportAPI();});
        //打印信息
        $('#print_button').click(function() {myPrintAPI()});
        $('#print_button_for_word').click(function() {myPrintAPI_Word()});

    }


    //事件处理初始化--结束

    //数据获取初始化--开始
    var initAnalysisRecordList=function(){
        //使用Datatable的数据表,统计总数据
        getAnalysisRecordDatatable();
    }
    var initDailyDate=function(){
        var url = "../../analysis_data_servlet_action"
        var data = {};
        var currentDate=new Date().toISOString().slice(0, 10);
        var container = $("#date_selector");
        data.action = "get_daily_date"
        $.post(url,data,function(json){
            if(json.result_code===0)
            {
                var list = json.aaData;
                var html = "<option>"+currentDate+"</option>";
                for(var i = 0 ;i<list.length;i++)
                {
                    if(list[i].date!==currentDate)
                    html +="<option>"+list[i].date+"</option>"
                }

                container.html(html);
            }
        })
    }
    var initDailyAnalysisRecordForPrint=function(){
        getDailyAnalysisRecordPrint();
    }

    var initAnalysisRecordForPrint_Word=function(){
        getAnalysisRecordPrint_Word();
    }

    var initAnalysisRecordForStatistics =function(time_from,time_to){
        console.log(resultList);
        changeResultDataToChartForIllegalTypes(resultList);
        changeResultDataToChartForIllegalTotal(resultList);
        var url = "../../analysis_data_servlet_action";
        var data={};
        var date = undefined;
        data.action="daily_report_all";
        if(time_from!==undefined&&time_to!==undefined)
        {
            data.time_from = time_from;
            data.time_to = time_to;

            console.log(time_from);
             date = time_from.toString().slice(0,10);
        }

        $.post(url,data,function(json){
            if(json.result_code==0){
                console.log(JSON.stringify(json));

                var list =json.aaData;
                if(list!==undefined&&list.length>0){
                    changeResultDataToChartForAll(list,date);
                }

            }else{
                alert("与后端交互错误!"+json.result_Msg);
            }

        });


    }

    //数据获取初始化--结束

    var onPageAttachment = function(element)
    {
        element.change(function(event){
            var date = element.val();
            var time_from = date + " "+"00:00:00"
            var time_to = date + " "+"23:59:59";
            $.ajaxSettings.async=false;
            getAnalysisRecordDatatable(date);
            $.ajaxSettings.async=true;
            initAnalysisStatistics(time_from,time_to)


        })
    }
    //数据获取函数--开始
    var getAnalysisRecordDatatable =function(date){

        var servletRequest ="../../analysis_data_servlet_action";
        resultList=[];
        var data={};
        data.action="daily_report";
        if(date==undefined)
        {
            var currentDate = new Date().toISOString().slice(0, 10);
            data.time_from = currentDate + " "+"00:00:00"
            data.time_to = currentDate + " "+"23:59:59";
        }
        else
        {
            data.time_from = date + " "+"00:00:00"
            data.time_to = date + " "+"23:59:59";
        }

        $('.datatable').DataTable().destroy();

        $('.datatable').dataTable( {

            "paging":true,
            "searching":false,
            "oLanguage": {
                "aria": {
                    "sortAscending": ": activate to sort column ascending",
                    "sortDescending": ": activate to sort column descending"
                },
                "sProcessing":   "处理中...",
                "sLengthMenu":   "_MENU_ 记录/页",
                "sZeroRecords":  "没有匹配的记录",
                "sInfo":         "显示第 _START_ 至 _END_ 项记录，共 _TOTAL_ 项",
                "sInfoEmpty":    "显示第 0 至 0 项记录，共 0 项",
                "sInfoFiltered": "(由 _MAX_ 项记录过滤)",
                "sInfoPostFix":  "",
                "sSearch":       "过滤:",
                "oPaginate": {
                    "sFirst":    "首页",
                    "sPrevious": "上页",
                    "sNext":     "下页",
                    "sLast":     "末页"
                }
            },
            "aoColumns": [{
                "mRender": function(data, type, full) {
                    sReturn = '<div>'+full.lane_name+'</div>';
                    return sReturn;
                },"orderable": true
            },{
                "mRender": function(data, type, full) {
                    sReturn = '<div>'+full.total+'</div>';
                    return sReturn;
                },"orderable": true
            },{
                "mRender": function(data, type, full) {

                    sReturn = '<div>'+full.status0+'</div>';
                    return sReturn;
                },"orderable":true
            },{
                "mRender": function(data, type, full) {

                    sReturn = '<div>'+full.status1+'</div>';
                    return sReturn;
                },"orderable":true
            },{
                "mRender": function(data, type, full) {

                    sReturn = '<div>'+full.status2+'</div>';
                    return sReturn;
                },"orderable":true
            },{
                "mRender": function(data, type, full) {

                    sReturn = '<div>'+full.status3+'</div>';
                    return sReturn;
                },"orderable":true
            },{
                "mRender": function(data, type, full) {

                    sReturn = '<div>'+full.status4+'</div>';
                    return sReturn;
                },"orderable":true
            }],

            "aLengthMenu": [[5,10,15,20,25,40,50],[5,10,15,20,25,40,50]],
            "fnDrawCallback": function(){$(".checkboxes").uniform();$(".group-checkable").uniform();},
            //"sAjaxSource": "get_record.jsp"
            "ajax": {
                "url": servletRequest,
                "type": "POST",
                "data":data,
                "dataSrc": function(json) {
                    console.log(json.daily_aaData);
                    resultList = json.daily_aaData;

                    for(var i = 0;i<resultList.length ;i++)
                    {
                        var total = 0;
                        total += resultList[i].status0+resultList[i].status1+resultList[i].status2
                            +resultList[i].status3+resultList[i].status4;

                        var illegal_total = total - resultList[i].status0;
                        json.daily_aaData[i].total = total;
                        json.daily_aaData[i].illegal_total = illegal_total;

                    }
                    resultList = json.daily_aaData;
                    return json.daily_aaData; // 返回的 JSON 数据中的数据源位置
                }

            }


        });

        $('.datatable').find('.group-checkable').change(function () {
            var set = jQuery(this).attr("data-set");
            var checked = jQuery(this).is(":checked");
            jQuery(set).each(function () {
                if (checked) {
                    $(this).attr("checked", true);
                    $(this).parents('tr').addClass("active");
                } else {
                    $(this).attr("checked", false);
                    $(this).parents('tr').removeClass("active");
                }
            });
            jQuery.uniform.update(set);
        });
        $('.datatable').on('change', 'tbody tr .checkboxes', function () {
            $(this).parents('tr').toggleClass("active");
        });

        var tableWrapper = $('#sample_1_wrapper'); // datatable creates the table wrapper by adding with id {your_table_jd}_wrapper

        tableWrapper.find('.dataTables_length select').select2(); // initialize select2 dropdown

    }

    var  getDailyAnalysisRecordPrint = function(){
        var url = "../../analysis_data_servlet_action";
        var data={};
        data.action="daily_report";
        $.post(url,data,function(json){
            if(json.result_code==0){
                console.log(JSON.stringify(json));

                var list = json.aaData;

                var myhtml="";
                if(list!=undefined && list.length>0)
                {
                    for(var i=0;i<list.length;i++) {

                        var record=list[i];
                        myhtml+="<tr><td class=\"highlight\">" +record.lane_name+"</td>";
                        myhtml+="<td>" +(record.status0+record.status1
                            +record.status2+record.status3+record.status4)+" </td>"
                        myhtml+="<td>"+record.status0 +"</td>";
                        myhtml+="<td class=\"highlight\">"+record.status1+"</td>";
                        myhtml+="<td>"+record.status2+"</td>";
                        myhtml+="<td>"+record.status3 +"</td>";
                        myhtml+="<td class=\"highlight\">"+record.status4+"</td>";
                        myhtml+="</tr>";
                    }
                }
            }
            $("#print_list").html(myhtml);
        });


    }

    var  getAnalysisRecordPrint_Word = function(){
        var url = "../../analysis_data_servlet_action";
        var data={};
        data.action="analysis_print";
        $.post(url,data,function(json){
            if(json.result_code==0){
                console.log(JSON.stringify(json));

                var list = json.aaData;

                var html="";
                if(list!=undefined && list.length>0)
                {
                    for(var i=0;i<list.length;i++) {

                        var record=list[i];
                        html=html+"<tr style='height:26.95pt'>";
                        html=html+" <td width=63 valign=top style='width:46.95pt;border:none;border-right:solid #C9C9C9 1.0pt;";
                        html=html+"  background:white;padding:0cm 5.4pt 0cm 5.4pt;height:26.95pt'>";
                        html=html+" <p class=MsoNormal align=center style='text-align:center'><i><span";
                        html=html+" lang=EN-US style='font-family:\"微软雅黑\",sans-serif'>"+record.id+"</span></i></p>";
                        html=html+" </td>";
                        html=html+" <td width=63 valign=top style='width:47.05pt;border-top:none;border-left:";
                        html=html+" none;border-bottom:solid #C9C9C9 1.0pt;border-right:solid #C9C9C9 1.0pt;";
                        html=html+" padding:0cm 5.4pt 0cm 5.4pt;height:26.95pt'>";
                        html=html+" <p class=MsoNormal align=center style='text-align:center'><span lang=EN-US";
                        html=html+" style='font-family:\"微软雅黑\",sans-serif'>"+record.lane_name+"</span></p>";
                        html=html+" </td>";
                        html=html+" <td width=106 valign=top style='width:79.4pt;border-top:none;border-left:";
                        html=html+"  none;border-bottom:solid #C9C9C9 1.0pt;border-right:solid #C9C9C9 1.0pt;";
                        html=html+"  padding:0cm 5.4pt 0cm 5.4pt;height:26.95pt'>";
                        html=html+" <p class=MsoNormal align=center style='text-align:center'><span lang=EN-US";
                        html=html+" style='font-family:\"微软雅黑\",sans-serif'>"+record.start_time+"</span></p>";
                        html=html+" </td>";
                        html=html+" <td width=63 valign=top style='width:47.05pt;border-top:none;border-left:";
                        html=html+" none;border-bottom:solid #C9C9C9 1.0pt;border-right:solid #C9C9C9 1.0pt;";
                        html=html+" padding:0cm 5.4pt 0cm 5.4pt;height:26.95pt'>";
                        html=html+" <p class=MsoNormal align=center style='text-align:center'><span lang=EN-US";
                        html=html+" style='font-family:\"微软雅黑\",sans-serif'>"+record.end_time+"</span></p>";
                        html=html+" </td>";
                        html=html+" <td width=63 valign=top style='width:47.05pt;border-top:none;border-left:";
                        html=html+"  none;border-bottom:solid #C9C9C9 1.0pt;border-right:solid #C9C9C9 1.0pt;";
                        html=html+"  padding:0cm 5.4pt 0cm 5.4pt;height:26.95pt'>";
                        html=html+" <p class=MsoNormal align=center style='text-align:center'><span lang=EN-US";
                        html=html+" style='font-family:\"微软雅黑\",sans-serif'>"+record.total_num+"</span></p>";
                        html=html+" </td>";
                        html=html+" </tr>";

                    }
                }
            }
            $("#print_list_for_word").html(html);
        });


    }
    //数据获取函数--结束

    //图表处理函数-----开始
    var changeResultDataToChartForIllegalTypes = function(list) {
        chartDataIllegalType=[];
        for(var i = 0;i<list.length;i++)
        {
            var json = {"lane_name":list[i].lane_name,"正常行驶":list[i].status0,"违停":list[i].status1
                ,"闯红灯":list[i].status2,"压双黄线":list[i].status3,"逆行":list[i].status4}

            chartDataIllegalType.push(json);
        }

    }

    var changeResultDataToChartForIllegalTotal = function(list) {
        chartDataIllegalTotal = [];
        for (var i = 0; i < list.length; i++) {
            var json = {"lane_name": list[i].lane_name, "违法行驶数量": list[i].illegal_total}
            chartDataIllegalTotal.push(json);
        }
    }

    var changeResultDataToChartForAll = function(list,date) {
        chartDataExtra = [];
        laneStore = [];
        var tempList = [];
        var illegalTotal = 0;
        var lastDate = new Date();
        if(date!==undefined)
        {
            lastDate = new Date(date);
        }
        lastDate.setHours(8);
        lastDate.setMinutes(0);
        lastDate.setSeconds(0);
        lastDate.setMilliseconds(0);
        for (var i = 0; i < list.length; i++) {
            var record =list[i];

            if(!laneStore.includes(record.lane_name))
            {
                if(i!==0)
                {
                    var thisDate = new Date();
                    if(date!==undefined)
                    {
                        thisDate = new Date(date);
                    }
                    for(var tmp = lastDate;tmp.getFullYear()<thisDate.getFullYear()
                    ||tmp.getMonth()<thisDate.getMonth()
                    ||tmp.getDate()<=thisDate.getDate();tmp.setDate(tmp.getDate()+1))
                    {
                        var thisGroup = [new Date(tmp),0];
                        tempList.push(thisGroup);
                    }
                }

                if(date!==undefined)
                {
                    lastDate.setDate((new Date(date)).getDate()-7);
                }
                else
                {
                    lastDate.setDate((new Date()).getDate()-7);
                }
                laneStore.push(record.lane_name);
                if(tempList.length!==0)
                {
                    chartDataExtra.push(tempList.slice());
                    tempList = [];
                }
            }

            if(laneStore.includes(record.lane_name))
            {
                var thisDate =new Date(record.date);
                thisDate.setHours(8);
                thisDate.setMinutes(0);
                thisDate.setSeconds(0);
                thisDate.setMilliseconds(0);
                for(var tmp = lastDate;tmp.getFullYear()<thisDate.getFullYear()
                ||tmp.getMonth()<thisDate.getMonth()
                ||tmp.getDate()<thisDate.getDate();tmp.setDate(tmp.getDate()+1))
                {
                    var thisGroup = [new Date(tmp),0];
                    tempList.push(thisGroup);
                }

                illegalTotal = record.status1+ record.status2
                    + record.status3+ record.status4;
                var group = [thisDate, illegalTotal];
                lastDate.setDate(thisDate.getDate()+1)
                tempList.push(group);
            }
        }
        if(tempList.length!==0)
        {
            chartDataExtra.push(tempList.slice());
            tempList = [];
        }

    }

    //图标处理函数-----结束

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

            "dataProvider": chartDataIllegalType,
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
                "title": "正常行驶",
                "type": "column",
                "valueField": "正常行驶"
            },{
                "alphaField": "alpha",
                "balloonText": "<span style='font-size:13px;'>[[title]] in [[category]]:<b>[[value]]</b> [[additional]]</span>",
                "dashLengthField": "dashLengthColumn",
                "fillAlphas": 1,
                "title": "违停",
                "type": "column",
                "valueField": "违停"
            },{
                "alphaField": "alpha",
                "balloonText": "<span style='font-size:13px;'>[[title]] in [[category]]:<b>[[value]]</b> [[additional]]</span>",
                "dashLengthField": "dashLengthColumn",
                "fillAlphas": 1,
                "title": "闯红灯",
                "type": "column",
                "valueField": "闯红灯"
            }, {
                "alphaField": "alpha",
                "balloonText": "<span style='font-size:13px;'>[[title]] in [[category]]:<b>[[value]]</b> [[additional]]</span>",
                "dashLengthField": "dashLengthColumn",
                "fillAlphas": 1,
                "title": "压双黄线",
                "type": "column",
                "valueField": "压双黄线"
            },{
                "alphaField": "alpha",
                "balloonText": "<span style='font-size:13px;'>[[title]] in [[category]]:<b>[[value]]</b> [[additional]]</span>",
                "dashLengthField": "dashLengthColumn",
                "fillAlphas": 1,
                "title": "违停",
                "type": "column",
                "valueField": "违停"
            },{
                "alphaField": "alpha",
                "balloonText": "<span style='font-size:13px;'>[[title]] in [[category]]:<b>[[value]]</b> [[additional]]</span>",
                "dashLengthField": "dashLengthColumn",
                "fillAlphas": 1,
                "title": "逆行",
                "type": "column",
                "valueField": "逆行"
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

    var initChartSetsForIllegalTotal = function(){


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

            "dataProvider":  chartDataIllegalTotal,
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
                "title": "违法行驶数量",
                "type": "column",
                "valueField": "违法行驶数量"
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
                "title": "违法行驶数量",
                "valueField": "违法行驶数量"
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

    var InitChart3ForALL=function() {
        if ($('#chart_3').size() != 1) {
            return;
        }

        //对全局变量数据进行处理
        var plotData = [];
        plotData.push({data:0,label:0})
        for(var i = 0;i<chartDataExtra.length;i++)
        {
            var plotItem = {
                data: chartDataExtra[i],
                label: laneStore[i],
                lines: {
                    lineWidth: 1,
                },
                shadowSize: 0

            };

            plotData.push(plotItem);
        }

        var plot = $.plot($("#chart_3"), plotData, {
            series: {
                lines: {
                    show: true,
                    lineWidth: 2,
                    fill: true,
                    fillColor: {
                        colors: [{
                            opacity: 0.05
                        }, {
                            opacity: 0.01
                        }]
                    }
                },
                points: {
                    show: true,
                    radius: 3,
                    lineWidth: 1
                },
                shadowSize: 2
            },
            grid: {
                hoverable: true,
                clickable: true,
                tickColor: "#eee",
                borderColor: "#eee",
                borderWidth: 1
            },
            colors: ["#d12610", "#37b7f3", "#52e136"],
            xaxis: {

                mode: "time",
                timeformat: "%Y-%m-%d",
                tickColor: "#eee"
            },
            yaxis: {
                ticks: 11,
                tickDecimals: 0,
                tickColor: "#eee",
            }
        });


        function showTooltip(x, y, contents) {
            $('<div id="tooltip">' + contents + '</div>').css({
                position: 'absolute',
                display: 'none',
                top: y + 5,
                left: x + 15,
                border: '1px solid #333',
                padding: '4px',
                color: '#fff',
                'border-radius': '3px',
                'background-color': '#333',
                opacity: 0.80
            }).appendTo("body").fadeIn(200);
        }

        var previousPoint = null;
        $("#chart_3").bind("plothover", function(event, pos, item) {
            $("#x").text(pos.x.toFixed(2));
            $("#y").text(pos.y.toFixed(2));

            if (item) {
                if (previousPoint != item.dataIndex) {
                    previousPoint = item.dataIndex;

                    $("#tooltip").remove();
                    var x = item.datapoint[0].toFixed(2),
                        y = item.datapoint[1].toFixed(2);

                    showTooltip(item.pageX, item.pageY, item.series.label + " of " + item.series.data[item.dataIndex] + " = " + y);
                }
            } else {
                $("#tooltip").remove();
                previousPoint = null;
            }
        });
    }
    //图表的初始化函数-----结束



    var myExportAPI = function(){
        var url = "../../analysis_data_servlet_action";
        var data={};
        data.action="export_record";
        $.post(url,data,function(json){

            if(json.result_code_for_export==0){
                console.log(JSON.stringify(json));
                console.log(json.download_url);
                $("#record_export_div #download_url").attr("download_url",json.download_url);
                $("#record_export_div").modal("show");
            }
        });
    }

    var myPrintAPI = function(){
        window.open("daily_print_default.jsp");
    }

    var myPrintAPI_Word = function(){
        window.open("analysis_print_word.jsp");

    }


    //submit functions end

    var returnBack = function(){
        history.go(-1);
    }


    //输入判断函数--开始
    var checkInputValid = function(key) {
        var invalidKeys=['-','=','+','{','}','\'','/',',',
            '\\','"',':',';','?','!','%','&','*','#','$','^','(',')']

        for(var i = 0;i<invalidKeys.length;i++)
        {
            if(key===invalidKeys[i])
            {
                return false;
            }
        }

        return true;

    }

    var checkValid = function(element) {

        resetInputCss();
        illegalInput = [];
        var inputElements = element.find("input");
        var check =  true;
        var str = "";

        var elementArray = [];
        var checkTimeArray = ["capture_time_begin","capture_time_sec_begin"
            ,"capture_time_end","capture_time_sec_end"]

        var start_time;
        var end_time;

        //判断总车流量是不是数字
        if(jQuery.type(element.find("#total_num"))!=="number")
        {
            illegalInput.push($(this));
            check = false;
        }
        inputElements.each(function(){

            var recentElem = $(this);
            str = recentElem.val();
            for(var i = 0;i<str.length;i++)
            {
                var myCh = str[i];
                if(!checkInputValid(myCh))
                {
                    check = false;
                    illegalInput.push($(this));
                }
            }

            //取timepicker中每个不为空的输入栏
            for(var i = 0;i<4;i++)
            {
                if(recentElem.attr("id")===checkTimeArray[i])
                {
                    elementArray[i] = recentElem;
                }
            }

            inValidManager();
        })

        //判断是否出现结束时间>开始时间的情况
        if(elementArray[0].val()!==""&&elementArray[1].val()!==""
            &&elementArray[2].val()!==""&&elementArray[3].val()!=="")
        {
            start_time = elementArray[0].val()+elementArray[1].val();
            end_time = elementArray[2].val()+elementArray[3].val();

            if(start_time>end_time)
            {
                check = false;
                for(var i = 0;i<elementArray.length;i++)
                {
                    illegalInput.push(elementArray[i]);
                }
            }
        }
        return check;
    }
    //输入判断函数--结束

    var inValidManager = function(){
        for(var i = 0;i<illegalInput.length;i++)
        {
            illegalInput[i].css({
                "border-color" : "#a94442"
            });
        }
    }

    var resetInputCss = function()
    {
        for(var i = 0;i<illegalInput.length;i++)
        {
            illegalInput[i].css({
                "border-color" : "#cccccc"
            });
        }
    }



    //数据解析模块-----开始
    var explainIllegalCode = function(code)
    {
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

    var explainIllegalCode_Contrary = function(code)
    {
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

    //Page return 开始
    return {
        init: function() {
            initPageControl();
        }
    }
}();//Page
/*================================================================================*/
