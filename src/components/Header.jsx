import React from 'react';
import classnames from 'classnames';
import { Link } from 'react-router-dom';
import * as router from '../utils/survey.constant';

export default function () {
  return (
    <header>
      <div className={classnames('header', 'header-space')}>
        <div className={classnames('header-navigation', 'column-12')}>
          <center>
            <h3>
              <Link
                to={router.HOME_PAGE}
                className={classnames('header-link')}
              >
                Survey
          </Link>
            </h3>
          </center>
        </div>
      </div>
    </header>
  )
}