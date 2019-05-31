import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const ArticleImage = ({ image }) => {
  return <ImageArea src={image} />;
};

export default ArticleImage;

ArticleImage.propTypes = {
  image: PropTypes.string.isRequired
};

const ImageArea = styled.img`
  width: 100%;
  border: 0;
  vertical-align: bottom;
`;
