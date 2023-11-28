
package user.dao;

import monitor.dao.Data;
import monitor.dao.Db;
import org.json.JSONException;
import org.json.JSONObject;

import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.text.SimpleDateFormat;
import java.util.*;

public class UserDao {
    public void showDebug(String msg) {
        System.out.println(
                "[" + (new SimpleDateFormat("yyyy-MM-dd HH:mm:ss")).format(new Date()) + "][user/dao/Db]" + msg);
    }

    public void login(String dbName, Data data, JSONObject json) throws JSONException, SQLException {
        /*--------------------获取变量 开始--------------------*/
        String resultMsg = "ok";
        int resultCode = 0;
        List jsonList = new ArrayList();
        String userName = data.getParam().getString("username");
        String password = data.getParam().getString("password");
        String action = data.getParam().getString("action");
        /*--------------------获取变量 完毕--------------------*/
        /*--------------------数据操作 开始--------------------*/
        Db queryDb = new Db(dbName);
        String sql = "select * from user_file where login_id='" + userName + "' and password='" + password + "'";
        showDebug("[queryRecord]构造的SQL语句是：" + sql);

        try {

            ResultSet rs = queryDb.executeQuery(sql);
            ResultSetMetaData rsmd = rs.getMetaData();
            int fieldCount = rsmd.getColumnCount();

            if (!rs.next()) {
                resultCode = 10;
                resultMsg = "登录失败，请核对用户名和密码!";
            }

            rs.close();

        } catch (Exception e) {

            e.printStackTrace();
            showDebug("[queryRecord]查询数据库出现错误：" + sql);
            resultCode = 10;
            resultMsg = "查询数据库出现错误！" + e.getMessage();

        }
        queryDb.close();
        /*--------------------数据操作 结束--------------------*/
        /*--------------------返回数据 开始--------------------*/
        json.put("aaData", jsonList);
        json.put("action", action);
        json.put("result_msg", resultMsg); // 如果发生错误就设置成"error"等
        json.put("result_code", resultCode); // 返回0表示正常，不等于0就表示有错误产生，错误代码
        /*--------------------返回数据 结束--------------------*/
    }

}