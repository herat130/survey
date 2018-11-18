import React from 'react';
import { Switch, Route, withRouter } from 'react-router-dom';
// eslint-disable-next-line import/extensions
import 'milligram';
import classnames from 'classnames';
import SurveyLanding from './SurveyLanding';
import SurveyComponent from './SurveyComponent';
import * as route from '../utils/survey.constant';
import Header from './Header';
import Footer from './Footer';
import VerifySurveyComponent from './VerifySurveyComponent';

class App extends React.Component {
  componentDidMount() {

  }
  render() {
    return (
      <div className={classnames('wrapper')}>
        <Header />
        <Switch>
          <Route exact path={route.HOME_PAGE} component={SurveyLanding} />
          <Route path={route.START_SURVEY_FORM} component={SurveyComponent} />
          <Route path={route.VERIFY_SURVEY_FORM} component={VerifySurveyComponent} />
          <Route path="*" component={SurveyLanding} />
        </Switch>
        <Footer />
      </div>
    )
  }
}

export default withRouter(App);