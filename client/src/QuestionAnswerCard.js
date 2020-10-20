import React from 'react';
import history from './history';

class QuestionAnswerCard extends React.Component {
    state={answer:""}

    handleSubmit=(event)=>
    {
      const value = event.target.value;
      const name = event.target.name;

      this.setState({[name]: value});
    }
    handleNext=(event)=>
    {
      history.push('/qacards/scoreboard');
    }

  render() {
    return (
      <div>
          <p>here will be a question</p>
          <button onClick={this.handleSubmit} style={{width:'200px',height:'200px'}}>Answer</button>
          <button onClick={this.handleSubmit} style={{width:'200px',height:'200px'}}>Answer</button>
          <br/>
          <button onClick={this.handleSubmit} style={{width:'200px',height:'200px'}}>Answer</button>
          <button onClick={this.handleSubmit} style={{width:'200px',height:'200px'}}>Answer</button>
          <br/>
          <button onClick={this.handleNext}>Submit all answers</button>
      </div>
    );
  }
}

export default QuestionAnswerCard;