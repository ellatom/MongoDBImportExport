import React from 'react';
import history from './history';
import api from './api';

class NameBar extends React.Component {

  state={name:""}

  handleSubmit=async(e)=>
  {
    e.preventDefault();

    let response = await api.createUser(this.state.name);
    console.log(response);
    history.push('/qacards',this.state.name);
  }

  handleChange = (e) => {
    debugger;
    this.setState({[e.target.name]: e.target.value})
  }

  render() {
    console.log(this.state.name);
    return (
      <div>
          <form>
            <input type="text" id="name" name="name" placeholder="Enter your name" onChange={this.handleChange}/>
            <br/>
            <button className="submitName" onClick={this.handleSubmit} >Submit</button>
          </form>
      </div>
    );
  }
}

export default NameBar;