import React from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import { withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';
import { AuthUserContext } from './index';

const withAuthorization = condition => Component => {
  class WithAuthorization extends React.Component {
    constructor({ firebase, history }) {
      super({ firebase, history });
      this.firebase = firebase;
      this.history = history;
      this.state = {
        authStatus: null
      };
    }

    componentDidMount() {
      this.listener = this.firebase.auth.onAuthStateChanged(authUser => {
        if (!condition(authUser)) {
          this.history.push(ROUTES.SIGN_IN);
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
      const { authStatus } = this.state;
      return <div>{authStatus ? <Component {...this.props} /> : null}</div>;
    }
  }
  return compose(
    withRouter,
    withFirebase
  )(WithAuthorization);
};

export default withAuthorization;
