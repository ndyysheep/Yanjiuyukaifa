<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
    response.sendRedirect("home/main/login.jsp");
%>
<button onclick="javascript:window.location.href='monitor/file/device_list.jsp'">设备管理</button>
<button onclick="javascript:window.location.href='monitor/file/device_file.jsp'">文件上传</button>