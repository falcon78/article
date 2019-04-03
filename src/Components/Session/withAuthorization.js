import React from "react";
import { withRouter } from "react-router-dom";
import { compose } from "recompose";
import { withFirebase } from "../Firebase";
import * as ROUTES from "../../constants/routes";
import {AuthUserContext} from './index'

const withAuthorization = condition => Component => {
  class WithAuthorization extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        authStatus: null
      };
    }
    componentDidMount() {
      this.listener = this.props.firebase.auth.onAuthStateChanged(authUser => {
        if (!condition(authUser)) {
          this.props.history.push(ROUTES.SIGN_IN);
        } else {
          this.setState({
            authStatus: true
          });
        }
      });
    }

    componentWillUnmount() {
      this.listener();
    }

    render() {
      return (
        <React.Fragment>
          <AuthUserContext.Consumer>
            {authUser =>
              condition(authUser) ? <Component {...this.props} /> : null
            }
          </AuthUserContext.Consumer>
        </React.Fragment>
      );
    }
  }
  return compose(
    withRouter,
    withFirebase
  )(WithAuthorization);
};

export default withAuthorization;
