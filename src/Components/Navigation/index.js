import { Layout, Menu } from "antd";
import { Link } from "react-router-dom";
import React from "react";
import * as ROUTES from "../../constants/routes";
import { AuthUserContext } from "../Session/index";
import SignOutButton from "../SignOut/signOutButton";
import styled from "styled-components";
const { Header } = Layout;

const Navigation = () => (
  <div>
    <AuthUserContext.Consumer>
      {authUser => (authUser ? <NavigationAuth /> : <NavigationNonAuth />)}
    </AuthUserContext.Consumer>
  </div>
);

const NavigationAuth = () => {
  return (
    <Style>
      <Header style={{ position: "fixed", zIndex: 1, width: "100%" }}>
        <div className="logo" />
        <Menu
          className="container"
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={["1"]}
          style={{ lineHeight: "64px" }}
        >
          <Menu.Item key="1">
            <Link to={ROUTES.LANDING}>Home</Link>
          </Menu.Item>
          <Menu.Item key="3">
            <Link to={ROUTES.NEW}>New</Link>
          </Menu.Item>
          <Menu.Item className="button">
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
      <Header style={{ position: "fixed", zIndex: 1, width: "100%" }}>
        <div className="logo" />
        <Menu
          className="container"
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={["1"]}
          style={{ lineHeight: "64px" }}
        >
          <Menu.Item key="2">
            <Link to={ROUTES.SIGN_IN}>Sign-In</Link>
          </Menu.Item>
        </Menu>
      </Header>
    </Style>
  );
};

export default Navigation;

const Style = styled.div`
  .container {
    display: flex;
  }
  .button {
    margin-left: auto;
    align-self: center;
  }
`;
