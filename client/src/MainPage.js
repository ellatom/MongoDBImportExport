import React from 'react';
import MainPageText from './MainPageText';
import NameBar from './NameBar';
import axios from 'axios';


class MainPage extends React.Component {

  constructor(props) {
    super(props);
    this.state = { usersCollection: [] };
}

componentDidMount() {
  axios.get('http://localhost:3030/quiz/results/1')
      .then(res => {
          this.setState({ usersCollection: res.data });
      })
      .catch(function (error) {
          console.log(error);
      })
  console.log(this.state.usersCollection)
}
  render() {
    return (
      <div>
          <MainPageText></MainPageText>
          <NameBar></NameBar>
      </div>
    );
  }
}

export default MainPage;