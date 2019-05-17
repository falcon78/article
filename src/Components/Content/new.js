import React from 'react';
import ArticleView from './modules/viewArticle';
import styled from 'styled-components';
import { withAuthorization } from '../Session/index';
import { compose } from 'recompose';
import { withFirebase } from '../Firebase';
import { withRouter } from 'react-router-dom';
import { Input, Button } from 'antd/lib/index';
import Loading from './modules/loading';

const { TextArea } = Input;
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
      loading: false,
      error: '',
      metadata: {
        title: '',
        description: ''
      }
    };
    this.state = this.INITIAL_STATE;
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  handleSubmit = async () => {
    let col = this.state.collection;
    let doc = this.state.document;
    let subcol = this.state.subcollection;
    let subdoc = this.state.subdocument;
    if (
      this.state.title !== '' &&
      this.state.body !== '' &&
      this.state.collection !== '' &&
      this.state.document !== '' &&
      this.state.metadata.description !== '' &&
      this.state.metadata.title !== ''
    ) {
      let docref = this.props.firebase.db
        .collection('Private')
        .doc(subdoc ? subdoc : doc);
      this.setState({
        loading: true
      });

      await docref
        .set({
          body: [],
          title: this.state.title,
          image: this.state.image,
          lead: this.state.lead,
          section: [],
          createdOn: new Date().toISOString(),
          lastEdited: '',
          location: {
            collection: col ? col : '',
            document: doc ? doc : '',
            subcollection: subcol ? subcol : '',
            subdocument: subdoc ? subdoc : ''
          },

          NEWCONTENTTYPE: true,
          id: new Date()
            .toISOString()
            .substring(0, 7)
            .replace('-', ''),
          to: uuidv4(),
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
            error: 'エラーが発生しました。'
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
  render() {
    return (
      <Style>
        <div
          style={{
            display: 'flex',
            width: '100%',
            justifyContent: 'space-around'
          }}
        >
          <Input
            required
            style={{ margin: '0.5em' }}
            placeholder="collection"
            value={this.state.collection}
            name="collection"
            onChange={this.handleChange}
          />
          <Input
            required
            style={{ margin: '0.5em' }}
            placeholder="document"
            value={this.state.document}
            name="document"
            onChange={this.handleChange}
          />
          <Input
            required
            style={{ margin: '0.5em' }}
            placeholder="subcollection"
            value={this.state.subcollection}
            name="subcollection"
            onChange={this.handleChange}
          />
          <Input
            required
            style={{ margin: '0.5em' }}
            placeholder="subdocument"
            value={this.state.subdocument}
            name="subdocument"
            onChange={this.handleChange}
          />
        </div>
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
`;
