import React, { useState } from 'react';
import { withRouter } from 'react-router-dom';
import { Input, Button, Modal } from 'antd';
import styled from 'styled-components';
import { compose } from 'recompose';
import { withAuthorization } from '../Session';
import { withFirebase } from '../Firebase';
import Loading from './modules/loading';

const uuidv4 = require('uuid/v4');

function LocationChange({ firebase }) {
  const [location, setLocation] = useState({
    collection: '',
    document: '',
    subcollection: '',
    subdocument: ''
  });

  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  let pullData;

  const matchRegex = /^\/.*/gim;

  const handleChange = event => {
    const inputText = event.target.value;
    if (inputText.match(matchRegex)) {
      const inputArray = inputText.split('/').filter(value => !!value);
      console.log(inputArray);
      if (inputArray.length === 2) {
        setLocation({
          ...location,
          collection: inputArray[0],
          document: inputArray[1]
        });
      } else if (inputArray.length === 4) {
        setLocation({
          ...location,
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
  let input = [];
  for (let key in location) {
    if (location[key]) {
      input = input.concat(
        <Input
          key={uuidv4()}
          style={{ width: '22vw', margin: '2px' }}
          value={location[key]}
          disabled
        />
      );
    }
  }
  return (
    <Style>
      <Input placeholder="パスを入力してください。" onChange={handleChange} />
      <div className="spacer" />
      {input}
      <br />
      {!error && loading && (
        <div style ={{
            width: '100vw'
        }}>
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
`;
