'use strict';
import React from 'react';
// import Markdown from "react-markdown"
import styled from 'styled-components';
const Markdown = require('react-markdown/with-html');

function MarkdownHTMLParser({ markdown }) {
  if (!markdown) return null;
  const output = markdown.replace(/\\n/gm, '<br/>');
  const outputFinal = output.replace(/(#*)(.*)/g, `$1 $2`);

  return (
    <FontStyle>
      <Markdown escapeHtml={false} source={outputFinal} />
    </FontStyle>
  );
}

const FontStyle = styled.div`
  font-size: 14px;
  color: #515151;
  line-height: 1.5em;
  strong {
    font-weight: bold;
  }
`;

export default MarkdownHTMLParser;
