import { Layout, Menu } from 'antd';
import { Link } from 'react-router-dom';
import React from 'react';
import * as ROUTES from '../../constants/routes';
import { AuthUserContext } from '../Session/index';
import SignOutButton from '../SignOut/signOutButton';
import styled from 'styled-components';
import { withRouter } from 'react-router-dom';
const { Header } = Layout;

const Navigation = props => (
  <div>
    <AuthUserContext.Consumer>
      {authUser =>
        authUser ? <NavigationAuth {...props} /> : <NavigationNonAuth />
      }
    </AuthUserContext.Consumer>
  </div>
);

const NavigationAuth = props => {
  let regex = /\/edit\/.*/;
  let SelectedMenu = '1';
  let path = props.location.pathname;
  if (path === ROUTES.HOME) {
    SelectedMenu = '1';
  } else if (path === ROUTES.NEW) {
    SelectedMenu = '2';
  } else if (path.match(regex)) {
    SelectedMenu = '3';
  } else if (path === ROUTES.LOCATIONCHANGE) {
    SelectedMenu = '4';
  }
  return (
    <Style>
      <Header style={{ position: 'fixed', zIndex: 1, width: '100%' }}>
        <div className="logo" />
        <Menu
          className="container"
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={['1']}
          selectedKeys={[SelectedMenu]}
          style={{ lineHeight: '64px' }}
        >
          <Menu.Item key="1">
            <Link to={ROUTES.LANDING}>Home</Link>
          </Menu.Item>
          <Menu.Item key="2">
            <Link to={ROUTES.NEW}>New</Link>
          </Menu.Item>
          <Menu.Item key="3">Edit</Menu.Item>
          <Menu.Item key="4">
            <Link to={ROUTES.LOCATIONCHANGE}>非公開</Link>
          </Menu.Item>
          <Menu.Item key="10" className="button">
            <SignOutButton />
          </Menu.Item>
        </Menu>
      </Header>
    </Style>
  );
};

const NavigationNonAuth = () => {
  return (
    <Style>
      <Header style={{ position: 'fixed', zIndex: 1, width: '100%' }}>
        <div className="logo" />
        <Menu
          className="container"
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={['1']}
          selectedKeys={['1']}
          style={{ lineHeight: '64px' }}
        >
          <Menu.Item key="2">
            <Link to={ROUTES.SIGN_IN}>Sign-In</Link>
          </Menu.Item>
        </Menu>
      </Header>
    </Style>
  );
};

export default withRouter(Navigation);

const Style = styled.div`
  .container {
    display: flex;
  }
  .button {
    margin-left: auto;
    align-self: center;
  }
`;
