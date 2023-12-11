package flow.file;

import flow.dao.FlowDao;
import monitor.dao.Data;
import monitor.dao.MySQLDao;
import org.json.JSONException;
import org.json.JSONObject;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.sql.SQLException;
import java.text.SimpleDateFormat;
import java.util.*;

public class FlowServletAction extends HttpServlet {

    String module = "flow";
    String sub = "file";
    Data data = null;

    public void showDebug(String msg) {
        System.out.println("[" + (new SimpleDateFormat("yyyy-MM-dd HH:mm:ss")).format(new Date()) + "][" + module + "/"
                + sub + "/ServletAction]" + msg);
    }

    /**
     * 处理顺序：先是service，后根据情况doGet或者doPost
     */
    public void service(HttpServletRequest request, HttpServletResponse response) throws IOException, ServletException {

        try {

            processAction(request, response);

        } catch (JSONException e) {

            e.printStackTrace();

        }

    }

    /*
     * ========================================函数分流
     * 开始========================================
     */
    public void processAction(HttpServletRequest request, HttpServletResponse response)
            throws IOException, JSONException {
        HttpSession session = request.getSession();
        request.setCharacterEncoding("UTF-8");
        // 设置以下头信息允许跨域
        response.setHeader("Access-Control-Allow-Origin", "*");
        response.setHeader("Access-Control-Allow-Methods", "*");
        response.setHeader("Access-Control-Max-Age", "3600");
        response.setHeader("Access-Control-Allow-Headers", "*");
        response.setHeader("Access-Control-Allow-Credentials", "true");
        data = getPageParameters(request, response);
        String action = data.getParam().getString("action");

        boolean actionOk = false;
        int resultCode = 0;
        String resultMsg = "ok";
        JSONObject json = new JSONObject();
        showDebug("[processAction]收到的action是：" + action);

        if (action == null) {
            resultMsg = "传递过来的action是NULL";
        } else {
            json.put("action", action);
            json.put("result_code", 0);
            json.put("result_msg", "ok");

            // 这几个常规增删改查功能
            if (action.equals("get_flow_record")) {
                actionOk = true;

                try {

                    getFlowRecord(request, response, json);

                } catch (Exception e) {

                    e.printStackTrace();

                }

            }

            if (action.equals("view_flow_record")) {
                actionOk = true;

                try {

                    viewFlowRecord(request, response, json);

                } catch (Exception e) {

                    e.printStackTrace();

                }

            }

            if (action.equals("add_flow_record")) {
                actionOk = true;
                try {

                    addFlowRecord(request, response, json);

                } catch (JSONException e) {

                    e.printStackTrace();

                } catch (Exception e) {

                    e.printStackTrace();

                }

            }

            if (action.equals("modify_flow_record")) {
                actionOk = true;
                try {

                    modifyFlowRecord(request, response, json);

                } catch (Exception e) {

                    e.printStackTrace();

                }

            }

            if (action.equals("delete_flow_record")) {
                actionOk = true;
                try {

                    deleteFlowRecord(request, response, json);

                } catch (Exception e) {

                    e.printStackTrace();

                }

            }

            if (action.equals("query_flow_record")) {
                actionOk = true;

                try {

                    getQueryRecord(request, response, json);

                } catch (Exception e) {

                    e.printStackTrace();

                }

            }

            if (action.equals("update_record")) {
                actionOk = true;
                try {

                    updateRecord(request, response, json);

                } catch (Exception e) {

                    e.printStackTrace();

                }

            }

            if (action.equals("edit_record")) {
                actionOk = true;

                try {

                    modifyFlowRecordForView(request, response, json);

                } catch (Exception e) {

                    e.printStackTrace();

                }

            }

            if (action.equals("flow_statistics")) {
                actionOk = true;

                try {

                    getStatisticsRecord(request, response, json);

                } catch (Exception e) {

                    e.printStackTrace();

                }

            }

            if (action.equals("export_record")) {
                actionOk = true;

                try {

                    exportFlowRecord(request, response, json);

                } catch (Exception e) {

                    e.printStackTrace();

                }

            }

            if (action.equals("flow_print")) {
                actionOk = true;

                try {

                    printFlowRecord(request, response, json);

                } catch (Exception e) {

                    e.printStackTrace();

                }

            }


            try {

                responseBack(request, response, data, json);

            } catch (JSONException e) {

                e.printStackTrace();

            }

        }

    }

    /*
     * ========================================函数分流结束========================================
     */
    /*
     * ========================================公共函数开始========================================
     */
    private Data getPageParameters(HttpServletRequest request, HttpServletResponse response) throws JSONException {
        Data data = new Data();
        HttpSession session = request.getSession();
        /*----------------------------------------获取所有表单信息 开始----------------------------------------*/
        showDebug(
                "[getPageParameters]---------------------"
                        + "-------------------获取所有表单信息 开始"
                        + "----------------------------------------");
        JSONObject param = data.getParam();
        Enumeration requestNames = request.getParameterNames();

        for (Enumeration e = requestNames; e.hasMoreElements(); ) {
            String thisName = e.nextElement().toString();
            String thisValue = request.getParameter(thisName);
            showDebug("[getPageParameters]" + thisName + "=" + thisValue);
            param.put(thisName, thisValue);
        }

        showDebug("[getPageParameters]data的Param=" + data.getParam().toString());
        showDebug(
                "[getPageParameters]----------------------------------------获取所有表单信息 完毕----------------------------------------");
        /*----------------------------------------获取所有表单信息 完毕----------------------------------------*/
        return data;
    }

    private void responseBack(HttpServletRequest request, HttpServletResponse response, Data data, JSONObject json)
            throws JSONException {
        /*----------------------------------------获取所有服务器端信息 开始----------------------------------------*/
        boolean isAjax = true;
        if (request.getHeader("x-requested-with") == null
                || request.getHeader("x-requested-with").equals("com.tencent.mm")) {
            isAjax = false;
        } // 判断是异步请求还是同步请求，腾讯的特殊

        // 如果有参数就另外处理
        if (data.getParam().has("ajax") && data.getParam().getString("ajax").equals("true")) {
            isAjax = true;
        }
        ;

        json.put("ajax", isAjax);

        /*----------------------------------------获取所有服务器端信息 结束----------------------------------------*/
        if (json.has("ajax") && json.getBoolean("ajax")) {
            showDebug("[responseBack]ajax方式返回数据，页面局部刷新");
            response.setContentType("application/json; charset=UTF-8");

            try {

                response.getWriter().print(json);
                response.getWriter().flush();
                response.getWriter().close();

            } catch (IOException e) {

                e.printStackTrace();

            }

        } else {
            showDebug("[responseBack]跳转方式返回数据，页面跳转到指定页面");
            String action = json.getString("action");
            String errorNo = "0";
            String errorMsg = "ok";
            String url = module + "/" + sub + "/result.jsp?action=" + action + "&result_code=" + errorNo
                    + "&result_msg=" + errorMsg;

            if (json.has("redirect_url")) {
                url = json.getString("redirect_url");
            }

            try {

                response.sendRedirect(url);

            } catch (IOException e) {

                e.printStackTrace();

            }

        }
    }

    /*
     * ========================================公共函数结束========================================
     */
    /*
     * ========================================MySQL HTTP操作通用函数 开始========================================
     */
    private void updateRecord(HttpServletRequest request, HttpServletResponse response, JSONObject json)
            throws JSONException, SQLException {
        MySQLDao dao = new MySQLDao();
        dao.updateRecord(data, json);
    }

    /*
     * ========================================MySQL HTTP操作通用函数 结束========================================
     */
    /*
     * ========================================CRUD业务函数 开始========================================
     */
    private void getFlowRecord(HttpServletRequest request, HttpServletResponse response, JSONObject json)
            throws JSONException, SQLException {
        FlowDao dao = new FlowDao();
        dao.getFlowRecord(data, json);
    }

    private void viewFlowRecord(HttpServletRequest request, HttpServletResponse response, JSONObject json)
            throws JSONException, SQLException {
        FlowDao dao = new FlowDao();
        dao.viewFlowRecord(data, json);
    }

    private void getQueryRecord(HttpServletRequest request, HttpServletResponse response, JSONObject json)
            throws JSONException, SQLException {
        FlowDao dao = new FlowDao();
        dao.getQueryRecord(data, json);
    }

    private void modifyFlowRecord(HttpServletRequest request, HttpServletResponse response, JSONObject json)
            throws JSONException, SQLException {
        FlowDao dao = new FlowDao();
        dao.modifyDeviceRecord(data, json);
    }

    private void modifyFlowRecordForView(HttpServletRequest request, HttpServletResponse response, JSONObject json)
            throws JSONException, SQLException {
        FlowDao dao = new FlowDao();
        dao.modifyDeviceRecordForView(data, json);
    }

    private void deleteFlowRecord(HttpServletRequest request, HttpServletResponse response, JSONObject json)
            throws JSONException, SQLException {
        FlowDao dao = new FlowDao();
        dao.deleteDeviceRecord(data, json);
    }

    private void addFlowRecord(HttpServletRequest request, HttpServletResponse response, JSONObject json)
            throws JSONException, SQLException {
        FlowDao dao = new FlowDao();
        dao.addDeviceRecord(data, json);
    }


    private void getStatisticsRecord(HttpServletRequest request, HttpServletResponse response, JSONObject json)
            throws JSONException, SQLException {
        FlowDao dao = new FlowDao();
        dao.getRecordForStatisticsFlowSum(data, json);
        dao.getRecordForStatisticsFlow(data,json);
    }

    private void exportFlowRecord(HttpServletRequest request, HttpServletResponse response, JSONObject json)
            throws JSONException, SQLException, IOException {
        FlowDao dao = new FlowDao();
        Data data = getPageParameters(request, response);
        // 获取设备信息
        dao.getFlowRecord(data, json);

        // 下载操作
        dao.getExportFlowRecordToTxt(json, data);
        dao.getExportFlowRecordToExcel(json, data);


    }

    private void printFlowRecord(HttpServletRequest request, HttpServletResponse response, JSONObject json)
            throws JSONException, SQLException, IOException {
        FlowDao dao = new FlowDao();
        Data data = getPageParameters(request, response);
        dao.getFlowRecord(data, json);
    }

    /*
     * ========================================CRUD业务函数 结束========================================
     */
}