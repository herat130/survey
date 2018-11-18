/* eslint-disable camelcase */
import React from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { Link } from 'react-router-dom';
import * as survey from '../actions/surey.action';
import Answer from './Answer';
import { VERIFY_SURVEY_FORM } from '../utils/survey.constant';
import ErrorBoundary from '../components/ErrorBoundary';

export class SurveyComponent extends React.Component {

  constructor(props) {
    super(props);
    this.handleChangeOptions = this.handleChangeOptions.bind(this);
    this.handleCollapsible = this.handleCollapsible.bind(this);
    this.goNext = this.goNext.bind(this);
    this.state = {
      choices: [],
      input: '',
      currentUpdate: null,
      ansError: null,
      clickedIndex: null,
    };
  }

  componentWillMount() {
    const { currentOptionIndex, quetions } = this.props;
    this.currentQuestion(quetions, currentOptionIndex);
  }

  componentWillReceiveProps(nextProps) {
    const { currentOptionIndex, quetions } = nextProps;
    this.currentQuestion(quetions, currentOptionIndex);
  }

  currentQuestion(quetions, currentOptionIndex) {
    const currentQuetion = quetions[currentOptionIndex] || {};
    this.setState({
      choices: currentQuetion.choices || [],
      input: currentQuetion.input || '',
    });
  }

  updateStateAfterChange({ updatedInput, choicesForUpdate }) {
    this.setState({
      currentUpdate: updatedInput,
      choices: choicesForUpdate,
    });
  }

  handleChangeOptions(e, questionIndex) {
    const updatedInput = e.target.value;
    const { quetions } = this.props;
    const currentQuetion = quetions[questionIndex] || {};
    const { question_type, multiple } = currentQuetion;
    const { choices } = currentQuetion;
    const selectCondition = (multiple === 'true');
    let choicesForUpdate = [];

    if (question_type === 'multiple-choice' && !selectCondition) {
      choicesForUpdate = choices.map(v => Object.assign({}, v,
        { selected: v.value === updatedInput }));
      this.updateStateAfterChange({ updatedInput, choicesForUpdate });
    } else if (question_type === 'multiple-choice' && selectCondition) {
      const index = choices.findIndex(v => v.value === updatedInput);
      const currentSelection = choices[index].selected;
      choices[index].selected = !currentSelection;
      choicesForUpdate = choices;
      this.updateStateAfterChange({ updatedInput, choices });
    } else if (question_type === 'text') {
      this.updateStateAfterChange({ updatedInput, choicesForUpdate: updatedInput });
    }
    this.props.updateAnswers(questionIndex, choicesForUpdate, updatedInput);
  }

  handleCollapsible(userClickedIndex) {
    const { clickedIndex } = this.state;
    this.setState({
      clickedIndex: userClickedIndex !== clickedIndex ? userClickedIndex : null,
    });
  }

  /**
   * Whenever we encounter required property in questions then always validate
   * current question's , answer is available or not
   * if not maintin the error state
   */
  validateQuetions() {
    const { currentOptionIndex, quetions } = this.props;
    const currentQuetion = quetions[currentOptionIndex] || {};
    const lastUserInput = currentQuetion.input;

    if (currentQuetion.required && !lastUserInput) {
      this.setState({
        ansError: 'Please Aswer the Current Quetion',
      });
      return false;
    }
    return true;
  }

  /**
   * while going to next always needs to check for the jumps
   * in case jumps available in current question then based on identifier choose the next question
   * else move to immediate next questions to maintain the sequence
   */
  goNext(e, questionIndex) {
    const { quetions } = this.props;
    const { choices, input, currentUpdate } = this.state;
    const currentQuetion = quetions[questionIndex];

    if (this.validateQuetions()) {
      if (currentQuetion.jumps.length > 0 && !!currentUpdate) {
        // check jump in case of answer exists
        const jumpIndex = (currentQuetion.jumps || [])
          .findIndex(v => v.conditions.find(iv => iv.value === currentUpdate))
        const jumpToIdentifier = currentQuetion.jumps[jumpIndex].destination.id;
        const nextQuetionIndex = quetions.findIndex(v => v.identifier === jumpToIdentifier);
        this.props.goToNextQuetion(nextQuetionIndex, choices, input);
      } else {
        this.props.goToNextQuetion((questionIndex + 1), choices, input);
      }

      this.setState({
        ansError: null,
        currentUpdate: null,
      });
    }
  }

  goPrevious() {
    const { currentOptionIndex } = this.props;
    this.props.goToPreviousQuetion(currentOptionIndex);
  }

  render() {
    const { currentOptionIndex, quetions, error, loading } = this.props;
    const { choices, input, ansError, clickedIndex } = this.state;
    const nextIndex = currentOptionIndex + 1;
    const totalQuestions = quetions.length;
    // const currentQuetion = quetions[currentOptionIndex] || {};
    // const type = currentQuetion.question_type;
    // const multiple = currentQuetion.multiple === 'true';
    // const multiline = currentQuetion.multiline === 'true';
    // const headline = currentQuetion.headline;

    if (loading) {
      return (
        <center>
          <p>Loading...</p>
        </center>
      )
    }

    if (error) {
      return (
        <center>
          <p>We are Facing Technical Issue... please try after some time</p>
        </center>
      )
    }

    if (totalQuestions === 0) {
      return (
        <center>
          <h3 className="no-data">There are no survey Available</h3>
        </center>
      )
    }

    return (
      <div className={classnames('landing', 'survey-container')}>
        <ErrorBoundary>
          <TransitionGroup>
            {quetions.map((quetion, index) =>
              <CSSTransition
                key={quetion.headline}
                timeout={500}
                classNames="fade"
              >
                <Answer
                  ansError={ansError}
                  question={quetion.headline}
                  questionIndex={index}
                  ectiveQuestionIndex={currentOptionIndex}
                  handleChangeOptions={this.handleChangeOptions}
                  type={quetion.question_type}
                  multiple={quetion.multiple}
                  multiline={quetion.multiline}
                  input={quetion.input}
                  choices={quetion.choices}
                  nextIndex={nextIndex}
                  totalQuestions={totalQuestions}
                  goNext={this.goNext}
                  ansSubmitted={quetion.submitted || false}
                  handleCollapsible={this.handleCollapsible}
                  clickedIndex={clickedIndex}
                />
              </CSSTransition>
            )}
          </TransitionGroup>
        </ErrorBoundary>
        <div className="survey-navigation">
          {/* <button
            disabled={currentOptionIndex === 0}
            className={classnames('button', 'previous')}
            onClick={() => this.goPrevious()}
          >
            <span className="return">&lt; Return</span>
          </button> */}

          {/* <button
            disabled={nextIndex === totalQuestions}
            className={classnames('button', 'next')}
            onClick={() => this.goNext()}
          >
            <span>Next &gt;</span>
          </button > */}
          <div className="blank-space-10" />
          <div className={classnames('button', 'hide', { show: nextIndex === totalQuestions })}>
            <Link
              className={classnames('submit')}
              to={VERIFY_SURVEY_FORM}
            >
              Verify & submit
         </Link>
          </div >
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    quetions: (state.surveyReducer.questionnaire || {}).questions || [],
    currentOptionIndex: state.surveyReducer.currentOptionIndex,
    error: state.surveyReducer.error,
    loading: state.surveyReducer.loading,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    goToNextQuetion: (index, choices, input) => {
      dispatch(survey.goToNextQuetion(index, choices, input))
    },
    goToPreviousQuetion: (currentIndex) => { dispatch(survey.goToPreviousQuetion(currentIndex)) },
    updateAnswers: (index, choices, input) => { dispatch(survey.updateAnswers(index, choices, input)) }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SurveyComponent);