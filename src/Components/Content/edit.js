//@format
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
      createdOn: '',
      title: '',
      body: [{ title: 'ロード中' }],
      error: '',
      add: '',
      loading: false,
      title_source: [
        'firstPic',
        'header',
        'text',
        'image',
        'passage',
        'colortext',
        'subpassage'
      ]
    };
  }

  docref = this.props.firebase.db
    .collection('Private')
    .doc(`${this.props.match.params.id}`);

  fetchFirebase = async () => {
    await this.docref
      .get()
      .then(data => {
        console.log(data.data());
        let fb_col = data.data().location.collection;
        let fb_doc = data.data().location.document;
        let fb_subcol = data.data().location.subcollection;
        let fb_subdoc = data.data().location.subdocument;
        this.setState({
          location: {
            collection: fb_col,
            document: fb_doc,
            subcollection: fb_subcol ? fb_subcol : '',
            subdocument: fb_subdoc ? fb_subdoc : ''
          },
          createdOn: data.data().createdOn,
          title: data.data().title,
          body: data.data().body
        });
      })
      .catch(error => {
        this.setState({
          error: 'エラーが発生しました。'
        });
        console.log(error);
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

  handleNewadd = () => {
    if (this.state.add) {
      this.setState({
        body: [...this.state.body, { [this.state.add]: '' }],
        add: ''
      });
    }
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

  handlePublish = () => {
    let docref_publish = this.state.location.subdocument
      ? this.props.firebase.db
          .collection(this.state.location.collection)
          .doc(this.state.location.document)
          .collection(this.state.location.subcollection)
          .doc(this.state.location.subdocument)
      : this.props.firebase.db
          .collection(this.state.location.collection)
          .doc(this.state.location.document);
    this.setState({
      loading: true
    });
    docref_publish
      .set({
        body: this.state.body,
        title: this.state.title,
        createdOn: this.state.createdOn,
        lastEdited: new Date().toISOString(),
        location: this.state.location
      })
      .then(success => {
        this.setState({
          loading: false
        });
        console.log(success);
      })
      .catch(error => {
        this.setState({
          error: 'エラーが発生しました。'
        });
        console.log(error);
      });
  };

  componentDidMount() {
    this.fetchFirebase();
  }

  render() {
    let regex = new RegExp(this.state.add);
    let match = this.state.title_source.filter(word => word.match(regex));
    let input = [];
    for (let key in this.state.location) {
      console.log(this.state.location[key]);
      if (this.state.location[key]) {
        input = input.concat(
          <Input
            style={{ width: '150px', margin: '2px' }}
            value={this.state.location[key]}
            disabled
          />
        );
      }
      console.log(input);
    }
    return (
      <Style>
        <div className="left">
          <div style={{ display: 'flex', justifyContent: 'space-between' }} />
          {input}
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
                <Button type="primary">{key}</Button>
                <TextArea
                  style={{ margin: '0.5em 0' }}
                  autosize={{ minRows: 2, maxRows: 100 }}
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
            dataSource={match}
            style={{ width: 200 }}
            onSelect={this.handleadd}
            onSearch={this.handleSearch}
            value={this.state.add}
            placeholder="入力/選択"
          />
          <Button
            style={{ marginLeft: '1em' }}
            loading={this.state.loading}
            onClick={this.handleNewadd}
          >
            追加
          </Button>
          <br />
          <Button
            style={{ margin: '1em 0 2em' }}
            loading={this.state.loading}
            onClick={this.handleSubmit}
          >
            更新
          </Button>
          <Button
            style={{ margin: '1em 0 2em' }}
            loading={this.state.loading}
            onClick={this.handlePublish}
          >
            公開
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
