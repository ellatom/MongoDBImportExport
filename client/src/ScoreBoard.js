import React from 'react';
import api from './api';
import './scoreboard.css'


class ScoreBoard extends React.Component {

  state = { friendname: "", score: "" };

  componentDidMount = async () => {
    debugger;
    let friend = this.props.location.state.usernamme.friendname;
    // let username=this.props.location.state.usernamme.uname;

    let result = await api.getSummaryByFriend(friend);
    this.setState({ score: result });
  }
  render() {
    return (
      <div>
        <div className="containerScoreBoard">
          <div className="scoreboard">
            <div>Scoreboard</div>
            <p>{this.state.score}</p>
          </div>
        </div>
      </div>
    );
  }
}

export default ScoreBoard;