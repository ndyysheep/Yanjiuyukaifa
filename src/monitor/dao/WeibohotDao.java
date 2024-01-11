
package monitor.dao;

import com.fasterxml.jackson.databind.JsonNode;
import monitor.file.MyExcel;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import javax.servlet.http.HttpServletResponse;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.sql.Statement;
import java.text.SimpleDateFormat;
import java.util.*;

/**
 * @author CornerGjr
 */
public class WeibohotDao {

    /*
     * 声明数据库名
     */
    private String dbName = "yjykfsj8";
    private String relationName = "weibohot";


    /**
     * 生成调试信息
     *
     * @param msg 接收的第一个参数,主要调试信息
     */
    public void showDebug(String msg) {
        System.out.println(
                "[" + (new SimpleDateFormat("yyyy-MM-dd HH:mm:ss")).format(new Date()) + "][monitor/dao/Db]" + msg);
    }

    /**
     * 判断json对象存储的信息是否合法,拒绝含有特殊字符的请求
     *
     * @param param 接收的第一个参数,接收json对象信息
     * @param field 接收的第二个参数,接收json对象包含列名
     * @return 判断结果
     * @throws JSONException 抛出异常
     */
    private boolean checkParamValid(JSONObject param, String field) throws JSONException {
        boolean ok = false;
        ArrayList<Character> inValidList = new ArrayList<>(Arrays.asList('\\', '?', '=', '+', '\'', '/', ',',
                '\\', ';', '!', '%', '*', '#', '$', '^', '(', ')'));
        System.out.println(param);
        ok = param.has(field) && param.getString(field) != null && !param.getString(field).isEmpty()
                && !param.getString(field).equals("undefined") && !param.getString(field).equals("null");
        if (ok) {
            for (char ch : inValidList) {
                if (param.getString(field).contains(String.valueOf(ch))) {
                    ok = false;
                }
            }
        }

        return ok;
    }


    /**
     * join构建sql
     *
     * @param table1 连接用第一个表
     * @param table2 连接用第二个表
     * @param key1   第一个表主键
     * @param key2   第二个表主键
     * @return 返回sql语句
     */
    private String createJoinSql(String table1, String table2, String key1, String key2, int outer) {
        String subSql = "";
        String outerSql = "";
        if (outer == 0) {
            outerSql = "";
        } else if (outer == 1) {
            outerSql = " left outer ";
        } else if (outer == 2) {
            outerSql = " right outer ";
        } else if (outer == 3) {
            outerSql = " full outer ";
        } else {
            return "";
        }
        subSql += outerSql + " join " + table2 + " on " + table1 + "." + key1 + " = " + table2 + "." + key2;

        return subSql;
    }

    /**
     * @param param    json数据对象
     * @param keyParam key键值
     * @param where    原where语句
     * @param isLike   判断使用'=' 还是 "like"
     * @return String 返回构造好的where语句
     * @throws JSONException 抛出Json类异常
     */
    private String useWhere(JSONObject param, String keyParam, String where, boolean isLike) throws JSONException {
        String subStr = where;
        String keyCommand = " where ";

        if (param.has(keyParam)) {
            if (checkParamValid(param, keyParam)) {
                if (isLike) {
                    if (!subStr.isEmpty()) {
                        subStr += " and " + keyParam + " like '%" + param.getString(keyParam) + "%'";
                    } else {
                        subStr = keyCommand + keyParam + " like '%" + param.getString(keyParam) + "%'";
                    }

                } else {
                    if (!subStr.isEmpty()) {
                        subStr += " and " + keyParam + " = '" + param.getString(keyParam) + "'";
                    } else {
                        subStr = keyCommand + keyParam + "='" + param.getString(keyParam) + "'";
                    }
                }
            }
        }


        return subStr;
    }

    /**
     * 拼接where-between时间段查询语句
     *
     * @param param       json数据对象
     * @param where       原where语句
     * @param timeFromKey json中开始时间键值
     * @param timeToKey   json中截止时间键值
     * @return sql中的where部分语句
     * @throws JSONException 抛出Json类异常
     */
    private String useTimeWhere(JSONObject param, String where, String timeFromKey, String timeToKey) throws JSONException {
        String timeWhere = where;
        String timeTo = "";
        String timeFrom = "";
        String Now = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(new Date());
        if (checkParamValid(param, timeFromKey) || checkParamValid(param, timeToKey)) {
            if (checkParamValid(param, timeFromKey)) {
                timeFrom = param.getString(timeFromKey);
            } else {
                timeFrom = Now;
            }

            if (checkParamValid(param, timeToKey)) {
                timeTo = param.getString(timeToKey);
            } else {
                timeTo = Now;
            }

            if (!where.isEmpty()) {
                timeWhere += " and capture_time between '" + timeFrom + "' and '"
                        + timeTo + "'";
            } else {
                timeWhere = " where " + "capture_time between '" + timeFrom + "' and '" + timeTo
                        + "'";
            }

        }

        return timeWhere;
    }

    /**
     * 判断输入是否合法,并构建合适的 更新 语句
     *
     * @param param   json对象
     * @param keyPara 关键字
     * @param sql     现有的sql语句
     * @return 构建好的sql语句
     * @throws JSONException 抛出sql异常
     */
    private String useSet(JSONObject param, String keyPara, String sql) throws JSONException {
        String thisSql = sql;
        showDebug("每次调用" + sql);
        if (checkParamValid(param, keyPara)) {
            String keyData = param.getString(keyPara);

            if (Objects.equals(thisSql, "")) {
                thisSql = thisSql + " set " + keyPara + " = '" + keyData + "'";
            } else {
                thisSql = thisSql + "," + keyPara + " = '" + keyData + "'";
            }

        }

        return thisSql;
    }

    /**
     * 判断输入是否合法,并构建合适的 更新 语句
     *
     * @param param   json对象
     * @param keyPara 关键字
     * @param sql     现有的sql语句
     * @return 构建好的sql语句
     * @throws JSONException 抛出sql异常
     */
    private String useInsert(JSONObject param, String keyPara, String sql) throws JSONException {
        String thisSql = sql;
        showDebug("每次调用" + sql);
        String keyData = null;
        if (checkParamValid(param, keyPara)) {
            keyData = param.getString(keyPara);

            if (Objects.equals(thisSql, "")) {
                thisSql = thisSql + " select '" + keyData + "'";
            } else {
                thisSql = thisSql + ",'" + keyData + "'";
            }

        } else {
            if (Objects.equals(thisSql, "")) {
                thisSql = thisSql + " select " + keyData;
            } else {
                thisSql = thisSql + "," + keyData;
            }
        }

        return thisSql;
    }

    /**
     * 添加设备记录
     *
     * @param data 接收的第一个参数,json对象中的数据信息
     * @param json 接收的第二个参数,json对象
     * @throws JSONException 抛出json类异常
     * @throws SQLException  抛出sql类异常
     */
    public void addMonitorRecord(Data data, JSONObject json) throws JSONException, SQLException {




        JSONObject param = data.getParam();
        String title = param.getString("title"); //道路名称
        String hot = param.getString("hot"); //速度限制
        String url = param.getString("url"); //车速限制
        String sql = "INSERT INTO `yjykfsj8`.`weibohot`(`index`,`title`, `hot`, `url`) VALUES ('"+generateUniqueId()+"','" + title + "', '" + hot + "', '" + url + "')";

        data.getParam().put("sql", sql);
        updateRecord(data, json);


    }

    private static int counter = 35; // 设置初始值为2

    public static int generateUniqueId() {
        // 递增计数器的值
        return ++counter;
    }

    /**
     * 删除设备记录
     *
     * @param data 接收的第一个参数,json对象中的数据信息
     * @param json 接收的第二个参数,json对象
     * @throws JSONException 抛出json类异常
     * @throws SQLException  抛出sql类异常
     */
    public void deleteMonitorRecord(Data data, JSONObject json) throws JSONException, SQLException {
        // 构造sql语句，根据传递过来的条件参数
        String id = data.getParam().has("id") ? data.getParam().getString("id") : null;

        if (id != null) {
            String sql = "delete from " + relationName + " where `index`=" + data.getParam().getString("id");
            data.getParam().put("sql", sql);
            updateRecord(data, json);
        }

    }

    /**
     * 修改设备记录
     */
    public void modifyMonitorRecord(Data data, JSONObject json) throws JSONException, SQLException {
        // 构造sql语句，根据传递过来的条件参数
        JSONObject param = data.getParam();
        if (param.get("index") != null) {
            String sql = "";
            String commandSql = "update " + relationName;
            sql = useSet(param, "title", sql);
            sql = useSet(param, "hot", sql);
            sql = useSet(param, "url", sql);
            sql = sql + " where `index`=" + param.get("index");

            sql = commandSql + sql;
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
    public void getMonitorRecord(Data data, JSONObject json) throws JSONException, SQLException {
        // 构造sql语句，根据传递过来的查询条件参数
        String sql = selectAll(data, true); // 构造sql语句，根据传递过来的查询条件参数
        data.getParam().put("sql", sql);
        queryRecord(data, json);
    }

    public void viewMonitorRecord(Data data, JSONObject json) throws JSONException, SQLException {
        // 构造sql语句，根据传递过来的查询条件参数
        String sql = createViewRecordSql(data); // 构造sql语句，根据传递过来的查询条件参数
        data.getParam().put("sql", sql);
        queryRecord(data, json);
    }

    public void getQueryRecord(Data data, JSONObject json) throws JSONException, SQLException {
        // 构造sql语句，根据传递过来的查询条件参数
        String sql = createGetQueryRecordSql(data, true); // 构造sql语句，根据传递过来的查询条件参数
        data.getParam().put("sql", sql);
        queryRecord(data, json);
    }

    public void getRecordForStatisticsHour(Data data, JSONObject json) throws JSONException {
        /*--------------------获取变量 开始--------------------*/
        String resultMsg = "ok";

        String where = "";
        JSONObject param = data.getParam();
        where = useTimeWhere(param, where, "time_from", "time_to");

        int resultCode = 0;
        List jsonList = new ArrayList();
        /*--------------------获取变量 完毕--------------------*/
        /*--------------------数据操作 开始--------------------*/
        Db queryDb = new Db(dbName);
        String sql = "select DATE_FORMAT(capture_time,\"%H\") as time_interval,count(*) as total, "
                + "count(case when illegal_status<>0 then 1 end) as illegal_total,"
                + "count(case when illegal_status=0 then 1 end) as legal_total"
                + " from " + relationName;
        sql += where;
        sql += " group by time_interval";
        showDebug("[toStatistics]构造的SQL语句是：" + sql);

        try {

            ResultSet rs = queryDb.executeQuery(sql);
            ResultSetMetaData rsmd = rs.getMetaData();
            int fieldCount = rsmd.getColumnCount();

            while (rs.next()) {

                int time = rs.getInt("time_interval");
                HashMap map = new HashMap();
                map.put("time_interval", time);
                map.put("total", rs.getInt("total"));
                map.put("legal_total", rs.getInt("legal_total"));
                map.put("illegal_total", rs.getInt("illegal_total"));

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
        json.put("my_aaData", jsonList);
        json.put("result_msg", resultMsg); // 如果发生错误就设置成"error"等
        json.put("result_code", resultCode); // 返回0表示正常，不等于0就表示有错误产生，错误代码
        /*--------------------返回数据 结束--------------------*/
    }

    public void getRecordForStatisticsType(Data data, JSONObject json) throws JSONException, SQLException {
        // 构造sql语句，根据传递过来的查询条件参数
        String sql = createStatisticsSqlForType(data); // 构造sql语句，根据传递过来的查询条件参数
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

    //api新增
    private void insertApi(String sql) {
        Db updateDb = new Db(dbName);
        updateDb.executeUpdate(sql);
        updateDb.close();
    }

    private Statement statement;

    public void queryApi(JSONObject jsonObject, JSONObject json, HttpServletResponse response) throws JSONException, IOException, SQLException {

        String sql2 = "DELETE w FROM weibohot w\n" +
                "JOIN (\n" +
                "    SELECT `index`  FROM weibohot ORDER BY `index`  ASC LIMIT 30\n" +
                ") AS temp ON w.`index`  = temp.`index` ;\n";
        Db updateDb = new Db(dbName);
       updateDb.executeUpdate(sql2);

        try {
            Thread.sleep(1000);
            String resultMsg = "ok";
            int resultCode = 0;
            JSONArray dataArray = jsonObject.getJSONArray("data");
            int numItemsToProcess = Math.min(dataArray.length(), 30);
            JSONArray resultDataArray = new JSONArray(); // 创建一个新的 JSONArray 用于存储结果
            for (int i = 0; i < numItemsToProcess; i++) {
                JSONObject itemNode = dataArray.getJSONObject(i);
                JSONObject resultItem = new JSONObject(); // 为每个数据项创建一个新的 JSONObject
                // 将每个字段添加到 resultItem 中
                resultItem.put("index", itemNode.getString("index"));
                resultItem.put("title", itemNode.getString("title"));
                resultItem.put("hot", itemNode.getString("hot"));
                resultItem.put("url", itemNode.getString("url"));
                //新增
                String sql = "INSERT INTO `yjykfsj8`.`weibohot`(`index`, `title`, `hot`, `url`) " +
                        "VALUES ('" + itemNode.getString("index") + "','" + itemNode.getString("title") + "', '" +
                        itemNode.getString("hot") + "', '" + itemNode.getString("url") + "')";
                insertApi(sql);
                // 将 resultItem 添加到 resultDataArray 中
                resultDataArray.put(resultItem);
            }

            // 创建列名数组
            JSONArray jsonColumnArray = new JSONArray();
            jsonColumnArray.put("index");
            jsonColumnArray.put("title");
            jsonColumnArray.put("hot");
            jsonColumnArray.put("url");

            // 将列名和数据添加到响应 JSON 对象中
            json.put("aaColumn", jsonColumnArray);
            json.put("aaData", resultDataArray);
            json.put("result_msg", resultMsg);
            json.put("result_code", resultCode);
        } catch (Exception e) {
            handleApiError(json, response, "处理API响应时出错", 500);
        }
    }

    public void handleApiError(JSONObject json, HttpServletResponse response, String errorMsg, int errorCode) throws IOException, JSONException {
        json.put("result_msg", errorMsg);
        json.put("result_code", errorCode);
        response.getWriter().write(json.toString());
    }

    /**
     * 进行主要的数据库查询处理和交互(接口)
     *
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
     *
     * @param data 自定义Data变量
     * @return sql语句
     * @throws JSONException 抛出json异常
     */
    public String createGetQueryRecordSql(Data data, boolean isNeedJoin) throws JSONException {
        JSONObject param = data.getParam();
        String sql = "select * from " + relationName;
        String where = "";
        where = useWhere(param, "title", where, true);
        showDebug(where);
        // 判断是否有条件
        if (!where.isEmpty()) {
            sql = sql + where;
        }
        showDebug(sql);
        return sql;
    }


    public String selectAll(Data data, boolean isNeedJoin) throws JSONException {
        JSONObject param = data.getParam();
        String sql = "select * from " + relationName;
        showDebug(sql);
        return sql;
    }


    private String createViewRecordSql(Data data) throws JSONException {
        JSONObject param = data.getParam();
        String sql = "select * from " + relationName;
        String where = "";
        sql += createJoinSql(relationName, "lane_data", "lane_id", "lane_id", 1);
        sql += createJoinSql(relationName, "illegal_info", "id", "monitor_id", 1);

        if (checkParamValid(param, "id")) {
            where += " where " + relationName + "." + "id=" + param.getString("id");
        }

        showDebug(sql);
        sql += where;
        return sql;

    }

    private String createStatisticsSqlForType(Data data) throws JSONException {
        String timeTo = "";
        String timeFrom = "";
        String Now = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(new Date());

        String where = "";
        JSONObject param = data.getParam();
        String sql = " select vehicle_type,count(vehicle_type) as num "
                + " from " + relationName;
        where = useTimeWhere(param, where, "time_from", "time_to");
        sql += where;
        sql += " group by vehicle_type";
        showDebug("[percentageToStatistics]构造的SQL语句是：" + sql);


        return sql;
    }
    //构建SQL语句函数-----结束


    //导出处理函数-----开始

    public void getExportMonitorRecordToExcel(JSONObject json, Data data) throws JSONException, IOException {
        // 指定保存目录的路径

        String saveDirectory = "D:\\ykpro\\web\\upload\\weibo";

        String filePath = saveDirectory + "\\export_weibo.xls";

        json.put("download_url", "/upload/weibo/export_weibo.xls");
        json.put("file_path", filePath);

        MyExcel m = new MyExcel();
        try {
            m.exportData(data, json);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public void getExportMonitorRecordToTxt(JSONObject json, Data data) throws JSONException {
        String jsonStr = json.toString();
        String jsonPath = "D:\\upload\\maintain\\monitor\\export_device.txt";
        File jsonFile = new File(jsonPath);
        json.put("download_url", "/upload/maintain/monitor/export_device.txt");

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


    //导出处理函数-----结束

    //上传文件函数-----开始
    public void saveUploadFileRecord(JSONObject json, Data data) throws JSONException, SQLException {
        // 构造sql语句，根据传递过来的查询条件参数
        // 首先分析json里有多少文件，多个文件需要用循环构造多个sql语句
        showDebug("[saveUploadFileRecord]保存文件后，文件和字段信息json是：" + json.toString());
        /*--------------------sql语句 开始--------------------*/

        Data videoData = new Data();
        videoData.setParam(json);

        // 构造sql语句，根据传递过来的条件参数

        JSONArray jsonFileList = videoData.getParam().getJSONArray("upload_files");

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
    //上传文件函数-----结束
}
