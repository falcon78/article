import React from 'react';
import '../../App.css';
import New from '../Content/new';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Navigation from '../Navigation/index';
import * as ROUTES from '../../constants/routes';
// import LandingPage from '../Landing';
// import SignUpPage from '../SignUp';
import SignInPage from '../SignIn';
import { withAuth } from '../Session/index';
import styled from 'styled-components';
import Home from '../Content/home';
import NotFound from '../notfound';
import Edit from '../Content/edit';

// import PasswordForgetPage from '../PasswordForget';
// import HomePage from '../Home';
// import AccountPage from '../Account';
// import AdminPage from '../Admin';

const App = () => {
  return (
    <Router>
      <div>
        <Navigation />
        <TopPadding>
          <Switch>
            <Route exact path={ROUTES.LANDING} component={Home} />
            <Route exact path={ROUTES.SIGN_IN} component={SignInPage} />
            <Route exact path={ROUTES.NEW} component={New} />
            <Route exact path={`${ROUTES.EDIT}/:id`} component={Edit} />
            <Route component={NotFound} />
          </Switch>
        </TopPadding>
      </div>
    </Router>
  );
};

export default withAuth(App);

const TopPadding = styled.div`
  padding: 6em 1em 0;
`;
