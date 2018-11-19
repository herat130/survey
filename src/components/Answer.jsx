/* eslint-disable jsx-a11y/no-static-element-interactions */
import React from 'react';
import classnames from 'classnames';
import MultipleChoice from './MultipleChoice';
import InputAnswer from './InputAnswer';

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
    } else if (type === 'text' || type === 'number') {
      // considering multiline property true should be textarea option
      // considering multilie property false should be text option
      componentToBeRender = <InputAnswer
        type={!multiline ? 'text' : 'textarea'}
        fieldType={type}
        input={input}
        questionIndex={questionIndex}
        handleChangeOptions={this.props.handleChangeOptions}
      />;
    }
    return componentToBeRender;
  }

  renderCollapsibleHeader() {
    const { question, questionIndex, input, ansSubmitted, totalQuestions, nextIndex, choices } = this.props;
    return (
      <div
        onClick={() => this.props.handleCollapsible(questionIndex)}
        className={classnames('collapsable', 'hide', { show: ansSubmitted })}
      >
        <span className={classnames('column-5', 'question')}>
          {question}
        </span>
        <span className={classnames('column-5', 'answers')}>
          {(choices || []).length > 0 ? choices.filter(v => v.selected).map(v => v.label).join(',') : input}
        </span>
        <div className={classnames("dot", "bgBlue", 'column-2', { bgGreen: nextIndex > totalQuestions })} />
      </div>
    )
  }

  renderSubmitEdit() {
    const { questionIndex, ansSubmitted } = this.props;
    return (
      <button
        className={classnames('button', 'next')}
        onClick={(e) => this.props.goNext(e, questionIndex)}
      >
        <span>{ansSubmitted ? 'Edit' : 'Submit'} &gt;</span>
      </button >
    )
  }

  renderClear() {
    const { questionIndex } = this.props;
    return (
      <button
        className={classnames('button', 'clear-button')}
        onClick={(e) => this.props.clearCurrentAns(e, questionIndex)}
      >
        <span>Clear</span>
      </button >
    )
  }

  render() {
    const { question, questionIndex, ansError, ectiveQuestionIndex, clickedIndex } = this.props;
    const oddIndex = questionIndex % 2 !== 0;
    return (
      <div key={questionIndex} className={classnames({}, '')}>
        {this.renderCollapsibleHeader()}
        <div className="blank-space-10" />
        <div
          className={classnames("answer-container", 'hide', { odd: oddIndex }, { even: !oddIndex },
            { show: (clickedIndex === 0 || clickedIndex) ? questionIndex === clickedIndex : ectiveQuestionIndex === questionIndex })}>
          {ansError ? <div className="error-ans">{ansError}<div className="blank-space-10" /></div> : false}
          <h3>{question} </h3>
          {this.renderAnsComponent(questionIndex)}
          {this.renderSubmitEdit()}
          {this.renderClear()}
        </div>
      </div>
    );
  }
}