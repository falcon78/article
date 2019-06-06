import React from 'react';
import ArticleView from './modules/viewArticle';
import styled from 'styled-components';
import { withAuthorization } from '../Session/index';
import { compose } from 'recompose';
import { withFirebase } from '../Firebase';
import { withRouter } from 'react-router-dom';
import { Input, Button } from 'antd/lib/index';
import Loading from './modules/loading';
import { Select } from 'antd';
import DisplayLocation from './modules/DisplayLocation';

const Option = Select.Option;
const moment = require('moment');

const uuidv4 = require('uuid/v4');

class NewArticle extends React.Component {
  constructor(props) {
    super(props);
    this.INITIAL_STATE = {
      public: 'false',
      title: '',
      image: '',
      lead: '',
      collection: '',
      document: '',
      subcollection: '',
      subdocument: '',
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
      id: ''
    };
    this.state = this.INITIAL_STATE;
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  characterValidate = char =>
    char ? !!char.replace(/\s/g, '').match(/.*/gi) : false;

  handleSubmit = async () => {
    let col = this.state.collection;
    let doc = this.state.document;
    let subcol = this.state.subcollection;
    let subdoc = this.state.subdocument;

    if (
      this.characterValidate(this.state.collection) &&
      this.characterValidate(this.state.document) &&
      this.characterValidate(this.state.subcollection) &&
      this.characterValidate(this.state.subdocument) &&
      this.characterValidate(this.state.metadata.description) &&
      this.characterValidate(this.state.metadata.title) &&
      this.characterValidate(this.state.id)
    ) {
      let docref = this.props.firebase.db
        .collection('Private')
        .doc(subdoc ? subdoc : doc);
      this.setState({
        loading: true
      });

      let today = new Date();
      today.setHours(today.getHours() + 4);

      await docref
        .set({
          title: this.state.title,
          image: this.state.image,
          lead: this.state.lead,
          section: [],
          createdOn: moment(new Date()).format('YYYY-MM-DD HH:mm'),
          lastEdited: '',
          location: {
            collection: col ? col : '',
            document: doc ? doc : '',
            subcollection: subcol ? subcol : '',
            subdocument: subdoc ? subdoc : ''
          },
          cardLocation: {
            collection: this.state.card.collection,
            document: this.state.card.document,
            subcollection: this.state.card.subcollection,
            subdocument: this.state.subdocument
          },

          NEWCONTENTTYPE: true,
          id: parseInt(this.state.id, 10),
          //id: parseInt(moment(new Date()).format('YYYYMMDDHHmm'), 10),
          to: this.state.to,
          isOpenFlg: true,
          metadata: this.state.metadata
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
            this.props.history.push('/');
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
    this.setState({
      metadata: {
        ...this.state.metadata,
        [event.target.name]: event.target.value
      }
    });
  };

  handleSelect = value => {
    const docPath = value.docPath.split('/');
    const cardPath = value.cardPath.split('/');
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
    const docref = this.props.firebase.db
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

  componentDidMount() {
    this.getPathData();
    console.log(this.characterValidate(" "))
  }

  render() {
    const keys = Object.keys(this.state.pathlist);
    const pathlist = this.state.pathlist;

    return (
      <Style>
        <div className="select">
          <Select style={{ width: '300px' }} onChange={this.handleSelect}>
            {keys.map(key => (
              <Option value={pathlist[key]}>{key}</Option>
            ))}
            {/*<Option value="jack">Jack</Option>*/}
          </Select>
        </div>

        <div className="pathdiv">
          {this.state.location && (
            <React.Fragment>
              <span className="label">ドキュメントパス</span>
              <DisplayLocation location={this.state.location} />
            </React.Fragment>
          )}
        </div>

        <div className="pathdiv">
          {this.state.card.document && (
            <React.Fragment>
              <span className="label">カードパス</span>
              <DisplayLocation location={this.state.card} />
            </React.Fragment>
          )}
        </div>

        <label
          style={{
            marginTop: '0.5em',
            marginLeft: '1em'
          }}
        >
          サブドキュメント (Subdocument)
        </label>

        <Input
          required
          style={{ margin: '0.5em' }}
          placeholder="subdocument"
          value={this.state.subdocument}
          name="subdocument"
          onChange={this.handleChange}
        />
        <label
          style={{
            marginLeft: '1em',
            marginTop: '0.5em'
          }}
        >
          記事 ID
        </label>
        <Input
          onChange={this.handleChange}
          name="id"
          value={this.state.id}
          style={{ margin: '0.5em' }}
          placeholder="半角数字 ID (ex. 20180512) "
          required
        />
        <label
          style={{
            marginTop: '0.5em',
            marginLeft: '1em'
          }}
        >
          タイトル
        </label>
        <Input
          required
          placeholder="タイトル"
          style={{ margin: '0.5em' }}
          value={this.state.title}
          onChange={this.handleChange}
          name="title"
        />
        <label
          style={{
            marginLeft: '1em',
            marginTop: '0.5em'
          }}
        >
          プレビュー画像
        </label>
        <Input
          onChange={this.handleChange}
          style={{ margin: '0.5em' }}
          name="image"
          value={this.state.image}
          placeholder="プレビュー画像"
          required
        />
        <label
          style={{
            marginLeft: '1em',
            marginTop: '0.5em'
          }}
        >
          プレビューリード
        </label>
        <Input
          onChange={this.handleChange}
          name="lead"
          value={this.state.lead}
          style={{ margin: '0.5em' }}
          placeholder="プレビューテキスト　リード"
          required
        />
        <label
          style={{
            marginLeft: '1em',
            marginTop: '0.5em'
          }}
        >
          メタデータ　タイトル
        </label>
        <Input
          onChange={this.handleMetadata}
          name="title"
          value={this.state.metadata.title}
          style={{ margin: '0.5em' }}
          placeholder="メタデータ タイトル"
          required
        />
        <label
          style={{
            marginLeft: '1em',
            marginTop: '0.5em'
          }}
        >
          メタデータ詳細
        </label>
        <Input
          onChange={this.handleMetadata}
          name="description"
          value={this.state.metadata.description}
          style={{ margin: '0.5em' }}
          placeholder="メタデータ  詳細 "
          required
        />
        {this.state.error && (
          <p style={{ margin: '0.5em 0' }}>{this.state.error}</p>
        )}
        <Button
          style={{ margin: '2em 0 2em' }}
          loading={this.state.loading}
          onClick={this.handleSubmit}
        >
          追加
        </Button>
        {this.state.loading && <Loading inline />}
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

  button {
    width: 100%;
  }
  .pathdiv {
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    justify-content: center;
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
`;
