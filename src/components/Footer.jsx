import React from 'react';
import classnames from 'classnames';

export default function () {
  return (
    <footer>
      <div className={classnames('footer', 'footer-fixed')}>
        <div className={classnames('column-12','copyright','text-center')}>
        dummy text copyright &copy;  
        </div>
      </div>
    </footer>
  )
}