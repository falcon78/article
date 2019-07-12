import React from 'react';
import styled from 'styled-components';

const CustomMarkdownColor = ({ color, text }) => {
  const Color = styled.div`
    .customMarkdownColor {
      font-size: 14px;
      line-height: 1.5em;
      strong {
        font-weight: bold;
      }
      color: ${color};
    }
  `;
  return <Color>{text}</Color>;
};

export default CustomMarkdownColor;
