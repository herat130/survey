/* eslint-disable camelcase */
import React from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';
import * as survey from '../actions/surey.action';
import Answer from './Answer';
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
      this.props.surveyFetch();
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
    const selectCondition = (multiple === true);
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
    this.props.setCurrentIndex(userClickedIndex);
  }

  submitForm(e) {
    this.props.submitForm();
    this.props.surveyFetch();
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

      if (question_type === 'text' || question_type === 'number') {
        const { min, max } = validation || {};
        const validateInputLength = ((lastUserInput || "").trim()).length;

        if (validateInputLength === 0) {
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
      }
      if (question_type === 'multiple-choice' && !lastUserInput) {
        message = 'Please Aswer the Current Quetion';
      }
    }
    return message;
  }

  /**
   * while going to next always needs to check for the jumps
   * in case jumps available in current question then based on identifier choose the next question
   * else move to immediate next questions to maintain the sequence
   */
  goNext(e, questionIndex) {
    const { quetions, userTravrseQuetions } = this.props;
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
      nextIndex = userTravrseQuetions[userTravrseQuetions.length - 1];
    }
    const message = this.validateQuetions(questionIndex);
    this.props.updateErrorMessage(questionIndex, message);
    if (!message) {
      if (currentQuetion.jumps.length > 0 && !!currentUpdate) {
        // check jump in case of answer exists
        const jumpIndex = (currentQuetion.jumps || [])
          .findIndex(v => v.conditions.find(iv => iv.value === currentUpdate))
        const jumpToIdentifier = currentQuetion.jumps[jumpIndex].destination.id;
        nextIndex = quetions.findIndex(v => v.identifier === jumpToIdentifier);
      }
      this.props.goToNextQuetion(nextIndex, choices, input, type);
      this.setState({
        currentUpdate: null,
      });
    }
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
          {quetions.map((quetion, index) =>
            <Answer
              key={quetion.identifier}
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
          )}
        </ErrorBoundary>
        <div className="survey-navigation">
          <div className="blank-space-10" />
          <div className={classnames('hide', { show: nextIndex > totalQuestions })}>
            <button
              className={classnames('submit')}
              onClick={() => this.submitForm()}
            >
              submit & clear
         </button>
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
    userTravrseQuetions: state.surveyReducer.userTravrseQuetions || [],
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
    updateAnswers: (index, choices, input) => { dispatch(survey.updateAnswers(index, choices, input)) },
    updateErrorMessage: (index, errorMessage) => { dispatch(survey.updateErrorMessage(index, errorMessage)) },
    submitForm: () => { dispatch(survey.submitForm()) },
    setCurrentIndex: (index) => { dispatch(survey.setCurrentIndex(index)) }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SurveyComponent);