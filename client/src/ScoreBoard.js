import React from 'react';
import api from './api';//


class ScoreBoard extends React.Component {

  state={friendname:"",score:""};

  componentDidMount=async()=>
  {
    debugger;
    let y=this.props.location.state.friendname;
    let r=this.props.location.state.username;
    await api.getSummaryByUser(this.props.location.state.friendname,this.props.location.state.username);//
  }
  render() {
    return (
      <div>
          <p>PAGE UNDER CONSTRUCTION-This is scoreboard</p>
          {/* <p>{result}</p> */}
      </div>
    );
  }
}

export default ScoreBoard;