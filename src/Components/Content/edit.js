//@format
import React from 'react';
import { AutoComplete, Button, Input, Modal } from 'antd';
import { withAuthorization } from '../Session/index';
import { withFirebase } from '../Firebase/index';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import styled from 'styled-components';
import ArticleView from './modules/viewArticle';
import Loading from './modules/loading';
import * as ROUTES from '../../constants/routes';

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
      body: [],
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
      ],
      initialLoad: true,
      deleteModal: false,
      confirmLoading: false,
      deleteError: ''
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
          body: data.data().body,
          initialLoad: false
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
    let bodyLocal = [...this.state.body];
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
    const idKey = uuidv4();
    this.setState({
      body: [...this.state.body, { [value]: '', idKey }],
      add: ''
    });
  };

  handleNewadd = () => {
    const idKey = uuidv4();
    if (this.state.add) {
      this.setState({
        body: [...this.state.body, { [this.state.add]: '', idKey }],
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
        location: this.state.location,
        NEWCONTENTTYPE: true
      })
      .then(() => {
        this.docref
          .delete()
          .then(() => {
            this.setState({
              loading: false
            });
            this.props.history.push(ROUTES.LANDING);
          })
          .catch(error => {
            this.setState({
              error: 'エラーが発生しました。'
            });
            throw error;
          });
      })
      .catch(error => {
        this.setState({
          error: 'エラーが発生しました。'
        });
        throw error;
      });
  };

  handleShowModal = () => {
    this.setState({
      deleteModal: !this.state.deleteModal
    });
  };

  handleDelete = () => {
    this.setState({
      confirmLoading: true
    });
    this.docref
      .delete()
      .then(() => {
        this.setState({
          deleteError: '削除しました。'
        });
        setTimeout(() => {
          this.setState({
            confirmLoading: false,
            deleteModal: false
          });
        }, 2000);
        this.props.history.push(ROUTES.LANDING);
      })
      .catch(error => {
        this.setState({
          deleteError: '削除できませんでした。',
          confirmLoading: false
        });
        throw error;
      });
  };

  handleOrder = (direction, index) => {
    if (direction === 'up') {
      if (index !== 0) {
        let localBody = [...this.state.body];
        console.log('moved');
        let selectedElement = localBody[index];
        localBody[index] = localBody[index - 1];
        localBody[index - 1] = selectedElement;
        this.setState({
          body: localBody
        });
      }
    } else {
      if (index !== this.state.body.length - 1) {
        let localBody = [...this.state.body];
        console.log('moved');
        let selectedElement = localBody[index];
        localBody[index] = localBody[index + 1];
        localBody[index + 1] = selectedElement;
        this.setState({
          body: localBody
        });
      }
    }
  };

  handleDeleteItem = index => {
    let localBody = [...this.state.body];
    let newArray = localBody.filter((content, i) => index !== i);
    this.setState({
      body: newArray
    });
  };

  componentDidMount() {
    this.fetchFirebase();
  }

  render() {
    if (this.state.initialLoad) {
      return <Loading />;
    }
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
            key = {uuidv4()}
          />
        );
      }
      console.log(input);
    }
    return (
      <React.Fragment>
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
              console.log(content.idKey);
              let articleKey = Object.keys(content)[0];
              if (articleKey === 'idKey') {
                articleKey = Object.keys(content)[1];
              }
              let textArea = (
                <div key={content.idKey}>
                  <div
                    style={{
                      marginTop: '10px',
                      width: '100%',
                      display: 'flex',
                      justifyContent: 'space-between'
                    }}
                  >
                    <Button type="primary">{articleKey}</Button>
                    <div
                      style={{
                        display: 'flex',
                        width: '120px',
                        justifyContent: 'space-around'
                      }}
                    >
                      <Button
                        type={'primary'}
                        shape={'circle'}
                        icon={'arrow-up'}
                        onClick={() => this.handleOrder('up', index)}
                      />
                      <Button
                        type={'primary'}
                        shape={'circle'}
                        icon={'arrow-down'}
                        onClick={() => this.handleOrder('down', index)}
                      />
                      <Button
                        type={'danger'}
                        shape={'circle'}
                        icon={'delete'}
                        onClick={() => {
                          this.handleDeleteItem(index);
                        }}
                      />
                    </div>
                  </div>

                  <TextArea
                    style={{ margin: '0.5em 0', marginTop: '2px' }}
                    autosize={{ minRows: 2, maxRows: 100 }}
                    name={index}
                    onChange={e => this.handleChange(articleKey, e)}
                    value={this.state.body[index][articleKey]}
                  />
                </div>
              );
              return textArea;
            })}
            <AutoComplete
              dataSource={match}
              style={{ width: 200, marginTop: '1em' }}
              onSelect={this.handleadd}
              onSearch={this.handleSearch}
              value={this.state.add}
              placeholder="入力/選択"
            />
            <Button style={{ marginLeft: '1em' }} onClick={this.handleNewadd}>
              追加
            </Button>
            <br />
            {this.state.loading && <Loading inline />}
            <Button
              style={{ margin: '1em 2px 5px' }}
              onClick={this.handleSubmit}
            >
              更新
            </Button>
            <Button
              style={{ margin: '1em 2px 5px' }}
              onClick={this.handlePublish}
            >
              公開
            </Button>
            <Button
              style={{ margin: '1em 2px 2em' }}
              onClick={this.handleShowModal}
              type="danger"
            >
              削除
            </Button>
            <Modal
              title="削除"
              visible={this.state.deleteModal}
              onOk={this.handleDelete}
              confirmLoading={this.state.confirmLoading}
              onCancel={this.handleShowModal}
              centered
            >
              <p>{'本当に削除しますか？'}</p>
              {this.state.deleteError && <h3>this.state.deleteError</h3>}
            </Modal>
          </div>
          <div className="right">
            <ArticleView
              style={{ marginTop: '1em' }}
              articledata={this.state.body}
            />
          </div>
        </Style>
      </React.Fragment>
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
  justify-content: center;
  .left {
    margin: 0.5em;
    width: 45vw;
    height: 90vh;
  }
  .right {
    margin: 2em 0.5em 0.5em 3em;
    width: 45vw;
    height: 90vh;
  }
  .container {
    display: flex;
    justify-content: space-between;
  }
`;


int a = 0;
a = function(); //6
console.log(a); 0
