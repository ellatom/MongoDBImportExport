import React from 'react';
import CardDetails from './CardDetails';
import './qacardlist.css'

class QACardsList extends React.Component {

    state = { qaList: [] }


    renderCardList = () => {

        if (!this.props.question)
            return;

        return this.props.question.answers.map((answer, index) => {
            return (
                    <div key={index}>
                    <CardDetails
                        key={index + 1}
                        keyQA={index + 1}
                        answer={answer}
                        onAnswer={this.props.onAnswer}>
                    </CardDetails>
                    </div>
            )
        });
    };

    render() {
        return (
            <div>
                <div className="question" >{this.props.question&&this.props.question.question}</div><br/>   
                <div className="card">{this.renderCardList()}</div>
            </div>
        )
    }
}

export default QACardsList;