import React from 'react';
import {  Router,Route,Switch} from 'react-router-dom';
import MainPage from './MainPage';
import QuestionAnswerCard from './QuestionAnswerCard';
import history from './history';
import ScoreBoard from './ScoreBoard';
import SendLinkToFriend from './SendLinkToFriend';

const App = () => {
  
  return (
    <div>
      <Router history={history}>
        <div>
          <Switch>
            <Route exact path="/"  component={MainPage} />
            <Route exact path="/qacards"  component={QuestionAnswerCard} />
            <Route exact path="/qacards/sendlinktofriend"  component={SendLinkToFriend} />
            <Route exact path="/friendqacards/:username"  component={MainPage} />
            <Route exact path="/qacards/scoreboard/:username"  component={ScoreBoard} />
          </Switch>
          </div>
      </Router>
    </div>
  );
};

export default App;
