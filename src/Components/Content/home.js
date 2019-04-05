import React, { Component } from "react";
import ArticleCard from "../Content/modules/ArticleCard";
import { withFirebase } from "../Firebase/index";
import { withAuthorization } from "../Session/index";
import { compose } from "recompose";

const uuidv4 = require("uuid/v4");

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: []
    };
    this.getfirebase = this.getfirebase.bind(this);
  }

  reference = this.props.firebase.db.collection("Articles");

  async getfirebase() {
    let local = [];
    await this.reference
      .orderBy("createdOn","desc").get()
      .then(snapshot => {
        snapshot.forEach(data => {
          local = local.concat(data)

        });
      })
      .catch(err => {
        console.log(err);
      });
    this.setState({
      data: [...this.state.data, ...local]
    });
  }
  componentDidMount() {
    this.getfirebase();
  }

  render() {
    return (
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {this.state.data.map(data => {
          return <ArticleCard key={uuidv4()} articledata={data} />;
        })}
      </div>
    );
  }
}

const condition = authUser => !!authUser;
export default compose(
  withFirebase,
  withAuthorization(condition)
)(Home);
