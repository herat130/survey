import React from 'react';
import classnames from 'classnames';

export default class MultipleChoice extends React.Component {

  renderOptions() {
    const { choices, type } = this.props;
    return (choices || []).map(v =>
      <React.Fragment key={v.label} >
        <div className={classnames('option-container', { 'active-container': v.selected })}>
          <input
            key={v.value}
            id={v.label}
            type={type}
            value={v.value}
            checked={v.selected}
            onChange={this.props.handleChangeOptions}
          />
          <label className="options" htmlFor={v.label}>{v.label}</label>
        </div>
        <div className='blank-space-10' />
      </React.Fragment>
    )
  }

  render() {
    return (
      <React.Fragment>
        {this.renderOptions()}
        <div className='blank-space-10' />
        <div className='blank-space-10' />
      </React.Fragment>
    );
  }
}