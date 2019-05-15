import React from 'react';
import Markdown from 'react-markdown';

const ArticleView = ({articledata}) => {
  return (
    <div>
      <Markdown source={articledata} escapeHtml={false} />
    </div>
  );
};

export default ArticleView;
