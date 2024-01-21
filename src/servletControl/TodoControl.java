package servletControl;

import DBControl.DB;
import org.json.JSONException;
import org.json.JSONObject;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.math.BigInteger;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.text.SimpleDateFormat;
import java.util.*;
public class TodoControl extends HttpServlet {

    private DB db;
    private Object tid;
    public void init() throws ServletException {
        db = new DB("101.35.232.25:3306","tmxq","123456","yjykfsj8");
    }
    private String file = "servletControl/TodoControl";
    public void service(HttpServletRequest request, HttpServletResponse response) throws IOException, ServletException {
        try {
            processAction(request,response);
        } catch (JSONException e) {
            e.printStackTrace();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    private void processAction(HttpServletRequest request, HttpServletResponse response) throws IOException, JSONException, SQLException {
        JSONObject rtJson = new JSONObject();

        HttpSession session = request.getSession();
        tid = session.getAttribute("tid");
        JSONObject params = getParams(request,response);


        String type = "none";
        if(params.has("type")){type=params.getString("type");}

        switch (type)
        {
            case "getUserInfo":
                getUserInfoEvent(request,response,rtJson);
                break;
            case "setUserInfo":
                setUserInfoEvent(request,response,rtJson,params);
                break;
            case "getUsersList":
                getUsersListEvent(request,response,rtJson,params);
                break;
            case "delete":
                deleteUserEvent(request,response,rtJson,params);
                break;
            case "modify":
                modifyUserEvent(request,response,rtJson,params);
                break;
            case "add":
                addUserEvent(request,response,rtJson,params);
                break;
            case "search":
                searchUserEvent(request,response,rtJson,params);
                break;
            default:
                break;
        }

        ResponseBack(request,response,params,rtJson);
    }




    private void ResponseBack(HttpServletRequest request,HttpServletResponse response,JSONObject param,JSONObject resJson) throws JSONException {
        JSONObject res = new JSONObject();
        // 判断是否是ajax方式
        boolean isAjax = true;
        if(request.getHeader("x-requested-with") == null || request.getHeader("x-requested-with").equals("com.tencent.mm"))
        {
            isAjax = false;
        }
        if(param.has("ajax") && param.getString("ajax").equals("true"))
        {
            isAjax = true;
        }

        res = resJson;
        res.put("ajax",isAjax);
        res.put("ResultCode",200);

        if(resJson.has("ajax") && resJson.getBoolean("ajax")){
            showDebug("ResponseBack","ajax方式返回数据，页面局部刷新");
            response.setContentType("application/json; charset=UTF-8");
            try {
                response.getWriter().print(res);
                response.getWriter().flush();
                response.getWriter().close();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }else{
            showDebug("ResponseBack","跳转方式返回数据，页面跳转到指定页面");
            String errorNo="0";
            String errorMsg="ok";
            String url="";
            try {
                if(resJson.has("redirect_url"))
                {
                    url=resJson.getString("redirect_url");
                    response.sendRedirect(url);
                }
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }


    // 事件开始
    private void searchUserEvent(HttpServletRequest request, HttpServletResponse response, JSONObject rtJson, JSONObject params) throws JSONException, SQLException {
        db.Connect();
        String sql = "select todo_id,user_name,nickname,todo,todo_time,create_time,todo_notes from todo";
        String user_name ="";
        String nickname="";
        String todo ="";
        String todo_time="";
        String todo_notes="";
        String set =" where ";
        boolean hasparam = false;
        user_name = params.getString("user_name");

        if(user_name !="")
        {
            set += "user_name='" + user_name +"'";
            hasparam = true;
        }
        nickname = params.has("nickname") ? params.getString("nickname"): "";
        if(nickname !="")
        {
            if(hasparam == true)
                set += " and nickname='" + nickname +"'";
            else
            {
                set+=" nickname='" + nickname +"'";
                hasparam = true;
            }
        }
        todo = params.has("todo") ?  params.getString("todo") :"";
        if(todo !="")
        {
            if(hasparam == true)
                set += " and todo='" + todo+"'";
            else
            {
                set+=" todo='" + todo+"'";
                hasparam = true;
            }
        }
        todo_time =params.has("todo_time") ?  params.getString("todo_time") :"";
        if(todo_time !="")
        {
            if(hasparam == true)
                set += " and todo_time='" + todo_time+"'";
            else
            {
                set+=" todo_time='" + todo_time+"'";
                hasparam = true;
            }
        }
        todo_notes = params.has("todo_notes") ? params.getString("todo_notes") :"";
        if(todo_notes !="")
        {
            if(hasparam == true)
                set += " and todo_notes='" + todo_notes+"'";
            else
            {
                set+=" todo_notes='" + todo_notes+"'";
                hasparam = true;
            }
        }
        if(hasparam)
        {
            sql+=set;
        }
        showDebug("searchUserEvent",sql);
        ResultSet rs = db.ExecuteQuery(sql);
        ResultSetMetaData rsmd = rs.getMetaData();
        List<Map<String,Object>> res = new ArrayList<Map<String,Object>>();
        while(rs.next())
        {
            Map<String,Object> rowData = new HashMap<String,Object>();
            for(int i = 0; i < rsmd.getColumnCount(); ++i)
            {
                rowData.put(rsmd.getColumnName(i + 1),rs.getObject(i + 1));
            }
            res.add(rowData);
        }
        rtJson.put("data",res);
        showDebug("searchUserEvent",res.toString());
        db.Close();
    }
    private void addUserEvent(HttpServletRequest request, HttpServletResponse response, JSONObject rtJson, JSONObject params) throws JSONException, SQLException {
        db.Connect();
        db.AddtoTodo(params);
        db.Close();

    }
    private void modifyUserEvent(HttpServletRequest request, HttpServletResponse response, JSONObject rtJson, JSONObject params) throws JSONException, SQLException {
        String todo_notes = params.has("todo_notes") ? params.getString("todo_notes") : null;
        String user_name=params.has("user_name") ? params.getString("user_name"):null;
        String nickname=params.has("nickname") ? params.getString("nickname"):null;
        String todo_time=params.has("todo_time") ? params.getString("todo_time"):null;
        String todo = params.has("todo") ? params.getString("todo"):null;
        String tid=params.has("tid") ? params.getString("tid"):null;

        String sql = "update todo set ";
        String set = "";
        if(todo_notes != null)
        {
            set += "todo_notes='"+todo_notes + "',";
        }
        if(user_name != null)
        {
            set += "username='"+user_name + "',";
        }
        if(nickname != null)
        {
            set += "nickname='"+nickname + "',";
        }
        if(todo_time != null)
        {
            set += "todo_time='"+todo_time + "',";
        }
        if(todo != null)
        {
            set += "todo='"+todo + "',";
        }
        if(set != "")
        {
            set = set.substring(0, set.length() - 1);
            sql = sql + set;
            sql +=" where tid="+tid;
        }
        else
        {
            rtJson.put("error","nothing is delivered");
            return;
        }
        showDebug("modifyUserEvent",sql);
        db.Connect();
        db.ExecuteUpdate(sql);
        db.Close();

    }
    private void deleteUserEvent(HttpServletRequest request, HttpServletResponse response, JSONObject rtJson, JSONObject params) throws JSONException {
        String todo_id = params.getString("tid");
        db.Connect();
        String sql = "delete from todo where todo_id='"+ todo_id + "'";
        db.ExecuteUpdate(sql);
        db.Close();
    }
    private void getUserInfoEvent(HttpServletRequest request, HttpServletResponse response,JSONObject rtJson) throws SQLException, JSONException {

    }
    private void setUserInfoEvent(HttpServletRequest request, HttpServletResponse response, JSONObject rtJson, JSONObject params) throws JSONException {
        showDebug("setUserInfoEvent",params.toString());
        db.Connect();
        db.UpdatetoDB(params,request.getSession());
        db.Close();
    }
    private void getUsersListEvent(HttpServletRequest request, HttpServletResponse response, JSONObject rtJson, JSONObject params) throws SQLException, JSONException {
        db.Connect();
        String sql = "select todo_id,user_name,nickname,todo_time,todo_notes,create_time,todo from todo";
        ResultSet rs = db.ExecuteQuery(sql);
        ResultSetMetaData rsmd = rs.getMetaData();
        List<Map<String,Object>> res = new ArrayList<Map<String,Object>>();
        while(rs.next())
        {
            Map<String,Object> rowData = new HashMap<String,Object>();
            for(int i = 0; i < rsmd.getColumnCount(); ++i)
            {
                rowData.put(rsmd.getColumnName(i + 1),rs.getObject(i + 1));
            }
            res.add(rowData);
        }
        rtJson.put("data",res);
        showDebug("getUsersListEvent",res.toString());
        db.Close();
    }
    // 事件结束
    public void showDebug(String method,String message) {
        System.out.println("["+(new SimpleDateFormat("yyyy-MM-dd HH:mm:ss")).format(new Date())+"]["+file+"/"+method+"]"+message);
    }
    private JSONObject getParams(HttpServletRequest request, HttpServletResponse response) throws IOException, JSONException {
        Enumeration requestParameterNames =request.getParameterNames();
        JSONObject params = new JSONObject();
        for(;requestParameterNames.hasMoreElements();)
        {
            String name = requestParameterNames.nextElement().toString();
            String value = request.getParameter(name);
            if(name.equals("password"))
            {
                value = getMD5Str(value);
            }
            params.put(name,value);
        }
        showDebug("getParams",params.toString());
        return params;
    }
    public String getMD5Str(String str) {
        byte[] digest = null;
        try {
            MessageDigest md5 = MessageDigest.getInstance("md5");
            digest = md5.digest(str.getBytes("utf-8"));
        } catch (NoSuchAlgorithmException e) {
            e.printStackTrace();
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
        }
//16是表示转换为16进制数
        String md5Str = new BigInteger(1, digest).toString(16);
        return md5Str;
    }
}
