import React from 'react';
import classnames from 'classnames';

export default function () {
  return (
    <header>
      <div className={classnames('header', 'header-space')}>
        <div className={classnames('header-navigation', 'column-12')}>
          <center>
            <h3 className={classnames('header-link')}>
              Survey
            </h3>
          </center>
        </div>
      </div>
    </header>
  )
}