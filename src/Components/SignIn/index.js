import React, { Component } from 'react';
import { Input, Button } from 'antd';
import styled from 'styled-components';
import { compose } from 'recompose';
import { withFirebase } from '../Firebase/index';
import { withRouter } from 'react-router-dom';
import * as ROUTES from '../../constants/routes';

class SignInForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      pass: '',
      error: ''
    };
  }
  componentDidMount() {
    //ログインしていない状態でデータを取得できるか試しています。（アクセス権限のテスト）
    let docref = this.props.firebase.db.collection('Articles').doc('testdoc');
    docref
      .get()
      .then(res => {
        console.log(res.data())
      })
      .catch(err => {
        console.log(err);
      });
  }
  onChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  handleSubmit = () => {
    this.props.firebase
      .doSignInWithEmailAndPassword(this.state.email, this.state.pass)
      .then(() => {
        this.setState({ email: '', pass: '', error: '' });
        this.props.history.push(ROUTES.LANDING);
      })
      .catch(error => {
        if (error.code === 'auth/invalid-email') {
          this.setState({
            error: 'メールアドレスが正しくありません'
          });
        } else if (error.code === 'auth/user-not-found') {
          this.setState({
            error: 'ユーザーが存在しません'
          });
        }
      });
  };
  render() {
    return (
      <Style>
        <form>
          <Input
            value={this.state.email}
            type="email"
            name="email"
            required
            placeholder={'メール'}
            onChange={this.onChange}
          />
          <Input
            value={this.state.pass}
            type="password"
            name="pass"
            required
            placeholder={'パスワード'}
            onChange={this.onChange}
          />
          {this.state.error && <p>{this.state.error}</p>}
          <Button onClick={this.handleSubmit} type="submit" htmlType={'button'}>
            Submit {this.state.name}
          </Button>
        </form>
      </Style>
    );
  }
}

const SignInPage = compose(
  withRouter,
  withFirebase
)(SignInForm);

export default SignInPage;

const Style = styled.div`
  padding-top: 8em;
  display: flex;
  justify-content: center;
  input {
    margin: 1em;
    width: 400px;
  }
  form {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  button {
    width: max-content;
    margin: 1em;
  }
  p {
    width: 400px;
    text-align: center;
  }
`;
