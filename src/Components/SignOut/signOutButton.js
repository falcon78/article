import { Button } from "antd";
import React from "react";
import { withFirebase } from "../Firebase";

const SignOutButton = ({ firebase }) => {
  return (
    <Button onClick={firebase.doSignOut} htmlType={"button"}>
      Logout
    </Button>
  );
};

export default withFirebase(SignOutButton);
