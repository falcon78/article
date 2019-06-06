/* eslint-disable react/jsx-one-expression-per-line */
import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { Input, Button, Modal, Select } from 'antd';
import styled from 'styled-components';
import { compose } from 'recompose';
import { withAuthorization } from '../Session';
import { withFirebase } from '../Firebase';
import Loading from './modules/loading';
import DisplayLocation from './modules/DisplayLocation';
// eslint-disable-next-line prefer-destructuring
const Option = Select.Option;

function LocationChange({ firebase, history }) {
  const [location, setLocation] = useState({});
  const [cardPath, setCardPath] = useState({});
  const [path, setPath] = useState({});
  const [title, setTitle] = useState('');
  const [error, setError] = useState('');
  const [article, setArticle] = useState('');
  const [articleTitle, setArticleTitle] = useState('');
  const [loading, setLoading] = useState(false);

  const pathDocref = firebase.db.collection('ArticlePathList').doc('pathlist');

  useEffect(() => {
    pathDocref
      .get()
      .then(data => {
        if (data.exists) {
          setPath(data.data().path);
        }
      })
      .catch(pullerror => {
        throw pullerror;
      });
  }, []);

  const characterValidate = char =>
    char ? !!char.replace(/\s/g, '').match(/.*/gi) : false;

  const handleChange = ({ target }) => {
    setTitle(target.value);
  };

  const handleSelect = value => {
    const docLocation = value.docPath.split('/');
    const cardLocation = value.cardPath.split('/');
    setLocation({
      collection: docLocation[0],
      document: docLocation[1],
      subcollection: docLocation[2]
    });
    setCardPath({
      collection: cardLocation[0],
      document: cardLocation[1],
      subcollection: cardLocation[2]
    });
  };

  const validate = () => {
    if (
      characterValidate(location.document) &&
      characterValidate(location.collection) &&
      characterValidate(location.subcollection) &&
      characterValidate(cardPath.document) &&
      characterValidate(cardPath.collection) &&
      characterValidate(cardPath.subcollection) &&
      characterValidate(title)
    ) {
      return true;
    }
    return false;
  };

  const fetchArticle = () => {
    setLoading(true);
    if (validate()) {
      const articleRef = firebase.db
        .collection(location.collection)
        .doc(location.document)
        .collection(location.subcollection)
        .where('title', '==', title);
      articleRef.get().then(ref => {
        if (ref.empty) {
          setLoading(false);
          setError('データが存在しません。');
          return false;
        }
        if (ref.size <= 1) {
          ref.forEach(doc => {
            setArticleTitle(doc.data().title);
            setArticle(doc.id);
            setLoading(false);
          });
        } else {
          setLoading(false);
          setError('複数のデータが存在しす。');
        }
        return true;
      });
    } else {
      setLoading(false);
      setError('入力されていない項目があります。');
    }
  };

  const privateRef = firebase.db.collection('Private').doc();

  const setPrivate = () => {
    setLoading(true);
    if (validate() && characterValidate(article)) {
      const articleRef = firebase.db
        .collection(location.collection)
        .doc(location.document)
        .collection(location.subcollection)
        .doc(article);
      const cardRef = firebase.db
        .collection(location.collection)
        .doc(location.document)
        .collection(cardPath.subcollection)
        .doc(article);
      articleRef
        .get()
        .then(data => {
          if (data.data().NEWCONTENTTYPE) {
            return data;
          }
          setLoading(false);
          throw new Error("この記事は編集できません。")
        })
        .then(data => {
          return privateRef.set(data.data());
        })
        .then(() => {
          return cardRef.delete();
        })
        .then(() => {
          return articleRef.delete();
        })
        .then(() => {
          setLoading(false);
          history.push('/');
        })
        .catch(fetchError => {
          setLoading(false);
          setError(
            `エラーが発生しました。 ${fetchError.name} : ${fetchError.message}`
          );
          throw error;
        });
    } else {
      setLoading(false);
      setError(' 入力されていない項目があるか、確認ボタンが押されていません。');
    }
  };

  return (
    <Style>
      <div className="select">
        <Select style={{ width: '300px' }} onChange={handleSelect}>
          {Object.keys(path).map(key => (
            <Option value={path[key]}>{key}</Option>
          ))}
        </Select>
      </div>
      <div className="pathdiv">
        {location.document && (
          <React.Fragment>
            <p className="label">ドキュメントパス</p>
            <DisplayLocation location={location} />
          </React.Fragment>
        )}
      </div>

      <div className="pathdiv">
        {cardPath.document && (
          <React.Fragment>
            <p className="label">カードパス</p>
            <DisplayLocation location={cardPath} />
          </React.Fragment>
        )}
      </div>

      <div>
        <p>タイトルを入力</p>
        <Input placeholder="タイトル" value={title} onChange={handleChange} />
      </div>
      <Button onClick={fetchArticle}>確認</Button>
      {articleTitle && (
        <div className="title">
          <span role="img" aria-label="smile emoji">
            😃{articleTitle}
          </span>
        </div>
      )}
      {article && (
        <div className="title">
          <span role="img" aria-label="smile emoji">
            😃{article}
          </span>
        </div>
      )}
      <Button className="last" type="danger" onClick={setPrivate}>
        非公開
      </Button>

      {loading && <Loading inline />}

      <div>
        {error && (
          <Modal
            title="メッセージ"
            visible
            onOk={() => {
              setError('');
            }}
            onCancel={() => {
              setError('');
            }}
          >
            <p>{error}</p>
          </Modal>
        )}
      </div>
    </Style>
  );
}

const Style = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  align-items: center;
  .spacer {
    width: 100vw;
    height: 3em;
  }
  .select {
    margin-bottom: 2em;
  }
  p {
    margin: 8px 0;
  }
  button {
    margin: 10px;
  }
`;

const condition = authUser => !!authUser;
export default compose(
  withRouter,
  withAuthorization(condition),
  withFirebase
)(LocationChange);
