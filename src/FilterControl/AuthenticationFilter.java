package FilterControl;

import javax.servlet.*;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.util.Enumeration;

public class AuthenticationFilter implements Filter{
    @Override
    public void init(FilterConfig filterConfig) throws ServletException {

    }

    @Override
    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain) throws IOException, ServletException {
        HttpServletRequest hsr = (HttpServletRequest) servletRequest;
        HttpSession session = hsr.getSession();
        Enumeration<String> names  = session.getAttributeNames();
        while(names.hasMoreElements())
        {
            System.out.println(names);
        }
    }

    @Override
    public void destroy() {

    }
}
