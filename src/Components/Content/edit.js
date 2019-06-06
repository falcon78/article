// @format
import React from 'react';
import { AutoComplete, Button, Input, Modal, Tag } from 'antd';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import styled from 'styled-components';
import moment from 'moment';
import Switch from 'antd/es/switch';
import { Flipper, Flipped } from 'react-flip-toolkit';
import { withAuthorization } from '../Session/index';
import { withFirebase } from '../Firebase/index';
import Loading from './modules/loading';
import * as ROUTES from '../../constants/routes';
import MarkdownArticle from './supporters/container/organisms/markdownArticle';
import DisplayLocation from './modules/DisplayLocation';
import DeleteAndOrderButtons from './modules/DeleteAndOrderButtons';

const { TextArea } = Input;
const uuidv4 = require('uuid/v4');

class Edit extends React.Component {
  constructor({ firebase, match, history }) {
    super({ firebase, match });
    this.docref = firebase.db.collection('Private').doc(`${match.params.id}`);
    this.history = history;
    this.firebase = firebase;
    this.state = {
      image: '',
      lead: '',
      location: {
        collection: '',
        document: '',
        subcollection: '',
        subdocument: ''
      },
      title: '',
      section: [],
      error: '',
      add: '',
      loading: false,
      titleSource: [
        'title',
        'text',
        'image',
        'passage',
        'colortext',
        'subhead',
        'header'
      ],
      initialLoad: true,
      deleteModal: false,
      confirmLoading: false,
      deleteError: '',
      viewOnly: false,
      orderChange: new Date().getTime()
    };
  }

  componentDidMount() {
    this.fetchFirebase();
    const { innerWidth: width } = window;
    if (width < 480) {
      this.setState({
        viewOnly: true
      });
    }
  }

  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  handleSearch = value => {
    this.setState({
      add: value
    });
  };

  handleAdd = value => {
    const idKey = uuidv4();
    if (value === 'image' || value === 'colortext') {
      this.setState(prevState => ({
        section: [
          ...prevState.section,
          {
            [value]: '',
            [value === 'image' ? 'caption' : 'color']: '',
            idKey
          }
        ],
        add: ''
      }));
    } else {
      this.setState(prevState => ({
        section: [
          ...prevState.section,
          {
            [value]: '',
            idKey
          }
        ],
        add: ''
      }));
      this.handleSubmit();
    }
  };

  handleNewAdd = () => {
    const idKey = uuidv4();
    const { add } = this.state;
    if (add) {
      this.setState(prevState => ({
        section: [...prevState.section, { [prevState.add]: '', idKey }],
        add: ''
      }));
    }
  };

  handleSubmit = () => {
    const { title, image, lead, section } = this.state;
    this.setState({
      loading: true
    });
    this.docref
      .update({
        title,
        image,
        lead,
        section,
        lastEdited: moment(new Date()).format('YYYY-MM-DD HH:mm')
      })
      .then(() => {
        this.setState({
          loading: false
        });
      })
      .catch(error => {
        this.setState({
          error: `記事を投稿できませんでした。 : ${error.message}`
        });
      });
  };

  handlePublish = async () => {
    const { location } = this.state;
    const { title, image, lead, section } = this.state;

    const confirm = window.confirm('本当に公開しますか？');
    if (!confirm) return false;

    const docrefPublish = location.subdocument
      ? this.firebase.db
          .collection(location.collection)
          .doc(location.document)
          .collection(location.subcollection)
          .doc(location.subdocument)
      : this.firebase.db.collection(location.collection).doc(location.document);
    this.setState({
      loading: true
    });

    this.docref
      .update({
        title,
        image,
        lead,
        section,
        lastEdited: moment(new Date()).format('YYYY-MM-DD HH:mm')
      })
      .then(() => {
        return this.docref.get();
      })
      .then(data => {
        docrefPublish.set(data.data());
        return data;
      })
      .then(data => {
        this.firebase.db
          .collection('Published')
          .doc()
          .set(data.data());
        return data;
      })
      .then(data => {
        const { cardLocation, id } = data.data();
        const cardRef = this.firebase.db
          .collection(cardLocation.collection)
          .doc(cardLocation.document)
          .collection(cardLocation.subcollection)
          .doc(`card_${cardLocation.subdocument}`);
        return cardRef.set({
          cardTitle: title,
          id,
          image,
          isOpenFlg: true,
          lead,
          to: `/${data.data().to}/${data.data().id}`
        });
      })
      .then(() => {
        return this.docref.delete();
      })
      .then(() => {
        this.setState({
          loading: false
        });
        this.history.push(ROUTES.LANDING);
      })
      .catch(error => {
        this.setState({
          error: `エラーが発生しました。 : ${error.message}`
        });
      });
    return true;
  };

  handleShowModal = () => {
    this.setState(prevState => ({
      deleteModal: !prevState.deleteModal
    }));
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
        this.history.push(ROUTES.LANDING);
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
    const { section: localsection } = this.state;
    if (direction === 'up' && index !== 0) {
      const selectedElement = localsection[index];
      localsection[index] = localsection[index - 1];
      localsection[index - 1] = selectedElement;
      this.setState({
        section: localsection,
        orderChange: new Date().getTime()
      });
    } else if (direction === 'down' && index !== localsection.length - 1) {
      const selectedElement = localsection[index];
      localsection[index] = localsection[index + 1];
      localsection[index + 1] = selectedElement;
      this.setState({
        section: localsection,
        orderChange: new Date().getTime()
      });
    }
  };

  handleDeleteItem = index => {
    if (window.confirm('項目を削除しますか?')) {
      const { section: localsection } = this.state;
      const newArray = localsection.filter((content, i) => index !== i);
      this.setState({
        section: newArray
      });
    }
  };

  onToggleChange = checked => {
    this.setState({
      viewOnly: checked
    });
  };

  handleChangeSection = (key, event) => {
    const { section: localsection } = this.state;
    localsection[event.target.name][key] = event.target.value;
    this.setState({
      section: localsection
    });
  };

  fetchFirebase = async () => {
    await this.docref
      .get()
      .then(data => {
        const firebaseCollection = data.data().location.collection;
        const firebaseDocument = data.data().location.document;
        const firebaseSubCollection = data.data().location.subcollection;
        const firebaseSubDocument = data.data().location.subdocument;
        this.setState({
          location: {
            collection: firebaseCollection,
            document: firebaseDocument,
            subcollection: this.characterValidate(firebaseSubCollection)
              ? firebaseSubCollection
              : '',
            subdocument: this.characterValidate(firebaseSubDocument)
              ? firebaseSubDocument
              : ''
          },
          title: data.data().title,
          section: data.data().section,
          lead: data.data().lead,
          image: data.data().image,
          initialLoad: false
        });
      })
      .catch(error => {
        this.setState({
          error: `エラーが発生しました。 : ${error.message}`
        });
      });
  };

  characterValidate = char =>
    char ? !!char.replace(/\s/g, '').match(/\S.+/gi) : false;

  render() {
    const {
      initialLoad,
      add,
      titleSource,
      viewOnly,
      location,
      title,
      image,
      lead,
      section,
      orderChange,
      loading,
      error,
      deleteError,
      deleteModal,
      confirmLoading
    } = this.state;

    if (initialLoad) {
      return <Loading />;
    }
    const regex = new RegExp(add);
    const wordMatch = titleSource.filter(word => word.match(regex));

    return (
      <div>
        <div
          style={{
            display: 'flex',
            width: viewOnly ? '100%' : '45%',
            justifyContent: 'center'
          }}
        >
          <p
            style={{
              marginRight: '10px'
            }}
          >
            編集画面を非表示
          </p>
          <Switch
            checked={viewOnly}
            defaultChecked={false}
            onChange={this.onToggleChange}
          />
        </div>
        <Style>
          {!viewOnly && (
            <div className="left">
              <div
                style={{ display: 'flex', justifyContent: 'space-between' }}
              />
              <DisplayLocation location={location} />
              <Tag
                style={{
                  marginTop: '1em'
                }}
                color="purple"
              >
                タイトル
              </Tag>
              <Input
                spellcheck="false"
                style={{ margin: '0 0 1em 0' }}
                name="title"
                onChange={this.handleChange}
                value={title}
              />

              <div
                style={{
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'space-between'
                }}
              >
                <Tag color="red">メイン画像</Tag>
              </div>
              <TextArea
                spellcheck="false"
                style={{}}
                autosize={{ minRows: 2, maxRows: 100 }}
                name="image"
                onChange={this.handleChange}
                value={image}
              />

              <div
                style={{
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'space-between'
                }}
              >
                <Tag color="purple">リード文書 (カード)</Tag>
              </div>
              <TextArea
                spellcheck="false"
                style={{ marginBottom: 20 }}
                autosize={{ minRows: 1, maxRows: 100 }}
                name="lead"
                onChange={this.handleChange}
                value={lead}
              />
              <Flipper flipKey={orderChange}>
                {section.map((content, index) => {
                  const articleKey = Object.keys(content).filter(
                    key => key !== 'idKey'
                  );
                  if (articleKey.length === 2 && articleKey.includes('image')) {
                    articleKey[0] = 'image';
                    articleKey[1] = 'caption';
                  } else if (
                    articleKey.length === 2 &&
                    articleKey.includes('colortext')
                  ) {
                    articleKey[0] = 'colortext';
                    articleKey[1] = 'color';
                  }
                  return (
                    <Flipped key={content.idKey} flipId={content.idKey}>
                      <div className="section">
                        <div className="orderButtons">
                          <DeleteAndOrderButtons
                            handleOrder={this.handleOrder}
                            handleRemove={this.handleDeleteItem}
                            index={index}
                          />
                        </div>
                        {articleKey.map((key, keyIndex) => (
                          <div>
                            <Tag color="red">{key}</Tag>
                            <TextArea
                              spellCheck={false}
                              key={keyIndex}
                              style={{ margin: '0.5em 0', marginTop: '2px' }}
                              autosize={{ minRows: 1, maxRows: 100 }}
                              name={index}
                              onChange={e => this.handleChangeSection(key, e)}
                              value={section[index][key]}
                            />
                          </div>
                        ))}
                      </div>
                    </Flipped>
                  );
                })}
              </Flipper>
              <AutoComplete
                dataSource={wordMatch}
                style={{ width: 200, marginTop: '1em' }}
                onSelect={this.handleAdd}
                onSearch={this.handleSearch}
                value={add}
                placeholder="入力/選択"
              />
              <Button style={{ marginLeft: '1em' }} onClick={this.handleNewAdd}>
                追加
              </Button>
              <br />
              {loading && <Loading inline />}
              {error && <p>{error}</p>}
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
                visible={deleteModal}
                onOk={this.handleDelete}
                confirmLoading={confirmLoading}
                onCancel={this.handleShowModal}
                centered
              >
                <p>本当に削除しますか？</p>
                {deleteError && <h3>{deleteError}</h3>}
              </Modal>
            </div>
          )}

          <div
            style={{
              width: viewOnly ? '98%' : '45vw',
              top: '70px',
              right: '10px',
              position: viewOnly ? 'static' : 'fixed',
              overflow: viewOnly ? 'visible' : 'auto'
            }}
            className="right"
          >
            <MarkdownArticle
              style={{ marginTop: '1em' }}
              section={section}
              image={image}
              title={title}
              lead={lead}
            />
          </div>
        </Style>
      </div>
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
  justify-content: space-around;
  .left {
    margin: 0 0 0 0;
    width: 45vw;
    margin-right: 45vw;
  }
  .right {
    margin: 0 0 0 0;
    height: 88vh;
  }
  .container {
    display: flex;
    justify-content: space-between;
  }
  .spacebetween {
    margin-top: 10px;
    width: 100%;
    display: flex;
    justify-content: space-between;
  }
  .orderButtons {
    display: flex;
    width: 45vw;
    justify-content: flex-end;
    position: absolute;
    top: 5px;
    right: -2px;
    button {
      margin-bottom: 10px;
    }
  }
  .section {
    position: relative;
    background: #f5f5f5;
    padding: 1em;
    margin-bottom: 14px;
    border-color: whitesmoke;
    border-radius: 10px;
    box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);
    textarea {
      background: #f5f5f5;
    }
  }
`;
