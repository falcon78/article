import React, { useState } from 'react';
import { withRouter } from 'react-router-dom';
import { AutoComplete, Button } from 'antd';
import styled from 'styled-components';
import { compose } from 'recompose';
import { withAuthorization } from '../Session';
import { withFirebase } from '../Firebase';

function LocationChange({ firebase }) {
  const [location, setLocation] = useState({
    collection: '',
    document: '',
    subcollection: '',
    subdocument: ''
  });

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  let pullData;

  const handleChange = (value, name) => {
    setLocation({
      ...location,
      [name]: value
    });
  };

  const handlePull = async () => {
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
                  throw errorFetch;
                });
            })
            .catch(errorFetch => {
              throw errorFetch;
            });
        })
        .catch(errorFetch => {
          throw errorFetch;
        });
    } catch (caughtError) {
      setLoading(false);
      setError(
        `エラーが発生しました。${caughtError.name} : ${caughtError.message}`
      );
    }
  };
  return (
    <Style>
      <AutoComplete
        onChange={event => handleChange(event, 'collection')}
        name="collection"
        value={location.collection}
        placeholder="Collection"
      />
      <AutoComplete
        onChange={event => handleChange(event, 'document')}
        name="document"
        placeholder="Document"
        value={location.document}
      />
      <AutoComplete
        onChange={event => handleChange(event, 'subcollection')}
        name="subcollection"
        placeholder="SubCollection"
        value={location.subcollection}
      />
      <AutoComplete
        onChange={event => handleChange(event, 'subdocument')}
        name="subdocument"
        placeholder="SubDocument"
        value={location.subdocument}
      />
      <div className="spacer" />
      {error && (
        <div className="spacer">
          <h3>{error}</h3>
        </div>
      )}
      {loading && (
        <div className="spacer">
          <h1>ロード中</h1>
        </div>
      )}

      <Button onClick={handlePull}>編集・非公開</Button>
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
  .ant-select-auto-complete {
    margin: 10px;
    width: 22%;
  }
  .spacer {
    width: 100vw;
    height: 3em;
  }
`;
