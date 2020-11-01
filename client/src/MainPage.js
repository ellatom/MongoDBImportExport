import React from 'react';
import MainPageText from './MainPageText';
import NameBar from './NameBar';
import './mainpage.css'

class MainPage extends React.Component {
  
  render() {
    // debugger;
    return (
      <div>
          <MainPageText></MainPageText>
          <NameBar username={this.props.match.params}></NameBar>
      </div>
    );
  }
}

export default MainPage;