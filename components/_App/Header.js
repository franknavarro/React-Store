import { Menu, Container } from 'semantic-ui-react';
import Router from 'next/router';
import NProgress from 'nprogress';

import MenuItem from './MenuItem';

Router.onRouteChangeStart = () => NProgress.start();
Router.onRouteChangeComplete = () => NProgress.done();
Router.onRouteChangeError = () => NProgress.done();

function Header() {
  const user = true;

  return (
    <Menu fluid id="menu" inverted>
      <Container text>
        <MenuItem
          href="/"
          src="/static/logo.svg"
          size="mini"
          style={{ marginRight: '1em' }}
          text="React Reserve"
        />

        <MenuItem href="/cart" icon="cart" size="large" text="Cart" />

        {user && (
          <MenuItem
            href="/create"
            icon="add square"
            size="large"
            text="Create"
          />
        )}

        {user ? (
          <>
            <MenuItem href="/account" icon="user" size="large" text="Account" />
            <MenuItem icon="sign out" size="large" text="Logout" />
          </>
        ) : (
          <>
            <MenuItem href="/login" icon="sign in" size="large" text="Login" />
            <MenuItem href="/signup" icon="signup" size="large" text="Signup" />
          </>
        )}
      </Container>
    </Menu>
  );
}

export default Header;
