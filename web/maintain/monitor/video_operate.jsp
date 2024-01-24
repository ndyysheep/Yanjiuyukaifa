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
    <title>XM-08 | OpenCV交通视频识别 </title>
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta content="width=device-width, initial-scale=1.0" name="viewport"/>
    <meta http-equiv="Content-type" content="text/html; charset=utf-8">
    <meta content="" name="description"/>
    <meta content="" name="author"/>
    <%@include file="../../home/frame/frame_style.jsp"%>
    <script src="../../assets/global/plugins/echarts/echarts.min.js" type="text/javascript"></script>
    <link rel="stylesheet" type="text/css" href="../../assets/css/comon0.css"/>
    <style>
        #record_list_div{
            color: #fff;
        }
        .fa{
            color: #fff !important;
        }
        .green.btn{
            color: #fff !important;
        }
        .red.btn{
            color: #fff !important;
        }
        html{
            background: url("/assets/img/bg.jpg") center no-repeat;
            background-size: cover;
            background-color: rgb(0,7,64);
        }
        body{
            background: rgba(0,0,0,0) !important;
        }
        .slimScrollDiv{
            background: rgba(0,0,0,0) !important;
        }
        .page-sidebar .page-sidebar-menu .sub-menu li > a, .page-sidebar-closed.page-sidebar-fixed .page-sidebar:hover .page-sidebar-menu .sub-menu li > a{
            color: #ffffff !important;
        }
        .active{
            background: rgba(0,0,0,0) !important;
            color: #ffffff !important;
        }
        .page-sidebar-closed.page-sidebar-fixed .page-sidebar:hover .page-sidebar-menu > li.active > a, .page-sidebar-closed.page-sidebar-fixed .page-sidebar:hover .page-sidebar-menu > li.active.open > a, .page-sidebar .page-sidebar-menu > li.active > a, .page-sidebar .page-sidebar-menu > li.active.open > a{
            background: rgba(0,0,0,0) !important;
            color: #ffffff !important;
        }
        .page-sidebar .page-sidebar-menu > li > a > .title, .page-sidebar-closed.page-sidebar-fixed .page-sidebar:hover .page-sidebar-menu > li > a > .title{
            color: #ffffff !important;
        }
        .page-sidebar-closed.page-sidebar-fixed .page-sidebar:hover .page-sidebar-menu .sub-menu > li:hover > a, .page-sidebar-closed.page-sidebar-fixed .page-sidebar:hover .page-sidebar-menu .sub-menu > li.open > a, .page-sidebar-closed.page-sidebar-fixed .page-sidebar:hover .page-sidebar-menu .sub-menu > li.active > a, .page-sidebar .page-sidebar-menu .sub-menu > li:hover > a, .page-sidebar .page-sidebar-menu .sub-menu > li.open > a, .page-sidebar .page-sidebar-menu .sub-menu > li.active > a{
            background: rgba(0,0,0,0.3) !important;
            color: #ffffff !important;
        }
        .page-header.navbar.navbar-fixed-top{
            background: rgba(0,0,0,0.3) !important;
            color: #ffffff !important;
        }
        .page-sidebar{
            background: rgba(0,0,0,0) !important;
        }
        .page-content-child{
            display: flex;
            flex-flow: row nowrap;
        }
        .page-content-wrapper{
            min-height: 90vh;
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
            padding: 10px;
            flex: 1;
            height: 100%;
            min-height: 600px;
            min-width : 600px;
            display: flex;
            flex-flow: column nowrap;
            background: url("containers/earth.gif") center no-repeat;
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

        <input type="hidden" id="page_id" name="page_id" value="video_operate">
        <div class="page-content" style=" flex: 1">
            <div class="row" id="updateVideo">
                <div class="col-md-12">
                    <form id="ajax_form" name="ajax_form" class="form-horizontal" method="post" enctype="multipart/form-data">
                        <div id="ajax_div" name="ajax_div">
                    <span class="btn green fileinput-button">
                                    <i class="fa fa-plus"></i>
                                    <span style="color: #ffffff !important;">添加文件... </span>
                                    <input type="file" id="upload_file" name="upload_file" onchange="showFile()" style="color: #ffffff;">
                                </span>

                            <button id="upload_button1" type="button" class="btn red fileinput-button" onclick="onAjaxUploadFile()">
                                <i class="fa fa-upload"></i>
                                <span style="color: #ffffff !important;">开始上传 </span>
                            </button>
                        </div>
                        <div id="record_list_div" name="record_list_div"></div>
                    </form>
                </div>
            </div>

            <div class="page-content-child" style="display: none;" id="echartDiv">
                <div class="left-div">
                    <div class="boxall" style="height: 3.3rem">
                        <div class="alltitle">违章统计</div>

                        <div class="sycm">
                            <ul class="clearfix">
                                <li><h2>24</h2><span>今日逆行</span></li>
                                <li><h2>19</h2><span>今日闯红灯</span></li>
                                <li><h2>12</h2><span>今日压双黄线</span></li>
                            </ul>
                            <div style="border-bottom: 1px solid rgba(255,255,255,.1)"></div>
                            <ul class="clearfix">
                                <li><h2>82</h2><span>昨日逆行</span></li>
                                <li><h2>92</h2><span>昨日闯红灯</span></li>
                                <li><h2>19</h2><span>昨日压双黄线</span></li>
                            </ul>


                        </div>
                        <div class="boxfoot"></div>
                    </div>
                    <div class="echart-div" id="echart-div1" style="margin-top:20px"></div>
                    <div class="echart-div" id="echart-div2" style="margin-top:20px"></div>
                </div>
                <div class="center-div" id="center-div">
                    <%--<div class="center-top-div" id="center-top-div">--%>

                    <%--</div>--%>

                    <div class="row">
                        <div class="col-md-12">
                            <div id="video_div"></div>
                        </div>
                    </div>

                    <div class="row">
                        <div class="col-md-12">
                            <button type="button" id="get_back_button" name ="get_back_button" class="btn default red-stripe">逆行检测</button>
                            <button type="button" id="get_flow_button" name ="get_flow_button" class="btn default blue-stripe">车流量检测</button>
                            <button type="button" id="get_red_button" name="get_red_button" class="btn default red-stripe">闯红灯检测</button>
                            <button type="button" id="get_carId_button" name="get_carId_button" class="btn default blue-stripe">车牌号检测</button>
                            <button type="button" id="get_double_button" name ="get_double_button" class="btn default blue-stripe">压双黄线检测</button>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-12">
                            <div id="result_div"></div>
                        </div>
                    </div>


                    <%--datatable数据表--%>

                </div>

                <div class="right-div">
                    <div class="boxall" style="height: 3.4rem">
                        <div class="alltitle">实时规章记录</div>
                        <div class="wrap">
                            <ul>
                                <li>
                                    <p>1 京A88888-XXX街道-违章-闯红灯</p>
                                </li>
                                <li>
                                    <p>2 鄂A88888-XXX街道-违章-逆行</p>
                                </li>
                                <li>
                                    <p>3 京A66666-XXX街道-违章-压双黄线</p>
                                </li>
                                <li>
                                    <p>4 鄂A66666-XXX街道-违章-逆行</p>
                                </li>
                                <li>
                                    <p>5 京A33333-XXX街道-违章-压双黄线</p>
                                </li>
                                <li>
                                    <p>6 鄂A33333-XXX街道-违章-闯红灯</p>
                                </li>
                            </ul>
                        </div>
                        <div class="boxfoot"></div>
                    </div>
                    <div class="echart-div" id="echart-div3" style="margin-top:20px"></div>
                    <div class="echart-div" id="echart-div4" style="margin-top:20px"></div>
                </div>

                <div class="row" id="row_res" style="display:none">
                    <div class="col-md-12">
                        <div class="portlet box blue-hoki">
                            <div class="portlet-title">
                                <div class="caption">
                                    <i class="fa fa-comments"></i>结果表
                                </div>
                                <div class="tools">
                                    <a href="javascript:;" class="collapse">
                                    </a>
                                    <a href="#portlet-config" data-toggle="modal" class="config">
                                    </a>
                                    <a href="javascript:;" class="reload">
                                    </a>
                                    <a href="javascript:;" class="remove">
                                    </a>
                                </div>
                            </div>

                            <div class="portlet-body">
                                <div class="table-scrollable">
                                    <table class="table table-striped table-bordered table-hover datatable" id="sample_1">
                                        <thead >
                                        <tr id = "tableHead">

                                        </tr>
                                        </thead>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
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
<script>
    var whei=$(window).width()
    $("html").css({fontSize:whei/20})
    $(window).resize(function(){
        var whei=$(window).width()
        $("html").css({fontSize:whei/20})
    });
    function initdiv1(id,data) {
        var echartDiv1 = echarts.init(document.getElementById(id));
        echartDiv1.setOption(data);
    }
    var echartdata1 = {
        title: {
            text: '闯红灯情况',
            textStyle:{
                color:'#fff'
            }
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
                },
                axisLabel: {
                    show: true,
                    textStyle: {
                        color: '#fff'
                    }
                }
            }
        ],
        yAxis: [
            {
                type: 'value',
                axisLabel: {
                    show: true,
                    textStyle: {
                        color: '#fff'
                    }
                }
            }
        ],
        series: [
            {
                barWidth:'20',
                name: '违章数',
                type: 'bar',
                data: [0, 0, 0, 0, 0, 0, 0]
            }
        ]
    }
    var echartdata2 = {
        title: {
            text: '逆行',
            textStyle:{
                color:'#fff'
            }
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
                },
                axisLabel: {
                    show: true,
                    textStyle: {
                        color: '#fff'
                    }
                }
            }
        ],
        yAxis: [
            {
                type: 'value',
                axisLabel: {
                    show: true,
                    textStyle: {
                        color: '#fff'
                    }
                }
            }
        ],
        series: [
            {
                barWidth:'20',
                name: '违章数',
                type: 'bar',
                data: [0, 0, 0 ,0, 0,0, 0]
            }
        ]
    };
    initdiv1('echart-div1',echartdata1);
    initdiv1('echart-div2',echartdata2);
    var echartdata3 = {
        color: ['#80FFA5', '#00DDFF', '#37A2FF', '#FF0087', '#FFBF00'],
        title: {
            text: '逆行情况',
            textStyle:{
                color:'#fff'
            }
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
                data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                axisLabel: {
                    show: true,
                    textStyle: {
                        color: '#fff'
                    }
                }
            }
        ],
        yAxis: [
            {
                type: 'value',
                axisLabel: {
                    show: true,
                    textStyle: {
                        color: '#fff'
                    }
                }
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
                data: [0, 0, 0, 0, 0, 0, 0]
            }
        ]
    };

    var echartdata4 = {
        title: {
            text: '压双黄线',
            textStyle:{
                color:'#fff'
            }
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
                },
                axisLabel: {
                    show: true,
                    textStyle: {
                        color: '#fff'
                    }
                }
            }
        ],
        yAxis: [
            {
                type: 'value',
                axisLabel: {
                    show: true,
                    textStyle: {
                        color: '#fff'
                    }
                }
            }
        ],
        series: [
            {
                barWidth:'20',
                name: '违章数',
                type: 'bar',
                data: [0, 0, 0, 0, 0, 0, 0]
            }
        ]
    }

    var onAjaxUploadFile=function(){
        $('#site_activities_loading').css('display','flex');
        var deviceId = $("#device_id").val();
        var deviceName = $("#device_name").val();
        var options = {
            type : 'post', /*设置表单以post方法提交*/
            url : '../../video_data_servlet_action?action=upload_file&device_id='+deviceId+"&device_name="+deviceName, /*设置post提交到的页面*/
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
                    html+="<br>";
                    $("#video_div").html(html);
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
                            // for (var i = 0; i < json.aaData.length; i++) {
                            //     var data = json.aaData[i];
                            //     if(data.vehicle_type&&count<2){
                            //
                            //         $('.number-title',$('.number-item')[count]).text(data.num)
                            //         $('.number-text',$('.number-item')[count]).text(data.vehicle_type)
                            //         count++;
                            //
                            //     }
                            // }
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
    var html=$(".wrap ul").html()
    $(".wrap ul").append(html)
    var ls=$(".wrap li").length/2+1
    i=0
    var ref = setInterval(function(){
        i++
        if(i==ls){
            i=1
            $(".wrap ul").css({marginTop:0})
            $(".wrap ul").animate({marginTop:-'.52'*i+'rem'},1000)
        }
        $(".wrap ul").animate({marginTop:-'.52'*i+'rem'},1000)


    },2400);
</script>

<script src="containers/js/video.js"></script>
<!-- END JAVASCRIPTS -->
</body>
<!-- END BODY -->


</html>

