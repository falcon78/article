import React, { Component } from 'react';
import { compose } from 'recompose';
import ArticleCard from './modules/ArticleCard';
import { withFirebase } from '../Firebase/index';
import { withAuthorization } from '../Session/index';
import Loading from './modules/loading';

const uuidv4 = require('uuid/v4');

class Home extends Component {
  constructor(props) {
    super(props);
    this.reference = props.firebase.db.collection('Private');
    this.state = {
      data: [],
      initialLoad: true
    };
  }

  componentDidMount() {
    this.getfirebase();
  }

  getfirebase = async () => {
    let local = [];
    await this.reference
      .orderBy('createdOn', 'desc')
      .get()
      .then(snapshot => {
        snapshot.forEach(data => {
          local = local.concat(data);
        });
      });

    this.setState({
      data: local,
      initialLoad: false
    });
  };

  render() {
    const { initialLoad, data } = this.state;
    if (initialLoad) {
      return <Loading />;
    }
    return (
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {data.map(articleData => {
          return <ArticleCard key={uuidv4()} articledata={articleData} />;
        })}
      </div>
    );
  }
}

const condition = authUser => !!authUser;
export default compose(
  withFirebase,
  withAuthorization(condition)
)(Home);
