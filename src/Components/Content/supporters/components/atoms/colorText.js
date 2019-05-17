import React from 'react';
import styled from 'styled-components';

const ColorText = ({ color, text }) => {
  const Color = styled.div`
    div {
      color: ${color};
    }
  `;
  return (
    <Color
      style={{
        color
      }}
    >
      {text}
    </Color>
  );
};

export default ColorText;
