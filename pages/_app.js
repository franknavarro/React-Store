import App from 'next/app';
import { parseCookies, destroyCookie } from 'nookies';

import Layout from '../components/_App/Layout';
import { redirectUser } from '../utils/auth';
import axiosBase from '../utils/axiosBase';

const SUPER_PROTECTED_ROUTES = ['/create'];
const PROTECTED_ROUTES = ['/account', ...SUPER_PROTECTED_ROUTES];

class MyApp extends App {
  static async getInitialProps({ Component, ctx }) {
    const { token } = parseCookies(ctx);

    let pageProps = {};

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }

    const redirectProtected = permissions => {
      const { pathname } = ctx;
      const isProtectedRoute = PROTECTED_ROUTES.includes(pathname);
      if (!permissions && isProtectedRoute) {
        return redirectUser(ctx, '/login');
      }

      const isSuperRoute = SUPER_PROTECTED_ROUTES.includes(pathname);
      const isAdmin = permissions === 'admin';
      const isRoot = permissions === 'root';
      if (isSuperRoute && !isAdmin && !isRoot) {
        return redirectUser(ctx, '/');
      }
    };

    if (!token) {
      redirectProtected();
    } else {
      try {
        const response = await axiosBase.get('/account', {
          headers: { Authorization: token },
        });
        const user = response.data;
        redirectProtected(user.role);
        pageProps.user = user;
      } catch (err) {
        console.error('Error getting current user', err);
        //Throw out invalid token
        destroyCookie(ctx, 'token');
        // Redirect to login page
        redirectProtected();
      }
    }

    return { pageProps };
  }

  render() {
    const { Component, pageProps } = this.props;
    return (
      <Layout {...pageProps}>
        <Component {...pageProps} />
      </Layout>
    );
  }
}

export default MyApp;
