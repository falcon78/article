import React from 'react';
import { withAuthorization } from '../Session/index';
import { withFirebase } from '../Firebase/index';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import { Input, Button } from 'antd';
import styled from 'styled-components';
import ArticleView from './modules/viewArticle';
const { TextArea } = Input;

class Edit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      body: '',
      error: '',
      loading: false
    };
    this.getFirebase = this.getFirebase.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  articleID = this.props.match.params.id;
  docref = this.props.firebase.db
    .collection('Articles')
    .doc(`${this.articleID}`);

  async getFirebase() {
    await this.docref
      .get()
      .then(data => {
        this.setState({
          title: data.data().title,
          body: data.data().body
        });
      })
      .catch(error => {
        this.setState({
          error
        });
      });
  }

  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  async handleSubmit() {
    this.setState({
      loading: true
    });
    await this.docref
      .update({
        title: this.state.title,
        body: this.state.body,
        lastEdited: new Date().toISOString()
      })
      .then(() => {
        this.setState({
          loading: false
        });
      })
      .catch();
  }

  componentDidMount() {
    //this.getFirebase();
  }

  render() {
    return (
      <Style>
        <div className="left">
          <div style={{display: "flex", justifyContent: "space-between"}}>
            <Input
              style={{ width: '49%', marginBottom: '0' }}
              value={'Articles'}
              disabled
            />
            <Input
              style={{ width: '48%', marginBottom: '0' }}
              value={this.articleID}
              disabled
            />
          </div>
          <Input
            style={{ margin: '1em 0' }}
            name="title"
            onChange={this.handleChange}
            value={this.state.title}
          />
          <TextArea
            style={{ height: '75vh' }}
            name="body"
            onChange={this.handleChange}
            value={this.state.body}
          />
          <Button
            style={{ margin: '1em 0 2em' }}
            loading={this.state.loading}
            onClick={this.handleSubmit}
          >
            更新
          </Button>
        </div>
        <div className="right">
          <ArticleView
            style={{ marginTop: '1em' }}
            articledata={this.state.body}
          />
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
)(Edit);

const Style = styled.div`
  display: flex;
.left {
    margin: 0.5em;
    width: 45vw;
    height: 90vh;
  }
  .right {
  margin:0.5em
  margin-top: 2em;
  margin-left: 3em;
    width: 45vw;
    height: 90vh;
  }
  .container{
    display: flex;
    justify-content: space-between;
  }
`;
