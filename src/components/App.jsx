import React from 'react';
// eslint-disable-next-line import/extensions
import 'milligram';
import classnames from 'classnames';
import SurveyComponent from './SurveyComponent';
import Header from './Header';
import Footer from './Footer';

class App extends React.Component {
  componentDidMount() {

  }
  render() {
    return (
      <div className={classnames('wrapper')}>
        <Header />
        <SurveyComponent />
        <Footer />
      </div>
    )
  }
}

export default App;