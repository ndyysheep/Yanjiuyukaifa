
package monitor.dao;

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
public class SectionDao {

    /*
     * 声明数据库名
     */
    private String dbName = "yjykfsj8";
    private String relationName = "lane_data";


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
        ArrayList<Character> inValidList = new ArrayList<>(Arrays.asList('\\','?','=','+','\'','/',',',
                '\\',';','!','%','*','#','$','^','(',')'));
        System.out.println(param);
        ok = param.has(field) && param.getString(field) != null && !param.getString(field).isEmpty()
                && !param.getString(field).equals("undefined") && !param.getString(field).equals("null");
        if(ok)
        {
            for(char ch:inValidList)
            {
                if(param.getString(field).contains(String.valueOf(ch)))
                {
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
     * @param key1 第一个表主键
     * @param key2 第二个表主键
     * @return 返回sql语句
     */
    private String createJoinSql(String table1, String table2, String key1, String key2,int outer) {
        String subSql = "";
        String outerSql = "";
        if(outer==0)
        {
            outerSql = "";
        }
        else if(outer==1)
        {
            outerSql = " left outer ";
        }
        else if(outer==2)
        {
            outerSql = " right outer ";
        }
        else if(outer==3)
        {
            outerSql = " full outer ";
        }
        else
        {
            return"";
        }
        subSql +=outerSql +" join " + table2 + " on " + table1 + "." + key1 + " = " + table2 + "." + key2;

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
    private String useTimeWhere(JSONObject param,String where, String timeFromKey,String timeToKey)throws JSONException
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
                timeWhere += " and capture_time between '" + timeFrom + "' and '"
                        + timeTo + "'";
            }
            else
            {
                timeWhere =" where "+"capture_time between '" + timeFrom + "' and '" + timeTo
                        + "'";
            }

        }

        return timeWhere ;
    }

    /**
     * 判断输入是否合法,并构建合适的 更新 语句
     * @param param json对象
     * @param keyPara 关键字
     * @param sql 现有的sql语句
     * @return 构建好的sql语句
     * @throws JSONException 抛出sql异常
     */
    private String useSet(JSONObject param,String keyPara,String sql) throws JSONException {
        String thisSql = sql;
        showDebug("每次调用"+sql);
        if(checkParamValid(param,keyPara))
        {
            String keyData = param.getString(keyPara);

                if(Objects.equals(thisSql, ""))
                {
                    thisSql = thisSql + " set "+keyPara+" = '"+keyData +"'";
                }
                else
                {
                    thisSql = thisSql + ","+keyPara+" = '"+keyData +"'";
                }

        }

        return thisSql;
    }

    /**
     * 判断输入是否合法,并构建合适的 更新 语句
     * @param param json对象
     * @param keyPara 关键字
     * @param sql 现有的sql语句
     * @return 构建好的sql语句
     * @throws JSONException 抛出sql异常
     */
    private String useInsert(JSONObject param,String keyPara,String sql) throws JSONException {
        String thisSql = sql;
        showDebug("每次调用"+sql);
        String keyData = null;
        if(checkParamValid(param,keyPara))
        {
            keyData = param.getString(keyPara);

            if(Objects.equals(thisSql, ""))
            {
                thisSql = thisSql + " select '" +keyData+ "'";
            }
            else
            {
                thisSql = thisSql + ",'"+keyData +"'";
            }

        }
        else
        {
            if(Objects.equals(thisSql, ""))
            {
                thisSql = thisSql + " select " +keyData;
            }
            else
            {
                thisSql = thisSql + ","+keyData ;
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
     * @throws SQLException 抛出sql类异常
     */
    public void addMonitorRecord(Data data, JSONObject json) throws JSONException, SQLException {
        JSONObject param = data.getParam();
         int id = this.generateUniqueId(); // 生成唯一ID
        String lane_name = param.getString("lane_name"); //道路名称
        String speed_limit = param.getString("speed_limit"); //速度限制
        String speed_limit_for_others=param.getString("speed_limit_for_others"); //车速限制
        int park_limit_tag = param.getInt("park_limit_tag");//是否禁停
        String sql="INSERT INTO `yjykfsj8`.`lane_data`(`lane_id`,`lane_name`, `speed_limit`," +
                " `speed_limit_for_others`, `park_limit_tag`) " +
                "VALUES ('"+id+"','"+lane_name+"', '"+speed_limit+"', '"+speed_limit_for_others+"', '"+park_limit_tag+"')";

        data.getParam().put("sql", sql);
        updateRecord(data, json);


    }

    private static int counter = 2; // 设置初始值为2

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
     * @throws SQLException 抛出sql类异常
     */
    public void deleteMonitorRecord(Data data, JSONObject json) throws JSONException, SQLException {
        // 构造sql语句，根据传递过来的条件参数
        String id = data.getParam().has("lane_id") ? data.getParam().getString("lane_id") : null;

        if (id != null) {
            String sql = "delete from " + relationName + " where lane_id=" + data.getParam().getString("lane_id");
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
      //  String id = data.getParam().has("id") ? data.getParam().getString("id") : null;

        if (param.get("lane_id") != null) {
            String sql = "";
            String commandSql = "update " + relationName;
            sql = useSet(param,"lane_name",sql);
            sql = useSet(param,"speed_limit",sql);
            sql = useSet(param,"speed_limit_for_others",sql);
            sql = useSet(param,"park_limit_tag",sql);
            sql = sql + " where lane_id=" + param.get("lane_id");

            sql = commandSql+sql;
            data.getParam().put("sql", sql);
            updateRecord(data, json);

        }

    }



    /**
     * 查询记录
     */
    public void getMonitorRecord(Data data, JSONObject json) throws JSONException, SQLException {
        // 构造sql语句，根据传递过来的查询条件参数
        String sql = selectAll(data,true); // 构造sql语句，根据传递过来的查询条件参数
        data.getParam().put("sql", sql);
        queryRecord(data, json);
    }



    public void getQueryRecord(Data data, JSONObject json) throws JSONException, SQLException {
        // 构造sql语句，根据传递过来的查询条件参数
        String sql = createGetQueryRecordSql(data,true); // 构造sql语句，根据传递过来的查询条件参数
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
        String where = "";
        where = useWhere(param, "lane_name", where,true);
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






    //构建SQL语句函数-----结束




    //导出处理函数-----开始

    public void getExportMonitorRecordToExcel(JSONObject json, Data data) throws JSONException, IOException {
        // 指定保存目录的路径

        String saveDirectory = "D:\\ykpro\\web\\upload\\section";

        String filePath = saveDirectory + "\\export_section.xls";

        json.put("download_url", "/upload/section/export_section.xls");
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

}
