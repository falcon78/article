import React from 'react';

import { AutoComplete } from 'antd';
import { withAuthorization } from '../Session/index';
import { withFirebase } from '../Firebase/index';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import { Input, Button } from 'antd';
import styled from 'styled-components';
import ArticleView from './modules/viewArticle';
const { TextArea } = Input;
const uuidv4 = require('uuid/v4');

class Edit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      location: {
        collection: '',
        document: '',
        subcollection: '',
        subdocument: ''
      },
      contentCounter: 0,
      title: '',
      body: [{ title: 'this is title' }, { test: 'this is test' }],
      error: '',
      add: '',
      loading: false,
      title_source: ['title', 'passage', 'subpassage', 'text', 'image']
    };
  }

  docref = this.props.firebase.db
    .collection('Hidden')
    .doc(`${this.props.match.params.id}`);
  getfirebase = async () => {
    await this.docref
      .get()
      .then(data => {
        this.setState({
          location: {
            collection: data.data().location.collection,
            document: data.data().location.document,
            subcollection: data.data().location.subcollection,
            subdocument: data.data().location.subcollection
          },
          title: data.data().title,
          body: data.data().body
        });
      })
      .catch(error => {
        this.setState({
          error
        });
      });
  };

  handleChange = (key, event) => {
    let bodyLocal = this.state.body;
    bodyLocal[event.target.name][key] = event.target.value;
    this.setState(prevState => ({
      body: bodyLocal
    }));
  };

  handleChangeTitle = event => {
    this.setState({
      title: event.target.value
    });
  };

  handleSearch = value => {
    this.setState({
      add: value
    });
  };

  handleadd = value => {
    this.setState({
      body: [...this.state.body, { [value]: '' }],
      add: ''
    });
  };

  handleSubmit = async () => {
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
  };

  componentDidMount() {
    //this.getFirebase();
  }

  render() {
    let source = this.state.title_source;
    if (this.state.add) {
      source = [this.state.add, ...this.state.title_source];
    }
    return (
      <Style>
        <div className="left">
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
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
            onChange={this.handleChangeTitle}
            value={this.state.title}
          />
          {this.state.body.map((content, index) => {
            let key = Object.keys(content)[0];
            let textArea = (
              <React.Fragment key={index}>
                <Input
                  size="small"
                  placeholder={key}
                  value={key}
                  style={{
                    marginTop: '1em'
                  }}
                />
                <TextArea
                  style={{ margin: '0.5em 0' }}
                  autosize={{ minRows: 2, maxRows: 6 }}
                  name={index}
                  onChange={e => this.handleChange(key, e)}
                  value={this.state.body[index][key]}
                />
              </React.Fragment>
            );
            console.log(content, index);
            return textArea;
          })}
          <AutoComplete
            dataSource={source}
            style={{ width: 200 }}
            onSelect={this.handleadd}
            onSearch={this.handleSearch}
            value={this.state.add}
            placeholder="入力/選択"
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
