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
<div class="page-container" style="background-image: url('../../assets/img/background.jpg');background-repeat: no-repeat;
  background-attachment: fixed;
  background-size: 100% 100%;">
    <!-- BEGIN SIDEBAR -->
    <%@include file="../../home/frame/page_sidebar.jsp"%>
    <!-- END SIDEBAR -->

    <!-- BEGIN CONTENT -->
    <div class="page-content-wrapper" >
        <div class="page-content">
            <div style="align-content: center">
                 <span class="label label-info" style="font-size: large;margin-left: 600px">当前城市:</span><span style="font-size: large;color: white" id="curcity"></span>
            </div>
            <div class="col-md-12">
                <div class="portlet-body" style="background: white">
                    <div id="chart_2" class="chart">
                    </div>
                </div>
            </div>
            <div class="portlet-body" >
                <div class="tabbable-line" >
                    <ul class="nav nav-tabs ">
                        <li class="active">
                            <a href="#tab_15_1" data-toggle="tab" id="day1">
                                Section 1 </a>
                        </li>
                        <li>
                            <a href="#tab_15_2" data-toggle="tab" id="day2">
                                Section 2 </a>
                        </li>
                        <li>
                            <a href="#tab_15_3" data-toggle="tab" id="day3">
                                Section 3 </a>
                        </li>
                        <li>
                            <a href="#tab_15_4" data-toggle="tab" id="day4">
                                Section 4 </a>
                        </li>
                    </ul>
                    <div class="tab-content" style="background-color:transparent">
                        <div class="tab-pane active" id="tab_15_1">
                            <div style="margin:10px">
                                <span class="label label-danger" style="font-size: large">天气:</span><span style="font-size: large;" id="weather1">    晴</span>
                            </div>
                            <div style="margin:10px">
                                <span class="label label-danger" style="font-size: large">白天温度:</span><span style="font-size: large;" id="daytemp1">    晴</span>
                            </div>
                            <div style="margin:10px">
                                <span class="label label-danger" style="font-size: large">夜晚温度:</span><span style="font-size: large;" id="nighttemp1">    晴</span>
                            </div>
                            <div style="margin:10px">
                                <span class="label label-danger" style="font-size: large">风向:</span><span style="font-size: large;" id="wind1">    晴</span>
                            </div>
                            <div style="margin:10px">
                                <span class="label label-danger" style="font-size: large">光照强度:</span><span style="font-size: large;" id="power1">    晴</span>
                            </div>
                        </div>
                        <div class="tab-pane" id="tab_15_2">
                            <div style="margin:10px">
                                <span class="label label-danger" style="font-size: large">天气:</span><span style="font-size: large;" id="weather2">    晴</span>
                            </div>
                            <div style="margin:10px">
                                <span class="label label-danger" style="font-size: large">白天温度:</span><span style="font-size: large;" id="daytemp2">    晴</span>
                            </div>
                            <div style="margin:10px">
                                <span class="label label-danger" style="font-size: large">夜晚温度:</span><span style="font-size: large;" id="nighttemp2">    晴</span>
                            </div>
                            <div style="margin:10px">
                                <span class="label label-danger" style="font-size: large">风向:</span><span style="font-size: large;" id="wind2">    晴</span>
                            </div>
                            <div style="margin:10px">
                                <span class="label label-danger" style="font-size: large">光照强度:</span><span style="font-size: large;" id="power2">    晴</span>
                            </div>
                        </div>
                        <div class="tab-pane" id="tab_15_3">
                            <div style="margin:10px">
                                <span class="label label-danger" style="font-size: large">天气:</span><span style="font-size: large;" id="weather3">    晴</span>
                            </div>
                            <div style="margin:10px">
                                <span class="label label-danger" style="font-size: large">白天温度:</span><span style="font-size: large;" id="daytemp3">    晴</span>
                            </div>
                            <div style="margin:10px">
                                <span class="label label-danger" style="font-size: large">夜晚温度:</span><span style="font-size: large;" id="nighttemp3">    晴</span>
                            </div>
                            <div style="margin:10px">
                                <span class="label label-danger" style="font-size: large">风向:</span><span style="font-size: large;" id="wind3">    晴</span>
                            </div>
                            <div style="margin:10px">
                                <span class="label label-danger" style="font-size: large">光照强度:</span><span style="font-size: large;" id="power3">    晴</span>
                            </div>
                        </div>
                        <div class="tab-pane" id="tab_15_4">
                            <div style="margin:10px">
                                <span class="label label-danger" style="font-size: large">天气:</span><span style="font-size: large;" id="weather4">    晴</span>
                            </div>
                            <div style="margin:10px">
                                <span class="label label-danger" style="font-size: large">白天温度:</span><span style="font-size: large;" id="daytemp4">    晴</span>
                            </div>
                            <div style="margin:10px">
                                <span class="label label-danger" style="font-size: large">夜晚温度:</span><span style="font-size: large;" id="nighttemp4">    晴</span>
                            </div>
                            <div style="margin:10px">
                                <span class="label label-danger" style="font-size: large">风向:</span><span style="font-size: large;" id="wind4">    晴</span>
                            </div>
                            <div style="margin:10px">
                                <span class="label label-danger" style="font-size: large">光照强度:</span><span style="font-size: large;" id="power4">    晴</span>
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



<!-- BEGIN JAVASCRIPTS(Load javascripts at bottom, this will reduce page load time) -->

<%@include file="../../home/frame/frame_javascript.jsp"%>
<!-- END JAVASCRIPTS -->
</body>
<!-- END BODY -->
</html>
<script src="../../assets/js/WeatherReport.js"></script>
<script src="../../assets/global/plugins/flot/jquery.flot.min.js"></script>
<script src="../../assets/global/plugins/flot/jquery.flot.resize.min.js"></script>
<script src="../../assets/global/plugins/flot/jquery.flot.time.js"></script>
<script src="../../assets/global/plugins/flot/jquery.flot.time.min.js"></script>
<script src="../../assets/global/plugins/flot/jquery.flot.stack.min.js"></script>
<script src="../../assets/global/plugins/flot/jquery.flot.crosshair.min.js"></script>
<script src="../../assets/global/plugins/flot/jquery.flot.categories.min.js" type="text/javascript"></script>
<script>
    jQuery(document).ready(function() {
        // initiate layout and plugins
        Metronic.init(); // init metronic core components
        Layout.init(); // init current layout
        Demo.init(); // init demo features\
        WeatherChart.initChart();
    });
</script>
