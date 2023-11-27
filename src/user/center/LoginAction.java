
package user.center;
/*
 * 待完成：用MVC模式分开DB和Action操作
 * 增删改查看导印统功能的实现
 */

import monitor.dao.Data;
import user.dao.UserDao;
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

public class LoginAction extends HttpServlet {
    String module = "monitor";
    String sub = "file";

    String dbName = "copy";
    Data data = null;
    public void showDebug(String msg) {
        System.out.println("[" + (new SimpleDateFormat("yyyy-MM-dd HH:mm:ss")).format(new Date()) + "][" + module + "/"
                + sub + "/LoginAction]" + msg);
    }

    /*
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
            throws IOException, ServletException, JSONException {
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
            //

            if (action.equals("login")) {
                actionOk = true;
                try {
                    login(request, response, json);
                } catch (JSONException e) {
                    e.printStackTrace();
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
     * ========================================函数分流
     * 结束========================================
     */
    /*
     * ========================================公共函数
     * 开始========================================
     */
    private Data getPageParameters(HttpServletRequest request, HttpServletResponse response) throws JSONException {
        Data data = new Data();
        HttpSession session = request.getSession();
        /*----------------------------------------获取所有表单信息 开始----------------------------------------*/
        showDebug(
                "[getPageParameters]----------------------------------------获取所有表单信息 开始----------------------------------------");
        JSONObject param = data.getParam();
        Enumeration requestNames = request.getParameterNames();

        for (Enumeration e = requestNames; e.hasMoreElements();) {
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
     * ========================================公共函数
     * 结束========================================
     */

    /*
     * ========================================CRUD业务函数
     * 开始========================================
     */

    private void login(HttpServletRequest request, HttpServletResponse response, JSONObject json)
            throws JSONException, SQLException {
        UserDao dao = new UserDao();
        Data data = getPageParameters(request, response);
        showDebug("收到数据:" + data.getParam().getString("username"));
        showDebug("收到数据:" + data.getParam().getString("password"));

        dao.login(dbName, data, json);

        if (json.getInt("result_code") == 0) {
            json.put("redirect_url", "home/main/index.jsp");
        } else {
            json.put("redirect_url", "home/main/login_error.jsp");
        }

    }
    /*
     * ========================================CRUD业务函数
     * 结束========================================
     */

}
