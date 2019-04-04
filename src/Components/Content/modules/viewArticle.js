import React from 'react';
import Markdown from 'react-markdown';

const ArticleView = props => {
  return (
    <div>
      <Markdown source={props.articledata} escapeHtml={false} />
    </div>
  );
};

export default ArticleView;
