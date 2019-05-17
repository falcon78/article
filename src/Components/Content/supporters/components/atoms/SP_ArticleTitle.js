import React from "react";
import styled from "styled-components";

const ArticleTitle = props => {
  return <TitleBox className="title">{props.title}</TitleBox>;
};

export default ArticleTitle;

const TitleBox = styled.div`
font-size: 20px;
  font-weight: bold;
  color: #6797c0;
`;
