import React from "react";
import "../../App.css";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Navigation from "../Navigation/index";
import * as ROUTES from "../../constants/routes";
// import LandingPage from '../Landing';
// import SignUpPage from '../SignUp';
import SignInPage from "../SignIn";
import { withAuth } from "../Session/index";
// import PasswordForgetPage from '../PasswordForget';
// import HomePage from '../Home';
// import AccountPage from '../Account';
// import AdminPage from '../Admin';

const App = () => {
  return (
    <Router>
      <div>
        <Navigation  />
        <Route exact path={ROUTES.SIGN_IN} component={SignInPage} />
      </div>
    </Router>
  );
};

export default withAuth(App);
