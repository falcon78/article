import React from "react";
import InputField from "./modules/inputArticle";
import ArticleView from "./modules/viewArticle";
import styled from "styled-components";
import { withAuthorization } from "../Session/index";
import { compose } from "recompose";
import { withFirebase } from "../Firebase";
class NewArticle extends React.Component {
  componentDidMount() {
    console.log(this.props);
    const ref = this.props.firebase.db.collection("Articles").doc("test");

    ref
      .get()
      .then(snapshot => {
        console.log(snapshot);
      })
      .catch(error => {
        console.log(error);
      });
  }

  render() {
    return (
      <Style>
        <div className={"left"}>
          <InputField className={"left"} />
        </div>
        <div className={"right"}>
          <ArticleView className={"right"} />
        </div>
      </Style>
    );
  }
}

const condition = authUser => !!authUser;

export default compose(
  withAuthorization(condition),
  withFirebase
)(NewArticle);

const Style = styled.div`
  display: flex;
  .left {
    margin: 0.5em;
    width: 45vw;
    height: 90vh;
  }
  .right {
  margin:0.5em
  margin-left: 4em;
    width: 45vw;
    height: 90vh;
  }
`;
