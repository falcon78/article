import React from "react";
import styled from "styled-components";

import Text from "./../../../components/atoms/text";
import PropTypes from "prop-types";
import ReserveImage from "./../../../components/atoms/reserve-image";
import RegistrationImage from "./../../../components/atoms/registration-image";
import Ripple from "./../../../components/atoms/ripple";

const SP_floatingActionButton = props => {
  return (
    <ButtonArea color={props.color}>
      <Contents>
        {(() => {
          if (props.color === "#2E78A1") {
            return <RegistrationImage image={props.image} />;
          } else {
            return <ReserveImage image={props.image} />;
          }
        })()}
        <TextArea>
          <Text>{props.text}</Text>
        </TextArea>
      </Contents>
    </ButtonArea>
  );
};

export default SP_floatingActionButton;

SP_floatingActionButton.propTypes = {
  text: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired
};

const ButtonArea = styled.div`
  width: 67px;
  height: 67px;
  right: 15px;
  background-color: #2e78a1;
  border-radius: 50%;
  z-index: 4;
  position: fixed;
  bottom: 8px;
`;

const Contents = styled.a`
  pointer-events: ${props => (props.href ? "" : "none")};
  display: flex;
  height: 100%;
  flex-direction: column;
  align-items: center;
  text-decoration: none;
`;


const TextArea = styled.div`
  color: white;
  font-size: 10px;
  font-weight: bold;
`;

