<%--
  Created by IntelliJ IDEA.
  User: CornerGjr
  Date: 2023/11/27
  Time: 21:37
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>


<!DOCTYPE html>

<!--[if IE 8]> <html lang="en" class="ie8 no-js"> <![endif]-->
<!--[if IE 9]> <html lang="en" class="ie9 no-js"> <![endif]-->
<!--[if !IE]><!-->
<html lang="en">
<!--<![endif]-->
<!-- BEGIN HEAD -->
<head>
    <meta charset="utf-8"/>
    <title>Metronic | Page Layouts - Sidebar Fixed Page</title>
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta content="width=device-width, initial-scale=1.0" name="viewport"/>
    <meta http-equiv="Content-type" content="text/html; charset=utf-8">
    <meta content="" name="description"/>
    <meta content="" name="author"/>
    <%@include file="../../home/frame/frame_style.jsp"%>
    <script src="../../assets/global/plugins/echarts/echarts.min.js" type="text/javascript"></script>
    <style>
        .page-content{
            display: flex;
            flex-flow: row nowrap;
        }
        .left-div{
            width: 600px;
            height: 100%;
            min-height: 600px;
            /*background: #ddd;*/
            display: flex;
            flex-flow: column nowrap;
        }
        .center-div{
            flex: 1;
            height: 100%;
            min-height: 600px;
            display: flex;
            flex-flow: column nowrap;
            background: url("./containers/earth.gif") center no-repeat;
            -webkit-background-size: contain;
            background-size: contain;
        }
        .right-div{
            width: 600px;
            height: 100%;
            /*background: #ddd;*/
            min-height: 600px;
            display: flex;
            flex-flow: column nowrap;
        }
        .echart-div{
            width: 600px;
            height: 300px;
        }
        .center-top-div{
            height: 120px;
            display: flex;
            flex-flow: row nowrap;
            color: #4e6ef2;
            margin-top: -60px;
            z-index: 99999;
            background: #ffffff;
        }
        .number-item{
            height: 120px;
            flex: 1;
            display: flex;
            flex-flow: column nowrap;
            align-items: center;
            justify-content: center;
        }
        @font-face {
            font-family: number-clock;
            src: url("containers/css/LESLIEB.ttf");
        }
        .number-title{
            font-family: number-clock;
            font-size: 40px;
            font-weight: bold;
        }
        .number-text{
            font-size: 24px;
            font-weight: bold;
        }


    </style>
</head>

<body class="page-header-fixed page-sidebar-closed-hide-logo page-sidebar-fixed page-sidebar-closed-hide-logo">
<!-- BEGIN HEADER -->
<div class="page-header navbar navbar-fixed-top">
    <!-- BEGIN HEADER INNER -->
    <div class="page-header-inner">
        <!-- BEGIN LOGO -->
        <div class="page-logo">
            <a href="index.html">
                <img src="../../assets/admin/layout4/img/logo-light.png" alt="logo" class="logo-default"/>
            </a>
            <div class="menu-toggler sidebar-toggler">
                <!-- DOC: Remove the above "hide" to enable the sidebar toggler button on header -->
            </div>
        </div>
        <!-- END LOGO -->
        <!-- BEGIN RESPONSIVE MENU TOGGLER -->
        <a href="javascript:;" class="menu-toggler responsive-toggler" data-toggle="collapse" data-target=".navbar-collapse">
        </a>
        <!-- END RESPONSIVE MENU TOGGLER -->
        <!-- BEGIN PAGE ACTIONS -->
        <!-- DOC: Remove "hide" class to enable the page header actions -->
        <div class="page-actions">
            <div class="btn-group">
                <button type="button" class="btn red-haze btn-sm dropdown-toggle" data-toggle="dropdown" data-hover="dropdown" data-close-others="true">
                    <span class="hidden-sm hidden-xs">Actions&nbsp;</span><i class="fa fa-angle-down"></i>
                </button>
                <ul class="dropdown-menu" role="menu">
                    <li>
                        <a href="javascript:;">
                            <i class="icon-docs"></i> New Post </a>
                    </li>
                    <li>
                        <a href="javascript:;">
                            <i class="icon-tag"></i> New Comment </a>
                    </li>
                    <li>
                        <a href="javascript:;">
                            <i class="icon-share"></i> Share </a>
                    </li>
                    <li class="divider">
                    </li>
                    <li>
                        <a href="javascript:;">
                            <i class="icon-flag"></i> Comments <span class="badge badge-success">4</span>
                        </a>
                    </li>
                    <li>
                        <a href="javascript:;">
                            <i class="icon-users"></i> Feedbacks <span class="badge badge-danger">2</span>
                        </a>
                    </li>
                </ul>
            </div>
        </div>
        <!-- END PAGE ACTIONS -->
        <!-- BEGIN PAGE TOP -->
        <div class="page-top">
            <!-- BEGIN HEADER SEARCH BOX -->
            <!-- DOC: Apply "search-form-expanded" right after the "search-form" class to have half expanded search box -->
            <form class="search-form" action="extra_search.html" method="GET">
                <div class="input-group">
                    <input type="text" class="form-control input-sm" placeholder="Search..." name="query">
                    <span class="input-group-btn">
					<a href="javascript:;" class="btn submit"><i class="icon-magnifier"></i></a>
					</span>
                </div>
            </form>
            <!-- END HEADER SEARCH BOX -->
            <!-- BEGIN TOP NAVIGATION MENU -->
            <%@include file="../../home/frame/top_menu.jsp"%>
            <!-- END TOP NAVIGATION MENU -->
        </div>
        <!-- END PAGE TOP -->
    </div>
    <!-- END HEADER INNER -->
</div>
<!-- END HEADER -->
<div class="clearfix">
</div>
<!-- BEGIN CONTAINER -->
<div class="page-container">
    <!-- BEGIN SIDEBAR -->
    <%@include file="../../home/frame/page_sidebar.jsp"%>
    <!-- END SIDEBAR -->

    <!-- BEGIN CONTENT -->
    <div class="page-content-wrapper">
        <div id="site_activities_loading" style="
    display: none;
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0,0,0,0.5);
    flex-flow: row nowrap;
    align-items: center;
    justify-content: center;
    z-index: 99;
">
            <img src="../../assets/admin/layout/img/loading.gif" alt="loading">
        </div>
        <div class="page-content" id="updateVideo">
            <form id="ajax_form" name="ajax_form" class="form-horizontal" method="post" enctype="multipart/form-data">
                <div id="ajax_div" name="ajax_div">
                    <span class="btn green fileinput-button">
                                    <i class="fa fa-plus"></i>
                                    <span>Add files... </span>
                                    <input type="file" id="upload_file" name="upload_file" onchange="showFile()">
                                </span>

                    <button type="button" class="btn red fileinput-button" onclick="onAjaxUploadFile()">
                        <i class="fa fa-upload"></i>
                        <span>Start upload </span>
                    </button>
                </div>
                <div id="record_list_div" name="record_list_div"></div>
            </form>
        </div>
        <div class="page-content" style="display: none;" id="echartDiv">
            <div class="left-div">
                <div class="echart-div" id="echart-div1"></div>
                <div class="echart-div" id="echart-div2"></div>
            </div>
            <div class="center-div" id="center-div">
                <div class="center-top-div">
                    <div class="number-item">
                        <div class="number-title">
                            8119
                        </div>
                        <div class="number-text">
                            总车流量
                        </div>
                    </div>
                    <div class="number-item">
                        <div class="number-title">
                            562
                        </div>
                        <div class="number-text">
                            最近车流量
                        </div>
                    </div>
                </div>
            </div>
            <div class="right-div">
                <div class="echart-div" id="echart-div3"></div>
                <div class="echart-div" id="echart-div4"></div>
            </div>
        </div>
    </div>
    <!-- END CONTENT -->
</div>
<!-- END CONTAINER -->

<!-- BEGIN FOOTER -->
<%--<%@include file="../../home/frame/frame_footer.jsp"%>--%>
<!-- END FOOTER -->

<!-- BEGIN JAVASCRIPTS(Load javascripts at bottom, this will reduce page load time) -->

<%@include file="../../home/frame/frame_javascript.jsp"%>
<!-- END JAVASCRIPTS -->
</body>
<!-- END BODY -->

<!--修改数据-->
<%@include file="monitor_add_div.jsp"%>
<%@include file="monitor_query_div.jsp"%>
<%@include file="monitor_modify_div.jsp"%>
<%@include file="monitor_export_div.jsp"%>

<script>
    function initdiv1(id,data) {
        var echartDiv1 = echarts.init(document.getElementById(id));
        echartDiv1.setOption(data);
    }
    var echartdata1 = {
        title: {
            text: '闯红灯情况'
        },
        color:['#2d8acd'],
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: [
            {
                type: 'category',
                data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                axisTick: {
                    alignWithLabel: true
                }
            }
        ],
        yAxis: [
            {
                type: 'value'
            }
        ],
        series: [
            {
                barWidth:'20',
                name: '违章数',
                type: 'bar',
                data: [10, 152, 200, 334, 190, 30, 220]
            }
        ]
    }
    var echartdata2 = {
        title: {
            text: '违规停车'
        },
        color:['#28ce89'],
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: [
            {
                type: 'category',
                data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                axisTick: {
                    alignWithLabel: true
                }
            }
        ],
        yAxis: [
            {
                type: 'value'
            }
        ],
        series: [
            {
                barWidth:'20',
                name: '违章数',
                type: 'bar',
                data: [105, 52, 200, 134, 290, 530, 220]
            }
        ]
    };
    initdiv1('echart-div1',echartdata1);
    initdiv1('echart-div2',echartdata2);
    var echartdata3 = {
        color: ['#80FFA5', '#00DDFF', '#37A2FF', '#FF0087', '#FFBF00'],
        title: {
            text: '逆行情况'
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'cross',
                label: {
                    backgroundColor: '#6a7985'
                }
            }
        },
        toolbox: {
            feature: {
                saveAsImage: {}
            }
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: [
            {
                type: 'category',
                boundaryGap: false,
                data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
            }
        ],
        yAxis: [
            {
                type: 'value'
            }
        ],
        series: [
            {
                name: '违章数',
                type: 'line',
                // stack: 'Total',
                smooth: true,
                lineStyle: {
                    width: 0
                },
                showSymbol: false,
                areaStyle: {
                    opacity: 0.4,
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        {
                            offset: 0,
                            color: 'rgb(128, 255, 165)'
                        },
                        {
                            offset: 1,
                            color: 'rgb(1, 191, 236)'
                        }
                    ])
                },
                emphasis: {
                    focus: 'series'
                },
                data: [140, 232, 101, 264, 90, 340, 250]
            }
        ]
    };

    var echartdata4 = {
        title: {
            text: '压双黄线'
        },
        color:['#2d8ad0'],
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: [
            {
                type: 'category',
                data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                axisTick: {
                    alignWithLabel: true
                }
            }
        ],
        yAxis: [
            {
                type: 'value'
            }
        ],
        series: [
            {
                barWidth:'20',
                name: '违章数',
                type: 'bar',
                data: [610, 152, 100, 134, 590, 130, 120]
            }
        ]
    }

    var onAjaxUploadFile=function(){
        $('#site_activities_loading').css('display','flex');
        var deviceId = $("#device_id").val();
        var deviceName = $("#device_name").val();
        var options = {
            type : 'post', /*设置表单以post方法提交*/
            url : '../../monitor_data_servlet_action?action=upload_file&device_id='+deviceId+"&device_name="+deviceName, /*设置post提交到的页面*/
            success : function(json) {
                console.log("[onAjaxUploadFile]上传文件返回结果="+JSON.stringify(json));
                if(json.upload_files.length>0){
                    var files=json.upload_files;
                    var fileUrl = files[0].file_url_name;
                    var objectId = files[0].file_object_id;
                    $("#current_attachment_name").html("您当前上传的附件是：<span style='color:blue;'><a href='javascript:window.open(\""+fileUrl+"\")'>" + fileUrl + "</a></span>");
                    $("#current_attachment_object_id").val(objectId);

                    var html="";
                    html+="<video width=\"640\" height=\"360\" controls style=\"width: 100%;height: auto;\">";
                    html+="<source src='"+fileUrl+"' type=\"video/mp4\">"+"</video>"

                    $("#center-div").append(html);
                    $("#center-div").css('background','none');
                    $('#updateVideo').hide();
                    $.ajax({
                        type : 'post', /*设置表单以post方法提交*/
                        url : '../../illegal_data_servlet_action', /*设置post提交到的页面*/
                        data:{
                            ajax:'ajax',
                            action:'illegal_statistics',

                        },
                        success : function(json) {
                            var echartsarray = [[],[],[],[],[]];
                            var times = [];
                            var count = 0;
                            for (var i = 0; i < json.aaData.length; i++) {
                                var data = json.aaData[i];
                                if(data.vehicle_type&&count<2){

                                    $('.number-title',$('.number-item')[count]).text(data.num)
                                    $('.number-text',$('.number-item')[count]).text(data.vehicle_type)
                                    count++;

                                }
                            }
                            for (var i = 0; i < json.hour_aaData.length; i++) {
                                var data = json.hour_aaData[i];
                                echartsarray[0].push(data.status1);
                                echartsarray[1].push(data.status2);
                                echartsarray[2].push(data.status3);
                                echartsarray[3].push(data.status4);
                                times.push(data.time_interval);
                            }
                            echartdata1.series[0].data = echartsarray[0];
                            echartdata1.xAxis[0].data = times;
                            echartdata2.series[0].data = echartsarray[1];
                            echartdata2.xAxis[0].data = times;
                            echartdata3.series[0].data = echartsarray[2];
                            echartdata3.xAxis[0].data = times;
                            echartdata4.series[0].data = echartsarray[3];
                            echartdata4.xAxis[0].data = times;
                            initdiv1('echart-div1',echartdata1);
                            initdiv1('echart-div2',echartdata2);
                            initdiv1('echart-div3',echartdata3);
                            initdiv1('echart-div4',echartdata4);
                            $('#site_activities_loading').hide();
                            $('#echartDiv').show();
                        }
                    })

                }else{
                    alert("[onAjaxUploadFile]没有上传文件结果返回！");
                }
            },
            error : function(error) {
                alert(error);
            },
            dataType : "json" /*设置返回值类型为文本*/
        };
        $("#ajax_form").ajaxSubmit(options);
    }

    function showFile() {
        if($('#upload_file').val().indexOf('.mp4')>0){
            $('#record_list_div').html($('#upload_file').val());
        }else{
            $('#upload_file').val('');
            alert('只能上传视频文件')
        }
    }
</script>
</html>

