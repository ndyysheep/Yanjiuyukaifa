
package illegal.dao;

import monitor.dao.Data;
import monitor.dao.Db;
import monitor.file.MyExcel;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.text.SimpleDateFormat;
import java.util.*;

/**
 * @author CornerGjr
 */
public class IllegalDao {

    /*
     * 声明数据库名
     */
    private String dbName = "yjykfsj8";
    private String relationName = "record_info";

    private ArrayList<String> dbColomn = new Db(dbName).getColomns(relationName);

    // private int[] lines = new int[5];

    /**
     * 生成调试信息
     * 
     * @param msg 接收的第一个参数,主要调试信息
     */
    public void showDebug(String msg) {
        System.out.println(
                "[" + (new SimpleDateFormat("yyyy-MM-dd HH:mm:ss")).format(new Date()) + "][illegal/dao/Db]" + msg);
    }

    /**
     * 判断json对象存储的信息是否合法
     * 
     * @param param 接收的第一个参数,接收json对象信息
     * @param field 接收的第二个参数,接收json对象包含列名
     * @return 判断结果
     * @throws JSONException 抛出异常
     */
    private boolean checkParamValid(JSONObject param, String field) throws JSONException {
        boolean ok = false;
        System.out.println(param);
        ok = param.has(field) && param.getString(field) != null && !param.getString(field).isEmpty()
                && !param.getString(field).equals("undefined") && !param.getString(field).equals("null");
        return ok;
    }

    /**
     * join构建sql
     * 
     * @param table1 连接用第一个表
     * @param table2 连接用第二个表
     * @param key1 第一个表主键
     * @param key2 第二个表主键
     * @return 返回sql语句
     */
    private String createJoinSql(String table1, String table2, String key1, String key2) {
        String subSql = "";

        subSql += " join " + table2 + " on " + table1 + "." + key1 + " = " + table2 + "." + key2;

        return subSql;
    }

    /**
     * @param param
     * @param keyParam
     * @param where
     * @return
     * @throws JSONException
     */
    private String useWhere(JSONObject param, String keyParam, String where) throws JSONException {
        String subStr = where;

        if (checkParamValid(param, keyParam)) {
            if (!subStr.isEmpty()) {
                subStr = subStr + " and " + keyParam + " = '" + param.getString(keyParam) + "'";
            } else {
                subStr = keyParam + "='" + param.getString(keyParam) + "'";
            }
        }

        return subStr;
    }

    /**
     * 删除设备记录
     * 
     * @param data 接收的第一个参数,json对象中的数据信息
     * @param json 接收的第二个参数,json对象
     * @throws JSONException 抛出json类异常
     * @throws SQLException 抛出sql类异常
     */
    public void deleteIllegalRecord(Data data, JSONObject json) throws JSONException, SQLException {
        // 构造sql语句，根据传递过来的条件参数
        String id = data.getParam().has("id") ? data.getParam().getString("id") : null;

        if (id != null) {
            String sql = "delete from " + relationName + " where id=" + data.getParam().getString("id");
            data.getParam().put("sql", sql);
            updateRecord(data, json);
        }

    }

    public void modifyDeviceRecordForView(Data data, JSONObject json) throws JSONException, SQLException {
        // 构造sql语句，根据传递过来的条件参数
        String id = data.getParam().has("pk") ? data.getParam().getString("pk") : null;
        String _op = data.getParam().getString("name");

        if (id != null && _op != null) {
            String sql = "update " + relationName + " set " + _op + "='" + data.getParam().getString("value") + "'";
            sql += "where id=" + "'" + id + "'";
            data.getParam().put("sql", sql);
            updateRecord(data, json);

        }

    }

    /**
     * 查询记录
     */
    public void getIllegalRecord(Data data, JSONObject json) throws JSONException, SQLException {
        // 构造sql语句，根据传递过来的查询条件参数
        String sql = createGetRecordSql(data); // 构造sql语句，根据传递过来的查询条件参数
        data.getParam().put("sql", sql);
        queryRecord(data, json);
    }

    public void getQueryRecord(Data data, JSONObject json) throws JSONException, SQLException {
        // 构造sql语句，根据传递过来的查询条件参数
        String sql = createGetQueryRecordSql(data); // 构造sql语句，根据传递过来的查询条件参数
        data.getParam().put("sql", sql);
        queryRecord(data, json);
    }

    /**
     * 查询用,构建Sql语句
     * @param data json.data 字段信息
     * @return 返回构建好的Sql
     * @throws JSONException 抛出json类异常
     */
    public String createGetQueryRecordSql(Data data) throws JSONException {
        JSONObject param = data.getParam();

        String sql = "select * from " + relationName;
        sql += createJoinSql(relationName, "monitoring_data", "car_code", "car_code");
        String where = "";

        if (checkParamValid(param, "id")) {
            where = relationName + ".id=" + param.getString("id");
        }

        if (checkParamValid(param, "time_from") && checkParamValid(param, "time_to")) {

            if (!where.isEmpty()) {
                where += " and create_time between '" + param.getString("time_from") + "' and '"
                        + param.getString("time_to") + "'";
            } else {
                where = "create_time between '" + param.getString("time_from") + "' and '" + param.getString("time_to")
                        + "'";
            }

        }

        where = useWhere(param, "car_code", where);
        where = useWhere(param, "speed", where);

        if (checkParamValid(param, "location")) {

            if (!where.isEmpty()) {
                where = where + " and location like '%" + param.getString("location") + "%'";
            } else {
                where = "location like '%" + param.getString("location") + "%'";
            }

        }

        // 判断是否有条件
        if (!where.isEmpty()) {
            sql = sql + " where " + where;
        }

        if (checkParamValid(param, "order_by")) {
            sql = sql + " order by " + param.getString("order_by");
        }

        showDebug(sql);
        return sql;
    }

    /**
     * 这是一个样板的函数，可以拷贝做修改用
     */
    private void updateRecord(Data data, JSONObject json) throws JSONException {
        /*--------------------获取变量 开始--------------------*/
        JSONObject param = data.getParam();
        int resultCode = 0;
        String resultMsg = "ok";
        /*--------------------获取变量 完毕--------------------*/
        /*--------------------数据操作 开始--------------------*/
        Db updateDb = new Db(dbName);
        String sql = data.getParam().getString("sql");
        showDebug("[updateRecord]" + sql);
        updateDb.executeUpdate(sql);
        updateDb.close();
        /*--------------------数据操作 结束--------------------*/
        /*--------------------返回数据 开始--------------------*/
        json.put("result_msg", resultMsg); // 如果发生错误就设置成"error"等
        json.put("result_code", resultCode); // 返回0表示正常，不等于0就表示有错误产生，错误代码
        /*--------------------返回数据 结束--------------------*/
    }

    // 已解决
    private void queryRecord(Data data, JSONObject json) throws JSONException {
        /*--------------------获取变量 开始--------------------*/
        String resultMsg = "ok";
        int resultCode = 0;
        List jsonList = new ArrayList();
        List jsonColumnList = new ArrayList();
        /*--------------------获取变量 完毕--------------------*/
        /*--------------------数据操作 开始--------------------*/
        Db queryDb = new Db(dbName);
        String sql = data.getParam().getString("sql");
        showDebug("[queryRecord]构造的SQL语句是：" + sql);

        try {

            ResultSet rs = queryDb.executeQuery(sql);
            ResultSetMetaData rsmd = rs.getMetaData();
            int fieldCount = rsmd.getColumnCount();

            while (rs.next()) {
                Map map = new HashMap();

                for (int i = 0; i < fieldCount; i++) {
                    String columnName = rsmd.getColumnName(i + 1);
                    String contains = rs.getString(columnName);
                    map.put(columnName, contains);
                }

                jsonList.add(map);
            }

            rs.close();

            for (int i = 0; i < fieldCount; i++) {
                jsonColumnList.add(rsmd.getColumnLabel(i + 1));
            }

        } catch (Exception e) {

            e.printStackTrace();
            showDebug("[queryRecord]查询数据库出现错误：" + sql);
            resultCode = 10;
            resultMsg = "查询数据库出现错误！" + e.getMessage();

        }
        queryDb.close();
        /*--------------------数据操作 结束--------------------*/
        /*--------------------返回数据 开始--------------------*/
        json.put("aaColumn", jsonColumnList);
        json.put("aaData", jsonList);
        json.put("result_msg", resultMsg); // 如果发生错误就设置成"error"等
        json.put("result_code", resultCode); // 返回0表示正常，不等于0就表示有错误产生，错误代码
        /*--------------------返回数据 结束--------------------*/
    }


    /**
     * 静态数据统计
     * @param data data字段信息
     * @param json json对象
     * @throws JSONException 抛出json类异常
     */
    public void toStatistics(Data data, JSONObject json) throws JSONException {
        /*--------------------获取变量 开始--------------------*/
        String resultMsg = "ok";
        Calendar cal = Calendar.getInstance();
        cal.add(Calendar.DATE, -1);
        String timeFrom = (new SimpleDateFormat("yyyy-MM-dd 00:00:00")).format(cal.getTime());
        String timeTo = (new SimpleDateFormat("yyyy-MM-dd 23:59:59")).format(cal.getTime());

        if(data.getParam().has("time_to")&&data.getParam().has("time_from"))
        {
            timeFrom = data.getParam().getString("time_from");
            timeTo =data.getParam().getString("time_to");
        }

        int resultCode = 0;
        List jsonList = new ArrayList();
        /*--------------------获取变量 完毕--------------------*/
        /*--------------------数据操作 开始--------------------*/
        Db queryDb = new Db(dbName);
        String sql = "select DATE_FORMAT(GPSTime,\"%H\") as time_interval,count(*) as total from " + relationName;
        sql += " where GPSTime between '" + timeFrom + "' and '" + timeTo + "'";
        sql += " group by DATE_FORMAT(GPSTime,\"%H\")";
        showDebug("[toStatistics]构造的SQL语句是：" + sql);

        try {

            ResultSet rs = queryDb.executeQuery(sql);
            ResultSetMetaData rsmd = rs.getMetaData();
            int fieldCount = rsmd.getColumnCount();
            int i = 0;
            boolean[] check = new boolean[24];

            for (boolean it : check) {
                it = false;
            }

            while (rs.next()) {

                int time = rs.getInt("time_interval");

                for (; i < time; i++) {
                    HashMap map = new HashMap();
                    map.put("time_interval", i < 10 ? "0" + i : i);
                    map.put("total", 0);
                    jsonList.add(map);
                }

                HashMap map = new HashMap();
                map.put("time_interval", time);
                map.put("total", rs.getInt("total"));
                i = time + 1;
                jsonList.add(map);

            }

            for (; i < 24; i++) {
                HashMap map = new HashMap();
                map.put("time_interval", i < 10 ? "0" + i : i);
                map.put("total", 0);
                jsonList.add(map);
            }

            rs.close();

        } catch (Exception e) {

            e.printStackTrace();
            showDebug("[toStatistics]查询数据库出现错误：" + sql);
            resultCode = 10;
            resultMsg = "查询数据库出现错误！" + e.getMessage();

        }

        queryDb.close();
        /*--------------------数据操作 结束--------------------*/
        /*--------------------返回数据 开始--------------------*/

        json.put("aaData", jsonList);
        json.put("result_msg", resultMsg); // 如果发生错误就设置成"error"等
        json.put("result_code", resultCode); // 返回0表示正常，不等于0就表示有错误产生，错误代码
        /*--------------------返回数据 结束--------------------*/
    }

    /**
     * 构建Sql语句函数
     * @param data data字段信息
     * @return 返回构建好的Sql语句
     * @throws JSONException 抛出json类异常
     */
    private String createGetRecordSql(Data data) throws JSONException {
        JSONObject param = data.getParam();

        // String midSql = dbColomn.toString();
        // midSql = midSql.substring(1,midSql.length()-1);
        // showDebug(midSql);

        String sql = "select * from " + relationName;
        sql += createJoinSql(relationName, "lane_data", "lane_id", "lane_id");
        sql += createJoinSql(relationName, "monitoring_data", "car_code", "car_code");

        String where = "";

        if (checkParamValid(param, "id")) {
            where = "id=" + param.getString("id");
        }

        if (checkParamValid(param, "time_from") && checkParamValid(param, "time_to")) {

            if (!where.isEmpty()) {
                where += " and create_time between '" + param.getString("time_from") + "' and '"
                        + param.getString("time_to") + "'";
            } else {
                where = "create_time between '" + param.getString("time_from") + "' and '" + param.getString("time_to")
                        + "'";
            }

        }

        where = useWhere(param, "car_code", where);

        if (checkParamValid(param, "location")) {

            if (!where.isEmpty()) {
                where = where + " and location like '%" + param.getString("location") + "%'";
            } else {
                where = "location like '%" + param.getString("location") + "%'";
            }

        }

        // 判断是否有条件
        if (!where.isEmpty()) {
            sql = sql + " where " + where;
        }

        if (checkParamValid(param, "order_by")) {
            sql = sql + " order by " + param.getString("order_by");
        }

        return sql;

    }

    public void getExportDeviceRecordToExcel(JSONObject json, Data data) throws JSONException, IOException {
        json.put("download_url", "/upload/maintain/illegal/export_device.xls");
        json.put("file_path", "/upload/maintain/illegal/export_device.xls");
        MyExcel m = new MyExcel();
        m.exportData(data, json);
    }

    public void getExportDeviceRecordToTxt(JSONObject json, Data data) throws JSONException {
        String jsonStr = json.toString();
        String jsonPath = "D:\\upload\\maintain\\illegal\\export_device.txt";
        File jsonFile = new File(jsonPath);
        json.put("download_url", "/upload/maintain/illegal/export_device.txt");

        try {

            // 文件不存在就创建文件
            if (!jsonFile.exists()) {
                jsonFile.createNewFile();
            }

            FileWriter fileWriter = new FileWriter(jsonFile.getAbsoluteFile());
            BufferedWriter bw = new BufferedWriter(fileWriter);
            bw.write(jsonStr);
            bw.close();
            json.put("result_code_for_export", 0);
            json.put("result_Msg", "ok");

        } catch (IOException e) {

            e.printStackTrace();
            json.put("result_code_for_export", 10);
            json.put("result_Msg", "error!");

        }

    }

    public void saveUploadFileRecord(JSONObject json, Data data) throws JSONException, SQLException {
        // 构造sql语句，根据传递过来的查询条件参数
        // 首先分析json里有多少文件，多个文件需要用循环构造多个sql语句
        showDebug("[saveUploadFileRecord]保存文件后，文件和字段信息json是：" + json.toString());
        /*--------------------sql语句 开始--------------------*/

        Data videoData = new Data();
        videoData.setParam(json);

        // 构造sql语句，根据传递过来的条件参数

        JSONArray jsonFileList = videoData.getParam().getJSONArray("upload_files");

        showDebug("1111");

        String file_path_name = jsonFileList.getJSONObject(0).has("file_path_name")
                ? jsonFileList.getJSONObject(0).get("file_path_name").toString()
                : null;

        String visual_path_name = jsonFileList.getJSONObject(0).has("file_url_name")
                ? jsonFileList.getJSONObject(0).get("file_url_name").toString()
                : null;

        String upload_time = (new SimpleDateFormat("yyyy-MM-dd HH:mm:ss")).format(new Date());

        if (file_path_name != null) {
            String sql = "insert into " + "video_info" + "(upload_time,video_attachment,video_url)";

            sql = sql + " values('" + upload_time + "','" + file_path_name + "','" + visual_path_name + "')";
            data.getParam().put("sql", sql);
            updateRecord(data, json);

            showDebug("[saveUploadFileRecord]保存文件后，构造的sql是：" + sql);
        } else {
            showDebug("[saveUploadFileRecord]保存文件后,没有得到数据" + file_path_name);
        }

    }
}