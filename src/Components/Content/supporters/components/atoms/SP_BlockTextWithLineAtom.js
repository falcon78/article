import React from 'react';
import styled from 'styled-components';

const HeadingBorder = ({ text }) => {
  return (
    <Border>
      <Heading color="white" className="header">
        {text}
      </Heading>
    </Border>
  );
};
export default HeadingBorder;

const Heading = styled.span`
  text-align: left;
  left: 0;
  display: inline-block;
  max-width: 80%;
  position: relative;
  background: ${props => (props.color ? props.color : '#f6f6f6')};
  word-wrap: break-word;
  font-size: 18px;
  color: #009688;;
  z-index: 2;
  padding: 0 1em;
`;

const Border = styled.h2`
  text-align: center;
  position: relative;
  font-weight: bold;
  &::before {
    content: '';
    display: block;
    width: 100%;
    height: 2px;
    position: absolute;
    top: 60%;
    background-color: #009688;
    z-index: 1;
  }
`;
