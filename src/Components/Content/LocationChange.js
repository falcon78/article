/* eslint-disable react/jsx-one-expression-per-line */
import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { Card, Input, Button, Modal, Select } from 'antd';
import styled from 'styled-components';
import { compose } from 'recompose';
import { withAuthorization } from '../Session';
import { withFirebase } from '../Firebase';
import Loading from './modules/loading';
import DisplayLocation from './modules/DisplayLocation';

const { Meta } = Card;

const { Option } = Select;

function LocationChange({ firebase, history }) {
  const [location, setLocation] = useState({});
  const [cardPath, setCardPath] = useState({});
  const [path, setPath] = useState({});
  const [title, setTitle] = useState('');
  const [error, setError] = useState('');
  const [searchArticle, setSearchArticle] = useState({});
  const [loading, setLoading] = useState(false);
  const [publishedCollection, setCollection] = useState([]);
  const [publishedDocument, setPublishedDocument] = useState('');

  const fetchPathList = () => {
    const pathDocref = firebase.db
      .collection('ArticlePathList')
      .doc('pathlist');

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
  };

  const characterValidate = char =>
    char ? !!char.replace(/\s/g, '').match(/.*/gi) : false;

  const handleChange = ({ target }) => {
    setTitle(target.value);
  };

  const handleSelect = value => {
    const docLocation = path[value].docPath.split('/');
    const cardLocation = path[value].cardPath.split('/');
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

  // const fetchArticle = () => {
  //   setLoading(true);
  //   if (validate()) {
  //     const articleRef = firebase.db
  //       .collection(location.collection)
  //       .doc(location.document)
  //       .collection(location.subcollection)
  //       .where('title', '==', title);
  //     articleRef.get().then(ref => {
  //       if (ref.empty) {
  //         setLoading(false);
  //         setError('データが存在しません。');
  //         return false;
  //       }
  //       if (ref.size <= 1) {
  //         ref.forEach(doc => {
  //           setSearchArticle({
  //             ...setSearchArticle,
  //             subDocument: doc.data().location.subdocument,
  //             title: doc.data().title,
  //             image: doc.data().image,
  //             fullData: doc.data()
  //           });
  //           // setArticleTitle(doc.data().title);
  //           // setArticle(doc.id);
  //           setLoading(false);
  //           setPublishedDocument(doc.data().published);
  //         });
  //       } else {
  //         setLoading(false);
  //         setError('複数のデータが存在しす。');
  //       }
  //       return true;
  //     });
  //   } else {
  //     setLoading(false);
  //     setError('入力されていない項目があります。');
  //   }
  // };

  const fetchPublishedCollection = () => {
    setLoading(true);
    const localCollection = [];
    firebase.db
      .collection('Published')
      .get()
      .then(collRef => {
        if (collRef.empty) return setLoading(false);
        collRef.forEach(data => {
          const fetchedData = data.data();
          localCollection.push({
            location: fetchedData.location,
            cardLocation: fetchedData.cardLocation,
            title: fetchedData.title,
            image: fetchedData.image,
            publishedDocumentId: data.id
          });
          setLoading(false);
        });
        return collRef;
      })
      .then(() => {
        setCollection(localCollection);
      })

      .catch(fetcherror => {
        setError(`エラーが発生しました。 : ${fetcherror.message}`);
        setLoading(false);
      });
  };

  const privateRef = firebase.db.collection('Private').doc();

  const setPrivate = () => {
    setLoading(true);
    if (validate() && characterValidate(searchArticle.subDocument)) {
      const articleRef = firebase.db
        .collection(location.collection)
        .doc(location.document)
        .collection(location.subcollection)
        .doc(searchArticle.subDocument);
      const cardRef = firebase.db
        .collection(location.collection)
        .doc(location.document)
        .collection(cardPath.subcollection)
        .doc(searchArticle.subDocument);
      articleRef
        .get()
        .then(data => {
          if (data.data().NEWCONTENTTYPE) {
            return data;
          }
          setLoading(false);
          throw new Error('この記事は編集できません。');
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
          return firebase.db
            .collection('Published')
            .doc(publishedDocument)
            .delete();
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

  const setPrivateIndex = index => {
    // eslint-disable-line no-alert
    const confirm = window.confirm(
      `${
        publishedCollection[index].title
      } \n 本当にこの記事を非公開にしますか？`
    );
    if (!confirm) return false;
    setLoading(true);
    const articleRef = firebase.db
      .collection(publishedCollection[index].location.collection)
      .doc(publishedCollection[index].location.document)
      .collection(publishedCollection[index].location.subcollection)
      .doc(publishedCollection[index].location.subdocument);
    const cardRef = firebase.db
      .collection(publishedCollection[index].cardLocation.collection)
      .doc(publishedCollection[index].cardLocation.document)
      .collection(publishedCollection[index].cardLocation.subcollection)
      .doc(publishedCollection[index].cardLocation.subdocument);
    articleRef
      .get()
      .then(data => {
        if (data.data().NEWCONTENTTYPE) {
          return data;
        }
        setLoading(false);
        throw new Error('この記事は編集できません。');
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
        return firebase.db
          .collection('Published')
          .doc(publishedCollection[index].publishedDocumentId)
          .delete();
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
  };

  useEffect(() => {
    fetchPathList();
    fetchPublishedCollection();
  }, []);

  return (
    <Style>


      <div>
        <p>タイトルを入力</p>
        <Input placeholder="タイトル" value={title} onChange={handleChange} />
      </div>


      <Button className="last" type="danger" onClick={setPrivate}>
        非公開
      </Button>

      {loading && <Loading inline />}

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        <h3>公開した記事</h3>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center'
          }}
        >
          {publishedCollection.length >= 1 &&
            publishedCollection.map((data, index) => (
              <div onClick={() => setPrivateIndex(index)}>
                <Card
                  hoverable
                  style={{ width: 240, margin: 10 }}
                  cover={<img src={data.image} />}
                >
                  <Meta title={data.title} />
                </Card>
              </div>
            ))}
        </div>
      </div>

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
  h3 {
    margin-top: 2em;
    padding: 0.7em;
  }
`;

const condition = authUser => {
  return !!authUser;
};
export default compose(
  withRouter,
  withAuthorization(condition),
  withFirebase
)(LocationChange);
