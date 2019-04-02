import React, { Component } from "react";
import "../../App.css";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Navigation from "../Navigation/index";
import * as ROUTES from "../../constants/routes";
import {withFirebase} from "../Firebase/index";
// import LandingPage from '../Landing';
// import SignUpPage from '../SignUp';
import SignInPage from "../SignIn";
import {AuthUserContext} from '../Session/index'
// import PasswordForgetPage from '../PasswordForget';
// import HomePage from '../Home';
// import AccountPage from '../Account';
// import AdminPage from '../Admin';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      authUser: null
    };
  }

  componentDidMount() {
    this.props.firebase.auth.onAuthStateChanged(authUser => {
      authUser
        ? this.setState({ authUser })
        : this.setState({ authUser: null });
      //console.log(authUser)
    });
  }

  componentWillUnmount() {
    this.listener();
  }

  render() {
    return (
      <AuthUserContext.Provider value={this.state.authUser}>
      <Router>
        <div>
          <Navigation authUser={this.state.authUser} />
          <Route exact path={ROUTES.SIGN_IN} component={SignInPage} />
        </div>
      </Router>
      </AuthUserContext.Provider>
    );
  }
}

export default withFirebase(App);
