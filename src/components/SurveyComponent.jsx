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
    this.clearCurrentAns = this.clearCurrentAns.bind(this);
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

  componentDidMount() {
    const { loading } = this.props;
    if (loading) {
      this.props.surveyFetch()
    }
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

  clearCurrentAns(event, clearIndex) {
    this.props.clearCurrentAns(clearIndex);
    event.preventDefault();
  }

  /**
   * Whenever we encounter required property in questions then always validate
   * current question's , answer is available or not
   * if not maintin the error state
   */
  validateQuetions(questionIndex) {
    const { quetions } = this.props;
    const currentQuetion = quetions[questionIndex] || {};
    const { input: lastUserInput, required, validation, question_type } = currentQuetion;
    let message = null;

    if (required) {

      if (question_type === 'text') {
        const { min, max } = validation || {};
        const validateInputLength = ((lastUserInput || "").trim()).length;
        if(validateInputLength === 0){
          message = `Mandatory question`;
        }
        if (min && validateInputLength < min) {
          message = `Required Input length must atleast ${min}`;
        }
        if (max && validateInputLength > max) {
          message = `Required Input length must atmost ${max}`;
        }
        if ((min && max) && (validateInputLength < min || validateInputLength > max)) {
          message = `Required Input length must be in between ${min} & ${max}`;
        }
      } else if (question_type === 'multiple-choice' && !lastUserInput) {
        message = 'Please Aswer the Current Quetion';
      }
    }
    this.props.updateErrorMessage(questionIndex, message);
    return !message;
  }

  /**
   * while going to next always needs to check for the jumps
   * in case jumps available in current question then based on identifier choose the next question
   * else move to immediate next questions to maintain the sequence
   */
  goNext(e, questionIndex) {
    const { quetions, currentOptionIndex } = this.props;
    const { choices, input, currentUpdate } = this.state;
    const currentQuetion = quetions[questionIndex] || {};
    let nextIndex = questionIndex + 1;
    let type;

    /** in case of edit and submit */
    if (currentQuetion.submitted) {
      this.setState({
        clickedIndex: null,
      })
      type = 'edit';
      nextIndex = currentOptionIndex;
    }

    if (this.validateQuetions(questionIndex)) {
      if (currentQuetion.jumps.length > 0 && !!currentUpdate) {
        // check jump in case of answer exists
        const jumpIndex = (currentQuetion.jumps || [])
          .findIndex(v => v.conditions.find(iv => iv.value === currentUpdate))
        const jumpToIdentifier = currentQuetion.jumps[jumpIndex].destination.id;
        nextIndex = quetions.findIndex(v => v.identifier === jumpToIdentifier);
      }

      this.props.goToNextQuetion(nextIndex, choices, input, type);

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
    const { clickedIndex } = this.state;
    const nextIndex = currentOptionIndex + 1;
    const totalQuestions = quetions.length;

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
                  ansError={quetion.error}
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
                  clearCurrentAns={this.clearCurrentAns}
                />
              </CSSTransition>
            )}
          </TransitionGroup>
        </ErrorBoundary>
        <div className="survey-navigation">
          <div className="blank-space-10" />
          <div className={classnames('button', 'hide', { show: nextIndex > totalQuestions })}>
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
    goToNextQuetion: (index, choices, input, type) => {
      dispatch(survey.goToNextQuetion(index, choices, input, type))
    },
    surveyFetch: () => survey.surveyFetch().then(action => dispatch(action)),
    clearCurrentAns: (indexToClear) => dispatch(survey.clearCurrentAns(indexToClear)),
    goToPreviousQuetion: (currentIndex) => { dispatch(survey.goToPreviousQuetion(currentIndex)) },
    updateAnswers: (index, choices, input) => { dispatch(survey.updateAnswers(index, choices, input)) },
    updateErrorMessage: (index, errorMessage) => { dispatch(survey.updateErrorMessage(index, errorMessage)) }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SurveyComponent);