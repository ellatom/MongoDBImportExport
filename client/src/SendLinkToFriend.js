import React from 'react';
import './sendlinktofriend.css'


class SendLinkToFriend extends React.Component {


  render() {
    let username = this.props.location.state.username;
    let friendLink = `http://localhost:3000/friendqacards/${username}`;
    let checkScore = `http://localhost:3000/qacards/scoreboard/${username}`
    return (
      <div>
        <div className="containersharelinks">
          <div className="sharelinks">
            <p>Share link with friend:</p>
            <a href={friendLink}>Share with Friend this link</a>
            <p>Score of your friends in this link:</p>
            <a href={checkScore}>Score Board with friends score</a>
          </div>
        </div>
      </div>
    );
  }
}

export default SendLinkToFriend;