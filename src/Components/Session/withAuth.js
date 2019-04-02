import React from "react";
import { withFirebase } from "../Firebase/index";

const withAuth = Component => {
  class WithAuth extends React.component {
    constructor(props) {
      super(props);
      this.state = {
        authUser: null
      };
    }

    componentDidMount() {
      this.listener = this.props.firebase.auth.onAuthStateChange(authUser => {
        authUser
          ? this.setState({ authUser })
          : this.setState({ authUser: null });
      });
      console.log(this.state.authUser);
    }
    componentWillUnmount(){
      this.listener();
    }

    render() {
      return <Component {...this.props} />;
    }
  }
  return withFirebase(WithAuth);
};

export default withAuth;
