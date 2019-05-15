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

class NewArticle extends React.Component {
  constructor(props) {
    super(props);
    this.INITIAL_STATE = {
      public: 'false',
      title: '',
      collection: '',
      document: '',
      subcollection: '',
      subdocument: '',
      loading: false,
      error: ''
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
      this.state.document !== ''
    ) {
      let docref = this.props.firebase.db
        .collection('Private')
        .doc(subdoc ? subdoc : doc);
      this.setState({
        loading: true
      });

      await docref
        .set({
          location: {
            collection: col ? col : '',
            document: doc ? doc : '',
            subcollection: subcol ? subcol : '',
            subdocument: subdoc ? subdoc : ''
          },
          title: this.state.title,
          body: [],
          createdOn: new Date().toISOString(),
          NEWCONTENTTYPE: true
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
          console.log(error);
        });
    } else {
      this.setState({
        loading: false,
        error: '入力されていない項目があります。'
      });
    }
  };

  render() {
    return (
      <Style>
        <div className={'left'}>
          <div className="container">
            <Input
              required
              style={{ width: '49%', marginBottom: '1em' }}
              placeholder="collection"
              value={this.state.collection}
              name="collection"
              onChange={this.handleChange}
            />
            <Input
              required
              style={{ width: '48%', marginBottom: '1em' }}
              placeholder="document"
              value={this.state.document}
              name="document"
              onChange={this.handleChange}
            />
          </div>
          <div className="container">
            <Input
              required
              style={{ width: '49%', marginBottom: '1em' }}
              placeholder="subcollection"
              value={this.state.subcollection}
              name="subcollection"
              onChange={this.handleChange}
            />
            <Input
              required
              style={{ width: '48%', marginBottom: '1em' }}
              placeholder="subdocument"
              value={this.state.subdocument}
              name="subdocument"
              onChange={this.handleChange}
            />
          </div>
          <Input
            required
            placeholder="タイトル"
            value={this.state.title}
            onChange={this.handleChange}
            name="title"
          />

          {this.state.error && (
            <p style={{ margin: '1em 0' }}>{this.state.error}</p>
          )}
          <Button
            style={{ margin: '1em 0 2em' }}
            loading={this.state.loading}
            onClick={this.handleSubmit}
          >
            追加
          </Button>
          {this.state.loading && <Loading inline />}
        </div>
        <div className={'right'}>
          <ArticleView articledata={this.state.body} />
        </div>
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
  .left {
    margin: 0.5em;
    width: 45vw;
    height: 90vh;
  }
  .right {
  margin:0.8em
  margin-left: 3em;
    width: 45vw;
    height: 90vh;
  }
  .container{
    display: flex;
    justify-content: space-between;
  }
`;
