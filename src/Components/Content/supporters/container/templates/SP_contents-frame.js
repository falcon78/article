import React from "react";
import styled from "styled-components";

import PropTypes from "prop-types";
import Header from "./../../../container/organisms/header";
import Footer from "./../../../container/organisms/footer";
import EntryButton from './SP_EntryButton';

class ContentsFrame extends React.Component {
  constructor() {
    super();
    this.state = {
      screenHeight: window.parent.screen.height,
      difference: 0
    };
  }

  componentDidMount() {
    this.setTimer();
  }

  componentWillUnmount() {
    clearInterval(this.setTimer);
  }

  getDifference = () => {
    if (this.refs.elementHeight !== undefined) {
      const difference =
        this.state.screenHeight - this.refs.elementHeight.clientHeight;
      this.setState({
        difference: difference
      });
    }
  };

  setTimer = () => {
    setInterval(this.getDifference, 1000);
  };

  render() {
    return (
      <div ref="elementHeight">
        <Header ref={el => (this.headerRef = el)} />
        <BodyStyles>{this.props.children}</BodyStyles>

        <GetMargin diff={this.state.difference}>
          <Footer ref={el => (this.footerRef = el)} />
        </GetMargin>
        <EntryButton
          images={this.props.images}
          headerImage={this.props.headerImage}
          text={this.props.text}
          paragraph={this.props.paragraph}
        />
      </div>
    );
  }
}
export default ContentsFrame;

const topMargin = "80px";
const barMargin = "10px";
const BodyStyles = styled.div`
  padding-top: ${topMargin};
  padding-bottom: ${barMargin};
  background-color: #f6f6f6;
  font-family: "Helvetica Neue", "Roboto", "ヒラギノ角ゴ Pro W3",
    "Hiragino Kaku Gothic Pro";
`;

const GetMargin = styled.div`
  width: 100%;
  position: ${props => (props.diff < 0 ? "relative" : "fixed")};
  bottom: 0;
  z-index: 3;
`;

ContentsFrame.propTypes = {
  children: PropTypes.any.isRequired
};
