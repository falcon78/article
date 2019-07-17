import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { Card, Input, Button, Modal } from 'antd';
import styled from 'styled-components';
import { compose } from 'recompose';
import { withAuthorization } from '../Session';
import { withFirebase } from '../Firebase';
import Loading from './modules/loading';
import MarkdownArticle from './supporters/container/organisms/markdownArticle';

const { Meta } = Card;
const axios = require('axios');

function UnPublish({ firebase, history }) {
  // store search result documents in an array
  const [searchResults, setSearchResults] = useState([]);
  // store 10 initially fetched document in an array
  const [fetchedResults, setFetchedResult] = useState([]);
  // app state (loading, state)
  const [state, setState] = useState({});
  // state for storing info about clicked article;
  const [open, setOpen] = useState({});

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
            published: fetchedData.published
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

  // fetches the clicked document to preview
  const fetchPreviewArticle = document => {
    setState({
      ...state,
      loading: true
    });
    firebase.db
      .doc(`/Published/${document.published}`)
      .get()
      .then(data => {
        setOpen(data.data());
        setState({
          ...state,
          loading: false
        });
      })
      .catch(err => {
        setState({
          ...state,
          loading: false,
          error: `エラーは発生しました: ${err.message}`
        });
      });
  };

  const searchArticles = async () => {
    if (!state.input) return false;
    setState({
      ...state,
      loading: true
    });
    await axios
      .get(
        `https://asia-northeast1-infodex-talentgate.cloudfunctions.net/api/searchPublished/${
          state.input
        }`
      )
      .then(data => {
        setSearchResults(data.data);
        setState({
          ...state,
          loading: false
        });
      })
      .catch(err => {
        setState({
          state,
          loading: false,
          error: `エラーが発生しました : ${err.message}`
        });
      });

    return true;
  };

  const setPrivate = document => {
    setState({
      ...state,
      loading: true
    });
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
          .doc(document.published)
          .delete();
      })
      .then(() => {
        setState({
          ...state,
          loading: false
        });
        setOpen({});
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
      {state.error && <p>{state.error}</p>}
      {state.loading && <Loading />}
      <div className="searchBar">
        <Input
          onKeyDown={event => {
            if (event.key === 'Enter') {
              searchArticles();
            }
          }}
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
            <ClickableCard clickAction={fetchPreviewArticle} document={doc} />
          ))}
        </div>
      )}

      {fetchedResults && (
        <div className="cardGallery">
          <h3>公開済み</h3>
          {fetchedResults.map(doc => (
            <ClickableCard clickAction={fetchPreviewArticle} document={doc} />
          ))}
        </div>
      )}
      {open.title && (
        <Modal
          visible={!!open.title}
          title={open.title ? open.title : ''}
          onOk={() => setPrivate(open)}
          onCancel={() => setOpen({})}
          footer={[
            <Button
              key="back"
              onClick={() => {
                setOpen({});
              }}
            >
              キャンセル
            </Button>,
            <Button
              key="submit"
              type="primary"
              loading={state.loading}
              onClick={() => setPrivate(open)}
            >
              非公開
            </Button>
          ]}
        >
          <MarkdownArticle
            section={open.section}
            image={open.image}
            title={open.title}
            lead={open.lead}
          />
        </Modal>
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
  .cardGallery {
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
