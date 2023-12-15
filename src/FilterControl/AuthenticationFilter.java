package FilterControl;

import DBControl.DB;

import javax.servlet.*;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.Console;
import java.io.IOException;
import java.net.URLDecoder;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.util.Enumeration;

public class AuthenticationFilter implements Filter{

    private DB db;
    @Override
    public void init(FilterConfig filterConfig) throws ServletException {
        db = new DB("101.35.232.25:3306","tmxq","123456","yjykfsj8");
    }

    @Override
    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain) throws IOException, ServletException {


            HttpServletRequest hsr = (HttpServletRequest) servletRequest;
            System.out.println("正在拦截URL:" + hsr.getRequestURI());
            HttpServletResponse hrp = (HttpServletResponse) servletResponse;
            HttpSession session = hsr.getSession();
            Cookie[] cookies = hsr.getCookies();

            // 获取session信息
            Object uid = null;
            uid =  session.getAttribute("uid");
            if(uid != null)
            {
                System.out.println("已有session uid：" + uid.toString());
                filterChain.doFilter(servletRequest,servletResponse);
                return;
            }

            // 获取cookie信息
            String cookie_username = null;
            String cookie_password = null;
            if(cookies != null)
            {
                for(Cookie cookie:cookies)
                {
                    // 获得名字是cookie_username和cookie_password
                    if ("username".equals(cookie.getName())) {
                        cookie_username = cookie.getValue();
                        // 对cookie中的值解码
                        cookie_username = URLDecoder.decode(cookie_username,
                                "UTF-8");
                        System.out.println(cookie_username);
                    }
                    if ("password".equals(cookie.getName())) {
                        cookie_password = cookie.getValue();
                        System.out.println(cookie_password);
                    }
                }
            }
            else {
                System.out.println("不存在Cookie");
                hrp.sendRedirect("/main/login/login.jsp");
                return;
            }

            // 判断Cookie值
            db.Connect();
            String sql ="select user_id,user_name,PASSWORD from user_file where user_name = \""+cookie_username+"\"";
            ResultSet rs = db.ExecuteQuery(sql);
            try{
                if(rs.next())
                {
                    // 获取数据库对应密码
                    String truePassword = rs.getString("password");
                    if(truePassword.equals(cookie_password))
                    {
                        System.out.println("cookie正确");
                        InitSession(cookie_username,session);
                        filterChain.doFilter(servletRequest,servletResponse);
                    }
                    else {
                        System.out.println("cookie错误，密码错误");
                        hrp.sendRedirect("main/login/login.jsp");
                    }
                }
                else {
                    System.out.println("cookie错误，缺少用户名");
                    hrp.sendRedirect("/main/login/login.jsp");
                }
            }
            catch (SQLException e) {
                throw new RuntimeException(e);
            }
    }

    @Override
    public void destroy() {

    }


    private void InitSession(String user_name,HttpSession session) throws SQLException {
        String sql = "select * from user_file where user_name='" + user_name + "'";
        db.Connect();
        ResultSet rs = db.ExecuteQuery(sql);
        ResultSetMetaData rsmd = rs.getMetaData();
        int fieldCount = rsmd.getColumnCount();
        session.setAttribute("avatar","");
        if(rs.next())
        {
            for(int i = 0; i < fieldCount; ++i)
            {
                if(rs.getString(rsmd.getColumnName(i + 1)) != null)
                {
                    session.setAttribute(rsmd.getColumnName(i + 1),rs.getString(rsmd.getColumnName(i + 1)));
                    if(rsmd.getColumnName(i + 1).equals("user_id"))
                    {
                        session.setAttribute("uid",rs.getString(rsmd.getColumnName(i + 1)));
                    }
                }
            }
        }
        db.Close();
    }
}
