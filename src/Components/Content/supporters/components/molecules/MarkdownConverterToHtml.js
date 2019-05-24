import React from 'react';
import Markdown from 'react-markdown';
import styled from 'styled-components';


function MarkdownConverterToHtml({ markdown }) {
  const output = markdown.replace(/\\n/g, '  \n'); // Markdownは”\n”の前スペースを二回開けないと改行されません。
  const outputFinal = output.replace(/#{,1}/g, '# ');

  return (
    <FontStyle>
      <Markdown source={outputFinal} />
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

export default MarkdownConverterToHtml;
