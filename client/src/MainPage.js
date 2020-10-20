import React from 'react';
import MainPageText from './MainPageText';
import NameBar from './NameBar';

class MainPage extends React.Component {
  
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