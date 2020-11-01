import React from 'react';
import history from './history';
import api from './api';
import QACardsList from './QACardsList';
import './questionanswercard.css'

class QuestionAnswerCard extends React.Component {

  state = { username: null, answer: "", pageIndex: 1, question: "", answers: [] }

  componentDidMount = async () => {
    console.log("Inside component did mount")
    this.showPage();
  }

  showPage = async (event) => {

    let qa =
      await api.getUserQuestion(this.props.location.state.username, this.state.pageIndex);

    this.setState({ question: qa });
  }

  onAnswer = async (answerIndex) => {

    this.setState(state => {
      state.answers.push(answerIndex);
      state.pageIndex++;
    },


      async () => {

        if (this.props.location.state.flow === 'user') {
          if (this.state.pageIndex > this.state.question.answers.length + 1)
            await this.saveUserProfile();
          else
            this.showPage(this.state.pageIndex);
        }

        if (this.props.location.state.flow === 'friend') {

          let a = await this.saveFriendProfile();

          this.showPage(this.state.pageIndex);


          if (this.state.pageIndex > this.state.question.answers.length+1) {

            history.push({
              pathname: `/qacards/scoreboard/${this.props.location.state.username}`,
              state: { usernamme: { uname: this.props.location.state.username, friendname: this.props.location.state.friendname } },
              forceRefresh: true
            });
          }
        }

      });
  }

  saveUserProfile = async () => {
    let userData = {
      "userName": this.state.username,
      "location": "Jerusalem",
      "questionAnswer": this.state.answers
    }

    await api.updateUserAnswer(this.props.location.state.username, userData);

    history.push({
      pathname: '/qacards/sendlinktofriend',
      state: { username: this.props.location.state.username },
      forceRefresh: true
    });
  }

  saveFriendProfile = async () => {
    let friendAnswer = this.state.answers[this.state.answers.length - 1];
    let userData = {
      "userName": this.props.location.state.username,
      "friendName": this.props.location.state.friendname,
      "questionId": this.state.question.id,
      "questionAnswer": friendAnswer
    }
    //update friend and return user answer
    let userAnswer =
      await api.updateFriendAnswerForUser(this.props.location.state.username, userData);

    // console.log(userAnswer + "update friend and return user answer")

  }
  handleSubmit = async (event) => {
    const value = event.target.value;
    const name = event.target.name;

    this.setState({ [name]: value });
    const { username } = this.props.location.state;
    console.log(username);
  }

  render() {

    return (
      <div className="cardqalist">
        <QACardsList key={this.state.pageIndex} question={this.state.question} onAnswer={this.onAnswer}></QACardsList>
        <br />
      </div>
    );
  }
}

export default QuestionAnswerCard;