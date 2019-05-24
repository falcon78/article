import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { Input, Button, Modal } from 'antd';
import styled from 'styled-components';
import { compose } from 'recompose';
import { withAuthorization } from '../Session';
import { withFirebase } from '../Firebase';
import Loading from './modules/loading';
import { Select } from 'antd';

const Option = Select.Option;
const uuidv4 = require('uuid/v4');

function LocationChange({ firebase }) {
  const [location, setLocation] = useState({
    collection: '',
    document: '',
    subcollection: '',
    subdocument: ''
  });

  const [path, setPath] = useState({});
  const [textInput, setInput] = useState('');
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  let pullData;

  const matchRegex = /^\/.*/gim;

  const handleInputChange = event => {
    setLocation({
      ...location,
      [event.target.name]: event.target.value
    });
  };

  const handleChange = event => {
    const inputValue = event.target.value;
    setInput(inputValue);
    if (inputValue.match(matchRegex)) {
      const inputArray = inputValue.split('/').filter(value => !!value);

      if (inputArray.length === 2) {
        setLocation({
          collection: inputArray[0],
          document: inputArray[1]
        });
      } else if (inputArray.length === 4) {
        setLocation({
          collection: inputArray[0],
          document: inputArray[1],
          subcollection: inputArray[2],
          subdocument: inputArray[3]
        });
      }
    }
  };

  const handlePull = async () => {
    if (
      !(location.collection && location.document) ||
      !(
        location.collection &&
        location.document &&
        location.subcollection &&
        location.subdocument
      )
    ) {
      setError('入力されていない項目があります。');
      return false;
    }
    setLoading('true');
    const pullDocRef = location.subdocument
      ? firebase.db
          .collection(location.collection)
          .doc(location.document)
          .collection(location.subcollection)
          .doc(location.subdocument)
      : firebase.db.collection(location.collection).doc(location.document);
    try {
      await pullDocRef
        .get()
        .then(data => {
          pullData = data.data();
          if (!pullData) {
            throw new Error('データが存在しません。');
          } else if (!pullData.NEWCONTENTTYPE) {
            throw new Error('この記事の形式には対応していません。');
          }
          firebase.db
            .collection('Private')
            .add(pullData)
            .then(() => {
              pullDocRef
                .delete()
                .then(() => {
                  setError('(成功) 記事を非公開にしました');
                })
                .catch(errorFetch => {
                  setError(
                    `エラーが発生しました。${errorFetch.name} : ${
                      errorFetch.message
                    }`
                  );
                  throw errorFetch;
                });
            })
            .catch(errorFetch => {
              setError(
                `エラーが発生しました。${errorFetch.name} : ${
                  errorFetch.message
                }`
              );
              throw errorFetch;
            });
        })
        .catch(errorFetch => {
          setError(
            `エラーが発生しました。${errorFetch.name} : ${errorFetch.message}`
          );
          throw errorFetch;
        });
    } catch (caughtError) {
      setError(
        `エラーが発生しました。${caughtError.name} : ${caughtError.message}`
      );
    } finally {
      setLoading(false);
    }
  };
  const pathDocref = firebase.db.collection('ArticlePathList').doc('pathlist');

  useEffect(() => {
    pathDocref
      .get()
      .then(data => {
        setPath(data.data().path);
      })
      .catch(pullerror => {
        throw pullerror;
      });
  }, []);

  const keys = Object.keys(location);
  let input = [];
  keys.forEach(key => {
    input = input.concat(
      <Input
        style={{ width: '22vw', margin: '2px' }}
        value={location[key]}
        name={key}
        onChange={handleInputChange}
      />
    );
  });

  const handleSelect = value => {
    const articlepath = value.split('/');
    setLocation({
      ...location,
      collection: articlepath[0],
      document: articlepath[1],
      subcollection: articlepath[2]
    });
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
      <Input
        value={textInput}
        placeholder="パスを入力してください。"
        onChange={handleChange}
      />
      <div className="spacer" />
      {input}
      <br />
      {!error && loading && (
        <div
          style={{
            width: '100vw'
          }}
        >
          <Loading />
        </div>
      )}
      <div
        style={{
          width: '100vw',
          display: 'flex',
          justifyContent: 'center',
          margin: '1em'
        }}
      >
        <Button onClick={handlePull}>編集・非公開</Button>
      </div>
      {error && (
        <Modal
          title="メッセージ"
          visible
          onOk={() => {
            setError(false);
          }}
          onCancel={() => {
            setError(false);
          }}
        >
          <p>{error}</p>
        </Modal>
      )}
    </Style>
  );
}
const condition = authUser => !!authUser;
export default compose(
  withRouter,
  withAuthorization(condition),
  withFirebase
)(LocationChange);

const Style = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  .spacer {
    width: 100vw;
    height: 3em;
  }
  .select {
    margin-bottom: 2em;
  }
`;
