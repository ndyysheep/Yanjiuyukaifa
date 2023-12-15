package servletControl;

import javax.servlet.ServletException;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.Console;
import java.io.IOException;

public class Logout extends HttpServlet {
    public void service(HttpServletRequest request, HttpServletResponse response) throws IOException, ServletException {
        Cookie[] cookies = request.getCookies();
        for(Cookie cookie:cookies)
        {
            cookie.setMaxAge(0);
            response.addCookie(cookie);
        }
        request.getSession().invalidate();
        System.out.println("登出成功!");
        response.sendRedirect("/main/login/login.jsp");
    }

}
