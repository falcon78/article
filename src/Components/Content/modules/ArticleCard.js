/* eslint-disable react/destructuring-assignment */
import React from 'react';
import { Card } from 'antd';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import * as ROUTES from '../../../constants/routes';

const { Meta } = Card;

const ArticleCard = props => {
  return (
    <div>
      {props.articledata.data().title && (
        <Link to={`${ROUTES.EDIT}/${props.articledata.id}`}>
          <Card
            hoverable
            title={props.articledata.data().title}
            style={{ width: 300, margin: '1em' }}
            cover={<img alt="example" src={props.articledata.data().image} />}
          >
            <Meta title={props.articledata.data().lead} description="" />
            <br />
            <p style={{ margin: 0, padding: 0 }}>
              作成 :{props.articledata.data().createdOn}
            </p>
            {props.articledata.data().lastEdited && (
              <p style={{ margin: 0, padding: 0 }}>
                編集 :{props.articledata.data().lastEdited}
              </p>
            )}
          </Card>
        </Link>
      )}
    </div>
  );
};

ArticleCard.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  articledata: PropTypes.object.isRequired
};

export default ArticleCard;
