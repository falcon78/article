import React from 'react';
import Markdown from 'react-markdown';
import styled from 'styled-components';


function MarkdownConverterToHtml({ markdown }) {
  const output = markdown.replace(/\\n/g, '  \n'); // Markdownは”\n”の前スペースを二回開けないと改行されません。
  const outputFinal = output.replace(/#/g, '# ');

  return (
    <FontStyle>
      <Markdown source={outputFinal} />
    </FontStyle>
  );
}

const FontStyle = styled.div`
  font-family: 'Helvetica Neue', 'Roboto', 'ヒラギノ角ゴ Pro W3',
    'Hiragino Kaku Gothic Pro', serif;
  font-size: 14px;
  color: #515151;
  line-height: 1.5em;
  strong {
    font-weight: bold;
  }
`;

export default MarkdownConverterToHtml;
