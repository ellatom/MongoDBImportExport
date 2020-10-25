import React from 'react';
import history from './history';
import api from './api';
import './namebar.css';

class NameBar extends React.Component {

  state={name:""}

  handleSubmit=async(e)=>
  {
    e.preventDefault();
    console.log(this.props.username);
    //if i have in url username....there is fasterway https://stackoverflow.com/questions/679915/how-do-i-test-for-an-empty-javascript-object
    if( Object.keys(this.props.username).length === 0){
     this.handleUserProfileFlow();
    }
    else{
      this.handleFriendFlow();
    }
  }

  handleUserProfileFlow=async()=>{
    debugger;
    console.log("user flow");
    let response = await api.createUser(this.state.name);
    console.log(response);
    history.push({ 
      pathname: '/qacards',
      state: { username: this.state.name,flow:'user'},
      forceRefresh:true
    });
    history.go();
  }
  handleFriendFlow=()=>
  {
    debugger;
    console.log("friend flow");

    history.push({ 
      pathname: '/qacards',
      state: { username: this.props.username.username,friendname:this.state.name,flow:'friend'},
      forceRefresh:true
    });
    history.go();
  }

  handleChange = (e) => {
    // debugger;
    this.setState({[e.target.name]: e.target.value})
  }

  render() {
    console.log(this.state.name);
    return (
      <div className="containerForm">
          <form className="form">
            <input type="text" id="name" name="name" placeholder="Enter your name" onChange={this.handleChange}/>
            <br/>
            <button className="submitName" onClick={this.handleSubmit} >Submit</button>
          </form>
      </div>
    );
  }
}

export default NameBar;