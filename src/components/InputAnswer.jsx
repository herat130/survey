import React from 'react';

export default class InputAnswer extends React.Component {

  renderInputField() {
    const { input } = this.props;
    return (
      <input
        key={'renderInput'}
        type='text'
        value={input}
        onChange={this.props.handleChangeOptions}
      />
    )
  }

  renderTextArea() {
    const { input } = this.props;
    return (
      <textarea
        key={'renderArea'}
        value={input}
        onChange={this.props.handleChangeOptions}
      />
    )
  }

  render() {
    const { type } = this.props;

    return type === 'text' ? this.renderInputField() : this.renderTextArea();
  }

}
