import React from "react";

import SP_SupportersLayout from "../templates/SP_SupportersLayout";

class SP_SupportersMain extends React.Component {
  componentDidMount() {
    this.props.getSP();
  }

  render() {
    return <SP_SupportersLayout aboutSP={this.props.aboutSP} />;
  }
}

export default SP_SupportersMain;
