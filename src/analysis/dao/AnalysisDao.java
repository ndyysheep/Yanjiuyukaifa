package analysis.dao;

import monitor.dao.Data;
import monitor.dao.Db;
import monitor.file.MyExcel;
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

public class AnalysisDao {

    private String dbName = "yjykfsj8";
    private String relationName = "monitoring_data";


    /**
     * 生成调试信息
     * @param msg 接收的第一个参数,主要调试信息
     */
    public void showDebug(String msg) {
        System.out.println(
                "[" + (new SimpleDateFormat("yyyy-MM-dd HH:mm:ss")).format(new Date()) + "][analysis/dao/Db]" + msg);
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
     * @param param json数据对象
     * @param keyParam key键值
     * @param where 原where语句
     * @param isLike 判断使用'=' 还是 "like"
     * @return String 返回构造好的where语句
     * @throws JSONException 抛出Json类异常
     */
    private String useWhere(JSONObject param, String keyParam, String where,boolean isLike) throws JSONException {
        String subStr = where;
        String keyCommand = " where ";

        if(param.has(keyParam))
        {
            if (checkParamValid(param, keyParam)) {
                if(isLike)
                {
                    if (!subStr.isEmpty())
                    {
                        subStr += " and " + keyParam + " like '%" + param.getString(keyParam) + "%'";
                    }
                    else
                    {
                        subStr = keyCommand + keyParam + " like '%" + param.getString(keyParam) + "%'";
                    }

                }
                else
                {
                    if (!subStr.isEmpty())
                    {
                        subStr   +=" and " + keyParam + " = '" + param.getString(keyParam) + "'";
                    }
                    else
                    {
                        subStr = keyCommand + keyParam + "='" + param.getString(keyParam) + "'";
                    }
                }
            }
        }


        return subStr;
    }

    /**
     * 拼接where-between时间段查询语句
     * @param param json数据对象
     * @param where 原where语句
     * @param timeFromKey json中开始时间键值
     * @param timeToKey json中截止时间键值
     * @return sql中的where部分语句
     * @throws JSONException 抛出Json类异常
     */
    private String useTimeWhere(JSONObject param,String where, String timeFromKey,String timeToKey,String timeColomn)throws JSONException
    {
        String timeWhere = where;
        String timeTo = "";
        String timeFrom  = "";
        String Now=new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(new Date());
        if(checkParamValid(param, timeFromKey) || checkParamValid(param, timeToKey))
        {
            if(checkParamValid(param, timeFromKey))
            {
                timeFrom = param.getString(timeFromKey);
            }
            else
            {
                timeFrom = Now;
            }

            if(checkParamValid(param, timeToKey))
            {
                timeTo = param.getString(timeToKey);
            }
            else
            {
                timeTo = Now;
            }

            if (!where.isEmpty())
            {
                timeWhere += " and "+timeColomn+" between '" + timeFrom + "' and '"
                        + timeTo + "'";
            }
            else
            {
                timeWhere =" where "+timeColomn+" between '" + timeFrom + "' and '" + timeTo
                        + "'";
            }

        }

        return timeWhere ;
    }

    //数据库交互接口函数-----开始
    /**
     * 进行主要的数据库查询处理和交互(接口)
     * @param data Data类对象,是json对象的容器
     * @param json json对象,储存交互信息
     * @throws JSONException 抛出json类异常
     */
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
    //数据库交互接口函数-----结束


    /**
     *获取日期信息
     */
    public void getDateAll(Data data, JSONObject json) throws JSONException, SQLException {
        // 构造sql语句，根据传递过来的查询条件参数
        String sql = createGetDateRecordSql(); // 构造sql语句，根据传递过来的查询条件参数
        data.getParam().put("sql", sql);
        queryRecord(data, json);
    }

    public void getRecordForReport(Data data, JSONObject json) throws JSONException {
        /*--------------------获取变量 开始--------------------*/
        String resultMsg = "ok";

        String where = "";
        JSONObject param = data.getParam();
        where = useTimeWhere(param,where,"time_from"
                ,"time_to","capture_time");

        int resultCode = 0;
        List jsonList = new ArrayList();
        /*--------------------获取变量 完毕--------------------*/
        /*--------------------数据操作 开始--------------------*/
        Db queryDb = new Db(dbName);

        String sql = "select lane_name,"
                +"count(CASE WHEN illegal_status = 0 THEN 1 END) AS status0,"
                +"count(CASE WHEN illegal_status = 1 THEN 1 END) AS status1,"
                +"count(CASE WHEN illegal_status = 2 THEN 1 END) AS status2,"
                +"count(CASE WHEN illegal_status = 3 THEN 1 END) AS status3,"
                +"count(CASE WHEN illegal_status = 4 THEN 1 END) AS status4"
                +" from " + relationName;
        sql += createJoinSql(relationName,"lane_data","lane_id","lane_id");
        sql += where;
        sql += " group by lane_name";
        showDebug("[toStatistics]构造的SQL语句是：" + sql);

        try {

            ResultSet rs = queryDb.executeQuery(sql);
            ResultSetMetaData rsmd = rs.getMetaData();
            int fieldCount = rsmd.getColumnCount();

            while (rs.next()) {

                HashMap map = new HashMap();
                map.put("lane_name", rs.getString("lane_name"));
                map.put("status0", rs.getInt("status0"));
                map.put("status1", rs.getInt("status1"));
                map.put("status2", rs.getInt("status2"));
                map.put("status3", rs.getInt("status3"));
                map.put("status4", rs.getInt("status4"));


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

        showDebug(jsonList.toString());
        json.put("report_aaData", jsonList);
        json.put("result_msg", resultMsg); // 如果发生错误就设置成"error"等
        json.put("result_code", resultCode); // 返回0表示正常，不等于0就表示有错误产生，错误代码
        /*--------------------返回数据 结束--------------------*/
    }

    public void getRecordForAll(Data data, JSONObject json) throws JSONException {
        /*--------------------获取变量 开始--------------------*/
        String resultMsg = "ok";

        JSONObject param = data.getParam();
        String now=new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(new Date());
        String date = param.has("time_from")?param.getString("time_to"):now;

        int resultCode = 0;
        List jsonList = new ArrayList();
        /*--------------------获取变量 完毕--------------------*/
        /*--------------------数据操作 开始--------------------*/
        Db queryDb = new Db(dbName);

        String sql = "select lane_name,DATE_FORMAT(capture_time,\"%Y-%m-%d\")as date,"
                +"count(CASE WHEN illegal_status = 0 THEN 1 END) AS status0,"
                +"count(CASE WHEN illegal_status = 1 THEN 1 END) AS status1,"
                +"count(CASE WHEN illegal_status = 2 THEN 1 END) AS status2,"
                +"count(CASE WHEN illegal_status = 3 THEN 1 END) AS status3,"
                +"count(CASE WHEN illegal_status = 4 THEN 1 END) AS status4"
                +" from " + relationName;
        sql += createJoinSql(relationName,"lane_data","lane_id","lane_id");
        sql += " where capture_time BETWEEN DATE_SUB('"+date+"',INTERVAL 3 DAY)"
                +" and DATE_ADD('"+date+"',INTERVAL 3 DAY) ";
        sql += " group by lane_name,date";
        showDebug("[toStatistics]构造的SQL语句是：" + sql);

        try {

            ResultSet rs = queryDb.executeQuery(sql);
            ResultSetMetaData rsmd = rs.getMetaData();
            int fieldCount = rsmd.getColumnCount();

            while (rs.next()) {

                HashMap map = new HashMap();
                map.put("lane_name", rs.getString("lane_name"));
                map.put("date", rs.getString("date"));
                map.put("status0", rs.getInt("status0"));
                map.put("status1", rs.getInt("status1"));
                map.put("status2", rs.getInt("status2"));
                map.put("status3", rs.getInt("status3"));
                map.put("status4", rs.getInt("status4"));


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

        showDebug(jsonList.toString());
        json.put("aaData", jsonList);
        json.put("result_msg", resultMsg); // 如果发生错误就设置成"error"等
        json.put("result_code", resultCode); // 返回0表示正常，不等于0就表示有错误产生，错误代码
        /*--------------------返回数据 结束--------------------*/
    }





    //构建SQL语句函数-----开始

    /**
     * 构建Sql语句,供查询日期功能使用
     * @return sql语句
     */
    public String createGetDateRecordSql()  {
        String sql = "select (DATE_FORMAT(capture_time,\"%Y-%m-%d\")) as date from " + relationName;
        sql+=" group by date";

        showDebug(sql);
        return sql;
    }



    //构建SQL语句函数-----结束




    //导出处理函数-----开始

    public void getExportAnalysisRecordToExcel(JSONObject json, Data data) throws JSONException, IOException {
        json.put("download_url", "/upload/maintain/analysis/export_device.xls");
        json.put("file_path", "/upload/maintain/analysis/export_device.xls");
        MyExcel m = new MyExcel();
        m.exportData(data, json);
    }

    public void getExportAnalysisRecordToTxt(JSONObject json, Data data) throws JSONException {
        String jsonStr = json.toString();
        String jsonPath = "D:\\upload\\maintain\\analysis\\export_device.txt";
        File jsonFile = new File(jsonPath);
        json.put("download_url", "/upload/maintain/analysis/export_device.txt");

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




}
