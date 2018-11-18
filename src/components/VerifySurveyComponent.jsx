import React from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';
import { withRouter } from 'react-router-dom';
import * as routes from '../utils/survey.constant';
import * as actions from '../actions/surey.action';

class VerifySurveyComponent extends React.Component {

  constructor(props) {
    super(props);
    this.submitForm = this.submitForm.bind(this);
  }

  submitForm(e) {
    const { history } = this.props;
    e.preventDefault();
    this.props.submitForm();
    history.push(routes.HOME_PAGE);
  }

  clearStore() {
    this.props.clearStore();
  }
  renderQuestionAnswer() {
    const { survey } = this.props;
    const { questions } = survey;

    return (questions || []).filter(v => !!v.input).map(v => {
      const displayRes = v.multiple ?
        ((v.choices || []).filter(c => c.selected) || []).map(val => val.label).join(' , ')
        : v.input;
      return (<React.Fragment key={v.identifier}>
        <div className={classnames('qtn-ans')}>
          <span className={classnames('questions')}>{v.headline}</span><br />
          <span className={classnames('answer')}>&gt; {displayRes}</span>
        </div>
        <div className='blank-space-10' />
      </React.Fragment>)
    })
  }

  render() {
    return (
      <div>
        <div className={classnames("landing", "verify-container")}>
          <h3>Survey Details</h3>
          {this.renderQuestionAnswer()}
        </div>
        <div className="column-12">
          <div className="column-4" />
          <button
            to={routes.HOME_PAGE}
            className={classnames('button', 'column-4')}
            onClick={this.submitForm}
          >
            Submit
      </button>
        </div>
      </div>
    )
  }

}

function mapStateToProps(state) {
  return {
    survey: state.surveyReducer.questionnaire,
  };
}

function mapStateToDispatch(dispatch) {
  return {
    clearStore: () => { dispatch(actions.clearStore()) },
    submitForm: () => { dispatch(actions.submitForm()) }
  }
}

export const ConnectedVerifyComponent = connect(mapStateToProps, mapStateToDispatch)(VerifySurveyComponent);
export default withRouter(ConnectedVerifyComponent);