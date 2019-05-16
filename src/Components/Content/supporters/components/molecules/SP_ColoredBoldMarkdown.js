import React from "react";
import Markdown from "react-markdown";
import styled from 'styled-components'



const ColoredBoldMarkdown = props => {
  const Colored = styled.div`
  del {
    color: ${props.color};
    text-decoration : none;
  }
  strong{
      font-weight: bold;
  }
`;
  const newLineFix = props.colortext.replace(/\\n/g, "<br/>");
  return (
    <Colored>
      <Markdown className="color" escapeHtml={false} source={newLineFix} />
    </Colored>
  );
};

export default ColoredBoldMarkdown;
