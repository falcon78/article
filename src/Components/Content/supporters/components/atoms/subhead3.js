import React from "react";
import styled from "styled-components";

const SubHead = props => {
  return <TextArea className="subhead">{props.subhead}</TextArea>;
};

export default SubHead;

const TextArea = styled.div`
  font-size: 18px;
  padding: 10px 0 10px 5px;
  font-weight: bold;
  align-items: center;
  color: #1c1c1c;
  background: #e5f4f3;
  border-left: solid 5px #009688;
`;
