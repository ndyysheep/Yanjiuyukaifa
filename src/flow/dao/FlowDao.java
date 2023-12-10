package flow.dao;

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

public class FlowDao {

    private String dbName = "yjykfsj8";
    private String relationName = "count_of_lane";


    /**
     * 生成调试信息
     *
     * @param msg 接收的第一个参数,主要调试信息
     */
    public void showDebug(String msg) {
        System.out.println(
                "[" + (new SimpleDateFormat("yyyy-MM-dd HH:mm:ss")).format(new Date()) + "][flow/dao/Db]" + msg);
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


    /**
     * 添加设备记录
     *
     * @param data 接收的第一个参数,json对象中的数据信息
     * @param json 接收的第二个参数,json对象
     * @throws JSONException 抛出json类异常
     * @throws SQLException 抛出sql类异常
     */
    public void addDeviceRecord(Data data, JSONObject json) throws JSONException, SQLException {
        // 构造sql语句，根据传递过来的条件参数

        String start_time = data.getParam().has("start_time") ? data.getParam().getString("start_time") : null;
        String end_time = data.getParam().has("end_time") ? data.getParam().getString("end_time") : null;
        String total_num = data.getParam().has("total_num") ? data.getParam().getString("total_num") : null;
        String lane_name = data.getParam().has("lane_name") ? data.getParam().getString("lane_name") : null;
        if (start_time != null&&end_time != null
                &&total_num != null&&lane_name!=null)
        {
            String sql = "insert into " + relationName + "(start_time,lane_id,end_time,total_num)";
            sql = sql + " select '" + start_time + "'" + " ,lane_id"
                      + " ,'" + end_time + "','" + total_num + "' from lane_data "
                      + "where lane_name = '"+lane_name+"'";

            data.getParam().put("sql", sql);
            updateRecord(data, json);
        }

    }

    /**
     * 删除设备记录
     *
     * @param data 接收的第一个参数,json对象中的数据信息
     * @param json 接收的第二个参数,json对象
     * @throws JSONException 抛出json类异常
     * @throws SQLException 抛出sql类异常
     */
    public void deleteDeviceRecord(Data data, JSONObject json) throws JSONException, SQLException {
        // 构造sql语句，根据传递过来的条件参数
        String id = data.getParam().has("id") ? data.getParam().getString("id") : null;

        if (id != null) {
            String sql = "delete from " + relationName + " where id=" + data.getParam().getString("id");
            data.getParam().put("sql", sql);
            updateRecord(data, json);
        }

    }

    /**
     * 修改设备记录
     */
    public void modifyDeviceRecord(Data data, JSONObject json) throws JSONException, SQLException {
        // 构造sql语句，根据传递过来的条件参数
        String id = data.getParam().has("id") ? data.getParam().getString("id") : null;
        String start_time = data.getParam().has("start_time") ? data.getParam().getString("start_time") : null;
        String end_time = data.getParam().has("end_time") ? data.getParam().getString("end_time") : null;
        String total_num = data.getParam().has("total_num") ? data.getParam().getString("total_num") : null;
        String lane_name = data.getParam().has("lane_name") ? data.getParam().getString("lane_name") : null;

        if (id != null) {

            String sql = "update " + relationName;
            sql = sql + " set start_time='" + start_time + "'";
            sql = sql + " ,end_time='" + end_time + "'";
            sql = sql + " ,total_num='" + total_num + "'";

            // 需要道路名

            sql = sql + " where id=" + id;
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
    public void getFlowRecord(Data data, JSONObject json) throws JSONException, SQLException {
        // 构造sql语句，根据传递过来的查询条件参数
        String sql = createGetQueryRecordSql(data,true); // 构造sql语句，根据传递过来的查询条件参数
        data.getParam().put("sql", sql);
        queryRecord(data, json);
    }

    public void viewFlowRecord(Data data, JSONObject json) throws JSONException, SQLException {
        // 构造sql语句，根据传递过来的查询条件参数
        String sql = createViewRecordSql(data); // 构造sql语句，根据传递过来的查询条件参数
        data.getParam().put("sql", sql);
        queryRecord(data, json);
    }

    public void getQueryRecord(Data data, JSONObject json) throws JSONException, SQLException {
        // 构造sql语句，根据传递过来的查询条件参数
        String sql = createGetQueryRecordSql(data,true); // 构造sql语句，根据传递过来的查询条件参数
        data.getParam().put("sql", sql);
        queryRecord(data, json);
    }

    public void getRecordForStatisticsFlowSum(Data data, JSONObject json) throws JSONException {
        /*--------------------获取变量 开始--------------------*/
        String resultMsg = "ok";

        String where = "";
        JSONObject param = data.getParam();
        where = useTimeWhere(param,where,"time_from","time_to","start_time");
        where = useTimeWhere(param,where,"time_from","time_to","end_time");

        int resultCode = 0;
        List jsonList = new ArrayList();
        /*--------------------获取变量 完毕--------------------*/
        /*--------------------数据操作 开始--------------------*/
        Db queryDb = new Db(dbName);
        String sql = "select lane_name,sum(total_num) as num "
                +" from "+relationName ;
        sql+=createJoinSql(relationName,"lane_data","lane_id","lane_id");
        sql += where;
        sql += " group by lane_name";
        sql += " order by num desc ";
        sql += " limit 10 ";

        showDebug("[toStatistics]构造的SQL语句是：" + sql);

        try {

            ResultSet rs = queryDb.executeQuery(sql);
            ResultSetMetaData rsmd = rs.getMetaData();

            while (rs.next()) {

                HashMap map = new HashMap();
                map.put("lane_name",rs.getString("lane_name"));
                map.put("num", rs.getInt("num"));
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
        json.put("hour_aaData", jsonList);
        json.put("result_msg", resultMsg); // 如果发生错误就设置成"error"等
        json.put("result_code", resultCode); // 返回0表示正常，不等于0就表示有错误产生，错误代码
        /*--------------------返回数据 结束--------------------*/
    }

    public void getRecordForStatisticsFlow(Data data, JSONObject json) throws JSONException, SQLException {
        // 构造sql语句，根据传递过来的查询条件参数
        String sql = createStatisticsSql(data); // 构造sql语句，根据传递过来的查询条件参数
        data.getParam().put("sql", sql);
        queryRecord(data, json);
    }

    //数据库交互接口函数-----开始
    /**
     * 这是一个样板的函数，可以拷贝做修改用
     * 修改数据库数据时调用
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

    //构建SQL语句函数-----开始
    /**
     * 构建Sql语句,供查询功能使用
     * @param data 自定义Data变量
     * @return sql语句
     * @throws JSONException 抛出json异常
     */
    public String createGetQueryRecordSql(Data data, boolean isNeedJoin) throws JSONException {
        JSONObject param = data.getParam();
        String sql = "select * from " + relationName;

        if(!isNeedJoin)
        {
            if(data.getParam().has("lane_name"))
            {
                sql += createJoinSql(relationName, "lane_data", "lane_id", "lane_id");
            }
        }
        else
        {
            sql += createJoinSql(relationName, "lane_data", "lane_id", "lane_id");

        }


        String where = "";

        where = useWhere(param,"id",where,false);
        where = useTimeWhere(param,where,"time_from","time_to","start_time");
        where = useTimeWhere(param,where,"time_from","time_to","end_time");
        where = useWhere(param, "total_num", where,false);

        showDebug(where);
        // 判断是否有条件
        if (!where.isEmpty()) {
            sql = sql + where;
        }
        showDebug(sql);
        return sql;
    }

    private String createViewRecordSql(Data data) throws JSONException {
        JSONObject param = data.getParam();
        String sql = "select * from " + relationName ;
        String where="";
        sql += createJoinSql(relationName, "lane_data", "lane_id", "lane_id");
        sql += createJoinSql(relationName,"illegal_info","id","monitor_id");

        if(checkParamValid(param,"id"))
        {
            where +=" where "+relationName+"."+"id="+param.getString("id");
        }

        showDebug(sql);
        sql+=where;
        return sql;

    }

    private String createStatisticsSql(Data data) throws JSONException
    {
        String where = "";
        String conColumn =" total_num/(end_time - start_time)";
        JSONObject param = data.getParam();
        where = useTimeWhere(param,where,"time_from","time_to","start_time");
        where = useTimeWhere(param,where,"time_from","time_to","end_time");

        String sql = "select lane_name,"+conColumn+" as num"
                +" from "+relationName ;
        sql+=createJoinSql(relationName,"lane_data","lane_id","lane_id");
        sql += where;
        sql += " order by "+conColumn+" desc ";
        sql += " limit 10 ";
        return sql;
    }

    //构建SQL语句函数-----结束




    //导出处理函数-----开始

    public void getExportFlowRecordToExcel(JSONObject json, Data data) throws JSONException, IOException {
        json.put("download_url", "/upload/maintain/flow/export_device.xls");
        json.put("file_path", "/upload/maintain/flow/export_device.xls");
        MyExcel m = new MyExcel();
        m.exportData(data, json);
    }

    public void getExportFlowRecordToTxt(JSONObject json, Data data) throws JSONException {
        String jsonStr = json.toString();
        String jsonPath = "D:\\upload\\maintain\\flow\\export_device.txt";
        File jsonFile = new File(jsonPath);
        json.put("download_url", "/upload/maintain/flow/export_device.txt");

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
