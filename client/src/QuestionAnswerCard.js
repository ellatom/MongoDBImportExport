import React from 'react';
import history from './history';
import api from './api';

class QuestionAnswerCard extends React.Component {
    state={answer:""}

    handleSubmit=async(event)=>
    {
      const value = event.target.value;
      const name = event.target.name;

      this.setState({[name]: value});

      const { username } = this.props.location;
      let response = await api.updateUser(username);
      console.log(response);
    }
    handleNext=(event)=>
    {
      history.push('/qacards/scoreboard');
    }

  render() {
    return (
      <div>
          <p>here will be a question</p>
          <button className="Q1" onClick={this.handleSubmit} style={{width:'200px',height:'200px'}}>A1</button>
          <button className="Q2" onClick={this.handleSubmit} style={{width:'200px',height:'200px'}}>A2</button>
          <br/>
          <button className="Q3" onClick={this.handleSubmit} style={{width:'200px',height:'200px'}}>A3</button>
          <button className="Q4" onClick={this.handleSubmit} style={{width:'200px',height:'200px'}}>A4</button>
          <br/>
          <button onClick={this.handleNext}>Submit all answers</button>
      </div>
    );
  }
}

export default QuestionAnswerCard;