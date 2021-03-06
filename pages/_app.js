import App from 'next/app';
import Router from 'next/router';
import { parseCookies, destroyCookie } from 'nookies';

import Layout from '../components/_App/Layout';
import { redirectUser } from '../utils/auth';
import axiosBase from '../utils/axiosBase';

const LOGIN_ROUTES = ['/login', '/signup'];
const SUPER_PROTECTED_ROUTES = ['/create'];
const PROTECTED_ROUTES = ['/account', ...SUPER_PROTECTED_ROUTES];

class MyApp extends App {
  static async getInitialProps({ Component, ctx }) {
    const { token } = parseCookies(ctx);

    let pageProps = {};

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }

    const redirectProtected = user => {
      const { pathname } = ctx;
      const isProtectedRoute = PROTECTED_ROUTES.includes(pathname);
      if (isProtectedRoute && !user) {
        return redirectUser(ctx, '/login');
      } else if (!user) {
        return;
      }

      const isSuperRoute = SUPER_PROTECTED_ROUTES.includes(pathname);
      const isAdmin = user.role === 'admin';
      const isRoot = user.role === 'root';
      if (isSuperRoute && !isAdmin && !isRoot) {
        return redirectUser(ctx, '/');
      }

      if (user && LOGIN_ROUTES.includes(pathname)) {
        redirectUser(ctx, '/account');
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
        redirectProtected(user);
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

  syncLogout = event => {
    if (event.key === 'logout') {
      Router.push('/login');
    }
    if (event.key === 'login') {
      Router.push('/account');
    }
  };

  componentDidMount() {
    window.addEventListener('storage', this.syncLogout);
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
