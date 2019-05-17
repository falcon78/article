import React from 'react';
import styled from 'styled-components';
import ArticleDetailImage from '../atoms/article-image';
import Text from '../atoms/text';

const ImageCaption = ({ image, caption }) => {
  return (
    <ImageArea className="image">
      <ArticleDetailImage image={image} />
      {caption && (
        <CaptionLike>
          <Text>{caption}</Text>
        </CaptionLike>
      )}
    </ImageArea>
  );
};

export default ImageCaption;

const CaptionLike = styled.div`
  text-align: center;
  font-size: 11px;
  color: #515151;
  line-height: 1.5;
  @media screen and (max-width: 979px) {
    margin: 0 16px;
  }
`;

const ImageArea = styled.div`
  img {
    width: 100%;
    height: auto;
    margin: 0 0 4px 0;
  }
  @media screen and (min-width: 980px) {
    width: 30%;
    height: auto;
    margin: auto;
  }
`;
