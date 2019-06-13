import React from 'react ';
import styled from 'styled-components';

const Button = ({ primary }) => {
  const Text = styled.div`
    color: ${primary => (primary ? 'red' : '#f4f4f4')};
  `;

  return <Text>Text</Text>;
};

export default Button;