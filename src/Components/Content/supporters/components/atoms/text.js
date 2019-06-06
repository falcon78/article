import React from 'react';
import styled from 'styled-components';

const Text = ({ children }) => {
  return <TextArea>{children}</TextArea>;
};

export default Text;

const TextArea = styled.p``;
