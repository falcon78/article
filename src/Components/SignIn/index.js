import React, { Component } from 'react';
import { Input, Button } from 'antd';
import styled from 'styled-components';
import { compose } from 'recompose';
import { withRouter } from 'react-router-dom';
import { withFirebase } from '../Firebase/index';
import * as ROUTES from '../../constants/routes';

class SignInForm extends Component {
  constructor({ firebase, history }) {
    super({ firebase, history });
    this.firebase = firebase;
    this.history = history;
    this.state = {
      email: '',
      pass: '',
      error: ''
    };
  }

  componentDidMount() {
    this.firebase.db
      .collection('article')
      .doc('article_2016_06')
      .get()
      .then(data => {
        console.log(data);
      });
    this.firebase.db
      .collection('Private')
      .add({
        test: 'test'
      })
      .then(() => {
        console.log('SUCCESS');
      })
      .catch(err => {
        console.log('write err', err);
      });

    this.firebase.db
      .collection('Published')
      .add({
        test: 'test'
      })
      .then(() => {
        console.log('SUCCESS');
      })
      .catch(err => {
        console.log('write err', err);
      });
  }

  onChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  handleSubmit = () => {
    const { email, pass } = this.state;
    this.firebase
      .doSignInWithEmailAndPassword(email, pass)
      .then(() => {
        this.setState({ email: '', pass: '', error: '' });
        this.history.push(ROUTES.LANDING);
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
    const { email, pass, error, name } = this.state;
    return (
      <Style>
        <form>
          <Input
            value={email}
            type="email"
            name="email"
            required
            placeholder="メール"
            onChange={this.onChange}
          />
          <Input
            value={pass}
            type="password"
            name="pass"
            required
            placeholder="パスワード"
            onChange={this.onChange}
          />
          {error && <p>{error}</p>}
          <Button onClick={this.handleSubmit} type="submit" htmlType="button">
            Submit {name}
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
    width: 80vw;
    margin: 1em;
    max-width: 400px;
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
    width: 80vw;
    max-width: 400px;
    text-align: center;
  }
`;
