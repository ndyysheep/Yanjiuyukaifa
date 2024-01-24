<%@ page import="org.apache.poi.ss.formula.functions.Na" %>
<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%
	String Name="";
	String avatar="";
	if(session.getAttribute("user_name") != null)
		Name =session.getAttribute("user_name").toString();
	if(session.getAttribute("avatar") != null)
		avatar = session.getAttribute("avatar").toString();
	String role = "";
	if(session.getAttribute("role_id") != null)
	{
		int id = Integer.parseInt(session.getAttribute("role_id").toString());
		if(id == 3)
		{
			role="普通用户";
		}
		else if(id == 2)
		{
			role="管理员";
		}
	}
%>
<!DOCTYPE html>

<%--Template Name: Metronic - Responsive Admin Dashboard Template build with Twitter Bootstrap 3.3.5--%>
<%--Version: 4.1.0--%>
<%--Author: KeenThemes--%>
<%--Website: http://www.keenthemes.com/--%>
<%--Contact: support@keenthemes.com--%>
<%--Follow: www.twitter.com/keenthemes--%>
<%--Like: www.facebook.com/keenthemes--%>
<%--Purchase: http://themeforest.net/item/metronic-responsive-admin-dashboard-template/4021469?ref=keenthemes--%>
<%--License: You must have a valid license purchased only from themeforest(the above link) in order to legally use the theme for your project.--%>
<%---->--%>
<!--[if IE 8]> <html lang="en" class="ie8 no-js"> <![endif]-->
<!--[if IE 9]> <html lang="en" class="ie9 no-js"> <![endif]-->
<!--[if !IE]><!-->
<html lang="en">
<!--<![endif]-->
<!-- BEGIN HEAD -->
<head>
	<meta charset="utf-8"/>
	<title>Metronic | Pages - 用户信息</title>
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
	<meta http-equiv="Content-type" content="text/html; charset=utf-8">
	<meta content="" name="description"/>
	<meta content="" name="author"/>
	<!-- BEGIN GLOBAL MANDATORY STYLES -->
	<link href="http://fonts.googleapis.com/css?family=Open+Sans:400,300,600,700&subset=all" rel="stylesheet" type="text/css">
	<link href="../../assets/global/plugins/font-awesome/css/font-awesome.min.css" rel="stylesheet" type="text/css">
	<link href="../../assets/global/plugins/simple-line-icons/simple-line-icons.min.css" rel="stylesheet" type="text/css">
	<link href="../../assets/global/plugins/bootstrap/css/bootstrap.min.css" rel="stylesheet" type="text/css">
	<link href="../../assets/global/plugins/uniform/css/uniform.default.css" rel="stylesheet" type="text/css">
	<link href="../../assets/global/plugins/bootstrap-switch/css/bootstrap-switch.min.css" rel="stylesheet" type="text/css"/>
	<!-- END GLOBAL MANDATORY STYLES -->
	<!-- BEGIN PAGE LEVEL STYLES -->
	<link href="../../assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css" rel="stylesheet" type="text/css"/>
	<link href="../../assets/admin/pages/css/profile.css" rel="stylesheet" type="text/css"/>
	<link href="../../assets/admin/pages/css/tasks.css" rel="stylesheet" type="text/css"/>
	<link rel="stylesheet" type="text/css" href="https://cdn.datatables.net/1.10.16/css/jquery.dataTables.css"/>
	<link rel="stylesheet" type="text/css" href="https://cdn.datatables.net/buttons/1.4.2/css/buttons.dataTables.css"/>
	<!-- END PAGE LEVEL STYLES -->
	<!-- BEGIN THEME STYLES -->
	<link href="../../assets/global/css/components-rounded.css" id="style_components" rel="stylesheet" type="text/css"/>
	<link href="../../assets/global/css/plugins.css" rel="stylesheet" type="text/css"/>
	<link href="../../assets/admin/layout4/css/layout.css" rel="stylesheet" type="text/css"/>
	<link id="style_color" href="../../assets/admin/layout4/css/themes/light.css" rel="stylesheet" type="text/css"/>
	<link href="../../assets/admin/layout4/css/custom.css" rel="stylesheet" type="text/css"/>
	<!-- END THEME STYLES -->
	<link rel="shortcut icon" href="favicon.ico"/>
</head>
<!-- END HEAD -->
<!-- BEGIN BODY -->
<!-- DOC: Apply "page-header-fixed-mobile" and "page-footer-fixed-mobile" class to body element to force fixed header or footer in mobile devices -->
<!-- DOC: Apply "page-sidebar-closed" class to the body and "page-sidebar-menu-closed" class to the sidebar menu element to hide the sidebar by default -->
<!-- DOC: Apply "page-sidebar-hide" class to the body to make the sidebar completely hidden on toggle -->
<!-- DOC: Apply "page-sidebar-closed-hide-logo" class to the body element to make the logo hidden on sidebar toggle -->
<!-- DOC: Apply "page-sidebar-hide" class to body element to completely hide the sidebar on sidebar toggle -->
<!-- DOC: Apply "page-sidebar-fixed" class to have fixed sidebar -->
<!-- DOC: Apply "page-footer-fixed" class to the body element to have fixed footer -->
<!-- DOC: Apply "page-sidebar-reversed" class to put the sidebar on the right side -->
<!-- DOC: Apply "page-full-width" class to the body element to have full width page without the sidebar menu -->
<body class="page-header-fixed page-sidebar-closed page-sidebar-closed-hide-logo">
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
			<!-- END HEADER SEARCH BOX -->
			<!-- BEGIN TOP NAVIGATION MENU -->
			<div class="top-menu">
				<ul class="nav navbar-nav pull-right">
					<li class="separator hide">
					</li>
					<!-- BEGIN NOTIFICATION DROPDOWN -->
					<!-- DOC: Apply "dropdown-dark" class after below "dropdown-extended" to change the dropdown styte -->
					<!-- END NOTIFICATION DROPDOWN -->
					<li class="separator hide">
					</li>
					<!-- BEGIN INBOX DROPDOWN -->
					<!-- DOC: Apply "dropdown-dark" class after below "dropdown-extended" to change the dropdown styte -->
					<!-- END INBOX DROPDOWN -->
					<li class="separator hide">
					</li>
					<!-- BEGIN TODO DROPDOWN -->
					<!-- DOC: Apply "dropdown-dark" class after below "dropdown-extended" to change the dropdown styte -->
					<!-- END TODO DROPDOWN -->
					<!-- BEGIN USER LOGIN DROPDOWN -->
					<!-- DOC: Apply "dropdown-dark" class after below "dropdown-extended" to change the dropdown styte -->
					<li class="dropdown dropdown-user dropdown-dark">
						<a href="javascript:;" class="dropdown-toggle" data-toggle="dropdown" data-hover="dropdown" data-close-others="true">
						<span class="username username-hide-on-mobile">
						<%=Name%> </span>
							<!-- DOC: Do not remove below empty space(&nbsp;) as its purposely used -->
							<img alt="" class="img-circle" src="<%=avatar%>"/>
						</a>
						<ul class="dropdown-menu dropdown-menu-default">
							<li>
								<a href="extra_profile.html">
									<i class="icon-user"></i> My Profile </a>
							</li>
							<li>
								<a href="page_calendar.html">
									<i class="icon-calendar"></i> My Calendar </a>
							</li>
							<li>
								<a href="inbox.html">
									<i class="icon-envelope-open"></i> My Inbox <span class="badge badge-danger">
								3 </span>
								</a>
							</li>
							<li>
								<a href="UserManage.jsp">
									<i class="icon-rocket"></i> My Tasks <span class="badge badge-success">
								7 </span>
								</a>
							</li>
							<li class="divider">
							</li>
							<li>
								<a href="extra_lock.html">
									<i class="icon-lock"></i> Lock Screen </a>
							</li>
							<li>
								<a href="../../Logout">
									<i class="icon-key"></i> Log Out </a>
							</li>
						</ul>
					</li>
					<!-- END USER LOGIN DROPDOWN -->
				</ul>
			</div>
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
	<div class="page-sidebar-wrapper">
		<!-- DOC: Set data-auto-scroll="false" to disable the sidebar from auto scrolling/focusing -->
		<!-- DOC: Change data-auto-speed="200" to adjust the sub menu slide up/down speed -->
		<div class="page-sidebar navbar-collapse collapse">
			<!-- BEGIN SIDEBAR MENU -->
			<!-- DOC: Apply "page-sidebar-menu-light" class right after "page-sidebar-menu" to enable light sidebar menu style(without borders) -->
			<!-- DOC: Apply "page-sidebar-menu-hover-submenu" class right after "page-sidebar-menu" to enable hoverable(hover vs accordion) sub menu mode -->
			<!-- DOC: Apply "page-sidebar-menu-closed" class right after "page-sidebar-menu" to collapse("page-sidebar-closed" class must be applied to the body element) the sidebar sub menu mode -->
			<!-- DOC: Set data-auto-scroll="false" to disable the sidebar from auto scrolling/focusing -->
			<!-- DOC: Set data-keep-expand="true" to keep the submenues expanded -->
			<!-- DOC: Set data-auto-speed="200" to adjust the sub menu slide up/down speed -->
			<ul class="page-sidebar-menu " data-keep-expanded="false" data-auto-scroll="true" data-slide-speed="200">
				<li class="start ">
					<a href="index.html">
						<i class="icon-home"></i>
						<span class="title">Dashboard</span>
					</a>
				</li>
				<li>
					<ul class="sub-menu">
						<li>
							<a href="ecommerce_index.html">
								<i class="icon-home"></i>
								Dashboard</a>
						</li>
						<li>
							<a href="ecommerce_orders.html">
								<i class="icon-basket"></i>
								Orders</a>
						</li>
						<li>
							<a href="ecommerce_orders_view.html">
								<i class="icon-tag"></i>
								Order View</a>
						</li>
						<li>
							<a href="ecommerce_products.html">
								<i class="icon-handbag"></i>
								Products</a>
						</li>
						<li>
							<a href="ecommerce_products_edit.html">
								<i class="icon-pencil"></i>
								Product Edit</a>
						</li>
					</ul>
				</li>
				<li>
					<a href="javascript:;">
						<i class="icon-rocket"></i>
						<span class="title">车辆检测数据</span>
						<span class="arrow open"></span>
					</a>
					<ul class="sub-menu">
						<li id ="monitor_list">
							<a href="../../maintain/monitor/monitor_list.jsp">
								<span class="badge badge-warning">new</span>车辆数据监控</a>
						</li>
						<li id ="monitor_statistics">
							<a href="../../maintain/monitor/monitor_statistics.jsp">
								车辆数据统计</a>
						</li>
						<li id ="illegal_data_list">
							<a href="../../maintain/illegal_data/illegal_data_list.jsp">
								违法数据监控</a>
						</li >
						<li id ="illegal_data_statistics">
							<a href="../../maintain/illegal_data/illegal_data_statistics.jsp">
								违法数据统计</a>
						</li>
						<li id="flow_list">
							<a href="../../maintain/count_of_lane/flow_list.jsp">
								车流量监控</a>
						</li>
						<li id="flow_data_statistics">
							<a href="../../maintain/count_of_lane/flow_statistics.jsp">
								车流量统计</a>
						</li>
					</ul>
				</li>
				<li>
					<a href="javascript:;">
						<i class="icon-diamond"></i>
						<span class="title">流量统计分析</span>
						<span class="arrow "></span>
					</a>
					<ul class="sub-menu">
						<li>
							<a href="../../maintain/comprehensive_statistics/daily_statistics.jsp">
								监测数据日报表</a>
						</li>
						<li>
							<a href="../../maintain/comprehensive_statistics/weekly_statistics.jsp">
								监测数据周报表</a>
						</li>
						<li>
							<a href="../../maintain/comprehensive_statistics/monthly_statistics.jsp">
								监测数据月报表</a>
						</li>
						<li>
							<a href="../../maintain/comprehensive_statistics/yearly_statistics.jsp">
								监测数据年报表</a>
						</li>
					</ul>
				</li>
				<li>
					<a href="javascript:;">
						<i class="icon-diamond"></i>
						<span class="title">视频分析</span>
						<span class="arrow "></span>
					</a>
					<ul class="sub-menu">
						<li id ="section">
							<a href="../../maintain/section/section.jsp">
								<span class="badge badge-warning">new</span>路段管理</a>
						</li>
						<li id ="weibo">
							<a href="../../maintain/weibohot/section.jsp">
								<span class="badge badge-warning">new</span>Api管理</a>
						</li>
						<li>
							<a href="../../maintain/monitor/video_statistics.jsp">
								交通视频分析</a>
						</li>
					</ul>
				</li>
				<!-- BEGIN ANGULARJS LINK -->
				<!-- END ANGULARJS LINK -->
				<li class="active open">
					<a href="../../main/userManage/extra_profile_account.jsp">
						<i class="icon-user-following"></i>
						<span class="title">用户信息</span>
					</a>
				</li>
				<li>
					<a href="../../main/WeatherReport/WeatherReporter.jsp">
						<i class="icon-pointer"></i>
						<span class="title">天气预报</span>
					</a>
				</li>
			</ul>
			<!-- END SIDEBAR MENU -->
		</div>
	</div>
	<!-- END SIDEBAR -->
	<!-- BEGIN CONTENT -->
	<div class="page-content-wrapper">
		<div class="page-content">
			<!-- BEGIN SAMPLE PORTLET CONFIGURATION MODAL FORM-->
			<div class="modal fade" id="portlet-config" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
				<div class="modal-dialog">
					<div class="modal-content">
						<div class="modal-header">
							<button type="button" class="close" data-dismiss="modal" aria-hidden="true"></button>
							<h4 class="modal-title">Modal title</h4>
						</div>
						<div class="modal-body">
							Widget settings form goes here
						</div>
						<div class="modal-footer">
							<button type="button" class="btn blue">Save changes</button>
							<button type="button" class="btn default" data-dismiss="modal">Close</button>
						</div>
					</div>
					<!-- /.modal-content -->
				</div>
				<!-- /.modal-dialog -->
			</div>
			<!-- /.modal -->
			<!-- END SAMPLE PORTLET CONFIGURATION MODAL FORM-->
			<!-- BEGIN PAGE HEADER-->
			<!-- BEGIN PAGE HEAD -->
			<div class="page-head">
				<!-- BEGIN PAGE TITLE -->
				<div class="page-title">
					<h1>用户管理</h1>
				</div>
				<!-- END PAGE TITLE -->
				<!-- BEGIN PAGE TOOLBAR -->
				<div class="page-toolbar">
					<!-- BEGIN THEME PANEL -->
					<div class="btn-group btn-theme-panel">
						<a href="javascript:;" class="btn dropdown-toggle" data-toggle="dropdown">
							<i class="icon-settings"></i>
						</a>
						<div class="dropdown-menu theme-panel pull-right dropdown-custom hold-on-click">
							<div class="row">
								<div class="col-md-4 col-sm-4 col-xs-12">
									<h3>THEME</h3>
									<ul class="theme-colors">
										<li class="theme-color theme-color-default active" data-theme="default">
											<span class="theme-color-view"></span>
											<span class="theme-color-name">Dark Header</span>
										</li>
										<li class="theme-color theme-color-light" data-theme="light">
											<span class="theme-color-view"></span>
											<span class="theme-color-name">Light Header</span>
										</li>
									</ul>
								</div>
								<div class="col-md-8 col-sm-8 col-xs-12 seperator">
									<h3>LAYOUT</h3>
									<ul class="theme-settings">
										<li>
											Theme Style
											<select class="layout-style-option form-control input-small input-sm">
												<option value="square" selected="selected">Square corners</option>
												<option value="rounded">Rounded corners</option>
											</select>
										</li>
										<li>
											Layout
											<select class="layout-option form-control input-small input-sm">
												<option value="fluid" selected="selected">Fluid</option>
												<option value="boxed">Boxed</option>
											</select>
										</li>
										<li>
											Header
											<select class="page-header-option form-control input-small input-sm">
												<option value="fixed" selected="selected">Fixed</option>
												<option value="default">Default</option>
											</select>
										</li>
										<li>
											Top Dropdowns
											<select class="page-header-top-dropdown-style-option form-control input-small input-sm">
												<option value="light">Light</option>
												<option value="dark" selected="selected">Dark</option>
											</select>
										</li>
										<li>
											Sidebar Mode
											<select class="sidebar-option form-control input-small input-sm">
												<option value="fixed">Fixed</option>
												<option value="default" selected="selected">Default</option>
											</select>
										</li>
										<li>
											Sidebar Menu
											<select class="sidebar-menu-option form-control input-small input-sm">
												<option value="accordion" selected="selected">Accordion</option>
												<option value="hover">Hover</option>
											</select>
										</li>
										<li>
											Sidebar Position
											<select class="sidebar-pos-option form-control input-small input-sm">
												<option value="left" selected="selected">Left</option>
												<option value="right">Right</option>
											</select>
										</li>
										<li>
											Footer
											<select class="page-footer-option form-control input-small input-sm">
												<option value="fixed">Fixed</option>
												<option value="default" selected="selected">Default</option>
											</select>
										</li>
									</ul>
								</div>
							</div>
						</div>
					</div>
					<!-- END THEME PANEL -->
				</div>
				<!-- END PAGE TOOLBAR -->
			</div>
			<!-- END PAGE HEAD -->
			<!-- BEGIN PAGE BREADCRUMB -->
			<ul class="page-breadcrumb breadcrumb">
				<li>
					<a href="index.html">Home</a>
					<i class="fa fa-circle"></i>
				</li>
				<li>
					<a href="extra_profile_account.jsp">用户信息</a>
				</li>
			</ul>
			<!-- END PAGE BREADCRUMB -->
			<!-- END PAGE HEADER-->
			<!-- BEGIN PAGE CONTENT-->
			<div class="row">
				<div class="col-md-12">
					<!-- BEGIN PROFILE SIDEBAR -->
					<div class="profile-sidebar" style="width: 250px;">
						<!-- PORTLET MAIN -->
						<div class="portlet light profile-sidebar-portlet">
							<!-- SIDEBAR USERPIC -->
							<div class="profile-userpic">
								<img src="<%=avatar%>" class="img-responsive" alt="">
							</div>
							<!-- END SIDEBAR USERPIC -->
							<!-- SIDEBAR USER TITLE -->
							<div class="profile-usertitle">
								<div class="profile-usertitle-name">
									<%=Name%>
								</div>
								<div class="profile-usertitle-job">
									<%=role%>
								</div>
							</div>
							<!-- END SIDEBAR USER TITLE -->
							<!-- SIDEBAR BUTTONS -->
							<div class="profile-userbuttons">
								<button type="button" class="btn btn-circle green-haze btn-sm">Follow</button>
								<button type="button" class="btn btn-circle btn-danger btn-sm">Message</button>
							</div>
							<!-- END SIDEBAR BUTTONS -->
							<!-- SIDEBAR MENU -->
							<div class="profile-usermenu">
								<ul class="nav">
									<li >
										<a href="extra_profile_account.jsp">
											<i class="icon-settings"></i>
											Account Settings </a>
									</li>
									<li class="active">
										<a href="UserManage.jsp">
											<i class="icon-check"></i>
											UserManage </a>
									</li>
									<li>
										<a href="todo.jsp">
											<i class="icon-check"></i>
											todo </a>
									</li>
								</ul>
							</div>
							<!-- END MENU -->
						</div>
						<!-- END PORTLET MAIN -->
						<!-- PORTLET MAIN -->

						<!-- END PORTLET MAIN -->
					</div>
					<!-- END BEGIN PROFILE SIDEBAR -->

					<!-- BEGIN PROFILE CONTENT -->
					<div class="profile-content">
						<div class="col-md-12">
							<!-- BEGIN EXAMPLE TABLE PORTLET-->
							<div class="portlet box blue-hoki">
								<div class="portlet-title">
									<div class="caption">
										<i class="fa fa-globe"></i>User List
									</div>
									<div class="tools">
									</div>
								</div>
								<div class="col-md-6">
									<div class="btn-group">
										<button id="adduser" class="btn green">
											Add New <i class="fa fa-plus"></i>
										</button>
									</div>
									<div class="btn-group">
										<button id="searchuser" class="btn green">
											search
										</button>
									</div>
								</div>
								<div class="portlet-body">
									<table class="table table-striped table-bordered table-hover" id="sample_1">
										<thead>
										<tr>
											<th>
												user name
											</th>
											<th>
												nick Name
											</th>
											<th>
												occupation
											</th>
											<th>
												permissions
											</th>
											<th>
												phone
											</th>
											<th>
												email
											</th>
											<th>
												create time
											</th>
											<th>
												Edit
											</th>
											<th>
												Delete
											</th>
										</tr>
										</thead>
										<tbody>

										</tbody>
									</table>
								</div>
							</div>
							<!-- END EXAMPLE TABLE PORTLET-->
						</div>
					</div>
					<!-- END PROFILE CONTENT -->
				</div>
			</div>
			<!-- END PAGE CONTENT-->
		</div>
	</div>
	<!-- END CONTENT -->
</div>
<!-- END CONTAINER -->
<!-- BEGIN FOOTER -->
<div class="page-footer">
	<div class="page-footer-inner">
		2014 &copy; Metronic by keenthemes. <a href="http://themeforest.net/item/metronic-responsive-admin-dashboard-template/4021469?ref=keenthemes" title="Purchase Metronic just for 27$ and get lifetime updates for free" target="_blank">Purchase Metronic!</a>
	</div>
	<div class="scroll-to-top">
		<i class="icon-arrow-up"></i>
	</div>
</div>
<!-- END FOOTER -->
<!-- BEGIN JAVASCRIPTS(Load javascripts at bottom, this will reduce page load time) -->
<!-- BEGIN CORE PLUGINS -->
<!--[if lt IE 9]>
<script src="../../assets/global/plugins/respond.min.js"></script>
<script src="../../assets/global/plugins/excanvas.min.js"></script>
<![endif]-->
<script src="../../assets/global/plugins/jquery.min.js" type="text/javascript"></script>
<script src="../../assets/global/plugins/jquery-migrate.min.js" type="text/javascript"></script>
<!-- IMPORTANT! Load jquery-ui.min.js before bootstrap.min.js to fix bootstrap tooltip conflict with jquery ui tooltip -->
<script src="../../assets/global/plugins/jquery-ui/jquery-ui.min.js" type="text/javascript"></script>
<script src="../../assets/global/plugins/bootstrap/js/bootstrap.min.js" type="text/javascript"></script>
<script src="../../assets/global/plugins/bootstrap-hover-dropdown/bootstrap-hover-dropdown.min.js" type="text/javascript"></script>
<script src="../../assets/global/plugins/jquery-slimscroll/jquery.slimscroll.min.js" type="text/javascript"></script>
<script src="../../assets/global/plugins/jquery.blockui.min.js" type="text/javascript"></script>
<script src="../../assets/global/plugins/jquery.cokie.min.js" type="text/javascript"></script>
<script src="../../assets/global/plugins/uniform/jquery.uniform.min.js" type="text/javascript"></script>
<script src="../../assets/global/plugins/bootstrap-switch/js/bootstrap-switch.min.js" type="text/javascript"></script>
<!-- END CORE PLUGINS -->
<!-- BEGIN PAGE LEVEL PLUGINS -->
<script src="../../assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.js" type="text/javascript"></script>
<script src="../../assets/global/plugins/jquery.sparkline.min.js" type="text/javascript"></script>
<!-- BEGIN PAGE LEVEL PLUGINS -->
<script type="text/javascript" src="../../assets/global/plugins/select2/select2.min.js"></script>
<script type="text/javascript" src="../../assets/global/plugins/datatables/media/js/jquery.dataTables.min.js"></script>
<script type="text/javascript" src="../../assets/global/plugins/datatables/plugins/bootstrap/dataTables.bootstrap.js"></script>


<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/jszip/2.5.0/jszip.js"></script>
<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.32/vfs_fonts.js"></script>
<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.32/pdfmake.js"></script>
<script type="text/javascript" src="https://cdn.datatables.net/1.10.16/js/jquery.dataTables.js"></script>
<script type="text/javascript" src="https://cdn.datatables.net/buttons/1.4.2/js/dataTables.buttons.js"></script>
<script type="text/javascript" src="https://cdn.datatables.net/buttons/1.4.2/js/buttons.flash.js"></script>
<script type="text/javascript" src="https://cdn.datatables.net/buttons/1.4.2/js/buttons.html5.js"></script>
<script type="text/javascript" src="https://cdn.datatables.net/buttons/1.4.2/js/buttons.print.js"></script>
<!-- END PAGE LEVEL PLUGINS -->
<!-- END PAGE LEVEL PLUGINS -->
<!-- BEGIN PAGE LEVEL SCRIPTS -->
<script src="../../assets/global/scripts/metronic.js" type="text/javascript"></script>
<script src="../../assets/admin/layout4/scripts/layout.js" type="text/javascript"></script>
<script src="../../assets/admin/layout4/scripts/demo.js" type="text/javascript"></script>
<script src="../../assets/admin/pages/scripts/profile.js" type="text/javascript"></script>
<script src="../../assets/global/plugins/jquery-validation/js/jquery.validate.min.js" type="text/javascript"></script>
<script src="../../assets/js/profileAccount.js" type="text/javascript"></script>
<script src="../../assets/admin/layout/scripts/layout.js" type="text/javascript"></script>
<script src="../../assets/admin/layout/scripts/quick-sidebar.js" type="text/javascript"></script>
<script src="../../assets/admin/layout/scripts/demo.js" type="text/javascript"></script>
<script src="../../assets/admin/pages/scripts/table-editable.js"></script>
<script src="../../assets/global/scripts/metronic.js" type="text/javascript"></script>
<script src="../../assets/admin/layout/scripts/layout.js" type="text/javascript"></script>
<script src="../../assets/admin/layout/scripts/quick-sidebar.js" type="text/javascript"></script>
<script src="../../assets/admin/layout/scripts/demo.js" type="text/javascript"></script>
<script src="../../assets/js/table-advanced.js"></script>
<!-- END PAGE LEVEL SCRIPTS -->
<script>
	jQuery(document).ready(function() {
		// initiate layout and plugins
		Metronic.init(); // init metronic core components
		Layout.init(); // init current layout
		Demo.init(); // init demo features\
		Profile.init(); // init page demo
		profileAccount.init();
		TableAdvanced.init();

	});
</script>
<!-- END JAVASCRIPTS -->
</body>
<!-- END BODY -->
</html>

<div class="modal fade draggable-modal" id="record_modify_div" name="record_modify_div" tabindex="-1" role="basic" aria-hidden="true">
	<div class="modal-dialog">
		<div class="modal-content">
			<div class="modal-header">
				<button type="button" class="close" data-dismiss="modal" aria-hidden="true"></button>
				<h4 class="modal-title">修改用户信息</h4>
			</div>
			<div class="modal-body">
				<div class="portlet-body form">
					<form id="modify_form" class="form-horizontal" role="form" >r
						<input type="hidden" id="uid" name="uid" value="">
						<div class="form-body">
							<div class="form-group">
								<label class="col-md-3 control-label">user name</label>
								<div class="col-md-9">
									<input type="text" class="form-control" placeholder="Enter text" id="user_name" name="user_name">
									<span class="help-block">
											输入 </span>
								</div>
							</div>
						</div>
						<div class="form-body">
							<div class="form-group">
								<label class="col-md-3 control-label">nick name</label>
								<div class="col-md-9">
									<input type="text" class="form-control" placeholder="Enter text" id="nickname" name="nickname">
									<span class="help-block">
											输入</span>
								</div>
							</div>
						</div>
						<div class="form-body">
							<div class="form-group">
								<label class="col-md-3 control-label">occupation</label>
								<div class="col-md-9">
									<input type="text" class="form-control" placeholder="Enter text" id="occupation" name="occupation">
									<span class="help-block">
											输入</span>
								</div>
							</div>
						</div>
						<div class="form-body">
							<div class="form-group">
								<label class="col-md-3 control-label">phone</label>
								<div class="col-md-9">
									<input type="text" class="form-control" placeholder="Enter text" id="mobile_number" name="mobile_number">
									<span class="help-block">
											输入</span>
								</div>
							</div>
						</div>
						<div class="form-body">
							<div class="form-group">
								<label class="col-md-3 control-label">email</label>
								<div class="col-md-9">
									<input type="text" class="form-control" placeholder="Enter text" id="email" name="email">
									<span class="help-block">
											输入 </span>
								</div>
							</div>
						</div>
						<div class="form-body">
							<div class="form-group">
								<label class="col-md-3 control-label">role type</label>
								<div class="col-md-9">
									<select name="role_id" id="modify_select" class="btn btn-default btn-sm dropdown-toggle">
										<option value="3">普通用户</option>
										<option value="2">管理员</option>
									</select>
								</div>
							</div>
						</div>
					</form>
				</div>
			</div>
			<div class="modal-footer">
				<button type="button" class="btn default" data-dismiss="modal">Close</button>
				<button type="button" class="btn blue" id="submit_button" name="submit_button">comfirm</button>
			</div>
		</div>
		<!-- /.modal-content -->
	</div>
	<!-- /.modal-dialog -->
</div>

<div class="modal fade draggable-modal" id="add_modify_div" name="add_modify_div" tabindex="-1" role="basic" aria-hidden="true">
	<div class="modal-dialog">
		<div class="modal-content">
			<div class="modal-header">
				<button type="button" class="close" data-dismiss="modal" aria-hidden="true"></button>
				<h4 class="modal-title">添加用户信息</h4>
			</div>
			<div class="modal-body">
				<div class="portlet-body form">
					<form id="add_form" class="form-horizontal" role="form" >r
						<input type="hidden" id="uid_add" name="uid" value="">
						<div class="form-body">
							<div class="form-group">
								<label class="col-md-3 control-label">user name</label>
								<div class="col-md-9">
									<input type="text" class="form-control" placeholder="Enter text"  name="username">
									<span class="help-block">
											输入 </span>
								</div>
							</div>
						</div>
						<div class="form-body">
							<div class="form-group">
								<label class="col-md-3 control-label">password</label>
								<div class="col-md-9">
									<input type="text" class="form-control" placeholder="Enter text"  name="password">
									<span class="help-block">
											输入 </span>
								</div>
							</div>
						</div>
						<div class="form-body">
							<div class="form-group">
								<label class="col-md-3 control-label">nick name</label>
								<div class="col-md-9">
									<input type="text" class="form-control" placeholder="Enter text"  name="nickname">
									<span class="help-block">
											输入</span>
								</div>
							</div>
						</div>
						<div class="form-body">
							<div class="form-group">
								<label class="col-md-3 control-label">occupation</label>
								<div class="col-md-9">
									<input type="text" class="form-control" placeholder="Enter text" name="occupation">
									<span class="help-block">
											输入</span>
								</div>
							</div>
						</div>
						<div class="form-body">
							<div class="form-group">
								<label class="col-md-3 control-label">phone</label>
								<div class="col-md-9">
									<input type="text" class="form-control" placeholder="Enter text" name="phone">
									<span class="help-block">
											输入</span>
								</div>
							</div>
						</div>
						<div class="form-body">
							<div class="form-group">
								<label class="col-md-3 control-label">email</label>
								<div class="col-md-9">
									<input type="text" class="form-control" placeholder="Enter text" name="email">
									<span class="help-block">
											输入 </span>
								</div>
							</div>
						</div>
						<div class="form-body">
							<div class="form-group">
								<label class="col-md-3 control-label">role type</label>
								<div class="col-md-9">
									<select name="role_id" class="btn btn-default btn-sm dropdown-toggle">
										<option value="3">普通用户</option>
										<option value="2">管理员</option>
									</select>
								</div>
							</div>
						</div>
					</form>
				</div>
			</div>
			<div class="modal-footer">
				<button type="button" class="btn default" data-dismiss="modal">Close</button>
				<button type="button" class="btn blue" id="add_button" name="add_button">Save changes</button>
			</div>
		</div>
		<!-- /.modal-content -->
	</div>
	<!-- /.modal-dialog -->
</div>

<div class="modal fade draggable-modal" id="search_div" name="search_div" tabindex="-1" role="basic" aria-hidden="true">
	<div class="modal-dialog">
		<div class="modal-content">
			<div class="modal-header">
				<button type="button" class="close" data-dismiss="modal" aria-hidden="true"></button>
				<h4 class="modal-title">查询用户信息</h4>
			</div>
			<div class="modal-body">
				<div class="portlet-body form">
					<form id="search_form" class="form-horizontal" role="form" >
						<div class="form-body">
							<div class="form-group">
								<label class="col-md-3 control-label">user name</label>
								<div class="col-md-9">
									<input type="text" class="form-control" placeholder="Enter text"  name="user_name">
									<span class="help-block">
											输入 </span>
								</div>
							</div>
						</div>
						<div class="form-body">
							<div class="form-group">
								<label class="col-md-3 control-label">nick name</label>
								<div class="col-md-9">
									<input type="text" class="form-control" placeholder="Enter text"  name="nickname">
									<span class="help-block">
											输入</span>
								</div>
							</div>
						</div>
						<div class="form-body">
							<div class="form-group">
								<label class="col-md-3 control-label">occupation</label>
								<div class="col-md-9">
									<input type="text" class="form-control" placeholder="Enter text" name="occupation">
									<span class="help-block">
											输入</span>
								</div>
							</div>
						</div>
						<div class="form-body">
							<div class="form-group">
								<label class="col-md-3 control-label">phone</label>
								<div class="col-md-9">
									<input type="text" class="form-control" placeholder="Enter text" name="mobile_number">
									<span class="help-block">
											输入</span>
								</div>
							</div>
						</div>
						<div class="form-body">
							<div class="form-group">
								<label class="col-md-3 control-label">email</label>
								<div class="col-md-9">
									<input type="text" class="form-control" placeholder="Enter text" name="email">
									<span class="help-block">
											输入 </span>
								</div>
							</div>
						</div>
						<div class="form-body">
							<div class="form-group">
								<label class="col-md-3 control-label">role type</label>
								<div class="col-md-9">
									<select name="role_id" class="btn btn-default btn-sm dropdown-toggle">
										<option value="3">普通用户</option>
										<option value="2">管理员</option>
										<option value="-1">不选择</option>
									</select>
								</div>
							</div>
						</div>
					</form>
				</div>
			</div>
			<div class="modal-footer">
				<button type="button" class="btn default" data-dismiss="modal">Close</button>
				<button type="button" class="btn blue" id="search_button" name="add_button">Save changes</button>
			</div>
		</div>
		<!-- /.modal-content -->
	</div>
	<!-- /.modal-dialog -->
</div>
