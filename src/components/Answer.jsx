/* eslint-disable jsx-a11y/no-static-element-interactions */
import React from 'react';
import classnames from 'classnames';
import MultipleChoice from './MultipleChoice';
import InputAnswer from './InputAnswer';
import checkInputAvailable from '../utils/common';

export default class Answer extends React.Component {

  renderAnsComponent(questionIndex) {
    const { type, multiple, multiline, choices, input } = this.props;
    let componentToBeRender;
    if (type === 'multiple-choice' && choices.length > 0) {
      // considering multiple property true should be checkbox option
      // considering multiple property false should be radio option
      componentToBeRender = <MultipleChoice
        handleChangeOptions={this.props.handleChangeOptions}
        questionIndex={questionIndex}
        type={!multiple ? 'radio' : 'checkbox'}
        choices={choices}
      />
    } else if (type === 'text') {
      // considering multiline property true should be textarea option
      // considering multilie property false should be text option
      componentToBeRender = <InputAnswer
        type={!multiline ? 'text' : 'textarea'}
        input={input}
        questionIndex={questionIndex}
        handleChangeOptions={this.props.handleChangeOptions}
      />;
    }
    return componentToBeRender;
  }

  render() {
    const { question, questionIndex, ansError, input, ectiveQuestionIndex, ansSubmitted, clickedIndex, totalQuestions, nextIndex } = this.props;
    const oddIndex = questionIndex % 2 !== 0;
    const answerComponent = this.renderAnsComponent(questionIndex);
    return (
      <div key={questionIndex} className={classnames({}, '')}>
        <div
          onClick={() => this.props.handleCollapsible(questionIndex)}
          className={classnames('collapsable', 'hide', { show: checkInputAvailable(input) && ansSubmitted })}
        >
          <span className={classnames('column-5')}>
            {question}
          </span>
          <span className={classnames('column-5', 'text-center')}>
            {input}
          </span>
          <div className={classnames("dot", "bgBlue", 'column-2', { bgGreen: nextIndex > totalQuestions })} />
        </div>
        <div
          className={classnames("answer-container", 'hide', { odd: oddIndex }, { even: !oddIndex },
            { show: (clickedIndex === 0 || clickedIndex) ? questionIndex === clickedIndex : ectiveQuestionIndex === questionIndex })}>
          {ansError ? <div className="error-ans">{ansError}<div className="blank-space-10" /></div> : false}
          <h3>{question} </h3>
          {answerComponent}
          <button
            className={classnames('button', 'next')}
            onClick={(e) => this.props.goNext(e, questionIndex)}
          >
            <span>{ansSubmitted ? 'Edit' : 'Submit'} &gt;</span>
          </button >
          <button
            className={classnames('button', 'clear-button')}
            onClick={(e) => this.props.clearCurrentAns(e, questionIndex)}
          >
            <span>Clear</span>
          </button >
        </div>
      </div>
    );
  }
}