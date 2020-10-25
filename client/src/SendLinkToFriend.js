import React from 'react';


class SendLinkToFriend extends React.Component {


  render() {
    let username=this.props.location.state.username;
    let friendLink= `http://localhost:3000/friendqacards/${username}`;
    let checkScore= `http://localhost:3000/qacards/scoreboard/${username}`
    return (
      <div>
          <p>Send this link to a friend:</p>
          <p>{friendLink}</p>
          <p>Score of your friends can be found in the following link:(</p>
          <p>{checkScore}</p>
      </div>
    );
  }
}

export default SendLinkToFriend;
//:{this.props.match.params.id}