import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { Card, Input, Button, Modal, Select } from 'antd';
import styled from 'styled-components';
import { compose } from 'recompose';
import { withAuthorization } from '../Session';
import { withFirebase } from '../Firebase';
import Loading from './modules/loading';

const { Meta } = Card;
const axios = require('axios');

function UnPublish({ firebase, history }) {
  // store search result documents in an array
  const [searchResults, setSearchResults] = useState([]);
  // store 10 initially fetched document in an array
  const [fetchedResults, setFetchedResult] = useState([]);
  // app state (loading, state)
  const [state, setState] = useState({});

  const privateRef = firebase.db.collection('Private').doc();

  const fetchPublishedCollection = () => {
    setState({
      ...state,
      loading: true
    });
    const localCollection = [];
    firebase.db
      .collection('Published')
      .orderBy('lastEdited', 'desc')
      .limit(10)
      .get()
      .then(collRef => {
        if (collRef.empty)
          return setState({
            ...state,
            loading: false
          });
        collRef.forEach(data => {
          const fetchedData = data.data();
          localCollection.push({
            location: fetchedData.location,
            cardLocation: fetchedData.cardLocation,
            title: fetchedData.title,
            image: fetchedData.image,
            publishedDocumentId: fetchedData.published
          });
          setState({
            ...state,
            loading: false
          });
        });
        return collRef;
      })
      .then(() => {
        setFetchedResult(localCollection);
      })

      .catch(fetcherror => {
        setState({
          ...state,
          loading: false,
          error: `エラーが発生しました。 : ${fetcherror.message}`
        });
      });
  };

  const searchArticles = async () => {
    if (!state.input) return false;

    const data = await axios.get(
      `https://asia-northeast1-autho-ce94e.cloudfunctions.net/api/searchPublished/${
        state.input
      }`
    );
    setSearchResults(data.data);
    return true;
  };

  const setPrivate = document => {
    console.log(document);
    const confirmation = window.confirm('本当に非公開にしますか?');
    if (!confirmation) return false;
    const articleRef = firebase.db
      .collection(document.location.collection)
      .doc(document.location.document)
      .collection(document.location.subcollection)
      .doc(document.location.subdocument);
    const cardRef = firebase.db
      .collection(document.cardLocation.collection)
      .doc(document.cardLocation.document)
      .collection(document.cardLocation.subcollection)
      .doc(document.cardLocation.subdocument);
    articleRef
      .get()
      .then(data => {
        if (data.data().NEWCONTENTTYPE) {
          return data;
        }
        setState({
          ...state,
          loading: true
        });
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
          .doc(document.publishedDocumentId)
          .delete();
      })
      .then(() => {
        setState({
          ...state,
          loading: false
        });
        history.push('/');
      })
      .catch(fetchError => {
        setState({
          ...state,
          loading: false,
          error: `エラーが発生しました。 ${fetchError.name} : ${
            fetchError.message
          }`
        });
        throw fetchError;
      });
    return true;
  };

  useEffect(() => {
    fetchPublishedCollection();
  }, []);

  return (
    <Style>
      <div className="searchBar">
        <Input
          onChange={event => {
            setState({ ...state, input: event.target.value });
          }}
        />
        <Button onClick={searchArticles}>検索</Button>
      </div>
      {searchResults && (
        <div className="cardGallery">
          <h3>検索結果</h3>
          {searchResults.map(doc => (
            <ClickableCard clickAction={setPrivate} document={doc} />
          ))}
        </div>
      )}

      {fetchedResults && (
        <div className="cardGallery">
          <h3>公開済み</h3>
          {fetchedResults.map(doc => (
            <ClickableCard clickAction={setPrivate} document={doc} />
          ))}
        </div>
      )}
    </Style>
  );
}

const ClickableCard = ({ clickAction, document }) => {
  return (
    <div onClick={() => clickAction(document)}>
      <Card
        hoverable
        style={{ width: 240, margin: 10 }}
        cover={<img alt="articleImage" src={document.image} />}
      >
        <Meta title={document.title} />
      </Card>
    </div>
  );
};

const Style = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  .searchBar {
    display: flex;
    width: 40vw;
  }
  h3 {
    margin-top: 3em;
    width: 100vw;
    text-align: center;
  }
  .cardGallery{
    width: 80vw;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
  }
`;

const condition = authUser => {
  return !!authUser;
};
export default compose(
  withRouter,
  withAuthorization(condition),
  withFirebase
)(UnPublish);
