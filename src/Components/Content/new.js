import React from 'react';
import styled from 'styled-components';
import { compose } from 'recompose';
import { withRouter } from 'react-router-dom';
import { Input, Button, Select } from 'antd/lib/index';
import { withFirebase } from '../Firebase';
import { withAuthorization } from '../Session/index';
import Loading from './modules/loading';
import DisplayLocation from './modules/DisplayLocation';

const uuidv4 = require('uuid/v4');

const { Option } = Select;
const moment = require('moment');

class NewArticle extends React.Component {
  constructor({ firebase, history }) {
    super({ firebase, history });
    this.firebase = firebase;
    this.history = history;
    this.INITIAL_STATE = {
      public: 'false',
      title: '',
      image: '',
      lead: '',
      collection: '',
      document: '',
      subcollection: '',
      subdocument: `article${moment(new Date()).format('YYYY-MM-DD-HH:mm')}`,
      card: {
        collection: '',
        document: '',
        subcollection: ''
      },
      loading: false,
      error: '',
      metadata: {
        title: '',
        description: ''
      },
      pathlist: {},
      id: moment(new Date()).format('YYYYMMDDHHmm')
    };
    this.state = this.INITIAL_STATE;
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    this.getPathData();
  }

  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  characterValidate = char =>
    char ? !!char.replace(/\s/g, '').match(/.*/gi) : false;

  handleSubmit = async () => {
    const {
      collection,
      document,
      subdocument,
      subcollection,
      id,
      metadata,
      card,
      title,
      image,
      lead,
      to
    } = this.state;

    if (
      this.characterValidate(collection) &&
      this.characterValidate(document) &&
      this.characterValidate(subcollection) &&
      this.characterValidate(subdocument) &&
      this.characterValidate(metadata.description) &&
      this.characterValidate(metadata.title) &&
      this.characterValidate(id)
    ) {
      const docref = this.firebase.db.collection('Private').doc();
      this.setState({
        loading: true
      });

      await docref
        .set({
          title,
          image,
          lead,
          section: [],
          createdOn: moment(new Date()).format('YYYY-MM-DD HH:mm'),
          lastEdited: '',
          location: {
            collection: collection || '',
            document: document || '',
            subcollection: subcollection || '',
            subdocument: subdocument || ''
          },
          cardLocation: {
            collection: card.collection,
            document: card.document,
            subcollection: card.subcollection,
            subdocument: `card_${subdocument}`
          },
          NEWCONTENTTYPE: true,
          id: parseInt(id, 10),
          to,
          isOpenFlg: true,
          metadata
        })
        .then(() => {
          this.setState(this.INITIAL_STATE);
          this.setState({
            loading: true
          });
          setTimeout(() => {
            this.setState({
              loading: false
            });
            this.history.push('/');
          }, 1000);
        })
        .catch(error => {
          this.setState({
            loading: false
          });
          this.setState({
            error: `エラーが発生しました。: ${error.message}`
          });
        });
    } else {
      this.setState({
        loading: false,
        error: '入力されていない項目があります。'
      });
    }
  };

  handleMetadata = event => {
    const { metadata } = this.state;
    this.setState({
      metadata: {
        ...metadata,
        [event.target.name]: event.target.value
      }
    });
  };

  handleSelect = value => {
    const { pathlist } = this.state;
    const docPath = pathlist[value].docPath.split('/');
    const cardPath = pathlist[value].cardPath.split('/');
    this.setState({
      collection: docPath[0],
      document: docPath[1],
      subcollection: docPath[2],
      location: {
        collection: docPath[0],
        document: docPath[1],
        subcollection: docPath[2]
      },
      to: value.to,
      card: {
        collection: cardPath[0],
        document: cardPath[1],
        subcollection: cardPath[2]
      }
    });
  };

  getPathData = () => {
    const docref = this.firebase.db
      .collection('ArticlePathList')
      .doc('pathlist');
    docref
      .get()
      .then(data => {
        if (data.exists) {
          this.setState({
            pathlist: data.data().path
          });
        }
      })
      .finally(() => {});
  };

  handleImage = ({ target: { files } }) => {
    const { collection } = this.state;
    if (!collection) {
      window.alert('記事のカテゴリーを選択してください');
      return false;
    }
    if (files[0].name) {
      const ref = this.firebase.storage().ref(`${collection}/${files[0].name}`);
      ref
        .put(files[0])
        .then(snapshot => {
          snapshot.ref.getDownloadURL().then(url => {
            this.setState({
              image: url
            });
          });
        })
        .catch(err => {
          this.setState({
            error: `(エラー)画像を投稿できませんでした。 Error: ${err.message}`
          });
        });
    }
    return true;
  };

  render() {
    const {
      pathlist,
      location,
      card,
      subdocument,
      id,
      title,
      image,
      lead,
      metadata,
      error,
      loading
    } = this.state;
    const keys = Object.keys(pathlist);

    return (
      <Style>
        <div className="select">
          <Select style={{ width: '300px' }} onChange={this.handleSelect}>
            {keys.map(key => (
              <Option key={uuidv4()} value={key}>
                {key}
              </Option>
            ))}
          </Select>
        </div>

        <div className="pathdiv">
          {location && (
            <React.Fragment>
              <span className="label">ドキュメントパス</span>
              <DisplayLocation location={location} />
            </React.Fragment>
          )}
        </div>

        <div className="pathdiv">
          {card.document && (
            <React.Fragment>
              <span className="label">カードパス</span>
              <DisplayLocation location={card} />
            </React.Fragment>
          )}
        </div>

        <div className="wrapper">
          <p
            style={{
              marginTop: '0.5em',
              marginLeft: '1em'
            }}
          >
            ドキュメント名 (なんでもOK)
          </p>

          <Input
            required
            style={{ margin: '0.5em' }}
            placeholder="subdocument"
            value={subdocument}
            name="subdocument"
            onChange={this.handleChange}
          />
        </div>

        <div className="wrapper">
          <p
            style={{
              marginLeft: '1em',
              marginTop: '0.5em'
            }}
          >
            記事 ID (半角数字)
          </p>
          <Input
            onChange={this.handleChange}
            name="id"
            value={id}
            style={{ margin: '0.5em' }}
            placeholder="半角数字 ID (ex. 20180512) "
            required
          />
        </div>

        <div className="wrapper">
          <p
            style={{
              marginTop: '0.5em',
              marginLeft: '1em'
            }}
          >
            タイトル
          </p>
          <Input
            required
            placeholder="タイトル"
            style={{ margin: '0.5em' }}
            value={title}
            onChange={this.handleChange}
            name="title"
          />
        </div>

        <div className="wrapper">
          <p
            style={{
              marginLeft: '1em',
              marginTop: '0.5em'
            }}
          >
            プレビュー画像
          </p>
          <Input
            style={{
              margin: '10px 0.5em 0 0.5em'
            }}
            type="file"
            name="file"
            onChange={this.handleImage}
          />

          <Input
            onChange={this.handleChange}
            style={{ margin: '0 0.5em 0.5em 0.5em' }}
            name="image"
            value={image}
            placeholder="プレビュー画像"
            required
          />
        </div>

        <div className="wrapper">
          <p
            style={{
              marginLeft: '1em',
              marginTop: '0.5em'
            }}
          >
            プレビューリード
          </p>
          <Input
            onChange={this.handleChange}
            name="lead"
            value={lead}
            style={{ margin: '0.5em' }}
            placeholder="プレビューテキスト　リード"
            required
          />
        </div>

        <div className="wrapper">
          <p
            style={{
              marginLeft: '1em',
              marginTop: '0.5em'
            }}
          >
            メタデータ　タイトル
          </p>
          <Input
            onChange={this.handleMetadata}
            name="title"
            value={metadata.title}
            style={{ margin: '0.5em' }}
            placeholder="メタデータ タイトル"
            required
          />
        </div>

        <div className="wrapper">
          <p
            style={{
              marginLeft: '1em',
              marginTop: '0.5em'
            }}
          >
            メタデータ詳細
          </p>
          <Input
            onChange={this.handleMetadata}
            name="description"
            value={metadata.description}
            style={{ margin: '0.5em' }}
            placeholder="メタデータ  詳細 "
            required
          />
        </div>

        {error && <p style={{ margin: '0.5em 0' }}>{error}</p>}
        <Button
          style={{ margin: '2em 0 2em', width: '80vw' }}
          loading={loading}
          onClick={this.handleSubmit}
          type="primary"
        >
          追加
        </Button>
        {loading && <Loading inline />}
      </Style>
    );
  }
}

const condition = authUser => !!authUser;

export default compose(
  withRouter,
  withFirebase,
  withAuthorization(condition)
)(NewArticle);

const Style = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  button {
    width: 100%;
  }
  p {
    margin-bottom: 2px;
  }
  .pathdiv {
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    justify-content: center;
    margin-bottom: 10px;
    input {
      width: 22vw;
    }
  }
  .select {
    width: 90vw;
    display: flex;
    justify-content: center;
    margin-bottom: 2em;
  }
  .label {
    margin-top: 5px;
    margin-right: 1em;
  }
  .wrapper {
    width: 80vw;
    padding: 0 1em;
    background: #f5f5f5;
    margin-bottom: 14px;
    border-color: whitesmoke;
    border-radius: 10px;
    box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);
    textarea,
    input {
      background: #eae8e8;
    }
  }
`;
