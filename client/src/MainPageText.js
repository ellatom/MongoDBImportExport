import React from 'react';
import './mainpagetext.css';

class MainPageText extends React.Component {

  render() {
    return (
      <div className="quizContainer">
          <div className="quizInstruction">
            <ul>
              <h2>Quiz Game</h2>
              <h4>Instruction:</h4>
                <li>Insert your name</li>
                <li>Answer 5 questions about yourself to create a profile</li>
                <li>Share link will be created</li>
                <li>You can share this link with your friends</li>
                <li>Your friends will answer the questions</li>
                <li>You ccan find a link to summary result board </li>
            </ul>
          </div>
      </div>
    );
  }
}

export default MainPageText;