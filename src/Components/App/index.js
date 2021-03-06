import React from 'react';
import '../../App.css';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import New from '../Content/new';
import styled from 'styled-components';
import Navigation from '../Navigation/index';
import * as ROUTES from '../../constants/routes';
// import LandingPage from '../Landing';
// import SignUpPage from '../SignUp';
import SignInPage from '../SignIn';
import { withAuth } from '../Session/index';
import Home from '../Content/home';
import NotFound from '../notfound';
import Edit from '../Content/edit';
import UnPublish from '../Content/unPublish';

// import PasswordForgetPage from '../PasswordForget';
// import HomePage from '../Home';
// import AccountPage from '../Account';
// import AdminPage from '../Admin';

const App = () => {
  return (
    <Style>
      <Router>
        <div>
          <Navigation />
          <TopPadding>
            <Switch>
              <Route exact path={ROUTES.LANDING} component={Home} />
              <Route exact path={ROUTES.SIGN_IN} component={SignInPage} />
              <Route exact path={ROUTES.NEW} component={New} />
              <Route exact path={`${ROUTES.EDIT}/:id`} component={Edit} />
              <Route
                exact
                path={ROUTES.LOCATIONCHANGE}
                component={UnPublish}
              />
              <Route component={NotFound} />
            </Switch>
          </TopPadding>
        </div>
      </Router>
    </Style>
  );
};

export default withAuth(App);

const Style = styled.div`
  @import url('https://fonts.googleapis.com/css?family=Noto+Sans+JP&display=swap');
  font-family: 'Noto Sans JP', sans-serif;
`;

const TopPadding = styled.div`
  padding: 6em 1em 0;
`;
