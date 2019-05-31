//@format
import React from 'react';
import { AutoComplete, Button, Input, Modal } from 'antd';
import { withAuthorization } from '../Session/index';
import { withFirebase } from '../Firebase/index';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import styled from 'styled-components';
import Loading from './modules/loading';
import * as ROUTES from '../../constants/routes';
import MarkdownArticle from './supporters/container/organisms/markdownArticle';
import DisplayLocation from './modules/DisplayLocation';
import DeleteAndOrderButtons from './modules/DeleteAndOrderButtons';
import moment from 'moment';
import Switch from 'antd/es/switch';

const { TextArea } = Input;
const uuidv4 = require('uuid/v4');

class Edit extends React.Component {
  constructor(props) {
    super(props);
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
      title_source: [
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
      viewOnly: false
    };
  }

  docref = this.props.firebase.db
    .collection('Private')
    .doc(`${this.props.match.params.id}`);

  characterValidate = char =>
    char ? !!char.replace(/\s/g, '').match(/\S.+/gi) : false;

  fetchFirebase = async () => {
    await this.docref
      .get()
      .then(data => {
        let fb_col = data.data().location.collection;
        let fb_doc = data.data().location.document;
        let fb_subcol = data.data().location.subcollection;
        let fb_subdoc = data.data().location.subdocument;
        this.setState({
          location: {
            collection: fb_col,
            document: fb_doc,
            subcollection: this.characterValidate(fb_subcol) ? fb_subcol : '',
            subdocument: this.characterValidate(fb_subdoc) ? fb_subdoc : ''
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
          error: 'エラーが発生しました。'
        });
      });
  };

  handleChangeSection = (key, event) => {
    let sectionLocal = [...this.state.section];
    sectionLocal[event.target.name][key] = event.target.value;
    this.setState({
      section: sectionLocal
    });
  };

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
      this.setState({
        section: [
          ...this.state.section,
          {
            [value]: '',
            [value === 'image' ? 'caption' : 'color']: '',
            idKey
          }
        ],
        add: ''
      });
    } else {
      this.setState({
        section: [
          ...this.state.section,
          {
            [value]: '',
            idKey
          }
        ],
        add: ''
      });
      this.handleSubmit();
    }
  };

  handleNewAdd = () => {
    const idKey = uuidv4();
    if (this.state.add) {
      this.setState({
        section: [...this.state.section, { [this.state.add]: '', idKey }],
        add: ''
      });
    }
  };

  handleSubmit = () => {
    this.setState({
      loading: true
    });
    this.docref
      .update({
        title: this.state.title,
        image: this.state.image,
        lead: this.state.lead,
        section: this.state.section,
        lastEdited: moment(new Date()).format('YYYYMMDDHHmm')
      })
      .then(() => {
        this.setState({
          loading: false
        });
      })
      .catch(() => {
        this.setState({
          error: '記事を投稿できませんでした。'
        });
      });
  };

  handlePublish = async () => {
    const cardRef = this.props.firebase.db
      .collection(this.state.location.collection)
      .doc(this.state.location.document)
      .collection('cardData');

    const confirm = window.confirm('本当に公開しますか？');
    if (!confirm) return false;
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

    this.docref
      .update({
        title: this.state.title,
        image: this.state.image,
        lead: this.state.lead,
        section: this.state.section,
        lastEdited: moment(new Date()).format('YYYYMMDDHHmm')
      })
      .then(() => {
        return this.docref.get();
      })
      .then(data => {
        docref_publish.set(data.data());
        return data;
      })
      .then(data => {
        const cardLocation = data.data().cardLocation;
        const cardRef = this.props.firebase.db
          .collection(cardLocation.collection)
          .doc(cardLocation.document)
          .collection(cardLocation.subcollection)
          .doc(cardLocation.subdocument);
        return cardRef.set({
          cardTitle: this.state.title,
          id: data.data().id,
          image: this.state.image,
          isOpenFlg: true,
          lead: this.state.lead,
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
        this.props.history.push(ROUTES.LANDING);
      })
      .catch(error => {
        this.setState({
          error: `エラーが発生しました。 : ${error.message}`
        });
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
    if (direction === 'up' && index !== 0) {
      let localsection = [...this.state.section];

      let selectedElement = localsection[index];
      localsection[index] = localsection[index - 1];
      localsection[index - 1] = selectedElement;
      this.setState({
        section: localsection
      });
    } else if (
      direction === 'down' &&
      index !== this.state.section.length - 1
    ) {
      let localsection = [...this.state.section];

      let selectedElement = localsection[index];
      localsection[index] = localsection[index + 1];
      localsection[index + 1] = selectedElement;
      this.setState({
        section: localsection
      });
    }
  };

  handleDeleteItem = index => {
    if (window.confirm('項目を削除しますか?')) {
      let localsection = [...this.state.section];
      let newArray = localsection.filter((content, i) => index !== i);
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

  componentDidMount() {
    this.fetchFirebase();
    const { innerWidth: width } = window;
    if (width < 480) {
      this.setState({
        viewOnly: true
      });
    }
  }

  render() {
    if (this.state.initialLoad) {
      return <Loading />;
    }
    let regex = new RegExp(this.state.add);
    let match = this.state.title_source.filter(word => word.match(regex));

    return (
      <div>
        <div
          style={{
            display: 'flex',
            width: '100%',
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
          <Switch checked={this.state.viewOnly} defaultChecked={false} onChange={this.onToggleChange} />
        </div>
        <Style>
          {!this.state.viewOnly && (
            <div className="left">
              <div
                style={{ display: 'flex', justifyContent: 'space-between' }}
              />
              <DisplayLocation location={this.state.location} />

              <Input
                spellcheck="false"
                style={{ margin: '1em 0' }}
                name="title"
                onChange={this.handleChange}
                value={this.state.title}
              />

              <div
                style={{
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'space-between'
                }}
              >
                <Button type="primary">メイン画像</Button>
              </div>
              <TextArea
                spellcheck="false"
                style={{ margin: '0.5em 0', marginTop: '2px' }}
                autosize={{ minRows: 2, maxRows: 100 }}
                name="image"
                onChange={this.handleChange}
                value={this.state.image}
              />

              <div
                style={{
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'space-between'
                }}
              >
                <Button type="primary">リード文書 (カード)</Button>
              </div>
              <TextArea
                spellcheck="false"
                style={{ margin: '0.5em 0', marginTop: '2px' }}
                autosize={{ minRows: 1, maxRows: 100 }}
                name="lead"
                onChange={this.handleChange}
                value={this.state.lead}
              />

              {this.state.section.map((content, index) => {
                let articleKey = Object.keys(content).filter(
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
                  <div key={content.idKey}>
                    <div className="spacebetween">
                      <div>
                        {articleKey.map((key, index) => (
                          <Button
                            key={index}
                            type={index === 0 ? 'primary' : 'danger'}
                          >
                            {key}
                          </Button>
                        ))}
                      </div>
                      <DeleteAndOrderButtons
                        handleOrder={this.handleOrder}
                        handleRemove={this.handleDeleteItem}
                        index={index}
                      />
                    </div>
                    {articleKey.map((key, keyIndex) => (
                      <TextArea
                        spellCheck={false}
                        key={keyIndex}
                        style={{ margin: '0.5em 0', marginTop: '2px' }}
                        autosize={{ minRows: 1, maxRows: 100 }}
                        name={index}
                        onChange={e => this.handleChangeSection(key, e)}
                        value={this.state.section[index][key]}
                      />
                    ))}
                  </div>
                );
              })}
              <AutoComplete
                dataSource={match}
                style={{ width: 200, marginTop: '1em' }}
                onSelect={this.handleAdd}
                onSearch={this.handleSearch}
                value={this.state.add}
                placeholder="入力/選択"
              />
              <Button style={{ marginLeft: '1em' }} onClick={this.handleNewAdd}>
                追加
              </Button>
              <br />
              {this.state.loading && <Loading inline />}
              {this.state.error && <p>{this.state.error}</p>}
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
          )}

          <div
            style={{
              width: this.state.viewOnly ? '90%' : '45vw'
            }}
            className="right"
          >
            <MarkdownArticle
              style={{ marginTop: '1em' }}
              section={this.state.section}
              image={this.state.image}
              title={this.state.title}
              lead={this.state.lead}
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
  }
  .right {
    margin: 0 0 0 0;
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
`;
