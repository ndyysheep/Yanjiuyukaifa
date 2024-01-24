<%--
  Created by IntelliJ IDEA.
  User: CornerGjr
  Date: 2023/11/27
  Time: 23:39
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%
    String Name="";
    String Email="";
    String MobileNumber="";
    String occupation="";
    String NickName="";
    String avatar="";
    if(session.getAttribute("user_name") != null)
        Name =session.getAttribute("user_name").toString();
    if(session.getAttribute("email") != null)
        Email =session.getAttribute("email").toString();
    if(session.getAttribute("mobile_number") != null)
        MobileNumber =session.getAttribute("mobile_number").toString();
    if(session.getAttribute("occupation") != null)
        occupation =session.getAttribute("occupation").toString();
    if(session.getAttribute("nickname") != null)
        NickName =session.getAttribute("nickname").toString();
    if(session.getAttribute("avatar") != null)
        avatar = session.getAttribute("avatar").toString();
%>
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
                    <a href="page_todo.html">
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