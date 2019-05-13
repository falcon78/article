import React, { Component } from 'react';
import ArticleCard from '../Content/modules/ArticleCard';
import { withFirebase } from '../Firebase/index';
import { withAuthorization } from '../Session/index';
import { compose } from 'recompose';
import Loading from './modules/loading';

const uuidv4 = require('uuid/v4');

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      initialLoad: true
    };
  }

  reference = this.props.firebase.db.collection('Private');

  getfirebase = async () => {
    let local = [];
    await this.reference
      .orderBy('createdOn', 'desc')
      .get()
      .then(snapshot => {
        snapshot.forEach(data => {
          local = local.concat(data);
        });
      })
      .catch(err => {
        console.log(err);
      });
    this.setState({
      data: local,
      initialLoad: false
    });
  };
  componentDidMount() {
    this.getfirebase();
  }

  render() {
    if (this.state.initialLoad) {
  return <Loading />;
    }
    return (
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {this.state.data.map(data => {
          return <ArticleCard key={uuidv4()} articledata={data} />;
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
