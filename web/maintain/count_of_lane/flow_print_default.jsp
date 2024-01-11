<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<!--
Template Name: Metronic - Responsive Admin Dashboard Template build with Twitter Bootstrap 3.3.5
Version: 4.1.0
Author: KeenThemes
Website: http://www.keenthemes.com/
Contact: support@keenthemes.com
Follow: www.twitter.com/keenthemes
Like: www.facebook.com/keenthemes
Purchase: http://themeforest.net/item/metronic-responsive-admin-dashboard-template/4021469?ref=keenthemes
License: You must have a valid license purchased only from themeforest(the above link) in order to legally use the theme for your project.
-->
<!--[if IE 8]> <html lang="en" class="ie8 no-js"> <![endif]-->
<!--[if IE 9]> <html lang="en" class="ie9 no-js"> <![endif]-->
<!--[if !IE]><!-->
<html>
<!--<![endif]-->
<!-- BEGIN HEAD -->
<head>
    <meta charset="UTF-8"/>
    <title>My_pro:web|打印|</title>
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta content="width=monitor-width, initial-scale=1.0" name="viewport"/>
    <meta http-equiv="Content-type" content="text/html; charset=utf-8">
    <meta content="" name="description"/>
    <meta content="" name="author"/>
    <!-- BEGIN GLOBAL MANDATORY STYLES -->

    <%@include file="../../home/frame/frame_style.jsp"%>

    <!-- END THEME STYLES -->
    <link rel="shortcut icon" href="containers/favicon.ico"/>
    <link href="containers/css/dataTables.bootstrap.css" rel="stylesheet" type="text/css"/>

</head>

<body class="page-header-fixed">

<!-- BEGIN HEADER -->

<!-- END HEADER -->

<div class="clearfix">
</div>

    <div <%--class="page-content-wrapper"--%>>
        <div class="page-content">

            <input  type="hidden" id="page_id" name="page_id" value="flow_print">

            <div class="row" >
                <div class="col-md-12">
                    <!-- BEGIN SAMPLE TABLE PORTLET-->
                    <div class="portlet">
                        <div class="portlet-title">
                            <div class="caption">
                                <i class="fa fa-bell-o"></i>车流量统计表
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
                                <table class="table table-striped table-bordered table-advance table-hover">
                                    <thead>
                                    <tr>
                                        <th class="hidden-xs">
                                            <i class="fa fa-briefcase"></i> 序号
                                        </th>
                                        <th>
                                            <i class="fa fa-user"></i> 抓拍路段
                                        </th>
                                        <th>
                                            <i class="fa fa-shopping-cart"></i> 开始统计时间
                                        </th>

                                        <th class="hidden-xs">
                                            <i class="fa fa-briefcase"></i> 结束统计时间
                                        </th>
                                        <th >
                                            <i class="fa fa-user"></i> 车流量数据
                                        </th>

                                    </tr>
                                    </thead>


                                    <tbody id ="print_list">
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    <!-- END SAMPLE TABLE PORTLET-->
                </div>
            </div>



            <!-- END PAGE CONTENT-->
        </div>
    </div>
    <!-- END CONTENT -->

    <!-- BEGIN SIDEBAR -->


</div>
<!-- END CONTAINER -->

<!-- BEGIN FOOTER -->


<!-- BEGIN JAVASCRIPT -->
<%@include file="../../home/frame/frame_javascript.jsp"%>
<script src="containers/js/flow.js" type="text/javascript"></script>
<script src="../../assets/js/dataTables.bootstrap.js" type="text/javascript"></script>
<script src="../../assets/js/jquery.dataTables.min.js" type="text/javascript"></script>


</body>


</html>

