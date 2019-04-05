import React from 'react';
import ArticleView from './modules/viewArticle';
import styled from 'styled-components';
import { withAuthorization } from '../Session/index';
import { compose } from 'recompose';
import { withFirebase } from '../Firebase';
import { withRouter } from 'react-router-dom';
import { Input, Button } from 'antd/lib/index';

const { TextArea } = Input;

class NewArticle extends React.Component {
  constructor(props) {
    super(props);
    this.INITIAL_STATE = {
      title: '',
      body: '',
      collection: 'Articles',
      document: '',
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

  async handleSubmit() {
    if (
      this.state.title !== '' &&
      this.state.body !== '' &&
      this.state.collection !== '' &&
      this.state.document !== ''
    ) {
      let docref = this.props.firebase.db
        .collection(this.state.collection)
        .doc(this.state.document);
      this.setState({
        loading: true
      });
      await docref
        .set({
          title: this.state.title,
          body: this.state.body,
          createdOn: new Date().toISOString()
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
            error
          });
        });
    } else {
      this.setState({
        loading: false,
        error: '入力されていない項目があります。'
      });
    }
  }

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
              disabled
              //onChange={this.handleChange}
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
          <Input
            required
            placeholder="タイトル"
            value={this.state.title}
            onChange={this.handleChange}
            name="title"
          />
          <TextArea
            required
            placeholder="テキスト"
            style={{ margin: '1em 0', height: '70vh' }}
            name="body"
            onChange={this.handleChange}
            value={this.state.body}
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
