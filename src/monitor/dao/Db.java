package monitor.dao;

import java.sql.*;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;

public class Db {
	int debugLevel=0;
	private Connection connection;
	private Statement statement;
	public void showDebug(String msg)
	{
		System.out.println("["+(new SimpleDateFormat("yyyy-MM-dd HH:mm:ss"))
				.format(new Date())+"][monitor/dao/Db]"+msg);
	}

	public Db(String dbName)
	{
		/*访问数据库地址*/
		String ipAddress="localhost";
		/*访问数据库端口*/
		String myPort="3306";
		/*访问数据库用户名*/
		String user="dbuser";
		/*访问数据库密码*/
		String passWord="gjr389113";

		/*开始连接数据库，如果是发布了的Tomcat环境，需要先把mysql-connector-java-5.0.4-bin.jar*/
		/*和json.jar拷贝到ROOT/WEB-INF/lib下*/
		/*如果是IDEA开发环境，则把这两个jar拷贝到项目lib下，注意要进行“Add as library的操作”，让系统添加关联的依赖*/

		try{

			Class.forName("com.mysql.jdbc.Driver");

		}catch (ClassNotFoundException classnotfoundexception) {

			classnotfoundexception.printStackTrace();

		}

		showDebug("加载了JDBC驱动");

		// 然后链接数据库，开始操作数据表
		try {
			/*构建连接mysql语句*/
			String connStr="jdbc:mysql://"+ipAddress+":"+myPort+"/"+dbName+"?user="
					+user+"&password="+passWord+"&useUnicode=true&characterEncoding=UTF-8";

			showDebug("准备getConnection，connection是："+connStr);
			connection = DriverManager.getConnection(connStr);
			showDebug("准备statement，connection是："+connStr);
			statement = connection.createStatement();
			showDebug("已经链接上数据库！");

		} catch (SQLException sqlexception) {

			sqlexception.printStackTrace();

		}

	}

	/**
	 * 用于获取数据库列中某个表列名
	 * @param tableName 表名
	 * @return	返回一个ArrayList对象
	 */

	public ArrayList<String> getColomns(String tableName)
	{
		ArrayList<String> res = new ArrayList<>();
		try {

			// 获取数据库的元数据
			DatabaseMetaData metaData = connection.getMetaData();

			// 获取表的列信息
			ResultSet columns = metaData.getColumns(null, null, tableName, null);

			// 遍历并输出列名
			while (columns.next()) {
				String columnName = columns.getString("COLUMN_NAME");
				res.add(columnName);
			}
		} catch (SQLException e) {
			e.printStackTrace();
		}
		return res;
	}
	public ResultSet executeQuery(String sql)
	{
		ResultSet resultset = null;
		try {

			if(debugLevel>0)
			{
				showDebug("["+(new SimpleDateFormat("yyyy-MM-dd HH:mm:ss"))
						.format(new Date())+"]"+"Db executeQuery:" + sql);
			}

			resultset = statement.executeQuery(sql);

		} catch (SQLException sqlexception) {

			sqlexception.printStackTrace();

		}

		return resultset;

	}

	public void executeUpdate(String sql){

		try {

			if(debugLevel>0)
			{
				showDebug("["+(new SimpleDateFormat("yyyy-MM-dd HH:mm:ss"))
						.format(new Date())+"]"+"Db executeUpdate:" + sql);
			}

			statement.executeUpdate(sql);

		} catch (SQLException sqlexception) {

			sqlexception.printStackTrace();

		}

	}

	public void close()
	{

		try {

			statement.close();
			connection.close();
			showDebug("操作数据完毕，关闭了数据库！");

		} catch (SQLException sqlexception) {

			sqlexception.printStackTrace();

		}

	}
}
