/* eslint-disable react/destructuring-assignment */
import React from 'react';
import { Card } from 'antd';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import * as ROUTES from '../../../constants/routes';

const {Meta} = Card;

const ArticleCard = props => {
  // let preview = props.articledata.data().body[0];
  // preview = preview[Object.keys(preview)[0]]
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
            {/* <p>{preview ? `${preview.substring(0, 40)}...` : '...'}</p> */}
            <Meta title= {props.articledata.data().lead} description="" />
          <br/>
            <p style={{ margin: 0, padding: 0 }}>
              作成 :
              {props.articledata
                .data()
                .createdOn.toString()
                .substring(0, 19)
                .replace('T', ' ')}
            </p>
            {props.articledata.data().lastEdited && (
              <p style={{ margin: 0, padding: 0 }}>
                編集 :
                {props.articledata
                  .data()
                  .lastEdited.toString()
                  .substring(0, 19)
                  .replace('T', ' ')}
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
