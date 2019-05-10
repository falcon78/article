import React, { useState } from 'react';
import { AutoComplete, Button } from 'antd';
import styled from 'styled-components';
import { compose } from 'recompose';
import { withAuth, withAuthorization } from '../Session';
import { withFirebase } from '../Firebase';
import { withRouter } from 'react-router-dom';

const locationChange = props => {
  const [location, setLocation] = useState({
    collection: '',
    document: '',
    subcollection: '',
    subdocument: ''
  });

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  let pull_data;

  const handleChange = (value, name) => {
    setLocation({
      ...location,
      [name]: value
    });
  };

  let firebase = props.firebase.db;
  const handlePull = () => {
    setLoading('true');
    let docref_pull = location.subdocument
      ? props.firebase.db
          .collection(location.collection)
          .doc(location.document)
          .collection(location.subcollection)
          .doc(location.subdocument)
      : props.firebase.db
          .collection(location.collection)
          .doc(location.document);
    docref_pull
      .get()
      .then(data => {
        pull_data = data.data();
        console.log(pull_data)
        firebase
          .collection('Private')
          .add(pull_data)
          .then(() => {
            docref_pull
              .delete()
              .then(() => {
              })
              .catch(error => {
                setError('エラーが発生しました。cant delete data');
                setLoading(false);
                console.log(error);
              });
          })
          .catch(error => {
            setError(
              'エラーが発生しました。 cant copy data to private collection'
            );
            setLoading(false);
            console.log(error);
          });
      })
      .catch(error => {
        setError('エラーが発生しました。 Couldnt retrieve root Document');
        setLoading(false);
        console.log(error);
      });
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
      <div class="spacer" />
      {error && (     
          <h3> {error}</h3>
          <div class="spacer" />
      )}
      {loading && (
          <h1>ロード中</h1>
          <div class="spacer" />
      )}

      <Button onClick={handlePull}>編集・非公開</Button>
    </Style>
  );
};
const condition = authUser => !!authUser;
export default compose(
  withRouter,
  withAuthorization(condition),
  withFirebase
)(locationChange);

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
